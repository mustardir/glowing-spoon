import Anthropic from "@anthropic-ai/sdk";
import { db } from "./db";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * System prompt for the financial advisor Claude AI
 */
const FINANCIAL_ADVISOR_SYSTEM = `You are a knowledgeable financial advisor AI assistant for Fortress Fund investment platform. 
You help users understand their investment portfolios, provide financial insights, and offer investment recommendations based on their data.

Key guidelines:
- Be professional, clear, and concise
- Focus on financial concepts and investment strategies
- Always include important disclaimers about investment advice
- Ask clarifying questions if you need more context
- Provide actionable insights based on user data
- Consider risk tolerance and investment goals

Remember: You are an AI assistant providing educational and informational support, not a licensed financial advisor.`;

/**
 * Get portfolio summary for AI context
 * Summarizes user portfolio data to send to Claude (not raw data)
 */
export async function getPortfolioSummaryForAI(userId: string): Promise<string> {
  try {
    const portfolios = await db.portfolio.findMany({
      where: { userId },
      include: {
        assets: {
          select: {
            symbol: true,
            name: true,
            quantity: true,
            currentPrice: true,
            totalValue: true,
            totalGainPct: true,
          },
        },
        transactions: {
          take: 10,
          orderBy: { createdAt: "desc" },
          select: {
            type: true,
            amount: true,
            createdAt: true,
          },
        },
      },
    });

    if (portfolios.length === 0) {
      return "User has no portfolios yet.";
    }

    let summary = "User Portfolio Summary:\n";
    portfolios.forEach((portfolio, idx) => {
      summary += `\nPortfolio ${idx + 1}: ${portfolio.name}\n`;
      summary += `- Total Value: $${portfolio.totalValue.toString()}\n`;
      summary += `- Total Gain: $${portfolio.totalGain.toString()} (${portfolio.totalGainPct.toString()}%)\n`;
      summary += `- Cash Balance: $${portfolio.cashBalance.toString()}\n`;

      if (portfolio.assets.length > 0) {
        summary += "- Holdings:\n";
        portfolio.assets.forEach((asset) => {
          summary += `  - ${asset.symbol} (${asset.name}): ${asset.quantity.toString()} shares @ $${asset.currentPrice.toString()} = $${asset.totalValue.toString()} (${asset.totalGainPct.toString()}%)\n`;
        });
      }

      if (portfolio.transactions.length > 0) {
        summary += "- Recent Transactions:\n";
        portfolio.transactions.forEach((tx) => {
          summary += `  - ${tx.type}: $${tx.amount.toString()} on ${tx.createdAt.toLocaleDateString()}\n`;
        });
      }
    });

    return summary;
  } catch (error) {
    console.error("Error getting portfolio summary:", error);
    return "Unable to retrieve portfolio summary at this time.";
  }
}

/**
 * Send a message to Claude and get a response
 * Stores conversation history in the database
 */
export async function sendAiMessage(
  userId: string,
  conversationId: string,
  userMessage: string
): Promise<string> {
  try {
    // Get portfolio summary for context
    const portfolioSummary = await getPortfolioSummaryForAI(userId);

    // Get recent message history
    const recentMessages = await db.aiMessage.findMany({
      where: { conversation: { userId } },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Build message history for Claude
    const messages = recentMessages
      .reverse()
      .map((msg) => ({
        role: msg.role.toLowerCase() as "user" | "assistant",
        content: msg.content,
      }));

    // Add current user message
    messages.push({
      role: "user" as const,
      content: userMessage,
    });

    // Prepare system prompt with portfolio context
    const systemPrompt = `${FINANCIAL_ADVISOR_SYSTEM}\n\n${portfolioSummary}`;

    // Call Claude API
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    });

    const assistantMessage =
      response.content[0].type === "text"
        ? response.content[0].text
        : "Unable to process response";

    // Store messages in database
    await db.aiMessage.create({
      data: {
        conversationId,
        role: "USER",
        content: userMessage,
      },
    });

    await db.aiMessage.create({
      data: {
        conversationId,
        role: "ASSISTANT",
        content: assistantMessage,
      },
    });

    return assistantMessage;
  } catch (error) {
    console.error("Error sending AI message:", error);
    throw error;
  }
}

/**
 * Stream a message from Claude
 * Useful for real-time chat UX
 */
export async function streamAiMessage(
  userId: string,
  conversationId: string,
  userMessage: string
) {
  try {
    // Get portfolio summary for context
    const portfolioSummary = await getPortfolioSummaryForAI(userId);

    // Get recent message history
    const recentMessages = await db.aiMessage.findMany({
      where: { conversation: { userId } },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Build message history for Claude
    const messages = recentMessages
      .reverse()
      .map((msg) => ({
        role: msg.role.toLowerCase() as "user" | "assistant",
        content: msg.content,
      }));

    // Add current user message
    messages.push({
      role: "user" as const,
      content: userMessage,
    });

    // Prepare system prompt with portfolio context
    const systemPrompt = `${FINANCIAL_ADVISOR_SYSTEM}\n\n${portfolioSummary}`;

    // Store user message
    await db.aiMessage.create({
      data: {
        conversationId,
        role: "USER",
        content: userMessage,
      },
    });

    // Call Claude API with streaming
    return anthropic.messages.stream({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    });
  } catch (error) {
    console.error("Error streaming AI message:", error);
    throw error;
  }
}

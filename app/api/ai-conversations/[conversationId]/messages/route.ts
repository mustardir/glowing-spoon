import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { aiMessageSchema } from "@/lib/validators";
import { sendAiMessage } from "@/lib/ai";
import { withErrorHandling } from "@/lib/api-utils";
import { NextRequest } from "next/server";

/**
 * GET /api/ai-conversations/[conversationId]/messages
 * Get all messages in a conversation
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  return withErrorHandling(async () => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Verify conversation ownership
    const conversation = await db.aiConversation.findUnique({
      where: { id: params.conversationId },
      select: { userId: true },
    });

    if (!conversation || conversation.userId !== session.user.id) {
      throw new Error("Forbidden");
    }

    const messages = await db.aiMessage.findMany({
      where: { conversationId: params.conversationId },
      orderBy: { createdAt: "asc" },
    });

    return messages;
  });
}

/**
 * POST /api/ai-conversations/[conversationId]/messages
 * Send a message and get AI response
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  return withErrorHandling(
    async () => {
      const session = await auth();
      if (!session?.user?.id) {
        throw new Error("Unauthorized");
      }

      // Verify conversation ownership
      const conversation = await db.aiConversation.findUnique({
        where: { id: params.conversationId },
        select: { userId: true },
      });

      if (!conversation || conversation.userId !== session.user.id) {
        throw new Error("Forbidden");
      }

      const body = await request.json();
      const validated = aiMessageSchema.parse(body);

      // Send message and get response
      const response = await sendAiMessage(
        session.user.id,
        params.conversationId,
        validated.content
      );

      return { response };
    },
    201
  );
}

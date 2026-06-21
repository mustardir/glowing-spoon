import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { aiMessageSchema } from "@/lib/validators";
import { sendAiMessage, streamAiMessage } from "@/lib/ai";
import { withErrorHandling } from "@/lib/api-utils";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/ai-conversations
 * Get all conversations for the current user
 */
export async function GET(request: NextRequest) {
  return withErrorHandling(async () => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const conversations = await db.aiConversation.findMany({
      where: { userId: session.user.id },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return conversations;
  });
}

/**
 * POST /api/ai-conversations
 * Create a new conversation
 */
export async function POST(request: NextRequest) {
  return withErrorHandling(
    async () => {
      const session = await auth();
      if (!session?.user?.id) {
        throw new Error("Unauthorized");
      }

      const conversation = await db.aiConversation.create({
        data: {
          userId: session.user.id,
        },
      });

      return conversation;
    },
    201
  );
}

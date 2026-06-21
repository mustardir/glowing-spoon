import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { transactionSchema } from "@/lib/validators";
import { withErrorHandling } from "@/lib/api-utils";
import { NextRequest } from "next/server";

/**
 * GET /api/transactions
 * Get all transactions for the current user
 */
export async function GET(request: NextRequest) {
  return withErrorHandling(async () => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const searchParams = request.nextUrl.searchParams;
    const portfolioId = searchParams.get("portfolioId");

    const where: any = { userId: session.user.id };
    if (portfolioId) {
      where.portfolioId = portfolioId;
    }

    const transactions = await db.transaction.findMany({
      where,
      include: {
        asset: {
          select: { symbol: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return transactions;
  });
}

/**
 * POST /api/transactions
 * Create a new transaction
 */
export async function POST(request: NextRequest) {
  return withErrorHandling(
    async () => {
      const session = await auth();
      if (!session?.user?.id) {
        throw new Error("Unauthorized");
      }

      const body = await request.json();
      const validated = transactionSchema.parse(body);

      // Verify portfolio ownership
      const portfolio = await db.portfolio.findUnique({
        where: { id: body.portfolioId },
        select: { userId: true },
      });

      if (!portfolio || portfolio.userId !== session.user.id) {
        throw new Error("Forbidden");
      }

      // Create transaction
      const transaction = await db.transaction.create({
        data: {
          userId: session.user.id,
          portfolioId: body.portfolioId,
          ...validated,
        },
        include: {
          asset: true,
        },
      });

      return transaction;
    },
    201
  );
}

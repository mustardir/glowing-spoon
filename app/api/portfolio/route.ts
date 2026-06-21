import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { portfolioSchema } from "@/lib/validators";
import { apiError, apiSuccess, withErrorHandling } from "@/lib/api-utils";
import { NextRequest } from "next/server";

/**
 * GET /api/portfolio
 * Get all portfolios for the current user
 */
export async function GET(request: NextRequest) {
  return withErrorHandling(async () => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const portfolios = await db.portfolio.findMany({
      where: { userId: session.user.id },
      include: {
        assets: true,
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return portfolios;
  });
}

/**
 * POST /api/portfolio
 * Create a new portfolio
 */
export async function POST(request: NextRequest) {
  return withErrorHandling(
    async () => {
      const session = await auth();
      if (!session?.user?.id) {
        throw new Error("Unauthorized");
      }

      const body = await request.json();
      const validated = portfolioSchema.parse(body);

      const portfolio = await db.portfolio.create({
        data: {
          userId: session.user.id,
          ...validated,
        },
        include: {
          assets: true,
        },
      });

      return portfolio;
    },
    201
  );
}

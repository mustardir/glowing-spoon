import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { portfolioSchema } from "@/lib/validators";
import { withErrorHandling } from "@/lib/api-utils";
import { NextRequest } from "next/server";

/**
 * GET /api/portfolio/[portfolioId]
 * Get a specific portfolio with all its assets
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { portfolioId: string } }
) {
  return withErrorHandling(async () => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const portfolio = await db.portfolio.findUnique({
      where: { id: params.portfolioId },
      include: {
        assets: {
          orderBy: { createdAt: "desc" },
        },
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!portfolio) {
      throw new Error("Portfolio not found");
    }

    // Check ownership
    if (portfolio.userId !== session.user.id) {
      throw new Error("Forbidden");
    }

    return portfolio;
  });
}

/**
 * PATCH /api/portfolio/[portfolioId]
 * Update a portfolio
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { portfolioId: string } }
) {
  return withErrorHandling(async () => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Check ownership
    const portfolio = await db.portfolio.findUnique({
      where: { id: params.portfolioId },
      select: { userId: true },
    });

    if (!portfolio || portfolio.userId !== session.user.id) {
      throw new Error("Forbidden");
    }

    const body = await request.json();
    const validated = portfolioSchema.parse(body);

    const updated = await db.portfolio.update({
      where: { id: params.portfolioId },
      data: validated,
      include: { assets: true },
    });

    return updated;
  });
}

/**
 * DELETE /api/portfolio/[portfolioId]
 * Delete a portfolio
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { portfolioId: string } }
) {
  return withErrorHandling(async () => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Check ownership
    const portfolio = await db.portfolio.findUnique({
      where: { id: params.portfolioId },
      select: { userId: true },
    });

    if (!portfolio || portfolio.userId !== session.user.id) {
      throw new Error("Forbidden");
    }

    await db.portfolio.delete({
      where: { id: params.portfolioId },
    });

    return { message: "Portfolio deleted" };
  });
}

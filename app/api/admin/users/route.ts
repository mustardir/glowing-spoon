import { auth, isUserAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { withErrorHandling } from "@/lib/api-utils";
import { NextRequest } from "next/server";

/**
 * GET /api/admin/users
 * Get all users (admin only)
 */
export async function GET(request: NextRequest) {
  return withErrorHandling(async () => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      throw new Error("Forbidden");
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: { portfolios: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return users;
  });
}

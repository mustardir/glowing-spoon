import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userProfileSchema } from "@/lib/validators";
import { withErrorHandling } from "@/lib/api-utils";
import { NextRequest } from "next/server";

/**
 * GET /api/user/profile
 * Get current user profile
 */
export async function GET(request: NextRequest) {
  return withErrorHandling(async () => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  });
}

/**
 * PATCH /api/user/profile
 * Update current user profile
 */
export async function PATCH(request: NextRequest) {
  return withErrorHandling(async () => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const body = await request.json();
    const validated = userProfileSchema.parse(body);

    const updated = await db.user.update({
      where: { id: session.user.id },
      data: validated,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        role: true,
      },
    });

    return updated;
  });
}

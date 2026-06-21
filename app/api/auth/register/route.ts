import { hash } from "bcrypt";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validators";
import { apiError, apiSuccess, withErrorHandling } from "@/lib/api-utils";
import { NextRequest } from "next/server";

/**
 * POST /api/auth/register
 * Register a new user account
 */
export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const body = await request.json();

    // Validate input
    const validated = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await hash(validated.password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        email: validated.email,
        name: validated.name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return user;
  }, 201);
}

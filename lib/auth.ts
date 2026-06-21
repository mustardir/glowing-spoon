import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { z } from "zod";
import { db } from "./db";

/**
 * Zod schema for login credentials validation
 */
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginInput = z.infer<typeof loginSchema>;

/**
 * NextAuth configuration for JWT-based authentication
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate input
        const validated = loginSchema.safeParse(credentials);
        if (!validated.success) {
          return null;
        }

        const { email, password } = validated.data;

        try {
          // Find user by email
          const user = await db.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true,
            },
          });

          if (!user) {
            return null;
          }

          // Verify password
          const isPasswordValid = await compare(password, user.password);
          if (!isPasswordValid) {
            return null;
          }

          // Update last login
          await db.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });

          // Return user object for JWT
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Get the current user session
 * Returns null if user is not authenticated
 */
export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

/**
 * Check if user is admin
 */
export async function isUserAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "ADMIN" ?? false;
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

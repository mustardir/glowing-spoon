"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { loginSchema } from "@/lib/validators";
import { z } from "zod";

/**
 * Login page
 * Allows users to authenticate with email and password
 */
export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /**
   * Handle form input changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate input
      loginSchema.parse(formData);

      // Sign in with NextAuth
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (!result?.ok) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("An error occurred. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-slate p-4 md:p-0">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-500 mb-2">Fortress Fund</h1>
          <p className="text-slate-400 text-sm md:text-base">AI-Powered Investment Platform</p>
        </div>

        {/* Login Card */}
        <div className="card">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Sign In</h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs md:text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-xs md:text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input text-sm md:text-base"
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs md:text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="input text-sm md:text-base"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2 md:py-3 mt-4 md:mt-6 text-sm md:text-base disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-slate-400 text-xs md:text-sm mt-4 md:mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-emerald-500 hover:text-emerald-400 font-medium">
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs md:text-sm mt-6 md:mt-8">
          © 2026 Fortress Fund. All rights reserved.
        </p>
      </div>
    </div>
  );
}

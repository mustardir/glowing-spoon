import { NextResponse } from "next/server";

/**
 * Standardized API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Return a successful API response
 */
export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { success: true, data },
    { status }
  );
}

/**
 * Return an error API response
 */
export function apiError(message: string, status = 400): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

/**
 * Wrapper for API route handlers with error handling
 */
export async function withErrorHandling<T>(
  handler: () => Promise<T>,
  status = 200
): Promise<NextResponse<ApiResponse<T> | ApiResponse>> {
  try {
    const data = await handler();
    return apiSuccess(data, status);
  } catch (error) {
    console.error("API error:", error);
    const message = error instanceof Error ? error.message : "An error occurred";
    return apiError(message, 500);
  }
}

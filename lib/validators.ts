import { z } from "zod";

/**
 * User registration validation schema
 */
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * User login validation schema
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Portfolio creation/update schema
 */
export const portfolioSchema = z.object({
  name: z.string().min(1, "Portfolio name is required").max(100),
  description: z.string().max(500).optional(),
});

export type PortfolioInput = z.infer<typeof portfolioSchema>;

/**
 * Transaction creation schema
 */
export const transactionSchema = z.object({
  type: z.enum(["BUY", "SELL", "DEPOSIT", "WITHDRAWAL", "DIVIDEND", "INTEREST", "FEE"]),
  assetId: z.string().optional(),
  quantity: z.coerce.number().positive().optional(),
  price: z.coerce.number().positive().optional(),
  amount: z.coerce.number().positive("Amount must be positive"),
  fees: z.coerce.number().nonnegative().optional().default(0),
  notes: z.string().max(500).optional(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;

/**
 * Asset creation/update schema
 */
export const assetSchema = z.object({
  symbol: z.string().min(1, "Symbol is required").max(20),
  name: z.string().min(1, "Asset name is required").max(100),
  assetType: z.enum(["STOCK", "ETF", "CRYPTO", "BOND", "MUTUAL_FUND", "COMMODITY", "OTHER"]),
});

export type AssetInput = z.infer<typeof assetSchema>;

/**
 * AI message schema
 */
export const aiMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(4000),
});

export type AiMessageInput = z.infer<typeof aiMessageSchema>;

/**
 * User profile update schema
 */
export const userProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;

import { describe, it, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
  portfolioSchema,
  transactionSchema,
  aiMessageSchema,
} from "./validators";
import { z } from "zod";

/**
 * Test suite for Zod validation schemas
 */
describe("Validation schemas", () => {
  describe("registerSchema", () => {
    it("should validate correct registration data", () => {
      const data = {
        email: "test@example.com",
        name: "John Doe",
        password: "password123",
        confirmPassword: "password123",
      };

      expect(() => registerSchema.parse(data)).not.toThrow();
    });

    it("should reject invalid email", () => {
      const data = {
        email: "invalid-email",
        name: "John Doe",
        password: "password123",
        confirmPassword: "password123",
      };

      expect(() => registerSchema.parse(data)).toThrow(z.ZodError);
    });

    it("should reject mismatched passwords", () => {
      const data = {
        email: "test@example.com",
        name: "John Doe",
        password: "password123",
        confirmPassword: "password456",
      };

      expect(() => registerSchema.parse(data)).toThrow(z.ZodError);
    });

    it("should reject short name", () => {
      const data = {
        email: "test@example.com",
        name: "J",
        password: "password123",
        confirmPassword: "password123",
      };

      expect(() => registerSchema.parse(data)).toThrow(z.ZodError);
    });

    it("should reject short password", () => {
      const data = {
        email: "test@example.com",
        name: "John Doe",
        password: "pass",
        confirmPassword: "pass",
      };

      expect(() => registerSchema.parse(data)).toThrow(z.ZodError);
    });
  });

  describe("loginSchema", () => {
    it("should validate correct login data", () => {
      const data = {
        email: "test@example.com",
        password: "password123",
      };

      expect(() => loginSchema.parse(data)).not.toThrow();
    });

    it("should reject invalid email", () => {
      const data = {
        email: "invalid-email",
        password: "password123",
      };

      expect(() => loginSchema.parse(data)).toThrow(z.ZodError);
    });
  });

  describe("portfolioSchema", () => {
    it("should validate correct portfolio data", () => {
      const data = {
        name: "My Portfolio",
        description: "My investment portfolio",
      };

      expect(() => portfolioSchema.parse(data)).not.toThrow();
    });

    it("should reject empty name", () => {
      const data = {
        name: "",
      };

      expect(() => portfolioSchema.parse(data)).toThrow(z.ZodError);
    });
  });

  describe("transactionSchema", () => {
    it("should validate deposit transaction", () => {
      const data = {
        type: "DEPOSIT",
        amount: 1000,
      };

      expect(() => transactionSchema.parse(data)).not.toThrow();
    });

    it("should validate buy transaction", () => {
      const data = {
        type: "BUY",
        quantity: 10,
        price: 150,
        amount: 1500,
      };

      expect(() => transactionSchema.parse(data)).not.toThrow();
    });

    it("should reject negative amount", () => {
      const data = {
        type: "DEPOSIT",
        amount: -1000,
      };

      expect(() => transactionSchema.parse(data)).toThrow(z.ZodError);
    });
  });

  describe("aiMessageSchema", () => {
    it("should validate message", () => {
      const data = {
        content: "Tell me about my portfolio",
      };

      expect(() => aiMessageSchema.parse(data)).not.toThrow();
    });

    it("should reject empty message", () => {
      const data = {
        content: "",
      };

      expect(() => aiMessageSchema.parse(data)).toThrow(z.ZodError);
    });

    it("should reject message exceeding max length", () => {
      const data = {
        content: "a".repeat(4001),
      };

      expect(() => aiMessageSchema.parse(data)).toThrow(z.ZodError);
    });
  });
});

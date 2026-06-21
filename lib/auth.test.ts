import { describe, it, expect, beforeEach, vi } from "vitest";
import { hash, compare } from "bcrypt";

/**
 * Test suite for password hashing and comparison
 * This demonstrates proper testing practices for auth utilities
 */
describe("Password hashing", () => {
  it("should hash a password", async () => {
    const password = "testPassword123";
    const hashed = await hash(password, 12);

    expect(hashed).not.toBe(password);
    expect(hashed.length).toBeGreaterThan(0);
  });

  it("should verify a correct password", async () => {
    const password = "testPassword123";
    const hashed = await hash(password, 12);
    const isValid = await compare(password, hashed);

    expect(isValid).toBe(true);
  });

  it("should reject an incorrect password", async () => {
    const password = "testPassword123";
    const wrongPassword = "wrongPassword123";
    const hashed = await hash(password, 12);
    const isValid = await compare(wrongPassword, hashed);

    expect(isValid).toBe(false);
  });

  it("should generate different hashes for the same password", async () => {
    const password = "testPassword123";
    const hash1 = await hash(password, 12);
    const hash2 = await hash(password, 12);

    expect(hash1).not.toBe(hash2);
  });
});

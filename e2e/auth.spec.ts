import { test, expect } from "@playwright/test";

/**
 * E2E Tests for Fortress Fund
 * Playwright tests for user authentication and core flows
 */

test.describe("Authentication", () => {
  test("should display login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText("Fortress Fund");
    await expect(page.locator("h2")).toContainText("Sign In");
  });

  test("should display register page", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("h2")).toContainText("Create Account");
  });

  test("should show error on invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // Wait for error message (adjust selector as needed)
    await expect(page.locator("text=Invalid email or password")).toBeVisible({
      timeout: 5000,
    });
  });
});

test.describe("Navigation", () => {
  test("should redirect unauthenticated user to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/login");
  });

  test("should show home page for unauthenticated user", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h2")).toContainText("AI-Powered Investment");
  });
});

test.describe("Responsive Design", () => {
  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/login");

    const form = page.locator("form");
    await expect(form).toBeVisible();
  });

  test("should be responsive on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/login");

    const form = page.locator("form");
    await expect(form).toBeVisible();
  });

  test("should be responsive on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/login");

    const form = page.locator("form");
    await expect(form).toBeVisible();
  });
});

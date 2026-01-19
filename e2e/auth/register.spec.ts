import { test, expect } from "@playwright/test";

test.describe("Registration Page", () => {
  test("should load the registration page", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: /create account|sign up|register/i })).toBeVisible();
  });

  test("should display registration form fields", async ({ page }) => {
    await page.goto("/register");

    await expect(page.getByLabel(/name|full name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /register|sign up|create account/i })).toBeVisible();
  });

  test("should have link to login page", async ({ page }) => {
    await page.goto("/register");

    const loginLink = page.getByRole("link", { name: /sign in|log in|already have account/i });
    await expect(loginLink).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    await page.goto("/register");

    // Try to submit empty form
    await page.getByRole("button", { name: /register|sign up|create account/i }).click();

    // Should have required validation
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toHaveAttribute("required", "");
  });

  test("should validate email format", async ({ page }) => {
    await page.goto("/register");

    const emailInput = page.getByLabel(/email/i);
    await emailInput.fill("invalid-email");

    // HTML5 email validation
    await expect(emailInput).toHaveAttribute("type", "email");
  });
});

import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should load the home page successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/MiMo Day Care/i);
  });

  test("should display navigation with all public links", async ({ page }) => {
    await page.goto("/");

    // Check navigation links
    await expect(page.getByRole("link", { name: /home/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /about/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /programs/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /fees/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /calendar/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /contact/i })).toBeVisible();
  });

  test("should display hero section with CTAs", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /welcome to mimo day care/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /apply now/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /view programs/i })).toBeVisible();
  });

  test("should display feature cards", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /expert curriculum/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /qualified teachers/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /safe & secure/i })).toBeVisible();
  });

  test("should display portal cards for different user types", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /for parents/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /for teachers/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /for administrators/i })).toBeVisible();
  });

  test("should display footer with contact information", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText(/123 learning lane/i)).toBeVisible();
    await expect(page.getByText(/mimo day care/i).last()).toBeVisible();
  });

  test("should navigate to programs page from hero CTA", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /view programs/i }).click();
    await expect(page).toHaveURL(/\/programs/);
    await expect(page.getByRole("heading", { name: /our programs/i })).toBeVisible();
  });

  test("should navigate to apply page from Apply Now button", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /apply now/i }).first().click();
    await expect(page).toHaveURL(/\/apply/);
  });

  test("should navigate to contact page from Schedule a Tour button", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /schedule a tour/i }).click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Mobile menu button should be visible
    await expect(page.getByRole("button", { name: /menu/i })).toBeVisible();

    // Hero text should still be visible
    await expect(page.getByRole("heading", { name: /welcome to mimo day care/i })).toBeVisible();
  });
});

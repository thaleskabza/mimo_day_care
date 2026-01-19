import { test, expect } from "@playwright/test";

test.describe("About Page", () => {
  test("should load the about page successfully", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: /about mimo day care/i })).toBeVisible();
  });

  test("should display mission section", async ({ page }) => {
    await page.goto("/about");

    await expect(page.getByRole("heading", { name: /our mission/i })).toBeVisible();
    await expect(page.getByText(/nurturing environment/i)).toBeVisible();
  });

  test("should display values section", async ({ page }) => {
    await page.goto("/about");

    await expect(page.getByRole("heading", { name: /our values/i })).toBeVisible();
    await expect(page.getByText(/safety and well-being/i)).toBeVisible();
    await expect(page.getByText(/inclusive and diverse/i)).toBeVisible();
  });

  test("should display what makes us different section", async ({ page }) => {
    await page.goto("/about");

    await expect(page.getByRole("heading", { name: /what makes us different/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /curriculum excellence/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /expert educators/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /safe environment/i })).toBeVisible();
  });

  test("should display accreditation section", async ({ page }) => {
    await page.goto("/about");

    await expect(page.getByRole("heading", { name: /accreditation & licensing/i })).toBeVisible();
    await expect(page.getByText(/state licensed facility/i)).toBeVisible();
    await expect(page.getByText(/background checked staff/i)).toBeVisible();
  });

  test("should navigate from navigation menu", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /about/i }).first().click();
    await expect(page).toHaveURL(/\/about/);
  });
});

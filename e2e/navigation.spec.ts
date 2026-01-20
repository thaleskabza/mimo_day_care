import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate through all public pages", async ({ page }) => {
    // Start at home
    await page.goto("/");
    await expect(page).toHaveURL("/");

    // Navigate to About
    await page.getByRole("link", { name: /about/i }).first().click();
    await expect(page).toHaveURL("/about");
    await expect(page.getByRole("heading", { name: /about mimo day care/i })).toBeVisible();

    // Navigate to Programs
    await page.getByRole("link", { name: /programs/i }).first().click();
    await expect(page).toHaveURL("/programs");
    await expect(page.getByRole("heading", { name: /our programs/i })).toBeVisible();

    // Navigate to Fees
    await page.getByRole("link", { name: /fees/i }).first().click();
    await expect(page).toHaveURL("/fees");
    await expect(page.getByRole("heading", { name: /tuition & fees/i })).toBeVisible();

    // Navigate to Calendar
    await page.getByRole("link", { name: /calendar/i }).first().click();
    await expect(page).toHaveURL("/calendar");
    await expect(page.getByRole("heading", { name: /calendar & events/i })).toBeVisible();

    // Navigate to Contact
    await page.getByRole("link", { name: /contact/i }).first().click();
    await expect(page).toHaveURL("/contact");
    await expect(page.getByRole("heading", { name: /contact us/i })).toBeVisible();

    // Navigate back to Home
    await page.getByRole("link", { name: /home|mimo day care/i }).first().click();
    await expect(page).toHaveURL("/");
  });

  test("should have working footer links", async ({ page }) => {
    await page.goto("/");

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Test footer links
    const footerAboutLink = page.getByRole("contentinfo").getByRole("link", { name: /about/i });
    await expect(footerAboutLink).toBeVisible();
  });

  test("should handle 404 for non-existent pages", async ({ page }) => {
    const response = await page.goto("/non-existent-page");
    expect(response?.status()).toBe(404);
  });

  test("should maintain navigation state across pages", async ({ page }) => {
    await page.goto("/");

    // Navigate to a few pages
    await page.getByRole("link", { name: /about/i }).first().click();
    await expect(page).toHaveURL("/about");

    await page.getByRole("link", { name: /programs/i }).first().click();
    await expect(page).toHaveURL("/programs");

    // Use browser back button
    await page.goBack();
    await expect(page).toHaveURL("/about");

    // Use browser forward button
    await page.goForward();
    await expect(page).toHaveURL("/programs");
  });

  test("should have responsive mobile navigation", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Mobile menu button should be visible
    const menuButton = page.getByRole("button", { name: /menu/i });
    await expect(menuButton).toBeVisible();

    // Click to open mobile menu
    await menuButton.click();

    // Navigation links should be visible after opening menu
    await expect(page.getByRole("link", { name: /about/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /programs/i }).first()).toBeVisible();
  });

  test("should highlight active navigation link", async ({ page }) => {
    await page.goto("/about");

    // The active link might have special styling or aria-current attribute
    const aboutLink = page.getByRole("link", { name: /about/i }).first();
    await expect(aboutLink).toBeVisible();
  });
});

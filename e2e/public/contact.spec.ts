import { test, expect } from "@playwright/test";

test.describe("Contact Page", () => {
  test("should load the contact page successfully", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: /contact us/i })).toBeVisible();
  });

  test("should display contact information", async ({ page }) => {
    await page.goto("/contact");

    await expect(page.getByText(/123 learning lane/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /\(555\) 123-4567/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /info@mimodaycare\.com/i })).toBeVisible();
  });

  test("should display operating hours", async ({ page }) => {
    await page.goto("/contact");

    await expect(page.getByText(/operating hours/i)).toBeVisible();
    await expect(page.getByText(/monday - friday: 6:30 am - 6:00 pm/i)).toBeVisible();
  });

  test("should display contact form with all fields", async ({ page }) => {
    await page.goto("/contact");

    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/phone number/i)).toBeVisible();
    await expect(page.getByLabel(/subject/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /send message/i })).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    await page.goto("/contact");

    // Try to submit empty form
    await page.getByRole("button", { name: /send message/i }).click();

    // HTML5 validation should prevent submission
    const nameInput = page.getByLabel(/full name/i);
    await expect(nameInput).toHaveAttribute("required", "");
  });

  test("should submit contact form successfully", async ({ page }) => {
    await page.goto("/contact");

    // Fill in the form
    await page.getByLabel(/full name/i).fill("John Doe");
    await page.getByLabel(/email address/i).fill("john@example.com");
    await page.getByLabel(/phone number/i).fill("555-1234");
    await page.getByLabel(/subject/i).selectOption("enrollment");
    await page.getByLabel(/message/i).fill("I would like to enroll my child");

    // Submit the form
    await page.getByRole("button", { name: /send message/i }).click();

    // Should show success message
    await expect(page.getByText(/thank you/i)).toBeVisible({ timeout: 5000 });
  });

  test("should display tour scheduling section", async ({ page }) => {
    await page.goto("/contact");

    await expect(page.getByText(/schedule a tour/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /call to schedule/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /email to schedule/i })).toBeVisible();
  });

  test("should display FAQ section", async ({ page }) => {
    await page.goto("/contact");

    await expect(page.getByRole("heading", { name: /frequently asked questions/i })).toBeVisible();
    await expect(page.getByText(/what are your operating hours/i)).toBeVisible();
    await expect(page.getByText(/how do i enroll my child/i)).toBeVisible();
  });

  test("should have clickable phone and email links", async ({ page }) => {
    await page.goto("/contact");

    const phoneLink = page.getByRole("link", { name: /\(555\) 123-4567/i });
    await expect(phoneLink).toHaveAttribute("href", "tel:+15551234567");

    const emailLink = page.getByRole("link", { name: /info@mimodaycare\.com/i });
    await expect(emailLink).toHaveAttribute("href", "mailto:info@mimodaycare.com");
  });
});

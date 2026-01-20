import { test, expect } from "@playwright/test";

test.describe("Programs Page", () => {
  test("should load the programs page successfully", async ({ page }) => {
    await page.goto("/programs");
    await expect(page.getByRole("heading", { name: /our programs/i })).toBeVisible();
  });

  test("should display loading state initially", async ({ page }) => {
    await page.goto("/programs");
    // May see loading text briefly
    const loadingOrContent = page.getByText(/loading programs|no programs available/i).or(page.locator(".bg-white.rounded-lg.shadow-lg"));
    await expect(loadingOrContent.first()).toBeVisible({ timeout: 10000 });
  });

  test("should display programs fetched from API", async ({ page }) => {
    // Mock the API response
    await page.route("**/api/v1/programs", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          programs: [
            {
              id: "test-program-1",
              name: "Infant Care",
              description: "Loving care for infants 6 weeks to 12 months",
              ageRange: "6 weeks - 12 months",
              capacity: 12,
              tuitionFee: 1500,
              schedule: "Monday - Friday, 6:30 AM - 6:00 PM",
            },
            {
              id: "test-program-2",
              name: "Toddler Program",
              description: "Active learning for toddlers 1-2 years",
              ageRange: "1 - 2 years",
              capacity: 15,
              tuitionFee: 1300,
              schedule: "Monday - Friday, 6:30 AM - 6:00 PM",
            },
          ],
        }),
      });
    });

    await page.goto("/programs");

    // Check that programs are displayed
    await expect(page.getByText("Infant Care")).toBeVisible();
    await expect(page.getByText("Toddler Program")).toBeVisible();
    await expect(page.getByText("6 weeks - 12 months")).toBeVisible();
    await expect(page.getByText("$1500.00/month")).toBeVisible();
  });

  test("should display what's included section", async ({ page }) => {
    await page.goto("/programs");

    await expect(page.getByRole("heading", { name: /what's included in all programs/i })).toBeVisible();
    await expect(page.getByText(/educational curriculum/i)).toBeVisible();
    await expect(page.getByText(/nutritious meals/i)).toBeVisible();
  });

  test("should have Apply Now buttons on program cards", async ({ page }) => {
    await page.route("**/api/v1/programs", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          programs: [
            {
              id: "test-program-1",
              name: "Test Program",
              description: "Test description",
              ageRange: "0-5 years",
              capacity: 20,
              tuitionFee: 1000,
              schedule: "Mon-Fri",
            },
          ],
        }),
      });
    });

    await page.goto("/programs");
    await expect(page.getByRole("link", { name: /apply now/i })).toBeVisible();
  });

  test("should navigate to programs page from navigation", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /programs/i }).first().click();
    await expect(page).toHaveURL(/\/programs/);
  });
});

# Testing Guide

This document describes how to run and write tests for the MiMo Day Care application.

## Test Stack

- **Unit & Integration Tests**: Jest + React Testing Library
- **End-to-End Tests**: Playwright
- **CI/CD**: GitHub Actions

## Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers (for E2E tests)
npx playwright install
```

## Running Tests

### Unit and Integration Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### End-to-End Tests

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run E2E tests with UI mode (interactive)
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Run E2E tests with debugger
npm run test:e2e:debug

# View last test report
npm run test:e2e:report
```

### Run All Tests

```bash
# Run both unit and E2E tests
npm run test:all
```

## Test Structure

### Unit/Integration Tests

Located in `__tests__/` directory:

```
__tests__/
├── unit/
│   ├── lib/               # Library/utility tests
│   │   ├── state-transitions.test.ts
│   │   └── validations.test.ts
│   └── components/        # Component tests
│       ├── Footer.test.tsx
│       └── Navigation.test.tsx
└── integration/           # Integration tests
    ├── api/
    └── auth/
```

### E2E Tests

Located in `e2e/` directory:

```
e2e/
├── public/               # Public page tests
│   ├── home.spec.ts
│   ├── about.spec.ts
│   ├── programs.spec.ts
│   └── contact.spec.ts
├── auth/                 # Authentication tests
│   ├── login.spec.ts
│   └── register.spec.ts
├── parent/               # Parent portal tests
├── teacher/              # Teacher portal tests
├── admin/                # Admin portal tests
└── navigation.spec.ts    # Cross-cutting navigation tests
```

## Writing Tests

### Unit Test Example

```typescript
import { render, screen } from "@testing-library/react";
import MyComponent from "@/components/MyComponent";

describe("MyComponent", () => {
  it("should render correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from "@playwright/test";

test.describe("My Feature", () => {
  test("should work correctly", async ({ page }) => {
    await page.goto("/my-page");
    await expect(page.getByRole("heading")).toBeVisible();
  });
});
```

## Test Coverage

Coverage reports are generated in the `coverage/` directory after running:

```bash
npm run test:coverage
```

Open `coverage/lcov-report/index.html` in your browser to view the detailed coverage report.

## CI/CD

Tests run automatically on GitHub Actions for:
- All pushes to `main` and `develop` branches
- All pull requests to `main` and `develop` branches

The CI pipeline runs:
1. Linting
2. Type checking
3. Unit tests with coverage
4. E2E tests on Chromium, Firefox, and WebKit

## Debugging Tests

### Jest Tests

```bash
# Run a specific test file
npm test -- __tests__/unit/lib/validations.test.ts

# Run tests matching a pattern
npm test -- --testNamePattern="should validate"
```

### Playwright Tests

```bash
# Run a specific test file
npx playwright test e2e/public/home.spec.ts

# Run tests in debug mode
npm run test:e2e:debug

# Run tests with UI mode (recommended for debugging)
npm run test:e2e:ui
```

## Best Practices

1. **Test Organization**: Keep tests close to what they test
2. **Test Names**: Use descriptive names that explain what is being tested
3. **Arrange-Act-Assert**: Structure tests with clear setup, action, and assertion phases
4. **Mock External Dependencies**: Mock APIs, auth, and external services
5. **Test User Behavior**: Focus on what users see and do, not implementation details
6. **Keep Tests Fast**: Unit tests should run quickly; save slow operations for E2E tests
7. **Avoid Test Interdependence**: Each test should be independent and able to run in isolation

## Common Issues

### Playwright Browser Installation

If E2E tests fail with browser not found:

```bash
npx playwright install --with-deps
```

### Port Already in Use

If the dev server fails to start during E2E tests:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Issues

Ensure your test database is properly configured:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://testingjavascript.com/)

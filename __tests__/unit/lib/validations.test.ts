import { createChildSchema, updateChildSchema } from "@/lib/validations/child";
import { createApplicationSchema } from "@/lib/validations/application";

describe("Child Validations", () => {
  describe("createChildSchema", () => {
    it("should validate a valid child creation payload", () => {
      const validData = {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "2020-01-15",
        allergies: "None",
        medicalNotes: "Healthy",
      };

      const result = createChildSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject missing required fields", () => {
      const invalidData = {
        firstName: "John",
        // Missing lastName and dateOfBirth
      };

      const result = createChildSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid date format", () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "invalid-date",
      };

      const result = createChildSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should allow optional fields to be omitted", () => {
      const validData = {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "2020-01-15",
      };

      const result = createChildSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});

describe("Application Validations", () => {
  describe("createApplicationSchema", () => {
    it("should validate a valid application creation payload", () => {
      const validData = {
        childId: "clxxxxxxxxxxxxxxxxxx",
        programId: "clxxxxxxxxxxxxxxxxxx",
        preferredStartDate: "2024-09-01",
      };

      const result = createApplicationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject missing required fields", () => {
      const invalidData = {
        childId: "clxxxxxxxxxxxxxxxxxx",
        // Missing programId and preferredStartDate
      };

      const result = createApplicationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid CUID format", () => {
      const invalidData = {
        childId: "invalid-id",
        programId: "clxxxxxxxxxxxxxxxxxx",
        preferredStartDate: "2024-09-01",
      };

      const result = createApplicationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid date format", () => {
      const invalidData = {
        childId: "clxxxxxxxxxxxxxxxxxx",
        programId: "clxxxxxxxxxxxxxxxxxx",
        preferredStartDate: "not-a-date",
      };

      const result = createApplicationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

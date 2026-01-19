import { isValidApplicationTransition, isValidEnrollmentTransition } from "@/lib/utils/state-transitions";
import { ApplicationStatus, EnrollmentStatus } from "@/generated/prisma";

describe("Application State Transitions", () => {
  describe("isValidApplicationTransition", () => {
    it("should allow DRAFT to SUBMITTED", () => {
      expect(isValidApplicationTransition(ApplicationStatus.DRAFT, ApplicationStatus.SUBMITTED)).toBe(true);
    });

    it("should allow SUBMITTED to UNDER_REVIEW", () => {
      expect(isValidApplicationTransition(ApplicationStatus.SUBMITTED, ApplicationStatus.UNDER_REVIEW)).toBe(true);
    });

    it("should allow UNDER_REVIEW to APPROVED", () => {
      expect(isValidApplicationTransition(ApplicationStatus.UNDER_REVIEW, ApplicationStatus.APPROVED)).toBe(true);
    });

    it("should allow UNDER_REVIEW to WAITLISTED", () => {
      expect(isValidApplicationTransition(ApplicationStatus.UNDER_REVIEW, ApplicationStatus.WAITLISTED)).toBe(true);
    });

    it("should allow UNDER_REVIEW to REJECTED", () => {
      expect(isValidApplicationTransition(ApplicationStatus.UNDER_REVIEW, ApplicationStatus.REJECTED)).toBe(true);
    });

    it("should allow WAITLISTED to APPROVED", () => {
      expect(isValidApplicationTransition(ApplicationStatus.WAITLISTED, ApplicationStatus.APPROVED)).toBe(true);
    });

    it("should not allow DRAFT to APPROVED", () => {
      expect(isValidApplicationTransition(ApplicationStatus.DRAFT, ApplicationStatus.APPROVED)).toBe(false);
    });

    it("should not allow APPROVED to DRAFT", () => {
      expect(isValidApplicationTransition(ApplicationStatus.APPROVED, ApplicationStatus.DRAFT)).toBe(false);
    });

    it("should not allow REJECTED to APPROVED", () => {
      expect(isValidApplicationTransition(ApplicationStatus.REJECTED, ApplicationStatus.APPROVED)).toBe(false);
    });

    it("should allow staying in the same status", () => {
      expect(isValidApplicationTransition(ApplicationStatus.DRAFT, ApplicationStatus.DRAFT)).toBe(true);
    });
  });
});

describe("Enrollment State Transitions", () => {
  describe("isValidEnrollmentTransition", () => {
    it("should allow PENDING to ACTIVE", () => {
      expect(isValidEnrollmentTransition(EnrollmentStatus.PENDING, EnrollmentStatus.ACTIVE)).toBe(true);
    });

    it("should allow ACTIVE to PAUSED", () => {
      expect(isValidEnrollmentTransition(EnrollmentStatus.ACTIVE, EnrollmentStatus.PAUSED)).toBe(true);
    });

    it("should allow PAUSED to ACTIVE", () => {
      expect(isValidEnrollmentTransition(EnrollmentStatus.PAUSED, EnrollmentStatus.ACTIVE)).toBe(true);
    });

    it("should allow ACTIVE to ENDED", () => {
      expect(isValidEnrollmentTransition(EnrollmentStatus.ACTIVE, EnrollmentStatus.ENDED)).toBe(true);
    });

    it("should allow PAUSED to ENDED", () => {
      expect(isValidEnrollmentTransition(EnrollmentStatus.PAUSED, EnrollmentStatus.ENDED)).toBe(true);
    });

    it("should not allow PENDING to PAUSED", () => {
      expect(isValidEnrollmentTransition(EnrollmentStatus.PENDING, EnrollmentStatus.PAUSED)).toBe(false);
    });

    it("should not allow ENDED to ACTIVE", () => {
      expect(isValidEnrollmentTransition(EnrollmentStatus.ENDED, EnrollmentStatus.ACTIVE)).toBe(false);
    });

    it("should not allow PENDING to ENDED", () => {
      expect(isValidEnrollmentTransition(EnrollmentStatus.PENDING, EnrollmentStatus.ENDED)).toBe(false);
    });

    it("should allow staying in the same status", () => {
      expect(isValidEnrollmentTransition(EnrollmentStatus.ACTIVE, EnrollmentStatus.ACTIVE)).toBe(true);
    });
  });
});

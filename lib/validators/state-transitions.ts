import { ApplicationStatus, EnrollmentStatus } from "@/generated/prisma";

/**
 * Valid application status transitions
 */
const APPLICATION_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  DRAFT: [ApplicationStatus.SUBMITTED],
  SUBMITTED: [ApplicationStatus.UNDER_REVIEW],
  UNDER_REVIEW: [
    ApplicationStatus.APPROVED,
    ApplicationStatus.WAITLISTED,
    ApplicationStatus.REJECTED,
  ],
  APPROVED: [], // Terminal state
  WAITLISTED: [ApplicationStatus.UNDER_REVIEW, ApplicationStatus.APPROVED],
  REJECTED: [], // Terminal state
};

/**
 * Valid enrollment status transitions
 */
const ENROLLMENT_TRANSITIONS: Record<EnrollmentStatus, EnrollmentStatus[]> = {
  PENDING: [EnrollmentStatus.ACTIVE],
  ACTIVE: [EnrollmentStatus.PAUSED, EnrollmentStatus.ENDED],
  PAUSED: [EnrollmentStatus.ACTIVE, EnrollmentStatus.ENDED],
  ENDED: [], // Terminal state
};

/**
 * Validate if an application status transition is valid
 * @param currentStatus - Current status
 * @param newStatus - Desired new status
 * @returns True if transition is valid
 */
export function isValidApplicationTransition(
  currentStatus: ApplicationStatus,
  newStatus: ApplicationStatus
): boolean {
  if (currentStatus === newStatus) {
    return false; // No transition needed
  }

  const validTransitions = APPLICATION_TRANSITIONS[currentStatus];
  return validTransitions.includes(newStatus);
}

/**
 * Validate if an enrollment status transition is valid
 * @param currentStatus - Current status
 * @param newStatus - Desired new status
 * @returns True if transition is valid
 */
export function isValidEnrollmentTransition(
  currentStatus: EnrollmentStatus,
  newStatus: EnrollmentStatus
): boolean {
  if (currentStatus === newStatus) {
    return false; // No transition needed
  }

  const validTransitions = ENROLLMENT_TRANSITIONS[currentStatus];
  return validTransitions.includes(newStatus);
}

/**
 * Get valid next statuses for an application
 * @param currentStatus - Current application status
 * @returns Array of valid next statuses
 */
export function getValidApplicationTransitions(
  currentStatus: ApplicationStatus
): ApplicationStatus[] {
  return APPLICATION_TRANSITIONS[currentStatus];
}

/**
 * Get valid next statuses for an enrollment
 * @param currentStatus - Current enrollment status
 * @returns Array of valid next statuses
 */
export function getValidEnrollmentTransitions(
  currentStatus: EnrollmentStatus
): EnrollmentStatus[] {
  return ENROLLMENT_TRANSITIONS[currentStatus];
}

/**
 * Check if application status is terminal (no further transitions)
 * @param status - Application status to check
 * @returns True if status is terminal
 */
export function isTerminalApplicationStatus(status: ApplicationStatus): boolean {
  return APPLICATION_TRANSITIONS[status].length === 0;
}

/**
 * Check if enrollment status is terminal (no further transitions)
 * @param status - Enrollment status to check
 * @returns True if status is terminal
 */
export function isTerminalEnrollmentStatus(status: EnrollmentStatus): boolean {
  return ENROLLMENT_TRANSITIONS[status].length === 0;
}

# Domain Model (Conceptual)

## Entities
- User
  - id, email, phone, name, role(s), status (active/suspended)

- ParentProfile
  - userId, address, emergencyContacts, consentFlags

- TeacherProfile
  - userId, qualifications, staffNumber (optional)

- Child
  - id, parentUserId, name, dob, medicalNotes, allergies, authorizedPickupList

- Program
  - id, name (e.g., Toddler, Pre-K), ageRange, feePlanId

- Class
  - id, programId, name, teacherUserId, capacity

- Application
  - id, childId, programId, submittedAt, status
  - statuses: DRAFT, SUBMITTED, UNDER_REVIEW, WAITLISTED, APPROVED, REJECTED

- Enrollment
  - id, childId, classId, startDate, status
  - statuses: PENDING, ACTIVE, PAUSED, ENDED

- MessageThread
  - id, childId, classId, participants (parentUserId, teacherUserId), createdAt

- Message
  - id, threadId, senderUserId, body, createdAt, readAt?

- AuditLog
  - id, actorUserId, actionType, entityType, entityId, before, after, timestamp

## Relationships
- Parent(User) 1—* Child
- Child 1—* Application
- Child 0..* Enrollment (only one ACTIVE at a time)
- Class 1—* Enrollment
- Teacher(User) 1—* Class
- Thread belongs to Child + Class and includes Parent + Teacher

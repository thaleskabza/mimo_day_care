# Data Model (Logical)

## Tables (suggested)
- users(id, email, passwordHash, name, phone, status, createdAt)
- user_roles(userId, role)  # allow multiple roles (principal = admin+exec or explicit principal)

- parent_profiles(userId, address, emergencyContactsJson, consentJson)
- teacher_profiles(userId, qualifications, staffNumber)

- children(id, parentUserId, name, dob, medicalNotes, allergies, pickupListJson)

- programs(id, name, ageMinMonths, ageMaxMonths)
- classes(id, programId, name, teacherUserId, capacity)

- applications(id, childId, programId, status, submittedAt, updatedAt, adminNotes)
- enrollments(id, childId, classId, startDate, status, updatedAt)

- message_threads(id, childId, classId, parentUserId, teacherUserId, createdAt)
- messages(id, threadId, senderUserId, body, createdAt, readAt)

- audit_logs(id, actorUserId, actionType, entityType, entityId, beforeJson, afterJson, createdAt)

## Constraints
- Only one ACTIVE enrollment per child
- Parent can only access child records where parentUserId = current user
- Teacher can only access roster where class.teacherUserId = current user

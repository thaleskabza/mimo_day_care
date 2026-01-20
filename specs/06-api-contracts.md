# API Contracts (v1)

## Auth
- POST /api/v1/auth/register
  - body: { email, password, name, phone }
  - result: { user, token }

- POST /api/v1/auth/login
  - body: { email, password }
  - result: { user, token }

- POST /api/v1/auth/logout

## Parent: Children & Applications
- POST /api/v1/parent/children
- GET  /api/v1/parent/children
- GET  /api/v1/parent/children/:childId

- POST /api/v1/parent/applications
  - body: { childId, programId }
- POST /api/v1/parent/applications/:id/submit
- GET  /api/v1/parent/applications
- GET  /api/v1/parent/applications/:id

## Admin: Review & Enrollment
- GET  /api/v1/admin/applications
- GET  /api/v1/admin/applications/:id
- POST /api/v1/admin/applications/:id/status
  - body: { status: UNDER_REVIEW|WAITLISTED|APPROVED|REJECTED, notes? }
  - creates audit log

- POST /api/v1/admin/enrollments
  - body: { childId, classId, startDate }
- POST /api/v1/admin/enrollments/:id/activate
- GET  /api/v1/admin/classes
- POST /api/v1/admin/classes
- POST /api/v1/admin/staff/teachers
- POST /api/v1/admin/staff/assign-role
  - body: { userId, role }  # role could be PRINCIPAL, EXECUTIVE, ADMIN etc
  - creates audit log

## Teacher
- GET /api/v1/teacher/classes
- GET /api/v1/teacher/classes/:classId/roster
- GET /api/v1/teacher/children/:childId

## Messaging
- GET  /api/v1/messages/threads
  - scope: parent enrolled children OR teacher assigned classes OR admin/principal audit
- POST /api/v1/messages/threads
  - body: { childId, classId }  # creates/returns thread
- GET  /api/v1/messages/threads/:threadId
- POST /api/v1/messages/threads/:threadId/messages
  - body: { body }

## Executive
- GET /api/v1/exec/metrics
- GET /api/v1/exec/reports
  - read-only, aggregated

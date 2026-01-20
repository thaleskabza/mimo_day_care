# UI Routes

## Public (Visitor)
- GET /            Home
- GET /about
- GET /programs
- GET /fees
- GET /calendar
- GET /contact
- GET /apply       -> prompts login/register
- GET /login
- GET /register

## Parent Portal (requires auth + enrolled child)
- GET /parent
- GET /parent/children
- GET /parent/applications
- GET /parent/applications/:id
- GET /parent/messages
- GET /parent/messages/:threadId

## Teacher Portal (requires TEACHER)
- GET /teacher
- GET /teacher/classes
- GET /teacher/classes/:classId
- GET /teacher/children/:childId
- GET /teacher/messages
- GET /teacher/messages/:threadId

## Admin Portal (requires ADMIN or PRINCIPAL)
- GET /admin
- GET /admin/applications
- GET /admin/applications/:id
- GET /admin/classes
- GET /admin/staff
- GET /admin/audit

## Executive Portal (requires EXECUTIVE or PRINCIPAL)
- GET /exec
- GET /exec/metrics
- GET /exec/reports

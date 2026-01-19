# Workflows & State Machines

## A) Parent Registration & Application
1. Visitor registers -> PARENT role
2. Parent creates Child profile (draft)
3. Parent creates Application (DRAFT)
4. Parent submits application -> SUBMITTED
5. Admin reviews -> UNDER_REVIEW
6. Decision:
   - APPROVED -> triggers Enrollment creation (PENDING)
   - WAITLISTED -> stay WAITLISTED
   - REJECTED -> end state

## B) Enrollment Activation
- When approved:
  - Admin assigns a Class
  - Enrollment status PENDING -> ACTIVE (on start date or immediate)
- Parent Portal access:
  - Enabled if parent has ≥1 child with ACTIVE enrollment

## C) Messaging
- Parent can message only if child is enrolled (ACTIVE)
- Teacher can message only for assigned class roster
- Messages stored in threads per child/class
- Admin/Principal can view threads for audit (read-only unless moderation policy added later)

## D) Staff Management
- Admin can add Teacher
- Admin can add Principal (role assignment)
- Principal can do Admin actions + view Executive dashboards

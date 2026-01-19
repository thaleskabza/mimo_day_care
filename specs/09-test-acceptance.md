# Acceptance Tests (Behavior)

## Public Site
- Visitor can view programs, fees, contact without login
- Apply CTA routes to login/register when not authenticated

## Parent Registration & Application
- Parent registers and logs in successfully
- Parent creates a child profile
- Parent creates an application and submits it
- Parent can view application status at all times
- Parent cannot access Parent Portal if no enrolled children

## Admin Review
- Admin can view submitted applications
- Admin can transition status with valid transitions only
- Audit log created for each transition

## Enrollment & Portal Gating
- When application approved and enrollment activated, parent portal becomes accessible
- Parent sees child’s class and assigned teacher in portal
- Parent cannot view other parents’ children

## Teacher Access
- Teacher sees only their assigned classes
- Teacher sees roster of enrolled children in that class
- Teacher can view child profile + parent contact for roster children only

## Messaging
- Parent can message assigned teacher for enrolled child
- Teacher can reply
- Parent cannot message teacher if child not enrolled
- Admin can view message threads for audit (read-only)

## Principal
- Principal can access Admin and Executive portals

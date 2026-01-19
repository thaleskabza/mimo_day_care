# Technical Plan: MiMo Day Care (Vercel + Next.js + Postgres)

## Stack
- Frontend/Backend: Next.js (App Router) on Vercel
- Database: Postgres (Neon/Supabase)
- ORM: Prisma
- Auth: NextAuth (Credentials) + JWT session strategy
- Styling: Tailwind CSS (optional) OR simple CSS modules (choose one)
- Email (optional later): Resend / Postmark

## Architecture
Single Next.js application:
- Public marketing pages (no auth)
- Portals (auth + RBAC)
- API routes in /app/api/v1/* for:
  - auth helpers
  - children/applications/enrollments/classes/messages
- Server Actions can be used later, but start with API routes for clarity and testing.

## RBAC Strategy
### Roles
- PARENT, TEACHER, ADMIN, EXECUTIVE, PRINCIPAL
- PRINCIPAL is treated as a role that implies ADMIN + EXECUTIVE OR we store multiple roles per user.

### Enforcement layers
1) **Middleware route protection**
   - /parent/* requires role PARENT + enrolled child check (server-side)
   - /teacher/* requires role TEACHER
   - /admin/* requires role ADMIN or PRINCIPAL
   - /exec/* requires role EXECUTIVE or PRINCIPAL

2) **Server-side authorization in every API handler**
   - Role check + relationship check:
     - Parent can only access their children
     - Teacher can only access assigned class roster
     - Executive only aggregated views (no child identifiers)
     - Admin/Principal can access management endpoints

3) **DB-level constraints**
   - Unique constraints & indexes
   - Prevent multiple ACTIVE enrollments per child

## Data Model (Prisma)
Core tables:
- User, UserRole
- ParentProfile, TeacherProfile
- Child
- Program, Class
- Application
- Enrollment
- MessageThread, Message
- AuditLog

Key constraints:
- one active enrollment per child
- thread uniqueness on (childId, classId)

## Application State Machines
Application.status:
- DRAFT -> SUBMITTED -> UNDER_REVIEW -> (APPROVED|WAITLISTED|REJECTED)
Enrollment.status:
- PENDING -> ACTIVE -> (PAUSED|ENDED)

Only Admin/Principal can transition statuses.

## UI
### Public pages
Home, About, Programs, Fees, Calendar, Contact, Apply CTA

### Portals
- Parent dashboard: children, application status, class info, messaging
- Teacher dashboard: assigned classes, roster, child + parent detail, messaging
- Admin dashboard: applications review, classes, staff management, audit logs
- Executive dashboard: metrics, reports (aggregated)
- Principal: can access Admin + Executive routes

## Messaging
- Threads per enrolled child/class
- Parent can message only if child enrollment ACTIVE
- Teacher can message only if assigned
- Admin/Principal can view for audit (read-only)

## Observability & Ops
- Vercel logs
- Prisma query logging in dev
- Audit logs persisted for sensitive actions:
  - role assignments
  - status transitions
  - enrollment activation
  - staff creation

## Security
- Password hashing with bcrypt
- Rate-limiting (basic) on login/register endpoints (can be middleware or provider-level later)
- Input validation with Zod at API boundary
- No child identifiers in executive responses

## Testing Strategy
- Unit tests: RBAC guard functions, state transition validators
- Integration tests: API routes (node test runner or jest)
- E2E tests later: Playwright for login + portal gating + messaging smoke flows

## Milestones
M1: Auth + RBAC + skeleton routes
M2: Parent application + status tracking
M3: Admin review + enrollment activation + parent portal gating
M4: Teacher portal roster + child profile access
M5: Messaging
M6: Executive dashboards + audit views + polish

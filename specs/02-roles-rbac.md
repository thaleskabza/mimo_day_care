# Roles & RBAC

## Roles
- VISITOR (unauthenticated)
- PARENT
- TEACHER
- ADMIN
- EXECUTIVE
- PRINCIPAL (inherits ADMIN + EXECUTIVE)

## Core Rules
1. Parent can only access Parent Portal if:
   - They are authenticated AND
   - At least one child is ENROLLED (or per-child portal sections gated by enrolled status)
2. Teacher can only see:
   - Classes assigned to them
   - Children in those classes
   - Parent details for those children
3. Admin can:
   - Add teachers
   - Add principal (or promote)
   - Manage classes and enrollment decisions
4. Principal:
   - All Admin powers + Executive dashboard access
5. Executive:
   - Read-only high-level reporting; no child profile editing

## Permission Matrix (high level)
- Public pages: VISITOR ✅
- Register/login: VISITOR ✅
- Apply: PARENT ✅
- View application status: PARENT ✅ (own applications only)
- Parent portal: PARENT ✅ (only if enrolled)
- Teacher portal: TEACHER ✅
- Admin portal: ADMIN ✅
- Executive dashboard: EXECUTIVE ✅
- Principal: ADMIN ✅ + EXECUTIVE ✅

## Server-side Authorization Policy
- All protected routes require auth
- All portal endpoints require role check
- Child data endpoints require both role check and relationship check (ownership/assignment)
- Audit logs required for staff management and status transitions

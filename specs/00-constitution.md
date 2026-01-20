# MiMo Day Care - Project Constitution (Non-negotiables)

## Purpose
Build a secure, simple web platform for:
- Public landing site + marketing
- Parent registration, applications, enrollment and status tracking
- Role-based portals (Parent, Teacher, Admin, Principal, Executive)
- Messaging between parents and assigned teachers
- Admin-managed staff and class structures

## Non-negotiable Principles
1. **Security first**
   - Authentication required for all portals
   - Role-based access control enforced server-side
   - Least-privilege access; deny by default

2. **Data privacy**
   - Children’s data is highly sensitive
   - No public exposure of child profiles
   - Audit logs for administrative actions

3. **Predictable workflows**
   - Applications and enrollment follow explicit states
   - Transitions are validated and auditable

4. **Testable outcomes**
   - Every feature has acceptance criteria
   - Critical flows must have automated tests

5. **Simplicity**
   - Minimal dependencies
   - Clear separation of public site vs portals
   - Avoid over-engineering; focus on correctness

## Quality Standards
- Input validation on all forms (client + server)
- Consistent error handling and user feedback
- All RBAC checks centralized and unit-tested
- No “magic admin” actions without audit trail

## Definition of Done
- Feature meets acceptance criteria
- RBAC tests pass
- Workflow/state transition tests pass
- No sensitive data accessible to unauthorized roles

# Product Spec - MiMo Day Care Platform

## Vision
A web platform that helps parents discover MiMo Day Care, apply/enroll children, track status, and communicate with teachers — while giving staff and leadership the tools to manage operations securely.

## Personas
- **Visitor**: browses landing pages
- **Parent**: registers, submits applications, enrolls children, views portal, messages teachers
- **Teacher**: views assigned class roster, child profiles, parent details, messaging
- **Admin**: manages users (teachers, principal), classes, enrollment decisions, content, audit
- **Principal**: has Admin + Executive privileges (superset)
- **Executive**: views executive dashboard and high-level reports

## Core Modules
1. Public Website
   - Home, About, Programs, Fees, Calendar, Contact
   - CTA: Apply / Register

2. Identity & Access
   - Register/login
   - Roles: Parent, Teacher, Admin, Principal, Executive
   - Principal has both Admin and Executive access
   - Parent portal only if child enrolled (enforced)

3. Applications & Enrollment
   - Parent creates child profile + application
   - Track application status
   - Admin/Principal reviews and approves/rejects/waitlists
   - Enrollment activates parent portal access per child

4. Portals
   - Parent Portal: enrolled children, class, teacher, messages, status
   - Teacher Portal: assigned class roster, child profiles, parent contacts, messages
   - Admin Portal: staff mgmt, class mgmt, applications, enrollments, audit
   - Executive Portal: metrics dashboards
   - Principal Portal: access to Admin + Executive

5. Messaging
   - Parent ↔ Assigned Teacher (per child/class)
   - Conversation history retained
   - Moderation/audit visibility for Admin/Principal

## Success Metrics
- Time to submit application < 5 minutes
- Parent can always see status and next steps
- Zero unauthorized access incidents
- Staff can find enrolled child’s class/parent details in < 10 seconds

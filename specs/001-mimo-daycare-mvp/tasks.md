---

description: "Task list for MiMo Day Care MVP implementation"
---

# Tasks: MiMo Day Care MVP

**Input**: Design documents from `/specs/001-mimo-daycare-mvp/`
**Prerequisites**: plan.md (required), data-model.md (required)

**Tests**: Tests are included based on the testing strategy defined in plan.md (Unit tests for RBAC/state transitions, Integration tests for API routes)

**Organization**: Tasks are grouped by milestone/user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Next.js App Router**: `app/`, `lib/`, `components/`
- **API Routes**: `app/api/v1/`
- **Tests**: `__tests__/` or `tests/`
- Paths assume Next.js project structure at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize Next.js project with TypeScript and App Router
- [X] T002 Install core dependencies (Prisma, NextAuth, Zod, bcrypt, Tailwind CSS)
- [X] T003 [P] Configure TypeScript with strict mode in tsconfig.json
- [X] T004 [P] Configure Tailwind CSS in tailwind.config.ts and globals.css
- [X] T005 [P] Setup ESLint and Prettier configuration files
- [X] T006 Create environment variables template in .env.example
- [X] T007 Setup Prisma with Postgres connection in prisma/schema.prisma
- [X] T008 Create initial project structure (lib/, components/, app/ directories)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T009 Define Prisma schema for User model in prisma/schema.prisma
- [X] T010 [P] Define Prisma schema for UserRole model in prisma/schema.prisma
- [X] T011 [P] Define Prisma schema for ParentProfile model in prisma/schema.prisma
- [X] T012 [P] Define Prisma schema for TeacherProfile model in prisma/schema.prisma
- [X] T013 [P] Define Prisma schema for Child model in prisma/schema.prisma
- [X] T014 [P] Define Prisma schema for Program model in prisma/schema.prisma
- [X] T015 [P] Define Prisma schema for Class model in prisma/schema.prisma
- [X] T016 [P] Define Prisma schema for Application model in prisma/schema.prisma
- [X] T017 [P] Define Prisma schema for Enrollment model in prisma/schema.prisma
- [X] T018 [P] Define Prisma schema for MessageThread model in prisma/schema.prisma
- [X] T019 [P] Define Prisma schema for Message model in prisma/schema.prisma
- [X] T020 [P] Define Prisma schema for AuditLog model in prisma/schema.prisma
- [X] T021 Run Prisma migration to create database schema (requires DATABASE_URL)
- [X] T022 Generate Prisma Client (requires T021 completion)
- [X] T023 Create database connection utility in lib/db.ts
- [X] T024 Create password hashing utilities in lib/auth/password.ts
- [X] T025 Create Zod validation schemas in lib/validations/index.ts
- [X] T026 Configure NextAuth with Credentials provider in app/api/auth/[...nextauth]/route.ts
- [X] T027 Create NextAuth configuration with JWT session strategy in lib/auth/config.ts
- [X] T028 Create RBAC guard functions in lib/auth/guards.ts
- [X] T029 Create middleware for route protection in middleware.ts
- [X] T030 Create audit logging utility in lib/audit.ts
- [X] T031 Create state transition validators in lib/validators/state-transitions.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Auth + RBAC + Skeleton Routes (Priority: P1) 🎯 MVP

**Goal**: Implement authentication system with role-based access control and skeleton portal routes

**Independent Test**: Users can register, login, and access role-appropriate portal routes with proper authorization

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T032 [P] [US1] Unit test for RBAC guard functions in __tests__/unit/auth/guards.test.ts
- [ ] T033 [P] [US1] Unit test for password hashing utilities in __tests__/unit/auth/password.test.ts
- [ ] T034 [P] [US1] Integration test for register endpoint in __tests__/integration/auth/register.test.ts
- [ ] T035 [P] [US1] Integration test for login endpoint in __tests__/integration/auth/login.test.ts
- [ ] T036 [P] [US1] Integration test for middleware route protection in __tests__/integration/middleware.test.ts

### Implementation for User Story 1

- [X] T037 [P] [US1] Implement register API endpoint in app/api/v1/auth/register/route.ts
- [X] T038 [P] [US1] Implement login API endpoint in app/api/v1/auth/login/route.ts
- [X] T039 [P] [US1] Implement logout API endpoint in app/api/v1/auth/logout/route.ts
- [X] T040 [US1] Create register page UI in app/register/page.tsx
- [X] T041 [US1] Create login page UI in app/login/page.tsx
- [X] T042 [P] [US1] Create parent portal skeleton in app/parent/page.tsx
- [X] T043 [P] [US1] Create teacher portal skeleton in app/teacher/page.tsx
- [X] T044 [P] [US1] Create admin portal skeleton in app/admin/page.tsx
- [X] T045 [P] [US1] Create executive portal skeleton in app/exec/page.tsx
- [X] T046 [US1] Implement middleware route protection for /parent/* routes in middleware.ts
- [X] T047 [US1] Implement middleware route protection for /teacher/* routes in middleware.ts
- [X] T048 [US1] Implement middleware route protection for /admin/* routes in middleware.ts
- [X] T049 [US1] Implement middleware route protection for /exec/* routes in middleware.ts
- [ ] T050 [US1] Add rate limiting to login endpoint in app/api/v1/auth/login/route.ts
- [ ] T051 [US1] Add rate limiting to register endpoint in app/api/v1/auth/register/route.ts

**Checkpoint**: At this point, authentication and RBAC should be fully functional and testable independently

---

## Phase 4: User Story 2 - Parent Application Flow (Priority: P2)

**Goal**: Parents can create child profiles, submit applications, and track application status

**Independent Test**: A parent can register, create a child profile, submit an application, and view its status

### Tests for User Story 2 ⚠️

- [ ] T052 [P] [US2] Integration test for creating child in __tests__/integration/parent/children.test.ts
- [ ] T053 [P] [US2] Integration test for creating application in __tests__/integration/parent/applications.test.ts
- [ ] T054 [P] [US2] Integration test for submitting application in __tests__/integration/parent/applications.test.ts
- [ ] T055 [P] [US2] Unit test for application state transitions in __tests__/unit/validators/state-transitions.test.ts

### Implementation for User Story 2

- [X] T056 [P] [US2] Implement POST /api/v1/parent/children endpoint in app/api/v1/parent/children/route.ts
- [X] T057 [P] [US2] Implement GET /api/v1/parent/children endpoint in app/api/v1/parent/children/route.ts
- [X] T058 [P] [US2] Implement GET /api/v1/parent/children/[childId] endpoint in app/api/v1/parent/children/[childId]/route.ts
- [X] T059 [P] [US2] Implement POST /api/v1/parent/applications endpoint in app/api/v1/parent/applications/route.ts
- [X] T060 [P] [US2] Implement GET /api/v1/parent/applications endpoint in app/api/v1/parent/applications/route.ts
- [X] T061 [P] [US2] Implement GET /api/v1/parent/applications/[id] endpoint in app/api/v1/parent/applications/[id]/route.ts
- [X] T062 [P] [US2] Implement POST /api/v1/parent/applications/[id]/submit endpoint in app/api/v1/parent/applications/[id]/submit/route.ts
- [X] T063 [US2] Add authorization checks to parent/children endpoints ensuring parent can only access their children
- [X] T064 [US2] Add authorization checks to parent/applications endpoints ensuring parent can only access their applications
- [X] T065 [US2] Create child profile form component in components/parent/ChildForm.tsx
- [X] T066 [US2] Create application form component in components/parent/ApplicationForm.tsx
- [X] T067 [US2] Create application status display component in components/parent/ApplicationStatus.tsx
- [X] T068 [US2] Build parent portal children page in app/parent/children/page.tsx
- [X] T069 [US2] Build parent portal new child page in app/parent/children/new/page.tsx
- [X] T070 [US2] Build parent portal applications page in app/parent/applications/page.tsx
- [X] T071 [US2] Build parent portal new application page in app/parent/applications/new/page.tsx
- [X] T072 [US2] Add Zod validation for child creation in lib/validations/child.ts
- [X] T073 [US2] Add Zod validation for application creation in lib/validations/application.ts

**Checkpoint**: Parents can create children and applications independently

---

## Phase 5: User Story 3 - Admin Review & Enrollment (Priority: P3)

**Goal**: Admins can review applications, change status, create enrollments, and activate parent portal access

**Independent Test**: Admin can view applications, approve/reject them, create enrollments, and activate parent access

### Tests for User Story 3 ⚠️

- [ ] T074 [P] [US3] Integration test for admin applications list in __tests__/integration/admin/applications.test.ts
- [ ] T075 [P] [US3] Integration test for admin status transitions in __tests__/integration/admin/applications.test.ts
- [ ] T076 [P] [US3] Integration test for enrollment creation in __tests__/integration/admin/enrollments.test.ts
- [ ] T077 [P] [US3] Integration test for enrollment activation in __tests__/integration/admin/enrollments.test.ts
- [ ] T078 [P] [US3] Unit test for enrollment state transitions in __tests__/unit/validators/state-transitions.test.ts
- [ ] T079 [P] [US3] Integration test for audit log creation in __tests__/integration/audit.test.ts

### Implementation for User Story 3

- [X] T080 [P] [US3] Implement GET /api/v1/admin/applications endpoint in app/api/v1/admin/applications/route.ts
- [X] T081 [P] [US3] Implement GET /api/v1/admin/applications/[id] endpoint in app/api/v1/admin/applications/[id]/route.ts
- [X] T082 [P] [US3] Implement POST /api/v1/admin/applications/[id]/status endpoint in app/api/v1/admin/applications/[id]/status/route.ts
- [X] T083 [P] [US3] Implement POST /api/v1/admin/enrollments endpoint in app/api/v1/admin/enrollments/route.ts
- [X] T084 [P] [US3] Implement POST /api/v1/admin/enrollments/[id]/activate endpoint in app/api/v1/admin/enrollments/[id]/activate/route.ts
- [X] T085 [P] [US3] Implement GET /api/v1/admin/classes endpoint in app/api/v1/admin/classes/route.ts
- [X] T086 [P] [US3] Implement POST /api/v1/admin/classes endpoint in app/api/v1/admin/classes/route.ts
- [X] T087 [P] [US3] Implement POST /api/v1/admin/staff/teachers endpoint in app/api/v1/admin/staff/teachers/route.ts
- [X] T088 [P] [US3] Implement POST /api/v1/admin/staff/assign-role endpoint in app/api/v1/admin/staff/assign-role/route.ts
- [X] T089 [US3] Add audit logging to status transition endpoint in app/api/v1/admin/applications/[id]/status/route.ts
- [X] T090 [US3] Add audit logging to enrollment activation endpoint in app/api/v1/admin/enrollments/[id]/activate/route.ts
- [X] T091 [US3] Add audit logging to role assignment endpoint in app/api/v1/admin/staff/assign-role/route.ts
- [X] T092 [US3] Add authorization checks ensuring only ADMIN or PRINCIPAL can access admin endpoints
- [X] T093 [US3] Enforce one active enrollment per child constraint in enrollment creation
- [ ] T094 [US3] Update middleware to check enrolled child status for parent portal access in middleware.ts
- [X] T095 [US3] Create applications review list component in components/admin/ApplicationsList.tsx
- [ ] T096 [US3] Create application detail component in components/admin/ApplicationDetail.tsx
- [X] T097 [US3] Create status transition form component in components/admin/StatusTransitionForm.tsx
- [X] T098 [US3] Create enrollment form component in components/admin/EnrollmentForm.tsx
- [ ] T099 [US3] Create class management component in components/admin/ClassManagement.tsx
- [X] T100 [US3] Build admin portal applications page in app/admin/applications/page.tsx
- [X] T101 [US3] Build admin portal application detail page in app/admin/applications/[id]/page.tsx
- [X] T102 [US3] Build admin portal enrollments page in app/admin/enrollments/page.tsx
- [X] T103 [US3] Build admin portal classes page in app/admin/classes/page.tsx
- [X] T104 [US3] Build admin portal staff management page in app/admin/staff/page.tsx
- [X] T105 [US3] Add Zod validation for enrollment creation in lib/validations/enrollment.ts
- [X] T106 [US3] Add Zod validation for status transitions in lib/validations/application.ts

**Checkpoint**: Admin can review and manage applications and enrollments independently

---

## Phase 6: User Story 4 - Teacher Portal (Priority: P4)

**Goal**: Teachers can view assigned classes, see roster of enrolled children, and access child/parent details

**Independent Test**: Teacher can login, see only their assigned classes, view roster, and access child profiles

### Tests for User Story 4 ⚠️

- [ ] T107 [P] [US4] Integration test for teacher classes list in __tests__/integration/teacher/classes.test.ts
- [ ] T108 [P] [US4] Integration test for teacher class roster in __tests__/integration/teacher/roster.test.ts
- [ ] T109 [P] [US4] Integration test for teacher child access in __tests__/integration/teacher/children.test.ts

### Implementation for User Story 4

- [X] T110 [P] [US4] Implement GET /api/v1/teacher/classes endpoint in app/api/v1/teacher/classes/route.ts
- [X] T111 [P] [US4] Implement GET /api/v1/teacher/classes/[classId]/roster endpoint in app/api/v1/teacher/classes/[classId]/roster/route.ts
- [X] T112 [P] [US4] Implement GET /api/v1/teacher/children/[childId] endpoint in app/api/v1/teacher/children/[childId]/route.ts
- [X] T113 [US4] Add authorization ensuring teacher can only access assigned classes in all teacher endpoints
- [X] T114 [US4] Add authorization ensuring teacher can only access children in their roster
- [X] T115 [US4] Create teacher classes list component in components/teacher/ClassesList.tsx
- [ ] T116 [US4] Create class roster component in components/teacher/ClassRoster.tsx
- [ ] T117 [US4] Create child detail view component in components/teacher/ChildDetail.tsx
- [X] T118 [US4] Build teacher portal classes page in app/teacher/classes/page.tsx
- [X] T119 [US4] Build teacher portal class detail page in app/teacher/classes/[classId]/page.tsx
- [X] T120 [US4] Build teacher portal child detail page in app/teacher/children/[childId]/page.tsx

**Checkpoint**: Teacher portal is fully functional with proper authorization

---

## Phase 7: User Story 5 - Messaging System (Priority: P5)

**Goal**: Parents and teachers can message each other per enrolled child/class with audit visibility

**Independent Test**: Parent can message teacher for enrolled child, teacher can reply, admin can audit

### Tests for User Story 5 ⚠️

- [ ] T121 [P] [US5] Integration test for message thread creation in __tests__/integration/messages/threads.test.ts
- [ ] T122 [P] [US5] Integration test for sending messages in __tests__/integration/messages/messages.test.ts
- [ ] T123 [P] [US5] Integration test for message authorization in __tests__/integration/messages/auth.test.ts

### Implementation for User Story 5

- [X] T124 [P] [US5] Implement GET /api/v1/messages/threads endpoint in app/api/v1/messages/threads/route.ts
- [X] T125 [P] [US5] Implement POST /api/v1/messages/threads endpoint in app/api/v1/messages/threads/route.ts
- [X] T126 [P] [US5] Implement GET /api/v1/messages/threads/[threadId] endpoint in app/api/v1/messages/threads/[threadId]/route.ts
- [X] T127 [P] [US5] Implement POST /api/v1/messages/threads/[threadId]/messages endpoint in app/api/v1/messages/threads/[threadId]/messages/route.ts
- [X] T128 [US5] Add authorization ensuring parent can only message if child enrollment ACTIVE
- [X] T129 [US5] Add authorization ensuring teacher can only message if assigned to class
- [X] T130 [US5] Add read-only audit access for admin/principal to message threads
- [X] T131 [US5] Enforce thread uniqueness constraint on (childId, classId)
- [X] T132 [US5] Create message thread list component in components/messaging/ThreadList.tsx
- [X] T133 [US5] Create message thread view component in components/messaging/ThreadView.tsx
- [X] T134 [US5] Create message compose component in components/messaging/MessageCompose.tsx
- [X] T135 [US5] Build parent portal messages page in app/parent/messages/page.tsx
- [X] T136 [US5] Build parent portal thread detail page in app/parent/messages/[threadId]/page.tsx
- [X] T137 [US5] Build teacher portal messages page in app/teacher/messages/page.tsx
- [X] T138 [US5] Build teacher portal thread detail page in app/teacher/messages/[threadId]/page.tsx
- [X] T139 [US5] Build admin audit messages page in app/admin/messages/page.tsx
- [X] T140 [US5] Add Zod validation for message creation in lib/validations/message.ts

**Checkpoint**: Messaging system is fully functional with proper authorization

---

## Phase 8: User Story 6 - Executive Dashboard (Priority: P6)

**Goal**: Executives can view aggregated metrics and reports without child identifiers

**Independent Test**: Executive can login and view metrics/reports with no child-level data exposed

### Tests for User Story 6 ⚠️

- [ ] T141 [P] [US6] Integration test for executive metrics endpoint in __tests__/integration/exec/metrics.test.ts
- [ ] T142 [P] [US6] Integration test ensuring no child identifiers in responses in __tests__/integration/exec/privacy.test.ts

### Implementation for User Story 6

- [X] T143 [P] [US6] Implement GET /api/v1/exec/metrics endpoint in app/api/v1/exec/metrics/route.ts
- [X] T144 [P] [US6] Implement GET /api/v1/exec/reports endpoint in app/api/v1/exec/reports/route.ts
- [X] T145 [US6] Add authorization ensuring only EXECUTIVE or PRINCIPAL can access exec endpoints
- [X] T146 [US6] Ensure no child identifiers are included in executive responses
- [X] T147 [US6] Create metrics dashboard component in components/exec/MetricsDashboard.tsx
- [X] T148 [US6] Create reports view component in components/exec/ReportsView.tsx
- [X] T149 [US6] Build executive portal metrics page in app/exec/metrics/page.tsx
- [X] T150 [US6] Build executive portal reports page in app/exec/reports/page.tsx

**Checkpoint**: Executive dashboard is functional with proper privacy controls

---

## Phase 9: Public Website (Priority: P7)

**Goal**: Visitors can browse public pages and access apply/register CTAs

**Independent Test**: Visitor can view all public pages without login and click apply CTA

### Implementation for Public Website

- [X] T151 [P] [US7] Create home page in app/page.tsx
- [X] T152 [P] [US7] Create about page in app/about/page.tsx
- [X] T153 [P] [US7] Create programs page in app/programs/page.tsx
- [X] T154 [P] [US7] Create fees page in app/fees/page.tsx
- [X] T155 [P] [US7] Create calendar page in app/calendar/page.tsx
- [X] T156 [P] [US7] Create contact page in app/contact/page.tsx
- [X] T157 [US7] Create shared navigation component in components/layout/Navigation.tsx
- [X] T158 [US7] Create shared footer component in components/layout/Footer.tsx
- [X] T159 [US7] Add apply/register CTAs to public pages
- [X] T160 [US7] Setup public routes to not require authentication in middleware.ts

**Checkpoint**: Public website is accessible without authentication

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T161 [P] Create seed script for development data in prisma/seed.ts
- [ ] T162 [P] Add loading states to all async operations in components
- [X] T163 [P] Add error boundaries for graceful error handling in app/error.tsx
- [ ] T164 [P] Implement toast notifications for user feedback in components/ui/Toast.tsx
- [ ] T165 [P] Add form validation error displays to all forms
- [ ] T166 [US3] Build admin audit logs viewer page in app/admin/audit/page.tsx
- [ ] T167 Setup Vercel deployment configuration in vercel.json
- [ ] T168 Configure Prisma logging for development in lib/db.ts
- [ ] T169 Add API response types in lib/types/api.ts
- [X] T170 [P] Create shared UI components (Button, Input, Select, etc.) in components/ui/
- [ ] T171 Add loading skeletons for data fetching states
- [X] T172 Add 404 page in app/not-found.tsx
- [X] T173 Add 500 error page in app/error.tsx
- [X] T174 Create README with setup instructions
- [ ] T175 [P] Add JSDoc comments to all utility functions
- [ ] T176 Optimize images and add lazy loading where appropriate
- [ ] T177 Run accessibility audit and fix issues
- [ ] T178 Add meta tags for SEO in layout.tsx
- [ ] T179 Test application across different viewport sizes
- [ ] T180 Run Lighthouse audit and address performance issues

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundational phase completion
  - US1 (Auth): Can start after Foundational - No dependencies on other stories
  - US2 (Parent Application): Depends on US1 (Auth) - Needs authentication to work
  - US3 (Admin Review): Depends on US2 (Parent Application) - Needs applications to review
  - US4 (Teacher Portal): Depends on US3 (Admin Review) - Needs enrollments and classes
  - US5 (Messaging): Depends on US2, US3, US4 - Needs parent, teacher, and enrollment data
  - US6 (Executive): Can start after US3 - Needs enrollment data for metrics
  - US7 (Public Website): Independent - Can be done anytime after Setup
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- API endpoints before UI components
- Authorization/validation before endpoint implementation
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational Prisma model definitions marked [P] can run in parallel
- Tests for a user story marked [P] can run in parallel
- API endpoints within a story marked [P] can run in parallel (different files)
- UI pages/components within a story marked [P] can run in parallel (different files)
- Polish tasks marked [P] can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Auth + RBAC)
4. Complete Phase 4: User Story 2 (Parent Application)
5. **STOP and VALIDATE**: Test end-to-end parent registration and application flow
6. Deploy/demo if ready

### Full Feature Set

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Auth) → Test independently
3. Add User Story 2 (Parent App) → Test independently → MVP!
4. Add User Story 3 (Admin Review) → Test independently
5. Add User Story 4 (Teacher Portal) → Test independently
6. Add User Story 5 (Messaging) → Test independently
7. Add User Story 6 (Executive) → Test independently
8. Add User Story 7 (Public Website) → Test independently
9. Polish and deploy

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Auth)
   - Wait for US1 completion
   - Developer A: User Story 2 (Parent App)
   - Developer B: User Story 7 (Public Website) - can run in parallel
3. After US2 complete:
   - Developer A: User Story 3 (Admin Review)
   - Developer B: Continue US7
4. After US3 complete:
   - Developer A: User Story 4 (Teacher Portal)
   - Developer B: User Story 6 (Executive)
5. After US4 complete:
   - Developer A+B: User Story 5 (Messaging) - complex, work together
6. Polish phase together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Verify tests fail before implementing (TDD approach)
- Commit after each task or logical group
- Run tests after each phase to verify functionality
- Authorization checks are critical - test thoroughly
- Audit logs must be created for all sensitive operations
- Follow constitution principles: code quality, testing, security, performance
- Keep PRs small (<400 lines) for effective review

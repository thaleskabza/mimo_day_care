# MiMo Day Care Platform

A comprehensive web platform for managing day care operations with role-based access for parents, teachers, administrators, executives, and principals.

## Tech Stack

- **Frontend/Backend**: Next.js 15+ with App Router
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js with JWT strategy
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Language**: TypeScript

## Features

- **Multi-role Authentication & Authorization**: Parent, Teacher, Admin, Executive, Principal
- **Parent Portal**: Child profiles, application management, enrollment tracking
- **Teacher Portal**: Class roster, child/parent access, messaging
- **Admin Portal**: Application review, enrollment management, staff management
- **Executive Portal**: Metrics and reports with privacy controls
- **Messaging System**: Parent-teacher communication with audit visibility
- **Audit Logging**: Comprehensive tracking of sensitive operations
- **State Machine Workflows**: Application and enrollment status transitions

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── auth/          # NextAuth endpoints
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components (to be created)
├── lib/                   # Utility libraries
│   ├── auth/              # Authentication utilities
│   │   ├── config.ts      # NextAuth configuration
│   │   ├── guards.ts      # RBAC guard functions
│   │   └── password.ts    # Password hashing
│   ├── validations/       # Zod schemas
│   ├── validators/        # State transition validators
│   ├── audit.ts           # Audit logging
│   └── db.ts              # Prisma client
├── prisma/                # Prisma schema and migrations
│   └── schema.prisma      # Database schema
├── specs/                 # Feature specifications
│   └── 001-mimo-daycare-mvp/
│       ├── plan.md        # Technical plan
│       ├── data-model.md  # Data model
│       └── tasks.md       # Implementation tasks
└── generated/             # Generated Prisma client (gitignored)
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd mimo_day_care
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Your application URL (http://localhost:3000 for local dev)

4. Run database migrations
   ```bash
   npx prisma migrate dev --name init
   ```

5. Generate Prisma Client
   ```bash
   npx prisma generate
   ```

6. (Optional) Seed the database with sample data
   ```bash
   npm run seed
   ```

7. Start the development server
   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma Client

## Database Schema

The application uses the following main entities:

- **User** - Base user account with authentication
- **UserRole** - Role assignments (PARENT, TEACHER, ADMIN, EXECUTIVE, PRINCIPAL)
- **ParentProfile** - Extended parent information
- **TeacherProfile** - Extended teacher information
- **Child** - Child profiles managed by parents
- **Program** - Day care programs with age ranges
- **Class** - Classes within programs with teacher assignments
- **Application** - Child enrollment applications with status workflow
- **Enrollment** - Active enrollments linking children to classes
- **MessageThread** - Communication threads between parents and teachers
- **Message** - Individual messages within threads
- **AuditLog** - Audit trail for sensitive operations

## Architecture

### Authentication Flow

1. User registers/logs in via NextAuth with credentials
2. JWT token includes user ID and roles
3. Middleware protects routes based on roles
4. API endpoints verify authorization server-side

### Authorization Layers

1. **Middleware** - Route-level protection
2. **API Handlers** - Endpoint-level authorization and relationship checks
3. **Database** - Unique constraints and referential integrity

### State Machines

- **Application**: DRAFT → SUBMITTED → UNDER_REVIEW → {APPROVED|WAITLISTED|REJECTED}
- **Enrollment**: PENDING → ACTIVE → {PAUSED|ENDED}

## Development Status

✅ **Phase 1 Complete**: Project setup and configuration
✅ **Phase 2 Complete**: Foundational infrastructure (21/23 tasks)
- Prisma schema with all models
- Authentication and authorization system
- RBAC guards and middleware
- Audit logging utilities
- State transition validators

⏳ **Remaining Setup**: Database migration and Prisma client generation (requires DATABASE_URL)

🚧 **Next**: Phase 3 - Authentication UI and API endpoints

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT sessions for stateless authentication
- Role-based access control (RBAC)
- Input validation with Zod
- Audit logging for sensitive operations
- Route protection with Next.js middleware
- Server-side authorization checks

## Contributing

This project follows the Mimo Day Care Constitution for code quality, testing standards, UX consistency, and performance requirements. See [.specify/memory/constitution.md](.specify/memory/constitution.md) for details.

## License

[Add your license here]

## Support

[Add support contact information]

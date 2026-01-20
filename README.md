# MiMo Day Care - Management Platform

A comprehensive web application for managing day care operations, built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features
## A
### For Parents
- 👨‍👩‍👧‍👦 Manage children profiles
- 📝 Submit and track applications
- 💬 Message teachers directly
- 📊 View enrollment status

### For Teachers
- 👩‍🏫 View assigned classes and rosters
- 📋 Access child profiles and allergy information
- 💬 Communicate with parents
- 📅 Manage daily activities

### For Administrators
- ✅ Review and approve applications
- 📚 Manage enrollments and classes
- 👥 Oversee staff and programs
- 📊 View audit logs

### For Executives
- 📈 View aggregated metrics (privacy-compliant)
- 📊 Generate reports (enrollment, financial, capacity)
- 📉 Track trends and performance

### Public Website
- 🏠 Informational pages (About, Programs, Fees, Calendar, Contact)
- 📱 Responsive design
- 📞 Contact forms
- 📅 Event calendar

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 7
- **Authentication**: NextAuth.js v4
- **Styling**: Tailwind CSS v4
- **Validation**: Zod
- **Testing**: Jest, React Testing Library, Playwright
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 18.x or 20.x
- PostgreSQL database (or Neon account)
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/thaleskabza/mimo_day_care.git
cd mimo_day_care
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mimo_daycare"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Node Environment
NODE_ENV="development"
```

### 4. Set up the database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database with sample data
npm run db:seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Test Accounts

After running the seed script, you can log in with these accounts (password: `Password123!`):

| Role | Email | Access |
|------|-------|--------|
| Principal | principal@mimodaycare.com | All portals (Admin, Executive, Teacher) |
| Admin | admin@mimodaycare.com | Admin portal |
| Executive | executive@mimodaycare.com | Executive dashboard |
| Teacher 1 | teacher1@mimodaycare.com | Teacher portal (Sunshine & Stars rooms) |
| Teacher 2 | teacher2@mimodaycare.com | Teacher portal (Rainbow & Explorers rooms) |
| Parent 1 | parent1@example.com | Parent portal (2 children) |
| Parent 2 | parent2@example.com | Parent portal (1 child) |
| Parent 3 | parent3@example.com | Parent portal (1 child) |

## Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

### Database

```bash
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma generate  # Generate Prisma Client
npx prisma migrate dev  # Run migrations
npm run db:seed      # Seed database with sample data
```

### Testing

```bash
# Unit & Integration Tests
npm test                  # Run all Jest tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage report
npm run test:ci           # Run tests in CI mode

# End-to-End Tests
npm run test:e2e          # Run Playwright E2E tests
npm run test:e2e:ui       # Run E2E tests with UI (interactive)
npm run test:e2e:headed   # Run E2E tests in headed mode
npm run test:e2e:debug    # Debug E2E tests
npm run test:e2e:report   # View last E2E test report

# All Tests
npm run test:all          # Run both Jest and Playwright tests
```

## Project Structure

```
mimo_day_care/
├── app/                    # Next.js App Router pages
│   ├── api/v1/            # API routes
│   │   ├── admin/         # Admin endpoints
│   │   ├── auth/          # Authentication endpoints
│   │   ├── exec/          # Executive endpoints
│   │   ├── messages/      # Messaging endpoints
│   │   ├── parent/        # Parent endpoints
│   │   ├── programs/      # Programs endpoints
│   │   └── teacher/       # Teacher endpoints
│   ├── about/             # Public about page
│   ├── admin/             # Admin portal
│   ├── calendar/          # Public calendar page
│   ├── contact/           # Public contact page
│   ├── exec/              # Executive dashboard
│   ├── fees/              # Public fees page
│   ├── login/             # Login page
│   ├── parent/            # Parent portal
│   ├── programs/          # Public programs page
│   ├── register/          # Registration page
│   ├── teacher/           # Teacher portal
│   ├── unauthorized/      # Unauthorized access page
│   ├── error.tsx          # Error boundary
│   ├── global-error.tsx   # Global error handler
│   ├── layout.tsx         # Root layout
│   ├── not-found.tsx      # 404 page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── exec/             # Executive-specific components
│   ├── layout/           # Layout components (Nav, Footer)
│   ├── messaging/        # Messaging components
│   ├── parent/           # Parent-specific components
│   ├── providers/        # Context providers
│   └── teacher/          # Teacher-specific components
├── lib/                  # Utilities and helpers
│   ├── auth/             # Auth utilities (guards, password)
│   ├── validations/      # Zod validation schemas
│   ├── validators/       # State transition validators
│   ├── audit.ts          # Audit logging
│   └── db.ts             # Prisma client
├── prisma/               # Database
│   ├── migrations/       # Migration files
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
├── __tests__/            # Jest tests
│   ├── integration/      # Integration tests
│   └── unit/             # Unit tests
├── e2e/                  # Playwright E2E tests
│   ├── admin/            # Admin portal tests
│   ├── auth/             # Authentication tests
│   ├── parent/           # Parent portal tests
│   ├── public/           # Public pages tests
│   ├── teacher/          # Teacher portal tests
│   └── navigation.spec.ts # Navigation tests
├── specs/                # Design documents
├── .env                  # Environment variables (create this)
├── jest.config.ts        # Jest configuration
├── playwright.config.ts  # Playwright configuration
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
├── TESTING.md            # Testing documentation
└── README.md             # This file
```

## Database Schema

The application uses the following main models:

- **User**: Authentication and authorization
- **Child**: Child profiles
- **Application**: Enrollment applications
- **Enrollment**: Active enrollments
- **Class**: Classroom assignments
- **Program**: Care programs (Infant, Toddler, Preschool, Pre-K)
- **MessageThread**: Parent-teacher communication threads
- **Message**: Individual messages
- **AuditLog**: Audit trail for sensitive operations

For detailed schema, see [prisma/schema.prisma](prisma/schema.prisma).

## Role-Based Access Control (RBAC)

The application implements five roles:

1. **PARENT**: Manage children and applications, communicate with teachers
2. **TEACHER**: View assigned classes, access student information, communicate with parents
3. **ADMIN**: Review applications, manage enrollments, oversee operations
4. **EXECUTIVE**: View aggregated metrics and reports (privacy-compliant)
5. **PRINCIPAL**: All permissions (combination of Admin, Executive roles)

Access is enforced at the middleware level and within API routes.

## API Routes

All API routes are versioned under `/api/v1/`:

- `/api/v1/auth/*` - Authentication (login, register)
- `/api/v1/parent/*` - Parent operations (children, applications)
- `/api/v1/teacher/*` - Teacher operations (classes, roster)
- `/api/v1/admin/*` - Admin operations (applications, enrollments, programs)
- `/api/v1/exec/*` - Executive operations (metrics, reports)
- `/api/v1/messages/*` - Messaging system

## Security Features

- 🔐 JWT-based authentication with NextAuth
- 🛡️ Role-based access control (RBAC)
- 🔒 Middleware-level route protection
- 📝 Audit logging for sensitive operations
- 🔑 Password hashing with bcrypt
- 🚫 Input validation with Zod
- 🕵️ Privacy-compliant executive endpoints (no child identifiers)

## Testing

The project includes comprehensive test coverage:

- **Unit Tests**: Validation schemas, state transitions, utilities
- **Integration Tests**: API routes, authentication, authorization
- **E2E Tests**: User workflows across all portals
- **CI/CD**: GitHub Actions workflow for automated testing

See [TESTING.md](TESTING.md) for detailed testing documentation.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

Ensure you have:
- Database connection configured
- Environment variables set
- Prisma migrations run

## Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | `postgresql://...` |
| NEXTAUTH_URL | Application URL | `http://localhost:3000` |
| NEXTAUTH_SECRET | Secret for JWT signing | Generate with `openssl rand -base64 32` |
| NODE_ENV | Node environment | `development` or `production` |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support, email info@mimodaycare.com or open an issue on GitHub.

## License

ISC License

## Acknowledgments

- Next.js Team for the amazing framework
- Prisma Team for the excellent ORM
- Vercel for hosting and deployment platform
- All contributors and testers

---

Built with ❤️ by the MiMo Day Care team

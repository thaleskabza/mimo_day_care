# Non-Functional Requirements: Security, Privacy, Performance

## Security
- Passwords hashed using modern algorithm (e.g., argon2/bcrypt)
- JWT or session-based auth with expiry + refresh strategy
- CSRF protection if cookie sessions are used
- Rate limit login and registration endpoints
- Server-side RBAC checks on every protected endpoint

## Privacy
- Child and parent data never exposed publicly
- Executive dashboards must be aggregated and avoid direct child-identifiers
- Admin audit trail required for:
  - role changes
  - application status changes
  - enrollment creation/activation
  - class assignment changes

## Performance
- Pages should load fast on mobile
- Teacher roster view should handle realistic class sizes efficiently (pagination if needed)

## Reliability
- All state transitions validated
- Idempotency for critical actions where replays are possible (e.g., activate enrollment)

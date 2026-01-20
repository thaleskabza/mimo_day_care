# Deployment Guide - MiMo Day Care

## Vercel Deployment

### Required Environment Variables

Add these to your Vercel project settings:

1. **DATABASE_URL** (Required)
   - Your PostgreSQL connection string
   - Example: `postgresql://user:password@host.neon.tech/database?sslmode=require`
   - Get from: Neon, Supabase, or your PostgreSQL provider

2. **NEXTAUTH_URL** (Required)
   - Your production URL
   - Vercel will auto-populate this, but you can override
   - Example: `https://your-app.vercel.app`

3. **NEXTAUTH_SECRET** (Required)
   - Generate with: `openssl rand -base64 32`
   - Keep this secret and secure
   - Example: `kL8mN9pQ2rS3tU4vW5xY6zA7bC8dE9fF0gH1iJ2kL3m=`

4. **NODE_ENV** (Auto-set by Vercel)
   - Automatically set to `production` by Vercel
   - No action needed

### Database Setup

Before deploying, ensure your database is ready:

```bash
# On your local machine with DATABASE_URL set:

# 1. Generate Prisma Client
npx prisma generate

# 2. Run migrations
npx prisma migrate deploy

# 3. (Optional) Seed with test data
npm run db:seed
```

### Deployment Steps

#### Method 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables (see above)
6. Click "Deploy"

Vercel will automatically:
- Install dependencies
- Run `npm run build`
- Deploy to production

#### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET

# Deploy to production
vercel --prod
```

### Post-Deployment

After successful deployment:

1. **Run Database Migrations**
   ```bash
   # Option 1: From local machine
   DATABASE_URL="your-production-url" npx prisma migrate deploy

   # Option 2: Add as Vercel build command (not recommended for migrations)
   ```

2. **Seed Production Data** (if needed)
   ```bash
   DATABASE_URL="your-production-url" npm run db:seed
   ```

3. **Test the Deployment**
   - Visit your Vercel URL
   - Try logging in with test accounts
   - Test all user flows

4. **Monitor**
   - Check Vercel logs for errors
   - Monitor database connections
   - Watch for performance issues

### Build Configuration

The project uses these build settings (auto-detected by Vercel):

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### Troubleshooting

#### Build Failures

**Error: "Cannot find module 'next/jest'"**
- Solution: Already fixed - `next` is a dependency

**Error: "Missing environment variable: DATABASE_URL"**
- Solution: Add DATABASE_URL to Vercel environment variables

**Error: "Prisma Client not generated"**
- Solution: Add postinstall script: `"postinstall": "prisma generate"`

#### Runtime Errors

**Error: "Can't reach database server"**
- Check DATABASE_URL format
- Ensure database accepts connections from 0.0.0.0/0
- Verify SSL mode is enabled

**Error: "Invalid NEXTAUTH_SECRET"**
- Generate new secret: `openssl rand -base64 32`
- Add to Vercel environment variables

**Error: "NEXTAUTH_URL not set"**
- Add your Vercel URL to NEXTAUTH_URL environment variable

### Performance Optimization

For production:

1. **Enable Edge Runtime** (optional)
   ```typescript
   export const runtime = 'edge';
   ```

2. **Add Caching Headers**
   - Static assets cached automatically
   - API routes can add cache headers

3. **Optimize Images**
   - Use Next.js Image component
   - Already implemented in most places

4. **Database Connection Pooling**
   - Already configured with Neon adapter
   - Uses connection pooling by default

### Security Checklist

- [ ] DATABASE_URL uses SSL (`?sslmode=require`)
- [ ] NEXTAUTH_SECRET is strong (32+ characters)
- [ ] Environment variables set in Vercel (not in code)
- [ ] Database has row-level security (if using Supabase)
- [ ] API rate limiting enabled (TODO)
- [ ] CORS configured correctly

### Monitoring

Set up monitoring for:

1. **Error Tracking**
   - Vercel Analytics (included)
   - Sentry (optional)

2. **Performance**
   - Vercel Speed Insights
   - Web Vitals

3. **Database**
   - Neon/Supabase dashboard
   - Query performance
   - Connection pool usage

### Rollback

If deployment fails:

```bash
# Revert to previous deployment
vercel rollback

# Or redeploy specific commit
vercel --prod <git-commit-sha>
```

### Support

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Prisma Documentation: https://www.prisma.io/docs
- Project README: [README.md](./README.md)

---

**Last Updated**: 2026-01-20
**Deployment Status**: ✅ Ready for Production

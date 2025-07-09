# 🚀 Elevate Platform - Deployment Guide

## Quick Deploy

### 1. Build for Production
```bash
npm run build
```

### 2. Deploy Options

#### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

#### Netlify
- Drag `dist/` folder to Netlify
- Configure environment variables

#### AWS S3
```bash
aws s3 sync dist/ s3://your-bucket --delete
```

## Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_ENV=production
```

## Performance Metrics
- ✅ Bundle: 387.81 KB (110.54 KB gzipped)
- ✅ Build Time: 3.08s
- ✅ Zero Linting Errors
- ✅ Production Ready

## Health Check
```bash
curl -f https://your-domain.com
```

*Optimized for Performance - v2.0.0*

# Deployment Guide: Elevate Unified Sports Platform

## Deployment Checklist

- [ ] All code passes lint, test, and build locally
- [ ] CHANGELOG.md and DECISION_LOG.md are updated
- [ ] All environment variables are set in Vercel (or chosen platform):
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
  - (Any other secrets)
- [ ] Supabase migrations are up to date and applied
- [ ] SystemLogConsole and audit features are accessible and functional
- [ ] Sentry (or error monitoring) is configured
- [ ] Vercel Analytics and health checks are enabled
- [ ] Preview deployment is tested for accessibility and performance
- [ ] Production deployment is only from main branch
- [ ] All governance and compliance requirements are met

## Best-Practice Deployment Steps

### 1. Connect to Vercel
- Go to [vercel.com](https://vercel.com/) and connect your GitHub repository.
- Set build command: `npm run build`
- Set output directory: `dist`
- Add environment variables in Vercel dashboard.

### 2. Configure Supabase
- Ensure all migrations in `supabase/migrations/` are applied.
- Use Supabase dashboard for database and API monitoring.

### 3. Enable Monitoring
- Set up Sentry for error monitoring (recommended for production).
- Enable Vercel Analytics and health checks.

### 4. Accessibility & Audit
- Use preview deployments for accessibility and user testing.
- Confirm SystemLogConsole is accessible (keyboard, screen reader, dark mode).
- Ensure audit logs are visible and up to date.

### 5. Governance & Compliance
- Precommit protocol blocks on lint/test/build/changelog failures.
- All deployments are traceable via CHANGELOG.md and DECISION_LOG.md.
- RLS and access controls are enforced in Supabase.

### 6. Launch
- Merge to main branch for production deployment.
- Monitor with Sentry, Vercel Analytics, and SystemLogConsole.
- Share preview URLs for team and funder review.

---

## Notes for Funders & Auditors
- All deployments are auditable and compliant with enterprise standards.
- Accessibility and HCI are prioritized throughout the stack.
- SystemLogConsole provides a full audit trail for all sessions, decisions, and events.
- CHANGELOG.md and DECISION_LOG.md are updated for every release. 
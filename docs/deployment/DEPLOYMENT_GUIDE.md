# 🚀 Elevate Platform - Deployment Guide

> **Complete guide for deploying the optimized Elevate platform to production**

## 📋 Pre-Deployment Checklist

### ✅ Code Quality Verification
- [ ] All tests passing
- [ ] No linting errors (`npm run lint`)
- [ ] TypeScript compilation successful (`npm run type-check`)
- [ ] Build successful (`npm run build`)
- [ ] Performance benchmarks met

### ✅ Environment Configuration
- [ ] Supabase credentials configured
- [ ] Environment variables set
- [ ] API endpoints verified
- [ ] Database migrations applied
- [ ] Storage buckets configured

### ✅ Security Review
- [ ] No secrets in frontend code
- [ ] Environment variables properly secured
- [ ] CORS settings configured
- [ ] Rate limiting implemented
- [ ] Error handling in place

## 🏗️ Build Process

### Production Build
```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Run quality checks
npm run lint
npm run type-check

# Build for production
npm run build

# Verify build output
npm run preview
```

### Build Output
```
✓ 1599 modules transformed
✓ Built in 3.08s
✓ Bundle size: 387.81 KB (110.54 KB gzipped)
```

### Build Artifacts
- `dist/index.html` - Main HTML file
- `dist/assets/` - Optimized JavaScript and CSS bundles
- `dist/assets/index-*.js` - Main application bundle
- `dist/assets/index-*.css` - Optimized styles

## 🌐 Deployment Options

### 1. Vercel (Recommended)

#### Automatic Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Follow prompts for configuration
```

#### Manual Configuration
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@supabase-url",
    "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

### 2. Netlify

#### Drag & Drop Deployment
1. Build the project: `npm run build`
2. Drag `dist/` folder to Netlify
3. Configure environment variables in Netlify dashboard

#### Git Integration
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. AWS S3 + CloudFront

#### S3 Bucket Setup
```bash
# Create S3 bucket
aws s3 mb s3://elevate-platform

# Enable static website hosting
aws s3 website s3://elevate-platform --index-document index.html --error-document index.html

# Upload build files
aws s3 sync dist/ s3://elevate-platform --delete
```

#### CloudFront Distribution
```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

### 4. Custom Server (Node.js)

#### Express Server
```javascript
// server.js
const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 🔧 Environment Configuration

### Required Environment Variables
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Application Configuration
VITE_APP_ENV=production
VITE_APP_VERSION=2.0.0
VITE_APP_NAME=Elevate Platform

# Optional: Analytics
VITE_ANALYTICS_ID=your-analytics-id
VITE_SENTRY_DSN=your-sentry-dsn
```

### Environment-Specific Configurations

#### Development
```env
VITE_APP_ENV=development
VITE_DEBUG=true
VITE_API_TIMEOUT=30000
```

#### Staging
```env
VITE_APP_ENV=staging
VITE_DEBUG=false
VITE_API_TIMEOUT=15000
```

#### Production
```env
VITE_APP_ENV=production
VITE_DEBUG=false
VITE_API_TIMEOUT=10000
```

## 🔒 Security Configuration

### CORS Settings
```javascript
// Supabase CORS configuration
{
  "cors": {
    "allowedOrigins": [
      "https://your-domain.com",
      "https://www.your-domain.com"
    ],
    "allowedMethods": ["GET", "POST", "PUT", "DELETE"],
    "allowedHeaders": ["Content-Type", "Authorization"]
  }
}
```

### Content Security Policy
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src 'self' https://fonts.gstatic.com; 
               img-src 'self' data: https:; 
               connect-src 'self' https://*.supabase.co;">
```

## 📊 Performance Monitoring

### Build Analytics
```bash
# Analyze bundle size
npm install -g vite-bundle-analyzer
vite-bundle-analyzer dist

# Performance audit
npm install -g lighthouse
lighthouse https://your-domain.com --output html
```

### Runtime Monitoring
```javascript
// Performance monitoring setup
if (process.env.NODE_ENV === 'production') {
  // Web Vitals monitoring
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint
    
    - name: Build application
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 🚨 Post-Deployment Verification

### Health Checks
```bash
# Check application status
curl -f https://your-domain.com/health

# Verify API connectivity
curl -f https://your-domain.com/api/status

# Test Supabase connection
curl -f https://your-domain.com/api/test-connection
```

### Performance Validation
- [ ] **Lighthouse Score**: > 90 for all metrics
- [ ] **First Contentful Paint**: < 1.5s
- [ ] **Largest Contentful Paint**: < 2.5s
- [ ] **Cumulative Layout Shift**: < 0.1
- [ ] **First Input Delay**: < 100ms

### Functionality Testing
- [ ] User authentication works
- [ ] File uploads function properly
- [ ] Database operations successful
- [ ] Real-time updates working
- [ ] Error handling displays correctly

## 📈 Monitoring & Alerting

### Application Monitoring
```javascript
// Error tracking setup
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.VITE_APP_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
});
```

### Performance Metrics
- **Uptime**: Target 99.9%
- **Response Time**: < 200ms average
- **Error Rate**: < 0.1%
- **Bundle Size**: < 400KB gzipped
- **Build Time**: < 4 seconds

## 🔄 Rollback Procedures

### Quick Rollback
```bash
# Vercel rollback
vercel rollback

# Netlify rollback
netlify rollback

# AWS rollback
aws s3 sync s3://backup-bucket/previous-version/ s3://production-bucket/
```

### Database Rollback
```sql
-- Supabase rollback
BEGIN;
-- Rollback migrations
ROLLBACK;
```

## 📞 Support & Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules .vite dist
npm install
npm run build
```

#### Environment Issues
```bash
# Verify environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

#### Performance Issues
```bash
# Analyze bundle
npm run analyze

# Check for memory leaks
node --inspect npm run dev
```

### Contact Information
- **Technical Support**: tech@elevate.com
- **Emergency Contact**: +1-555-0123
- **Documentation**: https://docs.elevate.com
- **Status Page**: https://status.elevate.com

---

**Elevate Platform v2.0.0** - *Production Deployment Guide*

*Last updated: January 15, 2024* 
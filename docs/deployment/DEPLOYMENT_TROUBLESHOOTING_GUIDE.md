# 🚨 DEPLOYMENT TROUBLESHOOTING GUIDE
## Common Issues & Solutions

**Date**: 2025-01-07  
**Status**: ACTIVE  
**Purpose**: Quick reference for deployment and integration issues  

---

## 🚀 **DEPLOYMENT ISSUES**

### **1. Netlify Build Failures**

#### **Issue**: Build command fails
```bash
# Error: Build command failed
npm run build
```

**Solutions**:
```bash
# 1. Check Node.js version
node --version  # Should be 18+ for Vite 7

# 2. Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# 3. Check for TypeScript errors
npm run lint

# 4. Test build locally
npm run build
```

#### **Issue**: Multi-page build not working
```bash
# Error: Cannot find entry point
```

**Solutions**:
```typescript
// Check vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        elevate: resolve(__dirname, 'elevate/index.html'),
        administrate: resolve(__dirname, 'administrate/index.html'),
        elaborate: resolve(__dirname, 'elaborate/index.html')
      }
    }
  }
});
```

#### **Issue**: Environment variables not loading
```bash
# Error: VITE_* variables undefined
```

**Solutions**:
```bash
# 1. Check Netlify environment variables
# Go to Site settings > Environment variables

# 2. Verify variable names start with VITE_
VITE_APP_ENV=production
VITE_APP_DEPLOYMENT=netlify

# 3. Redeploy after adding variables
git commit --allow-empty -m "Trigger rebuild"
git push origin main
```

### **2. Vercel Build Failures**

#### **Issue**: Greenlight deployment fails
```bash
# Error: Build timeout or memory limit
```

**Solutions**:
```bash
# 1. Check vercel.json configuration
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}

# 2. Optimize build performance
# Add to package.json
{
  "scripts": {
    "build": "vite build --mode production"
  }
}

# 3. Check for large dependencies
npm ls --depth=0
```

---

## 🔗 **INTEGRATION ISSUES**

### **1. SystemRedirect Not Working**

#### **Issue**: No automatic redirection
```typescript
// Check SystemRedirect component
useEffect(() => {
  const timer = setTimeout(() => {
    window.open('https://greenlight.live', '_blank');
  }, 3000);
  return () => clearTimeout(timer);
}, []);
```

**Solutions**:
```typescript
// 1. Add error handling
useEffect(() => {
  const timer = setTimeout(() => {
    try {
      window.open('https://greenlight.live', '_blank');
    } catch (error) {
      console.error('Redirect failed:', error);
      // Fallback to manual redirect
    }
  }, 3000);
  return () => clearTimeout(timer);
}, []);

// 2. Check environment variable
const greenlightUrl = import.meta.env.VITE_GREENLIGHT_URL || 'https://greenlight.live';
```

#### **Issue**: Cross-origin errors
```bash
# Error: CORS policy blocked
```

**Solutions**:
```typescript
// 1. Add CORS headers in API responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// 2. Use proxy for development
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api/greenlight': {
        target: 'https://greenlight.live',
        changeOrigin: true
      }
    }
  }
});
```

### **2. Authentication Failures**

#### **Issue**: Token validation fails
```typescript
// Error: Invalid token
```

**Solutions**:
```typescript
// 1. Check token format
const validateToken = (token: string) => {
  if (!token || token.length < 10) {
    return false;
  }
  return true;
};

// 2. Add token refresh logic
const refreshToken = async () => {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    const { newToken } = await response.json();
    return newToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};
```

---

## 📊 **MONITORING ISSUES**

### **1. Health Check Failures**

#### **Issue**: Health endpoint not responding
```bash
# Error: 404 or 500 on /api/health
```

**Solutions**:
```typescript
// 1. Create health check endpoint
// api/health.js
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    products: {
      elevate: 'healthy',
      administrate: 'healthy',
      elaborate: 'healthy'
    }
  });
}

// 2. Add error handling
const healthCheck = async () => {
  try {
    const response = await fetch('/api/health');
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    return { status: 'unhealthy', error: error.message };
  }
};
```

### **2. Performance Issues**

#### **Issue**: Slow page loads
```bash
# Performance warning: Large chunks
```

**Solutions**:
```typescript
// 1. Implement code splitting
const LazyComponent = lazy(() => import('./HeavyComponent'));

// 2. Optimize bundle size
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'axios']
        }
      }
    }
  }
});

// 3. Add performance monitoring
const measurePerformance = () => {
  const navigation = performance.getEntriesByType('navigation')[0];
  console.log('Page load time:', navigation.loadEventEnd - navigation.loadEventStart);
};
```

---

## 🔧 **ENVIRONMENT ISSUES**

### **1. Environment Variables**

#### **Issue**: Variables not loading in production
```bash
# Error: process.env is undefined
```

**Solutions**:
```typescript
// 1. Use Vite environment variables
const apiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;

// 2. Add fallback values
const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'https://api.default.com',
  greenlightUrl: import.meta.env.VITE_GREENLIGHT_URL || 'https://greenlight.live'
};

// 3. Validate environment on startup
const validateEnvironment = () => {
  const required = ['VITE_API_URL', 'VITE_GREENLIGHT_URL'];
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing environment variables:', missing);
    return false;
  }
  return true;
};
```

### **2. Database Connection Issues**

#### **Issue**: Supabase connection fails
```typescript
// Error: Supabase client initialization failed
```

**Solutions**:
```typescript
// 1. Check environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials missing');
}

// 2. Add connection retry logic
const createSupabaseClient = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = createClient(supabaseUrl, supabaseKey);
      await client.from('test').select('*').limit(1);
      return client;
    } catch (error) {
      console.error(`Connection attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

---

## 🚨 **EMERGENCY PROCEDURES**

### **1. Rollback Deployment**

#### **Netlify Rollback**
```bash
# 1. Go to Netlify dashboard
# 2. Navigate to Deploys tab
# 3. Find previous successful deployment
# 4. Click "Publish deploy"

# Or via CLI
netlify deploy --prod --dir=dist --site=your-site-id
```

#### **Vercel Rollback**
```bash
# 1. Go to Vercel dashboard
# 2. Navigate to Deployments
# 3. Find previous deployment
# 4. Click "Promote to Production"

# Or via CLI
vercel --prod
```

### **2. Emergency Contact**

#### **Critical Issues**
```bash
# 1. Check system status
curl https://www.topbinsid.com/api/health
curl https://greenlight.live/api/health

# 2. Review recent deployments
git log --oneline -10

# 3. Check error logs
# Netlify: Functions > Logs
# Vercel: Functions > Logs
```

---

## 📋 **PREVENTION CHECKLIST**

### **Pre-Deployment**
- [ ] Run `npm run lint` and fix all errors
- [ ] Run `npm run build` locally
- [ ] Test all critical user flows
- [ ] Verify environment variables
- [ ] Check API endpoints

### **Post-Deployment**
- [ ] Verify health checks pass
- [ ] Test SystemRedirect functionality
- [ ] Check cross-repository communication
- [ ] Monitor error logs
- [ ] Validate user experience

### **Ongoing Monitoring**
- [ ] Set up error alerting
- [ ] Monitor performance metrics
- [ ] Regular security updates
- [ ] Backup verification
- [ ] User feedback collection

---

**Status**: ✅ TROUBLESHOOTING GUIDE COMPLETE  
**Next**: Final validation and testing  
**Maintenance**: Update as new issues arise 
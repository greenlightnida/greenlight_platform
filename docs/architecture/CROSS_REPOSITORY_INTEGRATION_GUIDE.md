# 🔗 CROSS-REPOSITORY INTEGRATION GUIDE
## Top_Bins ↔ Greenlight Communication

**Date**: 2025-01-07  
**Status**: ACTIVE  
**Purpose**: Guide for cross-repository communication and integration  

---

## 🎯 **ARCHITECTURE OVERVIEW**

### **Repository Separation**
```
Top_Bins (Netlify)          Greenlight (Vercel)
├── Elevate Product         ├── System Governance
├── Administrate Product    ├── Holon Management
├── Elaborate Documentation ├── Monitoring & Analytics
└── Product Features        └── System Services
```

### **Communication Flow**
```
User → Top_Bins Product → SystemRedirect → Greenlight System
User → Greenlight System → Product Registry → Top_Bins Products
```

---

## 🔧 **INTEGRATION POINTS**

### **1. SystemRedirect Component**
**Location**: `src/components/SystemRedirect.tsx`  
**Purpose**: Seamless redirection from Top_Bins to Greenlight

```typescript
// Automatic redirection after 3 seconds
useEffect(() => {
  const timer = setTimeout(() => {
    window.open('https://greenlight.live', '_blank');
  }, 3000);
  return () => clearTimeout(timer);
}, []);
```

### **2. Product Registration**
**Location**: Greenlight System Registry  
**Purpose**: Track Top_Bins products in Greenlight system

```typescript
// Product registry in Greenlight
const PRODUCT_REGISTRY = {
  elevate: {
    url: 'https://elevate.www.topbinsid.com',
    status: 'active',
    features: ['coaching', 'player-management', 'media-library']
  },
  administrate: {
    url: 'https://administrate.www.topbinsid.com',
    status: 'active',
    features: ['business-management', 'executive-dashboard']
  },
  elaborate: {
    url: 'https://elaborate.www.topbinsid.com',
    status: 'active',
    features: ['documentation', 'architecture']
  }
};
```

### **3. Cross-Repository Authentication**
**Location**: Shared authentication service  
**Purpose**: Unified user authentication across platforms

```typescript
// Authentication flow
const authFlow = {
  // User logs into Top_Bins
  topBinsLogin: async (credentials) => {
    const token = await authenticateUser(credentials);
    // Token shared with Greenlight via secure channel
    return { token, redirectUrl: 'https://greenlight.live' };
  },
  
  // User logs into Greenlight
  greenlightLogin: async (credentials) => {
    const token = await authenticateUser(credentials);
    // Token validated against shared auth service
    return { token, productAccess: PRODUCT_REGISTRY };
  }
};
```

---

## 🌐 **API ENDPOINTS**

### **Top_Bins API Endpoints**
```typescript
// Product status endpoint
GET /api/products/status
Response: {
  elevate: { status: 'active', version: '2.0.0' },
  administrate: { status: 'active', version: '1.0.0' },
  elaborate: { status: 'active', version: '1.0.0' }
}

// Product health check
GET /api/products/health
Response: {
  overall: 'healthy',
  products: {
    elevate: { status: 'healthy', uptime: '99.9%' },
    administrate: { status: 'healthy', uptime: '99.9%' },
    elaborate: { status: 'healthy', uptime: '99.9%' }
  }
}
```

### **Greenlight API Endpoints**
```typescript
// System governance endpoint
GET /api/system/governance
Response: {
  holons: ['elevate', 'administrate', 'elaborate'],
  status: 'healthy',
  lastUpdated: '2025-01-07T10:00:00Z'
}

// Product monitoring endpoint
GET /api/monitoring/products
Response: {
  products: [
    {
      id: 'elevate',
      status: 'active',
      metrics: { users: 150, sessions: 300, uptime: '99.9%' }
    }
  ]
}
```

---

## 🔐 **AUTHENTICATION & SECURITY**

### **Shared Authentication Service**
```typescript
// Environment variables
VITE_SHARED_AUTH_URL=https://auth.greenlight.live
VITE_SHARED_AUTH_TOKEN=your-secure-token

// Authentication middleware
const authenticateRequest = async (request: Request) => {
  const token = request.headers.get('Authorization');
  const isValid = await validateToken(token);
  return isValid ? { user: await getUserFromToken(token) } : null;
};
```

### **Cross-Repository Security**
- **HTTPS Only**: All communication over secure channels
- **Token Validation**: Shared authentication tokens
- **CORS Configuration**: Proper cross-origin resource sharing
- **Rate Limiting**: Prevent abuse of cross-repository APIs

---

## 📊 **MONITORING & HEALTH CHECKS**

### **Health Check Endpoints**
```typescript
// Top_Bins health check
GET /api/health
Response: {
  status: 'healthy',
  timestamp: '2025-01-07T10:00:00Z',
  products: {
    elevate: 'healthy',
    administrate: 'healthy',
    elaborate: 'healthy'
  }
}

// Greenlight health check
GET /api/health
Response: {
  status: 'healthy',
  timestamp: '2025-01-07T10:00:00Z',
  system: {
    governance: 'healthy',
    monitoring: 'healthy',
    analytics: 'healthy'
  }
}
```

### **Cross-Repository Monitoring**
```typescript
// Monitoring service
const monitorCrossRepositoryHealth = async () => {
  const topBinsHealth = await fetch('https://www.topbinsid.com/api/health');
  const greenlightHealth = await fetch('https://greenlight.live/api/health');
  
  return {
    topBins: await topBinsHealth.json(),
    greenlight: await greenlightHealth.json(),
    overall: determineOverallHealth(topBinsHealth, greenlightHealth)
  };
};
```

---

## 🚀 **DEPLOYMENT COORDINATION**

### **Deployment Sequence**
1. **Greenlight Deployment** (Vercel)
   - Deploy system governance first
   - Verify API endpoints
   - Update product registry

2. **Top_Bins Deployment** (Netlify)
   - Deploy product updates
   - Verify SystemRedirect functionality
   - Test cross-repository communication

3. **Integration Testing**
   - Test authentication flow
   - Verify health checks
   - Validate monitoring

### **Rollback Procedures**
```typescript
// Rollback checklist
const rollbackChecklist = {
  greenlight: [
    'Revert to previous Vercel deployment',
    'Update product registry',
    'Verify system governance'
  ],
  topBins: [
    'Revert to previous Netlify deployment',
    'Test SystemRedirect functionality',
    'Verify product functionality'
  ]
};
```

---

## 🔧 **ENVIRONMENT VARIABLES**

### **Top_Bins Environment Variables**
```bash
# Cross-repository communication
VITE_GREENLIGHT_URL=https://greenlight.live
VITE_SHARED_AUTH_URL=https://auth.greenlight.live
VITE_PRODUCT_REGISTRY_URL=https://greenlight.live/api/products

# Product-specific variables
VITE_ELEVATE_URL=https://elevate.www.topbinsid.com
VITE_ADMINISTRATE_URL=https://administrate.www.topbinsid.com
VITE_ELABORATE_URL=https://elaborate.www.topbinsid.com
```

### **Greenlight Environment Variables**
```bash
# Cross-repository communication
VITE_TOPBINS_URL=https://www.topbinsid.com
VITE_SHARED_AUTH_URL=https://auth.greenlight.live
VITE_PRODUCT_MONITORING_URL=https://www.topbinsid.com/api/products

# System governance variables
VITE_SYSTEM_GOVERNANCE_URL=https://greenlight.live/api/system
VITE_MONITORING_URL=https://greenlight.live/api/monitoring
```

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues**

#### **1. SystemRedirect Not Working**
```typescript
// Check redirect configuration
const checkRedirect = () => {
  const redirectUrl = import.meta.env.VITE_GREENLIGHT_URL;
  if (!redirectUrl) {
    console.error('Greenlight URL not configured');
    return false;
  }
  return true;
};
```

#### **2. Authentication Failures**
```typescript
// Debug authentication
const debugAuth = async () => {
  try {
    const response = await fetch('/api/auth/validate');
    const data = await response.json();
    console.log('Auth status:', data);
  } catch (error) {
    console.error('Auth error:', error);
  }
};
```

#### **3. Health Check Failures**
```typescript
// Health check debugging
const debugHealth = async () => {
  const endpoints = [
    'https://www.topbinsid.com/api/health',
    'https://greenlight.live/api/health'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      console.log(`${endpoint}:`, data);
    } catch (error) {
      console.error(`${endpoint} failed:`, error);
    }
  }
};
```

---

## 📋 **INTEGRATION CHECKLIST**

### **Pre-Deployment**
- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] Authentication flow validated
- [ ] Health checks implemented
- [ ] Monitoring configured

### **Post-Deployment**
- [ ] Cross-repository communication verified
- [ ] SystemRedirect functionality tested
- [ ] Product registry updated
- [ ] Health monitoring active
- [ ] Error logging configured

### **Ongoing Maintenance**
- [ ] Regular health check monitoring
- [ ] Performance metrics tracking
- [ ] Security updates applied
- [ ] Documentation updates
- [ ] User feedback collection

---

**Status**: ✅ INTEGRATION GUIDE COMPLETE  
**Next**: Architecture documentation updates  
**Maintenance**: Regular review and updates required 
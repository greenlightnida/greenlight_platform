# 🚀 DEPLOYMENT STRATEGY
## Repository to Hosting Platform Mapping

**Date**: 2025-01-07  
**Status**: ACTIVE  
**Purpose**: Clarify deployment strategy for separated repositories  

---

## 🎯 **DEPLOYMENT ARCHITECTURE**

### **Top_Bins Repository** → **Netlify**
- **Purpose**: Client space for Elevate and Administrate product holons
- **Domain**: Subdomain for client products (elevate.www.topbinsid.com, administrate.www.topbinsid.com)
- **Reason**: Existing Netlify deployment with subdomain configuration
- **Products**: Elevate, Administrate, Elaborate (concept)

### **Greenlight Repository** → **Vercel**
- **Purpose**: System governance, holon architecture, and monitoring platform
- **Domain**: Main system domain (greenlight.live)
- **Reason**: Modern platform for system governance and monitoring
- **System**: Holon system, governance, monitoring, protocols

---

## 🏗️ **DEPLOYMENT CONFIGURATION**

### **Top_Bins Netlify Configuration**
```json
// netlify.toml (in Top_Bins root)
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/elevate/*"
  to = "/elevate/index.html"
  status = 200

[[redirects]]
  from = "/administrate/*"
  to = "/administrate/index.html"
  status = 200

[[redirects]]
  from = "/elaborate/*"
  to = "/elaborate/index.html"
  status = 200
```

### **Greenlight Vercel Configuration**
```json
// vercel.json (in Greenlight root)
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/system/*",
      "destination": "/system/index.html"
    },
    {
      "source": "/governance/*",
      "destination": "/governance/index.html"
    }
  ]
}
```

---

## 🔗 **DOMAIN MAPPING**

### **Top_Bins Subdomains (Netlify)**
- **elevate.www.topbinsid.com** → Elevate product features
- **administrate.www.topbinsid.com** → Administrate product features
- **elaborate.www.topbinsid.com** → Elaborate concept and documentation

### **Greenlight Main Domain (Vercel)**
- **greenlight.live** → System governance and monitoring
- **system.greenlight.live** → System management interface
- **governance.greenlight.live** → Governance and compliance

---

## 📋 **DEPLOYMENT WORKFLOW**

### **Top_Bins Development**
1. **Local Development**: `npm run dev` in Top_Bins
2. **Build**: `npm run build` creates dist/ for Netlify
3. **Deploy**: Push to main branch triggers Netlify deployment
4. **Subdomain Routing**: Netlify handles subdomain routing

### **Greenlight Development**
1. **Local Development**: `npm run dev` in Greenlight
2. **Build**: `npm run build` creates dist/ for Vercel
3. **Deploy**: Push to main branch triggers Vercel deployment
4. **Domain Routing**: Vercel handles main domain routing

---

## 🔧 **CONFIGURATION FILES**

### **Top_Bins Build Configuration**
```typescript
// vite.config.ts (Top_Bins)
export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        elevate: resolve(__dirname, 'elevate/index.html'),
        administrate: resolve(__dirname, 'administrate/index.html')
      }
    }
  }
})
```

### **Greenlight Build Configuration**
```typescript
// vite.config.ts (Greenlight)
export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        system: resolve(__dirname, 'src/components/SystemMaster/index.html'),
        governance: resolve(__dirname, 'src/components/GovernanceConsole/index.html')
      }
    }
  }
})
```

---

## 🚨 **IMPORTANT NOTES**

### **Cross-Repository Communication**
- **Top_Bins products** register with Greenlight system
- **Greenlight system** monitors and governs Top_Bins products
- **API endpoints** handle cross-repository communication
- **Authentication** managed by Greenlight system

### **Environment Variables**
- **Top_Bins**: Product-specific environment variables
- **Greenlight**: System-level environment variables
- **Shared**: Cross-repository configuration

### **Database Access**
- **Top_Bins**: Product data access through APIs
- **Greenlight**: System governance and monitoring data
- **Shared Database**: Supabase with proper access controls

---

## 🎯 **NEXT STEPS**

### **Immediate Actions**
1. **Update Top_Bins build configuration** for Netlify deployment
2. **Create Greenlight Vercel configuration** for system deployment
3. **Set up environment variables** for both platforms
4. **Configure domain routing** for subdomains

### **Deployment Setup**
1. **Netlify**: Configure Top_Bins deployment with subdomain routing
2. **Vercel**: Set up Greenlight deployment with main domain
3. **DNS**: Configure domain mapping for both platforms
4. **SSL**: Ensure HTTPS for all domains

---

**Status**: ✅ DEPLOYMENT STRATEGY DEFINED  
**Top_Bins**: Netlify with subdomains  
**Greenlight**: Vercel with main domain  
**Integration**: Cross-repository communication via APIs 
# Reference Manager Protocol
## Cross-Repository Feature Registry and Governance

**Date**: 2025-01-07  
**Status**: ACTIVE  
**Purpose**: Govern cross-repository feature references and prevent architectural drift  

---

## 🎯 **Overview**

The ReferenceManager is a governance-integrated system that manages all external product/client feature references in the Greenlight Platform. It ensures strict separation between system governance (Greenlight) and product features (Top Bins, future clients) while providing unified visibility and monitoring.

### **Core Principles**
- **No Direct Imports**: Never import product components directly into Greenlight
- **Registry-Driven**: All external features are referenced via metadata and registry entries
- **Governance-Integrated**: Sync health, compliance, and metrics are monitored by GovernanceOrchestrator
- **Extensible**: Designed to support any number of client/product platforms

---

## 🏗️ **Architecture**

### **Location**
- **Manager**: `src/core/governance/ReferenceManager.ts`
- **Registry**: `data/featuresRegistry.json`
- **Integration**: `GovernanceOrchestrator` for metrics and events

### **Data Model**
```typescript
interface ReferenceEntry {
  id: string;
  name: string;
  platform: string; // e.g., 'top-bins', 'acme-sports'
  type: 'external' | 'shared' | 'system';
  status: 'online' | 'offline' | 'syncing' | 'error';
  repoUrl?: string;
  appUrl?: string;
  description?: string;
  lastSync?: Date;
  metadata?: Record<string, unknown>;
  tags?: string[];
  owner?: string;
  version?: string;
  lastUpdated: Date;
}
```

---

## 🔧 **Usage Guidelines**

### **1. Adding External Features**
```typescript
import { referenceManager } from '../core/governance/ReferenceManager';

// Add a new external feature
await referenceManager.addPlatformReference(
  'top-bins',
  'Coaching Toolkit',
  'https://elevate.www.topbinsid.com',
  'https://github.com/greenlightnida/top_bins'
);
```

### **2. Querying External Features**
```typescript
// Get all Top Bins features
const topBinsFeatures = referenceManager.getReferences({ 
  platform: 'top-bins' 
});

// Get all online external features
const onlineFeatures = referenceManager.getReferences({ 
  type: 'external', 
  status: 'online' 
});

// Get features by tags
const coachingFeatures = referenceManager.getReferences({ 
  tags: ['coaching'] 
});
```

### **3. Dashboard Integration**
```tsx
// In React components - NEVER import product components directly
import { referenceManager } from '../core/governance/ReferenceManager';

const ExternalFeaturesCard = () => {
  const [features, setFeatures] = useState([]);
  
  useEffect(() => {
    const externalFeatures = referenceManager.getReferences({ type: 'external' });
    setFeatures(externalFeatures);
  }, []);

  return (
    <div>
      {features.map(feature => (
        <div key={feature.id}>
          <h3>{feature.name}</h3>
          <p>{feature.description}</p>
          <a href={feature.appUrl} target="_blank">Open {feature.name}</a>
          <span>Status: {feature.status}</span>
        </div>
      ))}
    </div>
  );
};
```

---

## 🚫 **What NOT to Do**

### **❌ Direct Imports**
```typescript
// NEVER do this
import { CoachingToolkit } from '../components/CoachingToolkit';
import { PlayerGrid } from '../components/PlayerGrid';
```

### **❌ Symlinks or Shared Code**
```typescript
// NEVER do this
import { coachingUtils } from '../../top-bins/shared/utils';
```

### **❌ Copy-Paste Product Code**
```typescript
// NEVER do this
// Copying Top Bins components into Greenlight
```

---

## ✅ **What TO Do**

### **✅ Registry References**
```typescript
// DO this - reference via registry
const coachingToolkit = referenceManager.getReferenceById('top-bins-coaching-toolkit');
```

### **✅ External Links**
```tsx
// DO this - link to external platform
<a href="https://elevate.www.topbinsid.com" target="_blank">
  Open Coaching Toolkit
</a>
```

### **✅ Shared Packages (if needed)**
```typescript
// DO this - use shared packages for truly generic code
import { @greenlight/design-system } from 'npm';
```

---

## 🔄 **Onboarding New Clients**

### **Step 1: Register Platform**
```typescript
// Add new client platform
await referenceManager.addPlatformReference(
  'acme-sports',
  'Player Analytics',
  'https://analytics.acmesports.com',
  'https://github.com/acme-sports/analytics'
);
```

### **Step 2: Add Features**
```typescript
// Add individual features
referenceManager.addReference({
  id: 'acme-sports-analytics',
  name: 'Player Analytics',
  platform: 'acme-sports',
  type: 'external',
  status: 'online',
  appUrl: 'https://analytics.acmesports.com',
  repoUrl: 'https://github.com/acme-sports/analytics',
  description: 'Advanced player analytics and insights',
  tags: ['analytics', 'players', 'insights'],
  owner: 'acme-sports',
  version: '1.0.0',
  lastUpdated: new Date()
});
```

### **Step 3: Update Documentation**
- Add client to platform documentation
- Update onboarding guides
- Register in governance protocols

---

## 📊 **Governance Integration**

### **Metrics Available**
- Total external references
- Online/offline status
- Sync health and errors
- Platform distribution
- Last sync times

### **Governance Rules**
- **Sync Health Monitoring**: Alerts on sync failures
- **Compliance Tracking**: Ensures no direct imports
- **Status Monitoring**: Tracks external feature availability

### **Events Emitted**
- `reference-added`: New external feature registered
- `reference-updated`: Feature metadata updated
- `reference-removed`: Feature removed from registry
- `sync-completed`: Sync operation completed
- `governance-alert`: Governance rule violations

---

## 🔧 **Sync Configuration**

### **Automatic Sync**
```typescript
// Enable automatic sync (runs every 5 minutes)
setInterval(async () => {
  if (!referenceManager.isSyncInProgress()) {
    await referenceManager.syncAll();
  }
}, 5 * 60 * 1000);
```

### **Manual Sync**
```typescript
// Manual sync trigger
const result = await referenceManager.syncAll();
console.log(`Sync completed: ${result.referencesUpdated} updated, ${result.errors.length} errors`);
```

### **Platform-Specific Sync**
```typescript
// Custom sync logic for specific platforms
private async syncTopBinsPlatform(references: ReferenceEntry[]): Promise<number> {
  // Call Top Bins health API
  // Update status based on response
  // Return number of updated references
}
```

---

## 📋 **Registry Structure**

### **External Features Section**
```json
{
  "id": "external-features",
  "name": "External Features",
  "type": "external",
  "status": "active",
  "description": "External platform features and integrations",
  "children": [
    {
      "id": "top-bins-coaching-toolkit",
      "name": "Coaching Toolkit",
      "type": "external",
      "status": "online",
      "platform": "top-bins",
      "description": "Unified coaching interface for sports teams",
      "repoRef": "https://github.com/greenlightnida/top_bins",
      "appUrl": "https://elevate.www.topbinsid.com",
      "tags": ["coaching", "sports", "team-management"],
      "owner": "top-bins",
      "version": "2.0.0",
      "lastUpdated": "2025-01-07T00:00:00Z"
    }
  ]
}
```

---

## 🚀 **Future Extensibility**

### **Multi-Client Support**
- Registry-driven client onboarding
- Platform-specific sync adapters
- Client-specific governance rules

### **Shared Package Management**
- Extract common utilities to `@greenlight/shared`
- Version management and compatibility
- Dependency tracking

### **Advanced Monitoring**
- Real-time health checks
- Performance metrics
- Usage analytics

---

## 📚 **Related Documentation**

- [Cross Repository Integration Guide](./CROSS_REPOSITORY_INTEGRATION_GUIDE.md)
- [Feature Sync System](./FEATURE_SYNC_SYSTEM.md)
- [Governance Architecture](./HOLON_GOVERNANCE_ARCHITECTURE.md)
- [Operations Master Quick Reference](../summaries/OPERATIONS_MASTER_QUICK_REFERENCE.md)

---

## 🎯 **Success Metrics**

- **Zero Direct Imports**: No product components imported into Greenlight
- **100% Registry Coverage**: All external features registered
- **Real-time Sync**: External status updated within 5 minutes
- **Governance Compliance**: No governance rule violations
- **Client Scalability**: Easy onboarding of new client platforms 
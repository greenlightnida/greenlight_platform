# Feature Sync System
## Greenlight Platform ↔ Top_Bins Synchronization

### Overview
The Feature Sync System enables seamless synchronization between Greenlight Platform (system governance) and Top_Bins Platform (product features). This system maintains a unified view of all features across both platforms while respecting their architectural separation.

---

## Architecture

### Platform Separation
- **Greenlight Platform**: System governance, holon management, documentation
- **Top_Bins Platform**: Product features, client-specific functionality
- **Sync Bridge**: Feature registry synchronization and cross-platform visibility

### Data Flow
```
Top_Bins Platform → Feature Registry API → Greenlight Platform → FeaturesMapPanel
     ↑                                                              ↓
     └─────────────── Sync Service ←───────────────────────────────┘
```

---

## Components

### 1. Features Registry (`featuresRegistry.json`)
**Location**: Root of greenlight-platform repository

**Structure**:
```json
{
  "metadata": {
    "version": "2.0.0",
    "lastUpdated": "2025-01-07T00:00:00Z",
    "platform": "greenlight-platform"
  },
  "features": [
    {
      "id": "greenlight-platform",
      "name": "Greenlight Platform",
      "type": "system",
      "children": [...]
    },
    {
      "id": "top-bins-platform",
      "name": "Top Bins Platform",
      "type": "product",
      "syncStatus": "external",
      "children": [...]
    }
  ]
}
```

### 2. Feature Sync Service (`src/services/featureSyncService.ts`)
**Purpose**: Handles synchronization logic and API communication

**Key Methods**:
- `syncWithTopBins()`: Manual sync trigger
- `startAutoSync()`: Enable automatic synchronization
- `mergeFeatureRegistries()`: Merge Top_Bins features with local registry

**Configuration**:
```typescript
{
  topBinsApiUrl: 'https://api.top-bins.com',
  syncInterval: 300000, // 5 minutes
  autoSync: false // Disabled by default
}
```

### 3. FeaturesMapPanel (`src/components/FeaturesMapPanel.tsx`)
**Purpose**: Visual interface for feature exploration and sync management

**Features**:
- Hierarchical feature tree display
- External/internal feature distinction
- Manual sync button
- Sync status indicators
- Cross-platform navigation links

---

## Sync Process

### 1. Manual Sync
1. User clicks "Sync with Top_Bins" button
2. FeatureSyncService fetches latest features from Top_Bins API
3. Local registry is updated with new/updated features
4. FeaturesMapPanel refreshes with updated data
5. Sync status is displayed to user

### 2. Automatic Sync (Optional)
1. Service runs on configured interval (default: 5 minutes)
2. Background sync without user interaction
3. Updates local registry silently
4. Logs sync results for monitoring

### 3. Feature Merging Logic
```typescript
// Find Top_Bins platform node
const topBinsPlatform = localFeatures.find(f => f.id === 'top-bins-platform');

// Update existing features or add new ones
topBinsFeatures.forEach(feature => {
  const existing = findFeatureById(topBinsPlatform.children, feature.id);
  if (existing) {
    Object.assign(existing, { ...feature, syncStatus: 'synced' });
  } else {
    topBinsPlatform.children.push({ ...feature, syncStatus: 'synced' });
  }
});
```

---

## Feature Types and Status

### Feature Types
- **system**: Greenlight Platform system features
- **product**: Top_Bins Platform product features
- **principle**: Core governance principles
- **component**: UI components
- **service**: Backend services
- **feature**: Specific functionality
- **utility**: Helper functions
- **api**: API endpoints

### Sync Status
- **external**: Feature exists in Top_Bins only
- **synced**: Feature successfully synchronized
- **pending**: Sync in progress
- **error**: Sync failed

### Visual Indicators
- 🔗 **external**: Links to Top_Bins repository
- ✅ **synced**: Successfully synchronized
- ⏳ **pending**: Sync in progress
- ❌ **error**: Sync failed

---

## API Integration

### Top_Bins API Endpoints (Future)
```typescript
// GET /api/features
// Returns complete feature registry
{
  features: TopBinsFeature[],
  metadata: {
    version: string,
    lastUpdated: string,
    platform: string
  }
}

// GET /api/features/:id
// Returns specific feature details
{
  id: string,
  name: string,
  type: string,
  status: string,
  path: string,
  docs: string | null,
  description?: string,
  children?: TopBinsFeature[]
}
```

### Error Handling
- Network timeouts
- API rate limiting
- Invalid response formats
- Authentication failures

---

## Configuration

### Environment Variables
```bash
TOP_BINS_API_URL=https://api.top-bins.com
FEATURE_SYNC_INTERVAL=300000
FEATURE_AUTO_SYNC=false
```

### Service Configuration
```typescript
const config: FeatureSyncConfig = {
  topBinsApiUrl: process.env.TOP_BINS_API_URL || 'https://api.top-bins.com',
  syncInterval: parseInt(process.env.FEATURE_SYNC_INTERVAL || '300000'),
  autoSync: process.env.FEATURE_AUTO_SYNC === 'true'
};
```

---

## Monitoring and Logging

### Sync Metrics
- Last sync timestamp
- Features synced count
- Features updated count
- Sync duration
- Error rates

### Log Events
```typescript
// Sync started
console.log('Feature sync started', { timestamp: new Date() });

// Sync completed
console.log('Feature sync completed', { 
  featuresSynced: 15,
  featuresUpdated: 3,
  duration: '2.3s'
});

// Sync failed
console.error('Feature sync failed', { 
  error: error.message,
  retryCount: 3
});
```

---

## Security Considerations

### API Authentication
- Token-based authentication for Top_Bins API
- Secure token storage and rotation
- Rate limiting and request throttling

### Data Validation
- Schema validation for feature data
- Sanitization of external data
- Version compatibility checks

### Access Control
- Read-only access to Top_Bins features
- No write operations to external platform
- Audit logging for all sync operations

---

## Future Enhancements

### 1. Real-time Sync
- WebSocket connection for live updates
- Push notifications for feature changes
- Real-time status indicators

### 2. Advanced Filtering
- Filter by feature type, status, or platform
- Search functionality
- Custom view configurations

### 3. Conflict Resolution
- Handle conflicting feature definitions
- Merge strategies for overlapping features
- Conflict resolution UI

### 4. Performance Optimization
- Incremental sync (only changed features)
- Caching strategies
- Background sync optimization

---

## Troubleshooting

### Common Issues

#### 1. Sync Fails
**Symptoms**: Error status, no features updated
**Solutions**:
- Check network connectivity
- Verify API endpoint configuration
- Review authentication tokens
- Check API rate limits

#### 2. Features Not Updating
**Symptoms**: Sync succeeds but no changes visible
**Solutions**:
- Verify feature registry file permissions
- Check merge logic for conflicts
- Review feature ID matching

#### 3. Performance Issues
**Symptoms**: Slow sync, timeouts
**Solutions**:
- Increase sync interval
- Implement incremental sync
- Add request caching
- Optimize merge algorithms

### Debug Mode
Enable debug logging for detailed sync information:
```typescript
featureSyncService.updateConfig({ debug: true });
```

---

## Integration with System Governance

### Documentation Manager Integration
- Automatic documentation updates during sync
- Cross-platform documentation linking
- Sync status reporting

### Audit Service Integration
- Sync operation auditing
- Feature change tracking
- Compliance monitoring

### Performance Tracking
- Sync performance metrics
- Resource usage monitoring
- Optimization recommendations

---

*Last updated: 2025-01-07*
*Version: 2.0.0* 
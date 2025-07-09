# Top Bins Platform Separation Plan

## 🎯 Objective
Separate all Top Bins (Utica sports coaching) content from the Greenlight platform to create a dedicated, focused workspace for Top Bins operations.

## 📋 Current State Analysis

### Top Bins Content Identified:
1. **Player Management System**
   - Player profiles, progress tracking, performance analytics
   - Jersey number detection and player card generation
   - Player CRM and contact management

2. **Coaching Toolkit**
   - Team messaging and announcements
   - Player-coach communication tools
   - Performance tracking and analytics

3. **Media Intelligence**
   - OCR-based media tagging
   - Photo upload and management
   - Player card generation from photos

4. **Cohort Management**
   - Program and camp lifecycle management
   - Enrollment tracking
   - Batch upload capabilities

5. **Team Portal**
   - Unified team collaboration
   - Player grid visualization
   - Progress tracking and milestone management

## 🏗️ New Directory Structure

```
top-bins-platform/
├── src/
│   ├── components/
│   │   ├── coaching/
│   │   ├── media/
│   │   ├── players/
│   │   ├── team/
│   │   └── shared/
│   ├── services/
│   ├── utils/
│   ├── hooks/
│   ├── types/
│   ├── lib/
│   └── config/
├── public/
│   └── data/
├── data/
├── scripts/
├── docs/
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 📦 Content Migration Plan

### Phase 1: Core Top Bins Components
- [ ] Move `src/components/CoachingToolkit/` → `top-bins-platform/src/components/coaching/`
- [ ] Move `src/components/MediaLibrary/` → `top-bins-platform/src/components/media/`
- [ ] Move `src/components/PlayerGrid/` → `top-bins-platform/src/components/players/`
- [ ] Move `src/components/PlayerCRM.tsx` → `top-bins-platform/src/components/players/`
- [ ] Move `src/components/CohortManagement.tsx` → `top-bins-platform/src/components/team/`
- [ ] Move `src/components/BatchUpload.tsx` → `top-bins-platform/src/components/team/`

### Phase 2: Supporting Services & Utils
- [ ] Move `src/utils/playerProgress.ts` → `top-bins-platform/src/utils/`
- [ ] Move `src/utils/mattDataLoader.ts` → `top-bins-platform/src/utils/`
- [ ] Move `src/services/aiInsightsService.ts` → `top-bins-platform/src/services/`
- [ ] Move `src/services/featureReferenceService.ts` → `top-bins-platform/src/services/`
- [ ] Move `src/utils/aiDetection.ts` → `top-bins-platform/src/utils/`

### Phase 3: Data & Configuration
- [ ] Move `public/data/` → `top-bins-platform/data/`
- [ ] Move `data/` → `top-bins-platform/data/`
- [ ] Copy relevant scripts to `top-bins-platform/scripts/`
- [ ] Create Top Bins specific configuration files

### Phase 4: Platform Configuration
- [ ] Create `top-bins-platform/package.json`
- [ ] Create `top-bins-platform/tailwind.config.js`
- [ ] Create `top-bins-platform/vite.config.ts`
- [ ] Create `top-bins-platform/README.md`

## 🔧 Technical Considerations

### Dependencies to Include:
- React + TypeScript
- Tailwind CSS
- Supabase (for data)
- Vite (for build)
- Heroicons
- React Router

### Dependencies to Exclude:
- Greenlight-specific business logic
- Executive dashboard components
- System administration tools
- Articulate work management
- Complex adaptive system components

### Data Architecture:
- Keep Supabase integration for player data
- Maintain existing database schema
- Preserve media storage functionality
- Keep CSV import capabilities

## 🚀 Implementation Steps

1. **Create Base Structure** ✅
2. **Move Core Components**
3. **Update Import Paths**
4. **Test Component Functionality**
5. **Create Platform Configuration**
6. **Update Documentation**
7. **Test Full Platform**
8. **Clean Up Original Location**

## 📊 Success Metrics

- [ ] All Top Bins components work independently
- [ ] No Greenlight dependencies remain
- [ ] Platform builds and runs successfully
- [ ] All data connections work properly
- [ ] Documentation is updated and accurate

## 🎯 Next Actions

1. Begin moving core components
2. Update import paths and dependencies
3. Test each component after migration
4. Create platform-specific configuration
5. Update documentation and README

---

**Status:** Ready to begin implementation
**Priority:** High - Critical for focused development
**Estimated Time:** 2-3 hours for complete separation 
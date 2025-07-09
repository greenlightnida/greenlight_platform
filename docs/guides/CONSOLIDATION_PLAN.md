# Greenlight Platform - Consolidation & Cleanup Plan

## 🎯 **Objective**
Transform the fragmented Top_Bins system into a unified, clean Greenlight Platform governance system with proper organization and context awareness.

## 📋 **Current State Analysis**

### **Issues Identified:**
1. **Branding Fragmentation**: All protocols, scripts, and documentation still labeled for "Top_Bins"
2. **Directory Confusion**: Symlinked directories create confusion about ownership
3. **Context Scattered**: Session management and protocols spread across multiple locations
4. **Documentation Duplication**: Multiple versions of similar documentation
5. **Legacy Dependencies**: Hardcoded references to Top_Bins throughout the system

## 🏗️ **New Directory Structure**

```
greenlight-platform/
├── src/
│   ├── core/
│   │   ├── governance/          # Governance system (already implemented)
│   │   ├── protocols/           # Consolidated protocols
│   │   ├── session-management/  # Session and context management
│   │   └── context-awareness/   # Context awareness mechanisms
│   ├── legacy/
│   │   └── top-bins/           # Legacy Top_Bins content (archived)
│   └── protocols/
│       ├── launch/             # Launch protocols
│       ├── session/            # Session protocols
│       ├── audit/              # Audit protocols
│       └── governance/         # Governance protocols
├── docs/
│   ├── protocols/              # Protocol documentation
│   ├── architecture/           # System architecture
│   ├── audits/                 # Audit reports and findings
│   └── history/                # Project history and changelogs
├── scripts/
│   ├── protocols/              # Protocol scripts
│   ├── governance/             # Governance scripts
│   └── maintenance/            # Maintenance and utility scripts
└── data/
    ├── sessions/               # Session logs and context
    ├── history/                # Historical data
    └── governance/             # Governance data and metrics
```

## 🔄 **Migration Steps**

### **Phase 1: Protocol Consolidation**
1. **Move Protocol Scripts**:
   - `scripts_top_bins/launch_protocol.cjs` → `src/protocols/launch/`
   - `scripts_top_bins/end_of_chat_protocol.js` → `src/protocols/session/`
   - `scripts_top_bins/pre_wrap_audit_protocol.cjs` → `src/protocols/audit/`
   - `scripts_top_bins/custodian_protocol.cjs` → `src/protocols/governance/`

2. **Update Protocol References**:
   - Remove Top_Bins branding
   - Update import paths
   - Standardize naming conventions

### **Phase 2: Session Management Consolidation**
1. **Move Session Management**:
   - `work_sessions_top_bins/` → `data/sessions/`
   - Session context extraction logic → `src/session-management/`
   - Context awareness mechanisms → `src/context-awareness/`

2. **Create Unified Session Manager**:
   - Single interface for session management
   - Context preservation and restoration
   - Session history and analytics

### **Phase 3: Documentation Consolidation**
1. **Move Documentation**:
   - `docs_top_bins/architecture/` → `docs/architecture/`
   - `docs_top_bins/audits/` → `docs/audits/`
   - `docs_top_bins/guides/` → `docs/protocols/`

2. **Deduplicate and Merge**:
   - Remove duplicate documentation
   - Merge similar documents
   - Update all references

### **Phase 4: Legacy Content Archival**
1. **Archive Top_Bins Content**:
   - Move all Top_Bins-specific content to `src/legacy/top-bins/`
   - Preserve history and context
   - Mark as legacy/deprecated

2. **Update References**:
   - Remove hardcoded Top_Bins references
   - Update import statements
   - Fix broken links

## 🧹 **Cleanup Actions**

### **Files to Remove/Archive:**
- All `*_top_bins` symlinks
- Duplicate documentation
- Obsolete scripts
- Legacy configuration files

### **Files to Consolidate:**
- Multiple changelog files
- Duplicate audit reports
- Similar protocol scripts
- Redundant documentation

### **Files to Update:**
- All import statements
- Configuration files
- Documentation references
- Script paths

## 🔧 **Implementation Plan**

### **Step 1: Create New Structure** ✅
- [x] Create new directory structure
- [ ] Move and consolidate protocols
- [ ] Set up session management
- [ ] Organize documentation

### **Step 2: Update Governance System** ✅
- [x] Make governance system generic
- [x] Remove Top_Bins hardcoding
- [x] Support multiple repositories
- [ ] Add protocol management

### **Step 3: Migrate Content**
- [ ] Move protocol scripts
- [ ] Consolidate session logs
- [ ] Merge documentation
- [ ] Update all references

### **Step 4: Cleanup**
- [ ] Remove symlinks
- [ ] Archive legacy content
- [ ] Update documentation
- [ ] Test all functionality

### **Step 5: Validation**
- [ ] Run governance audit
- [ ] Test session management
- [ ] Verify context awareness
- [ ] Check all protocols

## 📊 **Success Metrics**

### **Before Consolidation:**
- ❌ Fragmented Top_Bins branding
- ❌ Confusing symlink structure
- ❌ Scattered protocols and context
- ❌ Duplicate documentation
- ❌ Hardcoded references

### **After Consolidation:**
- ✅ Unified Greenlight Platform branding
- ✅ Clean, logical directory structure
- ✅ Centralized protocols and context
- ✅ Deduplicated documentation
- ✅ Generic, reusable governance system

## 🎯 **Expected Outcomes**

1. **Clear Ownership**: Greenlight Platform owns all governance and protocols
2. **Unified Context**: Single source of truth for session and context management
3. **Scalable Governance**: System can manage multiple repositories
4. **Clean Architecture**: Logical organization without confusion
5. **Preserved History**: All context and history maintained but properly organized

## 🚀 **Next Steps**

1. **Execute Phase 1**: Protocol consolidation
2. **Execute Phase 2**: Session management consolidation
3. **Execute Phase 3**: Documentation consolidation
4. **Execute Phase 4**: Legacy archival
5. **Validate**: Test all functionality
6. **Document**: Update all documentation

---

**This consolidation will transform the fragmented Top_Bins system into a clean, unified Greenlight Platform governance system with proper context awareness and session management.** 
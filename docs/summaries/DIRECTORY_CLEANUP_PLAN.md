# Directory Cleanup Plan

## 🎯 **Current Issues Identified**

### **Duplicate Directories**
1. **Multiple `src/` directories**: Root `src/` and `top-bins-platform/src/`
2. **Multiple `shared/` directories**: Root `shared/` and `packages/shared/`
3. **Multiple `elevate/` directories**: Root `elevate/` and `packages/elevate/`
4. **Multiple `public/` directories**: Root `public/` and `top-bins-platform/public/`

### **Scattered Documentation**
- **50+ markdown files** in root directory
- **Multiple summary files** with similar content
- **Phase documentation** scattered everywhere

### **Test Files**
- **Test files** in root directory
- **Enrichment test files** scattered

## 🧹 **Cleanup Strategy**

### **Phase 1: Consolidate Documentation**
```
📁 docs/
├── 📁 architecture/
│   ├── HOLON_GOVERNANCE_ARCHITECTURE.md
│   ├── ELABORATE_SYSTEM_ARCHITECTURE.md
│   └── SYSTEM_ARCHITECTURE.md
├── 📁 phases/
│   ├── PHASE_1_PROGRESS_SUMMARY.md
│   ├── PHASE_2_PROGRESS_SUMMARY.md
│   └── ...
├── 📁 deployment/
│   ├── DEPLOYMENT.md
│   ├── DEPLOYMENT_STATUS.md
│   └── ...
├── 📁 audits/
│   ├── COMPREHENSIVE_CODE_AUDIT.md
│   ├── AUDIT_OPTIMIZATION_REPORT.md
│   └── ...
└── 📁 summaries/
    ├── TOP_BINS_MIGRATION_COMPLETE.md
    ├── ANCHOR_COMMAND_MIGRATION_COMPLETE.md
    └── ...
```

### **Phase 2: Organize Test Files**
```
📁 tests/
├── 📁 enrichment/
│   ├── test_enrichment_system.cjs
│   └── test_enrichment_data.csv
├── 📁 frontend/
│   └── test_frontend.js
└── 📁 pages/
    └── test_page.html
```

### **Phase 3: Clean Root Directory**
- Keep only essential files in root
- Move all documentation to `docs/`
- Move all test files to `tests/`
- Consolidate duplicate directories

### **Phase 4: Verify Platform Separation**
- Ensure `top-bins-platform/` is completely independent
- Remove any cross-contamination
- Verify all platforms have correct structure

## 📋 **Files to Move**

### **Documentation Files (50+ files)**
- All `*.md` files → `docs/` subdirectories
- All `*.json` config files → appropriate directories
- All summary files → `docs/summaries/`

### **Test Files**
- `test_*.js` → `tests/`
- `test_*.cjs` → `tests/`
- `test_*.html` → `tests/pages/`
- `test_*.csv` → `tests/data/`

### **Configuration Files**
- Keep essential configs in root
- Move platform-specific configs to respective platforms

## 🎯 **Expected Results**

### **Before Cleanup**
- **Root directory**: 100+ files
- **Duplicate directories**: 5+ sets
- **Scattered documentation**: 50+ files
- **Sidebar length**: Very long

### **After Cleanup**
- **Root directory**: ~20 essential files
- **Organized documentation**: `docs/` structure
- **Clean test files**: `tests/` structure
- **Sidebar length**: Much shorter and organized

## ✅ **Success Criteria**

1. **Root directory** contains only essential files
2. **Documentation** is organized in `docs/` structure
3. **Test files** are consolidated in `tests/` structure
4. **No duplicate directories** exist
5. **Platform separation** is maintained
6. **Sidebar is significantly shorter** and organized 
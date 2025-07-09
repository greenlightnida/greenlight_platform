# 🎯 OPERATIONS MASTER QUICK REFERENCE
## Prevent Organizational Lapses

**Last Updated**: 2025-01-07  
**Purpose**: Quick reference to prevent repository and architecture confusion  

---

## 🚨 **CRITICAL RULES**

### **Repository Ownership**
- **Greenlight** = System governance, holon architecture, monitoring, protocols
- **Top_Bins** = Product features, client-specific functionality, product holons
- **NEVER** put system governance code in Top_Bins
- **NEVER** put product code in Greenlight

### **Holon Classification**
- **System Holons** (Greenlight): systemMaster, executiveDashboard, resolve, inform, observe, articulate, sessionsManager, apiManager
- **Product Holons** (Top_Bins): mediaIntelligence, playerGrid, cohortManagement, teamPortal, coachingToolkit

---

## 📁 **CORRECT STRUCTURE**

### **Greenlight Repository**
```
Greenlight/
├── src/architecture/holonSystem.ts     # System holon registry
├── src/components/SystemMaster/        # System orchestration
├── src/components/ExecutiveDashboard/  # Executive oversight
├── src/components/Articulate/          # Work management
├── src/components/SessionsManager/     # Session management
├── src/services/auditService.ts        # System auditing
├── src/services/systemLogService.ts    # System logging
└── scripts/                            # System governance scripts
```

### **Top_Bins Repository**
```
Top_Bins/
├── elevate/features/                   # Elevate product features
│   ├── media/                          # Media intelligence
│   ├── grid/                           # Player grid
│   ├── team/                           # Team portal
│   ├── cohort/                         # Cohort management
│   └── coaching/                       # Coaching toolkit
├── administrate/                       # Administrate product
└── shared/                             # Cross-product shared
```

---

## 🔍 **QUICK CHECKS**

### **Before Making Changes**
1. **Is this system governance?** → Greenlight repository
2. **Is this product feature?** → Top_Bins repository
3. **Is this a system holon?** → Register in Greenlight
4. **Is this a product holon?** → Register in Top_Bins

### **Red Flags**
- ❌ System governance code in Top_Bins
- ❌ Product code in Greenlight
- ❌ Mixed responsibilities in single file
- ❌ Unclear holon ownership
- ❌ Missing documentation

---

## 📞 **WHEN CONFUSED**

1. **Check this document** - Use as authoritative guide
2. **Ask**: "Is this system governance or product feature?"
3. **Verify**: Check repository purposes
4. **Document**: Update architecture documentation

---

## 🎯 **SUCCESS METRICS**

- ✅ Clear repository boundaries
- ✅ Proper holon ownership
- ✅ No mixed responsibilities
- ✅ Current documentation
- ✅ Working connections

---

**Status**: ✅ ACTIVE REFERENCE  
**Priority**: CRITICAL  
**Use**: Before every architectural decision 
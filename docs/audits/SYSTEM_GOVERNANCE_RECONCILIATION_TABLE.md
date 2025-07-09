# System Governance Reconciliation Table

| File/Directory | Location | Type | Current Repo | Recommended Action | Notes |
|---------------|----------|------|-------------|-------------------|-------|
| elaborate/ | Top_Bins | System Holon Dir | Top_Bins | Delete | All system holons now in greenlight-platform |
| administrate/ | Top_Bins | System Holon Dir | Top_Bins | Delete | All system holons now in greenlight-platform |
| elevate/ | Top_Bins | System Holon Dir | Top_Bins | Delete | All system holons now in greenlight-platform |
| src/architecture/holonSystem.ts | Top_Bins | System Holon Code | Top_Bins | Delete | Duplicated in greenlight-platform |
| src/services/anchorCommandService.ts | Top_Bins | System Manager | Top_Bins | Delete | Migrated to greenlight-platform |
| src/services/systemLogService.ts | Top_Bins | System Manager | Top_Bins | Delete | Migrated to greenlight-platform |
| src/services/auditService.ts | Top_Bins | System Manager | Top_Bins | Delete | Migrated to greenlight-platform |
| src/services/performanceTrackingService.ts | Top_Bins | System Manager | Top_Bins | Delete | Migrated to greenlight-platform |
| docs/architecture/ | Top_Bins | System Docs | Top_Bins | Migrate | Contains governance, migration, and architecture docs |
| docs/audits/ | Top_Bins | Audit Docs | Top_Bins | Migrate | Contains audit and governance docs |
| featuresRegistry.json | Top_Bins | System Registry | Top_Bins | Delete | Now lives in greenlight-platform |
| ROADMAP_ANCHOR.json | Top_Bins | System Registry | Top_Bins | Delete | Now lives in greenlight-platform |
| LAUNCH_REPORT.json | Top_Bins | System Registry | Top_Bins | Delete | Now lives in greenlight-platform |
| DOCUMENTATION_CUSTODIAN_AND_SCRIPTMASTER.md | Top_Bins | System Doc | Top_Bins | Migrate | Documentation protocol, now in greenlight-platform |
| Greenlight/src/architecture/holonSystem.ts | Greenlight | System Holon Code | Greenlight | Archive | Likely legacy/experimental, not canonical |
| Greenlight/src/architecture/governance/ | Greenlight | System Governance | Greenlight | Archive | Empty, no action needed |
| greenlight-platform/src/core/governance/ | greenlight-platform | System Governance | greenlight-platform | Keep | Canonical location |
| greenlight-platform/docs/architecture/ | greenlight-platform | System Docs | greenlight-platform | Keep | Canonical location |
| greenlight-platform/docs/audits/ | greenlight-platform | Audit Docs | greenlight-platform | Keep | Canonical location |
| greenlight-platform/featuresRegistry.json | greenlight-platform | System Registry | greenlight-platform | Keep | Canonical location |
| greenlight-platform/ROADMAP_ANCHOR.json | greenlight-platform | System Registry | greenlight-platform | Keep | Canonical location |
| greenlight-platform/LAUNCH_REPORT.json | greenlight-platform | System Registry | greenlight-platform | Keep | Canonical location |
| greenlight-platform/DOCUMENTATION_CUSTODIAN_AND_SCRIPTMASTER.md | greenlight-platform | System Doc | greenlight-platform | Keep | Canonical location |

---

**Legend:**
- **Migrate**: Move file/directory to greenlight-platform
- **Delete**: Remove from source repo (already migrated)
- **Archive**: Move to backup/archive folder for historical reference
- **Keep**: No action needed; canonical location

---

**Next Steps:**
1. Migrate all system docs from Top_Bins to greenlight-platform (if not already present)
2. Delete all system holon, manager, and registry files from Top_Bins
3. Archive legacy/experimental system holon code in Greenlight
4. Confirm all system governance is present and up-to-date in greenlight-platform 
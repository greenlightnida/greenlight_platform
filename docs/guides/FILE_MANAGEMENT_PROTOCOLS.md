# File Management Protocols
## Greenlight Platform

**Version:** 1.0.0  
**Last Updated:** 2025-07-08  
**Status:** ACTIVE  

---

## 📋 Overview

This document establishes standardized file management protocols for the Greenlight Platform to ensure consistency, maintainability, and scalability across all development activities.

---

## 🏗️ Directory Structure Standards

### Root Level Organization
```
greenlight-platform/
├── api/                    # API endpoints and services
├── backend/               # Backend application code
├── config/                # Configuration files and templates
├── data/                  # Data files, sessions, and state
├── docs/                  # Documentation and guides
├── frontend/              # Frontend application code
├── greenlight-wiki/       # Wiki system files
├── infrastructure/        # Infrastructure and deployment
├── platforms/             # Platform-specific components
├── public/                # Public assets and static files
├── scripts/               # Automation and utility scripts
└── src/                   # Core source code
```

### Platform-Specific Organization
```
platforms/greenlight-platform/
├── elevate/               # Elevate platform components
├── media/                 # Media library components
├── grid/                  # Player grid components
└── team/                  # Team portal components
```

---

## 📁 File Naming Conventions

### General Rules
- **Use kebab-case** for file and directory names: `my-component.tsx`
- **Use PascalCase** for React components: `MyComponent.tsx`
- **Use camelCase** for JavaScript/TypeScript files: `myUtility.ts`
- **Use UPPER_SNAKE_CASE** for constants: `API_ENDPOINTS.ts`

### Specific Conventions
- **Components:** `ComponentName.tsx`
- **Utilities:** `utilityName.ts`
- **Types:** `types.ts` or `ComponentName.types.ts`
- **Tests:** `ComponentName.test.tsx`
- **Styles:** `ComponentName.css` or `ComponentName.module.css`
- **Configuration:** `config-name.json` or `config-name.ts`

---

## 🗂️ File Organization Rules

### Source Code Organization
1. **Group by Feature:** Organize files by feature rather than type
2. **Co-location:** Keep related files together (component, types, tests, styles)
3. **Barrel Exports:** Use index files for clean imports
4. **Separation of Concerns:** Separate business logic from presentation

### Documentation Organization
1. **Hierarchical Structure:** Use clear hierarchy in docs/
2. **Consistent Formatting:** Use markdown with consistent headers
3. **Cross-References:** Link related documents appropriately
4. **Version Control:** Include version information in documentation

### Configuration Organization
1. **Environment-Specific:** Separate configs by environment
2. **Template Files:** Provide templates for required configuration
3. **Security:** Never commit sensitive configuration
4. **Validation:** Validate configuration on startup

---

## 🧹 File Lifecycle Management

### Creation Protocol
1. **Check Existing:** Verify no duplicate functionality exists
2. **Follow Conventions:** Use established naming and organization patterns
3. **Document Purpose:** Include clear purpose and usage documentation
4. **Add to Index:** Update relevant index files and documentation

### Modification Protocol
1. **Backup Strategy:** Create backups before major changes
2. **Incremental Changes:** Make small, focused changes
3. **Test Impact:** Verify changes don't break existing functionality
4. **Update Documentation:** Keep documentation current with changes

### Deletion Protocol
1. **Dependency Check:** Verify no dependencies exist
2. **Migration Plan:** Plan migration for dependent code
3. **Cleanup References:** Remove all references to deleted files
4. **Document Removal:** Record removal in changelog

---

## 🔍 Duplicate Detection and Resolution

### Detection Methods
1. **Automated Scanning:** Use scripts to detect duplicates
2. **Manual Review:** Regular code reviews for duplicates
3. **Dependency Analysis:** Check for overlapping functionality
4. **Content Comparison:** Compare file contents for similarity

### Resolution Strategy
1. **Consolidation:** Merge duplicate functionality
2. **Standardization:** Choose one approach and standardize
3. **Migration:** Update all references to use consolidated version
4. **Cleanup:** Remove duplicate files and update documentation

---

## 📊 File Management Metrics

### Tracking Metrics
- **Total Files:** Track total number of files in project
- **File Categories:** Monitor distribution across categories
- **Duplicate Count:** Track number of duplicate files
- **Orphaned Files:** Monitor files without clear purpose
- **Documentation Coverage:** Track documentation completeness

### Quality Metrics
- **Naming Consistency:** Percentage of files following conventions
- **Organization Compliance:** Adherence to directory structure
- **Documentation Quality:** Completeness and accuracy of docs
- **Dependency Health:** Clean dependency relationships

---

## 🛠️ Automation and Tools

### Automated Processes
1. **File Scanning:** Regular scans for duplicates and orphans
2. **Naming Validation:** Check file naming conventions
3. **Structure Validation:** Verify directory organization
4. **Documentation Checks:** Ensure documentation completeness

### Manual Processes
1. **Code Reviews:** Include file organization in reviews
2. **Architecture Reviews:** Regular architecture assessments
3. **Cleanup Sessions:** Dedicated time for file cleanup
4. **Documentation Updates:** Regular documentation maintenance

---

## 📋 Maintenance Schedule

### Daily
- Review new files for naming and organization compliance
- Update documentation for new features

### Weekly
- Run automated file management checks
- Review and resolve any detected issues
- Update file management metrics

### Monthly
- Comprehensive file organization review
- Architecture assessment and cleanup
- Documentation quality review

### Quarterly
- Major file management protocol updates
- Tool and automation improvements
- Training and process refinement

---

## 🚨 Emergency Procedures

### Critical Issues
1. **Security Breach:** Immediately secure and audit affected files
2. **Data Loss:** Restore from backups and investigate cause
3. **System Failure:** Follow disaster recovery procedures
4. **Compliance Violation:** Address immediately and document

### Response Protocol
1. **Assess Impact:** Determine scope and severity
2. **Contain Issue:** Prevent further damage
3. **Communicate:** Notify relevant stakeholders
4. **Resolve:** Fix the issue and prevent recurrence
5. **Document:** Record incident and lessons learned

---

## 📚 References

- [Directory Purpose Guide](./DIRECTORY_PURPOSE_GUIDE.md)
- [Development Standards](./docs/guides/DEVELOPMENT_STANDARDS.md)
- [Architecture Documentation](./docs/architecture/)
- [Project Roadmap](./ROADMAP.md)

---

*This document is a living document and should be updated as the project evolves. All team members are responsible for following these protocols and suggesting improvements.*

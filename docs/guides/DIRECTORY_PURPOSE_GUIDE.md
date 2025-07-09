# Directory Purpose Guide

## 🎯 **WORKSPACE DIRECTORY STRUCTURE & PURPOSES**

### 📁 **Parent Directory Structure**
```
/Users/home/Developer/
├── Greenlight/                    # Legacy Greenlight directory (deprecated)
├── greenlight-platform/          # Current main platform (THIS DIRECTORY)
├── Top_Bins/                     # Client space for Elevate & Administrate
└── top-bins/                     # Lerna monorepo workspace
```

---

## 🏗️ **DIRECTORY PURPOSES & LIFECYCLE**

### **1. `../Top_Bins/` - Client Space (Configuration/Deployment)**

#### **Purpose**
- **Primary**: Client space for Elevate and Administrate product holons
- **Type**: Configuration and deployment workspace
- **Role**: Production-ready application builds

#### **Contents**
- Coaching toolkit features (Elevate product)
- Team management features (Administrate product)
- Administrative features and dashboards
- Production builds and deployments
- Client-side configuration files
- Deployment scripts and configurations

#### **Package Configuration**
```json
{
  "name": "top-bins-client-space",
  "version": "2.0.0",
  "description": "Client space for Elevate and Administrate product holons"
}
```

#### **Build System**
- **Framework**: Vite with multiple configurations
- **Configs**: 
  - `vite.elevate.config.ts` - Elevate product build
  - `vite.administrate.config.ts` - Administrate product build
- **Deployment**: Netlify, Vercel ready

#### **Lifecycle**
- **Development**: Receives code from `../top-bins/` monorepo
- **Build**: Creates production-ready client applications
- **Deployment**: Hosts live applications for end users

---

### **2. `../top-bins/` - Code Workspace (Lerna Monorepo)**

#### **Purpose**
- **Primary**: Development workspace for product suite
- **Type**: Code workspace using Lerna monorepo
- **Role**: Centralized code development and management

#### **Contents**
```
packages/
├── administrate/     # System management package
├── elevate/         # Coaching toolkit package
└── shared/          # Shared utilities package
```

#### **Package Configuration**
```json
{
  "name": "top-bins",
  "workspaces": ["packages/*"],
  "description": "Top Bins - Product suite including elevate and administrate"
}
```

#### **Build System**
- **Framework**: Lerna with workspace management
- **Scripts**: 
  - `lerna run dev --parallel` - Development mode
  - `lerna run build` - Build all packages
  - `lerna run test` - Test all packages

#### **Lifecycle**
- **Development**: Primary code development happens here
- **Packaging**: Creates reusable packages for client space
- **Distribution**: Provides code to `../Top_Bins/` for builds

---

### **3. `./greenlight-platform/` - Main Platform (Current Directory)**

#### **Purpose**
- **Primary**: Main Greenlight Platform development
- **Type**: Comprehensive platform workspace
- **Role**: Core platform functionality and integration

#### **Contents**
- Core platform components and services
- Holon system implementation
- Governance and management tools
- Documentation and protocols
- System-wide utilities and configurations

#### **Package Configuration**
```json
{
  "name": "greenlight-platform",
  "version": "1.0.0",
  "description": "Holon-Based Entity Management Platform"
}
```

#### **Lifecycle**
- **Development**: Core platform development
- **Integration**: Coordinates with other workspaces
- **Governance**: Manages system-wide protocols and standards

---

## 🔄 **WORKFLOW & INTEGRATION**

### **Development Workflow**
1. **Code Development**: `../top-bins/` (Lerna monorepo)
2. **Package Distribution**: `../top-bins/packages/` → `../Top_Bins/`
3. **Client Build**: `../Top_Bins/` (Vite builds)
4. **Platform Integration**: `./greenlight-platform/` (Core platform)

### **File Management Protocols**

#### **Development Phase**
- **Primary Development**: Use `../top-bins/` for all new code
- **Shared Code**: Place in `../top-bins/packages/shared/`
- **Package-Specific**: Place in respective `packages/[package-name]/`

#### **Build Phase**
- **Client Builds**: Use `../Top_Bins/` for production builds
- **Configuration**: Manage in `../Top_Bins/` deployment configs
- **Assets**: Store in `../Top_Bins/public/` and `../Top_Bins/src/`

#### **Integration Phase**
- **Platform Integration**: Coordinate through `./greenlight-platform/`
- **Protocols**: Manage system-wide protocols in main platform
- **Documentation**: Centralize in main platform docs

---

## 📋 **NAMING CONVENTIONS**

### **Directory Naming**
- **Client Space**: `Top_Bins/` (PascalCase for production)
- **Code Workspace**: `top-bins/` (kebab-case for development)
- **Main Platform**: `greenlight-platform/` (kebab-case)

### **Package Naming**
- **Packages**: `packages/[package-name]/` (kebab-case)
- **Shared**: `packages/shared/` (lowercase)
- **Client**: `top-bins-client-space` (kebab-case)

### **File Naming**
- **Components**: PascalCase (e.g., `PlayerCard.tsx`)
- **Utilities**: camelCase (e.g., `dataEnrichment.ts`)
- **Configs**: kebab-case (e.g., `vite.config.ts`)
- **Scripts**: kebab-case (e.g., `launch_protocol.cjs`)

---

## 🎯 **CONSOLIDATION STATUS**

### **✅ COMPLETED**
- [x] **Directory Structure Analysis** - All directories serve distinct purposes
- [x] **Purpose Documentation** - Clear separation established
- [x] **Naming Conventions** - Consistent naming across all directories
- [x] **Legacy Cleanup** - Removed empty `src/legacy/top-bins/`
- [x] **Workflow Documentation** - Clear development and build processes

### **🔄 IN PROGRESS**
- [ ] **Automated Cleanup Procedures** - Prevent future duplicates
- [ ] **File Organization Validation** - Ensure structure integrity
- [ ] **Script Updates** - Use correct directory paths

### **📋 REMAINING**
- [ ] **Best Practices Guide** - File management standards
- [ ] **Automated Validation** - Directory structure checks
- [ ] **Integration Testing** - Cross-workspace coordination

---

## 🎉 **CONCLUSION**

**The directory structure is correctly organized with clear separation of concerns:**

- **`Top_Bins/`** = Production client space (deployment)
- **`top-bins/`** = Development workspace (monorepo)
- **`greenlight-platform/`** = Main platform (core functionality)

**Each directory serves a specific purpose in the development and deployment lifecycle, ensuring proper separation between development, packaging, and production phases.**

---

*Generated: 2025-07-08T16:22:00Z*
*Status: COMPLETE*
*Next Action: Implement automated validation procedures*

## Greenlight Platform

**Version:** 1.0.0  
**Last Updated:** 2025-07-08  
**Status:** ACTIVE  

---

## 📋 Overview

This guide defines the purpose and responsibilities of each directory in the Greenlight Platform project structure. It ensures consistent understanding and proper file placement across all development activities.

---

## 🏗️ Root Level Directories

### `/api/`
**Purpose:** API endpoints and services  
**Contains:**
- API route definitions
- Endpoint handlers
- API middleware
- API documentation
- API testing files

**Examples:**
- `detectJerseyNumbers.ts`
- API gateway configurations
- Graph manager implementations

### `/backend/`
**Purpose:** Backend application code  
**Contains:**
- Server application code
- Database models and migrations
- Business logic services
- Backend configuration
- Backend tests

**Examples:**
- Express.js server setup
- Database connection logic
- Authentication services
- API controllers

### `/config/`
**Purpose:** Configuration files and templates  
**Contains:**
- Environment-specific configurations
- System configuration templates
- Security configurations
- Integration settings
- Configuration documentation

**Examples:**
- `.env` templates
- Google Workspace configurations
- Security middleware settings
- System evolution configs

### `/data/`
**Purpose:** Data files, sessions, and state  
**Contains:**
- Session data and state
- Historical data and logs
- Migration data
- Protocol reports
- System state snapshots

**Examples:**
- Session files
- Audit reports
- Migration analysis
- System state JSON files

### `/docs/`
**Purpose:** Documentation and guides  
**Contains:**
- Architecture documentation
- User guides and tutorials
- API documentation
- Deployment guides
- Historical documentation

**Examples:**
- Architecture plans
- Implementation summaries
- Deployment strategies
- Audit reports

### `/frontend/`
**Purpose:** Frontend application code  
**Contains:**
- React application code
- Frontend components
- Frontend configuration
- Frontend assets
- Frontend tests

**Examples:**
- React components
- Vite configuration
- Frontend build files
- CSS and styling

### `/greenlight-wiki/`
**Purpose:** Wiki system files  
**Contains:**
- Wiki content and templates
- Wiki configuration
- Wiki assets and scripts
- Wiki documentation

**Examples:**
- Wiki templates
- Content management files
- Wiki setup documentation

### `/infrastructure/`
**Purpose:** Infrastructure and deployment  
**Contains:**
- Deployment configurations
- Infrastructure as code
- Docker configurations
- CI/CD pipelines
- Infrastructure documentation

**Examples:**
- Docker files
- Kubernetes manifests
- Terraform configurations
- Deployment scripts

### `/platforms/`
**Purpose:** Platform-specific components  
**Contains:**
- Platform-specific implementations
- Feature-specific code
- Platform configurations
- Platform documentation

**Examples:**
- `greenlight-platform/elevate/`
- `greenlight-platform/media/`
- `greenlight-platform/grid/`
- `greenlight-platform/team/`

### `/public/`
**Purpose:** Public assets and static files  
**Contains:**
- Static assets
- Public HTML files
- Favicon and icons
- Public configuration files

**Examples:**
- `index.html`
- Static images
- Public JavaScript files
- CSS files

### `/scripts/`
**Purpose:** Automation and utility scripts  
**Contains:**
- Build and deployment scripts
- Maintenance scripts
- Utility functions
- Protocol implementations
- Script documentation

**Examples:**
- Launch protocols
- Audit scripts
- Migration scripts
- Background agents

### `/src/`
**Purpose:** Core source code  
**Contains:**
- Main application code
- Core components and services
- Shared utilities
- Type definitions
- Core tests

**Examples:**
- Core React components
- Shared utilities
- Type definitions
- Core services

---

## 🎯 Platform-Specific Directories

### `/platforms/greenlight-platform/elevate/`
**Purpose:** Elevate platform components  
**Contains:**
- Elevate-specific components
- Elevate business logic
- Elevate configuration
- Elevate documentation

### `/platforms/greenlight-platform/media/`
**Purpose:** Media library components  
**Contains:**
- Media library components
- Media processing logic
- Media configuration
- Media documentation

### `/platforms/greenlight-platform/grid/`
**Purpose:** Player grid components  
**Contains:**
- Player grid components
- Grid layout logic
- Grid configuration
- Grid documentation

### `/platforms/greenlight-platform/team/`
**Purpose:** Team portal components  
**Contains:**
- Team portal components
- Team management logic
- Team configuration
- Team documentation

---

## 📁 Subdirectory Organization

### `/src/components/`
**Purpose:** React components  
**Organization:**
- Group by feature or domain
- Co-locate related files (component, types, tests, styles)
- Use consistent naming conventions
- Maintain clear separation of concerns

### `/src/services/`
**Purpose:** Business logic and external integrations  
**Organization:**
- Group by service type (auth, data, external APIs)
- Separate concerns clearly
- Maintain consistent interfaces
- Include proper error handling

### `/src/utils/`
**Purpose:** Shared utilities and helpers  
**Organization:**
- Group by functionality
- Maintain pure functions where possible
- Include comprehensive documentation
- Provide proper TypeScript types

### `/docs/architecture/`
**Purpose:** Architecture documentation  
**Organization:**
- System-level architecture
- Component architecture
- Integration patterns
- Design decisions and rationale

### `/docs/guides/`
**Purpose:** User and developer guides  
**Organization:**
- Getting started guides
- Development workflows
- Best practices
- Troubleshooting guides

---

## 🔄 File Movement Guidelines

### When to Move Files
1. **Feature Consolidation:** Group related functionality
2. **Architecture Evolution:** Align with new architectural patterns
3. **Organization Improvement:** Better logical grouping
4. **Dependency Management:** Reduce coupling and improve modularity

### Movement Protocol
1. **Plan Movement:** Document the planned changes
2. **Update References:** Update all import statements
3. **Test Thoroughly:** Ensure functionality is preserved
4. **Update Documentation:** Reflect new organization
5. **Commit Changes:** Use descriptive commit messages

### Prohibited Movements
1. **Breaking Changes:** Avoid moving files that would break existing functionality
2. **Public APIs:** Be careful with files that are part of public APIs
3. **Configuration Files:** Avoid moving configuration files without proper migration
4. **Build Artifacts:** Never move generated or build files

---

## 📊 Directory Health Metrics

### Organization Metrics
- **File Count:** Number of files in each directory
- **Directory Depth:** Maximum nesting level
- **File Distribution:** Balance across directories
- **Naming Consistency:** Adherence to naming conventions

### Quality Metrics
- **Documentation Coverage:** Percentage of documented directories
- **Test Coverage:** Test files present for each directory
- **Dependency Health:** Clean dependency relationships
- **Maintenance Burden:** Complexity and maintenance requirements

### Performance Metrics
- **Build Time Impact:** Effect on build and deployment times
- **Import Performance:** Efficiency of import statements
- **Bundle Size Impact:** Effect on application bundle size
- **Development Velocity:** Impact on development speed

---

## 🛠️ Maintenance Responsibilities

### Daily Responsibilities
- Review new files for proper placement
- Update documentation for new directories
- Ensure naming conventions are followed

### Weekly Responsibilities
- Review directory organization
- Clean up orphaned or misplaced files
- Update directory purpose documentation

### Monthly Responsibilities
- Comprehensive directory structure review
- Architecture alignment assessment
- Performance and organization optimization

### Quarterly Responsibilities
- Major reorganization if needed
- Tool and automation improvements
- Process and guideline updates

---

## 🚨 Emergency Procedures

### Critical Issues
1. **File System Corruption:** Immediate backup and recovery
2. **Security Breach:** Secure and audit affected directories
3. **Data Loss:** Restore from backups and investigate
4. **Build Failures:** Rollback to last working state

### Response Protocol
1. **Assess Impact:** Determine scope and severity
2. **Contain Issue:** Prevent further damage
3. **Communicate:** Notify relevant stakeholders
4. **Resolve:** Fix the issue and prevent recurrence
5. **Document:** Record incident and lessons learned

---

## 📚 References

- [File Management Protocols](./FILE_MANAGEMENT_PROTOCOLS.md)
- [Development Standards](./docs/guides/DEVELOPMENT_STANDARDS.md)
- [Architecture Documentation](./docs/architecture/)
- [Project Roadmap](./ROADMAP.md)

---

*This guide is a living document and should be updated as the project evolves. All team members are responsible for following these guidelines and suggesting improvements.* 
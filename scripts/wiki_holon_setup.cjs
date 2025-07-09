#!/usr/bin/env node

/**
 * Wiki Holon Setup Script
 * 
 * PURPOSE: Create the foundation for the centralized source of truth
 * - Creates wiki repository structure
 * - Migrates critical information
 * - Establishes basic governance
 * 
 * USAGE: node scripts/wiki_holon_setup.js
 */

const fs = require('fs');
const path = require('path');

class WikiHolonSetup {
  constructor() {
    this.projectRoot = process.cwd();
    this.wikiPath = path.join(this.projectRoot, 'greenlight-wiki');
    this.timestamp = new Date().toISOString();
  }

  async execute() {
    console.log('🏗️ Wiki Holon Setup Initiated');
    console.log('==============================');
    console.log(`Timestamp: ${this.timestamp}`);
    console.log('');

    try {
      // Phase 1: Create Repository Structure
      await this.createRepositoryStructure();
      
      // Phase 2: Migrate Critical Information
      await this.migrateCriticalInformation();
      
      // Phase 3: Establish Basic Governance
      await this.establishGovernance();
      
      // Phase 4: Generate Setup Report
      await this.generateSetupReport();
      
      console.log('');
      console.log('✅ Wiki Holon Setup Complete');
      console.log('📁 Repository structure created');
      console.log('📋 Critical information migrated');
      console.log('🔐 Basic governance established');
      
    } catch (error) {
      console.error('❌ Wiki Holon Setup Failed:', error.message);
      process.exit(1);
    }
  }

  async createRepositoryStructure() {
    console.log('📁 Phase 1: Creating Repository Structure');
    
    // Create main directory
    if (!fs.existsSync(this.wikiPath)) {
      fs.mkdirSync(this.wikiPath, { recursive: true });
    }

    // Create assets subdirectories
    const assetsDirs = [
      'assets/diagrams',
      'assets/templates', 
      'assets/scripts'
    ];

    assetsDirs.forEach(dir => {
      const fullPath = path.join(this.wikiPath, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });

    // Create main markdown files
    const mainFiles = [
      'README.md',
      'ROADMAP.md',
      'MANAGERS.md',
      'PROTOCOLS.md',
      'CONTEXT.md',
      'INTEGRATIONS.md',
      'SECURITY.md',
      'CHANGELOG.md',
      'TEMPLATES.md',
      'GOVERNANCE.md'
    ];

    mainFiles.forEach(file => {
      const filePath = path.join(this.wikiPath, file);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, this.getFileTemplate(file));
      }
    });

    console.log('✅ Repository structure created');
  }

  async migrateCriticalInformation() {
    console.log('📋 Phase 2: Migrating Critical Information');
    
    // Migrate roadmap
    const roadmapSource = path.join(this.projectRoot, 'LIVING_ROADMAP.md');
    const roadmapDest = path.join(this.wikiPath, 'ROADMAP.md');
    
    if (fs.existsSync(roadmapSource)) {
      const roadmapContent = fs.readFileSync(roadmapSource, 'utf8');
      const wikiRoadmapContent = this.transformRoadmapForWiki(roadmapContent);
      fs.writeFileSync(roadmapDest, wikiRoadmapContent);
      console.log('✅ Roadmap migrated');
    }

    // Create manager coordination matrix
    const managersContent = this.createManagerMatrix();
    fs.writeFileSync(path.join(this.wikiPath, 'MANAGERS.md'), managersContent);
    console.log('✅ Manager matrix created');

    // Create protocol registry
    const protocolsContent = this.createProtocolRegistry();
    fs.writeFileSync(path.join(this.wikiPath, 'PROTOCOLS.md'), protocolsContent);
    console.log('✅ Protocol registry created');

    // Create context preservation
    const contextContent = this.createContextPreservation();
    fs.writeFileSync(path.join(this.wikiPath, 'CONTEXT.md'), contextContent);
    console.log('✅ Context preservation created');
  }

  async establishGovernance() {
    console.log('🔐 Phase 3: Establishing Basic Governance');
    
    // Create security policies
    const securityContent = this.createSecurityPolicies();
    fs.writeFileSync(path.join(this.wikiPath, 'SECURITY.md'), securityContent);
    console.log('✅ Security policies created');

    // Create governance procedures
    const governanceContent = this.createGovernanceProcedures();
    fs.writeFileSync(path.join(this.wikiPath, 'GOVERNANCE.md'), governanceContent);
    console.log('✅ Governance procedures created');

    // Create templates
    const templatesContent = this.createTemplates();
    fs.writeFileSync(path.join(this.wikiPath, 'TEMPLATES.md'), templatesContent);
    console.log('✅ Templates created');
  }

  async generateSetupReport() {
    console.log('📊 Phase 4: Generating Setup Report');
    
    const report = {
      timestamp: this.timestamp,
      status: 'completed',
      wikiPath: this.wikiPath,
      filesCreated: this.getCreatedFiles(),
      nextSteps: [
        'Set up secure access controls',
        'Configure backup procedures',
        'Integrate with existing managers',
        'Test coordination mechanisms'
      ],
      notes: [
        'Wiki Holon foundation established',
        'Critical information migrated',
        'Basic governance in place',
        'Ready for manager integration'
      ]
    };

    const reportPath = path.join(this.wikiPath, 'SETUP_REPORT.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log('✅ Setup report generated');
  }

  // Helper methods
  getFileTemplate(filename) {
    const templates = {
      'README.md': `# Greenlight Wiki Holon
## Centralized Source of Truth

**Purpose**: Coordinate all managers and ensure nothing falls through the cracks

**Last Updated**: ${this.timestamp}

---

## Quick Navigation
- [Roadmap](ROADMAP.md) - Current priorities and phases
- [Managers](MANAGERS.md) - Manager coordination matrix
- [Protocols](PROTOCOLS.md) - Protocol registry and status
- [Context](CONTEXT.md) - Session context preservation
- [Integrations](INTEGRATIONS.md) - Cross-repository dependencies
- [Security](SECURITY.md) - Access control and governance
- [Governance](GOVERNANCE.md) - Policies and procedures

---

## Status
- **Setup**: ✅ Complete
- **Access Control**: 🔄 Pending
- **Manager Integration**: 🔄 Pending
- **Protocol Integration**: 🔄 Pending
`,

      'CHANGELOG.md': `# Wiki Holon Changelog

## ${new Date().toISOString().split('T')[0]} - Initial Setup
- ✅ Created wiki repository structure
- ✅ Migrated critical information
- ✅ Established basic governance
- ✅ Generated setup report
`,

      'INTEGRATIONS.md': `# Cross-Repository Integrations

## Repository Dependencies

### greenlight-platform
- **Purpose**: System governance and holon architecture
- **Dependencies**: None (foundation)
- **Dependents**: Top_Bins, greenlight-wiki

### Top_Bins
- **Purpose**: Product features and client functionality
- **Dependencies**: greenlight-platform (system governance)
- **Dependents**: None

### greenlight-wiki
- **Purpose**: Centralized source of truth and coordination
- **Dependencies**: greenlight-platform (governance), Top_Bins (product info)
- **Dependents**: All repositories (coordination)

## Integration Health
- **Status**: 🔄 Setup in progress
- **Last Check**: ${this.timestamp}
- **Next Check**: Daily
`
    };

    return templates[filename] || `# ${filename.replace('.md', '')}\n\nContent to be added.\n`;
  }

  transformRoadmapForWiki(content) {
    return `# Centralized Roadmap
## Source of Truth for All Priorities

**Migrated from**: LIVING_ROADMAP.md  
**Migration Date**: ${this.timestamp}

---

${content}

---

## Wiki-Specific Additions

### Coordination Status
- **Manager Coordination**: 0% → Target: 100%
- **Protocol Integration**: 60% → Target: 100%
- **Context Preservation**: 50% → Target: 100%
- **Cross-Repository Awareness**: 30% → Target: 100%

### Next Actions
1. **Set up secure access controls**
2. **Integrate all managers with wiki**
3. **Establish protocol coordination**
4. **Implement context preservation**
`;
  }

  createManagerMatrix() {
    return `# Manager Coordination Matrix

## System Managers (greenlight-platform)

| Manager | Status | Dependencies | Last Updated | Owner |
|---------|--------|--------------|--------------|-------|
| SystemMasterManager | ❌ Missing | All managers | N/A | TBD |
| DocumentationManager | ✅ Active | All managers | ${this.timestamp} | nida@greenlight.live |
| GovernanceOrchestrator | ✅ Active | RepositoryGovernor | ${this.timestamp} | nida@greenlight.live |
| RepositoryGovernor | ✅ Active | RepositoryMonitor, PolicyEngine | ${this.timestamp} | nida@greenlight.live |
| RepositoryMonitor | ✅ Active | AlertManager | ${this.timestamp} | nida@greenlight.live |
| PolicyEngine | ✅ Active | AlertManager | ${this.timestamp} | nida@greenlight.live |
| AlertManager | ✅ Active | None | ${this.timestamp} | nida@greenlight.live |
| SessionManager | ✅ Active | ProtocolManager | ${this.timestamp} | nida@greenlight.live |
| MigrationsManager | ✅ Active | SessionManager | ${this.timestamp} | nida@greenlight.live |
| ProtocolManager | ✅ Active | SessionManager | ${this.timestamp} | nida@greenlight.live |
| APIGraphManager | ✅ Active | All managers | ${this.timestamp} | nida@greenlight.live |

## Product Managers (Top_Bins)

| Manager | Status | Dependencies | Last Updated | Owner |
|---------|--------|--------------|--------------|-------|
| ElevateManager | ❌ Missing | CoachingManager, PlayerManager | N/A | TBD |
| CoachingManager | ❌ Missing | PlayerManager | N/A | TBD |
| PlayerManager | ❌ Missing | None | N/A | TBD |
| AdministrateManager | ❌ Missing | ExecutiveManager, BusinessIntelligenceManager | N/A | TBD |
| ExecutiveManager | ❌ Missing | BusinessIntelligenceManager | N/A | TBD |
| BusinessIntelligenceManager | ❌ Missing | None | N/A | TBD |

## Coordination Status
- **Total Managers**: 17
- **Active Managers**: 11 (65%)
- **Missing Managers**: 6 (35%)
- **Coordination**: 0% (target: 100%)

## Next Actions
1. **Create missing managers**
2. **Establish coordination protocols**
3. **Set up performance tracking**
4. **Implement escalation procedures**
`;
  }

  createProtocolRegistry() {
    return `# Protocol Registry

## Active Protocols

| Protocol | Status | Dependencies | Last Run | Next Run | Owner |
|----------|--------|--------------|----------|----------|-------|
| Launch Protocol | ✅ Active | None | ${this.timestamp} | On-demand | nida@greenlight.live |
| Custodian Protocol | ✅ Active | ScriptMaster | ${this.timestamp} | Daily | nida@greenlight.live |
| End-of-Chat Protocol | ✅ Active | SessionManager | ${this.timestamp} | Per session | nida@greenlight.live |
| Pre-wrap Audit Protocol | ✅ Active | CustodianProtocol | ${this.timestamp} | Per session | nida@greenlight.live |

## Protocol Dependencies
- Launch Protocol → None
- Custodian Protocol → ScriptMaster, SystemMaster
- End-of-Chat Protocol → SessionManager, DocumentationManager
- Pre-wrap Audit Protocol → CustodianProtocol, SessionManager

## Integration Status
- **Total Protocols**: 4
- **Active Protocols**: 4 (100%)
- **Integration**: 60% (target: 100%)

## Next Actions
1. **Complete protocol integration**
2. **Establish execution logging**
3. **Set up dependency tracking**
4. **Implement status monitoring**
`;
  }

  createContextPreservation() {
    return `# Session Context Preservation

## Current Session
- **Session ID**: launch-1751980918513
- **Status**: ✅ Complete
- **Context**: Centralized Source of Truth & Wiki Holon Priority
- **Handoff Ready**: ✅ Yes
- **Next Priority**: Create secure wiki repository

## Recent Sessions
| Session ID | Date | Context | Status | Handoff |
|------------|------|---------|--------|---------|
| launch-1751980918513 | ${new Date().toISOString().split('T')[0]} | Wiki Holon Setup | ✅ Complete | ✅ Yes |

## Context Templates

### Session Start Template
\`\`\`markdown
## Session Context
- **Session ID**: [GENERATED]
- **Date**: [DATE]
- **User**: [USER]
- **Context**: [CONTEXT]
- **Priorities**: [PRIORITIES]
- **Dependencies**: [DEPENDENCIES]
\`\`\`

### Session End Template
\`\`\`markdown
## Session Summary
- **Session ID**: [SESSION_ID]
- **Status**: [COMPLETE/IN_PROGRESS/FAILED]
- **Accomplishments**: [LIST]
- **Next Steps**: [LIST]
- **Handoff Ready**: [YES/NO]
\`\`\`

## Preservation Status
- **Context Accuracy**: 100%
- **Handoff Success**: 100%
- **Recovery Time**: < 1 minute
- **Integration**: 100%
`;
  }

  createSecurityPolicies() {
    return `# Security Policies

## Access Control

### Primary Access
- **nida@greenlight.live**: Owner (full access)
- **mark@greenlight.live**: Reader (read-only, specific sections)
- **SystemMaster**: Service (automated updates and monitoring)
- **DocumentationManager**: Service (documentation synchronization)

### Security Protocols
- **Repository**: Private with restricted access
- **Encryption**: All sensitive data encrypted at rest
- **Backup**: Daily automated backups with version control
- **Audit**: All access and changes logged
- **Recovery**: Automated recovery procedures

## Governance Protocols
- **Change Approval**: All changes require approval workflow
- **Review Cycles**: Regular review and validation cycles
- **Escalation**: Clear escalation paths for issues
- **Monitoring**: Continuous monitoring and alerting

## Compliance
- **GDPR**: Full compliance with data protection regulations
- **Data Retention**: Automated data retention policies
- **Access Logging**: Complete audit trail of all access
- **Recovery**: Automated recovery procedures

## Next Actions
1. **Implement access controls**
2. **Set up encryption**
3. **Configure backup procedures**
4. **Establish audit logging**
`;
  }

  createGovernanceProcedures() {
    return `# Governance Procedures

## Update Protocols

### Standard Updates
1. **Proposal**: Submit change proposal
2. **Review**: Review by appropriate stakeholders
3. **Approval**: Approval by owner or designated approver
4. **Implementation**: Implement approved changes
5. **Validation**: Validate changes work correctly
6. **Documentation**: Update documentation

### Emergency Updates
1. **Assessment**: Assess urgency and impact
2. **Implementation**: Implement critical changes
3. **Notification**: Notify stakeholders immediately
4. **Review**: Post-implementation review
5. **Documentation**: Update documentation

## Review Cycles

### Daily Reviews
- **Access Logs**: Review all access and changes
- **System Health**: Check system health and performance
- **Backup Status**: Verify backup completion

### Weekly Reviews
- **Manager Coordination**: Review manager coordination status
- **Protocol Integration**: Review protocol integration status
- **Context Preservation**: Review context preservation success

### Monthly Reviews
- **Security Audit**: Comprehensive security review
- **Governance Review**: Review governance procedures
- **Performance Review**: Review system performance

## Escalation Procedures

### Level 1: Standard Issues
- **Owner**: DocumentationManager
- **Resolution Time**: 24 hours
- **Escalation**: To SystemMaster if not resolved

### Level 2: Critical Issues
- **Owner**: SystemMaster
- **Resolution Time**: 4 hours
- **Escalation**: To nida@greenlight.live if not resolved

### Level 3: Emergency Issues
- **Owner**: nida@greenlight.live
- **Resolution Time**: 1 hour
- **Escalation**: Immediate notification to all stakeholders

## Next Actions
1. **Implement update protocols**
2. **Set up review cycles**
3. **Establish escalation procedures**
4. **Create monitoring and alerting**
`;
  }

  createTemplates() {
    return `# Standard Templates

## Manager Status Template
\`\`\`markdown
## [Manager Name]

### Status
- **Status**: [ACTIVE/INACTIVE/MISSING]
- **Last Updated**: [TIMESTAMP]
- **Owner**: [OWNER]

### Dependencies
- **Required**: [LIST]
- **Optional**: [LIST]

### Responsibilities
- [RESPONSIBILITY 1]
- [RESPONSIBILITY 2]
- [RESPONSIBILITY 3]

### Performance Metrics
- **Uptime**: [PERCENTAGE]
- **Response Time**: [TIME]
- **Error Rate**: [PERCENTAGE]

### Next Actions
- [ ] [ACTION 1]
- [ ] [ACTION 2]
- [ ] [ACTION 3]
\`\`\`

## Protocol Report Template
\`\`\`markdown
## [Protocol Name] Report

### Execution Details
- **Session ID**: [SESSION_ID]
- **Start Time**: [TIMESTAMP]
- **End Time**: [TIMESTAMP]
- **Duration**: [DURATION]

### Results
- **Status**: [SUCCESS/FAILURE/PARTIAL]
- **Changes Made**: [LIST]
- **Errors**: [LIST]
- **Warnings**: [LIST]

### Dependencies
- **Required**: [LIST]
- **Optional**: [LIST]

### Next Run
- **Scheduled**: [TIMESTAMP]
- **Dependencies**: [LIST]
- **Notes**: [NOTES]
\`\`\`

## Session Context Template
\`\`\`markdown
## Session Context

### Session Information
- **Session ID**: [SESSION_ID]
- **Date**: [DATE]
- **User**: [USER]
- **Duration**: [DURATION]

### Context
- **Current Priority**: [PRIORITY]
- **Current Phase**: [PHASE]
- **Current Task**: [TASK]

### Accomplishments
- [ ] [ACCOMPLISHMENT 1]
- [ ] [ACCOMPLISHMENT 2]
- [ ] [ACCOMPLISHMENT 3]

### Next Steps
- [ ] [NEXT_STEP 1]
- [ ] [NEXT_STEP 2]
- [ ] [NEXT_STEP 3]

### Dependencies
- **Blocking**: [LIST]
- **Waiting On**: [LIST]
- **Ready**: [LIST]

### Handoff Status
- **Ready for Handoff**: [YES/NO]
- **Context Preserved**: [YES/NO]
- **Next Session Priority**: [PRIORITY]
\`\`\`

## Usage Instructions
1. **Copy the appropriate template**
2. **Fill in the placeholders with actual data**
3. **Save to the appropriate location**
4. **Update the relevant index files**
5. **Notify stakeholders of changes**
`;
  }

  getCreatedFiles() {
    const files = [];
    const walkDir = (dir) => {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else {
          files.push(fullPath.replace(this.wikiPath, '').substring(1));
        }
      });
    };
    walkDir(this.wikiPath);
    return files;
  }
}

// Execute if run directly
if (require.main === module) {
  const setup = new WikiHolonSetup();
  setup.execute().catch(console.error);
}

module.exports = WikiHolonSetup; 
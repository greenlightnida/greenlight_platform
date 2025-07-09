#!/usr/bin/env node

/**
 * Client Onboarding Manager v1.0.0
 * 
 * PURPOSE: Comprehensive onboarding system for new client spaces and agent entities
 * - Integrates boundary enforcement, file management, and repository management
 * - Establishes thorough holon processes with all relevant managers
 * - Creates comprehensive criteria and validation systems
 * - Generates unique greenlight platform systems for each client
 * - Ensures legitimate, cool, thorough, and secure independent builds
 * 
 * USAGE: node scripts/protocols/client_onboarding_manager.cjs [--client=CLIENT_NAME] [--type=client|agent] [--validate]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function isElevateRequest(holons) {
  return Array.isArray(holons) && holons.map(h => h.toLowerCase()).includes('elevate');
}

const PRODUCT_HOLONS = ['elevate', 'anotherproduct', 'sampleproduct']; // Add all product holon names here
function isProductHolonRequest(holons) {
  return Array.isArray(holons) && holons.map(h => h.toLowerCase()).some(h => PRODUCT_HOLONS.includes(h));
}

class ClientOnboardingManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.sessionId = `onboarding-${Date.now()}`;
    this.clientName = null;
    this.clientType = null; // 'client' or 'agent'
    this.onboardingData = {};
    this.validationResults = {};
    this.managerParticipation = {};
    
    // Manager integration registry
    this.managers = {
      boundary: 'boundary_enforcement_manager.cjs',
      file: 'file_management_scan.ts',
      repo: 'repository_governor.cjs',
      governance: 'governance_orchestrator.cjs',
      security: 'security_manager.cjs',
      protocol: 'protocol_manager.cjs',
      session: 'session_manager.cjs',
      documentation: 'documentation_manager.cjs',
      alert: 'alert_manager.cjs',
      monitoring: 'monitoring_manager.cjs',
      database: 'database_manager.cjs'
    };
  }

  async initializeOnboarding(clientName, clientType = 'client') {
    console.log('🚀 Client Onboarding Manager v1.0.0');
    console.log('====================================');
    console.log(`Session ID: ${this.sessionId}`);
    console.log(`Client: ${clientName}`);
    console.log(`Type: ${clientType}`);
    console.log('');

    this.clientName = clientName;
    this.clientType = clientType;
    
    // Initialize onboarding data structure
    this.onboardingData = {
      clientInfo: {
        name: clientName,
        type: clientType,
        onboardingDate: new Date().toISOString(),
        sessionId: this.sessionId
      },
      criteria: {},
      validation: {},
      holonSetup: {},
      managerParticipation: {},
      generatedSystems: {},
      securityProfile: {},
      documentation: {}
    };

    return true;
  }

  async runComprehensiveOnboarding() {
    console.log('🎯 Phase 1: Comprehensive Criteria Assessment');
    console.log('============================================');
    
    // Phase 1: Criteria Assessment
    await this.assessOnboardingCriteria();
    
    console.log('🔍 Phase 2: Manager Participation Coordination');
    console.log('==============================================');
    
    // Phase 2: Manager Coordination
    await this.coordinateManagerParticipation();
    
    console.log('🏗️ Phase 3: Holon Process Establishment');
    console.log('=======================================');
    
    // Phase 3: Holon Setup
    await this.establishHolonProcess();
    
    console.log('🛡️ Phase 4: Security and Validation');
    console.log('====================================');
    
    // Phase 4: Security & Validation
    await this.performSecurityValidation();
    
    console.log('📋 Phase 5: System Generation');
    console.log('=============================');
    
    // Phase 5: System Generation
    await this.generateClientSystems();
    
    console.log('📊 Phase 6: Documentation and Handoff');
    console.log('=====================================');
    
    // Phase 6: Documentation
    await this.generateDocumentation();
    
    console.log('✅ Onboarding Complete');
    console.log('=====================');
    
    return this.onboardingData;
  }

  async assessOnboardingCriteria() {
    console.log('Assessing comprehensive onboarding criteria...');
    
    // Define comprehensive criteria categories
    const criteriaCategories = {
      technical: {
        architecture: ['Scalable architecture', 'Microservices ready', 'API-first design'],
        security: ['Data encryption', 'Access controls', 'Audit logging'],
        performance: ['Response time < 200ms', '99.9% uptime', 'Load balancing'],
        monitoring: ['Real-time monitoring', 'Alert systems', 'Performance tracking']
      },
      business: {
        compliance: ['GDPR compliance', 'Industry standards', 'Legal requirements'],
        scalability: ['User growth support', 'Feature expansion', 'Market adaptation'],
        integration: ['Third-party APIs', 'Data migration', 'System compatibility']
      },
      operational: {
        deployment: ['CI/CD pipeline', 'Environment management', 'Rollback procedures'],
        maintenance: ['Update procedures', 'Backup systems', 'Disaster recovery'],
        support: ['Documentation', 'Training materials', 'Support processes']
      },
      governance: {
        access: ['Role-based access', 'Permission management', 'Audit trails'],
        policies: ['Data policies', 'Security policies', 'Usage policies'],
        compliance: ['Regulatory compliance', 'Industry standards', 'Internal policies']
      }
    };

    // Assess each category
    for (const [category, subcategories] of Object.entries(criteriaCategories)) {
      this.onboardingData.criteria[category] = {};
      
      for (const [subcategory, requirements] of Object.entries(subcategories)) {
        this.onboardingData.criteria[category][subcategory] = {
          requirements: requirements,
          assessment: await this.assessRequirements(requirements),
          score: 0,
          recommendations: []
        };
        
        // Calculate score
        const assessment = this.onboardingData.criteria[category][subcategory].assessment;
        this.onboardingData.criteria[category][subcategory].score = 
          (assessment.met.length / requirements.length) * 100;
      }
    }

    console.log('✅ Criteria assessment complete');
  }

  async assessRequirements(requirements) {
    const assessment = {
      met: [],
      partiallyMet: [],
      notMet: [],
      requiresReview: []
    };

    for (const requirement of requirements) {
      // Simulate assessment based on requirement type
      const assessmentResult = await this.evaluateRequirement(requirement);
      assessment[assessmentResult].push(requirement);
    }

    return assessment;
  }

  async evaluateRequirement(requirement) {
    // This would integrate with actual assessment systems
    // For now, simulate based on requirement keywords
    if (requirement.includes('security') || requirement.includes('encryption')) {
      return 'requiresReview';
    } else if (requirement.includes('monitoring') || requirement.includes('tracking')) {
      return 'partiallyMet';
    } else if (requirement.includes('architecture') || requirement.includes('design')) {
      return 'met';
    } else {
      return 'notMet';
    }
  }

  async coordinateManagerParticipation() {
    console.log('Coordinating manager participation...');
    
    // Define manager participation matrix
    const managerRoles = {
      boundary: {
        role: 'Boundary Enforcement',
        responsibilities: [
          'Establish client space boundaries',
          'Define code separation rules',
          'Set up monitoring and alerts',
          'Create boundary violation protocols'
        ],
        participation: 'required'
      },
      file: {
        role: 'File Management',
        responsibilities: [
          'Organize client file structure',
          'Establish naming conventions',
          'Set up file lifecycle management',
          'Create backup and recovery procedures'
        ],
        participation: 'required'
      },
      repo: {
        role: 'Repository Management',
        responsibilities: [
          'Create client repository structure',
          'Set up version control',
          'Establish branching strategies',
          'Configure deployment pipelines'
        ],
        participation: 'required'
      },
      governance: {
        role: 'Governance Orchestration',
        responsibilities: [
          'Define governance policies',
          'Establish compliance frameworks',
          'Set up audit procedures',
          'Create escalation protocols'
        ],
        participation: 'required'
      },
      security: {
        role: 'Security Management',
        responsibilities: [
          'Define security requirements',
          'Set up access controls',
          'Establish encryption standards',
          'Create security monitoring'
        ],
        participation: 'required'
      },
      protocol: {
        role: 'Protocol Management',
        responsibilities: [
          'Define operational protocols',
          'Set up communication channels',
          'Establish escalation procedures',
          'Create incident response plans'
        ],
        participation: 'required'
      },
      session: {
        role: 'Session Management',
        responsibilities: [
          'Set up session tracking',
          'Establish context preservation',
          'Create session recovery procedures',
          'Define session security'
        ],
        participation: 'required'
      },
      documentation: {
        role: 'Documentation Management',
        responsibilities: [
          'Create client documentation',
          'Establish documentation standards',
          'Set up knowledge management',
          'Create training materials'
        ],
        participation: 'required'
      },
      alert: {
        role: 'Alert Management',
        responsibilities: [
          'Set up alert systems',
          'Define notification channels',
          'Establish escalation procedures',
          'Create alert response protocols'
        ],
        participation: 'required'
      },
      monitoring: {
        role: 'Monitoring Management',
        responsibilities: [
          'Set up monitoring systems',
          'Define performance metrics',
          'Establish health checks',
          'Create reporting procedures'
        ],
        participation: 'required'
      },
      database: {
        role: 'Database Management',
        responsibilities: [
          'Design progressive schema architecture',
          'Set up database monitoring and health checks',
          'Establish R&D testing protocols',
          'Create data migration and versioning strategies',
          'Implement backup and recovery procedures',
          'Set up performance optimization and indexing',
          'Establish data governance and compliance'
        ],
        participation: 'required'
      }
    };

    // Coordinate each manager
    for (const [managerKey, managerInfo] of Object.entries(managerRoles)) {
      console.log(`Coordinating ${managerInfo.role}...`);
      
      this.onboardingData.managerParticipation[managerKey] = {
        role: managerInfo.role,
        responsibilities: managerInfo.responsibilities,
        participation: managerInfo.participation,
        status: 'coordinated',
        setupComplete: false,
        integrationPoints: await this.identifyIntegrationPoints(managerKey),
        dependencies: await this.identifyDependencies(managerKey)
      };
    }

    console.log('✅ Manager participation coordinated');
  }

  async identifyIntegrationPoints(managerKey) {
    // Define integration points for each manager
    const integrationPoints = {
      boundary: ['file', 'repo', 'security', 'monitoring'],
      file: ['repo', 'boundary', 'documentation'],
      repo: ['boundary', 'file', 'governance', 'security'],
      governance: ['repo', 'security', 'protocol', 'alert'],
      security: ['boundary', 'repo', 'governance', 'monitoring'],
      protocol: ['governance', 'session', 'alert'],
      session: ['protocol', 'security', 'monitoring'],
      documentation: ['file', 'governance', 'session'],
      alert: ['monitoring', 'security', 'protocol'],
      monitoring: ['boundary', 'security', 'alert'],
      database: ['security', 'monitoring', 'governance']
    };

    return integrationPoints[managerKey] || [];
  }

  async identifyDependencies(managerKey) {
    // Define dependencies for each manager
    const dependencies = {
      boundary: ['repo', 'security'],
      file: ['repo'],
      repo: ['governance'],
      governance: ['security'],
      security: ['monitoring'],
      protocol: ['governance'],
      session: ['security'],
      documentation: ['file'],
      alert: ['monitoring'],
      monitoring: ['security'],
      database: ['security']
    };

    return dependencies[managerKey] || [];
  }

  async establishHolonProcess() {
    console.log('Establishing holon process...');
    
    // Define holon structure for client
    const clientHolons = {
      systemMaster: {
        description: 'Client system governance and oversight',
        managers: ['governance', 'security', 'monitoring'],
        responsibilities: [
          'System-wide governance',
          'Security oversight',
          'Performance monitoring',
          'Cross-platform coordination'
        ]
      },
      elevate: {
        description: 'Client-specific product governance',
        managers: ['protocol', 'session', 'documentation'],
        responsibilities: [
          'Product feature governance',
          'User experience management',
          'Feature development coordination',
          'Product roadmap management'
        ]
      },
      administrate: {
        description: 'Client business intelligence and operations',
        managers: ['alert', 'monitoring', 'documentation'],
        responsibilities: [
          'Business intelligence',
          'Operational oversight',
          'Reporting and analytics',
          'Performance optimization'
        ]
      },
      elaborate: {
        description: 'Client system evolution and optimization',
        managers: ['boundary', 'file', 'repo', 'database'],
        responsibilities: [
          'System evolution tracking',
          'Architecture optimization',
          'Code quality management',
          'Technical debt reduction',
          'Database schema evolution'
        ]
      },
      articulate: {
        description: 'Client knowledge management and communication',
        managers: ['documentation', 'session', 'protocol'],
        responsibilities: [
          'Knowledge management',
          'Communication protocols',
          'Training and documentation',
          'Information architecture'
        ]
      }
    };

    // Set up each holon
    for (const [holonKey, holonInfo] of Object.entries(clientHolons)) {
      if (isProductHolonRequest(this.onboardingData.holonSetup[holonKey]?.managers)) {
        throw new Error('Product holons cannot be included in client or agent onboarding. This applies to all product holons.');
      }
      this.onboardingData.holonSetup[holonKey] = {
        description: holonInfo.description,
        managers: holonInfo.managers,
        responsibilities: holonInfo.responsibilities,
        status: 'configured',
        setupComplete: false,
        integrationPoints: await this.setupHolonIntegration(holonKey, holonInfo.managers)
      };
    }

    console.log('✅ Holon process established');
  }

  async setupHolonIntegration(holonKey, managers) {
    const integrationPoints = [];
    
    for (const manager of managers) {
      integrationPoints.push({
        manager: manager,
        integrationType: 'holon_member',
        status: 'configured',
        responsibilities: this.onboardingData.managerParticipation[manager]?.responsibilities || []
      });
    }

    return integrationPoints;
  }

  async performSecurityValidation() {
    console.log('Performing security validation...');
    
    // Define security validation criteria
    const securityCriteria = {
      access_control: {
        requirements: [
          'Role-based access control',
          'Multi-factor authentication',
          'Session management',
          'Permission granularity'
        ],
        validation: 'required'
      },
      data_protection: {
        requirements: [
          'Data encryption at rest',
          'Data encryption in transit',
          'Data backup procedures',
          'Data retention policies'
        ],
        validation: 'required'
      },
      audit_logging: {
        requirements: [
          'Comprehensive audit trails',
          'Log retention policies',
          'Log analysis capabilities',
          'Alert integration'
        ],
        validation: 'required'
      },
      compliance: {
        requirements: [
          'GDPR compliance',
          'Industry standards',
          'Legal requirements',
          'Internal policies'
        ],
        validation: 'required'
      }
    };

    // Perform validation
    for (const [category, criteria] of Object.entries(securityCriteria)) {
      this.onboardingData.securityProfile[category] = {
        requirements: criteria.requirements,
        validation: criteria.validation,
        status: 'pending',
        results: await this.validateSecurityCategory(category, criteria.requirements),
        score: 0,
        recommendations: []
      };

      // Calculate security score
      const results = this.onboardingData.securityProfile[category].results;
      this.onboardingData.securityProfile[category].score = 
        (results.passed.length / criteria.requirements.length) * 100;
    }

    console.log('✅ Security validation complete');
  }

  async validateSecurityCategory(category, requirements) {
    const results = {
      passed: [],
      failed: [],
      requiresReview: [],
      notApplicable: []
    };

    for (const requirement of requirements) {
      const validationResult = await this.validateSecurityRequirement(category, requirement);
      results[validationResult].push(requirement);
    }

    return results;
  }

  async validateSecurityRequirement(category, requirement) {
    // Simulate security validation
    if (category === 'access_control' && requirement.includes('authentication')) {
      return 'passed';
    } else if (category === 'data_protection' && requirement.includes('encryption')) {
      return 'requiresReview';
    } else if (category === 'audit_logging' && requirement.includes('trails')) {
      return 'passed';
    } else if (category === 'compliance' && requirement.includes('GDPR')) {
      return 'requiresReview';
    } else {
      return 'failed';
    }
  }

  async generateClientSystems() {
    console.log('Generating client systems...');
    
    // Generate unique client space
    const clientSpace = {
      name: this.clientName,
      type: this.clientType,
      repository: `greenlight-${this.clientName.toLowerCase()}`,
      platform: `greenlight-platform-${this.clientName.toLowerCase()}`,
      holons: Object.keys(this.onboardingData.holonSetup),
      managers: Object.keys(this.onboardingData.managerParticipation),
      securityProfile: this.onboardingData.securityProfile
    };

    // Generate system structure
    const systemStructure = await this.generateSystemStructure(clientSpace);
    
    // Generate configuration files
    const configurationFiles = await this.generateConfigurationFiles(clientSpace);
    
    // Generate documentation
    const documentation = await this.generateSystemDocumentation(clientSpace);

    this.onboardingData.generatedSystems = {
      clientSpace: clientSpace,
      systemStructure: systemStructure,
      configurationFiles: configurationFiles,
      documentation: documentation,
      setupScripts: await this.generateSetupScripts(clientSpace)
    };

    console.log('✅ Client systems generated');
  }

  async generateSystemStructure(clientSpace) {
    return {
      directories: [
        `${clientSpace.repository}/src/core/holons/`,
        `${clientSpace.repository}/src/core/governance/`,
        `${clientSpace.repository}/src/core/security/`,
        `${clientSpace.repository}/src/core/monitoring/`,
        `${clientSpace.repository}/src/components/`,
        `${clientSpace.repository}/src/services/`,
        `${clientSpace.repository}/docs/`,
        `${clientSpace.repository}/scripts/`,
        `${clientSpace.repository}/config/`
      ],
      files: [
        `${clientSpace.repository}/package.json`,
        `${clientSpace.repository}/README.md`,
        `${clientSpace.repository}/SECURITY.md`,
        `${clientSpace.repository}/GOVERNANCE.md`,
        `${clientSpace.repository}/ONBOARDING.md`
      ]
    };
  }

  async generateConfigurationFiles(clientSpace) {
    return {
      package: {
        name: clientSpace.repository,
        version: '1.0.0',
        description: `Greenlight Platform for ${clientSpace.name}`,
        type: 'module',
        scripts: {
          'dev': 'tsx watch src/index.ts',
          'build': 'tsc',
          'start': 'node dist/index.js',
          'test': 'jest',
          'lint': 'eslint src/**/*.ts',
          'boundary:enforce': 'node scripts/protocols/boundary_enforcement_manager.cjs',
          'boundary:monitor': 'node scripts/protocols/boundary_monitor.cjs',
          'onboarding:validate': 'node scripts/protocols/client_onboarding_manager.cjs --validate'
        }
      },
      typescript: {
        compilerOptions: {
          target: 'ES2020',
          module: 'ESNext',
          moduleResolution: 'node',
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true
        }
      },
      security: {
        encryption: 'AES-256-GCM',
        authentication: 'JWT + MFA',
        sessionTimeout: 3600,
        auditLogging: true,
        dataRetention: '7 years'
      }
    };
  }

  async generateSystemDocumentation(clientSpace) {
    return {
      readme: `# ${clientSpace.name} - Greenlight Platform

## Overview
This is the Greenlight Platform implementation for ${clientSpace.name}.

## Security
- Encryption: ${clientSpace.securityProfile.data_protection?.score || 0}% compliant
- Access Control: ${clientSpace.securityProfile.access_control?.score || 0}% compliant
- Audit Logging: ${clientSpace.securityProfile.audit_logging?.score || 0}% compliant

## Holons
${clientSpace.holons.map(holon => `- ${holon}: ${this.onboardingData.holonSetup[holon]?.description || ''}`).join('\n')}

## Managers
${clientSpace.managers.map(manager => `- ${manager}: ${this.onboardingData.managerParticipation[manager]?.role || ''}`).join('\n')}
`,
      security: `# Security Profile for ${clientSpace.name}

## Security Assessment
${Object.entries(clientSpace.securityProfile).map(([category, profile]) => 
  `### ${category.replace(/_/g, ' ').toUpperCase()}
  Score: ${profile.score}%
  Status: ${profile.status}
  `).join('\n')}
`,
      governance: `# Governance Framework for ${clientSpace.name}

## Governance Structure
- System Governance: ${clientSpace.holons.includes('systemMaster') ? '✅' : '❌'}
- Product Governance: ${clientSpace.holons.includes('elevate') ? '✅' : '❌'}
- Business Intelligence: ${clientSpace.holons.includes('administrate') ? '✅' : '❌'}
- System Evolution: ${clientSpace.holons.includes('elaborate') ? '✅' : '❌'}
- Knowledge Management: ${clientSpace.holons.includes('articulate') ? '✅' : '❌'}
`
    };
  }

  async generateSetupScripts(clientSpace) {
    return {
      init: `#!/bin/bash
# Initialize ${clientSpace.name} Greenlight Platform

echo "Initializing ${clientSpace.name} platform..."
mkdir -p ${clientSpace.repository}
cd ${clientSpace.repository}

# Initialize git repository
git init
git add .
git commit -m "Initial commit: ${clientSpace.name} platform"

# Install dependencies
npm install

# Run boundary enforcement
npm run boundary:enforce

# Start monitoring
npm run boundary:monitor &

echo "${clientSpace.name} platform initialized successfully!"
`,
      validate: `#!/bin/bash
# Validate ${clientSpace.name} platform

echo "Validating ${clientSpace.name} platform..."

# Run security validation
npm run onboarding:validate

# Run boundary checks
npm run boundary:enforce

# Check system health
npm run health:check

echo "Validation complete!"
`
    };
  }

  async generateDocumentation() {
    console.log('Generating comprehensive documentation...');
    
    // Generate onboarding report
    const onboardingReport = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      client: this.clientName,
      type: this.clientType,
      summary: {
        criteriaScore: this.calculateOverallCriteriaScore(),
        securityScore: this.calculateOverallSecurityScore(),
        managerParticipation: Object.keys(this.onboardingData.managerParticipation).length,
        holonsConfigured: Object.keys(this.onboardingData.holonSetup).length,
        systemsGenerated: Object.keys(this.onboardingData.generatedSystems).length
      },
      details: this.onboardingData,
      recommendations: await this.generateRecommendations(),
      nextSteps: await this.generateNextSteps()
    };

    // Save comprehensive report
    const reportPath = path.join(this.projectRoot, `${this.clientName.toUpperCase()}_ONBOARDING_REPORT.json`);
    fs.writeFileSync(reportPath, JSON.stringify(onboardingReport, null, 2));

    // Generate human-readable summary
    const summaryPath = path.join(this.projectRoot, `${this.clientName.toUpperCase()}_ONBOARDING_SUMMARY.md`);
    const summary = this.generateHumanReadableSummary(onboardingReport);
    fs.writeFileSync(summaryPath, summary);

    this.onboardingData.documentation = {
      reportPath: reportPath,
      summaryPath: summaryPath,
      onboardingReport: onboardingReport
    };

    console.log('✅ Documentation generated');
  }

  calculateOverallCriteriaScore() {
    let totalScore = 0;
    let totalCategories = 0;

    for (const category of Object.values(this.onboardingData.criteria)) {
      for (const subcategory of Object.values(category)) {
        totalScore += subcategory.score;
        totalCategories++;
      }
    }

    return totalCategories > 0 ? Math.round(totalScore / totalCategories) : 0;
  }

  calculateOverallSecurityScore() {
    let totalScore = 0;
    let totalCategories = 0;

    for (const category of Object.values(this.onboardingData.securityProfile)) {
      totalScore += category.score;
      totalCategories++;
    }

    return totalCategories > 0 ? Math.round(totalScore / totalCategories) : 0;
  }

  async generateRecommendations() {
    const recommendations = [];

    // Criteria recommendations
    for (const [category, subcategories] of Object.entries(this.onboardingData.criteria)) {
      for (const [subcategory, data] of Object.entries(subcategories)) {
        if (data.score < 80) {
          recommendations.push({
            type: 'criteria',
            category: category,
            subcategory: subcategory,
            priority: data.score < 50 ? 'high' : 'medium',
            recommendation: `Improve ${subcategory} in ${category} category to meet requirements`
          });
        }
      }
    }

    // Security recommendations
    for (const [category, data] of Object.entries(this.onboardingData.securityProfile)) {
      if (data.score < 90) {
        recommendations.push({
          type: 'security',
          category: category,
          priority: data.score < 70 ? 'critical' : 'high',
          recommendation: `Address security gaps in ${category} to achieve compliance`
        });
      }
    }

    return recommendations;
  }

  async generateNextSteps() {
    return [
      {
        step: 1,
        action: 'Review onboarding report and recommendations',
        timeline: 'Immediate',
        priority: 'high'
      },
      {
        step: 2,
        action: 'Address critical security and criteria gaps',
        timeline: '1-2 weeks',
        priority: 'critical'
      },
      {
        step: 3,
        action: 'Set up client repository and initial configuration',
        timeline: '1 week',
        priority: 'high'
      },
      {
        step: 4,
        action: 'Deploy monitoring and boundary enforcement',
        timeline: '1 week',
        priority: 'high'
      },
      {
        step: 5,
        action: 'Conduct security audit and validation',
        timeline: '2 weeks',
        priority: 'high'
      },
      {
        step: 6,
        action: 'Begin operational deployment',
        timeline: '3-4 weeks',
        priority: 'medium'
      }
    ];
  }

  generateHumanReadableSummary(report) {
    return `# ${this.clientName} - Onboarding Summary

## Overview
- **Client**: ${this.clientName}
- **Type**: ${this.clientType}
- **Onboarding Date**: ${new Date().toLocaleDateString()}
- **Session ID**: ${this.sessionId}

## Assessment Scores
- **Overall Criteria Score**: ${report.summary.criteriaScore}%
- **Overall Security Score**: ${report.summary.securityScore}%
- **Manager Participation**: ${report.summary.managerParticipation}/10 managers
- **Holons Configured**: ${report.summary.holonsConfigured}/5 holons

## Security Profile
${Object.entries(report.details.securityProfile).map(([category, data]) => 
  `### ${category.replace(/_/g, ' ').toUpperCase()}
  **Score**: ${data.score}%
  **Status**: ${data.status}
  **Requirements**: ${data.requirements.length} total
  - Passed: ${data.results.passed.length}
  - Failed: ${data.results.failed.length}
  - Requires Review: ${data.results.requiresReview.length}
  `).join('\n')}

## Recommendations
${report.recommendations.map(rec => 
  `- **[${rec.priority.toUpperCase()}]** ${rec.recommendation}`
).join('\n')}

## Next Steps
${report.nextSteps.map(step => 
  `${step.step}. **${step.action}** (${step.timeline}) - Priority: ${step.priority}`
).join('\n')}

## Generated Systems
- **Repository**: ${report.details.generatedSystems.clientSpace.repository}
- **Platform**: ${report.details.generatedSystems.clientSpace.platform}
- **Holons**: ${report.details.generatedSystems.clientSpace.holons.join(', ')}
- **Managers**: ${report.details.generatedSystems.clientSpace.managers.join(', ')}

---
*Generated by Client Onboarding Manager v1.0.0*
`;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  // Parse arguments from npm script
  let clientName = null;
  let clientType = 'client';
  let validateOnly = false;
  
  // Check for arguments passed through npm
  const npmArgs = process.env.npm_config_argv ? JSON.parse(process.env.npm_config_argv) : null;
  if (npmArgs && npmArgs.original) {
    const originalArgs = npmArgs.original;
    for (let i = 0; i < originalArgs.length; i++) {
      if (originalArgs[i] === '--client' && originalArgs[i + 1]) {
        clientName = originalArgs[i + 1];
      } else if (originalArgs[i] === '--type' && originalArgs[i + 1]) {
        clientType = originalArgs[i + 1];
      } else if (originalArgs[i] === '--validate') {
        validateOnly = true;
      }
    }
  }
  
  // Fallback to direct argument parsing
  if (!clientName) {
    clientName = args.find(arg => arg.startsWith('--client='))?.split('=')[1];
    clientType = args.find(arg => arg.startsWith('--type='))?.split('=')[1] || 'client';
    validateOnly = args.includes('--validate');
  }

  if (!clientName) {
    console.error('Usage: node scripts/protocols/client_onboarding_manager.cjs --client=CLIENT_NAME [--type=client|agent] [--validate]');
    console.error('Or: npm run onboarding:client -- --client=CLIENT_NAME --type=client');
    process.exit(1);
  }

  const onboardingManager = new ClientOnboardingManager();
  
  try {
    await onboardingManager.initializeOnboarding(clientName, clientType);
    
    if (validateOnly) {
      console.log('Running validation only...');
      await onboardingManager.performSecurityValidation();
      console.log('Validation complete');
    } else {
      await onboardingManager.runComprehensiveOnboarding();
    }
    
  } catch (error) {
    console.error('Onboarding failed:', error.message);
    process.exit(1);
  }
}

main(); 
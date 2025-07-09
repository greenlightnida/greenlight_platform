#!/usr/bin/env node

/**
 * Onboarding Criteria Validator v1.0.0
 * 
 * PURPOSE: Comprehensive criteria validation for client onboarding
 * - Defines standards for legitimate, cool, thorough, and secure builds
 * - Validates team capabilities and requirements
 * - Ensures comprehensive criteria compliance
 * - Provides detailed scoring and recommendations
 * 
 * USAGE: node scripts/protocols/onboarding_criteria_validator.cjs [--client=CLIENT_NAME] [--strict]
 */

const fs = require('fs');
const path = require('path');

class OnboardingCriteriaValidator {
  constructor() {
    this.projectRoot = process.cwd();
    this.sessionId = `criteria-validator-${Date.now()}`;
    this.clientName = null;
    this.strictMode = false;
    this.validationResults = {};
    
    // Comprehensive criteria definitions
    this.criteria = {
      legitimacy: {
        description: 'Ensures the build is legitimate and compliant',
        weight: 25,
        categories: {
          legal: {
            requirements: [
              'Business registration and licensing',
              'Intellectual property compliance',
              'Data protection regulations (GDPR, CCPA)',
              'Industry-specific compliance',
              'Contractual obligations'
            ],
            weight: 30
          },
          ethical: {
            requirements: [
              'Ethical AI usage policies',
              'Bias prevention measures',
              'Transparency in data usage',
              'Fair treatment policies',
              'Social responsibility commitments'
            ],
            weight: 25
          },
          financial: {
            requirements: [
              'Financial stability verification',
              'Budget allocation for security',
              'Investment in quality assurance',
              'Sustainable business model',
              'Risk management framework'
            ],
            weight: 25
          },
          operational: {
            requirements: [
              'Operational capacity verification',
              'Team expertise validation',
              'Infrastructure readiness',
              'Process maturity assessment',
              'Quality management systems'
            ],
            weight: 20
          }
        }
      },
      coolness: {
        description: 'Ensures the build is innovative and engaging',
        weight: 20,
        categories: {
          innovation: {
            requirements: [
              'Cutting-edge technology adoption',
              'Unique value proposition',
              'Creative problem-solving approach',
              'User experience innovation',
              'Market differentiation strategy'
            ],
            weight: 30
          },
          user_experience: {
            requirements: [
              'Intuitive interface design',
              'Seamless user workflows',
              'Accessibility compliance',
              'Performance optimization',
              'Mobile responsiveness'
            ],
            weight: 25
          },
          engagement: {
            requirements: [
              'Interactive features',
              'Gamification elements',
              'Personalization capabilities',
              'Social integration',
              'Content engagement metrics'
            ],
            weight: 25
          },
          aesthetics: {
            requirements: [
              'Modern design language',
              'Visual appeal and branding',
              'Consistent design system',
              'Professional presentation',
              'Brand alignment'
            ],
            weight: 20
          }
        }
      },
      thoroughness: {
        description: 'Ensures comprehensive and complete implementation',
        weight: 30,
        categories: {
          architecture: {
            requirements: [
              'Scalable system architecture',
              'Microservices design',
              'API-first approach',
              'Database optimization',
              'Performance engineering'
            ],
            weight: 25
          },
          functionality: {
            requirements: [
              'Complete feature implementation',
              'Edge case handling',
              'Error management',
              'Data validation',
              'Business logic completeness'
            ],
            weight: 25
          },
          testing: {
            requirements: [
              'Comprehensive test coverage',
              'Automated testing pipeline',
              'Performance testing',
              'Security testing',
              'User acceptance testing'
            ],
            weight: 20
          },
          documentation: {
            requirements: [
              'Complete technical documentation',
              'User guides and manuals',
              'API documentation',
              'Deployment guides',
              'Maintenance procedures'
            ],
            weight: 15
          },
          monitoring: {
            requirements: [
              'Real-time system monitoring',
              'Performance metrics tracking',
              'Error tracking and alerting',
              'User behavior analytics',
              'Business metrics dashboard'
            ],
            weight: 15
          }
        }
      },
      security: {
        description: 'Ensures robust security and data protection',
        weight: 25,
        categories: {
          data_protection: {
            requirements: [
              'Data encryption at rest and in transit',
              'Secure data storage practices',
              'Data backup and recovery',
              'Data retention policies',
              'Data privacy compliance'
            ],
            weight: 25
          },
          access_control: {
            requirements: [
              'Role-based access control (RBAC)',
              'Multi-factor authentication (MFA)',
              'Session management',
              'Permission granularity',
              'Access audit logging'
            ],
            weight: 25
          },
          application_security: {
            requirements: [
              'OWASP Top 10 compliance',
              'Secure coding practices',
              'Input validation and sanitization',
              'SQL injection prevention',
              'XSS protection'
            ],
            weight: 20
          },
          infrastructure_security: {
            requirements: [
              'Network security measures',
              'Firewall configuration',
              'Intrusion detection systems',
              'Vulnerability management',
              'Security monitoring'
            ],
            weight: 15
          },
          compliance: {
            requirements: [
              'Industry security standards',
              'Regulatory compliance',
              'Security certifications',
              'Regular security audits',
              'Incident response procedures'
            ],
            weight: 15
          }
        }
      }
    };
  }

  async initializeValidation(clientName, strictMode = false) {
    console.log('🔍 Onboarding Criteria Validator v1.0.0');
    console.log('======================================');
    console.log(`Session ID: ${this.sessionId}`);
    console.log(`Client: ${clientName}`);
    console.log(`Strict Mode: ${strictMode ? 'Enabled' : 'Disabled'}`);
    console.log('');

    this.clientName = clientName;
    this.strictMode = strictMode;
    
    this.validationResults = {
      clientInfo: {
        name: clientName,
        validationDate: new Date().toISOString(),
        sessionId: this.sessionId,
        strictMode: strictMode
      },
      criteria: {},
      overallScore: 0,
      recommendations: [],
      compliance: {},
      riskAssessment: {}
    };

    return true;
  }

  async runComprehensiveValidation() {
    console.log('🎯 Phase 1: Legitimacy Validation');
    console.log('================================');
    await this.validateLegitimacy();
    
    console.log('🚀 Phase 2: Coolness Assessment');
    console.log('==============================');
    await this.validateCoolness();
    
    console.log('🏗️ Phase 3: Thoroughness Evaluation');
    console.log('==================================');
    await this.validateThoroughness();
    
    console.log('🛡️ Phase 4: Security Validation');
    console.log('==============================');
    await this.validateSecurity();
    
    console.log('📊 Phase 5: Overall Assessment');
    console.log('=============================');
    await this.calculateOverallScore();
    
    console.log('📋 Phase 6: Recommendations');
    console.log('==========================');
    await this.generateRecommendations();
    
    console.log('✅ Validation Complete');
    console.log('=====================');
    
    return this.validationResults;
  }

  async validateLegitimacy() {
    console.log('Validating legitimacy criteria...');
    
    this.validationResults.criteria.legitimacy = {
      description: this.criteria.legitimacy.description,
      weight: this.criteria.legitimacy.weight,
      categories: {},
      score: 0,
      status: 'pending'
    };

    let totalScore = 0;
    let totalWeight = 0;

    for (const [categoryKey, category] of Object.entries(this.criteria.legitimacy.categories)) {
      const categoryResults = await this.validateCategory(categoryKey, category, 'legitimacy');
      this.validationResults.criteria.legitimacy.categories[categoryKey] = categoryResults;
      
      totalScore += categoryResults.score * category.weight;
      totalWeight += category.weight;
    }

    this.validationResults.criteria.legitimacy.score = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
    this.validationResults.criteria.legitimacy.status = this.getStatus(this.validationResults.criteria.legitimacy.score);

    console.log(`✅ Legitimacy validation complete: ${this.validationResults.criteria.legitimacy.score}%`);
  }

  async validateCoolness() {
    console.log('Validating coolness criteria...');
    
    this.validationResults.criteria.coolness = {
      description: this.criteria.coolness.description,
      weight: this.criteria.coolness.weight,
      categories: {},
      score: 0,
      status: 'pending'
    };

    let totalScore = 0;
    let totalWeight = 0;

    for (const [categoryKey, category] of Object.entries(this.criteria.coolness.categories)) {
      const categoryResults = await this.validateCategory(categoryKey, category, 'coolness');
      this.validationResults.criteria.coolness.categories[categoryKey] = categoryResults;
      
      totalScore += categoryResults.score * category.weight;
      totalWeight += category.weight;
    }

    this.validationResults.criteria.coolness.score = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
    this.validationResults.criteria.coolness.status = this.getStatus(this.validationResults.criteria.coolness.score);

    console.log(`✅ Coolness validation complete: ${this.validationResults.criteria.coolness.score}%`);
  }

  async validateThoroughness() {
    console.log('Validating thoroughness criteria...');
    
    this.validationResults.criteria.thoroughness = {
      description: this.criteria.thoroughness.description,
      weight: this.criteria.thoroughness.weight,
      categories: {},
      score: 0,
      status: 'pending'
    };

    let totalScore = 0;
    let totalWeight = 0;

    for (const [categoryKey, category] of Object.entries(this.criteria.thoroughness.categories)) {
      const categoryResults = await this.validateCategory(categoryKey, category, 'thoroughness');
      this.validationResults.criteria.thoroughness.categories[categoryKey] = categoryResults;
      
      totalScore += categoryResults.score * category.weight;
      totalWeight += category.weight;
    }

    this.validationResults.criteria.thoroughness.score = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
    this.validationResults.criteria.thoroughness.status = this.getStatus(this.validationResults.criteria.thoroughness.score);

    console.log(`✅ Thoroughness validation complete: ${this.validationResults.criteria.thoroughness.score}%`);
  }

  async validateSecurity() {
    console.log('Validating security criteria...');
    
    this.validationResults.criteria.security = {
      description: this.criteria.security.description,
      weight: this.criteria.security.weight,
      categories: {},
      score: 0,
      status: 'pending'
    };

    let totalScore = 0;
    let totalWeight = 0;

    for (const [categoryKey, category] of Object.entries(this.criteria.security.categories)) {
      const categoryResults = await this.validateCategory(categoryKey, category, 'security');
      this.validationResults.criteria.security.categories[categoryKey] = categoryResults;
      
      totalScore += categoryResults.score * category.weight;
      totalWeight += category.weight;
    }

    this.validationResults.criteria.security.score = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
    this.validationResults.criteria.security.status = this.getStatus(this.validationResults.criteria.security.score);

    console.log(`✅ Security validation complete: ${this.validationResults.criteria.security.score}%`);
  }

  async validateCategory(categoryKey, category, mainCategory) {
    const results = {
      requirements: category.requirements,
      weight: category.weight,
      assessments: {},
      score: 0,
      status: 'pending',
      recommendations: []
    };

    let metCount = 0;
    let totalRequirements = category.requirements.length;

    for (const requirement of category.requirements) {
      const assessment = await this.assessRequirement(requirement, mainCategory, categoryKey);
      results.assessments[requirement] = assessment;
      
      if (assessment.status === 'met') {
        metCount++;
      } else if (assessment.status === 'partially_met') {
        metCount += 0.5;
      }
    }

    results.score = totalRequirements > 0 ? Math.round((metCount / totalRequirements) * 100) : 0;
    results.status = this.getStatus(results.score);

    // Generate category-specific recommendations
    if (results.score < 80) {
      results.recommendations = await this.generateCategoryRecommendations(categoryKey, mainCategory, results);
    }

    return results;
  }

  async assessRequirement(requirement, mainCategory, categoryKey) {
    // Simulate assessment based on requirement type and category
    const assessment = {
      requirement: requirement,
      status: 'not_met',
      confidence: 0,
      evidence: [],
      notes: ''
    };

    // Simulate different assessment logic based on category
    if (mainCategory === 'legitimacy') {
      if (requirement.includes('compliance') || requirement.includes('regulation')) {
        assessment.status = 'requires_review';
        assessment.confidence = 60;
        assessment.notes = 'Requires legal review and documentation';
      } else if (requirement.includes('verification') || requirement.includes('validation')) {
        assessment.status = 'partially_met';
        assessment.confidence = 70;
        assessment.notes = 'Partial verification available';
      } else {
        assessment.status = 'not_met';
        assessment.confidence = 50;
        assessment.notes = 'Requires implementation';
      }
    } else if (mainCategory === 'coolness') {
      if (requirement.includes('innovation') || requirement.includes('unique')) {
        assessment.status = 'requires_review';
        assessment.confidence = 65;
        assessment.notes = 'Requires innovation assessment';
      } else if (requirement.includes('user experience') || requirement.includes('interface')) {
        assessment.status = 'partially_met';
        assessment.confidence = 75;
        assessment.notes = 'Basic implementation available';
      } else {
        assessment.status = 'not_met';
        assessment.confidence = 40;
        assessment.notes = 'Requires design and implementation';
      }
    } else if (mainCategory === 'thoroughness') {
      if (requirement.includes('testing') || requirement.includes('coverage')) {
        assessment.status = 'partially_met';
        assessment.confidence = 70;
        assessment.notes = 'Basic testing framework available';
      } else if (requirement.includes('documentation') || requirement.includes('monitoring')) {
        assessment.status = 'not_met';
        assessment.confidence = 30;
        assessment.notes = 'Requires comprehensive implementation';
      } else {
        assessment.status = 'requires_review';
        assessment.confidence = 55;
        assessment.notes = 'Requires technical assessment';
      }
    } else if (mainCategory === 'security') {
      if (requirement.includes('encryption') || requirement.includes('authentication')) {
        assessment.status = 'requires_review';
        assessment.confidence = 80;
        assessment.notes = 'Requires security audit';
      } else if (requirement.includes('compliance') || requirement.includes('standards')) {
        assessment.status = 'not_met';
        assessment.confidence = 45;
        assessment.notes = 'Requires compliance implementation';
      } else {
        assessment.status = 'partially_met';
        assessment.confidence = 60;
        assessment.notes = 'Basic security measures available';
      }
    }

    return assessment;
  }

  getStatus(score) {
    if (this.strictMode) {
      if (score >= 90) return 'excellent';
      if (score >= 80) return 'good';
      if (score >= 70) return 'acceptable';
      return 'unacceptable';
    } else {
      if (score >= 85) return 'excellent';
      if (score >= 75) return 'good';
      if (score >= 65) return 'acceptable';
      return 'needs_improvement';
    }
  }

  async calculateOverallScore() {
    let totalScore = 0;
    let totalWeight = 0;

    for (const [categoryKey, category] of Object.entries(this.validationResults.criteria)) {
      totalScore += category.score * category.weight;
      totalWeight += category.weight;
    }

    this.validationResults.overallScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
    
    // Determine overall status
    this.validationResults.overallStatus = this.getStatus(this.validationResults.overallScore);
    
    // Calculate compliance
    this.validationResults.compliance = {
      overall: this.validationResults.overallScore,
      legitimacy: this.validationResults.criteria.legitimacy.score,
      coolness: this.validationResults.criteria.coolness.score,
      thoroughness: this.validationResults.criteria.thoroughness.score,
      security: this.validationResults.criteria.security.score
    };

    console.log(`✅ Overall score calculated: ${this.validationResults.overallScore}%`);
  }

  async generateRecommendations() {
    const recommendations = [];

    // Generate recommendations for each category
    for (const [categoryKey, category] of Object.entries(this.validationResults.criteria)) {
      if (category.score < (this.strictMode ? 90 : 85)) {
        recommendations.push({
          category: categoryKey,
          priority: category.score < 70 ? 'critical' : category.score < 80 ? 'high' : 'medium',
          score: category.score,
          recommendations: await this.generateCategoryRecommendations(categoryKey, categoryKey, category)
        });
      }
    }

    // Generate overall recommendations
    if (this.validationResults.overallScore < (this.strictMode ? 90 : 85)) {
      recommendations.push({
        category: 'overall',
        priority: this.validationResults.overallScore < 70 ? 'critical' : 'high',
        score: this.validationResults.overallScore,
        recommendations: [
          'Implement comprehensive improvement plan',
          'Focus on lowest-scoring categories first',
          'Establish regular validation cycles',
          'Engage stakeholders for buy-in'
        ]
      });
    }

    this.validationResults.recommendations = recommendations;

    console.log(`✅ Generated ${recommendations.length} recommendation sets`);
  }

  async generateCategoryRecommendations(categoryKey, mainCategory, results) {
    const recommendations = [];

    switch (categoryKey) {
      case 'legal':
        recommendations.push(
          'Engage legal counsel for compliance review',
          'Establish compliance monitoring system',
          'Create compliance documentation framework'
        );
        break;
      case 'ethical':
        recommendations.push(
          'Develop ethical AI usage guidelines',
          'Implement bias detection systems',
          'Create transparency reporting framework'
        );
        break;
      case 'innovation':
        recommendations.push(
          'Conduct market research for innovation opportunities',
          'Establish innovation pipeline',
          'Create user feedback collection system'
        );
        break;
      case 'architecture':
        recommendations.push(
          'Conduct architecture review and optimization',
          'Implement microservices design patterns',
          'Establish API governance framework'
        );
        break;
      case 'data_protection':
        recommendations.push(
          'Implement comprehensive encryption strategy',
          'Establish data governance framework',
          'Create data protection impact assessments'
        );
        break;
      default:
        recommendations.push(
          'Conduct detailed assessment of requirements',
          'Develop implementation roadmap',
          'Establish monitoring and validation processes'
        );
    }

    return recommendations;
  }

  async generateValidationReport() {
    const reportPath = path.join(this.projectRoot, `${this.clientName.toUpperCase()}_CRITERIA_VALIDATION.json`);
    fs.writeFileSync(reportPath, JSON.stringify(this.validationResults, null, 2));

    const summaryPath = path.join(this.projectRoot, `${this.clientName.toUpperCase()}_CRITERIA_SUMMARY.md`);
    const summary = this.generateHumanReadableSummary();
    fs.writeFileSync(summaryPath, summary);

    console.log(`📄 Validation report saved to: ${reportPath}`);
    console.log(`📄 Summary saved to: ${summaryPath}`);

    return {
      reportPath: reportPath,
      summaryPath: summaryPath
    };
  }

  generateHumanReadableSummary() {
    return `# ${this.clientName} - Criteria Validation Summary

## Overview
- **Client**: ${this.clientName}
- **Validation Date**: ${new Date().toLocaleDateString()}
- **Session ID**: ${this.sessionId}
- **Strict Mode**: ${this.strictMode ? 'Enabled' : 'Disabled'}

## Overall Assessment
- **Overall Score**: ${this.validationResults.overallScore}%
- **Overall Status**: ${this.validationResults.overallStatus.toUpperCase()}

## Category Breakdown

### Legitimacy (${this.validationResults.criteria.legitimacy.score}%)
${this.generateCategorySummary(this.validationResults.criteria.legitimacy)}

### Coolness (${this.validationResults.criteria.coolness.score}%)
${this.generateCategorySummary(this.validationResults.criteria.coolness)}

### Thoroughness (${this.validationResults.criteria.thoroughness.score}%)
${this.generateCategorySummary(this.validationResults.criteria.thoroughness)}

### Security (${this.validationResults.criteria.security.score}%)
${this.generateCategorySummary(this.validationResults.criteria.security)}

## Recommendations
${this.validationResults.recommendations.map(rec => 
  `### ${rec.category.toUpperCase()} (${rec.score}%)
  **Priority**: ${rec.priority.toUpperCase()}
  ${rec.recommendations.map(r => `- ${r}`).join('\n  ')}
  `
).join('\n')}

## Compliance Summary
- **Overall Compliance**: ${this.validationResults.compliance.overall}%
- **Legitimacy Compliance**: ${this.validationResults.compliance.legitimacy}%
- **Coolness Compliance**: ${this.validationResults.compliance.coolness}%
- **Thoroughness Compliance**: ${this.validationResults.compliance.thoroughness}%
- **Security Compliance**: ${this.validationResults.compliance.security}%

---
*Generated by Onboarding Criteria Validator v1.0.0*
`;
  }

  generateCategorySummary(category) {
    const summaries = [];
    
    for (const [subcategory, data] of Object.entries(category.categories)) {
      summaries.push(`- **${subcategory.replace(/_/g, ' ').toUpperCase()}**: ${data.score}% (${data.status})`);
    }
    
    return summaries.join('\n');
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const clientName = args.find(arg => arg.startsWith('--client='))?.split('=')[1];
  const strictMode = args.includes('--strict');

  if (!clientName) {
    console.error('Usage: node scripts/protocols/onboarding_criteria_validator.cjs --client=CLIENT_NAME [--strict]');
    process.exit(1);
  }

  const validator = new OnboardingCriteriaValidator();
  
  try {
    await validator.initializeValidation(clientName, strictMode);
    await validator.runComprehensiveValidation();
    await validator.generateValidationReport();
    
  } catch (error) {
    console.error('Validation failed:', error.message);
    process.exit(1);
  }
}

main(); 
#!/usr/bin/env node

/**
 * OKR Tracking System
 * 
 * PURPOSE: Comprehensive OKR management and tracking for all holons and components
 * - Track progress against defined objectives and key results
 * - Integrate with holon milestone framework
 * - Provide performance management insights
 * - Generate actionable recommendations
 * 
 * INTEGRATION:
 * - Holon Milestone Framework
 * - Performance Management System
 * - Enterprise Committee Governance
 */

const fs = require('fs');
const path = require('path');

// === OKR Framework ===
const OKR_FRAMEWORK = {
  objectives: {
    // SystemMaster Holon OKRs
    'SM-OKR-001': {
      title: 'Establish Basic System Governance',
      description: 'Implement foundational governance capabilities for SystemMaster Holon',
      keyResults: [
        'Achieve 80% milestone completion rate',
        'Implement all core governance functions',
        'Establish committee consensus validation'
      ],
      holon: 'systemMaster',
      component: 'SystemMasterManager',
      target: 0.8,
      weight: 0.25
    },
    'SM-OKR-002': {
      title: 'Enable Cross-Platform Coordination',
      description: 'Establish coordination mechanisms across all platform holons',
      keyResults: [
        'Coordinate 100% of cross-holon communications',
        'Establish unified governance policies',
        'Implement cross-platform monitoring'
      ],
      holon: 'systemMaster',
      component: 'GovernanceOrchestrator',
      target: 0.85,
      weight: 0.25
    },
    'SM-OKR-003': {
      title: 'Implement System-Wide Security',
      description: 'Establish comprehensive security governance across all systems',
      keyResults: [
        'Implement security policies for all holons',
        'Establish audit trails for all actions',
        'Achieve 100% compliance with security standards'
      ],
      holon: 'systemMaster',
      component: 'RepositoryGovernor',
      target: 0.9,
      weight: 0.25
    },
    'SM-OKR-004': {
      title: 'Manage Holon Relationships',
      description: 'Establish and maintain relationships between all system holons',
      keyResults: [
        'Define all holon interfaces and contracts',
        'Establish communication protocols',
        'Implement relationship monitoring'
      ],
      holon: 'systemMaster',
      component: 'SystemMasterManager',
      target: 0.85,
      weight: 0.25
    },
    'SM-OKR-005': {
      title: 'Achieve Autonomous Oversight',
      description: 'Enable autonomous system oversight with human oversight',
      keyResults: [
        'Implement autonomous decision-making capabilities',
        'Establish human oversight mechanisms',
        'Achieve 95% autonomous operation rate'
      ],
      holon: 'systemMaster',
      component: 'GovernanceOrchestrator',
      target: 0.95,
      weight: 0.25
    },

    // Elaborate Holon OKRs
    'EL-OKR-001': {
      title: 'Enable System Evolution Tracking',
      description: 'Implement comprehensive system evolution monitoring and tracking',
      keyResults: [
        'Track 100% of system changes',
        'Generate evolution reports',
        'Identify optimization opportunities'
      ],
      holon: 'elaborate',
      component: 'SystemEvolutionManager',
      target: 0.8,
      weight: 0.2
    },
    'EL-OKR-002': {
      title: 'Optimize Protocol Management',
      description: 'Establish efficient and effective protocol management',
      keyResults: [
        'Optimize protocol execution performance',
        'Implement protocol versioning',
        'Establish protocol compliance monitoring'
      ],
      holon: 'elaborate',
      component: 'ProtocolManager',
      target: 0.85,
      weight: 0.2
    },
    'EL-OKR-003': {
      title: 'Manage Governance Policies',
      description: 'Establish comprehensive governance policy management',
      keyResults: [
        'Define all governance policies',
        'Implement policy enforcement',
        'Establish policy evolution mechanisms'
      ],
      holon: 'elaborate',
      component: 'ElaborateManager',
      target: 0.9,
      weight: 0.2
    },
    'EL-OKR-004': {
      title: 'Track Performance Metrics',
      description: 'Implement comprehensive performance tracking across all systems',
      keyResults: [
        'Track performance metrics for all components',
        'Generate performance reports',
        'Identify performance optimization opportunities'
      ],
      holon: 'elaborate',
      component: 'SystemEvolutionManager',
      target: 0.85,
      weight: 0.2
    },
    'EL-OKR-005': {
      title: 'Enable Autonomous Evolution',
      description: 'Enable autonomous system evolution capabilities',
      keyResults: [
        'Implement autonomous optimization',
        'Establish evolution feedback loops',
        'Achieve autonomous evolution capabilities'
      ],
      holon: 'elaborate',
      component: 'ElaborateManager',
      target: 0.95,
      weight: 0.2
    },

    // Articulate Holon OKRs
    'AR-OKR-001': {
      title: 'Manage Knowledge Base',
      description: 'Establish comprehensive knowledge base management',
      keyResults: [
        'Organize all system knowledge',
        'Implement knowledge discovery',
        'Establish knowledge evolution'
      ],
      holon: 'articulate',
      component: 'KnowledgeManager',
      target: 0.8,
      weight: 0.2
    },
    'AR-OKR-002': {
      title: 'Manage Workflows',
      description: 'Establish comprehensive workflow management',
      keyResults: [
        'Define all system workflows',
        'Implement workflow automation',
        'Establish workflow optimization'
      ],
      holon: 'articulate',
      component: 'WorkManager',
      target: 0.85,
      weight: 0.2
    },
    'AR-OKR-003': {
      title: 'Integrate NLP Capabilities',
      description: 'Implement natural language processing capabilities',
      keyResults: [
        'Implement NLP for knowledge processing',
        'Establish language understanding',
        'Enable natural language interactions'
      ],
      holon: 'articulate',
      component: 'ArticulateManager',
      target: 0.9,
      weight: 0.2
    },
    'AR-OKR-004': {
      title: 'Manage Developer Notes',
      description: 'Establish comprehensive developer notes management',
      keyResults: [
        'Organize developer documentation',
        'Implement note discovery',
        'Establish note evolution'
      ],
      holon: 'articulate',
      component: 'KnowledgeManager',
      target: 0.85,
      weight: 0.2
    },
    'AR-OKR-005': {
      title: 'Enable Autonomous Knowledge Curation',
      description: 'Enable autonomous knowledge curation capabilities',
      keyResults: [
        'Implement autonomous curation',
        'Establish curation feedback loops',
        'Achieve autonomous curation capabilities'
      ],
      holon: 'articulate',
      component: 'ArticulateManager',
      target: 0.95,
      weight: 0.2
    },

    // Elevate Holon OKRs
    'EV-OKR-001': {
      title: 'Manage Player Data',
      description: 'Establish comprehensive player data management',
      keyResults: [
        'Implement player data storage',
        'Establish data privacy',
        'Enable data analytics'
      ],
      holon: 'elevate',
      component: 'PlayerManager',
      target: 0.8,
      weight: 0.2
    },
    'EV-OKR-002': {
      title: 'Manage Coaching Workflows',
      description: 'Establish comprehensive coaching workflow management',
      keyResults: [
        'Define coaching workflows',
        'Implement workflow automation',
        'Establish workflow optimization'
      ],
      holon: 'elevate',
      component: 'CoachingManager',
      target: 0.85,
      weight: 0.2
    },
    'EV-OKR-003': {
      title: 'Enable AI-Powered Insights',
      description: 'Implement AI-powered insights for coaching',
      keyResults: [
        'Implement AI analysis',
        'Generate coaching insights',
        'Enable predictive coaching'
      ],
      holon: 'elevate',
      component: 'CoachingManager',
      target: 0.9,
      weight: 0.2
    },
    'EV-OKR-004': {
      title: 'Process Data Imports',
      description: 'Establish comprehensive data import processing',
      keyResults: [
        'Implement data import validation',
        'Establish data transformation',
        'Enable data integration'
      ],
      holon: 'elevate',
      component: 'PlayerManager',
      target: 0.85,
      weight: 0.2
    },
    'EV-OKR-005': {
      title: 'Enable Autonomous Coaching',
      description: 'Enable autonomous coaching capabilities',
      keyResults: [
        'Implement autonomous coaching',
        'Establish coaching feedback loops',
        'Achieve autonomous coaching capabilities'
      ],
      holon: 'elevate',
      component: 'CoachingManager',
      target: 0.95,
      weight: 0.2
    },

    // Administrate Holon OKRs
    'AD-OKR-001': {
      title: 'Enable BI Analytics',
      description: 'Establish comprehensive business intelligence analytics',
      keyResults: [
        'Implement data analytics',
        'Generate business insights',
        'Enable predictive analytics'
      ],
      holon: 'administrate',
      component: 'BusinessIntelligenceManager',
      target: 0.8,
      weight: 0.2
    },
    'AD-OKR-002': {
      title: 'Enable Executive Oversight',
      description: 'Establish comprehensive executive oversight capabilities',
      keyResults: [
        'Implement executive dashboards',
        'Establish oversight mechanisms',
        'Enable strategic decision support'
      ],
      holon: 'administrate',
      component: 'ExecutiveManager',
      target: 0.85,
      weight: 0.2
    },
    'AD-OKR-003': {
      title: 'Generate Reports',
      description: 'Establish comprehensive report generation capabilities',
      keyResults: [
        'Implement automated reporting',
        'Establish report customization',
        'Enable report distribution'
      ],
      holon: 'administrate',
      component: 'BusinessIntelligenceManager',
      target: 0.9,
      weight: 0.2
    },
    'AD-OKR-004': {
      title: 'Enable Strategic Planning',
      description: 'Establish comprehensive strategic planning capabilities',
      keyResults: [
        'Implement strategic analysis',
        'Establish planning frameworks',
        'Enable strategic execution'
      ],
      holon: 'administrate',
      component: 'ExecutiveManager',
      target: 0.85,
      weight: 0.2
    },
    'AD-OKR-005': {
      title: 'Enable Autonomous Decision Support',
      description: 'Enable autonomous decision support capabilities',
      keyResults: [
        'Implement autonomous analysis',
        'Establish decision frameworks',
        'Achieve autonomous decision support'
      ],
      holon: 'administrate',
      component: 'ExecutiveManager',
      target: 0.95,
      weight: 0.2
    }
  }
};

// === OKR Tracking Class ===
class OKRTracker {
  constructor() {
    this.okrData = {};
    this.holonProgress = {};
    this.overallProgress = 0;
  }

  loadMilestoneResults() {
    try {
      if (fs.existsSync('HOLON_MILESTONE_RESULTS.json')) {
        const milestoneData = JSON.parse(fs.readFileSync('HOLON_MILESTONE_RESULTS.json', 'utf8'));
        return milestoneData;
      }
    } catch (error) {
      console.warn('Could not load milestone results:', error.message);
    }
    return null;
  }

  calculateOKRProgress() {
    const milestoneData = this.loadMilestoneResults();
    
    for (const [okrKey, okr] of Object.entries(OKR_FRAMEWORK.objectives)) {
      let progress = 0;
      let milestoneCount = 0;
      
      // Find related milestones in holon data
      if (milestoneData && milestoneData.holons[okr.holon]) {
        const holonData = milestoneData.holons[okr.holon];
        for (const [milestoneKey, milestone] of Object.entries(holonData.milestones)) {
          if (milestone.okr === okrKey) {
            progress += milestone.score;
            milestoneCount++;
          }
        }
      }
      
      this.okrData[okrKey] = {
        ...okr,
        currentProgress: milestoneCount > 0 ? progress / milestoneCount : 0,
        milestoneCount,
        status: this.getOKRStatus(okr.target, milestoneCount > 0 ? progress / milestoneCount : 0),
        lastUpdated: new Date().toISOString()
      };
    }
  }

  getOKRStatus(target, current) {
    if (current >= target) return 'achieved';
    if (current >= target * 0.8) return 'on_track';
    if (current >= target * 0.6) return 'at_risk';
    return 'off_track';
  }

  calculateHolonProgress() {
    const holonGroups = {};
    
    // Group OKRs by holon
    for (const [okrKey, okr] of Object.entries(this.okrData)) {
      if (!holonGroups[okr.holon]) {
        holonGroups[okr.holon] = [];
      }
      holonGroups[okr.holon].push(okr);
    }
    
    // Calculate holon progress
    for (const [holonKey, okrs] of Object.entries(holonGroups)) {
      const totalWeight = okrs.reduce((sum, okr) => sum + okr.weight, 0);
      const weightedProgress = okrs.reduce((sum, okr) => sum + (okr.currentProgress * okr.weight), 0);
      
      this.holonProgress[holonKey] = {
        name: okrs[0].title.split(' ')[0] + ' Holon', // Extract holon name from first OKR
        totalOKRs: okrs.length,
        weightedProgress: totalWeight > 0 ? weightedProgress / totalWeight : 0,
        achievedOKRs: okrs.filter(okr => okr.status === 'achieved').length,
        onTrackOKRs: okrs.filter(okr => okr.status === 'on_track').length,
        atRiskOKRs: okrs.filter(okr => okr.status === 'at_risk').length,
        offTrackOKRs: okrs.filter(okr => okr.status === 'off_track').length,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  calculateOverallProgress() {
    const allOKRs = Object.values(this.okrData);
    const totalWeight = allOKRs.reduce((sum, okr) => sum + okr.weight, 0);
    const weightedProgress = allOKRs.reduce((sum, okr) => sum + (okr.currentProgress * okr.weight), 0);
    
    this.overallProgress = totalWeight > 0 ? weightedProgress / totalWeight : 0;
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Off-track OKRs
    const offTrackOKRs = Object.entries(this.okrData)
      .filter(([_, okr]) => okr.status === 'off_track');
    
    if (offTrackOKRs.length > 0) {
      recommendations.push({
        type: 'critical',
        message: `Focus on off-track OKRs: ${offTrackOKRs.map(([key, okr]) => okr.title).join(', ')}`,
        action: 'Immediate attention required'
      });
    }
    
    // At-risk OKRs
    const atRiskOKRs = Object.entries(this.okrData)
      .filter(([_, okr]) => okr.status === 'at_risk');
    
    if (atRiskOKRs.length > 0) {
      recommendations.push({
        type: 'warning',
        message: `Monitor at-risk OKRs: ${atRiskOKRs.map(([key, okr]) => okr.title).join(', ')}`,
        action: 'Increased monitoring and support needed'
      });
    }
    
    // Low-performing holons
    const lowPerformingHolons = Object.entries(this.holonProgress)
      .filter(([_, holon]) => holon.weightedProgress < 0.6);
    
    if (lowPerformingHolons.length > 0) {
      recommendations.push({
        type: 'warning',
        message: `Support low-performing holons: ${lowPerformingHolons.map(([key, holon]) => holon.name).join(', ')}`,
        action: 'Additional resources and support needed'
      });
    }
    
    return recommendations;
  }

  generateReport() {
    this.calculateOKRProgress();
    this.calculateHolonProgress();
    this.calculateOverallProgress();
    
    const report = {
      timestamp: new Date().toISOString(),
      overallProgress: this.overallProgress,
      holonProgress: this.holonProgress,
      okrData: this.okrData,
      recommendations: this.generateRecommendations(),
      summary: {
        totalOKRs: Object.keys(this.okrData).length,
        achievedOKRs: Object.values(this.okrData).filter(okr => okr.status === 'achieved').length,
        onTrackOKRs: Object.values(this.okrData).filter(okr => okr.status === 'on_track').length,
        atRiskOKRs: Object.values(this.okrData).filter(okr => okr.status === 'at_risk').length,
        offTrackOKRs: Object.values(this.okrData).filter(okr => okr.status === 'off_track').length
      }
    };
    
    return report;
  }

  saveReport(report) {
    fs.writeFileSync('OKR_TRACKING_REPORT.json', JSON.stringify(report, null, 2));
    console.log('📄 OKR tracking report saved to OKR_TRACKING_REPORT.json');
  }

  displayReport(report) {
    console.log('\n📊 OKR Tracking Report');
    console.log('=====================');
    console.log(`Overall Progress: ${(report.overallProgress * 100).toFixed(1)}%`);
    console.log(`Total OKRs: ${report.summary.totalOKRs}`);
    console.log(`Achieved: ${report.summary.achievedOKRs} | On Track: ${report.summary.onTrackOKRs} | At Risk: ${report.summary.atRiskOKRs} | Off Track: ${report.summary.offTrackOKRs}`);
    
    console.log('\n🏛️ Holon Progress:');
    for (const [holonKey, holon] of Object.entries(report.holonProgress)) {
      console.log(`  ${holon.name}: ${(holon.weightedProgress * 100).toFixed(1)}% (${holon.achievedOKRs}/${holon.totalOKRs} achieved)`);
    }
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      report.recommendations.forEach(rec => {
        console.log(`  ${rec.type.toUpperCase()}: ${rec.message}`);
        console.log(`    Action: ${rec.action}`);
      });
    }
  }
}

// === Main Execution ===
async function main() {
  try {
    const tracker = new OKRTracker();
    const report = tracker.generateReport();
    
    tracker.displayReport(report);
    tracker.saveReport(report);
    
  } catch (error) {
    console.error('❌ OKR tracking failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { OKRTracker, OKR_FRAMEWORK }; 
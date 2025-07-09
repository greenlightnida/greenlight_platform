#!/usr/bin/env node

/**
 * Milestone Tracker
 * 
 * PURPOSE: Tracks and documents milestone achievements with comprehensive
 * metadata, impact analysis, and timeline management.
 * 
 * USAGE: node scripts/milestone_tracker.cjs [--action=record|analyze|report]
 * 
 * FEATURES:
 * - Milestone recording with detailed metadata
 * - Impact analysis and metrics tracking
 * - Timeline variance analysis
 * - Achievement documentation
 * - Integration with roadmap actuals
 */

const fs = require('fs');
const path = require('path');

class MilestoneTracker {
  constructor() {
    this.projectRoot = process.cwd();
    this.timelinePath = path.join(this.projectRoot, 'data', 'roadmap-actuals', 'milestone-timeline.json');
    this.trackerPath = path.join(this.projectRoot, 'data', 'roadmap-actuals', 'tracker-data.json');
    this.timeline = this.loadTimeline();
    this.tracker = this.loadTracker();
  }

  loadTimeline() {
    try {
      if (fs.existsSync(this.timelinePath)) {
        return JSON.parse(fs.readFileSync(this.timelinePath, 'utf8'));
      }
      return this.createDefaultTimeline();
    } catch (error) {
      console.error('Failed to load milestone timeline:', error);
      return this.createDefaultTimeline();
    }
  }

  loadTracker() {
    try {
      if (fs.existsSync(this.trackerPath)) {
        return JSON.parse(fs.readFileSync(this.trackerPath, 'utf8'));
      }
      return { actualMilestones: [] };
    } catch (error) {
      console.error('Failed to load tracker data:', error);
      return { actualMilestones: [] };
    }
  }

  createDefaultTimeline() {
    return {
      projectId: "greenlight-platform",
      projectName: "Greenlight Platform",
      timelineVersion: "1.0.0",
      lastUpdated: new Date().toISOString(),
      milestoneCategories: [
        "infrastructure", "governance", "development", "deployment",
        "security", "performance", "testing", "documentation",
        "integration", "optimization"
      ],
      milestonePriorities: ["critical", "high", "medium", "low"],
      milestoneStatuses: ["planned", "in_progress", "completed", "blocked", "cancelled", "deferred"],
      milestones: [],
      timelineAnalysis: {
        totalMilestones: 0,
        completedMilestones: 0,
        inProgressMilestones: 0,
        plannedMilestones: 0,
        completionRate: 0,
        averageDurationVariance: 0,
        averageEffortVariance: 0,
        criticalMilestonesCompleted: 0,
        governanceMilestonesCompleted: 0,
        deploymentMilestonesCompleted: 0
      },
      achievementSummary: {
        totalAchievements: 0,
        majorDeliverables: 0,
        systemsImproved: 0,
        processesEstablished: 0,
        automationLevel: "none",
        governanceMaturity: "none"
      },
      impactAssessment: {
        systemHealth: "unknown",
        buildStability: "unknown",
        developmentVelocity: "unknown",
        operationalEfficiency: "unknown",
        governanceCompliance: "unknown",
        monitoringCoverage: "none"
      },
      nextPhasePriorities: []
    };
  }

  async recordMilestone(milestoneData) {
    try {
      console.log('📝 Recording milestone:', milestoneData.title);
      
      // Generate milestone ID
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const milestoneId = `milestone-${timestamp}`;
      
      // Create milestone object
      const milestone = {
        id: milestoneId,
        title: milestoneData.title,
        description: milestoneData.description,
        category: milestoneData.category || 'development',
        priority: milestoneData.priority || 'medium',
        status: milestoneData.status || 'completed',
        plannedStartDate: milestoneData.plannedStartDate || new Date().toISOString(),
        plannedEndDate: milestoneData.plannedEndDate || new Date().toISOString(),
        actualStartDate: milestoneData.actualStartDate || new Date().toISOString(),
        actualEndDate: milestoneData.actualEndDate || new Date().toISOString(),
        duration: {
          planned: milestoneData.plannedDuration || 1,
          actual: milestoneData.actualDuration || 1,
          unit: 'hours',
          variance: this.calculateVariance(milestoneData.plannedDuration, milestoneData.actualDuration)
        },
        effort: {
          planned: milestoneData.plannedEffort || 1,
          actual: milestoneData.actualEffort || 1,
          unit: 'hours',
          variance: this.calculateVariance(milestoneData.plannedEffort, milestoneData.actualEffort)
        },
        teamSize: milestoneData.teamSize || 1,
        dependencies: milestoneData.dependencies || [],
        achievements: milestoneData.achievements || [],
        deliverables: milestoneData.deliverables || [],
        metrics: milestoneData.metrics || {},
        impact: milestoneData.impact || {},
        successCriteria: milestoneData.successCriteria || [],
        successCriteriaStatus: milestoneData.successCriteriaStatus || [],
        lessonsLearned: milestoneData.lessonsLearned || [],
        recommendations: milestoneData.recommendations || [],
        risks: milestoneData.risks || [],
        tags: milestoneData.tags || [],
        relatedMilestones: milestoneData.relatedMilestones || [],
        nextMilestones: milestoneData.nextMilestones || []
      };

      // Add to timeline
      this.timeline.milestones.push(milestone);
      
      // Update timeline analysis
      this.updateTimelineAnalysis();
      
      // Save timeline
      await this.saveTimeline();
      
      // Add to tracker data
      const trackerMilestone = {
        id: `actual-${this.tracker.actualMilestones.length + 1}`,
        plannedMilestoneId: milestoneData.plannedMilestoneId || null,
        title: milestone.title,
        description: milestone.description,
        category: milestone.category,
        priority: milestone.priority,
        actualStartDate: milestone.actualStartDate,
        actualEndDate: milestone.actualEndDate,
        actualDuration: milestone.duration.actual,
        actualEffort: milestone.effort.actual,
        actualTeamSize: milestone.teamSize,
        actualDependencies: milestone.dependencies,
        status: milestone.status,
        progress: 100,
        blockers: [],
        actualSuccessCriteria: milestone.successCriteria,
        actualMetrics: milestone.metrics,
        timelineVariance: milestone.duration.variance,
        effortVariance: milestone.effort.variance,
        lessonsLearned: milestone.lessonsLearned,
        recommendations: milestone.recommendations
      };
      
      this.tracker.actualMilestones.push(trackerMilestone);
      await this.saveTracker();
      
      console.log('✅ Milestone recorded successfully');
      return milestone;
      
    } catch (error) {
      console.error('❌ Failed to record milestone:', error);
      throw error;
    }
  }

  calculateVariance(planned, actual) {
    if (!planned || !actual) return 0;
    return actual - planned;
  }

  updateTimelineAnalysis() {
    const milestones = this.timeline.milestones;
    const completed = milestones.filter(m => m.status === 'completed');
    const inProgress = milestones.filter(m => m.status === 'in_progress');
    const planned = milestones.filter(m => m.status === 'planned');
    const critical = completed.filter(m => m.priority === 'critical');
    const governance = completed.filter(m => m.category === 'governance');
    const deployment = completed.filter(m => m.category === 'deployment');

    const durationVariances = completed.map(m => m.duration.variance);
    const effortVariances = completed.map(m => m.effort.variance);

    this.timeline.timelineAnalysis = {
      totalMilestones: milestones.length,
      completedMilestones: completed.length,
      inProgressMilestones: inProgress.length,
      plannedMilestones: planned.length,
      completionRate: milestones.length > 0 ? (completed.length / milestones.length) * 100 : 0,
      averageDurationVariance: durationVariances.length > 0 ? 
        durationVariances.reduce((a, b) => a + b, 0) / durationVariances.length : 0,
      averageEffortVariance: effortVariances.length > 0 ? 
        effortVariances.reduce((a, b) => a + b, 0) / effortVariances.length : 0,
      criticalMilestonesCompleted: critical.length,
      governanceMilestonesCompleted: governance.length,
      deploymentMilestonesCompleted: deployment.length
    };

    // Update achievement summary
    const totalAchievements = completed.reduce((sum, m) => sum + (m.achievements?.length || 0), 0);
    const majorDeliverables = completed.reduce((sum, m) => sum + (m.deliverables?.length || 0), 0);
    const systemsImproved = completed.filter(m => m.impact?.systemHealth === 'improved' || m.impact?.systemHealth === 'significantly_improved').length;
    const processesEstablished = completed.filter(m => m.category === 'governance' || m.category === 'deployment').length;

    this.timeline.achievementSummary = {
      totalAchievements,
      majorDeliverables,
      systemsImproved,
      processesEstablished,
      automationLevel: this.determineAutomationLevel(completed),
      governanceMaturity: this.determineGovernanceMaturity(completed)
    };

    // Update impact assessment
    this.timeline.impactAssessment = this.calculateOverallImpact(completed);
  }

  determineAutomationLevel(completedMilestones) {
    const automationMilestones = completedMilestones.filter(m => 
      m.tags?.includes('automation') || 
      m.description?.toLowerCase().includes('automation') ||
      m.achievements?.some(a => a.toLowerCase().includes('automation'))
    );

    if (automationMilestones.length >= 3) return 'high';
    if (automationMilestones.length >= 1) return 'medium';
    return 'low';
  }

  determineGovernanceMaturity(completedMilestones) {
    const governanceMilestones = completedMilestones.filter(m => m.category === 'governance');
    
    if (governanceMilestones.length >= 3) return 'mature';
    if (governanceMilestones.length >= 1) return 'established';
    return 'none';
  }

  calculateOverallImpact(completedMilestones) {
    const impacts = {
      systemHealth: [],
      buildStability: [],
      developmentVelocity: [],
      operationalEfficiency: [],
      governanceCompliance: [],
      monitoringCoverage: []
    };

    completedMilestones.forEach(milestone => {
      if (milestone.impact) {
        Object.keys(impacts).forEach(key => {
          if (milestone.impact[key]) {
            impacts[key].push(milestone.impact[key]);
          }
        });
      }
    });

    const overallImpact = {};
    Object.keys(impacts).forEach(key => {
      const values = impacts[key];
      if (values.length === 0) {
        overallImpact[key] = 'unknown';
      } else if (values.includes('significantly_improved')) {
        overallImpact[key] = 'significantly_improved';
      } else if (values.includes('improved')) {
        overallImpact[key] = 'improved';
      } else if (values.includes('established')) {
        overallImpact[key] = 'established';
      } else {
        overallImpact[key] = values[values.length - 1];
      }
    });

    return overallImpact;
  }

  async saveTimeline() {
    try {
      this.timeline.lastUpdated = new Date().toISOString();
      const timelineDir = path.dirname(this.timelinePath);
      
      if (!fs.existsSync(timelineDir)) {
        fs.mkdirSync(timelineDir, { recursive: true });
      }
      
      fs.writeFileSync(this.timelinePath, JSON.stringify(this.timeline, null, 2));
    } catch (error) {
      console.error('Failed to save timeline:', error);
      throw error;
    }
  }

  async saveTracker() {
    try {
      const trackerDir = path.dirname(this.trackerPath);
      
      if (!fs.existsSync(trackerDir)) {
        fs.mkdirSync(trackerDir, { recursive: true });
      }
      
      fs.writeFileSync(this.trackerPath, JSON.stringify(this.tracker, null, 2));
    } catch (error) {
      console.error('Failed to save tracker:', error);
      throw error;
    }
  }

  generateMilestoneReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: `Milestone Timeline Report - ${this.timeline.projectName}`,
      timelineAnalysis: this.timeline.timelineAnalysis,
      achievementSummary: this.timeline.achievementSummary,
      impactAssessment: this.timeline.impactAssessment,
      recentMilestones: this.timeline.milestones
        .filter(m => m.status === 'completed')
        .sort((a, b) => new Date(b.actualEndDate) - new Date(a.actualEndDate))
        .slice(0, 5),
      nextPriorities: this.timeline.nextPhasePriorities
    };

    return report;
  }

  async analyzeTimeline() {
    console.log('📊 Analyzing milestone timeline...');
    
    const analysis = {
      totalMilestones: this.timeline.milestones.length,
      completionRate: this.timeline.timelineAnalysis.completionRate,
      averageDurationVariance: this.timeline.timelineAnalysis.averageDurationVariance,
      averageEffortVariance: this.timeline.timelineAnalysis.averageEffortVariance,
      criticalMilestonesCompleted: this.timeline.timelineAnalysis.criticalMilestonesCompleted,
      governanceMaturity: this.timeline.achievementSummary.governanceMaturity,
      automationLevel: this.timeline.achievementSummary.automationLevel,
      overallImpact: this.timeline.impactAssessment
    };

    console.log('📈 Timeline Analysis Results:');
    console.log(`  • Total Milestones: ${analysis.totalMilestones}`);
    console.log(`  • Completion Rate: ${analysis.completionRate.toFixed(1)}%`);
    console.log(`  • Average Duration Variance: ${analysis.averageDurationVariance.toFixed(2)} hours`);
    console.log(`  • Average Effort Variance: ${analysis.averageEffortVariance.toFixed(2)} hours`);
    console.log(`  • Critical Milestones Completed: ${analysis.criticalMilestonesCompleted}`);
    console.log(`  • Governance Maturity: ${analysis.governanceMaturity}`);
    console.log(`  • Automation Level: ${analysis.automationLevel}`);
    console.log(`  • System Health: ${analysis.overallImpact.systemHealth}`);
    console.log(`  • Build Stability: ${analysis.overallImpact.buildStability}`);

    return analysis;
  }

  async exportReport() {
    const report = this.generateMilestoneReport();
    const reportPath = path.join(this.projectRoot, 'data', 'roadmap-actuals', `milestone-report-${Date.now()}.json`);
    
    try {
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`📄 Milestone report exported: ${reportPath}`);
      return reportPath;
    } catch (error) {
      console.error('Failed to export report:', error);
      throw error;
    }
  }
}

// Export the tracker
module.exports = MilestoneTracker;

// If run directly, handle command line arguments
if (require.main === module) {
  const tracker = new MilestoneTracker();
  const args = process.argv.slice(2);
  const action = args.find(arg => arg.startsWith('--action='))?.split('=')[1] || 'analyze';

  async function main() {
    try {
      switch (action) {
        case 'record':
          // Example milestone recording
          await tracker.recordMilestone({
            title: "Example Milestone",
            description: "An example milestone for testing",
            category: "development",
            priority: "medium",
            status: "completed",
            actualStartDate: new Date().toISOString(),
            actualEndDate: new Date().toISOString(),
            actualDuration: 2,
            actualEffort: 4,
            achievements: ["Achievement 1", "Achievement 2"],
            deliverables: ["deliverable1.ts", "deliverable2.ts"],
            lessonsLearned: ["Lesson 1", "Lesson 2"],
            recommendations: ["Recommendation 1", "Recommendation 2"]
          });
          break;

        case 'analyze':
          await tracker.analyzeTimeline();
          break;

        case 'report':
          await tracker.exportReport();
          break;

        default:
          console.log('Available actions: record, analyze, report');
          break;
      }
    } catch (error) {
      console.error('❌ Milestone tracker failed:', error);
      process.exit(1);
    }
  }

  main();
} 
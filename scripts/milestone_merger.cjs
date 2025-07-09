#!/usr/bin/env node

/**
 * Milestone Merger
 * Merges retroactive milestones with existing milestone timeline
 * 
 * This script combines the newly discovered historical milestones
 * with the existing milestone timeline to create a comprehensive
 * historical record of all project achievements.
 */

const fs = require('fs');
const path = require('path');

class MilestoneMerger {
  constructor() {
    this.projectRoot = process.cwd();
    this.existingTimelinePath = 'data/roadmap-actuals/milestone-timeline.json';
    this.retroactiveTimelinePath = 'data/roadmap-actuals/retroactive-milestone-timeline.json';
    this.mergedTimelinePath = 'data/roadmap-actuals/comprehensive-milestone-timeline.json';
  }

  async mergeMilestones() {
    console.log('🔄 Starting milestone merger...');
    
    try {
      // Load existing timeline
      const existingTimeline = this.loadTimeline(this.existingTimelinePath);
      console.log(`📊 Loaded existing timeline with ${existingTimeline.milestones.length} milestones`);
      
      // Load retroactive timeline
      const retroactiveTimeline = this.loadTimeline(this.retroactiveTimelinePath);
      console.log(`📊 Loaded retroactive timeline with ${retroactiveTimeline.milestones.length} milestones`);
      
      // Merge timelines
      const mergedTimeline = this.mergeTimelines(existingTimeline, retroactiveTimeline);
      console.log(`📊 Merged timeline has ${mergedTimeline.milestones.length} total milestones`);
      
      // Deduplicate and organize
      const deduplicatedTimeline = this.deduplicateMilestones(mergedTimeline);
      console.log(`📊 Deduplicated timeline has ${deduplicatedTimeline.milestones.length} unique milestones`);
      
      // Generate comprehensive analysis
      this.generateComprehensiveAnalysis(deduplicatedTimeline);
      
      // Save merged timeline
      await this.saveMergedTimeline(deduplicatedTimeline);
      
      // Generate merger report
      await this.generateMergerReport(existingTimeline, retroactiveTimeline, deduplicatedTimeline);
      
      console.log('✅ Milestone merger completed successfully!');
      
    } catch (error) {
      console.error('❌ Error during milestone merger:', error);
      throw error;
    }
  }

  loadTimeline(filePath) {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Warning: Timeline file ${filePath} not found`);
      return { milestones: [] };
    }
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.warn(`⚠️ Warning: Could not parse timeline file ${filePath}:`, error.message);
      return { milestones: [] };
    }
  }

  mergeTimelines(existingTimeline, retroactiveTimeline) {
    const merged = {
      projectId: "greenlight-platform",
      projectName: "Greenlight Platform",
      timelineVersion: "2.0.0",
      lastUpdated: new Date().toISOString(),
      milestoneCategories: [
        "infrastructure", "governance", "development", "deployment", 
        "security", "performance", "testing", "documentation", 
        "integration", "optimization", "architecture", "research"
      ],
      milestonePriorities: ["critical", "high", "medium", "low"],
      milestoneStatuses: ["planned", "in_progress", "completed", "blocked", "cancelled", "deferred"],
      milestones: [],
      timelineAnalysis: {},
      achievementSummary: {},
      impactAssessment: {},
      nextPhasePriorities: []
    };

    // Add existing milestones
    if (existingTimeline.milestones) {
      merged.milestones.push(...existingTimeline.milestones);
    }

    // Add retroactive milestones
    if (retroactiveTimeline.milestones) {
      merged.milestones.push(...retroactiveTimeline.milestones);
    }

    return merged;
  }

  deduplicateMilestones(timeline) {
    const uniqueMilestones = [];
    const seenTitles = new Set();
    const seenIds = new Set();

    timeline.milestones.forEach(milestone => {
      // Check for duplicate titles (case-insensitive)
      const normalizedTitle = milestone.title.toLowerCase().trim();
      
      // Check for duplicate IDs
      if (seenIds.has(milestone.id)) {
        console.log(`🔄 Found duplicate ID: ${milestone.id}`);
        milestone.id = `${milestone.id}-${Date.now()}`;
      }

      if (seenTitles.has(normalizedTitle)) {
        console.log(`🔄 Found duplicate title: ${milestone.title}`);
        // Merge achievements and deliverables instead of skipping
        const existingMilestone = uniqueMilestones.find(m => 
          m.title.toLowerCase().trim() === normalizedTitle
        );
        
        if (existingMilestone) {
          // Merge achievements
          const mergedAchievements = [...new Set([
            ...existingMilestone.achievements,
            ...milestone.achievements
          ])];
          existingMilestone.achievements = mergedAchievements;

          // Merge deliverables
          const mergedDeliverables = [...new Set([
            ...existingMilestone.deliverables,
            ...milestone.deliverables
          ])];
          existingMilestone.deliverables = mergedDeliverables;

          // Merge tags
          const mergedTags = [...new Set([
            ...existingMilestone.tags,
            ...milestone.tags
          ])];
          existingMilestone.tags = mergedTags;

          // Update impact if new milestone has more detailed impact
          if (Object.keys(milestone.impact).length > Object.keys(existingMilestone.impact).length) {
            existingMilestone.impact = { ...existingMilestone.impact, ...milestone.impact };
          }

          console.log(`✅ Merged duplicate milestone: ${milestone.title}`);
        }
      } else {
        seenTitles.add(normalizedTitle);
        seenIds.add(milestone.id);
        uniqueMilestones.push(milestone);
      }
    });

    timeline.milestones = uniqueMilestones;
    return timeline;
  }

  generateComprehensiveAnalysis(timeline) {
    const totalMilestones = timeline.milestones.length;
    const completedMilestones = timeline.milestones.filter(m => m.status === 'completed').length;
    const criticalMilestones = timeline.milestones.filter(m => m.priority === 'critical').length;
    
    // Category breakdown
    const categoryCounts = {};
    const priorityCounts = {};
    const totalAchievements = timeline.milestones.reduce((sum, m) => sum + m.achievements.length, 0);
    const totalDeliverables = timeline.milestones.reduce((sum, m) => sum + m.deliverables.length, 0);
    
    timeline.milestones.forEach(milestone => {
      categoryCounts[milestone.category] = (categoryCounts[milestone.category] || 0) + 1;
      priorityCounts[milestone.priority] = (priorityCounts[milestone.priority] || 0) + 1;
    });

    // Calculate average duration and effort variances
    const durationVariances = timeline.milestones
      .filter(m => m.duration && m.duration.variance !== undefined)
      .map(m => m.duration.variance);
    
    const effortVariances = timeline.milestones
      .filter(m => m.effort && m.effort.variance !== undefined)
      .map(m => m.effort.variance);

    const avgDurationVariance = durationVariances.length > 0 
      ? durationVariances.reduce((sum, v) => sum + v, 0) / durationVariances.length 
      : 0;
    
    const avgEffortVariance = effortVariances.length > 0 
      ? effortVariances.reduce((sum, v) => sum + v, 0) / effortVariances.length 
      : 0;

    timeline.timelineAnalysis = {
      totalMilestones,
      completedMilestones,
      inProgressMilestones: timeline.milestones.filter(m => m.status === 'in_progress').length,
      plannedMilestones: timeline.milestones.filter(m => m.status === 'planned').length,
      completionRate: totalMilestones > 0 ? (completedMilestones / totalMilestones * 100) : 0,
      averageDurationVariance: avgDurationVariance,
      averageEffortVariance: avgEffortVariance,
      criticalMilestonesCompleted: criticalMilestones,
      categoryBreakdown: categoryCounts,
      priorityBreakdown: priorityCounts,
      totalAchievements,
      totalDeliverables
    };

    // Generate achievement summary
    timeline.achievementSummary = {
      totalAchievements,
      totalDeliverables,
      systemsImproved: this.countSystemsImproved(timeline),
      processesEstablished: this.countProcessesEstablished(timeline),
      automationLevel: this.determineAutomationLevel(timeline),
      governanceMaturity: this.determineGovernanceMaturity(timeline)
    };

    // Generate impact assessment
    timeline.impactAssessment = this.generateImpactAssessment(timeline);
  }

  countSystemsImproved(timeline) {
    return timeline.milestones.filter(m => 
      m.impact && (m.impact.systemHealth === 'improved' || m.impact.systemHealth === 'significantly_improved')
    ).length;
  }

  countProcessesEstablished(timeline) {
    return timeline.milestones.filter(m => 
      m.impact && (m.impact.governanceCompliance === 'established' || m.impact.operationalEfficiency === 'significantly_improved')
    ).length;
  }

  determineAutomationLevel(timeline) {
    const automationMilestones = timeline.milestones.filter(m => 
      m.tags && m.tags.some(tag => tag.includes('automation') || tag.includes('protocol'))
    ).length;
    
    if (automationMilestones > 20) return 'high';
    if (automationMilestones > 10) return 'medium';
    return 'low';
  }

  determineGovernanceMaturity(timeline) {
    const governanceMilestones = timeline.milestones.filter(m => 
      m.category === 'governance' || (m.tags && m.tags.includes('governance'))
    ).length;
    
    if (governanceMilestones > 30) return 'mature';
    if (governanceMilestones > 15) return 'established';
    return 'developing';
  }

  generateImpactAssessment(timeline) {
    const impacts = {
      systemHealth: 'unknown',
      buildStability: 'unknown',
      developmentVelocity: 'unknown',
      operationalEfficiency: 'unknown',
      governanceCompliance: 'unknown',
      monitoringCoverage: 'unknown'
    };

    // Aggregate impact from all milestones
    timeline.milestones.forEach(milestone => {
      if (milestone.impact) {
        Object.entries(milestone.impact).forEach(([key, value]) => {
          if (impacts[key] === 'unknown') {
            impacts[key] = value;
          } else if (value === 'significantly_improved' && impacts[key] === 'improved') {
            impacts[key] = value;
          } else if (value === 'established' && impacts[key] === 'improved') {
            impacts[key] = value;
          }
        });
      }
    });

    return impacts;
  }

  async saveMergedTimeline(timeline) {
    // Ensure directory exists
    const dir = path.dirname(this.mergedTimelinePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Save the comprehensive milestone timeline
    fs.writeFileSync(this.mergedTimelinePath, JSON.stringify(timeline, null, 2));
    console.log(`💾 Saved comprehensive milestone timeline to ${this.mergedTimelinePath}`);
    
    // Also update the main milestone timeline
    fs.writeFileSync(this.existingTimelinePath, JSON.stringify(timeline, null, 2));
    console.log(`💾 Updated main milestone timeline at ${this.existingTimelinePath}`);
  }

  async generateMergerReport(existingTimeline, retroactiveTimeline, mergedTimeline) {
    const reportPath = 'docs/summaries/MILESTONE_MERGER_REPORT.md';
    
    // Ensure directory exists
    const dir = path.dirname(reportPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const report = this.generateReportContent(existingTimeline, retroactiveTimeline, mergedTimeline);
    fs.writeFileSync(reportPath, report);
    console.log(`📊 Generated merger report at ${reportPath}`);
  }

  generateReportContent(existingTimeline, retroactiveTimeline, mergedTimeline) {
    const existingCount = existingTimeline.milestones ? existingTimeline.milestones.length : 0;
    const retroactiveCount = retroactiveTimeline.milestones ? retroactiveTimeline.milestones.length : 0;
    const mergedCount = mergedTimeline.milestones.length;
    const duplicatesRemoved = existingCount + retroactiveCount - mergedCount;
    
    return `# 🔄 Milestone Merger Report
## Comprehensive Historical Achievement Integration

**Generated**: ${new Date().toISOString()}
**Merger Operation**: Retroactive + Existing Timeline Integration
**Total Milestones After Merger**: ${mergedCount}

---

## 📊 **MERGER STATISTICS**

### **Input Timelines**
- **Existing Timeline**: ${existingCount} milestones
- **Retroactive Timeline**: ${retroactiveCount} milestones
- **Total Input**: ${existingCount + retroactiveCount} milestones

### **Merger Results**
- **Final Timeline**: ${mergedCount} milestones
- **Duplicates Removed**: ${duplicatesRemoved}
- **Net Addition**: ${mergedCount - existingCount} new milestones

---

## 🎯 **TIMELINE ANALYSIS**

### **Overall Statistics**
- **Total Milestones**: ${mergedCount}
- **Completed Milestones**: ${mergedTimeline.timelineAnalysis.completedMilestones}
- **Critical Milestones**: ${mergedTimeline.timelineAnalysis.criticalMilestonesCompleted}
- **Completion Rate**: ${mergedTimeline.timelineAnalysis.completionRate.toFixed(1)}%

### **Category Breakdown**
${Object.entries(mergedTimeline.timelineAnalysis.categoryBreakdown)
  .sort(([,a], [,b]) => b - a)
  .map(([category, count]) => `- **${category}**: ${count} milestones`)
  .join('\n')}

### **Priority Breakdown**
${Object.entries(mergedTimeline.timelineAnalysis.priorityBreakdown)
  .sort(([,a], [,b]) => b - a)
  .map(([priority, count]) => `- **${priority}**: ${count} milestones`)
  .join('\n')}

---

## 🏆 **ACHIEVEMENT SUMMARY**

### **Total Accomplishments**
- **Total Achievements**: ${mergedTimeline.achievementSummary.totalAchievements}
- **Total Deliverables**: ${mergedTimeline.achievementSummary.totalDeliverables}
- **Systems Improved**: ${mergedTimeline.achievementSummary.systemsImproved}
- **Processes Established**: ${mergedTimeline.achievementSummary.processesEstablished}

### **Maturity Assessment**
- **Automation Level**: ${mergedTimeline.achievementSummary.automationLevel}
- **Governance Maturity**: ${mergedTimeline.achievementSummary.governanceMaturity}

---

## 📈 **IMPACT ASSESSMENT**

### **System Impact**
- **System Health**: ${mergedTimeline.impactAssessment.systemHealth}
- **Build Stability**: ${mergedTimeline.impactAssessment.buildStability}
- **Development Velocity**: ${mergedTimeline.impactAssessment.developmentVelocity}
- **Operational Efficiency**: ${mergedTimeline.impactAssessment.operationalEfficiency}
- **Governance Compliance**: ${mergedTimeline.impactAssessment.governanceCompliance}
- **Monitoring Coverage**: ${mergedTimeline.impactAssessment.monitoringCoverage}

---

## 🔍 **KEY DISCOVERIES**

### **Major Achievement Categories**
${Object.entries(mergedTimeline.timelineAnalysis.categoryBreakdown)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 5)
  .map(([category, count]) => `1. **${category}** (${count} milestones)`)
  .join('\n')}

### **Notable Historical Achievements**
${mergedTimeline.milestones
  .filter(m => m.priority === 'critical')
  .slice(0, 10)
  .map(m => `- ${m.title}`)
  .join('\n')}

---

## 🚀 **BENEFITS OF MERGER**

### **Immediate Benefits**
1. **Complete Historical Record**: All achievements now documented in one place
2. **Comprehensive Analysis**: Full project evolution visible
3. **Better Planning**: Historical context for future milestones
4. **Achievement Recognition**: All accomplishments properly acknowledged

### **Long-term Benefits**
1. **Strategic Planning**: Historical patterns inform future strategy
2. **Team Recognition**: Complete record of team accomplishments
3. **Lessons Learned**: Comprehensive repository of experiences
4. **Governance Maturity**: Full governance evolution documented

---

## 📁 **FILES UPDATED**

- **Comprehensive Timeline**: \`data/roadmap-actuals/comprehensive-milestone-timeline.json\`
- **Main Timeline**: \`data/roadmap-actuals/milestone-timeline.json\` (updated)
- **Merger Report**: \`docs/summaries/MILESTONE_MERGER_REPORT.md\`

---

## 🎯 **NEXT STEPS**

### **Immediate Actions**
1. **Review Timeline**: Validate all merged milestones for accuracy
2. **Enrich Data**: Add missing details to historical milestones
3. **Categorize**: Organize milestones into logical phases
4. **Document**: Create comprehensive documentation for each milestone

### **Future Enhancements**
1. **Timeline Visualization**: Create visual timeline representation
2. **Achievement Dashboard**: Build dashboard for milestone tracking
3. **Automated Updates**: Integrate milestone tracking into development workflow
4. **Historical Analysis**: Perform deep analysis of project evolution patterns

---

**Generated by**: Milestone Merger v1.0.0
**Merger Date**: ${new Date().toISOString()}
`;
  }
}

// Main execution
async function main() {
  const merger = new MilestoneMerger();
  await merger.mergeMilestones();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = MilestoneMerger; 
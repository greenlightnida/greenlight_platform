#!/usr/bin/env node

/**
 * Retroactive Milestone Gatherer
 * Extracts all historical milestones from documentation and codebase
 * 
 * This script scans through all documentation files, changelogs, and
 * implementation summaries to identify and document historical achievements
 * that should be recorded as milestones.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class RetroactiveMilestoneGatherer {
  constructor() {
    this.projectRoot = process.cwd();
    this.milestoneData = {
      projectId: "greenlight-platform",
      projectName: "Greenlight Platform",
      timelineVersion: "1.1.0",
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
    
    this.milestonePatterns = {
      completed: [
        /✅.*COMPLETED?/gi,
        /Phase.*COMPLETED?/gi,
        /Milestone.*COMPLETED?/gi,
        /Status.*COMPLETED?/gi,
        /SUCCESSFULLY.*COMPLETED?/gi,
        /MISSION.*COMPLETE/gi
      ],
      achievements: [
        /✅.*(?:Created|Built|Developed|Implemented|Established|Launched)/gi,
        /Achievement.*(?:Created|Built|Developed|Implemented|Established|Launched)/gi,
        /Successfully.*(?:Created|Built|Developed|Implemented|Established|Launched)/gi
      ],
      deliverables: [
        /Deliverables?.*(?:Created|Built|Developed|Implemented|Established|Launched)/gi,
        /Created.*(?:Manager|System|Protocol|Dashboard|Component)/gi,
        /Built.*(?:Manager|System|Protocol|Dashboard|Component)/gi,
        /Implemented.*(?:Manager|System|Protocol|Dashboard|Component)/gi
      ]
    };
  }

  async gatherAllMilestones() {
    console.log('🔍 Starting retroactive milestone gathering...');
    
    try {
      // Scan documentation directories
      await this.scanDocumentation();
      
      // Scan changelogs and history
      await this.scanChangelogs();
      
      // Scan implementation summaries
      await this.scanImplementationSummaries();
      
      // Scan roadmap and phase documents
      await this.scanRoadmapDocuments();
      
      // Scan academic integration documents
      await this.scanAcademicDocuments();
      
      // Generate timeline analysis
      this.generateTimelineAnalysis();
      
      // Save the comprehensive milestone timeline
      await this.saveMilestoneTimeline();
      
      // Generate summary report
      await this.generateSummaryReport();
      
      console.log('✅ Retroactive milestone gathering completed successfully!');
      
    } catch (error) {
      console.error('❌ Error during milestone gathering:', error);
      throw error;
    }
  }

  async scanDocumentation() {
    console.log('📚 Scanning documentation directories...');
    
    const docDirs = [
      'docs/phases',
      'docs/summaries', 
      'docs/architecture',
      'docs/platforms',
      'docs/audits',
      'docs/deployment'
    ];

    for (const dir of docDirs) {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
        for (const file of files) {
          await this.analyzeDocument(path.join(dir, file));
        }
      }
    }
  }

  async scanChangelogs() {
    console.log('📝 Scanning changelogs and history...');
    
    const changelogFiles = [
      'scripts/CHANGELOG.md',
      'data/history/CHANGELOG_top_bins.md',
      'data/history/DECISION_LOG_top_bins.md',
      'DECISION_LOG.md',
      'CHANGELOG.md'
    ];

    for (const file of changelogFiles) {
      if (fs.existsSync(file)) {
        await this.analyzeChangelog(file);
      }
    }
  }

  async scanImplementationSummaries() {
    console.log('🏗️ Scanning implementation summaries...');
    
    const summaryFiles = [
      'ACADEMIC_INTEGRATION_COMPLETION_SUMMARY.md',
      'SYNTHESIS_COMPLETION_REPORT.md',
      'COMPREHENSIVE_UPDATE_PLAN.md',
      'docs/summaries/ANCHOR_COMMAND_MIGRATION_COMPLETE.md',
      'docs/summaries/ROADMAP_ACTUALS_IMPLEMENTATION_SUMMARY.md',
      'docs/summaries/PRODUCT_MANAGER_INTEGRATION_SUMMARY.md',
      'docs/summaries/MIGRATION_MESS_RESOLUTION_SUMMARY.md',
      'docs/summaries/PLATFORM_UPDATE_SUMMARY.md',
      'docs/summaries/SESSION_2025_01_08_PROTOCOL_SYSTEM_ENHANCEMENT.md'
    ];

    for (const file of summaryFiles) {
      if (fs.existsSync(file)) {
        await this.analyzeImplementationSummary(file);
      }
    }
  }

  async scanRoadmapDocuments() {
    console.log('🗺️ Scanning roadmap documents...');
    
    const roadmapFiles = [
      'ROADMAP.md',
      'docs/architecture/LIVING_ROADMAP.md',
      'docs/phases/PROFESSIONAL_MILESTONE_BASED_PLAN.md',
      'docs/phases/INTEGRATED_SOLUTIONS_ENGINEERING_PLAN.md',
      'docs/phases/MISSION_ROADMAP_INTEGRATION_SUMMARY.md',
      'docs/phases/PHASE_1_PROGRESS_SUMMARY.md',
      'docs/phases/ROADMAP_IMPLEMENTATION_SUMMARY.md'
    ];

    for (const file of roadmapFiles) {
      if (fs.existsSync(file)) {
        await this.analyzeRoadmapDocument(file);
      }
    }
  }

  async scanAcademicDocuments() {
    console.log('🎓 Scanning academic integration documents...');
    
    const academicFiles = [
      'docs/research/ACADEMIC_HOLON_RESEARCH_INTEGRATION.md',
      'ACADEMIC_INTEGRATION_COMPLETION_SUMMARY.md',
      'SYNTHESIS_COMPLETION_REPORT.md'
    ];

    for (const file of academicFiles) {
      if (fs.existsSync(file)) {
        await this.analyzeAcademicDocument(file);
      }
    }
  }

  async analyzeDocument(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath, '.md');
      
      // Extract completion patterns
      const completions = this.extractCompletions(content);
      const achievements = this.extractAchievements(content);
      const deliverables = this.extractDeliverables(content);
      
      if (completions.length > 0 || achievements.length > 0 || deliverables.length > 0) {
        const milestone = this.createMilestoneFromDocument(fileName, content, completions, achievements, deliverables);
        if (milestone) {
          this.milestoneData.milestones.push(milestone);
        }
      }
    } catch (error) {
      console.warn(`⚠️ Warning: Could not analyze ${filePath}:`, error.message);
    }
  }

  async analyzeChangelog(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath, '.md');
      
      // Extract work sessions and achievements
      const workSessions = this.extractWorkSessions(content);
      const achievements = this.extractAchievements(content);
      
      if (workSessions.length > 0 || achievements.length > 0) {
        const milestone = this.createMilestoneFromChangelog(fileName, content, workSessions, achievements);
        if (milestone) {
          this.milestoneData.milestones.push(milestone);
        }
      }
    } catch (error) {
      console.warn(`⚠️ Warning: Could not analyze changelog ${filePath}:`, error.message);
    }
  }

  async analyzeImplementationSummary(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath, '.md');
      
      // Extract implementation details
      const completions = this.extractCompletions(content);
      const achievements = this.extractAchievements(content);
      const deliverables = this.extractDeliverables(content);
      const metrics = this.extractMetrics(content);
      
      if (completions.length > 0 || achievements.length > 0 || deliverables.length > 0) {
        const milestone = this.createMilestoneFromImplementation(fileName, content, completions, achievements, deliverables, metrics);
        if (milestone) {
          this.milestoneData.milestones.push(milestone);
        }
      }
    } catch (error) {
      console.warn(`⚠️ Warning: Could not analyze implementation summary ${filePath}:`, error.message);
    }
  }

  async analyzeRoadmapDocument(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath, '.md');
      
      // Extract phase completions and roadmap achievements
      const phaseCompletions = this.extractPhaseCompletions(content);
      const roadmapAchievements = this.extractRoadmapAchievements(content);
      
      if (phaseCompletions.length > 0 || roadmapAchievements.length > 0) {
        const milestone = this.createMilestoneFromRoadmap(fileName, content, phaseCompletions, roadmapAchievements);
        if (milestone) {
          this.milestoneData.milestones.push(milestone);
        }
      }
    } catch (error) {
      console.warn(`⚠️ Warning: Could not analyze roadmap document ${filePath}:`, error.message);
    }
  }

  async analyzeAcademicDocument(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath, '.md');
      
      // Extract academic integration achievements
      const academicAchievements = this.extractAcademicAchievements(content);
      const researchIntegrations = this.extractResearchIntegrations(content);
      
      if (academicAchievements.length > 0 || researchIntegrations.length > 0) {
        const milestone = this.createMilestoneFromAcademic(fileName, content, academicAchievements, researchIntegrations);
        if (milestone) {
          this.milestoneData.milestones.push(milestone);
        }
      }
    } catch (error) {
      console.warn(`⚠️ Warning: Could not analyze academic document ${filePath}:`, error.message);
    }
  }

  extractCompletions(content) {
    const completions = [];
    for (const pattern of this.milestonePatterns.completed) {
      const matches = content.match(pattern);
      if (matches) {
        completions.push(...matches);
      }
    }
    return completions;
  }

  extractAchievements(content) {
    const achievements = [];
    for (const pattern of this.milestonePatterns.achievements) {
      const matches = content.match(pattern);
      if (matches) {
        achievements.push(...matches);
      }
    }
    return achievements;
  }

  extractDeliverables(content) {
    const deliverables = [];
    for (const pattern of this.milestonePatterns.deliverables) {
      const matches = content.match(pattern);
      if (matches) {
        deliverables.push(...matches);
      }
    }
    return deliverables;
  }

  extractWorkSessions(content) {
    const workSessionPattern = /WORK SESSION COMPLETION: session-(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})/g;
    const sessions = [];
    let match;
    
    while ((match = workSessionPattern.exec(content)) !== null) {
      sessions.push({
        sessionId: match[1],
        date: new Date(match[1].replace(/-/g, ':').replace(/(\d{2}):(\d{2}):(\d{2})/, '$1:$2:$3'))
      });
    }
    
    return sessions;
  }

  extractMetrics(content) {
    const metrics = {};
    
    // Extract build error reductions
    const buildErrorMatch = content.match(/(\d+)\s*→\s*(\d+)\s*TypeScript errors/);
    if (buildErrorMatch) {
      metrics.buildErrors = {
        before: parseInt(buildErrorMatch[1]),
        after: parseInt(buildErrorMatch[2]),
        improvement: `${((parseInt(buildErrorMatch[1]) - parseInt(buildErrorMatch[2])) / parseInt(buildErrorMatch[1]) * 100).toFixed(1)}%`
      };
    }
    
    // Extract component counts
    const componentMatch = content.match(/(\d+)\s*components?\s*(?:created|implemented)/i);
    if (componentMatch) {
      metrics.componentsCreated = parseInt(componentMatch[1]);
    }
    
    return metrics;
  }

  extractPhaseCompletions(content) {
    const phasePattern = /Phase\s*(\d+).*COMPLETED?/gi;
    const phases = [];
    let match;
    
    while ((match = phasePattern.exec(content)) !== null) {
      phases.push({
        phaseNumber: parseInt(match[1]),
        status: 'completed'
      });
    }
    
    return phases;
  }

  extractRoadmapAchievements(content) {
    const achievementPattern = /✅\s*(.*?)(?:\n|$)/g;
    const achievements = [];
    let match;
    
    while ((match = achievementPattern.exec(content)) !== null) {
      achievements.push(match[1].trim());
    }
    
    return achievements;
  }

  extractAcademicAchievements(content) {
    const academicPattern = /Academic.*(?:integration|research|synthesis).*COMPLETED?/gi;
    const achievements = [];
    let match;
    
    while ((match = academicPattern.exec(content)) !== null) {
      achievements.push(match[0]);
    }
    
    return achievements;
  }

  extractResearchIntegrations(content) {
    const researchPattern = /Research.*(?:integrated|implemented|completed)/gi;
    const integrations = [];
    let match;
    
    while ((match = researchPattern.exec(content)) !== null) {
      integrations.push(match[0]);
    }
    
    return integrations;
  }

  createMilestoneFromDocument(fileName, content, completions, achievements, deliverables) {
    const milestoneId = `milestone-${this.generateId()}-${fileName}`;
    const title = this.extractTitle(content) || `${fileName.replace(/_/g, ' ')} Implementation`;
    
    return {
      id: milestoneId,
      title: title,
      description: this.extractDescription(content),
      category: this.determineCategory(fileName, content),
      priority: this.determinePriority(content),
      status: "completed",
      plannedStartDate: this.extractDate(content),
      plannedEndDate: this.extractDate(content),
      actualStartDate: this.extractDate(content),
      actualEndDate: this.extractDate(content),
      duration: { planned: 1, actual: 1, unit: "hours", variance: 0 },
      effort: { planned: 4, actual: 4, unit: "hours", variance: 0 },
      teamSize: 1,
      dependencies: [],
      achievements: achievements.slice(0, 10),
      deliverables: deliverables.slice(0, 10),
      metrics: {},
      impact: this.determineImpact(content),
      successCriteria: completions.slice(0, 5),
      successCriteriaStatus: completions.map(c => ({ criterion: c, status: "completed", evidence: "Documented in source" })),
      lessonsLearned: [],
      recommendations: [],
      risks: [],
      tags: this.extractTags(fileName, content),
      relatedMilestones: [],
      nextMilestones: []
    };
  }

  createMilestoneFromChangelog(fileName, content, workSessions, achievements) {
    if (workSessions.length === 0) return null;
    
    const milestoneId = `milestone-${this.generateId()}-${fileName}`;
    const latestSession = workSessions[workSessions.length - 1];
    
    return {
      id: milestoneId,
      title: `${fileName.replace(/_/g, ' ')} Development Session`,
      description: `Development work session with ${achievements.length} achievements`,
      category: "development",
      priority: "medium",
      status: "completed",
      plannedStartDate: latestSession.date.toISOString(),
      plannedEndDate: latestSession.date.toISOString(),
      actualStartDate: latestSession.date.toISOString(),
      actualEndDate: latestSession.date.toISOString(),
      duration: { planned: 2, actual: 2, unit: "hours", variance: 0 },
      effort: { planned: 8, actual: 8, unit: "hours", variance: 0 },
      teamSize: 1,
      dependencies: [],
      achievements: achievements.slice(0, 10),
      deliverables: [],
      metrics: {},
      impact: { systemHealth: "improved", developmentVelocity: "improved" },
      successCriteria: [`${workSessions.length} work sessions completed`],
      successCriteriaStatus: [{ criterion: `${workSessions.length} work sessions completed`, status: "completed", evidence: "Documented in changelog" }],
      lessonsLearned: [],
      recommendations: [],
      risks: [],
      tags: ["development", "changelog", "work-session"],
      relatedMilestones: [],
      nextMilestones: []
    };
  }

  createMilestoneFromImplementation(fileName, content, completions, achievements, deliverables, metrics) {
    const milestoneId = `milestone-${this.generateId()}-${fileName}`;
    const title = this.extractTitle(content) || `${fileName.replace(/_/g, ' ')} Implementation`;
    
    return {
      id: milestoneId,
      title: title,
      description: this.extractDescription(content),
      category: this.determineCategory(fileName, content),
      priority: this.determinePriority(content),
      status: "completed",
      plannedStartDate: this.extractDate(content),
      plannedEndDate: this.extractDate(content),
      actualStartDate: this.extractDate(content),
      actualEndDate: this.extractDate(content),
      duration: { planned: 4, actual: 4, unit: "hours", variance: 0 },
      effort: { planned: 16, actual: 16, unit: "hours", variance: 0 },
      teamSize: 1,
      dependencies: [],
      achievements: achievements.slice(0, 10),
      deliverables: deliverables.slice(0, 10),
      metrics: metrics,
      impact: this.determineImpact(content),
      successCriteria: completions.slice(0, 5),
      successCriteriaStatus: completions.map(c => ({ criterion: c, status: "completed", evidence: "Implementation documented" })),
      lessonsLearned: [],
      recommendations: [],
      risks: [],
      tags: this.extractTags(fileName, content),
      relatedMilestones: [],
      nextMilestones: []
    };
  }

  createMilestoneFromRoadmap(fileName, content, phaseCompletions, roadmapAchievements) {
    if (phaseCompletions.length === 0 && roadmapAchievements.length === 0) return null;
    
    const milestoneId = `milestone-${this.generateId()}-${fileName}`;
    
    return {
      id: milestoneId,
      title: `${fileName.replace(/_/g, ' ')} Roadmap Achievement`,
      description: `Roadmap milestone with ${phaseCompletions.length} phases and ${roadmapAchievements.length} achievements`,
      category: "governance",
      priority: "high",
      status: "completed",
      plannedStartDate: this.extractDate(content),
      plannedEndDate: this.extractDate(content),
      actualStartDate: this.extractDate(content),
      actualEndDate: this.extractDate(content),
      duration: { planned: 8, actual: 8, unit: "hours", variance: 0 },
      effort: { planned: 32, actual: 32, unit: "hours", variance: 0 },
      teamSize: 1,
      dependencies: [],
      achievements: roadmapAchievements.slice(0, 10),
      deliverables: [],
      metrics: {},
      impact: { systemHealth: "improved", governanceCompliance: "established" },
      successCriteria: phaseCompletions.map(p => `Phase ${p.phaseNumber} completed`),
      successCriteriaStatus: phaseCompletions.map(p => ({ criterion: `Phase ${p.phaseNumber} completed`, status: "completed", evidence: "Roadmap documented" })),
      lessonsLearned: [],
      recommendations: [],
      risks: [],
      tags: ["roadmap", "governance", "planning"],
      relatedMilestones: [],
      nextMilestones: []
    };
  }

  createMilestoneFromAcademic(fileName, content, academicAchievements, researchIntegrations) {
    if (academicAchievements.length === 0 && researchIntegrations.length === 0) return null;
    
    const milestoneId = `milestone-${this.generateId()}-${fileName}`;
    
    return {
      id: milestoneId,
      title: `${fileName.replace(/_/g, ' ')} Academic Integration`,
      description: `Academic research integration with ${academicAchievements.length} achievements and ${researchIntegrations.length} integrations`,
      category: "research",
      priority: "medium",
      status: "completed",
      plannedStartDate: this.extractDate(content),
      plannedEndDate: this.extractDate(content),
      actualStartDate: this.extractDate(content),
      actualEndDate: this.extractDate(content),
      duration: { planned: 6, actual: 6, unit: "hours", variance: 0 },
      effort: { planned: 24, actual: 24, unit: "hours", variance: 0 },
      teamSize: 1,
      dependencies: [],
      achievements: [...academicAchievements, ...researchIntegrations].slice(0, 10),
      deliverables: [],
      metrics: {},
      impact: { systemHealth: "improved", researchIntegration: "established" },
      successCriteria: academicAchievements.slice(0, 5),
      successCriteriaStatus: academicAchievements.map(a => ({ criterion: a, status: "completed", evidence: "Academic integration documented" })),
      lessonsLearned: [],
      recommendations: [],
      risks: [],
      tags: ["research", "academic", "integration"],
      relatedMilestones: [],
      nextMilestones: []
    };
  }

  extractTitle(content) {
    const titleMatch = content.match(/^#\s*(.+)$/m);
    return titleMatch ? titleMatch[1].trim() : null;
  }

  extractDescription(content) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('##') && lines[i].includes('Description')) {
        return lines[i + 1] ? lines[i + 1].trim() : '';
      }
    }
    return '';
  }

  extractDate(content) {
    const dateMatch = content.match(/(\d{4}-\d{2}-\d{2})/);
    return dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString();
  }

  determineCategory(fileName, content) {
    const lowerContent = content.toLowerCase();
    const lowerFileName = fileName.toLowerCase();
    
    if (lowerContent.includes('governance') || lowerFileName.includes('governance')) return 'governance';
    if (lowerContent.includes('deployment') || lowerFileName.includes('deployment')) return 'deployment';
    if (lowerContent.includes('testing') || lowerFileName.includes('test')) return 'testing';
    if (lowerContent.includes('security') || lowerFileName.includes('security')) return 'security';
    if (lowerContent.includes('performance') || lowerFileName.includes('performance')) return 'performance';
    if (lowerContent.includes('research') || lowerFileName.includes('research')) return 'research';
    if (lowerContent.includes('architecture') || lowerFileName.includes('architecture')) return 'architecture';
    if (lowerContent.includes('integration') || lowerFileName.includes('integration')) return 'integration';
    if (lowerContent.includes('optimization') || lowerFileName.includes('optimization')) return 'optimization';
    if (lowerContent.includes('documentation') || lowerFileName.includes('documentation')) return 'documentation';
    if (lowerContent.includes('infrastructure') || lowerFileName.includes('infrastructure')) return 'infrastructure';
    
    return 'development';
  }

  determinePriority(content) {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('critical') || lowerContent.includes('urgent')) return 'critical';
    if (lowerContent.includes('high priority') || lowerContent.includes('important')) return 'high';
    if (lowerContent.includes('low priority') || lowerContent.includes('minor')) return 'low';
    
    return 'medium';
  }

  determineImpact(content) {
    const lowerContent = content.toLowerCase();
    const impact = {};
    
    if (lowerContent.includes('system health') || lowerContent.includes('build')) {
      impact.systemHealth = 'improved';
    }
    if (lowerContent.includes('performance') || lowerContent.includes('optimization')) {
      impact.performance = 'improved';
    }
    if (lowerContent.includes('security') || lowerContent.includes('compliance')) {
      impact.security = 'improved';
    }
    if (lowerContent.includes('governance') || lowerContent.includes('compliance')) {
      impact.governanceCompliance = 'established';
    }
    
    return impact;
  }

  extractTags(fileName, content) {
    const tags = [];
    const lowerContent = content.toLowerCase();
    const lowerFileName = fileName.toLowerCase();
    
    if (lowerContent.includes('governance') || lowerFileName.includes('governance')) tags.push('governance');
    if (lowerContent.includes('deployment') || lowerFileName.includes('deployment')) tags.push('deployment');
    if (lowerContent.includes('testing') || lowerFileName.includes('test')) tags.push('testing');
    if (lowerContent.includes('security') || lowerFileName.includes('security')) tags.push('security');
    if (lowerContent.includes('performance') || lowerFileName.includes('performance')) tags.push('performance');
    if (lowerContent.includes('research') || lowerFileName.includes('research')) tags.push('research');
    if (lowerContent.includes('architecture') || lowerFileName.includes('architecture')) tags.push('architecture');
    if (lowerContent.includes('integration') || lowerFileName.includes('integration')) tags.push('integration');
    if (lowerContent.includes('optimization') || lowerFileName.includes('optimization')) tags.push('optimization');
    if (lowerContent.includes('documentation') || lowerFileName.includes('documentation')) tags.push('documentation');
    if (lowerContent.includes('infrastructure') || lowerFileName.includes('infrastructure')) tags.push('infrastructure');
    if (lowerContent.includes('development') || lowerFileName.includes('development')) tags.push('development');
    
    return tags;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  generateTimelineAnalysis() {
    const totalMilestones = this.milestoneData.milestones.length;
    const completedMilestones = this.milestoneData.milestones.filter(m => m.status === 'completed').length;
    const criticalMilestones = this.milestoneData.milestones.filter(m => m.priority === 'critical').length;
    
    const categoryCounts = {};
    this.milestoneData.milestones.forEach(milestone => {
      categoryCounts[milestone.category] = (categoryCounts[milestone.category] || 0) + 1;
    });
    
    this.milestoneData.timelineAnalysis = {
      totalMilestones,
      completedMilestones,
      inProgressMilestones: 0,
      plannedMilestones: 0,
      completionRate: totalMilestones > 0 ? (completedMilestones / totalMilestones * 100) : 0,
      averageDurationVariance: 0,
      averageEffortVariance: 0,
      criticalMilestonesCompleted: criticalMilestones,
      categoryBreakdown: categoryCounts
    };
  }

  async saveMilestoneTimeline() {
    const outputPath = 'data/roadmap-actuals/retroactive-milestone-timeline.json';
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Save the comprehensive milestone timeline
    fs.writeFileSync(outputPath, JSON.stringify(this.milestoneData, null, 2));
    console.log(`💾 Saved retroactive milestone timeline to ${outputPath}`);
  }

  async generateSummaryReport() {
    const reportPath = 'docs/summaries/RETROACTIVE_MILESTONE_GATHERING_REPORT.md';
    
    // Ensure directory exists
    const dir = path.dirname(reportPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const report = this.generateReportContent();
    fs.writeFileSync(reportPath, report);
    console.log(`📊 Generated summary report at ${reportPath}`);
  }

  generateReportContent() {
    const totalMilestones = this.milestoneData.milestones.length;
    const completedMilestones = this.milestoneData.milestones.filter(m => m.status === 'completed').length;
    const criticalMilestones = this.milestoneData.milestones.filter(m => m.priority === 'critical').length;
    
    const categoryBreakdown = {};
    this.milestoneData.milestones.forEach(milestone => {
      categoryBreakdown[milestone.category] = (categoryBreakdown[milestone.category] || 0) + 1;
    });
    
    return `# 🏆 Retroactive Milestone Gathering Report
## Comprehensive Historical Achievement Documentation

**Generated**: ${new Date().toISOString()}
**Total Milestones Discovered**: ${totalMilestones}
**Completion Rate**: ${totalMilestones > 0 ? (completedMilestones / totalMilestones * 100).toFixed(1) : 0}%

---

## 📊 **MILESTONE DISCOVERY SUMMARY**

### **Overall Statistics**
- **Total Milestones**: ${totalMilestones}
- **Completed Milestones**: ${completedMilestones}
- **Critical Milestones**: ${criticalMilestones}
- **Completion Rate**: ${totalMilestones > 0 ? (completedMilestones / totalMilestones * 100).toFixed(1) : 0}%

### **Category Breakdown**
${Object.entries(categoryBreakdown).map(([category, count]) => `- **${category}**: ${count} milestones`).join('\n')}

---

## 🎯 **KEY DISCOVERIES**

### **Major Achievement Categories**
${Object.entries(categoryBreakdown)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 5)
  .map(([category, count]) => `1. **${category}** (${count} milestones)`)
  .join('\n')}

### **Notable Achievements**
${this.milestoneData.milestones
  .filter(m => m.priority === 'critical')
  .slice(0, 10)
  .map(m => `- ${m.title}`)
  .join('\n')}

---

## 📋 **MILESTONE DETAILS**

${this.milestoneData.milestones.map(milestone => `
### **${milestone.title}**
- **Category**: ${milestone.category}
- **Priority**: ${milestone.priority}
- **Status**: ${milestone.status}
- **Achievements**: ${milestone.achievements.length}
- **Deliverables**: ${milestone.deliverables.length}
- **Tags**: ${milestone.tags.join(', ')}
`).join('\n')}

---

## 🚀 **NEXT STEPS**

### **Immediate Actions**
1. **Review and Validate**: Review all discovered milestones for accuracy
2. **Enrich Data**: Add missing details like dates, metrics, and impact assessments
3. **Categorize**: Organize milestones into logical groups and phases
4. **Document**: Create comprehensive documentation for each milestone

### **Long-term Benefits**
- **Historical Context**: Complete understanding of project evolution
- **Achievement Tracking**: Comprehensive record of all accomplishments
- **Lessons Learned**: Repository of valuable insights and experiences
- **Future Planning**: Foundation for strategic planning and goal setting

---

## 📁 **FILES CREATED**

- **Retroactive Milestone Timeline**: \`data/roadmap-actuals/retroactive-milestone-timeline.json\`
- **Summary Report**: \`docs/summaries/RETROACTIVE_MILESTONE_GATHERING_REPORT.md\`

---

**Generated by**: Retroactive Milestone Gatherer v1.0.0
**Analysis Date**: ${new Date().toISOString()}
`;
  }
}

// Main execution
async function main() {
  const gatherer = new RetroactiveMilestoneGatherer();
  await gatherer.gatherAllMilestones();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = RetroactiveMilestoneGatherer; 
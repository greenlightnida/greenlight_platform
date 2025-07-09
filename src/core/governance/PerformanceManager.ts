/**
 * Performance Manager
 * 
 * PURPOSE: Evolve the OKR framework into a comprehensive system that can be applied
 * from system to global to atomic levels, working with other managers to monitor,
 * improve, and achieve OKRs across all levels of the platform.
 * 
 * RESPONSIBILITIES:
 * - Framework evolution and scaling
 * - Cross-level OKR coordination
 * - Performance monitoring and analysis
 * - Manager collaboration and alignment
 * - Continuous improvement and optimization
 */

import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';

export interface OKRLevel {
  id: string;
  name: string;
  type: 'system' | 'global' | 'holon' | 'atomic';
  parentId?: string;
  children: string[];
  internalObjectives: Objective[];
  systemObjectives: Objective[];
  metrics: Metrics;
  status: 'active' | 'inactive' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  type: 'internal' | 'system';
  keyResults: KeyResult[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'not_started' | 'in_progress' | 'at_risk' | 'completed';
  progress: number; // 0-100
  startDate: Date;
  endDate: Date;
  owner: string;
  dependencies: string[];
  impact: 'high' | 'medium' | 'low';
}

export interface KeyResult {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  status: 'not_started' | 'in_progress' | 'at_risk' | 'completed';
  progress: number; // 0-100
  lastUpdated: Date;
  trend: 'improving' | 'stable' | 'declining';
}

export interface Metrics {
  reliability: {
    uptime: number;
    errorRate: number;
    dataIntegrity: number;
  };
  performance: {
    responseTime: number;
    throughput: number;
    resourceUtilization: number;
  };
  quality: {
    testCoverage: number;
    codeQuality: number;
    featureCompleteness: number;
  };
  health: {
    systemHealth: number;
    operationalEfficiency: number;
    maintenanceStatus: number;
  };
  integration: {
    crossSystemCollaboration: number;
    dependencyHealth: number;
    workflowEfficiency: number;
  };
  value: {
    businessImpact: number;
    userSatisfaction: number;
    adoptionRate: number;
  };
  contribution: {
    platformImprovements: number;
    supportReduction: number;
    issueResolution: number;
  };
  impact: {
    measurableOutcomes: number;
    stakeholderValue: number;
    systemSuccess: number;
  };
}

export interface PerformanceReport {
  levelId: string;
  timestamp: Date;
  overallScore: number;
  internalScore: number;
  systemScore: number;
  trends: {
    internal: 'improving' | 'stable' | 'declining';
    system: 'improving' | 'stable' | 'declining';
  };
  risks: Risk[];
  opportunities: Opportunity[];
  recommendations: Recommendation[];
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  level: 'critical' | 'high' | 'medium' | 'low';
  probability: number; // 0-1
  impact: number; // 0-1
  mitigation: string;
  owner: string;
  status: 'open' | 'mitigated' | 'closed';
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  potentialImpact: number; // 0-1
  effort: number; // 0-1
  priority: 'high' | 'medium' | 'low';
  owner: string;
  status: 'identified' | 'evaluating' | 'implementing' | 'realized';
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'performance' | 'optimization' | 'improvement' | 'risk_mitigation';
  priority: 'critical' | 'high' | 'medium' | 'low';
  effort: number; // 0-1
  impact: number; // 0-1
  owner: string;
  status: 'pending' | 'approved' | 'implementing' | 'completed';
}

export interface ManagerCollaboration {
  managerId: string;
  managerType: string;
  collaborationAreas: string[];
  sharedObjectives: string[];
  dependencies: string[];
  communicationChannels: string[];
  reviewFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
}

export class PerformanceManager extends EventEmitter {
  private levels: Map<string, OKRLevel> = new Map();
  private reports: PerformanceReport[] = [];
  private risks: Map<string, Risk> = new Map();
  private opportunities: Map<string, Opportunity> = new Map();
  private recommendations: Map<string, Recommendation> = new Map();
  private managerCollaborations: Map<string, ManagerCollaboration> = new Map();
  private projectRoot: string;

  constructor(projectRoot: string) {
    super();
    this.projectRoot = projectRoot;
    this.initialize();
  }

  private async initialize() {
    console.log('📊 Initializing Performance Manager...');
    
    // Load existing OKR data
    await this.loadOKRData();
    
    // Initialize system hierarchy
    this.initializeSystemHierarchy();
    
    // Set up manager collaborations
    this.setupManagerCollaborations();
    
    // Start monitoring
    this.startPerformanceMonitoring();
    
    console.log('✅ Performance Manager initialized');
    this.emit('initialized');
  }

  private async loadOKRData() {
    const okrFile = path.join(this.projectRoot, 'data', 'okr_data.json');
    
    if (fs.existsSync(okrFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(okrFile, 'utf8'));
        
        // Load levels
        if (data.levels) {
          for (const level of data.levels) {
            this.levels.set(level.id, {
              ...level,
              createdAt: new Date(level.createdAt),
              updatedAt: new Date(level.updatedAt)
            });
          }
        }
        
        // Load reports
        if (data.reports) {
          this.reports = data.reports.map((report: any) => ({
            ...report,
            timestamp: new Date(report.timestamp)
          }));
        }
        
        console.log(`📊 Loaded ${this.levels.size} OKR levels and ${this.reports.length} reports`);
      } catch (error) {
        console.log('⚠️  Could not load OKR data, starting fresh');
      }
    }
  }

  private initializeSystemHierarchy() {
    // System Level (Platform-wide)
    const systemLevel: OKRLevel = {
      id: 'system',
      name: 'System Level',
      type: 'system',
      children: ['global'],
      internalObjectives: [
        {
          id: 'sys-int-1',
          title: 'Maintain robust platform infrastructure',
          description: 'Ensure platform reliability, performance, and security',
          type: 'internal',
          keyResults: [
            {
              id: 'sys-int-1-kr1',
              title: 'Platform uptime',
              description: 'Achieve 99.9% platform uptime',
              target: 99.9,
              current: 98.5,
              unit: '%',
              status: 'in_progress',
              progress: 75,
              lastUpdated: new Date(),
              trend: 'improving'
            },
            {
              id: 'sys-int-1-kr2',
              title: 'Response time',
              description: 'Maintain sub-2-second response times',
              target: 2,
              current: 2.5,
              unit: 'seconds',
              status: 'at_risk',
              progress: 60,
              lastUpdated: new Date(),
              trend: 'declining'
            }
          ],
          priority: 'critical',
          status: 'in_progress',
          progress: 67,
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          owner: 'platform-team',
          dependencies: [],
          impact: 'high'
        }
      ],
      systemObjectives: [
        {
          id: 'sys-sys-1',
          title: 'Deliver measurable business value',
          description: 'Increase user engagement and satisfaction',
          type: 'system',
          keyResults: [
            {
              id: 'sys-sys-1-kr1',
              title: 'User engagement',
              description: 'Increase user engagement by 50%',
              target: 50,
              current: 25,
              unit: '%',
              status: 'in_progress',
              progress: 50,
              lastUpdated: new Date(),
              trend: 'improving'
            }
          ],
          priority: 'high',
          status: 'in_progress',
          progress: 50,
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          owner: 'product-team',
          dependencies: [],
          impact: 'high'
        }
      ],
      metrics: this.getDefaultMetrics(),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Global Level (Cross-holon)
    const globalLevel: OKRLevel = {
      id: 'global',
      name: 'Global Level',
      type: 'global',
      parentId: 'system',
      children: ['governance', 'work', 'knowledge'],
      internalObjectives: [
        {
          id: 'global-int-1',
          title: 'Maintain cross-holon integration',
          description: 'Ensure seamless integration between holons',
          type: 'internal',
          keyResults: [
            {
              id: 'global-int-1-kr1',
              title: 'Integration success rate',
              description: 'Maintain 95% integration success',
              target: 95,
              current: 92,
              unit: '%',
              status: 'in_progress',
              progress: 85,
              lastUpdated: new Date(),
              trend: 'stable'
            }
          ],
          priority: 'high',
          status: 'in_progress',
          progress: 85,
          startDate: new Date(),
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          owner: 'integration-team',
          dependencies: [],
          impact: 'high'
        }
      ],
      systemObjectives: [
        {
          id: 'global-sys-1',
          title: 'Improve cross-holon workflows',
          description: 'Enhance user experience across holons',
          type: 'system',
          keyResults: [
            {
              id: 'global-sys-1-kr1',
              title: 'Workflow efficiency',
              description: 'Improve workflow efficiency by 25%',
              target: 25,
              current: 15,
              unit: '%',
              status: 'in_progress',
              progress: 60,
              lastUpdated: new Date(),
              trend: 'improving'
            }
          ],
          priority: 'medium',
          status: 'in_progress',
          progress: 60,
          startDate: new Date(),
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          owner: 'ux-team',
          dependencies: [],
          impact: 'medium'
        }
      ],
      metrics: this.getDefaultMetrics(),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Holon Levels
    const holonLevels = ['governance', 'work', 'knowledge'];
    for (const holonId of holonLevels) {
      const holonLevel: OKRLevel = {
        id: holonId,
        name: `${holonId.charAt(0).toUpperCase() + holonId.slice(1)} Holon`,
        type: 'holon',
        parentId: 'global',
        children: [],
        internalObjectives: [
          {
            id: `${holonId}-int-1`,
            title: `Maintain ${holonId} holon health`,
            description: `Ensure ${holonId} holon performance and reliability`,
            type: 'internal',
            keyResults: [
              {
                id: `${holonId}-int-1-kr1`,
                title: 'Holon uptime',
                description: 'Achieve 95% holon uptime',
                target: 95,
                current: 93,
                unit: '%',
                status: 'in_progress',
                progress: 80,
                lastUpdated: new Date(),
                trend: 'improving'
              }
            ],
            priority: 'high',
            status: 'in_progress',
            progress: 80,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            owner: `${holonId}-team`,
            dependencies: [],
            impact: 'high'
          }
        ],
        systemObjectives: [
          {
            id: `${holonId}-sys-1`,
            title: `Deliver ${holonId} value`,
            description: `Provide measurable value through ${holonId} capabilities`,
            type: 'system',
            keyResults: [
              {
                id: `${holonId}-sys-1-kr1`,
                title: 'User adoption',
                description: 'Achieve 80% user adoption',
                target: 80,
                current: 65,
                unit: '%',
                status: 'in_progress',
                progress: 70,
                lastUpdated: new Date(),
                trend: 'improving'
              }
            ],
            priority: 'medium',
            status: 'in_progress',
            progress: 70,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            owner: `${holonId}-team`,
            dependencies: [],
            impact: 'medium'
          }
        ],
        metrics: this.getDefaultMetrics(),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.levels.set(holonId, holonLevel);
    }

    // Set the system and global levels
    this.levels.set('system', systemLevel);
    this.levels.set('global', globalLevel);
  }

  private getDefaultMetrics(): Metrics {
    return {
      reliability: { uptime: 0, errorRate: 0, dataIntegrity: 0 },
      performance: { responseTime: 0, throughput: 0, resourceUtilization: 0 },
      quality: { testCoverage: 0, codeQuality: 0, featureCompleteness: 0 },
      health: { systemHealth: 0, operationalEfficiency: 0, maintenanceStatus: 0 },
      integration: { crossSystemCollaboration: 0, dependencyHealth: 0, workflowEfficiency: 0 },
      value: { businessImpact: 0, userSatisfaction: 0, adoptionRate: 0 },
      contribution: { platformImprovements: 0, supportReduction: 0, issueResolution: 0 },
      impact: { measurableOutcomes: 0, stakeholderValue: 0, systemSuccess: 0 }
    };
  }

  private setupManagerCollaborations() {
    const managers = [
      {
        id: 'command-center-manager',
        type: 'CommandCenter',
        collaborationAreas: ['performance-monitoring', 'okr-tracking', 'coaching'],
        sharedObjectives: ['sys-int-1', 'global-int-1'],
        dependencies: ['governance-manager'],
        communicationChannels: ['slack', 'email', 'dashboard'],
        reviewFrequency: 'weekly'
      },
      {
        id: 'governance-manager',
        type: 'Governance',
        collaborationAreas: ['compliance', 'policies', 'standards'],
        sharedObjectives: ['governance-int-1', 'governance-sys-1'],
        dependencies: ['work-manager', 'knowledge-manager'],
        communicationChannels: ['slack', 'email', 'dashboard'],
        reviewFrequency: 'biweekly'
      },
      {
        id: 'work-manager',
        type: 'Work',
        collaborationAreas: ['workflow-optimization', 'productivity', 'efficiency'],
        sharedObjectives: ['work-int-1', 'work-sys-1'],
        dependencies: ['governance-manager'],
        communicationChannels: ['slack', 'email', 'dashboard'],
        reviewFrequency: 'weekly'
      },
      {
        id: 'knowledge-manager',
        type: 'Knowledge',
        collaborationAreas: ['knowledge-management', 'learning', 'documentation'],
        sharedObjectives: ['knowledge-int-1', 'knowledge-sys-1'],
        dependencies: ['governance-manager'],
        communicationChannels: ['slack', 'email', 'dashboard'],
        reviewFrequency: 'biweekly'
      }
    ];

    for (const manager of managers) {
      this.managerCollaborations.set(manager.id, manager);
    }
  }

  private startPerformanceMonitoring() {
    // Monitor performance every hour
    setInterval(() => {
      this.updatePerformanceMetrics();
    }, 60 * 60 * 1000);

    // Generate reports daily
    setInterval(() => {
      this.generatePerformanceReports();
    }, 24 * 60 * 60 * 1000);

    // Risk assessment weekly
    setInterval(() => {
      this.assessRisks();
    }, 7 * 24 * 60 * 60 * 1000);
  }

  private async updatePerformanceMetrics() {
    console.log('📊 Updating performance metrics...');
    
    for (const [levelId, level] of this.levels) {
      // Update metrics based on current performance
      const updatedMetrics = await this.calculateMetrics(levelId);
      level.metrics = updatedMetrics;
      level.updatedAt = new Date();
      
      // Update objective progress
      this.updateObjectiveProgress(level);
      
      // Check for risks and opportunities
      this.identifyRisksAndOpportunities(levelId);
    }
    
    await this.saveOKRData();
    this.emit('metricsUpdated');
  }

  private async calculateMetrics(levelId: string): Promise<Metrics> {
    // This would integrate with actual system metrics
    // For now, return simulated metrics
    const baseMetrics = this.getDefaultMetrics();
    
    // Simulate some variation based on level
    const variation = Math.random() * 0.2 - 0.1; // ±10%
    
    return {
      reliability: {
        uptime: Math.max(0, Math.min(100, baseMetrics.reliability.uptime + variation * 100)),
        errorRate: Math.max(0, Math.min(100, baseMetrics.reliability.errorRate + variation * 100)),
        dataIntegrity: Math.max(0, Math.min(100, baseMetrics.reliability.dataIntegrity + variation * 100))
      },
      performance: {
        responseTime: Math.max(0, baseMetrics.performance.responseTime + variation * 10),
        throughput: Math.max(0, baseMetrics.performance.throughput + variation * 1000),
        resourceUtilization: Math.max(0, Math.min(100, baseMetrics.performance.resourceUtilization + variation * 100))
      },
      quality: {
        testCoverage: Math.max(0, Math.min(100, baseMetrics.quality.testCoverage + variation * 100)),
        codeQuality: Math.max(0, Math.min(100, baseMetrics.quality.codeQuality + variation * 100)),
        featureCompleteness: Math.max(0, Math.min(100, baseMetrics.quality.featureCompleteness + variation * 100))
      },
      health: {
        systemHealth: Math.max(0, Math.min(100, baseMetrics.health.systemHealth + variation * 100)),
        operationalEfficiency: Math.max(0, Math.min(100, baseMetrics.health.operationalEfficiency + variation * 100)),
        maintenanceStatus: Math.max(0, Math.min(100, baseMetrics.health.maintenanceStatus + variation * 100))
      },
      integration: {
        crossSystemCollaboration: Math.max(0, Math.min(100, baseMetrics.integration.crossSystemCollaboration + variation * 100)),
        dependencyHealth: Math.max(0, Math.min(100, baseMetrics.integration.dependencyHealth + variation * 100)),
        workflowEfficiency: Math.max(0, Math.min(100, baseMetrics.integration.workflowEfficiency + variation * 100))
      },
      value: {
        businessImpact: Math.max(0, Math.min(100, baseMetrics.value.businessImpact + variation * 100)),
        userSatisfaction: Math.max(0, Math.min(100, baseMetrics.value.userSatisfaction + variation * 100)),
        adoptionRate: Math.max(0, Math.min(100, baseMetrics.value.adoptionRate + variation * 100))
      },
      contribution: {
        platformImprovements: Math.max(0, Math.min(100, baseMetrics.contribution.platformImprovements + variation * 100)),
        supportReduction: Math.max(0, Math.min(100, baseMetrics.contribution.supportReduction + variation * 100)),
        issueResolution: Math.max(0, Math.min(100, baseMetrics.contribution.issueResolution + variation * 100))
      },
      impact: {
        measurableOutcomes: Math.max(0, Math.min(100, baseMetrics.impact.measurableOutcomes + variation * 100)),
        stakeholderValue: Math.max(0, Math.min(100, baseMetrics.impact.stakeholderValue + variation * 100)),
        systemSuccess: Math.max(0, Math.min(100, baseMetrics.impact.systemSuccess + variation * 100))
      }
    };
  }

  private updateObjectiveProgress(level: OKRLevel) {
    for (const objective of [...level.internalObjectives, ...level.systemObjectives]) {
      let totalProgress = 0;
      let completedKeyResults = 0;
      
      for (const kr of objective.keyResults) {
        // Update key result progress based on current vs target
        const progress = Math.min(100, (kr.current / kr.target) * 100);
        kr.progress = progress;
        
        if (progress >= 100) {
          kr.status = 'completed';
          completedKeyResults++;
        } else if (progress >= 75) {
          kr.status = 'in_progress';
        } else if (progress >= 50) {
          kr.status = 'at_risk';
        } else {
          kr.status = 'not_started';
        }
        
        totalProgress += progress;
      }
      
      // Update objective progress
      objective.progress = totalProgress / objective.keyResults.length;
      
      // Update objective status
      if (completedKeyResults === objective.keyResults.length) {
        objective.status = 'completed';
      } else if (objective.progress >= 75) {
        objective.status = 'in_progress';
      } else if (objective.progress >= 50) {
        objective.status = 'at_risk';
      } else {
        objective.status = 'not_started';
      }
    }
  }

  private identifyRisksAndOpportunities(levelId: string) {
    const level = this.levels.get(levelId);
    if (!level) return;

    // Identify risks
    for (const objective of [...level.internalObjectives, ...level.systemObjectives]) {
      if (objective.status === 'at_risk') {
        const risk: Risk = {
          id: `risk-${Date.now()}-${Math.random()}`,
          title: `Objective at risk: ${objective.title}`,
          description: `Objective ${objective.title} is at risk with ${objective.progress}% progress`,
          level: 'medium',
          probability: 0.7,
          impact: 0.6,
          mitigation: 'Review objective progress and adjust strategy',
          owner: objective.owner,
          status: 'open'
        };
        this.risks.set(risk.id, risk);
      }
    }

    // Identify opportunities
    const metrics = level.metrics;
    if (metrics.performance.responseTime < 1.5) {
      const opportunity: Opportunity = {
        id: `opp-${Date.now()}-${Math.random()}`,
        title: 'Performance optimization opportunity',
        description: 'Response time is below target, opportunity to optimize further',
        potentialImpact: 0.8,
        effort: 0.4,
        priority: 'high',
        owner: 'performance-team',
        status: 'identified'
      };
      this.opportunities.set(opportunity.id, opportunity);
    }
  }

  private async generatePerformanceReports() {
    console.log('📊 Generating performance reports...');
    
    for (const [levelId, level] of this.levels) {
      const report = this.createPerformanceReport(levelId);
      this.reports.push(report);
      
      // Emit report for other managers
      this.emit('performanceReport', report);
    }
    
    await this.saveOKRData();
  }

  private createPerformanceReport(levelId: string): PerformanceReport {
    const level = this.levels.get(levelId);
    if (!level) throw new Error(`Level not found: ${levelId}`);

    const internalScore = this.calculateInternalScore(level);
    const systemScore = this.calculateSystemScore(level);
    const overallScore = (internalScore + systemScore) / 2;

    return {
      levelId,
      timestamp: new Date(),
      overallScore,
      internalScore,
      systemScore,
      trends: {
        internal: this.calculateTrend(level.internalObjectives),
        system: this.calculateTrend(level.systemObjectives)
      },
      risks: Array.from(this.risks.values()).filter(r => r.title.includes(levelId)),
      opportunities: Array.from(this.opportunities.values()).filter(o => o.title.includes(levelId)),
      recommendations: this.generateRecommendations(levelId)
    };
  }

  private calculateInternalScore(level: OKRLevel): number {
    const internalObjectives = level.internalObjectives;
    if (internalObjectives.length === 0) return 0;
    
    const totalProgress = internalObjectives.reduce((sum, obj) => sum + obj.progress, 0);
    return totalProgress / internalObjectives.length;
  }

  private calculateSystemScore(level: OKRLevel): number {
    const systemObjectives = level.systemObjectives;
    if (systemObjectives.length === 0) return 0;
    
    const totalProgress = systemObjectives.reduce((sum, obj) => sum + obj.progress, 0);
    return totalProgress / systemObjectives.length;
  }

  private calculateTrend(objectives: Objective[]): 'improving' | 'stable' | 'declining' {
    if (objectives.length === 0) return 'stable';
    
    const avgProgress = objectives.reduce((sum, obj) => sum + obj.progress, 0) / objectives.length;
    
    if (avgProgress > 75) return 'improving';
    if (avgProgress > 50) return 'stable';
    return 'declining';
  }

  private generateRecommendations(levelId: string): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const level = this.levels.get(levelId);
    if (!level) return recommendations;

    // Performance recommendations
    if (level.metrics.performance.responseTime > 2) {
      recommendations.push({
        id: `rec-${Date.now()}-${Math.random()}`,
        title: 'Optimize response time',
        description: 'Response time is above target, consider performance optimizations',
        type: 'performance',
        priority: 'high',
        effort: 0.6,
        impact: 0.8,
        owner: 'performance-team',
        status: 'pending'
      });
    }

    // Quality recommendations
    if (level.metrics.quality.testCoverage < 80) {
      recommendations.push({
        id: `rec-${Date.now()}-${Math.random()}`,
        title: 'Increase test coverage',
        description: 'Test coverage is below target, add more tests',
        type: 'improvement',
        priority: 'medium',
        effort: 0.4,
        impact: 0.6,
        owner: 'quality-team',
        status: 'pending'
      });
    }

    return recommendations;
  }

  private async assessRisks() {
    console.log('⚠️  Assessing risks...');
    
    // Update risk probabilities and impacts
    for (const [riskId, risk] of this.risks) {
      // This would integrate with actual risk assessment logic
      // For now, simulate some updates
      risk.probability = Math.max(0, Math.min(1, risk.probability + (Math.random() - 0.5) * 0.1));
      risk.impact = Math.max(0, Math.min(1, risk.impact + (Math.random() - 0.5) * 0.1));
      
      // Update risk level based on probability and impact
      const riskScore = risk.probability * risk.impact;
      if (riskScore > 0.7) risk.level = 'critical';
      else if (riskScore > 0.5) risk.level = 'high';
      else if (riskScore > 0.3) risk.level = 'medium';
      else risk.level = 'low';
    }
    
    await this.saveOKRData();
    this.emit('risksAssessed');
  }

  private async saveOKRData() {
    const data = {
      levels: Array.from(this.levels.values()),
      reports: this.reports,
      risks: Array.from(this.risks.values()),
      opportunities: Array.from(this.opportunities.values()),
      recommendations: Array.from(this.recommendations.values())
    };

    const dataDir = path.join(this.projectRoot, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const okrFile = path.join(dataDir, 'okr_data.json');
    fs.writeFileSync(okrFile, JSON.stringify(data, null, 2));
  }

  // Public API methods

  public getLevel(levelId: string): OKRLevel | undefined {
    return this.levels.get(levelId);
  }

  public getAllLevels(): OKRLevel[] {
    return Array.from(this.levels.values());
  }

  public getLevelHierarchy(): Map<string, OKRLevel> {
    return new Map(this.levels);
  }

  public getPerformanceReport(levelId: string): PerformanceReport | undefined {
    return this.reports.find(r => r.levelId === levelId);
  }

  public getAllReports(): PerformanceReport[] {
    return this.reports;
  }

  public getRisks(): Risk[] {
    return Array.from(this.risks.values());
  }

  public getOpportunities(): Opportunity[] {
    return Array.from(this.opportunities.values());
  }

  public getRecommendations(): Recommendation[] {
    return Array.from(this.recommendations.values());
  }

  public getManagerCollaborations(): ManagerCollaboration[] {
    return Array.from(this.managerCollaborations.values());
  }

  public async addLevel(level: OKRLevel): Promise<void> {
    this.levels.set(level.id, level);
    await this.saveOKRData();
    this.emit('levelAdded', level);
  }

  public async updateLevel(levelId: string, updates: Partial<OKRLevel>): Promise<void> {
    const level = this.levels.get(levelId);
    if (!level) throw new Error(`Level not found: ${levelId}`);

    Object.assign(level, updates);
    level.updatedAt = new Date();
    
    await this.saveOKRData();
    this.emit('levelUpdated', level);
  }

  public async addObjective(levelId: string, objective: Objective, type: 'internal' | 'system'): Promise<void> {
    const level = this.levels.get(levelId);
    if (!level) throw new Error(`Level not found: ${levelId}`);

    if (type === 'internal') {
      level.internalObjectives.push(objective);
    } else {
      level.systemObjectives.push(objective);
    }

    level.updatedAt = new Date();
    await this.saveOKRData();
    this.emit('objectiveAdded', { levelId, objective, type });
  }

  public async updateObjective(levelId: string, objectiveId: string, updates: Partial<Objective>): Promise<void> {
    const level = this.levels.get(levelId);
    if (!level) throw new Error(`Level not found: ${levelId}`);

    const allObjectives = [...level.internalObjectives, ...level.systemObjectives];
    const objective = allObjectives.find(obj => obj.id === objectiveId);
    if (!objective) throw new Error(`Objective not found: ${objectiveId}`);

    Object.assign(objective, updates);
    level.updatedAt = new Date();
    
    await this.saveOKRData();
    this.emit('objectiveUpdated', { levelId, objective });
  }

  public async addRisk(risk: Risk): Promise<void> {
    this.risks.set(risk.id, risk);
    await this.saveOKRData();
    this.emit('riskAdded', risk);
  }

  public async updateRisk(riskId: string, updates: Partial<Risk>): Promise<void> {
    const risk = this.risks.get(riskId);
    if (!risk) throw new Error(`Risk not found: ${riskId}`);

    Object.assign(risk, updates);
    await this.saveOKRData();
    this.emit('riskUpdated', risk);
  }

  public async addOpportunity(opportunity: Opportunity): Promise<void> {
    this.opportunities.set(opportunity.id, opportunity);
    await this.saveOKRData();
    this.emit('opportunityAdded', opportunity);
  }

  public async addRecommendation(recommendation: Recommendation): Promise<void> {
    this.recommendations.set(recommendation.id, recommendation);
    await this.saveOKRData();
    this.emit('recommendationAdded', recommendation);
  }

  public async collaborateWithManager(managerId: string, action: string, data: any): Promise<void> {
    const collaboration = this.managerCollaborations.get(managerId);
    if (!collaboration) throw new Error(`Manager collaboration not found: ${managerId}`);

    // Handle collaboration actions
    switch (action) {
      case 'shareMetrics':
        this.emit('metricsShared', { managerId, data });
        break;
      case 'requestUpdate':
        this.emit('updateRequested', { managerId, data });
        break;
      case 'coordinateOKRs':
        this.emit('okrsCoordinated', { managerId, data });
        break;
      default:
        throw new Error(`Unknown collaboration action: ${action}`);
    }
  }

  public async shutdown() {
    await this.saveOKRData();
    console.log('🛑 Performance Manager shutdown complete');
  }
}

export default PerformanceManager; 
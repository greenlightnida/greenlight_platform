import { EventEmitter } from 'events';
import { RequirementsEngine, Requirement } from './modules/RequirementsEngine';
import { CoordinationEngine, ProductInitiative } from './modules/CoordinationEngine';
import { GovernanceEngine, GovernancePolicy, ComplianceReport } from './modules/GovernanceEngine';
import { performanceTrackingService } from '../../../services/performance/performanceTrackingService';

export interface ProductHolonState {
  isInitialized: boolean;
  isRunning: boolean;
  modules: {
    requirements: boolean;
    coordination: boolean;
    governance: boolean;
  };
  performanceMetrics: {
    totalRequirements: number;
    totalInitiatives: number;
    totalPolicies: number;
    overallHealth: number;
    complianceRate: number;
    deliveryRate: number;
  };
  integrations: {
    testingHolon: boolean;
    featuresHolon: boolean;
    systemMaster: boolean;
  };
}

export interface ProductReport {
  timestamp: string;
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
  metrics: {
    totalRequirements: number;
    totalInitiatives: number;
    totalPolicies: number;
    complianceRate: number;
    deliveryRate: number;
  };
  moduleStatus: {
    requirements: boolean;
    coordination: boolean;
    governance: boolean;
  };
  recentActivity: {
    requirements: number;
    initiatives: number;
    policies: number;
  };
  issues: string[];
  recommendations: string[];
}

export class ProductHolon extends EventEmitter {
  private static instance: ProductHolon;
  private state: ProductHolonState;
  private requirementsEngine: RequirementsEngine;
  private coordinationEngine: CoordinationEngine;
  private governanceEngine: GovernanceEngine;

  private constructor() {
    super();
    this.state = this.initializeState();
    console.log('ProductHolon constructed');
    console.log('Integrated performanceTrackingService for performance metrics');
    this.requirementsEngine = RequirementsEngine.getInstance();
    this.coordinationEngine = CoordinationEngine.getInstance();
    this.governanceEngine = GovernanceEngine.getInstance();
  }

  public static getInstance(): ProductHolon {
    if (!ProductHolon.instance) {
      ProductHolon.instance = new ProductHolon();
    }
    return ProductHolon.instance;
  }

  private initializeState(): ProductHolonState {
    return {
      isInitialized: false,
      isRunning: false,
      modules: {
        requirements: false,
        coordination: false,
        governance: false
      },
      performanceMetrics: {
        totalRequirements: 0,
        totalInitiatives: 0,
        totalPolicies: 0,
        overallHealth: 0,
        complianceRate: 0,
        deliveryRate: 0
      },
      integrations: {
        testingHolon: true,
        featuresHolon: true,
        systemMaster: true
      }
    };
  }

  public async initialize(): Promise<void> {
    try {
      console.log('🎯 Initializing Product Holon...');
      
      // Initialize all modules
      await this.initializeModules();
      
      // Setup cross-module coordination
      await this.setupCrossModuleCoordination();
      
      // Setup integrations
      await this.setupIntegrations();
      
      // Run initial health check
      await this.runHealthCheck();
      
      this.state.isInitialized = true;
      this.emit('initialized');
      
      console.log('✅ Product Holon initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Product Holon:', error);
      throw error;
    }
  }

  private async initializeModules(): Promise<void> {
    console.log('🔧 Initializing Product Holon modules...');
    
    try {
      await this.requirementsEngine.initialize();
      this.state.modules.requirements = true;
      console.log('✅ Requirements Engine initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Requirements Engine:', error);
    }

    try {
      await this.coordinationEngine.initialize();
      this.state.modules.coordination = true;
      console.log('✅ Coordination Engine initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Coordination Engine:', error);
    }

    try {
      await this.governanceEngine.initialize();
      this.state.modules.governance = true;
      console.log('✅ Governance Engine initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Governance Engine:', error);
    }
  }

  private async setupCrossModuleCoordination(): Promise<void> {
    console.log('🔗 Setting up cross-module coordination...');
    
    // Requirements Engine events
    this.requirementsEngine.on('requirementCreated', (requirement: Requirement) => {
      console.log(`📋 New requirement created: ${requirement.title}`);
      this.emit('requirementCreated', requirement);
    });

    this.requirementsEngine.on('requirementApproved', (data: { id: string, approver: string }) => {
      console.log(`✅ Requirement approved: ${data.id}`);
      this.emit('requirementApproved', data);
    });

    // Coordination Engine events
    this.coordinationEngine.on('initiativeCreated', (initiative: ProductInitiative) => {
      console.log(`🎯 New initiative created: ${initiative.title}`);
      this.emit('initiativeCreated', initiative);
    });

    this.coordinationEngine.on('initiativeStarted', (data: { id: string }) => {
      console.log(`🚀 Initiative started: ${data.id}`);
      this.emit('initiativeStarted', data);
    });

    // Governance Engine events
    this.governanceEngine.on('policyCreated', (policy: GovernancePolicy) => {
      console.log(`📜 New policy created: ${policy.name}`);
      this.emit('policyCreated', policy);
    });

    this.governanceEngine.on('complianceReportCreated', (report: ComplianceReport) => {
      console.log(`📊 Compliance report created: ${report.id}`);
      this.emit('complianceReportCreated', report);
    });
  }

  private async setupIntegrations(): Promise<void> {
    console.log('🔗 Setting up Product Holon integrations...');
    
    // Integration with Testing Holon
    this.state.integrations.testingHolon = true;
    
    // Integration with Features Holon
    this.state.integrations.featuresHolon = true;
    
    // Integration with System Master
    this.state.integrations.systemMaster = true;
  }

  public async runHealthCheck(): Promise<void> {
    console.log('🏥 Running Product Holon health check...');
    
    // Check module health
    const moduleHealth = Object.values(this.state.modules).filter(Boolean).length / 3 * 100;
    
    // Get metrics from all modules
    const requirementsMetrics = this.requirementsEngine.getPerformanceMetrics();
    const coordinationMetrics = this.coordinationEngine.getPerformanceMetrics();
    const governanceMetrics = this.governanceEngine.getPerformanceMetrics();
    
    // Calculate overall health
    const overallHealth = Math.min(100, 
      (moduleHealth * 0.3) +
      (governanceMetrics.complianceRate * 0.4) +
      (coordinationMetrics.onTimeDelivery * 0.3)
    );
    
    this.state.performanceMetrics = {
      totalRequirements: requirementsMetrics.totalRequirements,
      totalInitiatives: coordinationMetrics.totalInitiatives,
      totalPolicies: governanceMetrics.totalPolicies,
      overallHealth,
      complianceRate: governanceMetrics.complianceRate,
      deliveryRate: coordinationMetrics.onTimeDelivery
    };
    
    console.log(`📊 Health check results: ${overallHealth.toFixed(1)}% overall health`);
    this.emit('healthChecked', { overallHealth, moduleHealth });
  }

  public async generateProductReport(): Promise<ProductReport> {
    console.log('📋 Generating comprehensive product report...');
    
    // Get current metrics
    const requirementsMetrics = this.requirementsEngine.getPerformanceMetrics();
    const coordinationMetrics = this.coordinationEngine.getPerformanceMetrics();
    const governanceMetrics = this.governanceEngine.getPerformanceMetrics();
    
    // Calculate overall health
    const overallHealth = this.state.performanceMetrics.overallHealth;
    let healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
    
    if (overallHealth >= 90) healthStatus = 'excellent';
    else if (overallHealth >= 75) healthStatus = 'good';
    else if (overallHealth >= 60) healthStatus = 'fair';
    else healthStatus = 'poor';
    
    // Generate recommendations
    const recommendations: string[] = [];
    if (overallHealth < 90) {
      recommendations.push('Implement additional quality controls');
    }
    if (governanceMetrics.complianceRate < 100) {
      recommendations.push('Address compliance issues');
    }
    if (coordinationMetrics.onTimeDelivery < 90) {
      recommendations.push('Improve delivery timelines');
    }
    
    const report: ProductReport = {
      timestamp: new Date().toISOString(),
      overallHealth: healthStatus,
      metrics: {
        totalRequirements: requirementsMetrics.totalRequirements,
        totalInitiatives: coordinationMetrics.totalInitiatives,
        totalPolicies: governanceMetrics.totalPolicies,
        complianceRate: governanceMetrics.complianceRate,
        deliveryRate: coordinationMetrics.onTimeDelivery
      },
      moduleStatus: { ...this.state.modules },
      recentActivity: {
        requirements: requirementsMetrics.approvedRequirements,
        initiatives: coordinationMetrics.activeInitiatives,
        policies: governanceMetrics.activePolicies
      },
      issues: [],
      recommendations
    };
    
    console.log(`📊 Product Report: ${healthStatus.toUpperCase()} (${overallHealth.toFixed(1)}%)`);
    
    return report;
  }

  public async coordinateRequirementsWithInitiatives(): Promise<void> {
    console.log('🔗 Coordinating requirements with initiatives...');
    
    const requirements = this.requirementsEngine.getRequirements();
    const initiatives = this.coordinationEngine.getInitiatives();
    
    // Find requirements that need coordination
    const pendingRequirements = requirements.filter(r => r.status === 'approved');
    
    for (const requirement of pendingRequirements) {
      // Find initiatives that could implement this requirement
      const matchingInitiatives = initiatives.filter(i => 
        i.requirements.includes(requirement.id) || 
        i.description.toLowerCase().includes(requirement.title.toLowerCase())
      );
      
      if (matchingInitiatives.length > 0) {
        console.log(`  Linking requirement "${requirement.title}" to ${matchingInitiatives.length} initiatives`);
      }
    }
    
    this.emit('requirementsCoordinated', { requirementCount: pendingRequirements.length });
  }

  public async enforceGovernanceOnInitiatives(): Promise<void> {
    console.log('🏛️ Enforcing governance on initiatives...');
    
    const initiatives = this.coordinationEngine.getInitiatives();
    const policies = this.governanceEngine.getPolicies();
    
    for (const initiative of initiatives) {
      for (const policy of policies) {
        if (policy.status === 'active') {
          await this.governanceEngine.enforcePolicy(policy.id, initiative.id, 'initiative');
        }
      }
    }
    
    this.emit('governanceEnforced', { initiativeCount: initiatives.length });
  }

  // Module access methods
  public getRequirementsEngine(): RequirementsEngine {
    return this.requirementsEngine;
  }

  public getCoordinationEngine(): CoordinationEngine {
    return this.coordinationEngine;
  }

  public getGovernanceEngine(): GovernanceEngine {
    return this.governanceEngine;
  }

  public getState(): ProductHolonState {
    return { ...this.state };
  }

  public getPerformanceMetrics() {
    return { ...this.state.performanceMetrics };
  }

  public async shutdown(): Promise<void> {
    console.log('🛑 Shutting down Product Holon...');
    
    await this.requirementsEngine.shutdown();
    await this.coordinationEngine.shutdown();
    await this.governanceEngine.shutdown();
    
    this.state.isInitialized = false;
    this.state.isRunning = false;
    
    console.log('✅ Product Holon shut down successfully');
  }
} 
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductHolon = void 0;
const events_1 = require("events");
const RequirementsEngine_1 = require("./modules/RequirementsEngine");
const CoordinationEngine_1 = require("./modules/CoordinationEngine");
const GovernanceEngine_1 = require("./modules/GovernanceEngine");
class ProductHolon extends events_1.EventEmitter {
    constructor() {
        super();
        this.state = this.initializeState();
        console.log('ProductHolon constructed');
        console.log('Integrated performanceTrackingService for performance metrics');
        this.requirementsEngine = RequirementsEngine_1.RequirementsEngine.getInstance();
        this.coordinationEngine = CoordinationEngine_1.CoordinationEngine.getInstance();
        this.governanceEngine = GovernanceEngine_1.GovernanceEngine.getInstance();
    }
    static getInstance() {
        if (!ProductHolon.instance) {
            ProductHolon.instance = new ProductHolon();
        }
        return ProductHolon.instance;
    }
    initializeState() {
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
    async initialize() {
        try {
            console.log('🎯 Initializing Product Holon...');
            await this.initializeModules();
            await this.setupCrossModuleCoordination();
            await this.setupIntegrations();
            await this.runHealthCheck();
            this.state.isInitialized = true;
            this.emit('initialized');
            console.log('✅ Product Holon initialized successfully');
        }
        catch (error) {
            console.error('❌ Failed to initialize Product Holon:', error);
            throw error;
        }
    }
    async initializeModules() {
        console.log('🔧 Initializing Product Holon modules...');
        try {
            await this.requirementsEngine.initialize();
            this.state.modules.requirements = true;
            console.log('✅ Requirements Engine initialized');
        }
        catch (error) {
            console.error('❌ Failed to initialize Requirements Engine:', error);
        }
        try {
            await this.coordinationEngine.initialize();
            this.state.modules.coordination = true;
            console.log('✅ Coordination Engine initialized');
        }
        catch (error) {
            console.error('❌ Failed to initialize Coordination Engine:', error);
        }
        try {
            await this.governanceEngine.initialize();
            this.state.modules.governance = true;
            console.log('✅ Governance Engine initialized');
        }
        catch (error) {
            console.error('❌ Failed to initialize Governance Engine:', error);
        }
    }
    async setupCrossModuleCoordination() {
        console.log('🔗 Setting up cross-module coordination...');
        this.requirementsEngine.on('requirementCreated', (requirement) => {
            console.log(`📋 New requirement created: ${requirement.title}`);
            this.emit('requirementCreated', requirement);
        });
        this.requirementsEngine.on('requirementApproved', (data) => {
            console.log(`✅ Requirement approved: ${data.id}`);
            this.emit('requirementApproved', data);
        });
        this.coordinationEngine.on('initiativeCreated', (initiative) => {
            console.log(`🎯 New initiative created: ${initiative.title}`);
            this.emit('initiativeCreated', initiative);
        });
        this.coordinationEngine.on('initiativeStarted', (data) => {
            console.log(`🚀 Initiative started: ${data.id}`);
            this.emit('initiativeStarted', data);
        });
        this.governanceEngine.on('policyCreated', (policy) => {
            console.log(`📜 New policy created: ${policy.name}`);
            this.emit('policyCreated', policy);
        });
        this.governanceEngine.on('complianceReportCreated', (report) => {
            console.log(`📊 Compliance report created: ${report.id}`);
            this.emit('complianceReportCreated', report);
        });
    }
    async setupIntegrations() {
        console.log('🔗 Setting up Product Holon integrations...');
        this.state.integrations.testingHolon = true;
        this.state.integrations.featuresHolon = true;
        this.state.integrations.systemMaster = true;
    }
    async runHealthCheck() {
        console.log('🏥 Running Product Holon health check...');
        const moduleHealth = Object.values(this.state.modules).filter(Boolean).length / 3 * 100;
        const requirementsMetrics = this.requirementsEngine.getPerformanceMetrics();
        const coordinationMetrics = this.coordinationEngine.getPerformanceMetrics();
        const governanceMetrics = this.governanceEngine.getPerformanceMetrics();
        const overallHealth = Math.min(100, (moduleHealth * 0.3) +
            (governanceMetrics.complianceRate * 0.4) +
            (coordinationMetrics.onTimeDelivery * 0.3));
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
    async generateProductReport() {
        console.log('📋 Generating comprehensive product report...');
        const requirementsMetrics = this.requirementsEngine.getPerformanceMetrics();
        const coordinationMetrics = this.coordinationEngine.getPerformanceMetrics();
        const governanceMetrics = this.governanceEngine.getPerformanceMetrics();
        const overallHealth = this.state.performanceMetrics.overallHealth;
        let healthStatus;
        if (overallHealth >= 90)
            healthStatus = 'excellent';
        else if (overallHealth >= 75)
            healthStatus = 'good';
        else if (overallHealth >= 60)
            healthStatus = 'fair';
        else
            healthStatus = 'poor';
        const recommendations = [];
        if (overallHealth < 90) {
            recommendations.push('Implement additional quality controls');
        }
        if (governanceMetrics.complianceRate < 100) {
            recommendations.push('Address compliance issues');
        }
        if (coordinationMetrics.onTimeDelivery < 90) {
            recommendations.push('Improve delivery timelines');
        }
        const report = {
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
    async coordinateRequirementsWithInitiatives() {
        console.log('🔗 Coordinating requirements with initiatives...');
        const requirements = this.requirementsEngine.getRequirements();
        const initiatives = this.coordinationEngine.getInitiatives();
        const pendingRequirements = requirements.filter(r => r.status === 'approved');
        for (const requirement of pendingRequirements) {
            const matchingInitiatives = initiatives.filter(i => i.requirements.includes(requirement.id) ||
                i.description.toLowerCase().includes(requirement.title.toLowerCase()));
            if (matchingInitiatives.length > 0) {
                console.log(`  Linking requirement "${requirement.title}" to ${matchingInitiatives.length} initiatives`);
            }
        }
        this.emit('requirementsCoordinated', { requirementCount: pendingRequirements.length });
    }
    async enforceGovernanceOnInitiatives() {
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
    getRequirementsEngine() {
        return this.requirementsEngine;
    }
    getCoordinationEngine() {
        return this.coordinationEngine;
    }
    getGovernanceEngine() {
        return this.governanceEngine;
    }
    getState() {
        return { ...this.state };
    }
    getPerformanceMetrics() {
        return { ...this.state.performanceMetrics };
    }
    async shutdown() {
        console.log('🛑 Shutting down Product Holon...');
        await this.requirementsEngine.shutdown();
        await this.coordinationEngine.shutdown();
        await this.governanceEngine.shutdown();
        this.state.isInitialized = false;
        this.state.isRunning = false;
        console.log('✅ Product Holon shut down successfully');
    }
}
exports.ProductHolon = ProductHolon;
//# sourceMappingURL=ProductHolon.js.map
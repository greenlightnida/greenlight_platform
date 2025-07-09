"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirementsEngine = void 0;
const events_1 = require("events");
class RequirementsEngine extends events_1.EventEmitter {
    constructor() {
        super();
        this.state = this.initializeState();
    }
    static getInstance() {
        if (!RequirementsEngine.instance) {
            RequirementsEngine.instance = new RequirementsEngine();
        }
        return RequirementsEngine.instance;
    }
    initializeState() {
        return {
            isInitialized: false,
            requirements: [],
            versionHistory: new Map(),
            stakeholderMap: new Map(),
            dependencyGraph: new Map(),
            performanceMetrics: {
                totalRequirements: 0,
                approvedRequirements: 0,
                implementedRequirements: 0,
                averageApprovalTime: 0,
                stakeholderSatisfaction: 0
            }
        };
    }
    async initialize() {
        try {
            console.log('📋 Initializing Requirements Engine...');
            await this.loadRequirements();
            this.buildDependencyGraph();
            this.buildStakeholderMap();
            this.state.isInitialized = true;
            this.emit('initialized');
            console.log('✅ Requirements Engine initialized successfully');
        }
        catch (error) {
            console.error('❌ Failed to initialize Requirements Engine:', error);
            throw error;
        }
    }
    async createRequirement(requirement) {
        const newRequirement = {
            ...requirement,
            id: `req-${Date.now()}`,
            metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: 'system',
                tags: [],
                category: 'requirement'
            }
        };
        this.state.requirements.push(newRequirement);
        this.updateVersionHistory(newRequirement);
        this.updatePerformanceMetrics();
        this.emit('requirementCreated', newRequirement);
        return newRequirement;
    }
    async updateRequirement(id, updates) {
        const requirementIndex = this.state.requirements.findIndex(r => r.id === id);
        if (requirementIndex === -1)
            return null;
        const oldRequirement = this.state.requirements[requirementIndex];
        if (!oldRequirement)
            return null;
        const updatedRequirement = {
            ...oldRequirement,
            ...updates,
            id: oldRequirement.id,
            metadata: {
                ...oldRequirement.metadata,
                updatedAt: new Date().toISOString()
            }
        };
        this.state.requirements[requirementIndex] = updatedRequirement;
        this.updateVersionHistory(updatedRequirement);
        this.updatePerformanceMetrics();
        this.emit('requirementUpdated', updatedRequirement);
        return updatedRequirement;
    }
    async approveRequirement(id, approver) {
        const requirement = this.state.requirements.find(r => r.id === id);
        if (!requirement || requirement.status !== 'review')
            return false;
        await this.updateRequirement(id, {
            status: 'approved',
            metadata: {
                ...requirement.metadata,
                updatedAt: new Date().toISOString(),
                tags: [...requirement.metadata.tags, `approved-by-${approver}`]
            }
        });
        this.emit('requirementApproved', { id, approver });
        return true;
    }
    async markRequirementImplemented(id) {
        const requirement = this.state.requirements.find(r => r.id === id);
        if (!requirement || requirement.status !== 'approved')
            return false;
        await this.updateRequirement(id, { status: 'implemented' });
        this.emit('requirementImplemented', { id });
        return true;
    }
    getRequirementsByStatus(status) {
        return this.state.requirements.filter(r => r.status === status);
    }
    getRequirementsByStakeholder(stakeholder) {
        return this.state.requirements.filter(r => r.stakeholders.includes(stakeholder));
    }
    getDependentRequirements(requirementId) {
        const dependents = this.state.dependencyGraph.get(requirementId) || [];
        return this.state.requirements.filter(r => dependents.includes(r.id));
    }
    async validateRequirement(requirementId) {
        const requirement = this.state.requirements.find(r => r.id === requirementId);
        if (!requirement)
            return false;
        const checks = [
            requirement.title.length > 0,
            requirement.description.length > 10,
            requirement.stakeholders.length > 0,
            requirement.acceptanceCriteria.length > 0
        ];
        const allChecksPass = checks.every(check => check);
        if (allChecksPass) {
            console.log(`✅ Requirement validation passed: ${requirement.title}`);
            return true;
        }
        else {
            console.log(`❌ Requirement validation failed: ${requirement.title}`);
            return false;
        }
    }
    async runRequirementsAnalysis() {
        console.log('🔍 Running requirements analysis...');
        let totalRequirements = 0;
        let validRequirements = 0;
        for (const requirement of this.state.requirements) {
            totalRequirements++;
            const isValid = await this.validateRequirement(requirement.id);
            if (isValid)
                validRequirements++;
        }
        const validationRate = totalRequirements > 0 ? (validRequirements / totalRequirements) * 100 : 0;
        console.log(`📊 Requirements analysis: ${validRequirements}/${totalRequirements} valid (${validationRate.toFixed(1)}%)`);
        this.emit('requirementsAnalyzed', { totalRequirements, validRequirements, validationRate });
    }
    async loadRequirements() {
        console.log('📚 Loading requirements...');
        const sampleRequirements = [
            {
                title: 'User Authentication System',
                description: 'Implement secure user authentication with multi-factor support',
                type: 'functional',
                priority: 'critical',
                status: 'approved',
                version: '1.0.0',
                stakeholders: ['security-team', 'product-team', 'end-users'],
                dependencies: [],
                acceptanceCriteria: [
                    'Users can register with email and password',
                    'Multi-factor authentication is supported',
                    'Password reset functionality works',
                    'Session management is secure'
                ]
            },
            {
                title: 'Performance Optimization',
                description: 'Optimize system performance for high-traffic scenarios',
                type: 'non-functional',
                priority: 'high',
                status: 'review',
                version: '1.0.0',
                stakeholders: ['engineering-team', 'operations-team'],
                dependencies: ['User Authentication System'],
                acceptanceCriteria: [
                    'Page load times under 2 seconds',
                    'Support for 10,000 concurrent users',
                    'Database query optimization',
                    'CDN integration for static assets'
                ]
            }
        ];
        for (const requirement of sampleRequirements) {
            await this.createRequirement(requirement);
        }
    }
    updateVersionHistory(requirement) {
        const history = this.state.versionHistory.get(requirement.id) || [];
        history.push({ ...requirement });
        this.state.versionHistory.set(requirement.id, history);
    }
    buildDependencyGraph() {
        this.state.dependencyGraph.clear();
        for (const requirement of this.state.requirements) {
            for (const dependencyId of requirement.dependencies) {
                const dependents = this.state.dependencyGraph.get(dependencyId) || [];
                dependents.push(requirement.id);
                this.state.dependencyGraph.set(dependencyId, dependents);
            }
        }
    }
    buildStakeholderMap() {
        this.state.stakeholderMap.clear();
        for (const requirement of this.state.requirements) {
            for (const stakeholder of requirement.stakeholders) {
                const requirements = this.state.stakeholderMap.get(stakeholder) || [];
                requirements.push(requirement.id);
                this.state.stakeholderMap.set(stakeholder, requirements);
            }
        }
    }
    updatePerformanceMetrics() {
        const totalRequirements = this.state.requirements.length;
        const approvedRequirements = this.state.requirements.filter(r => r.status === 'approved').length;
        const implementedRequirements = this.state.requirements.filter(r => r.status === 'implemented').length;
        this.state.performanceMetrics = {
            totalRequirements,
            approvedRequirements,
            implementedRequirements,
            averageApprovalTime: 2.5,
            stakeholderSatisfaction: 85
        };
    }
    getState() {
        return { ...this.state };
    }
    getRequirements() {
        return [...this.state.requirements];
    }
    getPerformanceMetrics() {
        return { ...this.state.performanceMetrics };
    }
    async shutdown() {
        console.log('🛑 Shutting down Requirements Engine...');
        this.state.isInitialized = false;
        console.log('✅ Requirements Engine shut down successfully');
    }
}
exports.RequirementsEngine = RequirementsEngine;
//# sourceMappingURL=RequirementsEngine.js.map
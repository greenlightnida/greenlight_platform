#!/usr/bin/env tsx
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentRegistryEngine = void 0;
const events_1 = require("events");
const DesignSystemManager_1 = require("../../systemMaster/DesignSystemManager");
class ComponentRegistryEngine extends events_1.EventEmitter {
    constructor() {
        super();
        this.state = this.initializeState();
    }
    static getInstance() {
        if (!ComponentRegistryEngine.instance) {
            ComponentRegistryEngine.instance = new ComponentRegistryEngine();
        }
        return ComponentRegistryEngine.instance;
    }
    initializeState() {
        return {
            isInitialized: false,
            designSystemManager: DesignSystemManager_1.DesignSystemManager.getInstance(),
            lastSync: new Date(),
            metrics: {
                totalComponents: 0,
                componentsByPlatform: {},
                componentsByHolon: {},
                componentsByCategory: {},
                componentsByStatus: {},
                healthScore: 0,
                complianceRate: 0,
                averageUsage: 0
            },
            alerts: [],
            performanceMetrics: {
                queryCount: 0,
                averageQueryTime: 0,
                lastQueryTime: 0
            }
        };
    }
    async initialize() {
        try {
            console.log('🔍 Initializing Component Registry Engine...');
            this.setupDesignSystemListeners();
            await this.syncWithDesignSystemManager();
            this.calculateMetrics();
            this.state.isInitialized = true;
            this.emit('initialized');
            console.log('✅ Component Registry Engine initialized successfully');
        }
        catch (error) {
            console.error('❌ Failed to initialize Component Registry Engine:', error);
            throw error;
        }
    }
    setupDesignSystemListeners() {
        const dsm = this.state.designSystemManager;
        dsm.on('component-registered', (data) => {
            this.emit('component-registered', data);
            this.handleComponentChange();
        });
        dsm.on('component-updated', (data) => {
            this.emit('component-updated', data);
            this.handleComponentChange();
        });
        dsm.on('design-system-registered', (designSystem) => {
            this.emit('design-system-registered', designSystem);
            this.handleDesignSystemChange();
        });
        dsm.on('design-system-updated', (designSystem) => {
            this.emit('design-system-updated', designSystem);
            this.handleDesignSystemChange();
        });
        dsm.on('alert-added', (alert) => {
            this.state.alerts.push(alert);
            this.emit('alert-added', alert);
        });
        dsm.on('alert-resolved', (alertId) => {
            this.state.alerts = this.state.alerts.filter(alert => alert.id !== alertId);
            this.emit('alert-resolved', alertId);
        });
    }
    async handleComponentChange() {
        await this.syncWithDesignSystemManager();
        this.calculateMetrics();
        this.emit('metrics-updated', this.state.metrics);
    }
    async handleDesignSystemChange() {
        await this.syncWithDesignSystemManager();
        this.calculateMetrics();
        this.emit('metrics-updated', this.state.metrics);
    }
    async syncWithDesignSystemManager() {
        const startTime = Date.now();
        try {
            const dsmState = this.state.designSystemManager.getState();
            this.state.lastSync = new Date();
            this.state.alerts = [...dsmState.monitoring.alerts];
            const queryTime = Date.now() - startTime;
            this.state.performanceMetrics.queryCount++;
            this.state.performanceMetrics.lastQueryTime = queryTime;
            this.state.performanceMetrics.averageQueryTime =
                (this.state.performanceMetrics.averageQueryTime * (this.state.performanceMetrics.queryCount - 1) + queryTime) /
                    this.state.performanceMetrics.queryCount;
            this.emit('sync-completed', { timestamp: this.state.lastSync, queryTime });
        }
        catch (error) {
            console.error('Failed to sync with DesignSystemManager:', error);
            this.emit('sync-failed', error);
        }
    }
    calculateMetrics() {
        const dsmState = this.state.designSystemManager.getState();
        const components = Array.from(dsmState.components.values());
        const systems = Array.from(dsmState.registry.values());
        this.state.metrics.totalComponents = components.length;
        this.state.metrics.componentsByPlatform = {};
        systems.forEach(system => {
            const systemComponents = components.filter(c => c.id.startsWith(`${system.id}:`));
            this.state.metrics.componentsByPlatform[system.platform] =
                (this.state.metrics.componentsByPlatform[system.platform] || 0) + systemComponents.length;
        });
        this.state.metrics.componentsByHolon = {};
        systems.forEach(system => {
            const systemComponents = components.filter(c => c.id.startsWith(`${system.id}:`));
            this.state.metrics.componentsByHolon[system.holon] =
                (this.state.metrics.componentsByHolon[system.holon] || 0) + systemComponents.length;
        });
        this.state.metrics.componentsByCategory = {};
        components.forEach(component => {
            this.state.metrics.componentsByCategory[component.category] =
                (this.state.metrics.componentsByCategory[component.category] || 0) + 1;
        });
        this.state.metrics.componentsByStatus = {};
        components.forEach(component => {
            this.state.metrics.componentsByStatus[component.status] =
                (this.state.metrics.componentsByStatus[component.status] || 0) + 1;
        });
        const health = dsmState.monitoring.health;
        const healthScores = Object.values(health.components);
        this.state.metrics.healthScore = healthScores.length > 0
            ? healthScores.filter(h => h === 'healthy').length / healthScores.length * 100
            : 100;
        const governance = dsmState.governance;
        const complianceMetrics = governance.quality.metrics;
        this.state.metrics.complianceRate =
            (complianceMetrics.coverage + complianceMetrics.documentation +
                complianceMetrics.accessibility + complianceMetrics.performance +
                complianceMetrics.consistency) / 5;
        const usage = dsmState.monitoring.usage;
        const usageValues = Object.values(usage.components);
        this.state.metrics.averageUsage = usageValues.length > 0
            ? usageValues.reduce((sum, val) => sum + val, 0) / usageValues.length
            : 0;
    }
    async queryComponents(query = {}) {
        const startTime = Date.now();
        try {
            let components = this.getAllComponents();
            if (query.platform) {
                const systemIds = this.state.designSystemManager.getDesignSystemsByPlatform(query.platform)
                    .map(system => system.id);
                components = components.filter(c => systemIds.some(systemId => c.id.startsWith(`${systemId}:`)));
            }
            if (query.holon) {
                const systemIds = this.state.designSystemManager.getDesignSystemsByHolon(query.holon)
                    .map(system => system.id);
                components = components.filter(c => systemIds.some(systemId => c.id.startsWith(`${systemId}:`)));
            }
            if (query.category) {
                components = components.filter(c => c.category === query.category);
            }
            if (query.status) {
                components = components.filter(c => c.status === query.status);
            }
            if (query.systemId) {
                components = components.filter(c => c.id.startsWith(`${query.systemId}:`));
            }
            if (query.search) {
                const searchLower = query.search.toLowerCase();
                components = components.filter(c => c.name.toLowerCase().includes(searchLower) ||
                    c.id.toLowerCase().includes(searchLower) ||
                    c.documentation.toLowerCase().includes(searchLower));
            }
            const queryTime = Date.now() - startTime;
            this.state.performanceMetrics.queryCount++;
            this.state.performanceMetrics.lastQueryTime = queryTime;
            this.state.performanceMetrics.averageQueryTime =
                (this.state.performanceMetrics.averageQueryTime * (this.state.performanceMetrics.queryCount - 1) + queryTime) /
                    this.state.performanceMetrics.queryCount;
            this.emit('components-queried', { query, count: components.length, queryTime });
            return components;
        }
        catch (error) {
            console.error('Failed to query components:', error);
            throw error;
        }
    }
    getAllComponents() {
        return Array.from(this.state.designSystemManager.getState().components.values());
    }
    getComponentById(id) {
        return this.state.designSystemManager.getComponent(id);
    }
    getComponentsByCategory(category) {
        return this.state.designSystemManager.getComponentsByCategory(category);
    }
    getComponentsBySystem(systemId) {
        return this.state.designSystemManager.getComponentsBySystem(systemId);
    }
    getDesignSystems() {
        return this.state.designSystemManager.getAllDesignSystems();
    }
    getDesignSystemById(id) {
        return this.state.designSystemManager.getDesignSystem(id);
    }
    getMetrics() {
        return { ...this.state.metrics };
    }
    getAlerts() {
        return [...this.state.alerts];
    }
    getActiveAlerts() {
        return this.state.alerts.filter(alert => !alert.resolved);
    }
    getAlertsByType(type) {
        return this.state.alerts.filter(alert => alert.type === type);
    }
    async generateComponentReport() {
        const dsmState = this.state.designSystemManager.getState();
        const usage = dsmState.monitoring.usage;
        const topUsedComponents = Object.entries(usage.components)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([componentId, usageCount]) => {
            const component = this.getComponentById(componentId);
            const systemId = componentId.split(':')[0];
            const system = systemId ? this.getDesignSystemById(systemId) : undefined;
            return {
                id: componentId,
                name: component?.name || 'Unknown',
                usage: usageCount,
                platform: system?.platform || 'unknown'
            };
        });
        const healthIssues = this.state.alerts.filter(alert => alert.type === 'error' || alert.type === 'warning');
        const complianceGaps = this.identifyComplianceGaps();
        const recommendations = this.generateRecommendations();
        const report = {
            timestamp: new Date(),
            metrics: this.getMetrics(),
            topUsedComponents,
            healthIssues,
            complianceGaps,
            recommendations
        };
        this.emit('report-generated', report);
        return report;
    }
    identifyComplianceGaps() {
        const gaps = [];
        const components = this.getAllComponents();
        const governance = this.state.designSystemManager.getGovernance();
        components.forEach(component => {
            if (governance.standards.documentation.required && !component.documentation) {
                gaps.push({
                    componentId: component.id,
                    issue: 'Missing documentation',
                    severity: 'medium'
                });
            }
            if (governance.compliance.accessibility.required &&
                component.accessibility.wcagLevel === 'A') {
                gaps.push({
                    componentId: component.id,
                    issue: 'Low accessibility compliance (WCAG A)',
                    severity: 'high'
                });
            }
            if (governance.standards.testing.coverage > component.tests.coverage) {
                gaps.push({
                    componentId: component.id,
                    issue: `Low test coverage (${component.tests.coverage}% vs required ${governance.standards.testing.coverage}%)`,
                    severity: 'medium'
                });
            }
        });
        return gaps;
    }
    generateRecommendations() {
        const recommendations = [];
        const metrics = this.state.metrics;
        const alerts = this.getActiveAlerts();
        if (metrics.healthScore < 80) {
            recommendations.push({
                type: 'health',
                message: `Component health score is low (${metrics.healthScore.toFixed(1)}%). Review and fix health issues.`,
                priority: 'high'
            });
        }
        if (metrics.complianceRate < 90) {
            recommendations.push({
                type: 'compliance',
                message: `Compliance rate is below target (${metrics.complianceRate.toFixed(1)}%). Address compliance gaps.`,
                priority: 'medium'
            });
        }
        if (metrics.averageUsage < 5) {
            recommendations.push({
                type: 'usage',
                message: 'Low component usage detected. Consider component consolidation or removal.',
                priority: 'low'
            });
        }
        const errorAlerts = alerts.filter(alert => alert.type === 'error');
        if (errorAlerts.length > 0) {
            recommendations.push({
                type: 'health',
                message: `${errorAlerts.length} error alerts need immediate attention.`,
                priority: 'high'
            });
        }
        return recommendations;
    }
    getPerformanceMetrics() {
        return { ...this.state.performanceMetrics };
    }
    getLastSync() {
        return this.state.lastSync;
    }
    async forceSync() {
        await this.syncWithDesignSystemManager();
        this.calculateMetrics();
        this.emit('force-sync-completed');
    }
    async healthCheck() {
        try {
            const dsmHealth = await this.state.designSystemManager.healthCheck();
            const metrics = {
                ...this.state.metrics,
                performance: this.state.performanceMetrics,
                lastSync: this.state.lastSync,
                alertCount: this.state.alerts.length,
                activeAlertCount: this.getActiveAlerts().length
            };
            return {
                status: dsmHealth.status,
                timestamp: new Date(),
                metrics
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                timestamp: new Date(),
                metrics: { error: error instanceof Error ? error.message : String(error) }
            };
        }
    }
    async shutdown() {
        console.log('🛑 Shutting down Component Registry Engine...');
        this.removeAllListeners();
        this.state.isInitialized = false;
        console.log('✅ Component Registry Engine shut down successfully');
    }
}
exports.ComponentRegistryEngine = ComponentRegistryEngine;
//# sourceMappingURL=ComponentRegistryEngine.js.map
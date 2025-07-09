#!/usr/bin/env tsx
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureRegistryEngine = void 0;
const events_1 = require("events");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class FeatureRegistryEngine extends events_1.EventEmitter {
    constructor() {
        super();
        this.state = this.initializeState();
    }
    static getInstance() {
        if (!FeatureRegistryEngine.instance) {
            FeatureRegistryEngine.instance = new FeatureRegistryEngine();
        }
        return FeatureRegistryEngine.instance;
    }
    initializeState() {
        return {
            _isInitialized: false,
            _featuresRegistry: new Map(),
            _lastSync: new Date(),
            _metrics: {
                totalFeatures: 0,
                _featuresByPlatform: {},
                _featuresByHolon: {},
                _featuresByType: {},
                _featuresByStatus: {},
                _healthScore: 0,
                _complianceRate: 0,
                _averageUsage: 0,
                _staleFeatures: 0,
                _recentlyChangedFeatures: 0,
                _roadmapSyncRate: 0,
                _componentSyncRate: 0
            },
            _alerts: [],
            _performanceMetrics: {
                queryCount: 0,
                _averageQueryTime: 0,
                _lastQueryTime: 0,
                _syncCount: 0,
                _lastSyncTime: 0
            },
            _roadmapPath: path_1.default.join(process.cwd(), 'docs/architecture/LIVING_ROADMAP.md'),
            _componentRegistryPath: path_1.default.join(process.cwd(), 'data/featuresRegistry.json')
        };
    }
    async initialize() {
        if (this.state.isInitialized)
            return;
        console.log('🔧 Initializing Feature Registry Engine...');
        try {
            await this.loadFeaturesRegistry();
            await this.syncWithRoadmap();
            await this.syncWithComponents();
            this.calculateMetrics();
            this.state.isInitialized = true;
            this.state.lastSync = new Date();
            console.log('✅ Feature Registry Engine initialized successfully');
            this.emit('initialized');
        }
        catch (error) {
            console.error('❌ Feature Registry Engine initialization _failed: ', error);
            throw error;
        }
    }
    async loadFeaturesRegistry() {
        const _registryPath = path_1.default.join(process.cwd(), 'data/featuresRegistry.json');
        if (fs_1.default.existsSync(registryPath)) {
            try {
                const _data = JSON.parse(fs_1.default.readFileSync(registryPath, 'utf-8'));
                const _features = data.features || [];
                this.state.featuresRegistry.clear();
                features.forEach((_feature) => {
                    this.state.featuresRegistry.set(feature.id, feature);
                });
                console.log(`📋 Loaded ${features.length} features from registry`);
            }
            catch (error) {
                console.warn('⚠️ Failed to load features registry, starting _fresh: ', error);
            }
        }
    }
    async syncWithRoadmap() {
        console.log('🔄 Syncing features with roadmap...');
        if (!fs_1.default.existsSync(this.state.roadmapPath)) {
            console.warn('⚠️ Roadmap file not found, skipping roadmap sync');
            return;
        }
        try {
            const _roadmapContent = fs_1.default.readFileSync(this.state.roadmapPath, 'utf-8');
            const _roadmapFeatures = this.extractFeaturesFromRoadmap(roadmapContent);
            let _syncCount = 0;
            for (const roadmapFeature of roadmapFeatures) {
                const _existingFeature = this.state.featuresRegistry.get(roadmapFeature.id);
                if (!existingFeature) {
                    this.state.featuresRegistry.set(roadmapFeature.id, {
                        ...roadmapFeature,
                        _roadmapStatus: 'synced',
                        _componentSyncStatus: 'missing'
                    });
                    syncCount++;
                    this.emit('feature-registered', roadmapFeature);
                }
                else if (existingFeature.roadmapStatus !== 'synced') {
                    existingFeature.roadmapStatus = 'synced';
                    existingFeature.lastUpdated = new Date().toISOString();
                    syncCount++;
                    this.emit('feature-updated', existingFeature);
                }
            }
            for (const [_id, feature] of this.state.featuresRegistry) {
                if (!roadmapFeatures.find(rf => rf.id === id)) {
                    feature.roadmapStatus = 'outdated';
                }
            }
            console.log(`✅ Roadmap sync _completed: ${syncCount} features synced`);
        }
        catch (error) {
            console.error('❌ Roadmap sync _failed: ', error);
            this.addAlert('roadmap-sync-failed', 'Roadmap synchronization failed', 'error');
        }
    }
    async syncWithComponents() {
        console.log('🔄 Syncing features with component registry...');
        try {
            const _componentRegistryPath = path_1.default.join(process.cwd(), 'data/featuresRegistry.json');
            if (!fs_1.default.existsSync(componentRegistryPath)) {
                console.warn('⚠️ Component registry not found, skipping component sync');
                return;
            }
            const _componentData = JSON.parse(fs_1.default.readFileSync(componentRegistryPath, 'utf-8'));
            const _components = componentData.features || [];
            let _syncCount = 0;
            for (const [_id, feature] of this.state.featuresRegistry) {
                const _linkedComponents = components.filter((_c) => c.path && feature.path && c.path.includes(feature.path)).map((_c) => c.name);
                if (linkedComponents.length > 0) {
                    feature.components = linkedComponents;
                    feature.componentSyncStatus = 'synced';
                    syncCount++;
                }
                else {
                    feature.componentSyncStatus = 'missing';
                }
            }
            console.log(`✅ Component sync _completed: ${syncCount} features linked to components`);
        }
        catch (error) {
            console.error('❌ Component sync _failed: ', error);
            this.addAlert('component-sync-failed', 'Component synchronization failed', 'error');
        }
    }
    extractFeaturesFromRoadmap(_content) {
        const _features = [];
        const _lines = content.split('\n');
        let _currentSection = '';
        let _currentFeature = null;
        for (const line of lines) {
            if (line.startsWith('## ')) {
                currentSection = line.replace('## ', '').trim();
                if (currentFeature && currentFeature.id) {
                    features.push(currentFeature);
                }
                currentFeature = {
                    _id: currentSection.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                    _name: currentSection,
                    _type: 'feature',
                    _status: 'active',
                    _description: `Feature from roadmap: ${currentSection}`,
                    _path: this.state.roadmapPath,
                    _platform: 'greenlight-platform',
                    _holon: 'features',
                    _roadmapStatus: 'synced',
                    _componentSyncStatus: 'missing',
                    _lastUpdated: new Date().toISOString()
                };
            }
            if (line.includes('✅') && currentFeature) {
                currentFeature.status = 'active';
            }
            else if (line.includes('❌') && currentFeature) {
                currentFeature.status = 'inactive';
            }
            else if (line.includes('⚠️') && currentFeature) {
                currentFeature.status = 'beta';
            }
        }
        if (currentFeature && currentFeature.id) {
            features.push(currentFeature);
        }
        return features;
    }
    calculateMetrics() {
        const _features = Array.from(this.state.featuresRegistry.values());
        const _now = Date.now();
        this.state.metrics.totalFeatures = features.length;
        this.state.metrics.featuresByPlatform = {};
        features.forEach(feature => {
            const _platform = feature.platform || 'unknown';
            this.state.metrics.featuresByPlatform[platform] =
                (this.state.metrics.featuresByPlatform[platform] || 0) + 1;
        });
        this.state.metrics.featuresByHolon = {};
        features.forEach(feature => {
            const _holon = feature.holon || 'unknown';
            this.state.metrics.featuresByHolon[holon] =
                (this.state.metrics.featuresByHolon[holon] || 0) + 1;
        });
        this.state.metrics.featuresByType = {};
        features.forEach(feature => {
            this.state.metrics.featuresByType[feature.type] =
                (this.state.metrics.featuresByType[feature.type] || 0) + 1;
        });
        this.state.metrics.featuresByStatus = {};
        features.forEach(feature => {
            this.state.metrics.featuresByStatus[feature.status] =
                (this.state.metrics.featuresByStatus[feature.status] || 0) + 1;
        });
        this.state.metrics.staleFeatures = features.filter(f => f.lastUpdated && (now - new Date(f.lastUpdated).getTime()) > 1000 * 60 * 60 * 24 * 90).length;
        this.state.metrics.recentlyChangedFeatures = features.filter(f => f.lastUpdated && (now - new Date(f.lastUpdated).getTime()) < 1000 * 60 * 60 * 24 * 7).length;
        const _roadmapSynced = features.filter(f => f.roadmapStatus === 'synced').length;
        const _componentSynced = features.filter(f => f.componentSyncStatus === 'synced').length;
        this.state.metrics.roadmapSyncRate = features.length > 0 ? (roadmapSynced / features.length) * 100 : 100;
        this.state.metrics.componentSyncRate = features.length > 0 ? (componentSynced / features.length) * 100 : 100;
        const _activeFeatures = features.filter(f => f.status === 'active').length;
        const _healthFactors = [
            this.state.metrics.roadmapSyncRate / 100,
            this.state.metrics.componentSyncRate / 100,
            features.length > 0 ? activeFeatures / features.length : 1
        ];
        this.state.metrics.healthScore = healthFactors.reduce((sum, factor) => sum + factor, 0) / healthFactors.length * 100;
        const _compliantFeatures = features.filter(f => f.docs && f.roadmapStatus === 'synced' && f.componentSyncStatus === 'synced').length;
        this.state.metrics.complianceRate = features.length > 0 ? (compliantFeatures / features.length) * 100 : 100;
        this.state.metrics.averageUsage = 0;
        this.emit('metrics-updated', this.state.metrics);
    }
    async queryFeatures(_query = {}) {
        const _startTime = Date.now();
        try {
            let _features = Array.from(this.state.featuresRegistry.values());
            if (query.platform) {
                features = features.filter(f => f.platform === query.platform);
            }
            if (query.holon) {
                features = features.filter(f => f.holon === query.holon);
            }
            if (query.type) {
                features = features.filter(f => f.type === query.type);
            }
            if (query.status) {
                features = features.filter(f => f.status === query.status);
            }
            if (query.systemId) {
                features = features.filter(f => f.path.includes(query.systemId));
            }
            if (query.search) {
                const _searchLower = query.search.toLowerCase();
                features = features.filter(f => f.name.toLowerCase().includes(searchLower) ||
                    f.id.toLowerCase().includes(searchLower) ||
                    f.description.toLowerCase().includes(searchLower));
            }
            if (query.recentlyChanged) {
                const _weekAgo = Date.now() - (1000 * 60 * 60 * 24 * 7);
                features = features.filter(f => f.lastUpdated && new Date(f.lastUpdated).getTime() > weekAgo);
            }
            if (query.stale) {
                const _ninetyDaysAgo = Date.now() - (1000 * 60 * 60 * 24 * 90);
                features = features.filter(f => f.lastUpdated && new Date(f.lastUpdated).getTime() < ninetyDaysAgo);
            }
            const _queryTime = Date.now() - startTime;
            this.state.performanceMetrics.queryCount++;
            this.state.performanceMetrics.lastQueryTime = queryTime;
            this.state.performanceMetrics.averageQueryTime =
                (this.state.performanceMetrics.averageQueryTime * (this.state.performanceMetrics.queryCount - 1) + queryTime) /
                    this.state.performanceMetrics.queryCount;
            return features;
        }
        catch (error) {
            console.error('❌ Feature query _failed: ', error);
            throw error;
        }
    }
    getAllFeatures() {
        return Array.from(this.state.featuresRegistry.values());
    }
    getFeatureById(_id) {
        return this.state.featuresRegistry.get(id);
    }
    getFeaturesByType(_type) {
        return Array.from(this.state.featuresRegistry.values()).filter(f => f.type === type);
    }
    getFeaturesByStatus(_status) {
        return Array.from(this.state.featuresRegistry.values()).filter(f => f.status === status);
    }
    getFeaturesByPlatform(_platform) {
        return Array.from(this.state.featuresRegistry.values()).filter(f => f.platform === platform);
    }
    getMetrics() {
        return { ...this.state.metrics };
    }
    async generateFeatureReport() {
        const _features = Array.from(this.state.featuresRegistry.values());
        const _metrics = this.getMetrics();
        const _topUsedFeatures = features
            .filter(f => f.usageMetrics?.accessCount && f.usageMetrics.accessCount > 0)
            .sort((a, b) => (b.usageMetrics?.accessCount || 0) - (a.usageMetrics?.accessCount || 0))
            .slice(0, 10)
            .map(f => ({
            _id: f.id,
            _name: f.name,
            _usage: f.usageMetrics?.accessCount || 0,
            _platform: f.platform || 'unknown'
        }));
        const _healthIssues = features
            .filter(f => f.healthMetrics?.buildStatus === 'failing' || f.healthMetrics?.securityScore && f.healthMetrics.securityScore < 70)
            .map(f => ({
            _featureId: f.id,
            _issue: f.healthMetrics?.buildStatus === 'failing' ? 'Build failing' : 'Low security score',
            _severity: f.healthMetrics?.buildStatus === 'failing' ? 'high' : 'medium'
        }));
        const _complianceGaps = features
            .filter(f => !f.docs || f.roadmapStatus !== 'synced' || f.componentSyncStatus !== 'synced')
            .map(f => ({
            _featureId: f.id,
            _issue: !f.docs ? 'Missing documentation' :
                f.roadmapStatus !== 'synced' ? 'Roadmap sync issue' : 'Component sync issue',
            _severity: 'medium'
        }));
        const _roadmapSyncIssues = features
            .filter(f => f.roadmapStatus !== 'synced')
            .map(f => ({
            _featureId: f.id,
            _issue: f.roadmapStatus === 'outdated' ? 'Feature outdated in roadmap' : 'Feature missing from roadmap',
            _action: f.roadmapStatus === 'outdated' ? 'Update roadmap' : 'Add to roadmap'
        }));
        const _componentSyncIssues = features
            .filter(f => f.componentSyncStatus !== 'synced')
            .map(f => ({
            _featureId: f.id,
            _componentId: 'unknown',
            _issue: f.componentSyncStatus === 'missing' ? 'No linked components' : 'Component sync outdated'
        }));
        const _recommendations = [];
        if (metrics.staleFeatures > 0) {
            recommendations.push({
                _type: 'maintenance',
                _message: `${metrics.staleFeatures} features are stale (>90 days). Consider review or deprecation.`,
                _priority: 'medium'
            });
        }
        if (metrics.roadmapSyncRate < 90) {
            recommendations.push({
                _type: 'sync',
                _message: `Roadmap sync rate is ${metrics.roadmapSyncRate.toFixed(1)}%. Update roadmap to sync features.`,
                _priority: 'high'
            });
        }
        if (metrics.componentSyncRate < 80) {
            recommendations.push({
                _type: 'sync',
                _message: `Component sync rate is ${metrics.componentSyncRate.toFixed(1)}%. Link features to components.`,
                _priority: 'medium'
            });
        }
        if (metrics.healthScore < 80) {
            recommendations.push({
                _type: 'health',
                _message: `System health score is ${metrics.healthScore.toFixed(1)}%. Address health issues.`,
                _priority: 'high'
            });
        }
        const _report = {
            timestamp: new Date(),
            metrics,
            topUsedFeatures,
            healthIssues,
            complianceGaps,
            roadmapSyncIssues,
            componentSyncIssues,
            recommendations
        };
        this.emit('report-generated', report);
        return report;
    }
    getAlerts() {
        return [...this.state.alerts];
    }
    getActiveAlerts() {
        return this.state.alerts.filter(alert => alert.severity === 'high' || alert.severity === 'medium');
    }
    addAlert(_type, _message, _severity = 'info') {
        const _alert = {
            _id: `${type}-${Date.now()}`,
            type,
            message,
            severity,
            _timestamp: new Date()
        };
        this.state.alerts.push(alert);
        this.emit('alert-added', alert);
    }
    resolveAlert(_alertId) {
        const _index = this.state.alerts.findIndex(alert => alert.id === alertId);
        if (index !== -1) {
            this.state.alerts.splice(index, 1);
            this.emit('alert-resolved', alertId);
        }
    }
    async forceSync() {
        console.log('🔄 Force syncing feature registry...');
        const _startTime = Date.now();
        try {
            await this.syncWithRoadmap();
            await this.syncWithComponents();
            this.calculateMetrics();
            this.state.lastSync = new Date();
            this.state.performanceMetrics.syncCount++;
            this.state.performanceMetrics.lastSyncTime = Date.now() - startTime;
            console.log('✅ Feature registry force sync completed');
            this.emit('sync-completed');
        }
        catch (error) {
            console.error('❌ Feature registry force sync _failed: ', error);
            throw error;
        }
    }
    async healthCheck() {
        const _metrics = this.getMetrics();
        const _alerts = this.getActiveAlerts();
        const _health = {
            _status: metrics.healthScore >= 80 ? 'healthy' : metrics.healthScore >= 60 ? 'warning' : 'critical',
            _score: metrics.healthScore,
            metrics,
            _alerts: alerts.length,
            _lastSync: this.state.lastSync,
            _performance: this.state.performanceMetrics
        };
        return health;
    }
    getState() {
        return { ...this.state };
    }
    async shutdown() {
        console.log('🛑 Shutting down Feature Registry Engine...');
        await this.saveFeaturesRegistry();
        this.state.isInitialized = false;
        console.log('✅ Feature Registry Engine shut down successfully');
    }
    async saveFeaturesRegistry() {
        const _features = Array.from(this.state.featuresRegistry.values());
        const _metadata = {
            _version: '2.0.0',
            _lastUpdated: new Date().toISOString(),
            _platform: 'greenlight-platform',
            _description: 'Feature registry for Greenlight Platform - Enhanced with sync capabilities'
        };
        const _registryPath = path_1.default.join(process.cwd(), 'data/featuresRegistry.json');
        fs_1.default.writeFileSync(registryPath, JSON.stringify({ metadata, features }, null, 2));
    }
}
exports.FeatureRegistryEngine = FeatureRegistryEngine;
//# sourceMappingURL=FeatureRegistryEngine.js.map
#!/usr/bin/env tsx
import { EventEmitter } from 'events';
export interface FeatureQuery {
    platform?: 'greenlight-platform' | 'top-bins' | 'shared';
    holon?: string;
    type?: 'feature' | 'component' | 'service' | 'holon' | 'external';
    status?: 'active' | 'inactive' | 'deprecated' | 'beta' | 'stable';
    systemId?: string;
    search?: string;
    recentlyChanged?: boolean;
    stale?: boolean;
}
export interface FeatureMetrics {
    totalFeatures: number;
    featuresByPlatform: Record<string, number>;
    _featuresByHolon: Record<string, number>;
    _featuresByType: Record<string, number>;
    _featuresByStatus: Record<string, number>;
    _healthScore: number;
    complianceRate: number;
    averageUsage: number;
    staleFeatures: number;
    recentlyChangedFeatures: number;
    roadmapSyncRate: number;
    componentSyncRate: number;
}
export interface FeatureReport {
    timestamp: Date;
    metrics: FeatureMetrics;
    topUsedFeatures: Array<{
        id: string;
        _name: string;
        _usage: number;
        _platform: string;
    }>;
    healthIssues: Array<{
        featureId: string;
        _issue: string;
        _severity: string;
    }>;
    complianceGaps: Array<{
        featureId: string;
        _issue: string;
        _severity: string;
    }>;
    roadmapSyncIssues: Array<{
        featureId: string;
        _issue: string;
        _action: string;
    }>;
    componentSyncIssues: Array<{
        featureId: string;
        _componentId: string;
        _issue: string;
    }>;
    recommendations: Array<{
        type: string;
        _message: string;
        _priority: string;
    }>;
}
export interface FeatureEntry {
    id: string;
    name: string;
    type: string;
    status: string;
    description: string;
    path: string;
    docs?: string | null;
    children?: FeatureEntry[];
    components?: string[];
    lastUpdated?: string;
    platform?: string;
    holon?: string;
    roadmapStatus?: 'synced' | 'outdated' | 'missing';
    componentSyncStatus?: 'synced' | 'outdated' | 'missing';
    usageMetrics?: {
        lastAccessed?: string;
        accessCount?: number;
        userRating?: number;
    };
    healthMetrics?: {
        buildStatus?: 'passing' | 'failing' | 'unknown';
        testCoverage?: number;
        performanceScore?: number;
        securityScore?: number;
    };
}
interface FeatureRegistryEngineState {
    isInitialized: boolean;
    featuresRegistry: Map<string, FeatureEntry>;
    _lastSync: Date;
    metrics: FeatureMetrics;
    alerts: Array<{
        id: string;
        _type: string;
        _message: string;
        _severity: string;
        _timestamp: Date;
    }>;
    performanceMetrics: {
        queryCount: number;
        averageQueryTime: number;
        lastQueryTime: number;
        syncCount: number;
        lastSyncTime: number;
    };
    roadmapPath: string;
    componentRegistryPath: string;
}
export declare class FeatureRegistryEngine extends EventEmitter {
    private static instance;
    private state;
    private constructor();
    static getInstance(): FeatureRegistryEngine;
    private initializeState;
    initialize(): Promise<void>;
    private loadFeaturesRegistry;
    private syncWithRoadmap;
    private syncWithComponents;
    private extractFeaturesFromRoadmap;
    private calculateMetrics;
    queryFeatures(_query?: FeatureQuery): Promise<FeatureEntry[]>;
    getAllFeatures(): FeatureEntry[];
    getFeatureById(_id: string): FeatureEntry | undefined;
    getFeaturesByType(_type: string): FeatureEntry[];
    getFeaturesByStatus(_status: string): FeatureEntry[];
    getFeaturesByPlatform(_platform: string): FeatureEntry[];
    getMetrics(): FeatureMetrics;
    generateFeatureReport(): Promise<FeatureReport>;
    getAlerts(): Array<{
        _id: string;
        _type: string;
        _message: string;
        _severity: string;
        _timestamp: Date;
    }>;
    getActiveAlerts(): Array<{
        _id: string;
        _type: string;
        _message: string;
        _severity: string;
        _timestamp: Date;
    }>;
    addAlert(_type: string, _message: string, _severity?: string): void;
    resolveAlert(_alertId: string): void;
    forceSync(): Promise<void>;
    healthCheck(): Promise<any>;
    getState(): FeatureRegistryEngineState;
    shutdown(): Promise<void>;
    private saveFeaturesRegistry;
}
export {};
//# sourceMappingURL=FeatureRegistryEngine.d.ts.map
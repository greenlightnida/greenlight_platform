#!/usr/bin/env tsx
import { EventEmitter } from 'events';
import { DesignSystemManager, ComponentRegistry, DesignSystem, ComponentCategory, DesignSystemAlert } from '../../systemMaster/DesignSystemManager';
export interface ComponentQuery {
    platform?: 'greenlight-platform' | 'top-bins' | 'shared';
    holon?: string;
    category?: ComponentCategory;
    status?: 'stable' | 'beta' | 'deprecated';
    systemId?: string;
    search?: string;
}
export interface ComponentMetrics {
    totalComponents: number;
    componentsByPlatform: Record<string, number>;
    componentsByHolon: Record<string, number>;
    componentsByCategory: Record<string, number>;
    componentsByStatus: Record<string, number>;
    healthScore: number;
    complianceRate: number;
    averageUsage: number;
}
export interface ComponentReport {
    timestamp: Date;
    metrics: ComponentMetrics;
    topUsedComponents: Array<{
        id: string;
        name: string;
        usage: number;
        platform: string;
    }>;
    healthIssues: DesignSystemAlert[];
    complianceGaps: Array<{
        componentId: string;
        issue: string;
        severity: 'low' | 'medium' | 'high';
    }>;
    recommendations: Array<{
        type: 'health' | 'compliance' | 'performance' | 'usage';
        message: string;
        priority: 'low' | 'medium' | 'high';
    }>;
}
export interface ComponentRegistryEngineState {
    isInitialized: boolean;
    designSystemManager: DesignSystemManager;
    lastSync: Date;
    metrics: ComponentMetrics;
    alerts: DesignSystemAlert[];
    performanceMetrics: {
        queryCount: number;
        averageQueryTime: number;
        lastQueryTime: number;
    };
}
export declare class ComponentRegistryEngine extends EventEmitter {
    private static instance;
    private state;
    private constructor();
    static getInstance(): ComponentRegistryEngine;
    private initializeState;
    initialize(): Promise<void>;
    private setupDesignSystemListeners;
    private handleComponentChange;
    private handleDesignSystemChange;
    private syncWithDesignSystemManager;
    private calculateMetrics;
    queryComponents(query?: ComponentQuery): Promise<ComponentRegistry[]>;
    getAllComponents(): ComponentRegistry[];
    getComponentById(id: string): ComponentRegistry | undefined;
    getComponentsByCategory(category: ComponentCategory): ComponentRegistry[];
    getComponentsBySystem(systemId: string): ComponentRegistry[];
    getDesignSystems(): DesignSystem[];
    getDesignSystemById(id: string): DesignSystem | undefined;
    getMetrics(): ComponentMetrics;
    getAlerts(): DesignSystemAlert[];
    getActiveAlerts(): DesignSystemAlert[];
    getAlertsByType(type: 'error' | 'warning' | 'info'): DesignSystemAlert[];
    generateComponentReport(): Promise<ComponentReport>;
    private identifyComplianceGaps;
    private generateRecommendations;
    getPerformanceMetrics(): {
        queryCount: number;
        averageQueryTime: number;
        lastQueryTime: number;
    };
    getLastSync(): Date;
    forceSync(): Promise<void>;
    healthCheck(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        timestamp: Date;
        metrics: Record<string, any>;
    }>;
    shutdown(): Promise<void>;
}
//# sourceMappingURL=ComponentRegistryEngine.d.ts.map
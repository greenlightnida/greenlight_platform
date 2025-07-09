import { EventEmitter } from 'events';
import { ImplementationEngine, FeatureImplementation } from './modules/ImplementationEngine';
import { TechnicalEngine, TechnicalStandard, ArchitecturePattern } from './modules/TechnicalEngine';
import { DeliveryEngine, FeatureDeployment, MaintenanceTask } from './modules/DeliveryEngine';
import { ComponentRegistryEngine, ComponentQuery, ComponentMetrics, ComponentReport } from './modules/ComponentRegistryEngine';
import { FeatureRegistryEngine, FeatureQuery, FeatureMetrics, FeatureReport } from './modules/FeatureRegistryEngine';
export interface FeaturesHolonState {
    isInitialized: boolean;
    implementationEngine: ImplementationEngine;
    technicalEngine: TechnicalEngine;
    deliveryEngine: DeliveryEngine;
    componentRegistryEngine: ComponentRegistryEngine;
    featureRegistryEngine: FeatureRegistryEngine;
    performanceMetrics: {
        totalFeatures: number;
        activeFeatures: number;
        completedFeatures: number;
        averageQuality: number;
        onTimeDelivery: number;
        complianceRate: number;
    };
    integrations: {
        productHolon: boolean;
        testingHolon: boolean;
        systemMaster: boolean;
    };
}
export interface ProductHolonIntegration {
    requirementId: string;
    initiativeId: string;
    requirements: any[];
    initiatives: any[];
}
export declare class FeaturesHolon extends EventEmitter {
    private static instance;
    private state;
    private productIntegration;
    private constructor();
    static getInstance(): FeaturesHolon;
    private initializeState;
    initialize(): Promise<void>;
    receiveRequirements(_requirements: any[]): Promise<void>;
    receiveInitiatives(_initiatives: any[]): Promise<void>;
    generateTechnicalSpecs(_requirementId: string): Promise<any>;
    createImplementationPlan(_initiativeId: string): Promise<any>;
    startFeatureImplementation(_requirementId: string, _initiativeId: string): Promise<FeatureImplementation>;
    updateImplementationProgress(_implementationId: string, _progress: Partial<FeatureImplementation>): Promise<FeatureImplementation | null>;
    deployFeature(_implementationId: string): Promise<FeatureDeployment>;
    promoteToProduction(_deploymentId: string): Promise<boolean>;
    createMaintenanceTask(_task: Omit<MaintenanceTask, 'id' | 'metadata'>): Promise<MaintenanceTask>;
    updateMaintenanceTask(_id: string, _updates: Partial<MaintenanceTask>): Promise<MaintenanceTask | null>;
    runQualityAudit(): Promise<void>;
    assessFeatureQuality(_implementationId: string): Promise<number>;
    syncWithProductHolon(): Promise<void>;
    syncWithTestingHolon(): Promise<void>;
    generateFeatureReport(_timeframe: 'day' | 'week' | 'month'): Promise<any>;
    generateDeploymentReport(_timeframe: 'day' | 'week' | 'month'): Promise<any>;
    private setupCrossEngineEvents;
    private setupIntegrations;
    private calculateTimeline;
    private calculateComplexity;
    private calculateResources;
    private identifyDependencies;
    private updatePerformanceMetrics;
    getState(): FeaturesHolonState;
    getImplementations(): FeatureImplementation[];
    getStandards(): TechnicalStandard[];
    getPatterns(): ArchitecturePattern[];
    getDeployments(): FeatureDeployment[];
    getMaintenanceTasks(): MaintenanceTask[];
    getPerformanceMetrics(): {
        totalFeatures: number;
        activeFeatures: number;
        completedFeatures: number;
        averageQuality: number;
        onTimeDelivery: number;
        complianceRate: number;
    };
    getComponentRegistryEngine(): ComponentRegistryEngine;
    queryComponents(_query?: ComponentQuery): Promise<any[]>;
    getComponentMetrics(): ComponentMetrics;
    generateComponentReport(): Promise<ComponentReport>;
    getComponentAlerts(): any[];
    getActiveComponentAlerts(): any[];
    syncComponentRegistry(): Promise<void>;
    getComponentHealthCheck(): Promise<any>;
    getFeatureRegistryEngine(): FeatureRegistryEngine;
    queryFeatures(_query?: FeatureQuery): Promise<any[]>;
    getFeatureMetrics(): FeatureMetrics;
    generateFeatureRegistryReport(): Promise<FeatureReport>;
    getFeatureAlerts(): any[];
    getActiveFeatureAlerts(): any[];
    syncFeatureRegistry(): Promise<void>;
    getFeatureHealthCheck(): Promise<any>;
    getProductIntegration(): ProductHolonIntegration | null;
    shutdown(): Promise<void>;
}
//# sourceMappingURL=FeaturesHolon.d.ts.map
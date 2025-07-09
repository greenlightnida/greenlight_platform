import { EventEmitter } from 'events';
import { RequirementsEngine } from './modules/RequirementsEngine';
import { CoordinationEngine } from './modules/CoordinationEngine';
import { GovernanceEngine } from './modules/GovernanceEngine';
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
export declare class ProductHolon extends EventEmitter {
    private static instance;
    private state;
    private requirementsEngine;
    private coordinationEngine;
    private governanceEngine;
    private constructor();
    static getInstance(): ProductHolon;
    private initializeState;
    initialize(): Promise<void>;
    private initializeModules;
    private setupCrossModuleCoordination;
    private setupIntegrations;
    runHealthCheck(): Promise<void>;
    generateProductReport(): Promise<ProductReport>;
    coordinateRequirementsWithInitiatives(): Promise<void>;
    enforceGovernanceOnInitiatives(): Promise<void>;
    getRequirementsEngine(): RequirementsEngine;
    getCoordinationEngine(): CoordinationEngine;
    getGovernanceEngine(): GovernanceEngine;
    getState(): ProductHolonState;
    getPerformanceMetrics(): {
        totalRequirements: number;
        totalInitiatives: number;
        totalPolicies: number;
        overallHealth: number;
        complianceRate: number;
        deliveryRate: number;
    };
    shutdown(): Promise<void>;
}
//# sourceMappingURL=ProductHolon.d.ts.map
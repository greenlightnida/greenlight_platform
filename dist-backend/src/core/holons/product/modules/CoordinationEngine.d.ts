import { EventEmitter } from 'events';
export interface ProductInitiative {
    _id: string;
    title: string;
    description: string;
    type: 'feature' | 'enhancement' | 'bugfix' | 'refactor' | 'migration';
    priority: 'critical' | 'high' | 'medium' | 'low';
    status: 'planning' | 'in-progress' | 'review' | 'testing' | 'deployed' | 'completed';
    version: string;
    requirements: string[];
    specifications: string[];
    engineering: string[];
    systems: string[];
    dependencies: string[];
    timeline: {
        startDate: string;
        targetDate: string;
        actualStartDate?: string;
        actualEndDate?: string;
    };
    resources: {
        team: string[];
        budget: number;
        effort: number;
    };
    metadata: {
        createdAt: string;
        updatedAt: string;
        createdBy: string;
        tags: string[];
        category: string;
        clientId?: string;
    };
}
export interface CoordinationEngineState {
    isInitialized: boolean;
    initiatives: ProductInitiative[];
    roadmap: Map<string, ProductInitiative[]>;
    _resourceAllocation: Map<string, string[]>;
    _dependencyGraph: Map<string, string[]>;
    _performanceMetrics: {
        totalInitiatives: number;
        activeInitiatives: number;
        completedInitiatives: number;
        onTimeDelivery: number;
        resourceUtilization: number;
    };
    integrations: {
        requirementsEngine: boolean;
        testingHolon: boolean;
        featuresHolon: boolean;
        systemMaster: boolean;
    };
}
export declare class CoordinationEngine extends EventEmitter {
    private static instance;
    private state;
    private constructor();
    static getInstance(): CoordinationEngine;
    private initializeState;
    initialize(): Promise<void>;
    createInitiative(_initiative: Omit<ProductInitiative, 'id' | 'metadata'>): Promise<ProductInitiative>;
    updateInitiative(_id: string, _updates: Partial<ProductInitiative>): Promise<ProductInitiative | null>;
    startInitiative(_id: string): Promise<boolean>;
    completeInitiative(_id: string): Promise<boolean>;
    getInitiativesByStatus(_status: ProductInitiative['status']): ProductInitiative[];
    getInitiativesByTeam(_team: string): ProductInitiative[];
    getDependentInitiatives(_initiativeId: string): ProductInitiative[];
    coordinateWithRequirements(_requirementIds: string[]): Promise<void>;
    coordinateWithEngineering(_engineeringTasks: string[]): Promise<void>;
    coordinateWithSystems(_systemTasks: string[]): Promise<void>;
    generateRoadmap(): Promise<Map<string, ProductInitiative[]>>;
}
//# sourceMappingURL=CoordinationEngine.d.ts.map
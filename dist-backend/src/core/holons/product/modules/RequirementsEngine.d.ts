import { EventEmitter } from 'events';
export interface Requirement {
    id: string;
    title: string;
    description: string;
    type: 'functional' | 'non-functional' | 'business' | 'technical' | 'user-story';
    priority: 'critical' | 'high' | 'medium' | 'low';
    status: 'draft' | 'review' | 'approved' | 'implemented' | 'deprecated';
    version: string;
    stakeholders: string[];
    dependencies: string[];
    acceptanceCriteria: string[];
    metadata: {
        createdAt: string;
        updatedAt: string;
        createdBy: string;
        tags: string[];
        category: string;
        clientId?: string;
    };
}
export interface RequirementsEngineState {
    isInitialized: boolean;
    requirements: Requirement[];
    versionHistory: Map<string, Requirement[]>;
    stakeholderMap: Map<string, string[]>;
    dependencyGraph: Map<string, string[]>;
    performanceMetrics: {
        totalRequirements: number;
        approvedRequirements: number;
        implementedRequirements: number;
        averageApprovalTime: number;
        stakeholderSatisfaction: number;
    };
}
export declare class RequirementsEngine extends EventEmitter {
    private static instance;
    private state;
    private constructor();
    static getInstance(): RequirementsEngine;
    private initializeState;
    initialize(): Promise<void>;
    createRequirement(requirement: Omit<Requirement, 'id' | 'metadata'>): Promise<Requirement>;
    updateRequirement(id: string, updates: Partial<Requirement>): Promise<Requirement | null>;
    approveRequirement(id: string, approver: string): Promise<boolean>;
    markRequirementImplemented(id: string): Promise<boolean>;
    getRequirementsByStatus(status: Requirement['status']): Requirement[];
    getRequirementsByStakeholder(stakeholder: string): Requirement[];
    getDependentRequirements(requirementId: string): Requirement[];
    validateRequirement(requirementId: string): Promise<boolean>;
    runRequirementsAnalysis(): Promise<void>;
    private loadRequirements;
    private updateVersionHistory;
    private buildDependencyGraph;
    private buildStakeholderMap;
    private updatePerformanceMetrics;
    getState(): RequirementsEngineState;
    getRequirements(): Requirement[];
    getPerformanceMetrics(): {
        totalRequirements: number;
        approvedRequirements: number;
        implementedRequirements: number;
        averageApprovalTime: number;
        stakeholderSatisfaction: number;
    };
    shutdown(): Promise<void>;
}
//# sourceMappingURL=RequirementsEngine.d.ts.map
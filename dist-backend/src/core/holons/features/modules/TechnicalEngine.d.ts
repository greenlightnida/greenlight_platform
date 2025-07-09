import { EventEmitter } from 'events';
export interface TechnicalStandard {
    id: string;
    name: string;
    category: 'architecture' | 'coding' | 'testing' | 'security' | 'performance' | 'documentation';
    description: string;
    version: string;
    status: 'draft' | 'active' | 'deprecated' | 'archived';
    requirements: string[];
    guidelines: string[];
    examples: string[];
    enforcement: 'mandatory' | 'recommended' | 'optional';
    metadata: {
        createdAt: string;
        updatedAt: string;
        createdBy: string;
        approvedBy?: string;
        tags: string[];
    };
}
export interface ArchitecturePattern {
    id: string;
    name: string;
    description: string;
    type: 'component' | 'service' | 'integration' | 'data' | 'security';
    complexity: 'simple' | 'medium' | 'complex';
    benefits: string[];
    tradeoffs: string[];
    useCases: string[];
    implementation: {
        framework: string;
        language: string;
        dependencies: string[];
        codeExample: string;
    };
    metadata: {
        createdAt: string;
        updatedAt: string;
        createdBy: string;
        tags: string[];
    };
}
export interface TechnicalEngineState {
    isInitialized: boolean;
    standards: TechnicalStandard[];
    patterns: ArchitecturePattern[];
    frameworks: {
        frontend: string[];
        backend: string[];
        database: string[];
        testing: string[];
        deployment: string[];
    };
    performanceMetrics: {
        totalStandards: number;
        activeStandards: number;
        complianceRate: number;
        averageQuality: number;
    };
    integrations: {
        productHolon: boolean;
        testingHolon: boolean;
        systemMaster: boolean;
    };
}
export declare class TechnicalEngine extends EventEmitter {
    private static instance;
    private state;
    private constructor();
    static getInstance(): TechnicalEngine;
    private initializeState;
    initialize(): Promise<void>;
    createStandard(standard: Omit<TechnicalStandard, 'id' | 'metadata'>): Promise<TechnicalStandard>;
    updateStandard(id: string, updates: Partial<TechnicalStandard>): Promise<TechnicalStandard | null>;
    createPattern(pattern: Omit<ArchitecturePattern, 'id' | 'metadata'>): Promise<ArchitecturePattern>;
    updatePattern(id: string, updates: Partial<ArchitecturePattern>): Promise<ArchitecturePattern | null>;
    getStandardsByCategory(category: TechnicalStandard['category']): TechnicalStandard[];
    getStandardsByStatus(status: TechnicalStandard['status']): TechnicalStandard[];
    getPatternsByType(type: ArchitecturePattern['type']): ArchitecturePattern[];
    assessCompliance(implementationId: string, standardIds: string[]): Promise<number>;
    runComplianceAudit(): Promise<void>;
    generateArchitectureRecommendation(requirementId: string): Promise<any>;
    validateTechnicalSpecs(specs: any): Promise<{
        isValid: boolean;
        issues: string[];
        recommendations: string[];
    }>;
    updateFrameworks(category: keyof TechnicalEngineState['frameworks'], frameworks: string[]): Promise<void>;
    private loadTechnicalStandards;
    private loadArchitecturePatterns;
    private setupIntegrations;
    private updatePerformanceMetrics;
    getState(): TechnicalEngineState;
    getStandards(): TechnicalStandard[];
    getPatterns(): ArchitecturePattern[];
    getFrameworks(): {
        frontend: string[];
        backend: string[];
        database: string[];
        testing: string[];
        deployment: string[];
    };
    getPerformanceMetrics(): {
        totalStandards: number;
        activeStandards: number;
        complianceRate: number;
        averageQuality: number;
    };
    shutdown(): Promise<void>;
}
//# sourceMappingURL=TechnicalEngine.d.ts.map
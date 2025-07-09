import { EventEmitter } from 'events';
export interface GovernancePolicy {
    id: string;
    name: string;
    description: string;
    type: 'quality' | 'compliance' | 'security' | 'performance' | 'accessibility';
    priority: 'critical' | 'high' | 'medium' | 'low';
    status: 'draft' | 'active' | 'deprecated';
    version: string;
    rules: string[];
    enforcementLevel: 'strict' | 'moderate' | 'advisory';
    scope: string[];
    metadata: {
        createdAt: string;
        updatedAt: string;
        createdBy: string;
        tags: string[];
        category: string;
    };
}
export interface ComplianceReport {
    id: string;
    timestamp: string;
    entityId: string;
    entityType: 'requirement' | 'initiative' | 'product' | 'system';
    policyId: string;
    status: 'compliant' | 'non-compliant' | 'partial' | 'exempt';
    score: number;
    issues: string[];
    recommendations: string[];
    metadata: {
        createdAt: string;
        createdBy: string;
    };
}
export interface GovernanceEngineState {
    isInitialized: boolean;
    policies: GovernancePolicy[];
    complianceReports: ComplianceReport[];
    auditTrail: Map<string, any[]>;
    performanceMetrics: {
        totalPolicies: number;
        activePolicies: number;
        complianceRate: number;
        averageScore: number;
        auditCount: number;
    };
    integrations: {
        requirementsEngine: boolean;
        coordinationEngine: boolean;
        testingHolon: boolean;
        featuresHolon: boolean;
        systemMaster: boolean;
    };
}
export declare class GovernanceEngine extends EventEmitter {
    private static instance;
    private state;
    private constructor();
    static getInstance(): GovernanceEngine;
    private initializeState;
    initialize(): Promise<void>;
    createPolicy(policy: Omit<GovernancePolicy, 'id' | 'metadata'>): Promise<GovernancePolicy>;
    updatePolicy(id: string, updates: Partial<GovernancePolicy>): Promise<GovernancePolicy | null>;
    activatePolicy(id: string): Promise<boolean>;
    createComplianceReport(report: Omit<ComplianceReport, 'id' | 'metadata'>): Promise<ComplianceReport>;
    enforcePolicy(policyId: string, entityId: string, entityType: ComplianceReport['entityType']): Promise<ComplianceReport>;
    runComplianceAudit(): Promise<void>;
    monitorQualityStandards(): Promise<void>;
    generateGovernanceReport(): Promise<any>;
    private loadPolicies;
    private setupIntegrations;
    private addToAuditTrail;
    private updatePerformanceMetrics;
    getState(): GovernanceEngineState;
    getPolicies(): GovernancePolicy[];
    getComplianceReports(): ComplianceReport[];
    getPerformanceMetrics(): {
        totalPolicies: number;
        activePolicies: number;
        complianceRate: number;
        averageScore: number;
        auditCount: number;
    };
    shutdown(): Promise<void>;
}
//# sourceMappingURL=GovernanceEngine.d.ts.map
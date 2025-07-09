import { EventEmitter } from 'events';
export interface TestResult {
    id: string;
    name: string;
    status: 'PASS' | 'FAIL' | 'SKIP' | 'RUNNING';
    duration: number;
    cost: number;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    layer: 'UNIT' | 'INTEGRATION' | 'E2E' | 'PERFORMANCE' | 'SECURITY';
    timestamp: string;
    error?: string;
    coverage?: number;
    impact?: number;
}
export interface TestSuite {
    id: string;
    name: string;
    tests: TestResult[];
    totalTests: number;
    passedTests: number;
    failedTests: number;
    skippedTests: number;
    duration: number;
    cost: number;
    status: 'RUNNING' | 'COMPLETE' | 'FAILED';
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}
export interface TestingHolonState {
    isInitialized: boolean;
    isRunning: boolean;
    currentTestSuite: TestSuite | null;
    testHistory: TestResult[];
    costMetrics: {
        totalCost: number;
        averageCostPerTest: number;
        costByLayer: Record<string, number>;
        costByPriority: Record<string, number>;
    };
    performanceMetrics: {
        totalTestsRun: number;
        successRate: number;
        averageDuration: number;
        failurePatterns: string[];
    };
    selfHealing: {
        autoRecoveryEnabled: boolean;
        recoveryAttempts: number;
        lastRecovery: string | null;
        failurePatterns: Record<string, number>;
    };
    predictiveAnalysis: {
        riskAssessment: Record<string, number>;
        testPrioritization: string[];
        predictedFailures: string[];
        optimizationRecommendations: string[];
    };
    managerIntegration: {
        activeManagers: string[];
        loadDistribution: Record<string, number>;
        coordinationStatus: 'ACTIVE' | 'DEGRADED' | 'FAILED';
    };
    cicdIntegration: {
        enabled: boolean;
        professionalStandards: {
            enforced: boolean;
            complianceLevel: 'basic' | 'standard' | 'enterprise';
            auditTrail: boolean;
            qualityGates: boolean;
            automatedReviews: boolean;
        };
        protocols: {
            featureTesting: boolean;
            regressionTesting: boolean;
            performanceTesting: boolean;
            securityTesting: boolean;
            accessibilityTesting: boolean;
            deploymentTesting: boolean;
        };
        efficiencyOptimization: {
            parallelExecution: boolean;
            intelligentPrioritization: boolean;
            resourceOptimization: boolean;
            costManagement: boolean;
            timeToMarket: boolean;
        };
        continuousImprovement: {
            learningFromFailures: boolean;
            patternOptimization: boolean;
            protocolEvolution: boolean;
            capabilityEnhancement: boolean;
        };
    };
}
export declare class TestingHolonManager extends EventEmitter {
    private static instance;
    private state;
    private activityLog;
    private logActivity;
    static logChatCircuitClosure(): void;
    private constructor();
    static getInstance(): TestingHolonManager;
    private initializeState;
    initialize(): Promise<void>;
    runGlobalTestSuite(): Promise<TestSuite>;
    getState(): TestingHolonState;
    getTestHistory(): TestResult[];
    getPerformanceMetrics(): {
        totalTestsRun: number;
        successRate: number;
        averageDuration: number;
        failurePatterns: string[];
    };
    getCostMetrics(): {
        totalCost: number;
        averageCostPerTest: number;
        costByLayer: Record<string, number>;
        costByPriority: Record<string, number>;
    };
    getPredictiveAnalysis(): {
        riskAssessment: Record<string, number>;
        testPrioritization: string[];
        predictedFailures: string[];
        optimizationRecommendations: string[];
    };
    getCicdIntegration(): {
        enabled: boolean;
        professionalStandards: {
            enforced: boolean;
            complianceLevel: "basic" | "standard" | "enterprise";
            auditTrail: boolean;
            qualityGates: boolean;
            automatedReviews: boolean;
        };
        protocols: {
            featureTesting: boolean;
            regressionTesting: boolean;
            performanceTesting: boolean;
            securityTesting: boolean;
            accessibilityTesting: boolean;
            deploymentTesting: boolean;
        };
        efficiencyOptimization: {
            parallelExecution: boolean;
            intelligentPrioritization: boolean;
            resourceOptimization: boolean;
            costManagement: boolean;
            timeToMarket: boolean;
        };
        continuousImprovement: {
            learningFromFailures: boolean;
            patternOptimization: boolean;
            protocolEvolution: boolean;
            capabilityEnhancement: boolean;
        };
    };
    getActivityLog(): {
        timestamp: string;
        message: string;
    }[];
    integrateWithFeaturesHolon(): Promise<void>;
    enforceProfessionalStandards(): Promise<void>;
    shutdown(): Promise<void>;
}
//# sourceMappingURL=TestingHolonManager.d.ts.map
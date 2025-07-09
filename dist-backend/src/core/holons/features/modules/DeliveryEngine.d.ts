import { EventEmitter } from 'events';
export interface FeatureDeployment {
    id: string;
    name: string;
    implementationId: string;
    status: 'planned' | 'in-progress' | 'testing' | 'staging' | 'production' | 'failed' | 'rolled-back';
    environment: 'development' | 'staging' | 'production';
    deploymentType: 'manual' | 'automated' | 'blue-green' | 'canary';
    version: string;
    deployment: {
        startTime?: string;
        endTime?: string;
        duration?: number;
        deployedBy: string;
        rollbackVersion?: string;
        rollbackReason?: string;
    };
    health: {
        status: 'healthy' | 'degraded' | 'unhealthy';
        responseTime: number;
        errorRate: number;
        uptime: number;
        lastCheck: string;
    };
    monitoring: {
        logs: string[];
        metrics: Record<string, number>;
        alerts: string[];
    };
    metadata: {
        createdAt: string;
        updatedAt: string;
        createdBy: string;
        tags: string[];
    };
}
export interface MaintenanceTask {
    id: string;
    name: string;
    type: 'bug-fix' | 'performance' | 'security' | 'feature-update' | 'dependency-update';
    priority: 'critical' | 'high' | 'medium' | 'low';
    status: 'planned' | 'in-progress' | 'testing' | 'completed' | 'cancelled';
    implementationId: string;
    deploymentId?: string;
    description: string;
    estimatedHours: number;
    actualHours?: number;
    assignedTo: string;
    dueDate: string;
    completedDate?: string;
    metadata: {
        createdAt: string;
        updatedAt: string;
        createdBy: string;
        tags: string[];
    };
}
export interface DeliveryEngineState {
    isInitialized: boolean;
    deployments: FeatureDeployment[];
    maintenanceTasks: MaintenanceTask[];
    environments: {
        development: {
            status: 'healthy' | 'degraded' | 'unhealthy';
            url: string;
        };
        staging: {
            status: 'healthy' | 'degraded' | 'unhealthy';
            url: string;
        };
        production: {
            status: 'healthy' | 'degraded' | 'unhealthy';
            url: string;
        };
    };
    performanceMetrics: {
        totalDeployments: number;
        successfulDeployments: number;
        failedDeployments: number;
        averageDeploymentTime: number;
        totalMaintenanceTasks: number;
        completedMaintenanceTasks: number;
        averageResolutionTime: number;
    };
    integrations: {
        productHolon: boolean;
        testingHolon: boolean;
        systemMaster: boolean;
    };
}
export declare class DeliveryEngine extends EventEmitter {
    private static instance;
    private state;
    private constructor();
    static getInstance(): DeliveryEngine;
    private initializeState;
    initialize(): Promise<void>;
    createDeployment(deployment: Omit<FeatureDeployment, 'id' | 'metadata'>): Promise<FeatureDeployment>;
    updateDeployment(id: string, updates: Partial<Omit<FeatureDeployment, 'id'>>): Promise<FeatureDeployment | null>;
    startDeployment(id: string): Promise<boolean>;
    completeDeployment(id: string, success: boolean): Promise<boolean>;
    rollbackDeployment(id: string, reason: string): Promise<boolean>;
    createMaintenanceTask(task: Omit<MaintenanceTask, 'id' | 'metadata'>): Promise<MaintenanceTask>;
    updateMaintenanceTask(id: string, updates: Partial<Omit<MaintenanceTask, 'id'>>): Promise<MaintenanceTask | null>;
    completeMaintenanceTask(id: string): Promise<boolean>;
    getDeploymentsByStatus(status: FeatureDeployment['status']): FeatureDeployment[];
    getDeploymentsByEnvironment(environment: FeatureDeployment['environment']): FeatureDeployment[];
    getMaintenanceTasksByStatus(status: MaintenanceTask['status']): MaintenanceTask[];
    getMaintenanceTasksByType(type: MaintenanceTask['type']): MaintenanceTask[];
    checkEnvironmentHealth(environment: keyof DeliveryEngineState['environments']): Promise<void>;
    runHealthMonitoring(): Promise<void>;
    updateDeploymentHealth(deploymentId: string): Promise<void>;
    generateDeploymentReport(timeframe: 'day' | 'week' | 'month'): Promise<any>;
    private loadDeployments;
    private loadMaintenanceTasks;
    private setupIntegrations;
    private startHealthMonitoring;
    private updatePerformanceMetrics;
    getState(): DeliveryEngineState;
    getDeployments(): FeatureDeployment[];
    getMaintenanceTasks(): MaintenanceTask[];
    getEnvironments(): {
        development: {
            status: "healthy" | "degraded" | "unhealthy";
            url: string;
        };
        staging: {
            status: "healthy" | "degraded" | "unhealthy";
            url: string;
        };
        production: {
            status: "healthy" | "degraded" | "unhealthy";
            url: string;
        };
    };
    getPerformanceMetrics(): {
        totalDeployments: number;
        successfulDeployments: number;
        failedDeployments: number;
        averageDeploymentTime: number;
        totalMaintenanceTasks: number;
        completedMaintenanceTasks: number;
        averageResolutionTime: number;
    };
    shutdown(): Promise<void>;
}
//# sourceMappingURL=DeliveryEngine.d.ts.map
export interface PerformanceMetric {
    id: string;
    name: string;
    value: number;
    unit: string;
    timestamp: Date;
    category: 'system' | 'user' | 'network' | 'database';
}
export interface PerformanceConfig {
    enabled: boolean;
    samplingInterval: number;
    maxMetrics: number;
    retentionDays: number;
}
//# sourceMappingURL=performanceTrackingService.d.ts.map
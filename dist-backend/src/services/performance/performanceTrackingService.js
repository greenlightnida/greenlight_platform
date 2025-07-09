"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PerformanceTrackingService {
    constructor() {
        this.config = {
            enabled: true,
            samplingInterval: 60000,
            maxMetrics: 1000,
            retentionDays: 30
        };
        this.metrics = [];
    }
    async initialize() {
        if (!this.config.enabled) {
            console.log('Performance Tracking Service is disabled');
            return;
        }
        console.log('Performance Tracking Service initialized');
        await this.startTracking();
    }
    async startTracking() {
        if (typeof window !== 'undefined') {
            this.trackBrowserMetrics();
        }
        else {
            this.trackServerMetrics();
        }
    }
    trackBrowserMetrics() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            this.addMetric({
                name: 'Page Load Time',
                value: loadTime,
                unit: 'ms',
                category: 'system'
            });
        }
        if (window.performance && 'memory' in window.performance) {
            const memory = window.performance.memory;
            this.addMetric({
                name: 'Memory Usage',
                value: memory.usedJSHeapSize / 1024 / 1024,
                unit: 'MB',
                category: 'system'
            });
        }
    }
    trackServerMetrics() {
        const usage = process.memoryUsage();
        this.addMetric({
            name: 'Heap Used',
            value: usage.heapUsed / 1024 / 1024,
            unit: 'MB',
            category: 'system'
        });
        this.addMetric({
            name: 'Heap Total',
            value: usage.heapTotal / 1024 / 1024,
            unit: 'MB',
            category: 'system'
        });
    }
    addMetric(metric) {
        const newMetric = {
            ...metric,
            id: Date.now().toString(),
            timestamp: new Date()
        };
        this.metrics.push(newMetric);
        if (this.metrics.length > this.config.maxMetrics) {
            this.metrics = this.metrics.slice(-this.config.maxMetrics);
        }
        this.cleanupOldMetrics();
    }
    async getMetrics() {
        return this.metrics;
    }
    async getMetricsByCategory(category) {
        return this.metrics.filter(metric => metric.category === category);
    }
    async getMetricsByTimeRange(start, end) {
        return this.metrics.filter(metric => metric.timestamp >= start && metric.timestamp <= end);
    }
    async getAverageMetric(name, timeRange) {
        let filteredMetrics = this.metrics.filter(metric => metric.name === name);
        if (timeRange) {
            filteredMetrics = filteredMetrics.filter(metric => metric.timestamp >= timeRange.start && metric.timestamp <= timeRange.end);
        }
        if (filteredMetrics.length === 0)
            return 0;
        const sum = filteredMetrics.reduce((acc, metric) => acc + metric.value, 0);
        return sum / filteredMetrics.length;
    }
    cleanupOldMetrics() {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);
        this.metrics = this.metrics.filter(metric => metric.timestamp >= cutoffDate);
    }
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }
    getConfig() {
        return { ...this.config };
    }
}
//# sourceMappingURL=performanceTrackingService.js.map
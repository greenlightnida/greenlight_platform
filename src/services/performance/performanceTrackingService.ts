/**
 * Performance Tracking Service
 * Monitors and tracks system performance metrics
 */

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

class PerformanceTrackingService {
  private config: PerformanceConfig = {
    enabled: true,
    samplingInterval: 60000, // 1 minute
    maxMetrics: 1000,
    retentionDays: 30
  };

  private metrics: PerformanceMetric[] = [];

  /**
   * Initialize the performance tracking service
   */
  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      console.log('Performance Tracking Service is disabled');
      return;
    }

    console.log('Performance Tracking Service initialized');
    await this.startTracking();
  }

  /**
   * Start performance tracking
   */
  private async startTracking(): Promise<void> {
    if (typeof window !== 'undefined') {
      // Browser environment
      this.trackBrowserMetrics();
    } else {
      // Node.js environment
      this.trackServerMetrics();
    }
  }

  /**
   * Track browser-specific metrics
   */
  private trackBrowserMetrics(): void {
    // Track page load performance
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

    // Track memory usage if available
    if (window.performance && 'memory' in window.performance) {
      const memory = (window.performance as any).memory;
      
      this.addMetric({
        name: 'Memory Usage',
        value: memory.usedJSHeapSize / 1024 / 1024, // Convert to MB
        unit: 'MB',
        category: 'system'
      });
    }
  }

  /**
   * Track server-specific metrics
   */
  private trackServerMetrics(): void {
    const usage = process.memoryUsage();
    
    this.addMetric({
      name: 'Heap Used',
      value: usage.heapUsed / 1024 / 1024, // Convert to MB
      unit: 'MB',
      category: 'system'
    });

    this.addMetric({
      name: 'Heap Total',
      value: usage.heapTotal / 1024 / 1024, // Convert to MB
      unit: 'MB',
      category: 'system'
    });
  }

  /**
   * Add a performance metric
   */
  addMetric(metric: Omit<PerformanceMetric, 'id' | 'timestamp'>): void {
    const newMetric: PerformanceMetric = {
      ...metric,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    this.metrics.push(newMetric);

    // Keep only the latest metrics
    if (this.metrics.length > this.config.maxMetrics) {
      this.metrics = this.metrics.slice(-this.config.maxMetrics);
    }

    // Clean up old metrics
    this.cleanupOldMetrics();
  }

  /**
   * Get all metrics
   */
  async getMetrics(): Promise<PerformanceMetric[]> {
    return this.metrics;
  }

  /**
   * Get metrics by category
   */
  async getMetricsByCategory(category: PerformanceMetric['category']): Promise<PerformanceMetric[]> {
    return this.metrics.filter(metric => metric.category === category);
  }

  /**
   * Get metrics for a specific time range
   */
  async getMetricsByTimeRange(start: Date, end: Date): Promise<PerformanceMetric[]> {
    return this.metrics.filter(metric => 
      metric.timestamp >= start && metric.timestamp <= end
    );
  }

  /**
   * Get average metric value for a specific metric name
   */
  async getAverageMetric(name: string, timeRange?: { start: Date; end: Date }): Promise<number> {
    let filteredMetrics = this.metrics.filter(metric => metric.name === name);
    
    if (timeRange) {
      filteredMetrics = filteredMetrics.filter(metric => 
        metric.timestamp >= timeRange.start && metric.timestamp <= timeRange.end
      );
    }

    if (filteredMetrics.length === 0) return 0;

    const sum = filteredMetrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / filteredMetrics.length;
  }

  /**
   * Clean up old metrics based on retention policy
   */
  private cleanupOldMetrics(): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);

    this.metrics = this.metrics.filter(metric => metric.timestamp >= cutoffDate);
  }

  /**
   * Update service configuration
   */
  updateConfig(config: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get service configuration
   */
  getConfig(): PerformanceConfig {
    return { ...this.config };
  }
}

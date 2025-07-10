#!/usr/bin/env node

(async () => {
  // Register ts-node for TypeScript support if running directly
  if (process.env.TS_NODE_DEV !== 'true' && !require.extensions['.ts']) {
    try {
      require('ts-node').register();
    } catch (e) {
      console.error('❌ ts-node is required to run TypeScript files. Please install it with `npm install ts-node`.');
      process.exit(1);
    }
  }

  const { UserConstituencyManager } = await import('../../src/core/governance/UserConstituencyManager.ts');
  const { UserMonitoringService } = await import('../../src/services/monitoring/UserMonitoringService.ts');

  class UserMonitoringIntegration {
    constructor() {
      this.userManager = null;
      this.monitoringService = null;
      this.isRunning = false;
      this.config = {
        enabled: true,
        samplingRate: 1.0,
        privacyMode: false,
        dataRetentionDays: 30,
        alertThresholds: {
          errorRate: 5.0,
          responseTime: 2000,
          systemLoad: 80,
          engagementDrop: 20
        },
        realTimeStreaming: true,
        analyticsEnabled: true
      };
    }

    async initialize() {
      try {
        console.log('🔍 Initializing User Monitoring Integration...');
        
        this.userManager = new UserConstituencyManager();
        this.monitoringService = new UserMonitoringService(this.userManager, this.config);
        
        // Set up event listeners
        this.setupEventListeners();
        
        console.log('✅ User Monitoring Integration initialized successfully');
        return true;
      } catch (error) {
        console.error('❌ Failed to initialize User Monitoring Integration:', error);
        return false;
      }
    }

    setupEventListeners() {
      if (!this.monitoringService) return;

      // Real-time metrics updates
      this.monitoringService.on('metricsUpdated', (metrics) => {
        console.log('📊 Real-time metrics updated:', {
          activeUsers: metrics.activeUsers.size,
          concurrentSessions: metrics.concurrentSessions,
          averageResponseTime: metrics.averageResponseTime,
          errorRate: metrics.errorRate,
          systemLoad: metrics.systemLoad
        });
      });

      // Alert creation
      this.monitoringService.on('alertCreated', (alert) => {
        console.log(`🚨 Alert created: [${alert.severity.toUpperCase()}] ${alert.title}`);
        console.log(`   Message: ${alert.message}`);
        console.log(`   Type: ${alert.type}`);
      });

      // Alert resolution
      this.monitoringService.on('alertResolved', (alert) => {
        console.log(`✅ Alert resolved: ${alert.title}`);
      });

      // Monitoring data stream
      this.monitoringService.on('monitoringDataStream', (data) => {
        // Log summary every 30 seconds
        if (Date.now() % 30000 < 5000) {
          console.log('📈 Monitoring Data Stream Summary:', {
            activeUsers: data.realTimeMetrics.activeUsers.size,
            alerts: data.alerts.length,
            timestamp: data.timestamp.toISOString()
          });
        }
      });

      // User activity
      this.monitoringService.on('activityRecorded', (activity) => {
        if (activity.type === 'error') {
          console.log(`⚠️  Error activity recorded: ${activity.details.message || 'Unknown error'}`);
        }
      });

      // Feedback submission
      this.monitoringService.on('feedbackSubmitted', (feedback) => {
        console.log(`💬 Feedback submitted: [${feedback.type}] ${feedback.title}`);
      });
    }

    async start() {
      if (this.isRunning) {
        console.log('⚠️  User monitoring is already running');
        return true;
      }

      try {
        console.log('🚀 Starting User Monitoring...');
        
        if (!this.monitoringService) {
          await this.initialize();
        }

        this.isRunning = true;
        console.log('✅ User monitoring started successfully');
        
        // Start a test session to demonstrate functionality
        this.startTestSession();
        
        return true;
      } catch (error) {
        console.error('❌ Failed to start user monitoring:', error);
        return false;
      }
    }

    async stop() {
      if (!this.isRunning) {
        console.log('⚠️  User monitoring is not running');
        return true;
      }

      try {
        console.log('🛑 Stopping User Monitoring...');
        
        if (this.monitoringService) {
          this.monitoringService.stop();
        }
        
        this.isRunning = false;
        console.log('✅ User monitoring stopped successfully');
        return true;
      } catch (error) {
        console.error('❌ Failed to stop user monitoring:', error);
        return false;
      }
    }

    startTestSession() {
      if (!this.monitoringService) return;

      console.log('🧪 Starting test user session...');
      
      const testUserId = 'test-user-' + Date.now();
      const session = this.monitoringService.startUserSession(testUserId, {
        userAgent: 'Test Browser/1.0',
        screenResolution: '1920x1080',
        timezone: 'UTC',
        language: 'en-US',
        referrer: 'https://test.example.com',
        ipAddress: '127.0.0.1'
      });

      console.log(`✅ Test session started: ${session.id}`);

      // Simulate some user activity
      setTimeout(() => {
        this.monitoringService.recordUserActivity(session.id, 'feature_use', {
          feature: 'dashboard',
          action: 'view'
        });
      }, 1000);

      setTimeout(() => {
        this.monitoringService.recordUserActivity(session.id, 'page_view', {
          page: '/monitoring',
          duration: 5000
        });
      }, 2000);

      setTimeout(() => {
        this.monitoringService.submitFeedback({
          type: 'general_feedback',
          category: 'monitoring',
          priority: 'medium',
          status: 'submitted',
          title: 'Test Feedback',
          description: 'This is a test feedback submission',
          userId: testUserId,
          sessionId: session.id,
          tags: ['test', 'monitoring']
        });
      }, 3000);

      // End session after 10 seconds
      setTimeout(() => {
        this.monitoringService.endUserSession(session.id);
        console.log(`✅ Test session ended: ${session.id}`);
      }, 10000);
    }

    async getStatus() {
      if (!this.monitoringService) {
        return {
          running: false,
          message: 'Monitoring service not initialized'
        };
      }

      try {
        const health = await this.monitoringService.healthCheck();
        return {
          running: this.isRunning,
          health,
          config: this.monitoringService.getConfig(),
          alerts: this.monitoringService.getAlerts().length,
          activeAlerts: this.monitoringService.getAlerts().filter(a => 
            a.severity === 'critical' || a.severity === 'high'
          ).length
        };
      } catch (error) {
        return {
          running: this.isRunning,
          error: error.message
        };
      }
    }

    async getMetrics() {
      if (!this.monitoringService) {
        return null;
      }

      return {
        realTimeMetrics: this.monitoringService.getRealTimeMetrics(),
        performanceAnalytics: this.monitoringService.getPerformanceAnalytics(),
        behaviorAnalytics: this.monitoringService.getBehaviorAnalytics(),
        engagementAnalytics: this.monitoringService.getEngagementAnalytics(),
        alerts: this.monitoringService.getAlerts()
      };
    }

    async getAlerts(includeResolved = false) {
      if (!this.monitoringService) {
        return [];
      }

      return this.monitoringService.getAlerts(includeResolved);
    }

    async resolveAlert(alertId, resolution) {
      if (!this.monitoringService) {
        return false;
      }

      return this.monitoringService.resolveAlert(alertId, resolution);
    }

    async updateConfig(newConfig) {
      if (!this.monitoringService) {
        return false;
      }

      this.monitoringService.updateConfig(newConfig);
      this.config = { ...this.config, ...newConfig };
      return true;
    }

    async generateReport() {
      if (!this.monitoringService) {
        return null;
      }

      const metrics = await this.getMetrics();
      const alerts = await this.getAlerts(true);
      const status = await this.getStatus();

      return {
        timestamp: new Date().toISOString(),
        status,
        metrics,
        alerts,
        summary: {
          totalUsers: metrics.engagementAnalytics.userMetrics.totalUsers,
          activeUsers: metrics.realTimeMetrics.activeUsers.size,
          totalSessions: metrics.engagementAnalytics.sessionMetrics.totalSessions,
          totalFeedback: metrics.engagementAnalytics.feedbackMetrics.totalFeedback,
          averageEngagementScore: metrics.engagementAnalytics.userMetrics.averageEngagementScore,
          averageSatisfactionScore: metrics.engagementAnalytics.userMetrics.averageSatisfactionScore,
          activeAlerts: alerts.filter(a => !a.resolved).length,
          criticalAlerts: alerts.filter(a => !a.resolved && a.severity === 'critical').length,
          highAlerts: alerts.filter(a => !a.resolved && a.severity === 'high').length
        }
      };
    }
  }

  // CLI interface
  async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    const integration = new UserMonitoringIntegration();

    switch (command) {
      case 'start':
        await integration.start();
        break;
      case 'stop':
        await integration.stop();
        break;
      case 'status':
        const status = await integration.getStatus();
        console.log(JSON.stringify(status, null, 2));
        break;
      case 'metrics':
        const metrics = await integration.getMetrics();
        console.log(JSON.stringify(metrics, null, 2));
        break;
      case 'alerts':
        const includeResolved = args.includes('--resolved');
        const alerts = await integration.getAlerts(includeResolved);
        console.log(JSON.stringify(alerts, null, 2));
        break;
      case 'resolve':
        const alertId = args[1];
        const resolution = args[2] || 'Resolved via CLI';
        if (!alertId) {
          console.error('❌ Alert ID required for resolve command');
          process.exit(1);
        }
        const resolved = await integration.resolveAlert(alertId, resolution);
        console.log(resolved ? '✅ Alert resolved' : '❌ Failed to resolve alert');
        break;
      case 'config':
        if (args[1] === 'update') {
          const configPath = args[2];
          if (!configPath) {
            console.error('❌ Config file path required');
            process.exit(1);
          }
          try {
            const config = require(configPath);
            await integration.updateConfig(config);
            console.log('✅ Config updated');
          } catch (error) {
            console.error('❌ Failed to update config:', error.message);
          }
        } else {
          const status = await integration.getStatus();
          console.log(JSON.stringify(status.config, null, 2));
        }
        break;
      case 'report':
        const report = await integration.generateReport();
        console.log(JSON.stringify(report, null, 2));
        break;
      case 'test':
        await integration.initialize();
        await integration.start();
        console.log('🧪 Test mode started. Press Ctrl+C to stop.');
        break;
      default:
        console.log(`\n🔍 User Monitoring Integration CLI\n\nUsage: node user_monitoring_integration.cjs <command> [options]\n\nCommands:\n  start                    Start user monitoring\n  stop                     Stop user monitoring\n  status                   Get monitoring status\n  metrics                  Get current metrics\n  alerts [--resolved]      Get alerts (include resolved with --resolved flag)\n  resolve <alertId> [resolution]  Resolve an alert\n  config                   Show current config\n  config update <file>     Update config from file\n  report                   Generate comprehensive report\n  test                     Start in test mode with demo data\n\nExamples:\n  node user_monitoring_integration.cjs start\n  node user_monitoring_integration.cjs status\n  node user_monitoring_integration.cjs metrics\n  node user_monitoring_integration.cjs alerts --resolved\n  node user_monitoring_integration.cjs resolve alert-123 \"Fixed the issue\"\n      `);
    }
  }

  // Export for use in other modules
  module.exports = { UserMonitoringIntegration };

  // Run CLI if called directly
  if (require.main === module) {
    main().catch(console.error);
  }
})(); 
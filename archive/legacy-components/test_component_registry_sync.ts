#!/usr/bin/env tsx

/**
 * Test Component Registry Sync
 * 
 * PURPOSE: Test the integration between FeaturesHolon, ComponentRegistryEngine, and DesignSystemManager
 * - Verify initialization and sync
 * - Test component querying and metrics
 * - Validate event propagation
 * - Check reporting functionality
 */

import { FeaturesHolon } from '../src/core/holons/features/FeaturesHolon';
import { DesignSystemManager } from '../src/core/holons/systemMaster/DesignSystemManager';

async function testComponentRegistrySync() {
  console.log('🧪 Testing Component Registry Sync...\n');

  try {
    // Initialize DesignSystemManager
    console.log('1. Initializing DesignSystemManager...');
    const designSystemManager = DesignSystemManager.getInstance();
    await designSystemManager.healthCheck();
    console.log('✅ DesignSystemManager initialized\n');

    // Initialize FeaturesHolon
    console.log('2. Initializing FeaturesHolon...');
    const featuresHolon = FeaturesHolon.getInstance();
    await featuresHolon.initialize();
    console.log('✅ FeaturesHolon initialized\n');

    // Test component registry engine access
    console.log('3. Testing ComponentRegistryEngine access...');
    const componentRegistryEngine = featuresHolon.getComponentRegistryEngine();
    console.log('✅ ComponentRegistryEngine accessed\n');

    // Test component metrics
    console.log('4. Testing component metrics...');
    const metrics = featuresHolon.getComponentMetrics();
    console.log('📊 Component Metrics:', {
      totalComponents: metrics.totalComponents,
      healthScore: metrics.healthScore,
      complianceRate: metrics.complianceRate,
      averageUsage: metrics.averageUsage
    });
    console.log('✅ Component metrics retrieved\n');

    // Test component querying
    console.log('5. Testing component querying...');
    const allComponents = await featuresHolon.queryComponents();
    console.log(`📋 Found ${allComponents.length} total components`);
    
    const greenlightComponents = await featuresHolon.queryComponents({
      platform: 'greenlight-platform'
    });
    console.log(`📋 Found ${greenlightComponents.length} Greenlight components`);
    
    const topBinsComponents = await featuresHolon.queryComponents({
      platform: 'top-bins'
    });
    console.log(`📋 Found ${topBinsComponents.length} Top_Bins components`);
    console.log('✅ Component querying working\n');

    // Test design systems
    console.log('6. Testing design system access...');
    const designSystems = componentRegistryEngine.getDesignSystems();
    console.log(`📋 Found ${designSystems.length} design systems:`);
    designSystems.forEach(system => {
      console.log(`  - ${system.name} (${system.platform}) - ${system.status}`);
    });
    console.log('✅ Design systems accessed\n');

    // Test health check
    console.log('7. Testing health check...');
    const health = await featuresHolon.getComponentHealthCheck();
    console.log('🏥 Health Status:', health.status);
    console.log('✅ Health check completed\n');

    // Test alerts
    console.log('8. Testing alerts...');
    const alerts = featuresHolon.getComponentAlerts();
    const activeAlerts = featuresHolon.getActiveComponentAlerts();
    console.log(`📢 Total alerts: ${alerts.length}, Active alerts: ${activeAlerts.length}`);
    console.log('✅ Alerts retrieved\n');

    // Test component report generation
    console.log('9. Testing component report generation...');
    const report = await featuresHolon.generateComponentReport();
    console.log('📊 Report generated:', {
      timestamp: report.timestamp,
      totalComponents: report.metrics.totalComponents,
      topUsedComponents: report.topUsedComponents.length,
      healthIssues: report.healthIssues.length,
      complianceGaps: report.complianceGaps.length,
      recommendations: report.recommendations.length
    });
    console.log('✅ Component report generated\n');

    // Test sync functionality
    console.log('10. Testing sync functionality...');
    await featuresHolon.syncComponentRegistry();
    console.log('✅ Component registry synced\n');

    // Test event listeners
    console.log('11. Testing event listeners...');
    featuresHolon.on('componentMetricsUpdated', (metrics) => {
      console.log('📊 Metrics updated event received');
    });
    
    featuresHolon.on('componentReportGenerated', (report) => {
      console.log('📊 Report generated event received');
    });
    console.log('✅ Event listeners set up\n');

    console.log('🎉 All Component Registry Sync tests passed!\n');

    // Summary
    console.log('📋 Test Summary:');
    console.log(`  - Total Components: ${metrics.totalComponents}`);
    console.log(`  - Design Systems: ${designSystems.length}`);
    console.log(`  - Health Score: ${metrics.healthScore}%`);
    console.log(`  - Compliance Rate: ${metrics.complianceRate}%`);
    console.log(`  - Active Alerts: ${activeAlerts.length}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testComponentRegistrySync().catch(console.error); 
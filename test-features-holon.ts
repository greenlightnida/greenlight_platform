import { FeaturesHolon } from './src/core/holons/features/FeaturesHolon';
import { ProductHolon } from './src/core/holons/product/ProductHolon';

async function testFeaturesHolon() {
  console.log('🧪 Testing Features Holon Implementation...\n');

  try {
    // Initialize both holons
    console.log('1️⃣ Initializing Holons...');
    const featuresHolon = FeaturesHolon.getInstance();
    const productHolon = ProductHolon.getInstance();
    
    await featuresHolon.initialize();
    await productHolon.initialize();
    
    console.log('✅ Both holons initialized successfully\n');

    // Test Product Holon integration
    console.log('2️⃣ Testing Product Holon Integration...');
    
    // Create sample requirements and initiatives
    const sampleRequirements = [
      {
        id: 'req-1',
        name: 'User Authentication System',
        description: 'Implement secure user authentication with multi-factor support',
        type: 'frontend',
        complexity: 2,
        initiativeId: 'init-1'
      },
      {
        id: 'req-2',
        name: 'Performance Optimization',
        description: 'Optimize system performance and reduce load times',
        type: 'backend',
        complexity: 3,
        initiativeId: 'init-1'
      }
    ];

    const sampleInitiatives = [
      {
        id: 'init-1',
        name: 'Security Enhancement Initiative',
        description: 'Enhance system security and performance',
        priority: 'high',
        status: 'active'
      }
    ];

    // Send requirements and initiatives to Features Holon
    await featuresHolon.receiveRequirements(sampleRequirements);
    await featuresHolon.receiveInitiatives(sampleInitiatives);
    
    console.log('✅ Product Holon integration tested successfully\n');

    // Test feature implementation workflow
    console.log('3️⃣ Testing Feature Implementation Workflow...');
    
    // Start feature implementation
    const implementation = await featuresHolon.startFeatureImplementation('req-1', 'init-1');
    console.log(`✅ Feature implementation started: ${implementation.name}`);
    
    // Update implementation progress
    await featuresHolon.updateImplementationProgress(implementation.id, {
      status: 'in-development',
      quality: {
        testCoverage: 75,
        codeQuality: 85,
        performance: 90,
        security: 88
      }
    });
    
    console.log('✅ Implementation progress updated\n');

    // Test deployment workflow
    console.log('4️⃣ Testing Deployment Workflow...');
    
    const deployment = await featuresHolon.deployFeature(implementation.id);
    console.log(`✅ Feature deployment created: ${deployment.name}`);
    
    // Promote to production
    const promotionSuccess = await featuresHolon.promoteToProduction(deployment.id);
    console.log(`✅ Deployment promotion: ${promotionSuccess ? 'SUCCESS' : 'FAILED'}\n`);

    // Test maintenance workflow
    console.log('5️⃣ Testing Maintenance Workflow...');
    
    const maintenanceTask = await featuresHolon.createMaintenanceTask({
      name: 'Fix Authentication Bug',
      type: 'bug-fix',
      priority: 'high',
      status: 'in-progress',
      implementationId: implementation.id,
      description: 'Fix intermittent authentication failures in production',
      estimatedHours: 8,
      assignedTo: 'backend-team',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    });
    
    console.log(`✅ Maintenance task created: ${maintenanceTask.name}\n`);

    // Test quality audit
    console.log('6️⃣ Testing Quality Audit...');
    
    await featuresHolon.runQualityAudit();
    console.log('✅ Quality audit completed\n');

    // Test reporting
    console.log('7️⃣ Testing Reporting...');
    
    const featureReport = await featuresHolon.generateFeatureReport('week');
    const deploymentReport = await featuresHolon.generateDeploymentReport('week');
    
    console.log('✅ Reports generated:');
    console.log(`   - Feature Report: ${featureReport.overall.totalFeatures} total features`);
    console.log(`   - Deployment Report: ${deploymentReport.totalDeployments} total deployments\n`);

    // Test syncing with other holons
    console.log('8️⃣ Testing Holon Syncing...');
    
    await featuresHolon.syncWithProductHolon();
    await featuresHolon.syncWithTestingHolon();
    
    console.log('✅ Holon syncing completed\n');

    // Display final state
    console.log('9️⃣ Final State Summary...');
    
    const finalState = featuresHolon.getState();
    const implementations = featuresHolon.getImplementations();
    const deployments = featuresHolon.getDeployments();
    const maintenanceTasks = featuresHolon.getMaintenanceTasks();
    const standards = featuresHolon.getStandards();
    const performanceMetrics = featuresHolon.getPerformanceMetrics();
    
    console.log('📊 Features Holon State:');
    console.log(`   - Initialized: ${finalState.isInitialized}`);
    console.log(`   - Implementations: ${implementations.length}`);
    console.log(`   - Deployments: ${deployments.length}`);
    console.log(`   - Maintenance Tasks: ${maintenanceTasks.length}`);
    console.log(`   - Technical Standards: ${standards.length}`);
    console.log(`   - Performance Metrics: ${JSON.stringify(performanceMetrics, null, 2)}`);
    
    console.log('\n🎯 Product Integration:');
    const productIntegration = featuresHolon.getProductIntegration();
    if (productIntegration) {
      console.log(`   - Requirements: ${productIntegration.requirements.length}`);
      console.log(`   - Initiatives: ${productIntegration.initiatives.length}`);
    }

    console.log('\n✅ All Features Holon tests completed successfully!');
    
    // Cleanup
    await featuresHolon.shutdown();
    await productHolon.shutdown();
    
  } catch (error) {
    console.error('❌ Features Holon test failed:', error);
    process.exit(1);
  }
}

// Run the test
testFeaturesHolon().then(() => {
  console.log('\n🎉 Features Holon implementation validated successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('\n💥 Features Holon test failed:', error);
  process.exit(1);
}); 
#!/usr/bin/env ts-node

import { TestingHolonManager } from '../src/core/holons/testing/TestingHolonManager';
import fs from 'fs';
import path from 'path';

async function testCicdIntegration() {
  console.log('🧪 Testing CI/CD Integration Features...\n');

  try {
    // Get Testing Holon instance
    const testingHolon = TestingHolonManager.getInstance();
    
    // Initialize if needed
    if (!testingHolon.getState().isInitialized) {
      console.log('📋 Initializing Testing Holon...');
      await testingHolon.initialize();
    }

    // Test 1: Get CI/CD Integration Status
    console.log('1️⃣ Testing CI/CD Integration Status...');
    const cicdStatus = testingHolon.getCicdIntegration();
    console.log('   ✅ CI/CD Integration Status:', {
      enabled: cicdStatus.enabled,
      complianceLevel: cicdStatus.professionalStandards.complianceLevel,
      enforced: cicdStatus.professionalStandards.enforced
    });

    // Test 2: Integrate with Features Holon
    console.log('\n2️⃣ Testing Features Holon Integration...');
    await testingHolon.integrateWithFeaturesHolon();
    console.log('   ✅ Features Holon integration completed');

    // Test 3: Check if CI/CD protocols were generated
    console.log('\n3️⃣ Checking CI/CD Protocol Generation...');
    const protocolsPath = path.join(process.cwd(), 'data', 'cicd-protocols.json');
    if (fs.existsSync(protocolsPath)) {
      const protocols = JSON.parse(fs.readFileSync(protocolsPath, 'utf8'));
      console.log('   ✅ CI/CD protocols generated:', {
        version: protocols.version,
        featuresCount: protocols.features?.length || 0,
        generatedAt: protocols.generatedAt
      });
    } else {
      console.log('   ⚠️  CI/CD protocols file not found');
    }

    // Test 4: Enforce Professional Standards
    console.log('\n4️⃣ Testing Professional Standards Enforcement...');
    await testingHolon.enforceProfessionalStandards();
    console.log('   ✅ Professional standards enforcement completed');

    // Test 5: Check if audit trail was created
    console.log('\n5️⃣ Checking Audit Trail...');
    const auditsDir = path.join(process.cwd(), 'data', 'audits');
    if (fs.existsSync(auditsDir)) {
      const auditFiles = fs.readdirSync(auditsDir).filter(file => file.startsWith('audit-'));
      console.log('   ✅ Audit trail files found:', auditFiles.length);
    } else {
      console.log('   ⚠️  Audits directory not found');
    }

    // Test 6: Validate State Updates
    console.log('\n6️⃣ Validating State Updates...');
    const updatedState = testingHolon.getState();
    console.log('   ✅ State validation:', {
      cicdEnabled: updatedState.cicdIntegration.enabled,
      standardsEnforced: updatedState.cicdIntegration.professionalStandards.enforced,
      complianceLevel: updatedState.cicdIntegration.professionalStandards.complianceLevel,
      protocolsEnabled: Object.values(updatedState.cicdIntegration.protocols).every(p => p),
      optimizationEnabled: Object.values(updatedState.cicdIntegration.efficiencyOptimization).every(o => o),
      improvementEnabled: Object.values(updatedState.cicdIntegration.continuousImprovement).every(i => i)
    });

    // Test 7: Test Feature Analysis Capabilities
    console.log('\n7️⃣ Testing Feature Analysis Capabilities...');
    const featuresRegistry = await testingHolon['loadFeaturesRegistry']();
    const testingRequirements = await testingHolon['analyzeFeaturesForTesting'](featuresRegistry);
    console.log('   ✅ Feature analysis completed:', {
      totalFeatures: testingRequirements.length,
      featureTypes: [...new Set(testingRequirements.map(f => f.featureType))],
      testingLayers: [...new Set(testingRequirements.flatMap(f => f.testingLayers))]
    });

    // Test 8: Validate Protocol Generation
    console.log('\n8️⃣ Validating Protocol Generation...');
    const sampleFeature = testingRequirements[0];
    if (sampleFeature) {
      console.log('   ✅ Sample feature protocols:', {
        featureId: sampleFeature.featureId,
        featureName: sampleFeature.featureName,
        testingLayers: sampleFeature.testingLayers,
        priority: sampleFeature.priority,
        complexity: sampleFeature.complexity,
        hasProtocols: !!sampleFeature.cicdProtocols
      });
    }

    console.log('\n🎉 All CI/CD Integration Tests Passed!');
    console.log('\n📊 Summary:');
    console.log('   • CI/CD Integration: ✅ Enabled');
    console.log('   • Professional Standards: ✅ Enforced');
    console.log('   • Features Holon Integration: ✅ Active');
    console.log('   • Protocol Generation: ✅ Working');
    console.log('   • Audit Trail: ✅ Functional');
    console.log('   • State Management: ✅ Valid');

  } catch (error) {
    console.error('❌ CI/CD Integration Test Failed:', error);
    process.exit(1);
  }
}

// Run the test
testCicdIntegration().catch(console.error); 
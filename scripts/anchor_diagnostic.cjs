#!/usr/bin/env node

/**
 * Anchor Diagnostic Script
 * 
 * PURPOSE: Identify where the anchor command is stalling
 */

const fs = require('fs');
const path = require('path');

async function runDiagnostics() {
  console.log('🔍 Anchor Diagnostic - Starting...');

  // Test 1: Basic file operations
  console.log('✅ Test 1: File operations');
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log('  ✅ package.json read successfully');
  } catch (error) {
    console.log('  ❌ package.json read failed:', error.message);
  }

  // Test 2: Directory scanning
  console.log('✅ Test 2: Directory scanning');
  try {
    const items = fs.readdirSync('.');
    console.log(`  ✅ Found ${items.length} items in current directory`);
  } catch (error) {
    console.log('  ❌ Directory scanning failed:', error.message);
  }

  // Test 3: Environment governance protocol
  console.log('✅ Test 3: Environment governance protocol');
  try {
    const EnvironmentGovernanceProtocol = require('./protocols/environment_variable_governance.cjs');
    console.log('  ✅ Environment governance protocol loaded');
    
    const envProtocol = new EnvironmentGovernanceProtocol();
    console.log('  ✅ Environment governance protocol instantiated');
    
    // Test scan with timeout
    const scanPromise = envProtocol.performScan();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Scan timeout')), 5000);
    });
    
    await Promise.race([scanPromise, timeoutPromise]);
    console.log('  ✅ Environment governance scan completed');
    
  } catch (error) {
    console.log('  ❌ Environment governance test failed:', error.message);
  }

  // Test 4: Milestone tracker
  console.log('✅ Test 4: Milestone tracker');
  try {
    const MilestoneTracker = require('./milestone_tracker.cjs');
    console.log('  ✅ Milestone tracker loaded');
    
    const tracker = new MilestoneTracker();
    console.log('  ✅ Milestone tracker instantiated');
    
    const analysis = await tracker.analyzeTimeline();
    console.log('  ✅ Milestone analysis completed');
    
  } catch (error) {
    console.log('  ❌ Milestone tracker test failed:', error.message);
  }

  console.log('🔍 Anchor Diagnostic - Completed');
}

runDiagnostics().catch(console.error); 
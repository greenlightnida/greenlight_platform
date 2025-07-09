#!/usr/bin/env node

/**
 * Protocol Integration Test
 * Tests protocol integration with the platform
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testProtocolIntegration() {
  console.log('🧪 Testing Protocol Integration...');
  
  try {
    // Test protocol manager integration
    const output = execSync('npx tsx -e "import('./src/core/protocols/ProtocolManager.js').then(m => console.log('ProtocolManager loaded successfully'))"', {
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    console.log('✅ Protocol integration test passed');
    return true;
  } catch (error) {
    console.error('❌ Protocol integration test failed:', error.message);
    return false;
  }
}

if (require.main === module) {
  testProtocolIntegration();
}

module.exports = { testProtocolIntegration };

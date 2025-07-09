#!/usr/bin/env node

/**
 * Launch Protocol Test
 * Tests the launch protocol with current system state
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testLaunchProtocol() {
  console.log('🧪 Testing Launch Protocol...');
  
  try {
    // Execute launch protocol
    const output = execSync('node scripts/protocols/launch_protocol.cjs', {
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    // Check for generated reports
    const launchReportPath = path.join(process.cwd(), 'LAUNCH_REPORT.json');
    const roadmapAnchorPath = path.join(process.cwd(), 'ROADMAP_ANCHOR.json');
    
    if (fs.existsSync(launchReportPath) && fs.existsSync(roadmapAnchorPath)) {
      console.log('✅ Launch protocol test passed');
      return true;
    } else {
      console.log('❌ Launch protocol test failed - reports not generated');
      return false;
    }
  } catch (error) {
    console.error('❌ Launch protocol test failed:', error.message);
    return false;
  }
}

if (require.main === module) {
  testLaunchProtocol();
}

module.exports = { testLaunchProtocol };

#!/usr/bin/env node

/**
 * Custodian Reconciliation Runner
 * Simple interface to run the custodian reconciliation module
 */

import CustodianReconciliationModule from './protocols/custodian_reconciliation_module.cjs';
import CustodianProtocol from './protocols/custodian_protocol.cjs';

// Command line interface
const command = process.argv[2] || 'reconcile';
const mode = process.argv[3] || 'full';

async function main() {
  console.log('🛡️ Custodian Reconciliation Runner');
  console.log('==================================');
  console.log(`Command: ${command}`);
  console.log(`Mode: ${mode}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('');

  try {
    switch (command) {
      case 'reconcile':
        await runReconciliation(mode);
        break;
        
      case 'start':
        await startCustodian();
        break;
        
      case 'cleanup':
        await runQuickCleanup();
        break;
        
      case 'status':
        await showStatus();
        break;
        
      case 'monitor':
        await startMonitoring();
        break;
        
      default:
        showUsage();
        break;
    }
  } catch (error) {
    console.error('❌ Custodian reconciliation failed:', error.message);
    process.exit(1);
  }
}

async function runReconciliation(mode) {
  console.log('🧹 Running Custodian Reconciliation...');
  
  const module = new CustodianReconciliationModule();
  const results = await module.execute(mode);
  
  console.log('✅ Reconciliation completed successfully');
  console.log('📊 Results Summary:');
  console.log(`   Total items processed: ${results.boundaryBackupFiles.total + results.todoItems.total + results.unusedCode.total + results.legacyComponents.total}`);
  console.log(`   Boundary backup files: ${results.boundaryBackupFiles.removed} removed, ${results.boundaryBackupFiles.archived} archived`);
  console.log(`   TODO/FIXME items: ${results.todoItems.resolved} resolved, ${results.todoItems.archived} archived`);
  console.log(`   Unused code: ${results.unusedCode.removed} removed, ${results.unusedCode.optimized} optimized`);
  console.log(`   Legacy components: ${results.legacyComponents.migrated} migrated, ${results.legacyComponents.archived} archived`);
  
  if (results.errors.length > 0) {
    console.log(`   Errors: ${results.errors.length}`);
  }
  
  if (results.warnings.length > 0) {
    console.log(`   Warnings: ${results.warnings.length}`);
  }
}

async function startCustodian() {
  console.log('🛡️ Starting Custodian Protocol...');
  
  const protocol = new CustodianProtocol();
  const result = await protocol.execute();
  
  console.log('✅ Custodian protocol started successfully');
  console.log('📊 Initial Assessment:');
  console.log(`   Health Score: ${result.assessment.healthScore}/100`);
  console.log(`   Issues Found: ${result.assessment.issues.length}`);
  console.log(`   Monitoring: ${result.monitoring}`);
  
  // Keep running for continuous monitoring
  process.on('SIGINT', async () => {
    console.log('\n🛑 Stopping Custodian Protocol...');
    await protocol.stop();
    process.exit(0);
  });
  
  console.log('🔄 Custodian is now monitoring the system continuously...');
  console.log('Press Ctrl+C to stop');
}

async function runQuickCleanup() {
  console.log('⚡ Running Quick Cleanup...');
  
  const module = new CustodianReconciliationModule();
  await module.quickCleanup();
  
  console.log('✅ Quick cleanup completed');
}

async function showStatus() {
  console.log('📊 Checking Custodian Status...');
  
  const protocol = new CustodianProtocol();
  const status = await protocol.getStatus();
  
  console.log('📊 Custodian Status:');
  console.log(`   Running: ${status.isRunning ? 'Yes' : 'No'}`);
  console.log(`   Health Score: ${status.healthMetrics.healthScore}/100`);
  console.log(`   System Status: ${status.healthMetrics.systemStatus}`);
  console.log(`   Last Reconciliation: ${status.lastReconciliation || 'Never'}`);
  console.log(`   Issue Count: ${status.healthMetrics.issueCount}`);
}

async function startMonitoring() {
  console.log('🔄 Starting Continuous Monitoring...');
  
  const module = new CustodianReconciliationModule();
  await module.startContinuousMonitoring();
  
  console.log('✅ Continuous monitoring started');
  console.log('🔄 Monitoring every 5 minutes...');
  console.log('Press Ctrl+C to stop');
  
  // Keep running
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping monitoring...');
    process.exit(0);
  });
}

function showUsage() {
  console.log('Usage: node custodian_reconcile.cjs [command] [mode]');
  console.log('');
  console.log('Commands:');
  console.log('  reconcile [mode]  - Run reconciliation (full|monitor|quick)');
  console.log('  start             - Start custodian protocol with continuous monitoring');
  console.log('  cleanup           - Run quick cleanup only');
  console.log('  status            - Show current custodian status');
  console.log('  monitor           - Start continuous monitoring only');
  console.log('');
  console.log('Modes:');
  console.log('  full              - Full reconciliation (default)');
  console.log('  monitor           - Monitor mode only');
  console.log('  quick             - Quick cleanup only');
  console.log('');
  console.log('Examples:');
  console.log('  node custodian_reconcile.cjs reconcile full');
  console.log('  node custodian_reconcile.cjs start');
  console.log('  node custodian_reconcile.cjs cleanup');
  console.log('  node custodian_reconcile.cjs status');
}

// Run the main function
main().catch(error => {
  console.error('💥 Fatal error:', error.message);
  process.exit(1);
}); 
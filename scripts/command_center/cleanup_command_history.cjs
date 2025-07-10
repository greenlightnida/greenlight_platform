#!/usr/bin/env node

/**
 * Command Center History Cleanup
 * 
 * PURPOSE: Clean up command history by fixing incomplete entries,
 * removing stale statuses, and ensuring proper command tracking.
 * 
 * USAGE: node scripts/command_center/cleanup_command_history.cjs
 */

const fs = require('fs');
const path = require('path');

const COMMAND_CENTER_LOG = path.join(process.cwd(), 'data/command_center/command_history.json');

function cleanupCommandHistory() {
  console.log('🧹 Command Center History Cleanup');
  console.log('==================================');
  
  if (!fs.existsSync(COMMAND_CENTER_LOG)) {
    console.log('✅ No command history found - nothing to clean');
    return;
  }
  
  try {
    const history = JSON.parse(fs.readFileSync(COMMAND_CENTER_LOG, 'utf8'));
    const originalCount = history.commands?.length || 0;
    
    if (!history.commands || history.commands.length === 0) {
      console.log('✅ No commands to clean');
      return;
    }
    
    console.log(`📊 Found ${originalCount} command entries`);
    
    // Clean up commands
    const cleanedCommands = [];
    const now = Date.now();
    const fiveMinutesAgo = now - 300000; // 5 minutes ago
    
    for (const command of history.commands) {
      const commandTime = new Date(command.timestamp).getTime();
      
      // Fix incomplete entries
      if (command.status === 'started') {
        // If command started more than 5 minutes ago, mark as failed
        if (commandTime < fiveMinutesAgo) {
          command.status = 'failed';
          command.details = command.details || {};
          command.details.error = 'Command timed out or was interrupted';
          command.details.cleanupReason = 'stale_started_status';
          console.log(`⚠️  Fixed stale 'started' status for ${command.command}`);
        }
      }
      
      // Remove entries older than 30 days
      const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
      if (commandTime < thirtyDaysAgo) {
        console.log(`🗑️  Removing old command: ${command.command} from ${command.timestamp}`);
        continue;
      }
      
      // Ensure required fields exist
      if (!command.details) {
        command.details = {};
      }
      
      cleanedCommands.push(command);
    }
    
    // Update history
    history.commands = cleanedCommands;
    history.last_updated = new Date().toISOString();
    history.cleanup_performed = new Date().toISOString();
    history.original_count = originalCount;
    history.cleaned_count = cleanedCommands.length;
    history.removed_count = originalCount - cleanedCommands.length;
    
    // Write cleaned history
    fs.writeFileSync(COMMAND_CENTER_LOG, JSON.stringify(history, null, 2));
    
    console.log(`✅ Cleanup completed:`);
    console.log(`   • Original entries: ${originalCount}`);
    console.log(`   • Cleaned entries: ${cleanedCommands.length}`);
    console.log(`   • Removed entries: ${originalCount - cleanedCommands.length}`);
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  cleanupCommandHistory();
}

module.exports = { cleanupCommandHistory }; 
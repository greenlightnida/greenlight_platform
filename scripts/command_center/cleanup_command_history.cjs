#!/usr/bin/env node

/**
 * Command Center History Cleanup (Authoritative)
 *
 * PURPOSE: Robustly clean up command history by fixing incomplete entries,
 * removing stale statuses, and ensuring no command can block the system.
 * This script is the authoritative source for all command history cleanup.
 *
 * USAGE: node scripts/command_center/cleanup_command_history.cjs
 *
 * LOGIC:
 * - For every 'started' command, check if a process is running (if PID is available).
 * - If no process is running, or if no PID is available and the timeout is exceeded, mark as 'failed'.
 * - Use 2-minute timeout for critical commands (launch, anchor, wrap, prewrap, etc.), 5 minutes for others.
 * - Add detailed logging for every fix.
 * - Add a summary at the end.
 * - Idempotent and safe to run at any time.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COMMAND_CENTER_LOG = path.join(process.cwd(), 'data/command_center/command_history.json');
const CRITICAL_COMMANDS = ['launch', 'anchor', 'wrap', 'prewrap', 'wrap-annihilate', 'launch-annihilate'];
const CRITICAL_TIMEOUT = 2 * 60 * 1000; // 2 minutes
const DEFAULT_TIMEOUT = 5 * 60 * 1000; // 5 minutes

function isProcessRunning(pid) {
  if (!pid) return false;
  try {
    // 'ps -p <pid>' returns 0 if running, 1 if not
    execSync(`ps -p ${pid}`);
    return true;
  } catch {
    return false;
  }
}

function cleanupCommandHistory() {
  console.log('🧹 Command Center History Cleanup (Authoritative)');
  console.log('=================================================');

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
    let fixedCount = 0;
    let removedCount = 0;
    let staleCommands = [];

    for (const command of history.commands) {
      const commandTime = new Date(command.timestamp).getTime();
      const isCritical = CRITICAL_COMMANDS.includes(command.command);
      const timeout = isCritical ? CRITICAL_TIMEOUT : DEFAULT_TIMEOUT;
      let shouldMarkFailed = false;
      let reason = '';

      // Fix incomplete entries
      if (command.status === 'started') {
        // If PID is available, check if process is running
        const pid = command.details && command.details.pid;
        if (pid) {
          if (!isProcessRunning(pid)) {
            shouldMarkFailed = true;
            reason = `No process running for PID ${pid}`;
          }
        } else {
          // No PID: use timestamp heuristic
          if (commandTime < now - timeout) {
            shouldMarkFailed = true;
            reason = `No PID, exceeded timeout (${timeout / 60000} min)`;
          }
        }
        if (shouldMarkFailed) {
          command.status = 'failed';
          command.details = command.details || {};
          command.details.error = 'Command timed out, interrupted, or process not found';
          command.details.cleanupReason = 'stale_started_status';
          command.details.cleanupTimestamp = new Date().toISOString();
          command.details.cleanupNote = reason;
          fixedCount++;
          staleCommands.push({
            command: command.command,
            timestamp: command.timestamp,
            reason
          });
          console.log(`⚠️  Fixed stale 'started' status for ${command.command} (${reason})`);
        }
      }

      // Remove entries older than 30 days
      const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
      if (commandTime < thirtyDaysAgo) {
        console.log(`🗑️  Removing old command: ${command.command} from ${command.timestamp}`);
        removedCount++;
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
    history.removed_count = removedCount;
    history.fixed_stale_count = fixedCount;
    history.stale_commands_fixed = staleCommands;

    // Write cleaned history
    fs.writeFileSync(COMMAND_CENTER_LOG, JSON.stringify(history, null, 2));

    console.log(`✅ Cleanup completed:`);
    console.log(`   • Original entries: ${originalCount}`);
    console.log(`   • Cleaned entries: ${cleanedCommands.length}`);
    console.log(`   • Removed entries: ${removedCount}`);
    console.log(`   • Fixed stale 'started' statuses: ${fixedCount}`);
    if (fixedCount > 0) {
      console.log('   • Details of fixed commands:');
      staleCommands.forEach(cmd => {
        console.log(`     - ${cmd.command} at ${cmd.timestamp} (${cmd.reason})`);
      });
    }

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
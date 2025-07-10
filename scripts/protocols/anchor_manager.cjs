#!/usr/bin/env node

/**
 * Anchor Manager - Session Anchoring Protocol
 * 
 * PURPOSE: Anchor the current session by capturing what just happened,
 * what needs to happen next, and restoring context awareness.
 * 
 * USAGE: node scripts/anchor_manager.cjs [--force]
 * 
 * FEATURES:
 * - Capture recent session events and decisions
 * - Identify immediate next steps and priorities
 * - Restore context awareness from recent history
 * - Log session state for continuity
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AnchorManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.startTime = Date.now();
    this.sessionData = {
      timestamp: new Date().toISOString(),
      recentEvents: [],
      nextSteps: [],
      contextRestored: false,
      sessionId: `anchor_${Date.now()}`
    };
    
    // Parse command line arguments
    this.args = process.argv.slice(2);
    this.forceMode = this.args.includes('--force');
  }

  async executeAnchorCommand() {
    console.log('⚓ Session Anchor Protocol');
    console.log('==========================');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`Session ID: ${this.sessionData.sessionId}`);
    console.log('');

    try {
      // Phase 1: Capture what just happened
      await this.captureRecentEvents();
      
      // Phase 2: Identify what needs to happen
      await this.identifyNextSteps();
      
      // Phase 3: Restore context awareness
      await this.restoreContextAwareness();
      
      // Phase 4: Log session state
      await this.logSessionState();
      
      console.log('✅ Session anchored successfully');
      return this.sessionData;
      
    } catch (error) {
      console.error('❌ Session anchoring failed:', error.message);
      throw error;
    }
  }

  async captureRecentEvents() {
    console.log('📝 Phase 1: Capturing Recent Events...');
    
    // Read recent command history
    const commandHistoryPath = path.join(this.projectRoot, 'data/command_center/command_history.json');
    if (fs.existsSync(commandHistoryPath)) {
      try {
        const history = JSON.parse(fs.readFileSync(commandHistoryPath, 'utf8'));
        const recentCommands = history.commands?.slice(-5) || [];
        
        this.sessionData.recentEvents = recentCommands.map(cmd => ({
          type: 'command',
          command: cmd.command,
          timestamp: cmd.timestamp,
          status: cmd.status,
          options: cmd.options
        }));
        
        console.log(`  ✅ Captured ${recentCommands.length} recent commands`);
      } catch (error) {
        console.log('  ⚠️  Could not read command history');
      }
    }

    // Read recent session data
    const sessionsDir = path.join(this.projectRoot, 'data/sessions');
    if (fs.existsSync(sessionsDir)) {
      try {
        const sessionFiles = fs.readdirSync(sessionsDir)
          .filter(file => file.endsWith('.json'))
          .sort()
          .slice(-3);
        
        for (const file of sessionFiles) {
          const sessionPath = path.join(sessionsDir, file);
          const sessionData = JSON.parse(fs.readFileSync(sessionPath, 'utf8'));
          
          this.sessionData.recentEvents.push({
            type: 'session',
            sessionId: sessionData.sessionId || file.replace('.json', ''),
            timestamp: sessionData.timestamp || sessionData.created_at,
            summary: sessionData.summary || 'Session data captured'
          });
        }
        
        console.log(`  ✅ Captured ${sessionFiles.length} recent sessions`);
      } catch (error) {
        console.log('  ⚠️  Could not read session data');
      }
    }
  }

  async identifyNextSteps() {
    console.log('🎯 Phase 2: Identifying Next Steps...');
    
    // Check for pending tasks or issues
    const roadmapPath = path.join(this.projectRoot, 'data/roadmap-actuals');
    if (fs.existsSync(roadmapPath)) {
      try {
        const roadmapFiles = fs.readdirSync(roadmapPath)
          .filter(file => file.endsWith('.json'))
          .sort()
          .slice(-5);
        
        for (const file of roadmapFiles) {
          const roadmapPath = path.join(roadmapPath, file);
          const roadmapData = JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));
          
          if (roadmapData.status === 'pending' || roadmapData.status === 'in_progress') {
            this.sessionData.nextSteps.push({
              type: 'roadmap_item',
              id: roadmapData.id || file.replace('.json', ''),
              title: roadmapData.title || 'Roadmap item',
              priority: roadmapData.priority || 'medium',
              status: roadmapData.status
            });
          }
        }
      } catch (error) {
        console.log('  ⚠️  Could not read roadmap data');
      }
    }

    // Check for recent errors or issues
    const auditsDir = path.join(this.projectRoot, 'data/audits');
    if (fs.existsSync(auditsDir)) {
      try {
        const auditFiles = fs.readdirSync(auditsDir)
          .filter(file => file.endsWith('.json'))
          .sort()
          .slice(-3);
        
        for (const file of auditFiles) {
          const auditPath = path.join(auditsDir, file);
          const auditData = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
          
          if (auditData.issues && auditData.issues.length > 0) {
            this.sessionData.nextSteps.push({
              type: 'audit_issue',
              auditId: auditData.id || file.replace('.json', ''),
              issues: auditData.issues.length,
              priority: 'high'
            });
          }
        }
      } catch (error) {
        console.log('  ⚠️  Could not read audit data');
      }
    }

    console.log(`  ✅ Identified ${this.sessionData.nextSteps.length} next steps`);
  }

  async restoreContextAwareness() {
    console.log('🧠 Phase 3: Restoring Context Awareness...');
    
    // Read system state
    const systemStatePath = path.join(this.projectRoot, 'data/system-state');
    if (fs.existsSync(systemStatePath)) {
      try {
        const stateFiles = fs.readdirSync(systemStatePath)
          .filter(file => file.endsWith('.json'))
          .sort()
          .slice(-1);
        
        if (stateFiles.length > 0) {
          const latestStatePath = path.join(systemStatePath, stateFiles[0]);
          const stateData = JSON.parse(fs.readFileSync(latestStatePath, 'utf8'));
          
          this.sessionData.systemState = {
            timestamp: stateData.timestamp,
            health: stateData.health || 'unknown',
            activeComponents: stateData.activeComponents || [],
            lastUpdate: stateData.lastUpdate
          };
          
          console.log(`  ✅ Restored system state from ${stateFiles[0]}`);
        }
      } catch (error) {
        console.log('  ⚠️  Could not read system state');
      }
    }

    // Read recent context preservation data
    const contextDir = path.join(this.projectRoot, 'data/context-preservation');
    if (fs.existsSync(contextDir)) {
      try {
        const contextFiles = fs.readdirSync(contextDir)
          .filter(file => file.endsWith('.json'))
          .sort()
          .slice(-1);
        
        if (contextFiles.length > 0) {
          const contextPath = path.join(contextDir, contextFiles[0]);
          const contextData = JSON.parse(fs.readFileSync(contextPath, 'utf8'));
          
          this.sessionData.contextData = {
            timestamp: contextData.timestamp,
            activeSession: contextData.activeSession,
            currentFocus: contextData.currentFocus,
            pendingDecisions: contextData.pendingDecisions || []
          };
          
          console.log(`  ✅ Restored context from ${contextFiles[0]}`);
        }
      } catch (error) {
        console.log('  ⚠️  Could not read context data');
      }
    }

    this.sessionData.contextRestored = true;
  }

  async logSessionState() {
    console.log('💾 Phase 4: Logging Session State...');
    
    // Create anchor session log
    const anchorDir = path.join(this.projectRoot, 'data/sessions');
    if (!fs.existsSync(anchorDir)) {
      fs.mkdirSync(anchorDir, { recursive: true });
    }
    
    const anchorLogPath = path.join(anchorDir, `anchor_${this.sessionData.sessionId}.json`);
    fs.writeFileSync(anchorLogPath, JSON.stringify(this.sessionData, null, 2));
    
    console.log(`  ✅ Session state logged to ${anchorLogPath}`);
    
    // Update command center log
    const commandCenterPath = path.join(this.projectRoot, 'data/command_center/command_history.json');
    if (fs.existsSync(commandCenterPath)) {
      try {
        const history = JSON.parse(fs.readFileSync(commandCenterPath, 'utf8'));
        if (!history.commands) history.commands = [];
        
        history.commands.push({
          timestamp: new Date().toISOString(),
          command: 'anchor',
          options: this.args,
          status: 'completed',
          sessionId: this.sessionData.sessionId,
          summary: `Anchored session with ${this.sessionData.recentEvents.length} events and ${this.sessionData.nextSteps.length} next steps`
        });
        
        history.last_updated = new Date().toISOString();
        fs.writeFileSync(commandCenterPath, JSON.stringify(history, null, 2));
        
        console.log('  ✅ Command center log updated');
      } catch (error) {
        console.log('  ⚠️  Could not update command center log');
      }
    }
  }
}

// Execute if run directly
if (require.main === module) {
  const anchorManager = new AnchorManager();
  anchorManager.executeAnchorCommand()
    .then(() => {
      console.log('\n🎯 Session anchored. Ready for next action.');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Anchor command failed:', error.message);
      process.exit(1);
    });
}

module.exports = AnchorManager; 
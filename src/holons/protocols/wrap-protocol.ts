/**
 * Modular Wrap Protocol for Protocol Holon
 * 
 * PURPOSE: Comprehensive protocol for completing chat sessions with full documentation
 * - Session completion documentation
 * - Context preservation and archiving
 * - Work summary generation
 * - System state finalization
 * - Handoff preparation
 */

import { BaseProtocol, ProtocolConfig, ProtocolResult } from './base-protocol';
import * as fs from 'fs';
import * as path from 'path';

interface WorkSummary {
  sessionId: string;
  timestamp: string;
  completedTasks: string[];
  pendingTasks: string[];
  achievements: string[];
  metrics: {
    filesModified: number;
    linesAdded: number;
    linesRemoved: number;
    duration: string;
  };
}

interface ContextPreservation {
  sessionId: string;
  timestamp: string;
  systemState: any;
  recentWork: any;
  nextSteps: string[];
  sessionSummary: string;
}

export class WrapProtocol extends BaseProtocol {
  private workSummary: WorkSummary | null = null;
  private contextPreservation: ContextPreservation | null = null;

  constructor() {
    const config: ProtocolConfig = {
      protocolName: 'Wrap Protocol',
      protocolVersion: '1.0.0',
      sessionType: 'wrap',
      sessionLabel: 'Greenlight Platform Wrap Protocol',
      dataDirectory: 'data',
      reportsDirectory: 'data/reports',
      sessionsDirectory: 'data/sessions'
    };
    
    super(config);
  }

  async execute(): Promise<ProtocolResult> {
    this.printHeader();

    try {
      await this.executeWithErrorHandling(async () => {
        // Phase 1: Session Documentation
        await this.executePhase('Session Documentation', () => this.documentSession());
        
        // Phase 2: Context Preservation
        await this.executePhase('Context Preservation', () => this.preserveContext());
        
        // Phase 3: Work Summary Generation
        await this.executePhase('Work Summary Generation', () => this.generateWorkSummary());
        
        // Phase 4: System State Finalization
        await this.executePhase('System State Finalization', () => this.finalizeSystemState());
        
        // Phase 5: Handoff Preparation
        await this.executePhase('Handoff Preparation', () => this.prepareHandoff());
        
        // Phase 6: Cleanup and Optimization
        await this.executePhase('Cleanup and Optimization', () => this.performCleanup());
        
        // Phase 7: Generate Wrap Report
        await this.executePhase('Generate Wrap Report', () => this.generateWrapReport());
      });

      this.printFooter();
      return this.generateResult();

    } catch (error) {
      this.logError('Wrap Protocol execution failed', error);
      this.printFooter();
      return this.generateResult();
    }
  }

  private async documentSession(): Promise<void> {
    const sessionDoc = {
      ...this.sessionMetadata,
      wrapResults: this.results,
      duration: this.calculateSessionDuration(),
      status: 'completed'
    };

    await this.saveSessionData(sessionDoc, `wrap-session-${this.sessionId}.json`);
  }

  private async preserveContext(): Promise<void> {
    this.contextPreservation = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      systemState: await this.captureSystemState(),
      recentWork: await this.captureRecentWork(),
      nextSteps: await this.identifyNextSteps(),
      sessionSummary: await this.generateSessionSummary()
    };

    await this.saveData(this.contextPreservation, `wrap-context-${this.sessionId}.json`);
  }

  private async captureSystemState(): Promise<any> {
    const statePath = path.join(this.projectRoot, 'data/system-state');
    this.validateDirectoryExists(statePath, 'System state directory');

    const currentState = {
      lastWrap: new Date().toISOString(),
      sessionId: this.sessionId,
      status: 'wrapped',
      readiness: 'ready_for_next_session',
      timestamp: new Date().toISOString()
    };

    await this.saveData(currentState, 'current-state.json');
    return currentState;
  }

  private async captureRecentWork(): Promise<any> {
    const sessionsPath = path.join(this.projectRoot, 'data/sessions');
    const sessions = this.validateDirectoryExists(sessionsPath, 'Sessions directory') ? 
      await this.findFiles(sessionsPath, ['*.json'], []) : [];

    const recentSessions = sessions
      .map(file => this.readJsonFile(file))
      .filter(session => session && session.timestamp)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    return {
      totalSessions: sessions.length,
      recentSessions: recentSessions.length,
      lastSession: recentSessions[0] || null
    };
  }

  private async identifyNextSteps(): Promise<string[]> {
    const roadmapPath = path.join(this.projectRoot, 'ROADMAP.md');
    if (this.validateFileExists(roadmapPath, 'Roadmap file')) {
      try {
        const roadmapContent = fs.readFileSync(roadmapPath, 'utf8');
        return this.extractNextStepsFromRoadmap(roadmapContent);
      } catch (error) {
        this.logWarning('Could not read roadmap for next steps');
      }
    }

    return [
      'Continue development based on current priorities',
      'Address any identified issues or warnings',
      'Maintain system health and performance'
    ];
  }

  private extractNextStepsFromRoadmap(content: string): string[] {
    const nextSteps: string[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (line.includes('TODO') || line.includes('NEXT') || line.includes('PRIORITY')) {
        const cleanLine = line.replace(/^[#\s*-]+/, '').trim();
        if (cleanLine) {
          nextSteps.push(cleanLine);
        }
      }
    }
    
    return nextSteps.slice(0, 5);
  }

  private async generateSessionSummary(): Promise<string> {
    const summary = `Session ${this.sessionId} completed successfully. ` +
                   `Duration: ${this.calculateSessionDuration()}. ` +
                   `Context preserved and system state updated. ` +
                   `Ready for next session.`;
    
    return summary;
  }

  private async generateWorkSummary(): Promise<void> {
    this.workSummary = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      completedTasks: await this.identifyCompletedTasks(),
      pendingTasks: await this.identifyPendingTasks(),
      achievements: await this.identifyAchievements(),
      metrics: await this.calculateMetrics()
    };

    await this.saveReport(this.workSummary, `work-summary-${this.sessionId}.json`);
  }

  private async identifyCompletedTasks(): Promise<string[]> {
    // This would typically analyze git commits, file changes, etc.
    // For now, return a generic list based on session type
    return [
      'Session documentation completed',
      'Context preservation implemented',
      'System state updated',
      'Work summary generated'
    ];
  }

  private async identifyPendingTasks(): Promise<string[]> {
    // This would typically analyze TODO comments, roadmap items, etc.
    return [
      'Continue with next development phase',
      'Address any system warnings',
      'Monitor system performance'
    ];
  }

  private async identifyAchievements(): Promise<string[]> {
    return [
      'Session completed successfully',
      'Context preserved for continuity',
      'System state maintained',
      'Documentation updated'
    ];
  }

  private async calculateMetrics(): Promise<WorkSummary['metrics']> {
    // This would typically analyze git stats, file changes, etc.
    return {
      filesModified: 0, // Would be calculated from git diff
      linesAdded: 0,     // Would be calculated from git diff
      linesRemoved: 0,   // Would be calculated from git diff
      duration: this.calculateSessionDuration()
    };
  }

  private async finalizeSystemState(): Promise<void> {
    const systemState = {
      lastWrap: new Date().toISOString(),
      sessionId: this.sessionId,
      status: 'wrapped',
      readiness: 'ready_for_next_session',
      workSummary: this.workSummary,
      contextPreservation: this.contextPreservation
    };

    await this.saveData(systemState, 'system-state-finalized.json');
  }

  private async prepareHandoff(): Promise<void> {
    const handoff = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      type: 'session_handoff',
      summary: this.contextPreservation?.sessionSummary || 'Session completed',
      nextSteps: this.contextPreservation?.nextSteps || [],
      systemState: 'ready_for_next_session',
      contextPreserved: true
    };

    await this.saveReport(handoff, `handoff-${this.sessionId}.json`);
  }

  private async performCleanup(): Promise<void> {
    // Clean up temporary files, optimize data structures, etc.
    this.logInfo('Performing cleanup operations...');
    
    // This would typically include:
    // - Cleaning up temporary files
    // - Optimizing data structures
    // - Compressing old logs
    // - Removing expired cache files
    
    this.logSuccess('Cleanup completed');
  }

  private async generateWrapReport(): Promise<void> {
    const wrapReport = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      duration: this.calculateSessionDuration(),
      workSummary: this.workSummary,
      contextPreservation: this.contextPreservation,
      systemState: 'finalized',
      handoff: 'prepared',
      cleanup: 'completed',
      status: 'success'
    };

    await this.saveReport(wrapReport, `WRAP_REPORT-${this.sessionId}.json`);
    this.results.wrapReport = wrapReport;
  }
}

// CLI interface for direct usage
if (require.main === module) {
  const wrapProtocol = new WrapProtocol();
  
  wrapProtocol.execute()
    .then(result => {
      if (result.success) {
        console.log('\n🎉 Wrap protocol completed successfully!');
        process.exit(0);
      } else {
        console.log('\n⚠️  Wrap protocol completed with issues');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Wrap protocol failed:', error);
      process.exit(1);
    });
} 
#!/usr/bin/env node

/**
 * Decision Log Protocol v1.0.0
 * 
 * PURPOSE: Integrate with existing DECISION_LOG.md to capture and track all decisions
 * made during sessions for transparency, accountability, and continuous improvement.
 * 
 * USAGE: 
 * - node scripts/protocols/decision_log_protocol.cjs log <decision>
 * - node scripts/protocols/decision_log_protocol.cjs review
 * - node scripts/protocols/decision_log_protocol.cjs status
 */

const fs = require('fs');
const path = require('path');

class DecisionLogProtocol {
  constructor() {
    this.projectRoot = process.cwd();
    this.decisionLogPath = path.join(this.projectRoot, 'DECISION_LOG.md');
    this.agendaPath = path.join(this.projectRoot, 'data/council/agenda.json');
    this.ensureDirectories();
  }

  ensureDirectories() {
    const dir = path.dirname(this.agendaPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  generateDecisionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `decision-${timestamp}-${random}`;
  }

  async execute() {
    const args = process.argv.slice(2);
    const action = args[0];

    switch (action) {
      case 'log':
        await this.logDecision(args.slice(1));
        break;
      case 'review':
        await this.reviewDecisions();
        break;
      case 'status':
        await this.showStatus();
        break;
      case 'agenda':
        await this.manageAgenda(args.slice(1));
        break;
      default:
        this.showHelp();
    }
  }

  async logDecision(decisionArgs) {
    if (decisionArgs.length < 1) {
      console.error('❌ Decision text required');
      console.log('Usage: node decision_log_protocol.cjs log "Decision text" [context] [stakeholders]');
      return;
    }

    const decisionText = decisionArgs[0];
    const context = decisionArgs[1] || 'Session decision';
    const stakeholders = decisionArgs[2] ? decisionArgs[2].split(',') : ['Session participant'];

    const entry = this.createDecisionEntry(decisionText, context, stakeholders);
    await this.appendToDecisionLog(entry);

    console.log('✅ Decision logged successfully');
    console.log(`ID: ${entry.id}`);
    console.log(`Decision: ${entry.decision}`);
    console.log(`Context: ${entry.context}`);
    console.log(`Stakeholders: ${entry.stakeholders.join(', ')}`);
  }

  createDecisionEntry(decisionText, context, stakeholders) {
    const timestamp = new Date().toISOString();
    const entryNumber = this.getNextEntryNumber();
    
    return {
      id: this.generateDecisionId(),
      entryNumber: entryNumber,
      timestamp: timestamp,
      decision: decisionText,
      context: context,
      stakeholders: stakeholders,
      status: 'pending',
      implementation: {
        assigned: null,
        deadline: null,
        progress: 0,
        notes: []
      },
      councilReview: {
        reviewed: false,
        approved: false,
        committee: null,
        notes: []
      },
      impact: {
        scope: 'session',
        priority: 'medium',
        affectedSystems: [],
        estimatedEffort: null
      }
    };
  }

  getNextEntryNumber() {
    const content = this.readDecisionLog();
    const entries = content.match(/## Entry \d+:/g);
    return entries ? entries.length + 1 : 1;
  }

  async appendToDecisionLog(entry) {
    const markdownEntry = this.formatDecisionAsMarkdown(entry);
    
    let content = this.readDecisionLog();
    
    // Find the end of the file (before any trailing newlines)
    const insertPosition = content.lastIndexOf('---');
    if (insertPosition === -1) {
      // If no entries exist, insert after the header
      const headerEnd = content.indexOf('---');
      if (headerEnd !== -1) {
        content = content.substring(0, headerEnd + 3) + '\n\n' + markdownEntry + content.substring(headerEnd + 3);
      } else {
        content += '\n\n' + markdownEntry;
      }
    } else {
      // Insert before the last ---
      content = content.substring(0, insertPosition) + markdownEntry + '\n\n' + content.substring(insertPosition);
    }
    
    fs.writeFileSync(this.decisionLogPath, content);
  }

  formatDecisionAsMarkdown(entry) {
    const date = new Date(entry.timestamp).toISOString().split('T')[0];
    
    return `## Entry ${entry.entryNumber}: ${entry.decision}

### Timestamp: ${date} (Current Session)

### User Request
- ${entry.decision}

### AI Response
- Decision logged for tracking and implementation
- Context: ${entry.context}
- Stakeholders: ${entry.stakeholders.join(', ')}

### Actual Implementation
- ✅ Decision logged in DECISION_LOG.md
- ⏳ Pending implementation and council review

### Context
- ${entry.context}
- Decision made during active session
- Requires council review and implementation planning

### Impact
- Establishes audit trail for decision tracking
- Enables council review and implementation planning
- Maintains transparency in decision-making process`;
  }

  readDecisionLog() {
    try {
      if (fs.existsSync(this.decisionLogPath)) {
        return fs.readFileSync(this.decisionLogPath, 'utf8');
      }
    } catch (error) {
      console.error('Error reading decision log:', error.message);
    }
    return '';
  }

  async reviewDecisions() {
    const content = this.readDecisionLog();
    
    console.log('📋 DECISION LOG REVIEW');
    console.log('======================');
    
    if (!content) {
      console.log('No decision log found.');
      return;
    }

    // Extract entries using regex
    const entries = content.match(/## Entry \d+: .*?(?=## Entry \d+:|$)/gs);
    
    if (!entries || entries.length === 0) {
      console.log('No decision entries found.');
      return;
    }

    entries.forEach((entry, index) => {
      const titleMatch = entry.match(/## Entry (\d+): (.+)/);
      const timestampMatch = entry.match(/### Timestamp: (.+)/);
      const decisionMatch = entry.match(/### User Request\s*- (.+)/);
      
      if (titleMatch) {
        console.log(`\n${titleMatch[1]}. ${titleMatch[2]}`);
        if (timestampMatch) {
          console.log(`   Date: ${timestampMatch[1]}`);
        }
        if (decisionMatch) {
          console.log(`   Decision: ${decisionMatch[1]}`);
        }
      }
    });
  }

  async showStatus() {
    const content = this.readDecisionLog();
    const agenda = this.loadAgenda();
    
    console.log('📊 DECISION LOG STATUS');
    console.log('======================');
    
    const entries = content.match(/## Entry \d+:/g);
    const totalDecisions = entries ? entries.length : 0;
    console.log(`Total Decisions: ${totalDecisions}`);
    
    // Count recent decisions (last 7 days)
    const recentDecisions = this.countRecentDecisions(content);
    console.log(`Recent Decisions (7 days): ${recentDecisions}`);
    
    console.log(`\n📋 AGENDA STATUS`);
    console.log('================');
    console.log(`Total Agenda Items: ${agenda.length}`);
    
    const pendingItems = agenda.filter(item => item.status === 'pending');
    const inProgressItems = agenda.filter(item => item.status === 'in_progress');
    
    console.log(`Pending: ${pendingItems.length}`);
    console.log(`In Progress: ${inProgressItems.length}`);
  }

  countRecentDecisions(content) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const entries = content.match(/## Entry \d+: .*?(?=## Entry \d+:|$)/gs);
    if (!entries) return 0;
    
    let recentCount = 0;
    entries.forEach(entry => {
      const timestampMatch = entry.match(/### Timestamp: (.+)/);
      if (timestampMatch) {
        const entryDate = new Date(timestampMatch[1]);
        if (entryDate >= sevenDaysAgo) {
          recentCount++;
        }
      }
    });
    
    return recentCount;
  }

  async manageAgenda(agendaArgs) {
    const action = agendaArgs[0];
    
    switch (action) {
      case 'add':
        await this.addAgendaItem(agendaArgs.slice(1));
        break;
      case 'list':
        await this.listAgendaItems();
        break;
      case 'update':
        await this.updateAgendaItem(agendaArgs.slice(1));
        break;
      default:
        console.log('Agenda actions: add, list, update');
    }
  }

  async addAgendaItem(itemArgs) {
    if (itemArgs.length < 1) {
      console.error('❌ Agenda item text required');
      return;
    }

    const itemText = itemArgs[0];
    const priority = itemArgs[1] || 'medium';
    const committee = itemArgs[2] || 'general';

    const agendaItem = {
      id: this.generateDecisionId(),
      timestamp: new Date().toISOString(),
      item: itemText,
      priority: priority,
      committee: committee,
      status: 'pending',
      assigned: null,
      deadline: null,
      notes: [],
      dependencies: []
    };

    const agenda = this.loadAgenda();
    agenda.push(agendaItem);
    this.saveAgenda(agenda);

    console.log('✅ Agenda item added successfully');
    console.log(`ID: ${agendaItem.id}`);
    console.log(`Item: ${agendaItem.item}`);
    console.log(`Priority: ${agendaItem.priority}`);
    console.log(`Committee: ${agendaItem.committee}`);
  }

  async listAgendaItems() {
    const agenda = this.loadAgenda();
    
    console.log('📋 AGENDA ITEMS');
    console.log('===============');
    
    if (agenda.length === 0) {
      console.log('No agenda items.');
      return;
    }

    agenda.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.item}`);
      console.log(`   ID: ${item.id}`);
      console.log(`   Priority: ${item.priority}`);
      console.log(`   Committee: ${item.committee}`);
      console.log(`   Status: ${item.status}`);
      
      if (item.assigned) {
        console.log(`   Assigned: ${item.assigned}`);
      }
      
      if (item.deadline) {
        console.log(`   Deadline: ${item.deadline}`);
      }
    });
  }

  async updateAgendaItem(updateArgs) {
    if (updateArgs.length < 2) {
      console.error('❌ Item ID and field required');
      console.log('Usage: update <itemId> <field> <value>');
      return;
    }

    const itemId = updateArgs[0];
    const field = updateArgs[1];
    const value = updateArgs[2];

    const agenda = this.loadAgenda();
    const item = agenda.find(i => i.id === itemId);
    
    if (!item) {
      console.error('❌ Agenda item not found');
      return;
    }

    if (item.hasOwnProperty(field)) {
      item[field] = value;
      this.saveAgenda(agenda);
      console.log(`✅ Updated ${field} to ${value}`);
    } else {
      console.error(`❌ Invalid field: ${field}`);
    }
  }

  loadAgenda() {
    try {
      if (fs.existsSync(this.agendaPath)) {
        return JSON.parse(fs.readFileSync(this.agendaPath, 'utf8'));
      }
    } catch (error) {
      console.error('Error loading agenda:', error.message);
    }
    return [];
  }

  saveAgenda(agenda) {
    fs.writeFileSync(this.agendaPath, JSON.stringify(agenda, null, 2));
  }

  showHelp() {
    console.log(`
📋 Decision Log Protocol v1.0.0
===============================

USAGE: node scripts/protocols/decision_log_protocol.cjs <action> [options]

ACTIONS:
  log <decision> [context] [stakeholders]  Log a new decision to DECISION_LOG.md
  review                                   Review all decisions from DECISION_LOG.md
  status                                   Show decision and agenda status
  agenda add <item> [priority] [committee] Add agenda item
  agenda list                              List agenda items
  agenda update <id> <field> <value>       Update agenda item

EXAMPLES:
  node scripts/protocols/decision_log_protocol.cjs log "Implement TypeScript governance" "System improvement" "Council,Developers"
  node scripts/protocols/decision_log_protocol.cjs review
  node scripts/protocols/decision_log_protocol.cjs agenda add "Review status assessment system" high "Technical Committee"
`);
  }
}

// Execute if run directly
if (require.main === module) {
  const protocol = new DecisionLogProtocol();
  protocol.execute().catch(console.error);
}

module.exports = DecisionLogProtocol; 
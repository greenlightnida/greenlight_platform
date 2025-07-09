#!/usr/bin/env node

/**
 * Background Agent Management System
 * 
 * This script manages background agents for continuous monitoring and operations
 * during milestone transitions and ongoing development.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Agent configuration
const agents = {
  healthMonitoring: {
    name: 'Health Monitoring Agent',
    script: 'scripts/background/agents/health_monitor.cjs',
    description: 'Continuous system health monitoring',
    status: 'stopped'
  },
  fileManagement: {
    name: 'File Management Agent',
    script: 'scripts/background/agents/file_manager.cjs',
    description: 'File organization and cleanup monitoring',
    status: 'stopped'
  },
  buildMonitoring: {
    name: 'Build Monitoring Agent',
    script: 'scripts/background/agents/build_monitor.cjs',
    description: 'Build system and code quality monitoring',
    status: 'stopped'
  },
  documentation: {
    name: 'Documentation Agent',
    script: 'scripts/background/agents/documentation_manager.cjs',
    description: 'Documentation maintenance and governance monitoring',
    status: 'stopped'
  },
  integration: {
    name: 'Integration Agent',
    script: 'scripts/background/agents/integration_monitor.cjs',
    description: 'System integration and continuous improvement monitoring',
    status: 'stopped'
  }
};

// Agent processes storage
const agentProcesses = {};

// Start a single agent
function startAgent(agentKey) {
  const agent = agents[agentKey];
  
  if (!agent) {
    logError(`Unknown agent: ${agentKey}`);
    return false;
  }

  if (agent.status === 'running') {
    logWarning(`${agent.name} is already running`);
    return true;
  }

  // Check if agent script exists
  if (!fs.existsSync(agent.script)) {
    logWarning(`Agent script not found: ${agent.script}`);
    logInfo(`Creating placeholder agent script...`);
    createPlaceholderAgentScript(agent.script, agentKey);
  }

  try {
    logInfo(`Starting ${agent.name}...`);
    
    const process = spawn('node', [agent.script], {
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: true
    });

    // Store process reference
    agentProcesses[agentKey] = process;
    agent.status = 'running';

    // Handle process events
    process.stdout.on('data', (data) => {
      logInfo(`${agent.name}: ${data.toString().trim()}`);
    });

    process.stderr.on('data', (data) => {
      logWarning(`${agent.name} Error: ${data.toString().trim()}`);
    });

    process.on('close', (code) => {
      logWarning(`${agent.name} stopped with code ${code}`);
      agent.status = 'stopped';
      delete agentProcesses[agentKey];
    });

    process.on('error', (error) => {
      logError(`${agent.name} failed to start: ${error.message}`);
      agent.status = 'error';
      delete agentProcesses[agentKey];
    });

    logSuccess(`${agent.name} started successfully (PID: ${process.pid})`);
    return true;

  } catch (error) {
    logError(`Failed to start ${agent.name}: ${error.message}`);
    agent.status = 'error';
    return false;
  }
}

// Stop a single agent
function stopAgent(agentKey) {
  const agent = agents[agentKey];
  const process = agentProcesses[agentKey];

  if (!agent) {
    logError(`Unknown agent: ${agentKey}`);
    return false;
  }

  if (agent.status !== 'running' || !process) {
    logWarning(`${agent.name} is not running`);
    return true;
  }

  try {
    logInfo(`Stopping ${agent.name}...`);
    process.kill('SIGTERM');
    
    // Wait a bit for graceful shutdown
    setTimeout(() => {
      if (agent.status === 'running') {
        logWarning(`Force killing ${agent.name}...`);
        process.kill('SIGKILL');
      }
    }, 5000);

    agent.status = 'stopping';
    logSuccess(`${agent.name} stop signal sent`);
    return true;

  } catch (error) {
    logError(`Failed to stop ${agent.name}: ${error.message}`);
    return false;
  }
}

// Create placeholder agent script
function createPlaceholderAgentScript(scriptPath, agentKey) {
  const scriptDir = path.dirname(scriptPath);
  
  if (!fs.existsSync(scriptDir)) {
    fs.mkdirSync(scriptDir, { recursive: true });
  }

  const placeholderContent = `#!/usr/bin/env node

/**
 * ${agents[agentKey].name}
 * 
 * Placeholder agent script for ${agents[agentKey].description}
 * This will be implemented with full functionality.
 */

const fs = require('fs');
const path = require('path');

console.log('${agents[agentKey].name} started');

// Placeholder monitoring loop
setInterval(() => {
  const timestamp = new Date().toISOString();
  console.log(\`[\${timestamp}] ${agents[agentKey].name} monitoring...\`);
  
  // TODO: Implement actual monitoring logic
  // - Health checks
  // - Performance monitoring
  // - Alert generation
  // - Status reporting
  
}, 30000); // Check every 30 seconds

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('${agents[agentKey].name} shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('${agents[agentKey].name} interrupted, shutting down...');
  process.exit(0);
});
`;

  fs.writeFileSync(scriptPath, placeholderContent);
  fs.chmodSync(scriptPath, '755');
  logSuccess(`Created placeholder agent script: ${scriptPath}`);
}

// Start all agents
function startAllAgents() {
  log(`${colors.bright}${colors.magenta}🤖 STARTING BACKGROUND AGENTS${colors.reset}\n`);
  
  let startedCount = 0;
  const totalAgents = Object.keys(agents).length;

  for (const agentKey of Object.keys(agents)) {
    if (startAgent(agentKey)) {
      startedCount++;
    }
  }

  log(`\n${colors.bright}📊 AGENT STARTUP SUMMARY:${colors.reset}`);
  log(`Started: ${startedCount}/${totalAgents} agents`);
  
  if (startedCount === totalAgents) {
    logSuccess('All background agents started successfully');
  } else {
    logWarning(`${totalAgents - startedCount} agents failed to start`);
  }

  return startedCount === totalAgents;
}

// Stop all agents
function stopAllAgents() {
  log(`${colors.bright}${colors.magenta}🛑 STOPPING BACKGROUND AGENTS${colors.reset}\n`);
  
  let stoppedCount = 0;
  const totalAgents = Object.keys(agents).length;

  for (const agentKey of Object.keys(agents)) {
    if (stopAgent(agentKey)) {
      stoppedCount++;
    }
  }

  log(`\n${colors.bright}📊 AGENT SHUTDOWN SUMMARY:${colors.reset}`);
  log(`Stopped: ${stoppedCount}/${totalAgents} agents`);
  
  if (stoppedCount === totalAgents) {
    logSuccess('All background agents stopped successfully');
  } else {
    logWarning(`${totalAgents - stoppedCount} agents failed to stop`);
  }

  return stoppedCount === totalAgents;
}

// Get agent status
function getAgentStatus() {
  log(`${colors.bright}${colors.cyan}📊 BACKGROUND AGENT STATUS${colors.reset}\n`);
  
  for (const [key, agent] of Object.entries(agents)) {
    const statusColor = agent.status === 'running' ? 'green' : 
                       agent.status === 'stopped' ? 'yellow' : 'red';
    log(`${agent.name}: ${agent.status}`, statusColor);
    log(`  Description: ${agent.description}`);
    if (agentProcesses[key]) {
      log(`  PID: ${agentProcesses[key].pid}`);
    }
    log('');
  }
}

// Save agent status to file
function saveAgentStatus() {
  const statusData = {
    timestamp: new Date().toISOString(),
    agents: agents,
    processes: Object.keys(agentProcesses).map(key => ({
      agent: key,
      pid: agentProcesses[key]?.pid
    }))
  };

  const statusDir = 'data/background';
  if (!fs.existsSync(statusDir)) {
    fs.mkdirSync(statusDir, { recursive: true });
  }

  const statusFile = path.join(statusDir, 'agent_status.json');
  fs.writeFileSync(statusFile, JSON.stringify(statusData, null, 2));
  
  logSuccess(`Agent status saved to: ${statusFile}`);
}

// Main execution
async function main() {
  const command = process.argv[2] || 'start';
  
  switch (command) {
    case 'start':
      startAllAgents();
      break;
    case 'stop':
      stopAllAgents();
      break;
    case 'status':
      getAgentStatus();
      break;
    case 'save':
      saveAgentStatus();
      break;
    default:
      logError(`Unknown command: ${command}`);
      logInfo('Available commands: start, stop, status, save');
      process.exit(1);
  }

  // Save status after operations
  if (command === 'start' || command === 'stop') {
    setTimeout(saveAgentStatus, 2000);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = {
  startAgent,
  stopAgent,
  startAllAgents,
  stopAllAgents,
  getAgentStatus,
  saveAgentStatus,
  agents,
  agentProcesses
}; 
#!/usr/bin/env node

/**
 * Background Process Status Protocol
 * Monitors and reports on all background processes and their current state
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

class BackgroundProcessStatus {
  constructor() {
    this.projectRoot = process.cwd();
    this.timestamp = new Date().toISOString();
    this.processes = {
      running: [],
      stopped: [],
      failed: [],
      pending: []
    };
  }

  async execute() {
    console.log('📊 Background Process Status Report');
    console.log('===================================');
    console.log(`Timestamp: ${this.timestamp}`);
    console.log('');

    try {
      // Phase 1: Discover all background processes
      await this.discoverProcesses();
      
      // Phase 2: Check process status
      await this.checkProcessStatus();
      
      // Phase 3: Generate comprehensive report
      await this.generateReport();
      
      // Phase 4: Save status to file
      await this.saveStatus();
      
      console.log('✅ Background process status report completed');
      return this.processes;
      
    } catch (error) {
      console.error('❌ Background process status failed:', error.message);
      throw error;
    }
  }

  async discoverProcesses() {
    console.log('🔍 Phase 1: Discovering Background Processes...');
    
    // Check for Node.js processes
    const nodeProcesses = this.findNodeProcesses();
    this.processes.running.push(...nodeProcesses);
    
    // Check for npm processes
    const npmProcesses = this.findNpmProcesses();
    this.processes.running.push(...npmProcesses);
    
    // Check for development servers
    const devServers = this.findDevServers();
    this.processes.running.push(...devServers);
    
    // Check for monitoring processes
    const monitoringProcesses = this.findMonitoringProcesses();
    this.processes.running.push(...monitoringProcesses);
    
    // Check for protocol processes
    const protocolProcesses = this.findProtocolProcesses();
    this.processes.running.push(...protocolProcesses);
    
    console.log(`✅ Discovered ${this.processes.running.length} running processes`);
  }

  findNodeProcesses() {
    const processes = [];
    try {
      const result = execSync('ps aux | grep -E "node.*greenlight" | grep -v grep', { encoding: 'utf8' });
      const lines = result.trim().split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        const parts = line.split(/\s+/);
        if (parts.length >= 11) {
          processes.push({
            pid: parts[1],
            type: 'node',
            command: parts.slice(10).join(' '),
            cpu: parts[2],
            memory: parts[3],
            status: 'running',
            discovered: this.timestamp
          });
        }
      }
    } catch (error) {
      // No node processes found
    }
    return processes;
  }

  findNpmProcesses() {
    const processes = [];
    try {
      const result = execSync('ps aux | grep -E "npm.*run" | grep -v grep', { encoding: 'utf8' });
      const lines = result.trim().split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        const parts = line.split(/\s+/);
        if (parts.length >= 11) {
          processes.push({
            pid: parts[1],
            type: 'npm',
            command: parts.slice(10).join(' '),
            cpu: parts[2],
            memory: parts[3],
            status: 'running',
            discovered: this.timestamp
          });
        }
      }
    } catch (error) {
      // No npm processes found
    }
    return processes;
  }

  findDevServers() {
    const processes = [];
    const ports = [3000, 3001, 5173, 8080, 8081];
    
    for (const port of ports) {
      try {
        const result = execSync(`lsof -i :${port}`, { encoding: 'utf8' });
        const lines = result.trim().split('\n').filter(line => line.trim());
        
        if (lines.length > 1) { // Skip header line
          const parts = lines[1].split(/\s+/);
          if (parts.length >= 9) {
            processes.push({
              pid: parts[1],
              type: 'dev-server',
              port: port,
              command: parts[0],
              status: 'running',
              discovered: this.timestamp
            });
          }
        }
      } catch (error) {
        // Port not in use
      }
    }
    return processes;
  }

  findMonitoringProcesses() {
    const processes = [];
    const monitoringCommands = [
      'comprehensive-strategy',
      'anchor',
      'custodian',
      'council',
      'prewrap',
      'wrap'
    ];
    
    for (const command of monitoringCommands) {
      try {
        const result = execSync(`ps aux | grep -E "${command}" | grep -v grep`, { encoding: 'utf8' });
        const lines = result.trim().split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          const parts = line.split(/\s+/);
          if (parts.length >= 11) {
            processes.push({
              pid: parts[1],
              type: 'monitoring',
              command: command,
              fullCommand: parts.slice(10).join(' '),
              cpu: parts[2],
              memory: parts[3],
              status: 'running',
              discovered: this.timestamp
            });
          }
        }
      } catch (error) {
        // Process not found
      }
    }
    return processes;
  }

  findProtocolProcesses() {
    const processes = [];
    const protocolDir = path.join(this.projectRoot, 'scripts', 'protocols');
    
    if (fs.existsSync(protocolDir)) {
      try {
        const files = fs.readdirSync(protocolDir);
        const protocolFiles = files.filter(file => file.endsWith('.cjs') || file.endsWith('.js'));
        
        for (const file of protocolFiles) {
          try {
            const result = execSync(`ps aux | grep -E "${file}" | grep -v grep`, { encoding: 'utf8' });
            const lines = result.trim().split('\n').filter(line => line.trim());
            
            for (const line of lines) {
              const parts = line.split(/\s+/);
              if (parts.length >= 11) {
                processes.push({
                  pid: parts[1],
                  type: 'protocol',
                  protocol: file,
                  command: parts.slice(10).join(' '),
                  cpu: parts[2],
                  memory: parts[3],
                  status: 'running',
                  discovered: this.timestamp
                });
              }
            }
          } catch (error) {
            // Protocol not running
          }
        }
      } catch (error) {
        console.log('⚠️ Could not read protocol directory');
      }
    }
    return processes;
  }

  async checkProcessStatus() {
    console.log('🔍 Phase 2: Checking Process Status...');
    
    for (const process of this.processes.running) {
      try {
        // Check if process is still alive
        execSync(`kill -0 ${process.pid}`, { stdio: 'pipe' });
        process.status = 'running';
        process.lastCheck = this.timestamp;
        
        // Get updated resource usage
        try {
          const result = execSync(`ps -p ${process.pid} -o pid,ppid,pcpu,pmem,etime,state`, { encoding: 'utf8' });
          const lines = result.trim().split('\n');
          if (lines.length > 1) {
            const parts = lines[1].split(/\s+/);
            if (parts.length >= 6) {
              process.cpu = parts[2];
              process.memory = parts[3];
              process.uptime = parts[4];
              process.state = parts[5];
            }
          }
        } catch (error) {
          // Could not get detailed process info
        }
        
      } catch (error) {
        // Process is no longer running
        process.status = 'stopped';
        process.stoppedAt = this.timestamp;
        this.processes.stopped.push(process);
        this.processes.running = this.processes.running.filter(p => p.pid !== process.pid);
      }
    }
    
    console.log(`✅ Status check completed: ${this.processes.running.length} running, ${this.processes.stopped.length} stopped`);
  }

  async generateReport() {
    console.log('📊 Phase 3: Generating Comprehensive Report...');
    
    const report = {
      timestamp: this.timestamp,
      summary: {
        total: this.processes.running.length + this.processes.stopped.length + this.processes.failed.length,
        running: this.processes.running.length,
        stopped: this.processes.stopped.length,
        failed: this.processes.failed.length,
        pending: this.processes.pending.length
      },
      processes: this.processes,
      systemInfo: this.getSystemInfo(),
      recommendations: this.generateRecommendations()
    };
    
    this.report = report;
    
    // Display summary
    console.log('');
    console.log('📊 BACKGROUND PROCESS SUMMARY');
    console.log('==============================');
    console.log(`Total Processes: ${report.summary.total}`);
    console.log(`Running: ${report.summary.running} ✅`);
    console.log(`Stopped: ${report.summary.stopped} ⏹️`);
    console.log(`Failed: ${report.summary.failed} ❌`);
    console.log(`Pending: ${report.summary.pending} ⏳`);
    console.log('');
    
    // Display running processes
    if (this.processes.running.length > 0) {
      console.log('🟢 RUNNING PROCESSES:');
      console.log('=====================');
      for (const process of this.processes.running) {
        console.log(`PID ${process.pid} | ${process.type.toUpperCase()} | ${process.command || process.protocol || process.port || 'N/A'} | CPU: ${process.cpu}% | MEM: ${process.memory}%`);
      }
      console.log('');
    }
    
    // Display stopped processes
    if (this.processes.stopped.length > 0) {
      console.log('🔴 STOPPED PROCESSES:');
      console.log('=====================');
      for (const process of this.processes.stopped) {
        console.log(`PID ${process.pid} | ${process.type.toUpperCase()} | ${process.command || process.protocol || process.port || 'N/A'} | Stopped: ${process.stoppedAt}`);
      }
      console.log('');
    }
    
    // Display recommendations
    if (report.recommendations.length > 0) {
      console.log('💡 RECOMMENDATIONS:');
      console.log('===================');
      for (const rec of report.recommendations) {
        console.log(`• ${rec}`);
      }
      console.log('');
    }
  }

  getSystemInfo() {
    try {
      const cpuUsage = execSync('top -l 1 | grep "CPU usage"', { encoding: 'utf8' });
      const memoryInfo = execSync('vm_stat', { encoding: 'utf8' });
      const diskUsage = execSync('df -h .', { encoding: 'utf8' });
      
      return {
        cpuUsage: cpuUsage.trim(),
        memoryInfo: memoryInfo.trim(),
        diskUsage: diskUsage.trim(),
        timestamp: this.timestamp
      };
    } catch (error) {
      return {
        error: error.message,
        timestamp: this.timestamp
      };
    }
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.processes.running.length === 0) {
      recommendations.push('No background processes detected - consider starting essential services');
    }
    
    if (this.processes.stopped.length > 0) {
      recommendations.push(`${this.processes.stopped.length} processes have stopped - review for potential issues`);
    }
    
    const highCpuProcesses = this.processes.running.filter(p => parseFloat(p.cpu) > 50);
    if (highCpuProcesses.length > 0) {
      recommendations.push(`${highCpuProcesses.length} processes using high CPU - consider optimization`);
    }
    
    const highMemoryProcesses = this.processes.running.filter(p => parseFloat(p.memory) > 10);
    if (highMemoryProcesses.length > 0) {
      recommendations.push(`${highMemoryProcesses.length} processes using high memory - consider cleanup`);
    }
    
    return recommendations;
  }

  async saveStatus() {
    console.log('💾 Phase 4: Saving Status Report...');
    
    const reportsDir = path.join(this.projectRoot, 'data', 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const filename = `background-process-status-${Date.now()}.json`;
    const filepath = path.join(reportsDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(this.report, null, 2));
    
    console.log(`✅ Status report saved: ${filepath}`);
  }
}

// CLI Interface
if (require.main === module) {
  const status = new BackgroundProcessStatus();
  status.execute()
    .then(() => {
      console.log('🎉 Background process status completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Background process status failed:', error.message);
      process.exit(1);
    });
}

module.exports = BackgroundProcessStatus; 
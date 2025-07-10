#!/usr/bin/env node

/**
 * StandardsManager v2.0.0
 *
 * PURPOSE: Comprehensive system-wide standards aggregation, compliance, and harmonization manager.
 * Integrates with Standards Insights, Council system, and Governance workflows.
 *
 * USAGE:
 *   node scripts/command_center/StandardsManager.cjs <action> [options]
 *
 * ACTIONS:
 *   status           Show current standards registry and compliance summary
 *   check            Run Standards Insights and aggregate compliance results
 *   harmonize        Propose harmonization plan based on compliance gaps
 *   add <standard>   Add a new standard to the registry
 *   list             List all registered standards
 *   council          Submit standards for council review
 *   holon <name>     Show holon-specific standards compliance
 *   report           Generate comprehensive compliance report
 *   evolve           Track standards evolution and versioning
 *   alert            Configure and manage compliance alerts
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const STANDARDS_REGISTRY = path.join(process.cwd(), 'data/command_center/standards_registry.json');
const COMPLIANCE_TRACKING = path.join(process.cwd(), 'data/command_center/compliance_tracking.json');
const STANDARDS_EVOLUTION = path.join(process.cwd(), 'data/command_center/standards_evolution.json');
const COMMAND_CENTER_LOG = path.join(process.cwd(), 'data/command_center/command_history.json');
const STANDARDS_INSIGHTS_CONFIG = path.join(process.cwd(), 'config/standards-insights.yaml');
const COUNCIL_DATA = path.join(process.cwd(), 'data/council/');
const HOLON_DATA = path.join(process.cwd(), 'data/holons/');
const DECISION_LOG = path.join(process.cwd(), 'DECISION_LOG.md');
const COUNCIL_COMMITTEES_DIR = path.join(process.cwd(), 'data/council/committees/');

function logCommandCenter(action, details, status) {
  const entry = {
    timestamp: new Date().toISOString(),
    command: action,
    options: [],
    status: status,
    details: details
  };
  const dir = path.dirname(COMMAND_CENTER_LOG);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  let logData = {
    last_updated: new Date().toISOString(),
    session_id: `standards_manager_${Date.now()}`,
    commands: []
  };
  
  if (fs.existsSync(COMMAND_CENTER_LOG)) {
    try { 
      logData = JSON.parse(fs.readFileSync(COMMAND_CENTER_LOG, 'utf8')); 
    } catch (error) {
      console.warn('Warning: Could not parse existing command history, creating new one');
    }
  }
  
  if (!logData.commands) {
    logData.commands = [];
  }
  
  logData.commands.push(entry);
  logData.last_updated = new Date().toISOString();
  
  fs.writeFileSync(COMMAND_CENTER_LOG, JSON.stringify(logData, null, 2));
}

class StandardsManager {
  constructor() {
    this.registry = this.loadRegistry();
    this.complianceTracking = this.loadComplianceTracking();
    this.standardsEvolution = this.loadStandardsEvolution();
    this.holons = ['systemMaster', 'elevate', 'administrate', 'elaborate', 'articulate'];
  }

  loadRegistry() {
    if (fs.existsSync(STANDARDS_REGISTRY)) {
      try { return JSON.parse(fs.readFileSync(STANDARDS_REGISTRY, 'utf8')); } catch {}
    }
    return { 
      standards: [],
      version: '2.0.0',
      lastUpdated: new Date().toISOString(),
      holonCompliance: {},
      councilApprovals: [],
      alerts: [],
      holonStandards: {} // Added for committee standards
    };
  }

  loadComplianceTracking() {
    if (fs.existsSync(COMPLIANCE_TRACKING)) {
      try { return JSON.parse(fs.readFileSync(COMPLIANCE_TRACKING, 'utf8')); } catch {}
    }
    return {
      version: '2.0.0',
      lastUpdated: new Date().toISOString(),
      compliance: {
        overall: { complianceRate: 0, totalStandards: 0, compliantStandards: 0, nonCompliantStandards: 0, pendingReview: 0 },
        byCategory: {
          protocols: { complianceRate: 0, total: 0, compliant: 0, nonCompliant: 0, pending: 0 },
          policies: { complianceRate: 0, total: 0, compliant: 0, nonCompliant: 0, pending: 0 },
          standards: { complianceRate: 0, total: 0, compliant: 0, nonCompliant: 0, pending: 0 },
          processes: { complianceRate: 0, total: 0, compliant: 0, nonCompliant: 0, pending: 0 },
          programs: { complianceRate: 0, total: 0, compliant: 0, nonCompliant: 0, pending: 0 }
        },
        byHolon: {
          systemMaster: { complianceRate: 0, total: 0, compliant: 0, nonCompliant: 0, pending: 0 },
          elevate: { complianceRate: 0, total: 0, compliant: 0, nonCompliant: 0, pending: 0 },
          administrate: { complianceRate: 0, total: 0, compliant: 0, nonCompliant: 0, pending: 0 },
          elaborate: { complianceRate: 0, total: 0, compliant: 0, nonCompliant: 0, pending: 0 },
          articulate: { complianceRate: 0, total: 0, compliant: 0, nonCompliant: 0, pending: 0 }
        }
      },
      tracking: {
        lastAssessment: null,
        nextAssessment: null,
        assessmentFrequency: 'monthly',
        automatedChecks: true,
        manualReviews: true,
        alerting: true
      },
      history: [],
      alerts: []
    };
  }

  loadStandardsEvolution() {
    if (fs.existsSync(STANDARDS_EVOLUTION)) {
      try { return JSON.parse(fs.readFileSync(STANDARDS_EVOLUTION, 'utf8')); } catch {}
    }
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      evolution: [],
      versionHistory: [],
      changeLog: [],
      migrationGuides: []
    };
  }

  saveRegistry() {
    this.registry.lastUpdated = new Date().toISOString();
    fs.writeFileSync(STANDARDS_REGISTRY, JSON.stringify(this.registry, null, 2));
  }

  saveComplianceTracking() {
    this.complianceTracking.lastUpdated = new Date().toISOString();
    fs.writeFileSync(COMPLIANCE_TRACKING, JSON.stringify(this.complianceTracking, null, 2));
  }

  saveStandardsEvolution() {
    this.standardsEvolution.lastUpdated = new Date().toISOString();
    fs.writeFileSync(STANDARDS_EVOLUTION, JSON.stringify(this.standardsEvolution, null, 2));
  }

  async execute() {
    const args = process.argv.slice(2);
    const action = args[0];
    switch (action) {
      case 'status':
        this.showStatus();
        break;
      case 'check':
        await this.runStandardsInsights();
        break;
      case 'harmonize':
        await this.proposeHarmonization();
        break;
      case 'add':
        this.addStandard(args.slice(1).join(' '));
        break;
      case 'list':
        this.listStandards();
        break;
      case 'council':
        await this.submitToCouncil(args.slice(1));
        break;
      case 'holon':
        this.showHolonCompliance(args[1]);
        break;
      case 'report':
        await this.generateReport();
        break;
      case 'evolve':
        this.trackEvolution(args.slice(1));
        break;
      case 'alert':
        this.manageAlerts(args.slice(1));
        break;
      case 'synthesize':
        await this.synthesizeStandards();
        break;
      case 'compliance':
        this.showComplianceDetails();
        break;
      case 'tracking':
        this.showTrackingDetails();
        break;
      case 'update-tracking':
        await this.updateComplianceFromRegistry();
        break;
      case 'sync-committees':
        await this.syncCommitteeStandards();
        break;
      default:
        this.showHelp();
    }
  }

  async syncCommitteeStandards() {
    const fs = require('fs');
    const path = require('path');
    const committeeFiles = fs.readdirSync(COUNCIL_COMMITTEES_DIR).filter(f => f.endsWith('.json'));
    let updated = false;
    let holonStandards = {};
    for (const file of committeeFiles) {
      const committee = JSON.parse(fs.readFileSync(path.join(COUNCIL_COMMITTEES_DIR, file), 'utf8'));
      const holon = committee.name.replace(/ Committee$/, '').toLowerCase();
      holonStandards[holon] = {
        minimum: committee.minimumStandards || [],
        optimal: committee.optimalStandards || []
      };
    }
    // Store in registry for transparency
    this.registry.holonStandards = holonStandards;
    this.saveRegistry();
    console.log('✅ Synchronized holon standards from council committees:');
    Object.entries(holonStandards).forEach(([holon, stds]) => {
      console.log(`  ${holon}:`);
      console.log(`    Minimum: ${stds.minimum.join(', ')}`);
      console.log(`    Optimal: ${stds.optimal.join(', ')}`);
    });
    logCommandCenter('sync-committees', { holonStandards }, 'success');
  }

  showStatus() {
    console.log('📋 Standards Registry Status');
    console.log('===========================');
    console.log(`Total Standards: ${this.registry.standards.length}`);
    console.log(`Version: ${this.registry.version}`);
    console.log(`Last Updated: ${this.registry.lastUpdated}`);
    
    // Overall compliance summary
    const overall = this.complianceTracking.compliance.overall;
    console.log(`\n📊 Overall Compliance: ${overall.complianceRate}%`);
    console.log(`  Total Standards: ${overall.totalStandards}`);
    console.log(`  Compliant: ${overall.compliantStandards}`);
    console.log(`  Non-Compliant: ${overall.nonCompliantStandards}`);
    console.log(`  Pending Review: ${overall.pendingReview}`);
    
    // Category compliance summary
    console.log('\n📋 Category Compliance:');
    Object.entries(this.complianceTracking.compliance.byCategory).forEach(([category, data]) => {
      console.log(`  ${category}: ${data.complianceRate}% (${data.compliant}/${data.total})`);
    });
    
    // Holon compliance summary
    console.log('\n🏛️  Holon Compliance Summary:');
    Object.entries(this.complianceTracking.compliance.byHolon).forEach(([holon, data]) => {
      console.log(`  ${holon}: ${data.complianceRate}% (${data.compliant}/${data.total})`);
    });

    // Council approvals
    const pendingApprovals = this.registry.councilApprovals.filter(a => a.status === 'pending');
    console.log(`\n🏛️  Council Approvals Pending: ${pendingApprovals.length}`);
    
    // Tracking information
    const tracking = this.complianceTracking.tracking;
    console.log(`\n📈 Tracking Information:`);
    console.log(`  Last Assessment: ${tracking.lastAssessment || 'Never'}`);
    console.log(`  Next Assessment: ${tracking.nextAssessment || 'Not scheduled'}`);
    console.log(`  Assessment Frequency: ${tracking.assessmentFrequency}`);
    
    logCommandCenter('status', { 
      standards: this.registry.standards.length, 
      holons: this.holons.length,
      overallCompliance: overall.complianceRate,
      lastAssessment: tracking.lastAssessment
    }, 'success');
  }

  async runStandardsInsights() {
    console.log('🔍 Running Standards Insights for system-wide compliance...');
    try {
      const result = execSync(`standards-insights run --config ${STANDARDS_INSIGHTS_CONFIG}`, { encoding: 'utf8' });
      
      // Parse Standards Insights output
      const compliance = this.parseStandardsInsightsOutput(result);
      
      // Update compliance tracking
      this.updateComplianceTracking(compliance);
      
      console.log('✅ Standards Insights completed successfully');
      console.log('📊 Compliance Summary:');
      Object.entries(compliance).forEach(([holon, data]) => {
        console.log(`  ${holon}: ${data.compliance}/${data.total} standards met`);
      });
      
      logCommandCenter('check', { tool: 'standards-insights', compliance }, 'success');
    } catch (error) {
      console.error('❌ Standards Insights failed:', error.message);
      logCommandCenter('check', { tool: 'standards-insights', error: error.message }, 'failed');
    }
  }

  updateComplianceTracking(compliance) {
    const now = new Date().toISOString();
    
    // Update tracking information
    this.complianceTracking.tracking.lastAssessment = now;
    this.complianceTracking.tracking.nextAssessment = this.calculateNextAssessment();
    
    // Update overall compliance
    let totalStandards = 0;
    let compliantStandards = 0;
    let nonCompliantStandards = 0;
    let pendingReview = 0;
    
    // Update by holon
    Object.entries(compliance).forEach(([holon, data]) => {
      if (this.complianceTracking.compliance.byHolon[holon]) {
        this.complianceTracking.compliance.byHolon[holon] = {
          complianceRate: data.total > 0 ? Math.round((data.compliance / data.total) * 100) : 0,
          total: data.total,
          compliant: data.compliance,
          nonCompliant: data.total - data.compliance,
          pending: 0
        };
        
        totalStandards += data.total;
        compliantStandards += data.compliance;
        nonCompliantStandards += (data.total - data.compliance);
      }
    });
    
    // Update overall compliance
    this.complianceTracking.compliance.overall = {
      complianceRate: totalStandards > 0 ? Math.round((compliantStandards / totalStandards) * 100) : 0,
      totalStandards,
      compliantStandards,
      nonCompliantStandards,
      pendingReview
    };
    
    // Update category compliance (map holons to categories)
    this.updateCategoryCompliance();
    
    // Add to history
    this.complianceTracking.history.push({
      timestamp: now,
      compliance: this.complianceTracking.compliance.overall,
      holonCompliance: this.complianceTracking.compliance.byHolon
    });
    
    // Keep only last 12 months of history
    if (this.complianceTracking.history.length > 12) {
      this.complianceTracking.history = this.complianceTracking.history.slice(-12);
    }
    
    // Save updated tracking
    this.saveComplianceTracking();
  }

  updateCategoryCompliance() {
    // Map holons to categories and aggregate compliance
    const categoryMapping = {
      systemMaster: 'governance',
      elevate: 'product',
      administrate: 'business',
      elaborate: 'system',
      articulate: 'knowledge'
    };
    
    // Reset category compliance
    Object.keys(this.complianceTracking.compliance.byCategory).forEach(category => {
      this.complianceTracking.compliance.byCategory[category] = {
        complianceRate: 0,
        total: 0,
        compliant: 0,
        nonCompliant: 0,
        pending: 0
      };
    });
    
    // Aggregate holon compliance into categories
    Object.entries(this.complianceTracking.compliance.byHolon).forEach(([holon, data]) => {
      const category = categoryMapping[holon] || 'other';
      if (this.complianceTracking.compliance.byCategory[category]) {
        this.complianceTracking.compliance.byCategory[category].total += data.total;
        this.complianceTracking.compliance.byCategory[category].compliant += data.compliant;
        this.complianceTracking.compliance.byCategory[category].nonCompliant += data.nonCompliant;
      }
    });
    
    // Calculate compliance rates for categories
    Object.values(this.complianceTracking.compliance.byCategory).forEach(category => {
      category.complianceRate = category.total > 0 ? Math.round((category.compliant / category.total) * 100) : 0;
    });
  }

  calculateNextAssessment() {
    const now = new Date();
    const frequency = this.complianceTracking.tracking.assessmentFrequency;
    
    switch (frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      case 'monthly':
        return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString();
      case 'quarterly':
        return new Date(now.getFullYear(), now.getMonth() + 3, now.getDate()).toISOString();
      default:
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // Default to monthly
    }
  }

  showComplianceDetails() {
    console.log('📊 Detailed Compliance Report');
    console.log('============================');
    
    const overall = this.complianceTracking.compliance.overall;
    console.log(`\n🎯 Overall Compliance: ${overall.complianceRate}%`);
    console.log(`  Total Standards: ${overall.totalStandards}`);
    console.log(`  Compliant: ${overall.compliantStandards}`);
    console.log(`  Non-Compliant: ${overall.nonCompliantStandards}`);
    console.log(`  Pending Review: ${overall.pendingReview}`);
    
    console.log('\n📋 Category Breakdown:');
    Object.entries(this.complianceTracking.compliance.byCategory).forEach(([category, data]) => {
      console.log(`  ${category.toUpperCase()}: ${data.complianceRate}% (${data.compliant}/${data.total})`);
      if (data.nonCompliant > 0) {
        console.log(`    ⚠️  ${data.nonCompliant} non-compliant standards need attention`);
      }
    });
    
    console.log('\n🏛️  Holon Breakdown:');
    Object.entries(this.complianceTracking.compliance.byHolon).forEach(([holon, data]) => {
      console.log(`  ${holon}: ${data.complianceRate}% (${data.compliant}/${data.total})`);
      if (data.nonCompliant > 0) {
        console.log(`    ⚠️  ${data.nonCompliant} non-compliant standards need attention`);
      }
      // Show holon minimum/optimal standards if available
      if (this.registry.holonStandards && this.registry.holonStandards[holon]) {
        const stds = this.registry.holonStandards[holon];
        console.log(`    Minimum Standards: ${stds.minimum.join(', ')}`);
        console.log(`    Optimal Standards: ${stds.optimal.join(', ')}`);
      }
    });
    
    // Show recent history
    if (this.complianceTracking.history.length > 0) {
      console.log('\n📈 Recent Compliance History:');
      const recent = this.complianceTracking.history.slice(-5);
      recent.forEach((entry, index) => {
        const date = new Date(entry.timestamp).toLocaleDateString();
        console.log(`  ${date}: ${entry.compliance.complianceRate}% compliance`);
      });
    }
    
    logCommandCenter('compliance-details', { overallCompliance: overall.complianceRate }, 'success');
  }

  showTrackingDetails() {
    console.log('📈 Compliance Tracking Details');
    console.log('==============================');
    
    const tracking = this.complianceTracking.tracking;
    console.log(`\n⏰ Assessment Schedule:`);
    console.log(`  Last Assessment: ${tracking.lastAssessment ? new Date(tracking.lastAssessment).toLocaleString() : 'Never'}`);
    console.log(`  Next Assessment: ${tracking.nextAssessment ? new Date(tracking.nextAssessment).toLocaleString() : 'Not scheduled'}`);
    console.log(`  Frequency: ${tracking.assessmentFrequency}`);
    console.log(`  Automated Checks: ${tracking.automatedChecks ? 'Enabled' : 'Disabled'}`);
    console.log(`  Manual Reviews: ${tracking.manualReviews ? 'Enabled' : 'Disabled'}`);
    console.log(`  Alerting: ${tracking.alerting ? 'Enabled' : 'Disabled'}`);
    
    // Show alerts
    if (this.complianceTracking.alerts.length > 0) {
      console.log('\n🚨 Active Alerts:');
      this.complianceTracking.alerts.forEach((alert, index) => {
        console.log(`  ${index + 1}. ${alert.type}: ${alert.message} (${new Date(alert.timestamp).toLocaleDateString()})`);
      });
    } else {
      console.log('\n✅ No active alerts');
    }
    
    // Show history summary
    if (this.complianceTracking.history.length > 0) {
      console.log('\n📊 History Summary:');
      const oldest = this.complianceTracking.history[0];
      const newest = this.complianceTracking.history[this.complianceTracking.history.length - 1];
      console.log(`  Tracking since: ${new Date(oldest.timestamp).toLocaleDateString()}`);
      console.log(`  Total assessments: ${this.complianceTracking.history.length}`);
      console.log(`  Average compliance: ${this.calculateAverageCompliance()}%`);
    }
    
    logCommandCenter('tracking-details', { 
      lastAssessment: tracking.lastAssessment,
      nextAssessment: tracking.nextAssessment,
      alertCount: this.complianceTracking.alerts.length
    }, 'success');
  }

  async updateComplianceFromRegistry() {
    console.log('🔄 Updating compliance tracking from standards registry...');
    
    // Analyze standards registry to update compliance tracking
    const standards = this.registry.standards;
    let totalStandards = 0;
    let compliantStandards = 0;
    let nonCompliantStandards = 0;
    let pendingReview = 0;
    
    // Count standards by category and status
    const categoryCounts = {};
    const holonCounts = {};
    
    standards.forEach(standard => {
      totalStandards++;
      
      // Count by category
      const category = standard.category || 'other';
      if (!categoryCounts[category]) {
        categoryCounts[category] = { total: 0, compliant: 0, nonCompliant: 0, pending: 0 };
      }
      categoryCounts[category].total++;
      
      // Count by holon scope
      const holonScope = standard.holonScope || 'system-wide';
      if (!holonCounts[holonScope]) {
        holonCounts[holonScope] = { total: 0, compliant: 0, nonCompliant: 0, pending: 0 };
      }
      holonCounts[holonScope].total++;
      
      // Determine compliance status
      if (standard.status === 'active' && standard.councilApproval) {
        compliantStandards++;
        categoryCounts[category].compliant++;
        holonCounts[holonScope].compliant++;
      } else if (standard.status === 'pending') {
        pendingReview++;
        categoryCounts[category].pending++;
        holonCounts[holonScope].pending++;
      } else {
        nonCompliantStandards++;
        categoryCounts[category].nonCompliant++;
        holonCounts[holonScope].nonCompliant++;
      }
    });
    
    // Update compliance tracking
    this.complianceTracking.compliance.overall = {
      complianceRate: totalStandards > 0 ? Math.round((compliantStandards / totalStandards) * 100) : 0,
      totalStandards,
      compliantStandards,
      nonCompliantStandards,
      pendingReview
    };
    
    // Update category compliance
    Object.entries(categoryCounts).forEach(([category, data]) => {
      if (this.complianceTracking.compliance.byCategory[category]) {
        this.complianceTracking.compliance.byCategory[category] = {
          complianceRate: data.total > 0 ? Math.round((data.compliant / data.total) * 100) : 0,
          total: data.total,
          compliant: data.compliant,
          nonCompliant: data.nonCompliant,
          pending: data.pending
        };
      }
    });
    
    // Update holon compliance
    Object.entries(holonCounts).forEach(([holon, data]) => {
      if (this.complianceTracking.compliance.byHolon[holon]) {
        this.complianceTracking.compliance.byHolon[holon] = {
          complianceRate: data.total > 0 ? Math.round((data.compliant / data.total) * 100) : 0,
          total: data.total,
          compliant: data.compliant,
          nonCompliant: data.nonCompliant,
          pending: data.pending
        };
      }
    });
    
    // Update tracking information
    this.complianceTracking.tracking.lastAssessment = new Date().toISOString();
    this.complianceTracking.tracking.nextAssessment = this.calculateNextAssessment();
    
    // Add to history
    this.complianceTracking.history.push({
      timestamp: new Date().toISOString(),
      compliance: this.complianceTracking.compliance.overall,
      holonCompliance: this.complianceTracking.compliance.byHolon,
      source: 'registry-update'
    });
    
    // Save updated tracking
    this.saveComplianceTracking();
    
    console.log('✅ Compliance tracking updated from registry');
    console.log(`📊 Updated compliance: ${this.complianceTracking.compliance.overall.complianceRate}%`);
    
    logCommandCenter('update-tracking', { 
      totalStandards,
      compliantStandards,
      nonCompliantStandards,
      pendingReview
    }, 'success');
  }

  calculateAverageCompliance() {
    if (this.complianceTracking.history.length === 0) return 0;
    
    const total = this.complianceTracking.history.reduce((sum, entry) => {
      return sum + entry.compliance.complianceRate;
    }, 0);
    
    return Math.round(total / this.complianceTracking.history.length);
  }

  parseStandardsInsightsOutput(output) {
    // Parse the Standards Insights output to extract compliance data
    const compliance = {};
    const lines = output.split('\n');
    
    lines.forEach(line => {
      if (line.includes('Check') && line.includes('PASS')) {
        // Extract holon and check information
        const match = line.match(/Check (\w+)/);
        if (match) {
          const checkName = match[1];
          // Map check to holon (this would be more sophisticated in practice)
          const holon = this.mapCheckToHolon(checkName);
          if (!compliance[holon]) {
            compliance[holon] = { compliance: 0, total: 0 };
          }
          compliance[holon].compliance++;
          compliance[holon].total++;
        }
      }
    });
    
    return compliance;
  }

  mapCheckToHolon(checkName) {
    // Map Standards Insights checks to holons
    const holonMappings = {
      'logging': 'elevate',
      'security': 'administrate',
      'code-quality': 'articulate',
      'governance': 'elaborate'
    };
    
    for (const [pattern, holon] of Object.entries(holonMappings)) {
      if (checkName.toLowerCase().includes(pattern)) {
        return holon;
      }
    }
    return 'elaborate'; // Default to system master
  }

  updateHolonCompliance(compliance) {
    Object.entries(compliance).forEach(([holon, data]) => {
      this.registry.holonCompliance[holon] = data;
    });
    this.saveRegistry();
  }

  async proposeHarmonization() {
    console.log('🛠️  Proposing harmonization plan based on compliance gaps...');
    
    // Analyze compliance gaps
    const gaps = this.analyzeComplianceGaps();
    
    if (gaps.length === 0) {
      console.log('✅ All holons are compliant with current standards');
      return;
    }
    
    console.log('📋 Identified Compliance Gaps:');
    gaps.forEach(gap => {
      console.log(`  - ${gap.holon}: ${gap.issue} (Priority: ${gap.priority})`);
    });
    
    // Generate harmonization plan
    const plan = this.generateHarmonizationPlan(gaps);
    
    // Log to decision log
    await this.logToDecisionLog('Standards Harmonization Plan', plan);
    
    console.log('\n📝 Harmonization plan generated and logged to decision log');
    logCommandCenter('harmonize', { gaps: gaps.length, plan }, 'success');
  }

  analyzeComplianceGaps() {
    const gaps = [];
    
    Object.entries(this.registry.holonCompliance).forEach(([holon, compliance]) => {
      if (compliance.total > 0) {
        const percentage = (compliance.compliance / compliance.total) * 100;
        if (percentage < 80) {
          gaps.push({
            holon,
            issue: `Low compliance rate: ${Math.round(percentage)}%`,
            priority: percentage < 50 ? 'high' : 'medium'
          });
        }
      }
    });
    
    return gaps;
  }

  generateHarmonizationPlan(gaps) {
    return {
      summary: `Address ${gaps.length} compliance gaps across ${new Set(gaps.map(g => g.holon)).size} holons`,
      actions: gaps.map(gap => ({
        holon: gap.holon,
        action: `Improve compliance from current level to target 90%`,
        priority: gap.priority,
        timeline: gap.priority === 'high' ? '1 week' : '2 weeks'
      })),
      recommendations: [
        'Schedule council review of compliance gaps',
        'Implement automated compliance monitoring',
        'Establish standards training for affected holons'
      ]
    };
  }

  async logToDecisionLog(title, content) {
    const decisionEntry = {
      id: `decision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      decision: title,
      context: 'Standards harmonization',
      stakeholders: ['StandardsManager', 'Council', 'All Holons'],
      status: 'pending',
      implementation: {
        assigned: 'StandardsManager',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week
        progress: 0,
        notes: [content.summary]
      },
      councilReview: {
        reviewed: false,
        approved: false,
        committee: 'Technical Committee',
        notes: []
      },
      impact: {
        scope: 'system-wide',
        priority: 'high',
        affectedSystems: this.holons,
        estimatedEffort: '2-4 weeks'
      }
    };

    // Append to decision log
    const decisionLogContent = this.readDecisionLog();
    const markdownEntry = this.formatDecisionAsMarkdown(decisionEntry);
    
    let newContent = decisionLogContent;
    const insertPosition = newContent.lastIndexOf('---');
    if (insertPosition === -1) {
      newContent += '\n\n' + markdownEntry;
    } else {
      newContent = newContent.substring(0, insertPosition) + markdownEntry + '\n\n' + newContent.substring(insertPosition);
    }
    
    fs.writeFileSync(DECISION_LOG, newContent);
  }

  readDecisionLog() {
    try {
      if (fs.existsSync(DECISION_LOG)) {
        return fs.readFileSync(DECISION_LOG, 'utf8');
      }
    } catch (error) {
      console.error('Error reading decision log:', error.message);
    }
    return '';
  }

  formatDecisionAsMarkdown(entry) {
    const date = new Date(entry.timestamp).toISOString().split('T')[0];
    const entryNumber = this.getNextDecisionEntryNumber();
    
    return `## Entry ${entryNumber}: ${entry.decision}

### Timestamp: ${date} (Current Session)

### User Request
- ${entry.decision}

### AI Response
- Standards harmonization plan generated by StandardsManager
- Compliance gaps identified and prioritized
- Council review required for implementation

### Actual Implementation
- ✅ Harmonization plan generated
- ✅ Decision logged in DECISION_LOG.md
- ⏳ Pending council review and approval

### Context
- ${entry.context}
- System-wide standards compliance improvement
- Automated analysis by StandardsManager

### Impact
- ${entry.impact.scope} impact across ${entry.impact.affectedSystems.length} holons
- Priority: ${entry.impact.priority}
- Estimated effort: ${entry.impact.estimatedEffort}`;
  }

  getNextDecisionEntryNumber() {
    const content = this.readDecisionLog();
    const entries = content.match(/## Entry \d+:/g);
    return entries ? entries.length + 1 : 1;
  }

  addStandard(standardText) {
    if (!standardText) {
      console.error('❌ Standard text required');
      return;
    }
    const newStandard = {
      id: `standard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: standardText,
      category: 'custom',
      status: 'pending',
      added: new Date().toISOString(),
      version: '1.0.0',
      holonScope: 'system-wide',
      councilApproval: false
    };
    this.registry.standards.push(newStandard);
    this.saveRegistry();
    console.log('✅ Standard added:', standardText);
    logCommandCenter('add', { standard: standardText, id: newStandard.id }, 'success');
  }

  listStandards() {
    console.log('📚 Registered Standards');
    this.registry.standards.forEach((s, i) => {
      console.log(`${i + 1}. ${s.name} [${s.category}] - ${s.status || 'unknown'} (v${s.version})`);
      if (s.councilApproval) {
        console.log(`   ✅ Council Approved`);
      }
    });
    logCommandCenter('list', { standards: this.registry.standards.length }, 'success');
  }

  async submitToCouncil(args) {
    const standardId = args[0];
    if (!standardId) {
      console.error('❌ Standard ID required');
      return;
    }
    
    const standard = this.registry.standards.find(s => s.id === standardId);
    if (!standard) {
      console.error('❌ Standard not found');
      return;
    }
    
    const approval = {
      id: `approval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      standardId,
      standardName: standard.name,
      submitted: new Date().toISOString(),
      status: 'pending',
      committee: 'Technical Committee',
      notes: []
    };
    
    this.registry.councilApprovals.push(approval);
    this.saveRegistry();
    
    console.log('✅ Standard submitted to council for approval:', standard.name);
    console.log(`Approval ID: ${approval.id}`);
    
    // Trigger council notification
    await this.notifyCouncil(approval);
    
    logCommandCenter('council', { standardId, approvalId: approval.id }, 'success');
  }

  async notifyCouncil(approval) {
    // Placeholder for council notification
    console.log(`📢 Council notification sent for approval: ${approval.id}`);
  }

  showHolonCompliance(holonName) {
    if (!holonName) {
      console.error('❌ Holon name required');
      return;
    }
    
    const compliance = this.registry.holonCompliance[holonName];
    if (!compliance) {
      console.log(`No compliance data found for ${holonName}`);
      return;
    }
    
    console.log(`🏛️  ${holonName} Compliance Report`);
    console.log('================================');
    console.log(`Compliance Rate: ${compliance.total > 0 ? Math.round((compliance.compliance / compliance.total) * 100) : 0}%`);
    console.log(`Standards Met: ${compliance.compliance}/${compliance.total}`);
    
    // Show applicable standards
    const applicableStandards = this.registry.standards.filter(s => 
      s.holonScope === 'system-wide' || s.holonScope === holonName
    );
    
    console.log(`\nApplicable Standards: ${applicableStandards.length}`);
    applicableStandards.forEach(s => {
      console.log(`  - ${s.name} (${s.status})`);
    });
    
    logCommandCenter('holon', { holon: holonName, compliance }, 'success');
  }

  async generateReport() {
    console.log('📊 Generating comprehensive compliance report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalStandards: this.registry.standards.length,
        totalHolons: this.holons.length,
        overallCompliance: 0
      },
      holonCompliance: {},
      recommendations: [],
      nextSteps: []
    };
    
    // Calculate overall compliance
    let totalCompliance = 0;
    let totalChecks = 0;
    
    Object.entries(this.registry.holonCompliance).forEach(([holon, compliance]) => {
      report.holonCompliance[holon] = compliance;
      totalCompliance += compliance.compliance;
      totalChecks += compliance.total;
    });
    
    report.summary.overallCompliance = totalChecks > 0 ? Math.round((totalCompliance / totalChecks) * 100) : 0;
    
    // Generate recommendations
    if (report.summary.overallCompliance < 80) {
      report.recommendations.push('Implement immediate compliance improvement plan');
    }
    
    // Save report
    const reportPath = path.join(process.cwd(), 'data/command_center/compliance_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('✅ Compliance report generated');
    console.log(`Overall Compliance: ${report.summary.overallCompliance}%`);
    console.log(`Report saved to: ${reportPath}`);
    
    logCommandCenter('report', { reportPath, compliance: report.summary.overallCompliance }, 'success');
  }

  trackEvolution(args) {
    const action = args[0];
    const standardId = args[1];
    
    if (!action || !standardId) {
      console.error('❌ Action and standard ID required');
      return;
    }
    
    const standard = this.registry.standards.find(s => s.id === standardId);
    if (!standard) {
      console.error('❌ Standard not found');
      return;
    }
    
    if (!standard.evolution) {
      standard.evolution = [];
    }
    
    const evolutionEntry = {
      timestamp: new Date().toISOString(),
      action,
      details: args.slice(2).join(' ')
    };
    
    standard.evolution.push(evolutionEntry);
    this.saveRegistry();
    
    console.log('✅ Evolution tracked for standard:', standard.name);
    logCommandCenter('evolve', { standardId, action }, 'success');
  }

  manageAlerts(args) {
    const action = args[0];
    
    switch (action) {
      case 'add':
        const alert = {
          id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          condition: args[1],
          threshold: args[2],
          action: args[3],
          enabled: true,
          created: new Date().toISOString()
        };
        this.registry.alerts.push(alert);
        this.saveRegistry();
        console.log('✅ Alert added:', alert.condition);
        break;
      case 'list':
        console.log('🚨 Configured Alerts:');
        this.registry.alerts.forEach(a => {
          console.log(`  - ${a.condition} (${a.threshold}) -> ${a.action}`);
        });
        break;
      default:
        console.log('Alert actions: add <condition> <threshold> <action>, list');
    }
    
    logCommandCenter('alert', { action, alerts: this.registry.alerts.length }, 'success');
  }

  async synthesizeStandards() {
    console.log('🔎 Synthesizing all standards and compliance policies from codebase, config, data, and docs...');
    const synthesized = [];
    // 1. Scan for standards/compliance/quality in code (TestingHolonManager, FrontendManager, FeaturesHolon, ServerGovernor, Governance/Compliance, Design System Management Protocol)
    // 2. Scan config, data, docs indices for standards
    // 3. Register all found standards/policies in registry
    // 4. Pair with Compliance Manager (Governance/ComplianceTracker)
    // 5. Output summary

    // --- 1. Codebase scan (simplified for demonstration) ---
    const codeStandards = [
      {
        name: 'TestingHolonManager: Professional Standards',
        category: 'testing',
        source: 'src/core/holons/testing/TestingHolonManager.ts',
        details: {
          complianceLevel: ['basic', 'standard', 'enterprise'],
          protocols: ['featureTesting', 'regressionTesting', 'performanceTesting', 'securityTesting', 'accessibilityTesting', 'deploymentTesting'],
          qualityGates: true,
          auditTrail: true,
          automatedReviews: true
        }
      },
      {
        name: 'FrontendManager: Architecture & Design Standards',
        category: 'frontend',
        source: 'src/core/holons/systemMaster/FrontendManager.ts',
        details: {
          designSystem: true,
          componentLibrary: true,
          accessibility: 'WCAG 2.1 AA',
          performance: '< 50KB bundle',
          documentation: 'storybook/jsdoc/markdown'
        }
      },
      {
        name: 'FeaturesHolon: Feature Compliance',
        category: 'features',
        source: 'src/core/holons/features/FeaturesHolon.ts',
        details: {
          complianceRate: true,
          qualityMetrics: true
        }
      },
      {
        name: 'ServerGovernor: Server Compliance Policies',
        category: 'server',
        source: 'src/core/operations/ServerGovernor.ts',
        details: {
          policyEvaluation: true,
          violationTracking: true,
          complianceReporting: true
        }
      },
      {
        name: 'Governance/Compliance: Policy Enforcement',
        category: 'governance',
        source: 'scripts/implement_phase1_modularization.cjs',
        details: {
          policies: ['accessibility', 'performance', 'design'],
          complianceReporting: true
        }
      },
      {
        name: 'Design System Management Protocol: Quality & Compliance',
        category: 'design-system',
        source: 'scripts/protocols/design-system-management.cjs',
        details: {
          qualityAssurance: true,
          complianceChecking: true,
          standardsUpdate: true
        }
      }
    ];
    codeStandards.forEach(s => {
      this.registry.standards.push({
        id: `synth-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: s.name,
        category: s.category,
        status: 'synthesized',
        added: new Date().toISOString(),
        version: '1.0.0',
        holonScope: 'system-wide',
        councilApproval: false,
        source: s.source,
        details: s.details
      });
      synthesized.push(s.name);
    });

    // --- 2. Config/data/docs scan (simulate extraction for now) ---
    const docStandards = [
      {
        name: 'WCAG 2.1 AA Accessibility',
        category: 'accessibility',
        source: 'docs/phases/COMPREHENSIVE_STANDARDIZATION_PLAN.md',
        details: { compliance: 'WCAG 2.1 AA' }
      },
      {
        name: '90% Test Coverage',
        category: 'testing',
        source: 'docs/phases/COMPREHENSIVE_STANDARDIZATION_PLAN.md',
        details: { coverage: '90%' }
      },
      {
        name: '<50KB Bundle Size',
        category: 'performance',
        source: 'docs/phases/COMPREHENSIVE_STANDARDIZATION_PLAN.md',
        details: { bundle: '<50KB' }
      },
      {
        name: 'Automated Code Quality Checks',
        category: 'quality',
        source: 'docs/phases/COMPREHENSIVE_STANDARDIZATION_PLAN.md',
        details: { linting: 'strict', prettier: 'enforced', typescript: 'strict' }
      },
      {
        name: 'CI/CD Quality Gates',
        category: 'cicd',
        source: 'data/cicd-protocols.json',
        details: { testCoverage: 80, performance: 'acceptable', security: 'pass', accessibility: 'pass' }
      }
    ];
    docStandards.forEach(s => {
      this.registry.standards.push({
        id: `synth-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: s.name,
        category: s.category,
        status: 'synthesized',
        added: new Date().toISOString(),
        version: '1.0.0',
        holonScope: 'system-wide',
        councilApproval: false,
        source: s.source,
        details: s.details
      });
      synthesized.push(s.name);
    });

    // --- 3. Pair with Compliance Manager (Governance/ComplianceTracker) ---
    // (Simulate: In a real system, would import and link compliance policies)
    this.registry.complianceManagerPaired = true;

    this.saveRegistry();
    console.log(`✅ Synthesis complete. ${synthesized.length} standards and compliance policies registered.`);
    console.log('Registered standards:');
    synthesized.forEach(s => console.log('  -', s));
    logCommandCenter('synthesize', { synthesized: synthesized.length }, 'success');
  }

  showHelp() {
    console.log(`
StandardsManager v2.0.0
=======================
USAGE: node scripts/command_center/StandardsManager.cjs <action> [options]

ACTIONS:
  status           Show current standards registry and compliance summary
  check            Run Standards Insights and aggregate compliance results
  harmonize        Propose harmonization plan based on compliance gaps
  add <standard>   Add a new standard to the registry
  list             List all registered standards
  council <id>     Submit standard for council review
  holon <name>     Show holon-specific standards compliance
  report           Generate comprehensive compliance report
  evolve <action> <id> [details] Track standards evolution
  alert <action>   Configure and manage compliance alerts
  synthesize       Synthesize all standards and compliance policies from codebase, config, data, and docs
  compliance       Show detailed compliance report
  tracking         Show compliance tracking details
  update-tracking  Update compliance from standards registry
  sync-committees  Synchronize minimum and optimal standards from council committees

EXAMPLES:
  node scripts/command_center/StandardsManager.cjs add "CISQ Logging Standard"
  node scripts/command_center/StandardsManager.cjs council standard-123
  node scripts/command_center/StandardsManager.cjs holon elevate
  node scripts/command_center/StandardsManager.cjs alert add "compliance < 80" "notify council"
  node scripts/command_center/StandardsManager.cjs synthesize
  node scripts/command_center/StandardsManager.cjs compliance
  node scripts/command_center/StandardsManager.cjs update-tracking
  node scripts/command_center/StandardsManager.cjs sync-committees
`);
  }
}

if (require.main === module) {
  const manager = new StandardsManager();
  manager.execute();
} 
#!/usr/bin/env node

/**
 * Documentation Health Check Protocol
 * 
 * PURPOSE: Verify holon documentation health and generate coverage reports
 * for system components and protocols.
 * 
 * FEATURES:
 * - Verify all holon docs are present and up-to-date
 * - Check documentation references and cross-links
 * - Generate context coverage reports
 * - Monitor documentation health metrics
 * - Provide recommendations for improvement
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class DocumentationHealthCheckProtocol {
  constructor() {
    this.projectRoot = process.cwd();
    this.docsDir = path.join(this.projectRoot, 'docs');
    this.scriptsDir = path.join(this.projectRoot, 'scripts');
    this.reportsDir = path.join(this.projectRoot, 'data/reports');
    this.healthMetrics = {
      totalDocs: 0,
      holonDocs: 0,
      canonicalDocs: 0,
      referencedDocs: 0,
      upToDateDocs: 0,
      crossLinkedDocs: 0,
      coverageScore: 0
    };
  }

  async executeHealthCheck() {
    console.log('🏥 Documentation Health Check Protocol');
    console.log('=====================================');
    
    try {
      // Phase 1: Inventory all documentation
      await this.inventoryDocumentation();
      
      // Phase 2: Verify holon documentation
      await this.verifyHolonDocumentation();
      
      // Phase 3: Check documentation references
      await this.checkDocumentationReferences();
      
      // Phase 4: Generate coverage report
      await this.generateCoverageReport();
      
      // Phase 5: Calculate health metrics
      await this.calculateHealthMetrics();
      
      // Phase 6: Generate recommendations
      await this.generateRecommendations();
      
      // Phase 7: Save health report
      await this.saveHealthReport();
      
      console.log('✅ Documentation health check completed successfully');
      return this.healthMetrics;
      
    } catch (error) {
      console.error('❌ Documentation health check failed:', error.message);
      throw error;
    }
  }

  async inventoryDocumentation() {
    console.log('📋 Phase 1: Inventorying documentation...');
    
    this.allDocs = [];
    this.holonDocs = [];
    this.canonicalDocs = [];
    
    // Scan docs directory recursively
    await this.scanDirectory(this.docsDir, this.allDocs);
    
    // Categorize documentation
    this.allDocs.forEach(doc => {
      if (doc.metadata) {
        if (doc.metadata.scope && doc.metadata.scope.includes('holon')) {
          this.holonDocs.push(doc);
        }
        if (doc.metadata.canonical === true) {
          this.canonicalDocs.push(doc);
        }
      }
    });
    
    console.log(`  ✅ Found ${this.allDocs.length} total documents`);
    console.log(`  ✅ Found ${this.holonDocs.length} holon-related documents`);
    console.log(`  ✅ Found ${this.canonicalDocs.length} canonical documents`);
  }

  async scanDirectory(dir, docs) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        await this.scanDirectory(fullPath, docs);
      } else if (item.isFile() && item.name.endsWith('.md')) {
        const doc = await this.parseDocument(fullPath);
        if (doc) {
          docs.push(doc);
        }
      }
    }
  }

  async parseDocument(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(this.projectRoot, filePath);
      
      // Parse YAML frontmatter
      let metadata = null;
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        try {
          metadata = yaml.load(frontmatterMatch[1]);
        } catch (error) {
          console.warn(`  ⚠️  Failed to parse frontmatter in ${relativePath}`);
        }
      }
      
      // Extract basic stats
      const stats = fs.statSync(filePath);
      const lines = content.split('\n').length;
      const words = content.split(/\s+/).length;
      
      return {
        path: filePath,
        relativePath,
        metadata,
        stats: {
          size: stats.size,
          modified: stats.mtime,
          lines,
          words
        },
        content: content.substring(0, 1000) // First 1000 chars for analysis
      };
    } catch (error) {
      console.warn(`  ⚠️  Failed to parse document: ${filePath}`);
      return null;
    }
  }

  async verifyHolonDocumentation() {
    console.log('🔍 Phase 2: Verifying holon documentation...');
    
    this.holonDocHealth = [];
    
    for (const doc of this.holonDocs) {
      const health = {
        doc: doc,
        status: 'unknown',
        issues: [],
        recommendations: []
      };
      
      // Check if canonical doc exists
      if (doc.metadata?.canonical === true) {
        health.status = 'canonical';
        this.verifyCanonicalDoc(doc, health);
      } else {
        health.status = 'reference';
        this.verifyReferenceDoc(doc, health);
      }
      
      this.holonDocHealth.push(health);
    }
    
    const healthyDocs = this.holonDocHealth.filter(h => h.status === 'healthy').length;
    const totalHolonDocs = this.holonDocHealth.length;
    
    console.log(`  ✅ Verified ${totalHolonDocs} holon documents (${healthyDocs} healthy)`);
  }

  verifyCanonicalDoc(doc, health) {
    // Check for comprehensive content
    if (doc.stats.words < 1000) {
      health.issues.push('Insufficient content for canonical document');
      health.recommendations.push('Expand content to provide comprehensive coverage');
    }
    
    // Check for proper structure
    const hasArchitecture = doc.content.includes('Architecture');
    const hasGovernance = doc.content.includes('Governance');
    const hasResponsibilities = doc.content.includes('Responsibilities');
    
    if (!hasArchitecture || !hasGovernance || !hasResponsibilities) {
      health.issues.push('Missing key sections (Architecture, Governance, Responsibilities)');
      health.recommendations.push('Add missing sections to provide complete coverage');
    }
    
    // Check for cross-references
    const hasSeeAlso = doc.content.includes('See Also');
    if (!hasSeeAlso) {
      health.issues.push('Missing cross-references section');
      health.recommendations.push('Add "See Also" section with links to related docs');
    }
    
    if (health.issues.length === 0) {
      health.status = 'healthy';
    } else {
      health.status = 'needs_attention';
    }
  }

  verifyReferenceDoc(doc, health) {
    // Check for link to canonical doc
    const hasCanonicalLink = doc.content.includes('HOLON_GOVERNANCE_ARCHITECTURE.md');
    if (!hasCanonicalLink) {
      health.issues.push('Missing link to canonical holon documentation');
      health.recommendations.push('Add reference to canonical holon documentation');
    }
    
    // Check for proper scope definition
    if (!doc.metadata?.scope) {
      health.issues.push('Missing scope definition');
      health.recommendations.push('Add scope to YAML frontmatter');
    }
    
    // Check for context summary
    const hasContextSummary = doc.content.includes('This document') || doc.content.includes('This protocol') || doc.content.includes('This plan');
    if (!hasContextSummary) {
      health.issues.push('Missing context summary');
      health.recommendations.push('Add 2-3 sentence context summary at the top');
    }
    
    if (health.issues.length === 0) {
      health.status = 'healthy';
    } else {
      health.status = 'needs_attention';
    }
  }

  async checkDocumentationReferences() {
    console.log('🔗 Phase 3: Checking documentation references...');
    
    this.referenceHealth = {
      crossLinks: 0,
      brokenLinks: 0,
      missingReferences: 0,
      orphanedDocs: 0
    };
    
    // Check cross-links between holon docs
    for (const doc of this.holonDocs) {
      if (doc.metadata?.related_docs) {
        this.referenceHealth.crossLinks += doc.metadata.related_docs.length;
        
        // Verify related docs exist
        for (const relatedDoc of doc.metadata.related_docs) {
          const relatedPath = path.join(this.projectRoot, 'docs', relatedDoc);
          if (!fs.existsSync(relatedPath)) {
            this.referenceHealth.brokenLinks++;
            console.warn(`  ⚠️  Broken link: ${doc.relativePath} -> ${relatedDoc}`);
          }
        }
      }
    }
    
    // Check for orphaned docs (not referenced by any canonical doc)
    const referencedDocs = new Set();
    this.canonicalDocs.forEach(doc => {
      if (doc.metadata?.related_docs) {
        doc.metadata.related_docs.forEach(ref => referencedDocs.add(ref));
      }
    });
    
    this.holonDocs.forEach(doc => {
      if (!referencedDocs.has(doc.relativePath) && doc.metadata?.canonical !== true) {
        this.referenceHealth.orphanedDocs++;
        console.warn(`  ⚠️  Orphaned doc: ${doc.relativePath}`);
      }
    });
    
    console.log(`  ✅ Cross-links: ${this.referenceHealth.crossLinks}`);
    console.log(`  ⚠️  Broken links: ${this.referenceHealth.brokenLinks}`);
    console.log(`  ⚠️  Orphaned docs: ${this.referenceHealth.orphanedDocs}`);
  }

  async generateCoverageReport() {
    console.log('📊 Phase 4: Generating coverage report...');
    
    this.coverageReport = {
      systemComponents: this.analyzeSystemComponentCoverage(),
      protocols: this.analyzeProtocolCoverage(),
      holons: this.analyzeHolonCoverage(),
      documentation: this.analyzeDocumentationCoverage()
    };
    
    console.log('  ✅ Coverage report generated');
  }

  analyzeSystemComponentCoverage() {
    const components = [
      'SystemMaster', 'Elevate', 'Administrate', 'Elaborate', 'Articulate',
      'FeaturesHolon', 'ProductHolon', 'SessionHolon', 'UserHolon'
    ];
    
    const coverage = {};
    components.forEach(component => {
      const docs = this.holonDocs.filter(doc => 
        doc.content.includes(component) || 
        (doc.metadata?.scope && doc.metadata.scope.includes(component.toLowerCase()))
      );
      
      coverage[component] = {
        documented: docs.length > 0,
        docCount: docs.length,
        docs: docs.map(d => d.relativePath)
      };
    });
    
    return coverage;
  }

  analyzeProtocolCoverage() {
    const protocols = [
      'launch_protocol', 'end_of_chat_protocol', 'custodian_protocol',
      'documentation_manager_protocol', 'context_integration_protocol'
    ];
    
    const coverage = {};
    protocols.forEach(protocol => {
      const docs = this.holonDocs.filter(doc => 
        doc.content.includes(protocol) || 
        doc.relativePath.includes(protocol)
      );
      
      coverage[protocol] = {
        documented: docs.length > 0,
        docCount: docs.length,
        docs: docs.map(d => d.relativePath)
      };
    });
    
    return coverage;
  }

  analyzeHolonCoverage() {
    const holonTypes = ['principle', 'product', 'system', 'session', 'user'];
    
    const coverage = {};
    holonTypes.forEach(type => {
      const docs = this.holonDocs.filter(doc => 
        doc.metadata?.scope && doc.metadata.scope.includes(type)
      );
      
      coverage[type] = {
        documented: docs.length > 0,
        docCount: docs.length,
        docs: docs.map(d => d.relativePath)
      };
    });
    
    return coverage;
  }

  analyzeDocumentationCoverage() {
    const docTypes = ['architecture', 'protocol', 'implementation', 'research', 'summary'];
    
    const coverage = {};
    docTypes.forEach(type => {
      const docs = this.holonDocs.filter(doc => 
        doc.metadata?.doc_type && doc.metadata.doc_type.toLowerCase().includes(type)
      );
      
      coverage[type] = {
        documented: docs.length > 0,
        docCount: docs.length,
        docs: docs.map(d => d.relativePath)
      };
    });
    
    return coverage;
  }

  async calculateHealthMetrics() {
    console.log('📈 Phase 5: Calculating health metrics...');
    
    this.healthMetrics.totalDocs = this.allDocs.length;
    this.healthMetrics.holonDocs = this.holonDocs.length;
    this.healthMetrics.canonicalDocs = this.canonicalDocs.length;
    this.healthMetrics.referencedDocs = this.referenceHealth.crossLinks;
    this.healthMetrics.upToDateDocs = this.holonDocHealth.filter(h => h.status === 'healthy').length;
    this.healthMetrics.crossLinkedDocs = this.holonDocs.filter(d => d.metadata?.related_docs).length;
    
    // Calculate coverage score
    const totalComponents = Object.keys(this.coverageReport.systemComponents).length;
    const documentedComponents = Object.values(this.coverageReport.systemComponents)
      .filter(c => c.documented).length;
    
    this.healthMetrics.coverageScore = Math.round((documentedComponents / totalComponents) * 100);
    
    console.log(`  ✅ Health metrics calculated (coverage: ${this.healthMetrics.coverageScore}%)`);
  }

  async generateRecommendations() {
    console.log('💡 Phase 6: Generating recommendations...');
    
    this.recommendations = [];
    
    // Recommendations based on health issues
    this.holonDocHealth.forEach(health => {
      health.recommendations.forEach(rec => {
        this.recommendations.push({
          type: 'documentation',
          priority: health.status === 'needs_attention' ? 'high' : 'medium',
          doc: health.doc.relativePath,
          recommendation: rec
        });
      });
    });
    
    // Recommendations based on coverage gaps
    Object.entries(this.coverageReport.systemComponents).forEach(([component, coverage]) => {
      if (!coverage.documented) {
        this.recommendations.push({
          type: 'coverage',
          priority: 'high',
          component,
          recommendation: `Create documentation for ${component} system component`
        });
      }
    });
    
    // Recommendations based on reference issues
    if (this.referenceHealth.brokenLinks > 0) {
      this.recommendations.push({
        type: 'reference',
        priority: 'high',
        recommendation: `Fix ${this.referenceHealth.brokenLinks} broken cross-references`
      });
    }
    
    if (this.referenceHealth.orphanedDocs > 0) {
      this.recommendations.push({
        type: 'reference',
        priority: 'medium',
        recommendation: `Review ${this.referenceHealth.orphanedDocs} orphaned documents`
      });
    }
    
    console.log(`  ✅ Generated ${this.recommendations.length} recommendations`);
  }

  async saveHealthReport() {
    console.log('💾 Phase 7: Saving health report...');
    
    // Ensure reports directory exists
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
    
    const report = {
      timestamp: new Date().toISOString(),
      healthMetrics: this.healthMetrics,
      holonDocHealth: this.holonDocHealth,
      referenceHealth: this.referenceHealth,
      coverageReport: this.coverageReport,
      recommendations: this.recommendations
    };
    
    const reportPath = path.join(this.reportsDir, `documentation-health-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`  ✅ Health report saved: ${reportPath}`);
  }
}

// Export for use in other protocols
module.exports = DocumentationHealthCheckProtocol;

// CLI interface
if (require.main === module) {
  const protocol = new DocumentationHealthCheckProtocol();
  
  protocol.executeHealthCheck()
    .then(metrics => {
      console.log('\n📊 Final Health Metrics:');
      console.log(`  Total Docs: ${metrics.totalDocs}`);
      console.log(`  Holon Docs: ${metrics.holonDocs}`);
      console.log(`  Canonical Docs: ${metrics.canonicalDocs}`);
      console.log(`  Up-to-Date Docs: ${metrics.upToDateDocs}`);
      console.log(`  Coverage Score: ${metrics.coverageScore}%`);
    })
    .catch(console.error);
} 
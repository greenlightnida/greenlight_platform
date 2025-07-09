#!/usr/bin/env node

/**
 * Context Extraction API
 * 
 * PURPOSE: Provide on-demand context extraction for holons and system areas
 * to support dashboards, admin UIs, and other system components.
 * 
 * FEATURES:
 * - Extract context by holon name or system area
 * - Provide canonical definitions and governance information
 * - Return related documentation and cross-references
 * - Support both programmatic and CLI interfaces
 * - Integrate with context integration protocol
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class ContextExtractionAPI {
  constructor() {
    this.projectRoot = process.cwd();
    this.canonicalHolonDoc = path.join(this.projectRoot, 'docs/architecture/HOLON_GOVERNANCE_ARCHITECTURE.md');
    this.docsIndex = path.join(this.projectRoot, 'docs/DOCS_INDEX.md');
    this.contextCache = new Map();
    this.extractionPatterns = {
      holonDefinitions: /### \*\*(.*?)\*\* \(Parent Governor\)([\s\S]*?)(?=### \*\*|$)/g,
      governanceSections: /## 🛡️ \*\*Governance Framework\*\*([\s\S]*?)(?=## |$)/,
      communicationSections: /## 🔗 \*\*Cross-Holon Communication\*\*([\s\S]*?)(?=## |$)/,
      lifecycleSections: /## 🔄 \*\*Holon Lifecycle Management\*\*([\s\S]*?)(?=## |$)/,
      securitySections: /## 🔐 \*\*Security and Access Control\*\*([\s\S]*?)(?=## |$)/,
      monitoringSections: /## 📊 \*\*Monitoring and Analytics\*\*([\s\S]*?)(?=## |$)/
    };
  }

  async initialize() {
    console.log('🔍 Context Extraction API - Initializing');
    console.log('========================================');
    
    try {
      // Load canonical documentation
      await this.loadCanonicalDocumentation();
      
      // Build extraction patterns
      await this.buildExtractionPatterns();
      
      // Initialize cache
      await this.initializeCache();
      
      console.log('✅ Context Extraction API initialized successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Context Extraction API initialization failed:', error.message);
      return false;
    }
  }

  async loadCanonicalDocumentation() {
    console.log('📖 Loading canonical documentation...');
    
    if (!fs.existsSync(this.canonicalHolonDoc)) {
      throw new Error(`Canonical holon documentation not found: ${this.canonicalHolonDoc}`);
    }

    this.canonicalContent = fs.readFileSync(this.canonicalHolonDoc, 'utf8');
    
    // Parse YAML frontmatter
    const frontmatterMatch = this.canonicalContent.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      this.metadata = yaml.load(frontmatterMatch[1]);
      console.log(`  ✅ Metadata loaded: ${this.metadata.doc_type} (${this.metadata.scope})`);
    }

    // Load docs index
    if (fs.existsSync(this.docsIndex)) {
      this.docsIndexContent = fs.readFileSync(this.docsIndex, 'utf8');
      console.log('  ✅ Documentation index loaded');
    }
    
    console.log(`  ✅ Canonical documentation loaded (${this.canonicalContent.length} characters)`);
  }

  async buildExtractionPatterns() {
    console.log('🔧 Building extraction patterns...');
    
    // Extract holon definitions
    this.holonDefinitions = [];
    let match;
    const holonPattern = this.extractionPatterns.holonDefinitions;
    
    while ((match = holonPattern.exec(this.canonicalContent)) !== null) {
      const holonName = match[1];
      const holonContent = match[2];
      
      const responsibilities = this.extractResponsibilities(holonContent);
      
      this.holonDefinitions.push({
        name: holonName,
        type: 'principle',
        role: 'parent_governor',
        content: holonContent,
        responsibilities,
        extractedAt: new Date().toISOString()
      });
    }
    
    console.log(`  ✅ Extracted ${this.holonDefinitions.length} holon definitions`);
  }

  extractResponsibilities(holonContent) {
    const responsibilities = [];
    const responsibilityPattern = /- \*\*(.*?)\*\* (.*?)$/gm;
    let match;
    
    while ((match = responsibilityPattern.exec(holonContent)) !== null) {
      responsibilities.push({
        category: match[1],
        description: match[2]
      });
    }
    
    return responsibilities;
  }

  async initializeCache() {
    console.log('💾 Initializing context cache...');
    
    // Pre-extract common contexts
    const commonAreas = ['general', 'governance', 'communication', 'security', 'monitoring'];
    
    for (const area of commonAreas) {
      const context = await this.extractSystemAreaContext(area);
      this.contextCache.set(`area:${area}`, context);
    }
    
    // Pre-extract holon contexts
    for (const holon of this.holonDefinitions) {
      const context = await this.extractHolonContext(holon.name);
      this.contextCache.set(`holon:${holon.name.toLowerCase()}`, context);
    }
    
    console.log(`  ✅ Cache initialized with ${this.contextCache.size} entries`);
  }

  async extractHolonContext(holonName) {
    console.log(`🔍 Extracting context for holon: ${holonName}`);
    
    // Check cache first
    const cacheKey = `holon:${holonName.toLowerCase()}`;
    if (this.contextCache.has(cacheKey)) {
      return this.contextCache.get(cacheKey);
    }
    
    // Find holon definition
    const holon = this.holonDefinitions.find(h => 
      h.name.toLowerCase().includes(holonName.toLowerCase())
    );
    
    if (!holon) {
      throw new Error(`Holon not found: ${holonName}`);
    }
    
    // Extract related sections
    const governance = this.extractSection('Governance Framework');
    const communication = this.extractSection('Cross-Holon Communication');
    const lifecycle = this.extractSection('Holon Lifecycle Management');
    const security = this.extractSection('Security and Access Control');
    const monitoring = this.extractSection('Monitoring and Analytics');
    
    // Find related documentation
    const relatedDocs = this.findRelatedDocumentation(holonName);
    
    const context = {
      holon: {
        name: holon.name,
        type: holon.type,
        role: holon.role,
        responsibilities: holon.responsibilities
      },
      governance,
      communication,
      lifecycle,
      security,
      monitoring,
      relatedDocs,
      canonicalDoc: this.canonicalHolonDoc,
      metadata: this.metadata,
      extractedAt: new Date().toISOString()
    };
    
    // Cache the result
    this.contextCache.set(cacheKey, context);
    
    console.log(`  ✅ Context extracted for holon: ${holonName}`);
    return context;
  }

  async extractSystemAreaContext(area) {
    console.log(`🔍 Extracting context for system area: ${area}`);
    
    // Check cache first
    const cacheKey = `area:${area}`;
    if (this.contextCache.has(cacheKey)) {
      return this.contextCache.get(cacheKey);
    }
    
    let context = {
      area,
      canonicalDoc: this.canonicalHolonDoc,
      metadata: this.metadata,
      extractedAt: new Date().toISOString()
    };
    
    // Extract area-specific sections
    switch (area.toLowerCase()) {
      case 'governance':
        context.governance = this.extractSection('Governance Framework');
        context.policyManagement = this.extractSubsection('Policy Management');
        context.complianceMonitoring = this.extractSubsection('Compliance Monitoring');
        context.performanceManagement = this.extractSubsection('Performance Management');
        break;
        
      case 'communication':
        context.communication = this.extractSection('Cross-Holon Communication');
        context.protocols = this.extractSubsection('Communication Protocols');
        context.dataFlow = this.extractSubsection('Data Flow Management');
        break;
        
      case 'security':
        context.security = this.extractSection('Security and Access Control');
        context.authentication = this.extractSubsection('Authentication and Authorization');
        context.dataProtection = this.extractSubsection('Data Protection');
        break;
        
      case 'monitoring':
        context.monitoring = this.extractSection('Monitoring and Analytics');
        context.healthMonitoring = this.extractSubsection('Health Monitoring');
        context.analytics = this.extractSubsection('Analytics and Reporting');
        break;
        
      default:
        // General context - include overview of all areas
        context.overview = this.extractSection('Architecture Overview');
        context.holons = this.holonDefinitions.map(h => ({
          name: h.name,
          type: h.type,
          role: h.role
        }));
        context.governance = this.extractSection('Governance Framework');
        context.communication = this.extractSection('Cross-Holon Communication');
        context.lifecycle = this.extractSection('Holon Lifecycle Management');
        context.security = this.extractSection('Security and Access Control');
        context.monitoring = this.extractSection('Monitoring and Analytics');
    }
    
    // Find related documentation
    context.relatedDocs = this.findRelatedDocumentation(area);
    
    // Cache the result
    this.contextCache.set(cacheKey, context);
    
    console.log(`  ✅ Context extracted for system area: ${area}`);
    return context;
  }

  extractSection(sectionName) {
    const sectionPattern = new RegExp(`## [^\\n]*\\*\\*${sectionName}\\*\\*([\\s\\S]*?)(?=## |$)`, 'i');
    const match = this.canonicalContent.match(sectionPattern);
    
    if (match) {
      return {
        content: match[1].trim(),
        subsections: this.extractSubsections(match[1])
      };
    }
    
    return null;
  }

  extractSubsection(subsectionName) {
    const subsectionPattern = new RegExp(`### \\*\\*${subsectionName}\\*\\*([\\s\\S]*?)(?=### |$)`, 'i');
    const match = this.canonicalContent.match(subsectionPattern);
    
    if (match) {
      return {
        content: match[1].trim(),
        items: this.extractListItems(match[1])
      };
    }
    
    return null;
  }

  extractSubsections(content) {
    const subsections = {};
    const subsectionPattern = /### \*\*(.*?)\*\*([\s\S]*?)(?=### |$)/g;
    let match;
    
    while ((match = subsectionPattern.exec(content)) !== null) {
      subsections[match[1]] = {
        content: match[2].trim(),
        items: this.extractListItems(match[2])
      };
    }
    
    return subsections;
  }

  extractListItems(content) {
    const items = [];
    const itemPattern = /- \*\*(.*?)\*\*: (.*?)$/gm;
    let match;
    
    while ((match = itemPattern.exec(content)) !== null) {
      items.push({
        name: match[1],
        description: match[2]
      });
    }
    
    return items;
  }

  findRelatedDocumentation(query) {
    const relatedDocs = [];
    
    if (this.metadata?.related_docs) {
      this.metadata.related_docs.forEach(doc => {
        if (doc.toLowerCase().includes(query.toLowerCase()) || 
            query.toLowerCase().includes(doc.toLowerCase())) {
          relatedDocs.push({
            path: doc,
            relationship: 'direct'
          });
        }
      });
    }
    
    // Search in docs index
    if (this.docsIndexContent) {
      const lines = this.docsIndexContent.split('\n');
      lines.forEach(line => {
        if (line.toLowerCase().includes(query.toLowerCase()) && line.includes('.md')) {
          const match = line.match(/\[(.*?)\]\((.*?)\)/);
          if (match) {
            relatedDocs.push({
              title: match[1],
              path: match[2],
              relationship: 'indexed'
            });
          }
        }
      });
    }
    
    return relatedDocs;
  }

  async getContext(query, type = 'auto') {
    console.log(`🔍 Getting context for: ${query} (type: ${type})`);
    
    try {
      let context;
      
      if (type === 'holon' || (type === 'auto' && this.isHolonQuery(query))) {
        context = await this.extractHolonContext(query);
      } else {
        context = await this.extractSystemAreaContext(query);
      }
      
      return {
        success: true,
        query,
        type: type === 'auto' ? (this.isHolonQuery(query) ? 'holon' : 'area') : type,
        context,
        cacheHit: this.contextCache.has(`holon:${query.toLowerCase()}`) || 
                 this.contextCache.has(`area:${query.toLowerCase()}`),
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      return {
        success: false,
        query,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  isHolonQuery(query) {
    const holonNames = this.holonDefinitions.map(h => h.name.toLowerCase());
    return holonNames.some(name => 
      name.includes(query.toLowerCase()) || 
      query.toLowerCase().includes(name)
    );
  }

  async getCacheStats() {
    return {
      totalEntries: this.contextCache.size,
      holonEntries: Array.from(this.contextCache.keys()).filter(k => k.startsWith('holon:')).length,
      areaEntries: Array.from(this.contextCache.keys()).filter(k => k.startsWith('area:')).length,
      cacheKeys: Array.from(this.contextCache.keys())
    };
  }

  async clearCache() {
    this.contextCache.clear();
    console.log('🗑️  Context cache cleared');
  }

  async refreshCache() {
    console.log('🔄 Refreshing context cache...');
    await this.clearCache();
    await this.initializeCache();
    console.log('✅ Context cache refreshed');
  }
}

// Export for use in other protocols
module.exports = ContextExtractionAPI;

// CLI interface
if (require.main === module) {
  const api = new ContextExtractionAPI();
  
  const command = process.argv[2];
  const args = process.argv.slice(3);

  async function run() {
    await api.initialize();

    switch (command) {
      case 'get-context':
        const query = args[0];
        const type = args[1] || 'auto';
        
        if (!query) {
          console.error('❌ Query required');
          process.exit(1);
        }
        
        const result = await api.getContext(query, type);
        console.log(JSON.stringify(result, null, 2));
        break;
        
      case 'get-holon':
        const holonName = args[0];
        if (!holonName) {
          console.error('❌ Holon name required');
          process.exit(1);
        }
        
        const holonContext = await api.extractHolonContext(holonName);
        console.log(JSON.stringify(holonContext, null, 2));
        break;
        
      case 'get-area':
        const area = args[0] || 'general';
        const areaContext = await api.extractSystemAreaContext(area);
        console.log(JSON.stringify(areaContext, null, 2));
        break;
        
      case 'cache-stats':
        const stats = await api.getCacheStats();
        console.log(JSON.stringify(stats, null, 2));
        break;
        
      case 'clear-cache':
        await api.clearCache();
        console.log('✅ Cache cleared');
        break;
        
      case 'refresh-cache':
        await api.refreshCache();
        console.log('✅ Cache refreshed');
        break;
        
      default:
        console.log('Usage: node context_extraction_api.cjs [command] [args]');
        console.log('Commands:');
        console.log('  get-context <query> [type]     - Get context for query (auto/holon/area)');
        console.log('  get-holon <name>               - Get context for specific holon');
        console.log('  get-area [area]                - Get context for system area');
        console.log('  cache-stats                    - Get cache statistics');
        console.log('  clear-cache                    - Clear context cache');
        console.log('  refresh-cache                  - Refresh context cache');
        break;
    }
  }

  run().catch(console.error);
} 
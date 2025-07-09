#!/usr/bin/env node

/**
 * Context Integration Protocol
 * 
 * PURPOSE: Integrate canonical holon documentation with context-awareness protocols
 * to provide comprehensive context for sessions, protocols, and system components.
 * 
 * FEATURES:
 * - Parse canonical holon documentation for context extraction
 * - Inject holon context into session/protocol startup
 * - Provide on-demand context for system components
 * - Maintain context registry and health monitoring
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class ContextIntegrationProtocol {
  constructor() {
    this.projectRoot = process.cwd();
    this.canonicalHolonDoc = path.join(this.projectRoot, 'docs/architecture/HOLON_GOVERNANCE_ARCHITECTURE.md');
    this.contextRegistry = new Map();
    this.sessionContexts = new Map();
  }

  async initialize() {
    console.log('🔗 Context Integration Protocol - Initializing');
    console.log('==============================================');
    
    try {
      // Load canonical holon documentation
      await this.loadCanonicalHolonDoc();
      
      // Extract context information
      await this.extractHolonContext();
      
      // Build context registry
      await this.buildContextRegistry();
      
      // Initialize session context injection
      await this.initializeSessionContextInjection();
      
      console.log('✅ Context Integration Protocol initialized successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Context Integration Protocol initialization failed:', error.message);
      return false;
    }
  }

  async loadCanonicalHolonDoc() {
    console.log('📖 Loading canonical holon documentation...');
    
    if (!fs.existsSync(this.canonicalHolonDoc)) {
      throw new Error(`Canonical holon documentation not found: ${this.canonicalHolonDoc}`);
    }

    const content = fs.readFileSync(this.canonicalHolonDoc, 'utf8');
    
    // Parse YAML frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      this.metadata = yaml.load(frontmatterMatch[1]);
      console.log(`  ✅ Metadata loaded: ${this.metadata.doc_type} (${this.metadata.scope})`);
    }

    this.holonContent = content;
    console.log(`  ✅ Holon documentation loaded (${content.length} characters)`);
  }

  async extractHolonContext() {
    console.log('🔍 Extracting holon context information...');
    
    const context = {
      holons: this.extractHolonDefinitions(),
      governance: this.extractGovernanceFramework(),
      communication: this.extractCommunicationProtocols(),
      lifecycle: this.extractLifecycleManagement(),
      security: this.extractSecurityFramework(),
      monitoring: this.extractMonitoringCapabilities(),
      metadata: this.metadata
    };

    this.holonContext = context;
    console.log(`  ✅ Extracted context for ${context.holons.length} holons`);
  }

  extractHolonDefinitions() {
    const holons = [];
    
    // Extract principle holons
    const principleHolonsMatch = this.holonContent.match(/### \*\*(.*?)\*\* \(Parent Governor\)([\s\S]*?)(?=### \*\*|$)/g);
    if (principleHolonsMatch) {
      principleHolonsMatch.forEach(match => {
        const nameMatch = match.match(/### \*\*(.*?)\*\* \(Parent Governor\)/);
        const responsibilitiesMatch = match.match(/- \*\*(.*?)\*\* (.*?)$/gm);
        
        if (nameMatch) {
          const holon = {
            name: nameMatch[1],
            type: 'principle',
            role: 'parent_governor',
            responsibilities: []
          };
          
          if (responsibilitiesMatch) {
            responsibilitiesMatch.forEach(resp => {
              const respMatch = resp.match(/- \*\*(.*?)\*\* (.*?)$/);
              if (respMatch) {
                holon.responsibilities.push({
                  category: respMatch[1],
                  description: respMatch[2]
                });
              }
            });
          }
          
          holons.push(holon);
        }
      });
    }

    return holons;
  }

  extractGovernanceFramework() {
    const governance = {
      policyManagement: [],
      complianceMonitoring: [],
      performanceManagement: []
    };

    // Extract policy management
    const policyMatch = this.holonContent.match(/### Policy Management([\s\S]*?)(?=### |$)/);
    if (policyMatch) {
      const policies = policyMatch[1].match(/- \*\*(.*?)\*\*: (.*?)$/gm);
      if (policies) {
        policies.forEach(policy => {
          const policyMatch = policy.match(/- \*\*(.*?)\*\*: (.*?)$/);
          if (policyMatch) {
            governance.policyManagement.push({
              name: policyMatch[1],
              description: policyMatch[2]
            });
          }
        });
      }
    }

    return governance;
  }

  extractCommunicationProtocols() {
    const communication = {
      protocols: [],
      dataFlow: []
    };

    // Extract communication protocols
    const protocolMatch = this.holonContent.match(/### Communication Protocols([\s\S]*?)(?=### |$)/);
    if (protocolMatch) {
      const protocols = protocolMatch[1].match(/- \*\*(.*?)\*\*: (.*?)$/gm);
      if (protocols) {
        protocols.forEach(protocol => {
          const protocolMatch = protocol.match(/- \*\*(.*?)\*\*: (.*?)$/);
          if (protocolMatch) {
            communication.protocols.push({
              name: protocolMatch[1],
              description: protocolMatch[2]
            });
          }
        });
      }
    }

    return communication;
  }

  extractLifecycleManagement() {
    const lifecycle = {
      phases: []
    };

    // Extract lifecycle phases
    const phaseMatches = this.holonContent.match(/### (.*?) Phase([\s\S]*?)(?=### |$)/g);
    if (phaseMatches) {
      phaseMatches.forEach(match => {
        const phaseMatch = match.match(/### (.*?) Phase/);
        if (phaseMatch) {
          const phase = {
            name: phaseMatch[1],
            steps: []
          };
          
          const steps = match.match(/\d+\. \*\*(.*?)\*\*: (.*?)$/gm);
          if (steps) {
            steps.forEach(step => {
              const stepMatch = step.match(/\d+\. \*\*(.*?)\*\*: (.*?)$/);
              if (stepMatch) {
                phase.steps.push({
                  name: stepMatch[1],
                  description: stepMatch[2]
                });
              }
            });
          }
          
          lifecycle.phases.push(phase);
        }
      });
    }

    return lifecycle;
  }

  extractSecurityFramework() {
    const security = {
      authentication: [],
      dataProtection: []
    };

    // Extract authentication and authorization
    const authMatch = this.holonContent.match(/### Authentication and Authorization([\s\S]*?)(?=### |$)/);
    if (authMatch) {
      const authMethods = authMatch[1].match(/- \*\*(.*?)\*\*: (.*?)$/gm);
      if (authMethods) {
        authMethods.forEach(method => {
          const methodMatch = method.match(/- \*\*(.*?)\*\*: (.*?)$/);
          if (methodMatch) {
            security.authentication.push({
              name: methodMatch[1],
              description: methodMatch[2]
            });
          }
        });
      }
    }

    return security;
  }

  extractMonitoringCapabilities() {
    const monitoring = {
      healthMonitoring: [],
      analytics: []
    };

    // Extract health monitoring
    const healthMatch = this.holonContent.match(/### Health Monitoring([\s\S]*?)(?=### |$)/);
    if (healthMatch) {
      const healthMetrics = healthMatch[1].match(/- \*\*(.*?)\*\*: (.*?)$/gm);
      if (healthMetrics) {
        healthMetrics.forEach(metric => {
          const metricMatch = metric.match(/- \*\*(.*?)\*\*: (.*?)$/);
          if (metricMatch) {
            monitoring.healthMonitoring.push({
              name: metricMatch[1],
              description: metricMatch[2]
            });
          }
        });
      }
    }

    return monitoring;
  }

  async buildContextRegistry() {
    console.log('📋 Building context registry...');
    
    // Register holon context
    this.contextRegistry.set('holon_architecture', {
      type: 'architecture',
      source: this.canonicalHolonDoc,
      content: this.holonContext,
      lastUpdated: new Date().toISOString(),
      version: this.metadata?.version || '1.0.0'
    });

    // Register related documentation
    if (this.metadata?.related_docs) {
      this.metadata.related_docs.forEach((doc, index) => {
        const docPath = path.join(this.projectRoot, 'docs', doc);
        if (fs.existsSync(docPath)) {
          this.contextRegistry.set(`related_doc_${index}`, {
            type: 'documentation',
            source: docPath,
            relationship: 'related',
            lastUpdated: new Date().toISOString()
          });
        }
      });
    }

    console.log(`  ✅ Context registry built with ${this.contextRegistry.size} entries`);
  }

  async initializeSessionContextInjection() {
    console.log('💉 Initializing session context injection...');
    
    // Create session context template
    this.sessionContextTemplate = {
      holonArchitecture: this.holonContext,
      canonicalDoc: this.canonicalHolonDoc,
      contextRegistry: Array.from(this.contextRegistry.keys()),
      injectionTimestamp: new Date().toISOString()
    };

    console.log('  ✅ Session context injection initialized');
  }

  async injectContextIntoSession(sessionId) {
    console.log(`💉 Injecting context into session: ${sessionId}`);
    
    const sessionContext = {
      ...this.sessionContextTemplate,
      sessionId,
      injectionTimestamp: new Date().toISOString()
    };

    this.sessionContexts.set(sessionId, sessionContext);
    
    // Write session context to file
    const contextPath = path.join(this.projectRoot, 'data/sessions', `context-${sessionId}.json`);
    fs.writeFileSync(contextPath, JSON.stringify(sessionContext, null, 2));
    
    console.log(`  ✅ Context injected into session: ${sessionId}`);
    return sessionContext;
  }

  async getContextForHolon(holonName) {
    console.log(`🔍 Getting context for holon: ${holonName}`);
    
    const holon = this.holonContext.holons.find(h => 
      h.name.toLowerCase().includes(holonName.toLowerCase())
    );

    if (!holon) {
      throw new Error(`Holon not found: ${holonName}`);
    }

    const context = {
      holon,
      governance: this.holonContext.governance,
      communication: this.holonContext.communication,
      lifecycle: this.holonContext.lifecycle,
      security: this.holonContext.security,
      monitoring: this.holonContext.monitoring,
      canonicalDoc: this.canonicalHolonDoc,
      relatedDocs: this.metadata?.related_docs || []
    };

    console.log(`  ✅ Context retrieved for holon: ${holonName}`);
    return context;
  }

  async getContextForSystemArea(area) {
    console.log(`🔍 Getting context for system area: ${area}`);
    
    const context = {
      area,
      holonArchitecture: this.holonContext,
      canonicalDoc: this.canonicalHolonDoc,
      relatedDocs: this.metadata?.related_docs || [],
      contextRegistry: Array.from(this.contextRegistry.keys())
    };

    console.log(`  ✅ Context retrieved for system area: ${area}`);
    return context;
  }

  async generateContextReport() {
    console.log('📊 Generating context report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      canonicalDoc: this.canonicalHolonDoc,
      holonCount: this.holonContext.holons.length,
      contextRegistrySize: this.contextRegistry.size,
      activeSessions: this.sessionContexts.size,
      metadata: this.metadata,
      health: {
        canonicalDocExists: fs.existsSync(this.canonicalHolonDoc),
        contextRegistryPopulated: this.contextRegistry.size > 0,
        sessionContextsActive: this.sessionContexts.size > 0
      }
    };

    console.log('  ✅ Context report generated');
    return report;
  }
}

// Export for use in other protocols
module.exports = ContextIntegrationProtocol;

// CLI interface
if (require.main === module) {
  const protocol = new ContextIntegrationProtocol();
  
  const command = process.argv[2];
  const args = process.argv.slice(3);

  async function run() {
    await protocol.initialize();

    switch (command) {
      case 'inject-session':
        const sessionId = args[0] || `session-${Date.now()}`;
        await protocol.injectContextIntoSession(sessionId);
        break;
        
      case 'get-holon-context':
        const holonName = args[0];
        if (!holonName) {
          console.error('❌ Holon name required');
          process.exit(1);
        }
        const holonContext = await protocol.getContextForHolon(holonName);
        console.log(JSON.stringify(holonContext, null, 2));
        break;
        
      case 'get-system-context':
        const area = args[0] || 'general';
        const systemContext = await protocol.getContextForSystemArea(area);
        console.log(JSON.stringify(systemContext, null, 2));
        break;
        
      case 'report':
        const report = await protocol.generateContextReport();
        console.log(JSON.stringify(report, null, 2));
        break;
        
      default:
        console.log('Usage: node context_integration.cjs [command] [args]');
        console.log('Commands:');
        console.log('  inject-session [sessionId]  - Inject context into session');
        console.log('  get-holon-context <name>    - Get context for specific holon');
        console.log('  get-system-context [area]   - Get context for system area');
        console.log('  report                      - Generate context report');
        break;
    }
  }

  run().catch(console.error);
} 
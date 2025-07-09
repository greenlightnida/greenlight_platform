#!/usr/bin/env node

/**
 * System Inventory Analysis
 * 
 * PURPOSE: Comprehensive inventory of the entire system to identify what managers 
 * and components we have versus what we should have according to our architecture.
 * 
 * This will help us see what's missing and create a proper visualization.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_ROOT = process.cwd();
const INVENTORY_REPORT_PATH = path.join(PROJECT_ROOT, 'SYSTEM_INVENTORY_REPORT.json');

// Expected architecture based on documentation
const EXPECTED_ARCHITECTURE = {
  // Principle Holons (Parent Governors)
  principleHolons: {
    systemMaster: {
      description: 'Meta-system governance and oversight',
      expectedManagers: ['SystemMaster', 'GovernanceOrchestrator', 'RepositoryGovernor'],
      expectedComponents: ['SystemMaster', 'SystemDashboard', 'SystemEvolutionIntelligence'],
      expectedServices: ['auditService', 'systemLogService', 'performanceTrackingService']
    },
    elevate: {
      description: 'Coaching product governance',
      expectedManagers: ['ElevateManager', 'CoachingManager', 'PlayerManager'],
      expectedComponents: ['CoachingToolkit', 'PlayerGrid', 'MediaLibrary', 'PhotoUpload'],
      expectedServices: ['playerService', 'dataImportService', 'aiInsightsService']
    },
    administrate: {
      description: 'Business intelligence governance',
      expectedManagers: ['AdministrateManager', 'ExecutiveManager', 'BusinessIntelligenceManager'],
      expectedComponents: ['ExecutiveDashboard', 'SystemAuditPanel', 'StorageDashboard'],
      expectedServices: ['auditService', 'businessIntelligenceService', 'reportingService']
    },
    elaborate: {
      description: 'System governance and evolution',
      expectedManagers: ['ElaborateManager', 'SystemEvolutionManager', 'ProtocolManager'],
      expectedComponents: ['SystemMaster', 'SystemDashboard', 'SystemEvolutionIntelligence'],
      expectedServices: ['auditService', 'deploymentTracker', 'systemEvolutionService']
    },
    articulate: {
      description: 'Knowledge management governance',
      expectedManagers: ['ArticulateManager', 'KnowledgeManager', 'WorkManager'],
      expectedComponents: ['KnowledgeBase', 'TaskEngine', 'Wiki', 'WorkHistory', 'Insights'],
      expectedServices: ['developerNotesService', 'nlpService', 'knowledgeService']
    }
  },
  
  // Core Managers (System Level)
  coreManagers: {
    sessionManager: {
      description: 'Session management and protocol orchestration',
      expectedLocation: 'src/core/session-management/',
      expectedFiles: ['SessionManager.ts']
    },
    migrationsManager: {
      description: 'System migration management with safety checks',
      expectedLocation: 'src/core/migrations/',
      expectedFiles: ['MigrationsManager.ts']
    },
    protocolManager: {
      description: 'Protocol management and execution',
      expectedLocation: 'src/core/protocols/',
      expectedFiles: ['ProtocolManager.ts']
    },
    governanceOrchestrator: {
      description: 'High-level governance coordination',
      expectedLocation: 'src/core/governance/',
      expectedFiles: ['GovernanceOrchestrator.ts']
    },
    repositoryGovernor: {
      description: 'Repository governance and monitoring',
      expectedLocation: 'src/core/governance/',
      expectedFiles: ['RepositoryGovernor.ts']
    },
    repositoryMonitor: {
      description: 'Repository monitoring and health tracking',
      expectedLocation: 'src/core/governance/monitors/',
      expectedFiles: ['RepositoryMonitor.ts']
    },
    alertManager: {
      description: 'Multi-channel alerting and notification',
      expectedLocation: 'src/core/governance/alerts/',
      expectedFiles: ['AlertManager.ts']
    },
    policyEngine: {
      description: 'Automated policy enforcement and compliance',
      expectedLocation: 'src/core/governance/policies/',
      expectedFiles: ['PolicyEngine.ts']
    },
    apiGraphManager: {
      description: 'API graph management and optimization',
      expectedLocation: 'src/api-gateway/graph-manager/',
      expectedFiles: ['APIGraphManager.ts']
    }
  },
  
  // ScriptMaster System
  scriptMaster: {
    description: 'Script orchestration and governance system',
    expectedComponents: ['ScriptMaster', 'SystemMaster'],
    expectedFiles: [
      'scripts/script_catalog.json',
      'src/components/SystemMaster/ScriptMaster.tsx',
      'src/components/SystemMaster/SystemMaster.tsx',
      'src/components/SystemMaster/types.ts',
      'src/components/SystemMaster/index.ts'
    ]
  }
};

// Helper functions
function findFiles(dir, pattern) {
  const files = [];
  
  function scan(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scan(fullPath);
        } else if (pattern.test(item)) {
          files.push(fullPath.replace(PROJECT_ROOT, '').substring(1));
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
  }
  
  scan(dir);
  return files;
}

function findManagerClasses() {
  const managerFiles = findFiles(PROJECT_ROOT, /Manager\.(ts|tsx|js|jsx)$/);
  const managers = [];
  
  for (const file of managerFiles) {
    try {
      const content = fs.readFileSync(path.join(PROJECT_ROOT, file), 'utf8');
      const classMatches = content.match(/class\s+(\w+Manager)\s+/g);
      
      if (classMatches) {
        for (const match of classMatches) {
          const className = match.match(/class\s+(\w+Manager)/)[1];
          managers.push({
            className,
            file,
            type: 'class'
          });
        }
      }
      
      // Also look for exported functions that might be managers
      const exportMatches = content.match(/export\s+(?:const|function)\s+(\w+Manager)/g);
      if (exportMatches) {
        for (const match of exportMatches) {
          const functionName = match.match(/export\s+(?:const|function)\s+(\w+Manager)/)[1];
          managers.push({
            className: functionName,
            file,
            type: 'function'
          });
        }
      }
    } catch (error) {
      console.warn(`Could not read file ${file}:`, error.message);
    }
  }
  
  return managers;
}

function findComponents() {
  const componentFiles = findFiles(PROJECT_ROOT, /\.(tsx|jsx)$/);
  const components = [];
  
  for (const file of componentFiles) {
    try {
      const content = fs.readFileSync(path.join(PROJECT_ROOT, file), 'utf8');
      
      // Look for React components
      const componentMatches = content.match(/export\s+(?:default\s+)?(?:const|function)\s+(\w+)/g);
      if (componentMatches) {
        for (const match of componentMatches) {
          const componentName = match.match(/export\s+(?:default\s+)?(?:const|function)\s+(\w+)/)[1];
          if (componentName && !componentName.includes('Manager')) {
            components.push({
              name: componentName,
              file
            });
          }
        }
      }
    } catch (error) {
      console.warn(`Could not read file ${file}:`, error.message);
    }
  }
  
  return components;
}

function findServices() {
  const serviceFiles = findFiles(PROJECT_ROOT, /Service\.(ts|js)$/);
  const services = [];
  
  for (const file of serviceFiles) {
    try {
      const content = fs.readFileSync(path.join(PROJECT_ROOT, file), 'utf8');
      
      // Look for service classes or functions
      const classMatches = content.match(/class\s+(\w+Service)/g);
      if (classMatches) {
        for (const match of classMatches) {
          const serviceName = match.match(/class\s+(\w+Service)/)[1];
          services.push({
            name: serviceName,
            file,
            type: 'class'
          });
        }
      }
      
      const exportMatches = content.match(/export\s+(?:const|function)\s+(\w+Service)/g);
      if (exportMatches) {
        for (const match of exportMatches) {
          const serviceName = match.match(/export\s+(?:const|function)\s+(\w+Service)/)[1];
          services.push({
            name: serviceName,
            file,
            type: 'function'
          });
        }
      }
    } catch (error) {
      console.warn(`Could not read file ${file}:`, error.message);
    }
  }
  
  return services;
}

function analyzeArchitecture() {
  console.log('🔍 Analyzing system architecture...');
  
  const inventory = {
    timestamp: new Date().toISOString(),
    summary: {
      totalManagers: 0,
      totalComponents: 0,
      totalServices: 0,
      missingManagers: 0,
      missingComponents: 0,
      missingServices: 0
    },
    found: {
      managers: findManagerClasses(),
      components: findComponents(),
      services: findServices()
    },
    expected: EXPECTED_ARCHITECTURE,
    analysis: {
      principleHolons: {},
      coreManagers: {},
      scriptMaster: {},
      missing: {
        managers: [],
        components: [],
        services: [],
        files: []
      }
    }
  };
  
  // Analyze principle holons
  for (const [holonName, holonConfig] of Object.entries(EXPECTED_ARCHITECTURE.principleHolons)) {
    const foundManagers = inventory.found.managers.filter(m => 
      holonConfig.expectedManagers.some(expected => m.className.includes(expected))
    );
    const foundComponents = inventory.found.components.filter(c => 
      holonConfig.expectedComponents.some(expected => c.name.includes(expected))
    );
    const foundServices = inventory.found.services.filter(s => 
      holonConfig.expectedServices.some(expected => s.name.includes(expected))
    );
    
    inventory.analysis.principleHolons[holonName] = {
      description: holonConfig.description,
      expected: {
        managers: holonConfig.expectedManagers,
        components: holonConfig.expectedComponents,
        services: holonConfig.expectedServices
      },
      found: {
        managers: foundManagers,
        components: foundComponents,
        services: foundServices
      },
      missing: {
        managers: holonConfig.expectedManagers.filter(expected => 
          !foundManagers.some(found => found.className.includes(expected))
        ),
        components: holonConfig.expectedComponents.filter(expected => 
          !foundComponents.some(found => found.name.includes(expected))
        ),
        services: holonConfig.expectedServices.filter(expected => 
          !foundServices.some(found => found.name.includes(expected))
        )
      }
    };
  }
  
  // Analyze core managers
  for (const [managerName, managerConfig] of Object.entries(EXPECTED_ARCHITECTURE.coreManagers)) {
    const foundManagers = inventory.found.managers.filter(m => 
      m.className.toLowerCase().includes(managerName.toLowerCase())
    );
    const foundFiles = managerConfig.expectedFiles.filter(file => 
      fs.existsSync(path.join(PROJECT_ROOT, file))
    );
    
    inventory.analysis.coreManagers[managerName] = {
      description: managerConfig.description,
      expectedLocation: managerConfig.expectedLocation,
      expectedFiles: managerConfig.expectedFiles,
      found: {
        managers: foundManagers,
        files: foundFiles
      },
      missing: {
        managers: foundManagers.length === 0 ? [managerName] : [],
        files: managerConfig.expectedFiles.filter(file => 
          !fs.existsSync(path.join(PROJECT_ROOT, file))
        )
      }
    };
  }
  
  // Analyze ScriptMaster system
  const scriptMasterFiles = EXPECTED_ARCHITECTURE.scriptMaster.expectedFiles.filter(file => 
    fs.existsSync(path.join(PROJECT_ROOT, file))
  );
  const scriptMasterComponents = inventory.found.components.filter(c => 
    EXPECTED_ARCHITECTURE.scriptMaster.expectedComponents.some(expected => c.name.includes(expected))
  );
  
  inventory.analysis.scriptMaster = {
    description: EXPECTED_ARCHITECTURE.scriptMaster.description,
    expectedFiles: EXPECTED_ARCHITECTURE.scriptMaster.expectedFiles,
    expectedComponents: EXPECTED_ARCHITECTURE.scriptMaster.expectedComponents,
    found: {
      files: scriptMasterFiles,
      components: scriptMasterComponents
    },
    missing: {
      files: EXPECTED_ARCHITECTURE.scriptMaster.expectedFiles.filter(file => 
        !fs.existsSync(path.join(PROJECT_ROOT, file))
      ),
      components: EXPECTED_ARCHITECTURE.scriptMaster.expectedComponents.filter(expected => 
        !scriptMasterComponents.some(found => found.name.includes(expected))
      )
    }
  };
  
  // Calculate summary statistics
  inventory.summary.totalManagers = inventory.found.managers.length;
  inventory.summary.totalComponents = inventory.found.components.length;
  inventory.summary.totalServices = inventory.found.services.length;
  
  // Count missing items
  let missingManagers = 0;
  let missingComponents = 0;
  let missingServices = 0;
  let missingFiles = 0;
  
  for (const holon of Object.values(inventory.analysis.principleHolons)) {
    missingManagers += holon.missing.managers.length;
    missingComponents += holon.missing.components.length;
    missingServices += holon.missing.services.length;
  }
  
  for (const manager of Object.values(inventory.analysis.coreManagers)) {
    missingManagers += manager.missing.managers.length;
    missingFiles += manager.missing.files.length;
  }
  
  missingFiles += inventory.analysis.scriptMaster.missing.files.length;
  
  inventory.summary.missingManagers = missingManagers;
  inventory.summary.missingComponents = missingComponents;
  inventory.summary.missingServices = missingServices;
  inventory.summary.missingFiles = missingFiles;
  
  return inventory;
}

function generateReport(inventory) {
  console.log('\n📊 SYSTEM INVENTORY ANALYSIS REPORT');
  console.log('====================================');
  
  console.log(`\n📈 SUMMARY STATISTICS:`);
  console.log(`   Found Managers: ${inventory.summary.totalManagers}`);
  console.log(`   Found Components: ${inventory.summary.totalComponents}`);
  console.log(`   Found Services: ${inventory.summary.totalServices}`);
  console.log(`   Missing Managers: ${inventory.summary.missingManagers}`);
  console.log(`   Missing Components: ${inventory.summary.missingComponents}`);
  console.log(`   Missing Services: ${inventory.summary.missingServices}`);
  console.log(`   Missing Files: ${inventory.summary.missingFiles}`);
  
  console.log(`\n🏛️ PRINCIPLE HOLONS ANALYSIS:`);
  for (const [holonName, holon] of Object.entries(inventory.analysis.principleHolons)) {
    console.log(`\n   ${holonName.toUpperCase()}:`);
    console.log(`     Description: ${holon.description}`);
    console.log(`     Found Managers: ${holon.found.managers.length}/${holon.expected.managers.length}`);
    console.log(`     Found Components: ${holon.found.components.length}/${holon.expected.components.length}`);
    console.log(`     Found Services: ${holon.found.services.length}/${holon.expected.services.length}`);
    
    if (holon.missing.managers.length > 0) {
      console.log(`     ❌ Missing Managers: ${holon.missing.managers.join(', ')}`);
    }
    if (holon.missing.components.length > 0) {
      console.log(`     ❌ Missing Components: ${holon.missing.components.join(', ')}`);
    }
    if (holon.missing.services.length > 0) {
      console.log(`     ❌ Missing Services: ${holon.missing.services.join(', ')}`);
    }
  }
  
  console.log(`\n🔧 CORE MANAGERS ANALYSIS:`);
  for (const [managerName, manager] of Object.entries(inventory.analysis.coreManagers)) {
    console.log(`\n   ${managerName}:`);
    console.log(`     Description: ${manager.description}`);
    console.log(`     Expected Location: ${manager.expectedLocation}`);
    console.log(`     Found Managers: ${manager.found.managers.length}`);
    console.log(`     Found Files: ${manager.found.files.length}/${manager.expectedFiles.length}`);
    
    if (manager.missing.managers.length > 0) {
      console.log(`     ❌ Missing Managers: ${manager.missing.managers.join(', ')}`);
    }
    if (manager.missing.files.length > 0) {
      console.log(`     ❌ Missing Files: ${manager.missing.files.join(', ')}`);
    }
  }
  
  console.log(`\n📜 SCRIPTMASTER SYSTEM ANALYSIS:`);
  console.log(`   Description: ${inventory.analysis.scriptMaster.description}`);
  console.log(`   Found Files: ${inventory.analysis.scriptMaster.found.files.length}/${inventory.analysis.scriptMaster.expectedFiles.length}`);
  console.log(`   Found Components: ${inventory.analysis.scriptMaster.found.components.length}/${inventory.analysis.scriptMaster.expectedComponents.length}`);
  
  if (inventory.analysis.scriptMaster.missing.files.length > 0) {
    console.log(`   ❌ Missing Files: ${inventory.analysis.scriptMaster.missing.files.join(', ')}`);
  }
  if (inventory.analysis.scriptMaster.missing.components.length > 0) {
    console.log(`   ❌ Missing Components: ${inventory.analysis.scriptMaster.missing.components.join(', ')}`);
  }
  
  console.log(`\n🔍 DETAILED FINDINGS:`);
  console.log(`\n   Found Managers (${inventory.found.managers.length}):`);
  for (const manager of inventory.found.managers) {
    console.log(`     - ${manager.className} (${manager.type}) in ${manager.file}`);
  }
  
  console.log(`\n   Found Components (${inventory.found.components.length}):`);
  for (const component of inventory.found.components.slice(0, 20)) { // Show first 20
    console.log(`     - ${component.name} in ${component.file}`);
  }
  if (inventory.found.components.length > 20) {
    console.log(`     ... and ${inventory.found.components.length - 20} more`);
  }
  
  console.log(`\n   Found Services (${inventory.found.services.length}):`);
  for (const service of inventory.found.services) {
    console.log(`     - ${service.name} (${service.type}) in ${service.file}`);
  }
}

function main() {
  console.log('🔍 Starting System Inventory Analysis...');
  console.log('========================================');
  
  try {
    const inventory = analyzeArchitecture();
    generateReport(inventory);
    
    // Save detailed report
    fs.writeFileSync(INVENTORY_REPORT_PATH, JSON.stringify(inventory, null, 2));
    console.log(`\n📄 Detailed report saved to: ${INVENTORY_REPORT_PATH}`);
    
    console.log('\n✅ System inventory analysis complete!');
    
  } catch (error) {
    console.error('❌ Error during inventory analysis:', error);
    process.exit(1);
  }
}

// Run the analysis
if (require.main === module) {
  main();
}

module.exports = { analyzeArchitecture, generateReport }; 
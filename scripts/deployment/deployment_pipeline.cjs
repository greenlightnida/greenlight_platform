#!/usr/bin/env node

/**
 * Deployment Pipeline v1.0.0
 * 
 * PURPOSE: Self-service deployment pipeline inspired by Port.io's internal deployment system.
 * Provides developers with simple deployment actions while abstracting infrastructure complexity.
 * 
 * FEATURES:
 * - Blueprint-based infrastructure metadata management
 * - Self-service deployment actions (deploy, rollback, feature flags)
 * - Multi-environment support (development, staging, production)
 * - Deployment health monitoring and logging
 * - Infrastructure complexity abstraction
 * - Dynamic environment configuration
 * 
 * USAGE: node scripts/deployment/deployment_pipeline.cjs [action] [options]
 * 
 * ACTIONS:
 * - deploy [service] [environment] - Deploy service to environment
 * - rollback [service] [version] - Rollback service to previous version
 * - health [service] - Check deployment health
 * - environments - List available environments
 * - services - List available services
 * - blueprints - Manage deployment blueprints
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DeploymentPipeline {
  constructor() {
    this.projectRoot = process.cwd();
    this.timestamp = new Date().toISOString();
    this.deploymentId = this.generateDeploymentId();
    
    // Initialize paths
    this.blueprintsPath = path.join(this.projectRoot, 'data', 'deployment', 'blueprints');
    this.deploymentsPath = path.join(this.projectRoot, 'data', 'deployment', 'deployments');
    this.environmentsPath = path.join(this.projectRoot, 'data', 'deployment', 'environments');
    
    // Ensure directories exist
    this.ensureDirectories();
    
    // Load configuration
    this.config = this.loadConfiguration();
    this.blueprints = this.loadBlueprints();
    this.environments = this.loadEnvironments();
  }

  generateDeploymentId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `deploy-${timestamp}-${random}`;
  }

  ensureDirectories() {
    const dirs = [this.blueprintsPath, this.deploymentsPath, this.environmentsPath];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  loadConfiguration() {
    const configPath = path.join(this.projectRoot, 'config', 'deployment', 'deployment-config.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    
    // Default configuration
    return {
      version: '1.0.0',
      defaultEnvironment: 'staging',
      deploymentTypes: ['manual', 'automated', 'blue-green', 'canary'],
      healthCheckTimeout: 30000,
      rollbackEnabled: true,
      featureFlagsEnabled: true,
      monitoring: {
        enabled: true,
        metrics: ['responseTime', 'errorRate', 'uptime'],
        alerts: ['highErrorRate', 'slowResponse', 'downtime']
      }
    };
  }

  loadBlueprints() {
    const blueprints = {};
    if (fs.existsSync(this.blueprintsPath)) {
      const files = fs.readdirSync(this.blueprintsPath);
      files.forEach(file => {
        if (file.endsWith('.json')) {
          const blueprintName = file.replace('.json', '');
          const blueprintPath = path.join(this.blueprintsPath, file);
          blueprints[blueprintName] = JSON.parse(fs.readFileSync(blueprintPath, 'utf8'));
        }
      });
    }
    return blueprints;
  }

  loadEnvironments() {
    const environments = {};
    if (fs.existsSync(this.environmentsPath)) {
      const files = fs.readdirSync(this.environmentsPath);
      files.forEach(file => {
        if (file.endsWith('.json')) {
          const envName = file.replace('.json', '');
          const envPath = path.join(this.environmentsPath, file);
          environments[envName] = JSON.parse(fs.readFileSync(envPath, 'utf8'));
        }
      });
    }
    return environments;
  }

  async execute() {
    const args = process.argv.slice(2);
    const action = args[0];
    const service = args[1];
    const environment = args[2] || this.config.defaultEnvironment;

    console.log('🚀 Deployment Pipeline v1.0.0');
    console.log('==============================');
    console.log(`Deployment ID: ${this.deploymentId}`);
    console.log(`Timestamp: ${this.timestamp}`);
    console.log('');

    try {
      switch (action) {
        case 'deploy':
          await this.deployService(service, environment);
          break;
        case 'rollback':
          const version = args[2];
          await this.rollbackService(service, version);
          break;
        case 'health':
          await this.checkHealth(service);
          break;
        case 'environments':
          this.listEnvironments();
          break;
        case 'services':
          this.listServices();
          break;
        case 'blueprints':
          await this.manageBlueprints(args.slice(1));
          break;
        case 'init':
          await this.initializeDeploymentSystem();
          break;
        default:
          this.showHelp();
      }
    } catch (error) {
      console.error('❌ Deployment failed:', error.message);
      this.logError(error);
      process.exit(1);
    }
  }

  async deployService(serviceName, environment) {
    console.log(`🚀 Deploying ${serviceName} to ${environment}...`);
    
    // Validate service and environment
    if (!this.blueprints[serviceName]) {
      throw new Error(`Service blueprint not found: ${serviceName}`);
    }
    
    if (!this.environments[environment]) {
      throw new Error(`Environment not found: ${environment}`);
    }

    const serviceBlueprint = this.blueprints[serviceName];
    const envConfig = this.environments[environment];
    
    // Create deployment record
    const deployment = {
      id: this.deploymentId,
      service: serviceName,
      environment: environment,
      status: 'in-progress',
      deploymentType: 'automated',
      version: serviceBlueprint.version || '1.0.0',
      timestamp: this.timestamp,
      metadata: {
        blueprint: serviceBlueprint,
        environment: envConfig,
        deployedBy: process.env.USER || 'unknown'
      },
      health: {
        status: 'unknown',
        responseTime: 0,
        errorRate: 0,
        uptime: 0,
        lastCheck: this.timestamp
      }
    };

    // Execute deployment steps
    try {
      // Step 1: Pre-deployment validation
      await this.validateDeployment(deployment);
      
      // Step 2: Build service
      await this.buildService(serviceBlueprint, envConfig);
      
      // Step 3: Deploy to environment
      await this.executeDeployment(deployment);
      
      // Step 4: Health check
      await this.performHealthCheck(deployment);
      
      // Step 5: Update deployment status
      deployment.status = 'completed';
      deployment.completedAt = new Date().toISOString();
      
      // Save deployment record
      this.saveDeployment(deployment);
      
      console.log(`✅ Deployment completed: ${deployment.id}`);
      console.log(`🌐 Service available at: ${envConfig.url}`);
      
    } catch (error) {
      deployment.status = 'failed';
      deployment.error = error.message;
      deployment.failedAt = new Date().toISOString();
      this.saveDeployment(deployment);
      throw error;
    }
  }

  async validateDeployment(deployment) {
    console.log('🔍 Validating deployment...');
    
    const { serviceBlueprint, environment } = deployment.metadata;
    
    // Check service dependencies
    if (serviceBlueprint.dependencies) {
      for (const dep of serviceBlueprint.dependencies) {
        if (!this.blueprints[dep]) {
          throw new Error(`Missing dependency: ${dep}`);
        }
      }
    }
    
    // Check environment requirements
    if (environment.requirements) {
      for (const req of environment.requirements) {
        if (!this.checkRequirement(req)) {
          throw new Error(`Environment requirement not met: ${req.name}`);
        }
      }
    }
    
    console.log('✅ Deployment validation passed');
  }

  async buildService(blueprint, envConfig) {
    console.log('🔨 Building service...');
    
    const buildCommands = blueprint.build || ['npm run build'];
    
    for (const command of buildCommands) {
      try {
        execSync(command, { 
          cwd: blueprint.sourcePath || this.projectRoot,
          stdio: 'pipe'
        });
        console.log(`✅ Build command completed: ${command}`);
      } catch (error) {
        throw new Error(`Build failed: ${command} - ${error.message}`);
      }
    }
  }

  async executeDeployment(deployment) {
    console.log('🚀 Executing deployment...');
    
    const { serviceBlueprint, environment } = deployment.metadata;
    const deployCommands = serviceBlueprint.deploy || [];
    
    // Add environment-specific deployment commands
    if (environment.deployCommands) {
      deployCommands.push(...environment.deployCommands);
    }
    
    for (const command of deployCommands) {
      try {
        execSync(command, { 
          cwd: serviceBlueprint.sourcePath || this.projectRoot,
          stdio: 'pipe'
        });
        console.log(`✅ Deploy command completed: ${command}`);
      } catch (error) {
        throw new Error(`Deployment failed: ${command} - ${error.message}`);
      }
    }
  }

  async performHealthCheck(deployment) {
    console.log('🏥 Performing health check...');
    
    const { environment } = deployment.metadata;
    const healthUrl = environment.healthCheckUrl;
    
    if (!healthUrl) {
      console.log('⚠️ No health check URL configured');
      return;
    }
    
    try {
      // Simple health check using curl
      const result = execSync(`curl -f -s -o /dev/null -w "%{http_code}" ${healthUrl}`, { 
        stdio: 'pipe',
        timeout: this.config.healthCheckTimeout
      });
      
      const statusCode = result.toString().trim();
      if (statusCode === '200') {
        deployment.health.status = 'healthy';
        console.log('✅ Health check passed');
      } else {
        deployment.health.status = 'degraded';
        console.log(`⚠️ Health check returned status: ${statusCode}`);
      }
    } catch (error) {
      deployment.health.status = 'unhealthy';
      console.log('❌ Health check failed');
    }
  }

  async rollbackService(serviceName, version) {
    console.log(`🔄 Rolling back ${serviceName} to version ${version}...`);
    
    // Find previous deployment
    const deployments = this.loadDeployments();
    const previousDeployment = deployments.find(d => 
      d.service === serviceName && d.version === version
    );
    
    if (!previousDeployment) {
      throw new Error(`Previous deployment not found: ${serviceName} v${version}`);
    }
    
    // Create rollback deployment
    const rollbackDeployment = {
      id: this.generateDeploymentId(),
      service: serviceName,
      environment: previousDeployment.environment,
      status: 'rollback',
      deploymentType: 'rollback',
      version: version,
      timestamp: this.timestamp,
      rollbackFrom: previousDeployment.version,
      metadata: previousDeployment.metadata
    };
    
    // Execute rollback
    try {
      await this.executeDeployment(rollbackDeployment);
      await this.performHealthCheck(rollbackDeployment);
      
      rollbackDeployment.status = 'completed';
      rollbackDeployment.completedAt = new Date().toISOString();
      this.saveDeployment(rollbackDeployment);
      
      console.log(`✅ Rollback completed: ${rollbackDeployment.id}`);
    } catch (error) {
      rollbackDeployment.status = 'failed';
      rollbackDeployment.error = error.message;
      this.saveDeployment(rollbackDeployment);
      throw error;
    }
  }

  async checkHealth(serviceName) {
    console.log(`🏥 Checking health for ${serviceName}...`);
    
    const deployments = this.loadDeployments();
    const latestDeployment = deployments
      .filter(d => d.service === serviceName)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
    
    if (!latestDeployment) {
      throw new Error(`No deployments found for service: ${serviceName}`);
    }
    
    console.log(`Service: ${serviceName}`);
    console.log(`Environment: ${latestDeployment.environment}`);
    console.log(`Version: ${latestDeployment.version}`);
    console.log(`Status: ${latestDeployment.status}`);
    console.log(`Health: ${latestDeployment.health.status}`);
    console.log(`Last Deployed: ${latestDeployment.timestamp}`);
    
    if (latestDeployment.health.status === 'unhealthy') {
      console.log('❌ Service is unhealthy - consider rollback');
    } else if (latestDeployment.health.status === 'degraded') {
      console.log('⚠️ Service is degraded - monitor closely');
    } else {
      console.log('✅ Service is healthy');
    }
  }

  listEnvironments() {
    console.log('🌍 Available Environments:');
    console.log('');
    
    Object.entries(this.environments).forEach(([name, config]) => {
      console.log(`  ${name}:`);
      console.log(`    URL: ${config.url}`);
      console.log(`    Type: ${config.type}`);
      console.log(`    Status: ${config.status}`);
      console.log('');
    });
  }

  listServices() {
    console.log('🔧 Available Services:');
    console.log('');
    
    Object.entries(this.blueprints).forEach(([name, blueprint]) => {
      console.log(`  ${name}:`);
      console.log(`    Version: ${blueprint.version}`);
      console.log(`    Type: ${blueprint.type}`);
      console.log(`    Source: ${blueprint.sourcePath || 'root'}`);
      console.log('');
    });
  }

  async manageBlueprints(args) {
    const action = args[0];
    
    switch (action) {
      case 'create':
        await this.createBlueprint(args[1]);
        break;
      case 'update':
        await this.updateBlueprint(args[1]);
        break;
      case 'list':
        this.listBlueprints();
        break;
      default:
        console.log('Blueprint actions: create, update, list');
    }
  }

  async createBlueprint(blueprintName) {
    console.log(`📝 Creating blueprint: ${blueprintName}`);
    
    const blueprint = {
      name: blueprintName,
      version: '1.0.0',
      type: 'service',
      sourcePath: this.projectRoot,
      build: ['npm run build'],
      deploy: [],
      dependencies: [],
      healthCheck: {
        url: '',
        timeout: 30000
      },
      metadata: {
        createdAt: this.timestamp,
        createdBy: process.env.USER || 'unknown'
      }
    };
    
    const blueprintPath = path.join(this.blueprintsPath, `${blueprintName}.json`);
    fs.writeFileSync(blueprintPath, JSON.stringify(blueprint, null, 2));
    
    console.log(`✅ Blueprint created: ${blueprintPath}`);
  }

  async updateBlueprint(blueprintName) {
    console.log(`📝 Updating blueprint: ${blueprintName}`);
    
    const blueprintPath = path.join(this.blueprintsPath, `${blueprintName}.json`);
    if (!fs.existsSync(blueprintPath)) {
      throw new Error(`Blueprint not found: ${blueprintName}`);
    }
    
    // Load existing blueprint
    const blueprint = JSON.parse(fs.readFileSync(blueprintPath, 'utf8'));
    
    // Update version
    blueprint.version = this.incrementVersion(blueprint.version);
    blueprint.metadata.updatedAt = this.timestamp;
    blueprint.metadata.updatedBy = process.env.USER || 'unknown';
    
    fs.writeFileSync(blueprintPath, JSON.stringify(blueprint, null, 2));
    
    console.log(`✅ Blueprint updated: ${blueprintPath}`);
  }

  listBlueprints() {
    console.log('📋 Available Blueprints:');
    console.log('');
    
    Object.entries(this.blueprints).forEach(([name, blueprint]) => {
      console.log(`  ${name}:`);
      console.log(`    Version: ${blueprint.version}`);
      console.log(`    Type: ${blueprint.type}`);
      console.log(`    Dependencies: ${blueprint.dependencies?.length || 0}`);
      console.log('');
    });
  }

  async initializeDeploymentSystem() {
    console.log('🚀 Initializing deployment system...');
    
    // Create default environments
    const defaultEnvironments = {
      development: {
        name: 'development',
        type: 'local',
        url: 'http://localhost:3000',
        status: 'active',
        healthCheckUrl: 'http://localhost:3000/health',
        deployCommands: ['npm run dev']
      },
      staging: {
        name: 'staging',
        type: 'staging',
        url: 'https://staging.greenlight.live',
        status: 'active',
        healthCheckUrl: 'https://staging.greenlight.live/health',
        deployCommands: ['npm run build', 'npm run deploy:staging']
      },
      production: {
        name: 'production',
        type: 'production',
        url: 'https://greenlight.live',
        status: 'active',
        healthCheckUrl: 'https://greenlight.live/health',
        deployCommands: ['npm run build', 'npm run deploy:production']
      }
    };
    
    // Create environment files
    Object.entries(defaultEnvironments).forEach(([name, config]) => {
      const envPath = path.join(this.environmentsPath, `${name}.json`);
      fs.writeFileSync(envPath, JSON.stringify(config, null, 2));
      console.log(`✅ Created environment: ${name}`);
    });
    
    // Create default service blueprint
    const defaultBlueprint = {
      name: 'greenlight-platform',
      version: '1.0.0',
      type: 'platform',
      sourcePath: this.projectRoot,
      build: ['npm run build'],
      deploy: ['npm run deploy'],
      dependencies: [],
      healthCheck: {
        url: '/health',
        timeout: 30000
      },
      metadata: {
        createdAt: this.timestamp,
        createdBy: process.env.USER || 'unknown'
      }
    };
    
    const blueprintPath = path.join(this.blueprintsPath, 'greenlight-platform.json');
    fs.writeFileSync(blueprintPath, JSON.stringify(defaultBlueprint, null, 2));
    console.log('✅ Created default blueprint: greenlight-platform');
    
    console.log('✅ Deployment system initialized');
  }

  saveDeployment(deployment) {
    const deploymentPath = path.join(this.deploymentsPath, `${deployment.id}.json`);
    fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
  }

  loadDeployments() {
    const deployments = [];
    if (fs.existsSync(this.deploymentsPath)) {
      const files = fs.readdirSync(this.deploymentsPath);
      files.forEach(file => {
        if (file.endsWith('.json')) {
          const deploymentPath = path.join(this.deploymentsPath, file);
          deployments.push(JSON.parse(fs.readFileSync(deploymentPath, 'utf8')));
        }
      });
    }
    return deployments;
  }

  checkRequirement(requirement) {
    // Simple requirement checking - can be extended
    switch (requirement.type) {
      case 'command':
        try {
          execSync(requirement.command, { stdio: 'pipe' });
          return true;
        } catch {
          return false;
        }
      case 'file':
        return fs.existsSync(requirement.path);
      default:
        return true;
    }
  }

  incrementVersion(version) {
    const parts = version.split('.');
    parts[2] = (parseInt(parts[2]) + 1).toString();
    return parts.join('.');
  }

  logError(error) {
    const errorLog = {
      deploymentId: this.deploymentId,
      timestamp: this.timestamp,
      error: error.message,
      stack: error.stack
    };
    
    const errorPath = path.join(this.deploymentsPath, 'errors', `${this.deploymentId}-error.json`);
    fs.mkdirSync(path.dirname(errorPath), { recursive: true });
    fs.writeFileSync(errorPath, JSON.stringify(errorLog, null, 2));
  }

  showHelp() {
    console.log('🚀 Deployment Pipeline - Self-Service Deployment System');
    console.log('======================================================');
    console.log('');
    console.log('USAGE: node scripts/deployment/deployment_pipeline.cjs [action] [options]');
    console.log('');
    console.log('ACTIONS:');
    console.log('  deploy [service] [environment]  Deploy service to environment');
    console.log('  rollback [service] [version]    Rollback service to previous version');
    console.log('  health [service]                Check deployment health');
    console.log('  environments                    List available environments');
    console.log('  services                        List available services');
    console.log('  blueprints [action] [name]      Manage deployment blueprints');
    console.log('  init                            Initialize deployment system');
    console.log('');
    console.log('EXAMPLES:');
    console.log('  node scripts/deployment/deployment_pipeline.cjs deploy greenlight-platform staging');
    console.log('  node scripts/deployment/deployment_pipeline.cjs rollback greenlight-platform 1.0.1');
    console.log('  node scripts/deployment/deployment_pipeline.cjs health greenlight-platform');
    console.log('  node scripts/deployment/deployment_pipeline.cjs blueprints create my-service');
    console.log('');
    console.log('FEATURES:');
    console.log('  • Blueprint-based infrastructure metadata');
    console.log('  • Self-service deployment actions');
    console.log('  • Multi-environment support');
    console.log('  • Health monitoring and logging');
    console.log('  • Infrastructure complexity abstraction');
  }
}

// Execute if run directly
if (require.main === module) {
  const pipeline = new DeploymentPipeline();
  pipeline.execute().catch(error => {
    console.error('❌ Deployment pipeline failed:', error.message);
    process.exit(1);
  });
}

module.exports = DeploymentPipeline; 
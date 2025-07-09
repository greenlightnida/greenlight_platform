# Greenlight Platform - Governance System

## 🎯 Overview

The **Greenlight Platform** serves as the central governance and monitoring system for the entire ecosystem, with **GovernedRepository** operating under its governance framework. This platform implements the Operational Holon specification to provide comprehensive oversight, automated governance, and operational intelligence.

## 🏗️ Architecture

### Core Governance Components

1. **RepositoryGovernor** - Main governance orchestrator for GovernedRepository
2. **TopBinsMonitor** - Real-time monitoring and metrics collection
3. **PolicyEngine** - Automated policy enforcement and compliance checking
4. **AlertManager** - Multi-channel alerting and notification system
5. **GovernanceOrchestrator** - High-level coordination and management

### Governance Hierarchy

```
Greenlight Platform (Governor)
├── Repository Monitor
├── Policy Engine
├── Alert Manager
└── GovernedRepository (Governed Repository)
    ├── Code Quality Standards
    ├── Security Policies
    ├── Deployment Safety
    └── Performance Monitoring
```

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start governance system
npm run governance
```

### Running Governance Commands

```bash
# Initialize and run full governance audit
npm run governance

# Run specific audit
npm run audit

# Check GovernedRepository health
npm run health

# Get comprehensive system overview
npm run big-picture
```

## 📊 Governance Features

### 0. System Overview (Big Picture)
- **Holon Inventory**: Complete mapping of all system holons and their status
- **Manager Analysis**: Purpose and dependency tracking for all managers
- **Module Inventory**: File structure and export analysis for all modules
- **Administrative Units**: Governance, protocols, config, docs, scripts, and data
- **Protocol System**: Version tracking and status assessment for all protocols
- **Gap Analysis**: Identifies missing or incomplete system components
- **Health Assessment**: Build status, git status, and file structure integrity
- **Recommendations**: AI-powered suggestions for system improvement

### 1. Repository Monitoring
- **Health Status Tracking**: Real-time monitoring of GovernedRepository repository health
- **Build Monitoring**: Track build times, success rates, and test coverage
- **Deployment Monitoring**: Monitor deployment success, rollback times, and costs
- **Performance Metrics**: Track response times, bundle sizes, and load times

### 2. Policy Enforcement
- **Code Quality Policies**: Enforce test coverage, code complexity, and duplication standards
- **Security Policies**: Monitor vulnerabilities, dependency updates, and security scores
- **Deployment Policies**: Ensure build success rates, deployment safety, and rollback capabilities
- **Cost Policies**: Monitor deployment costs and resource utilization

### 3. Automated Alerting
- **Multi-Channel Alerts**: Console, email, and Slack notifications
- **Severity-Based Escalation**: Critical, high, medium, and low priority alerts
- **Policy Violation Alerts**: Automatic notifications for compliance issues
- **System Health Alerts**: Proactive monitoring and alerting

### 4. Optimization Recommendations
- **Performance Optimization**: Build time, bundle size, and response time improvements
- **Security Recommendations**: Vulnerability fixes and dependency updates
- **Cost Optimization**: Deployment cost reduction strategies
- **Quality Improvements**: Test coverage and code quality enhancements

## 🔧 Configuration

### Repository Configuration

The system automatically configures GovernedRepository monitoring with the following settings:

```typescript
const topBinsConfig = {
  id: 'governed-repository',
  name: 'Top Bins Platform',
  path: '../GovernedRepository',
  type: 'product-suite',
  monitoring: {
    enabled: true,
    healthChecks: true,
    performanceMonitoring: true,
    securityScanning: true,
    dependencyAnalysis: true
  }
}
```

### Policy Thresholds

Default policy thresholds are configured for:

- **Test Coverage**: 80% minimum
- **Code Complexity**: Maximum 10
- **Security Vulnerabilities**: 0 allowed
- **Build Success Rate**: 95% minimum
- **Deployment Success Rate**: 98% minimum
- **Rollback Time**: 5 minutes maximum

## 📈 Monitoring Metrics

### Build Metrics
- Build time (seconds)
- Build success rate (%)
- Test coverage (%)
- Test pass rate (%)

### Deployment Metrics
- Deployment success rate (%)
- Deployment time (seconds)
- Rollback time (seconds)
- Deployment cost ($/month)

### Quality Metrics
- Code complexity score
- Code duplication (%)
- Technical debt (days)

### Security Metrics
- Security vulnerabilities count
- Security score (0-100)
- Outdated dependencies count

### Performance Metrics
- Bundle size (KB)
- Load time (seconds)
- Response time (ms)

### Usage Metrics
- Active users
- API calls
- Error rate (%)

## 🚨 Alert System

### Alert Types
- **Critical**: Immediate attention required
- **High**: Important issues to address
- **Medium**: Issues to monitor
- **Low**: Informational alerts

### Alert Channels
- **Console**: Real-time console output
- **Email**: Email notifications (configurable)
- **Slack**: Slack channel notifications (configurable)

## 🎯 Governance Workflow

1. **Initialization**: System starts and configures monitoring for GovernedRepository
2. **Monitoring**: Continuous collection of metrics and health data
3. **Policy Checking**: Automated compliance checking against defined policies
4. **Alerting**: Multi-channel notifications for violations and issues
5. **Recommendations**: AI-powered optimization suggestions
6. **Reporting**: Comprehensive audit reports and dashboards

## 📋 API Reference

### GovernanceOrchestrator

```typescript
// Initialize governance system
await orchestrator.initialize();

// Get GovernedRepository health status
const health = await orchestrator.getTopBinsHealth();

// Run governance audit
const audit = await orchestrator.runGovernanceAudit();

// Get optimization recommendations
const recommendations = await orchestrator.getOptimizationRecommendations();

// Get dashboard data
const dashboard = await orchestrator.getDashboardData();
```

### RepositoryGovernor

```typescript
// Initialize governance for GovernedRepository
await governor.initializeGovernance();

// Get health status
const health = await governor.getHealthStatus();

// Enforce policies
await governor.enforcePolicies();

// Generate recommendations
const recommendations = await governor.generateOptimizationRecommendations();
```

## 🔍 Troubleshooting

### Common Issues

1. **GovernedRepository Path Not Found**
   - Ensure GovernedRepository repository exists at `../GovernedRepository`
   - Check file permissions and access

2. **Policy Violations**
   - Review violation details in audit reports
   - Address issues according to recommendations
   - Update policies if thresholds need adjustment

3. **Alert Channel Failures**
   - Check email/Slack configuration
   - Verify network connectivity
   - Review channel-specific error logs

### Debug Mode

Enable debug logging by setting environment variables:

```bash
export DEBUG=true
export LOG_LEVEL=debug
npm run governance
```

## 📚 Documentation

- [Operational Holon Specification](./docs/OPERATIONAL_HOLON_SPECIFICATION.md)
- [Implementation Progress](./IMPLEMENTATION_PROGRESS.md)
- [API Documentation](./docs/api.md)

## 🤝 Contributing

1. Follow the governance policies defined in this system
2. Ensure all code meets quality standards
3. Run tests and audits before submitting changes
4. Update documentation for any new features

## 📄 License

MIT License - see LICENSE file for details

---

**Greenlight Platform** - Governing GovernedRepository with intelligence and automation. 

## Source of Truth and Update Process
- The canonical source for milestone status and lessons learned is `data/roadmap-actuals/comprehensive-milestone-timeline.json`.
- The canonical source for session context is `greenlight-wiki/CONTEXT.md` (written by the SessionManager).
- The roadmap (`greenlight-wiki/ROADMAP.md`) is a human-readable view and should reference, not duplicate, milestone data.
- Updates to milestones or lessons learned should be made in the JSON tracker, not directly in the roadmap.
- Use the anchor command to audit for divergence between these sources. 
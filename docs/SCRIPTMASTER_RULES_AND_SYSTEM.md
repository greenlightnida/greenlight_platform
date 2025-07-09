# ScriptMaster Rules and System Documentation

## 🎯 **Overview**

ScriptMaster is the central script orchestration and governance system for the Greenlight Platform. It provides comprehensive script management, execution tracking, safety controls, and app potential analysis.

## 🏗️ **System Architecture**

### **Core Components**

1. **Script Catalog** (`scripts/script_catalog.json`)
   - Central registry of all scripts
   - Metadata tracking (priority, safety, dependencies)
   - App potential assessment
   - Integration mapping

2. **ScriptMaster Component** (`src/components/SystemMaster/ScriptMaster.tsx`)
   - Script management UI
   - Execution monitoring
   - Safety controls
   - Analytics dashboard

3. **SystemMaster Component** (`src/components/SystemMaster/SystemMaster.tsx`)
   - System governance interface
   - ScriptMaster integration
   - System monitoring
   - Policy enforcement

## 📋 **Script Registration Rules**

### **Mandatory Fields**
Every script must be registered with the following metadata:

```json
{
  "id": "unique-script-identifier",
  "name": "Human-readable script name",
  "file": "path/to/script/file",
  "category": "governance|migration|cleanup|maintenance|protocol",
  "priority": "critical|high|medium|low",
  "safety": "safe|medium|high",
  "status": "active|inactive|deprecated",
  "description": "Clear description of script purpose",
  "dependencies": ["array", "of", "dependencies"],
  "executionTime": "estimated execution time (e.g., '30-60s')",
  "integrationPoints": ["array", "of", "integration", "points"],
  "appPotential": {
    "dashboard": 1-5,
    "automation": 1-5,
    "integration": 1-5,
    "ui": 1-5
  },
  "riskLevel": "low|medium|high",
  "tags": ["array", "of", "tags"]
}
```

### **Safety Levels**

#### **Safe** (Green Shield)
- Read-only operations
- No system changes
- No approval required
- Examples: audits, validations, reports

#### **Medium** (Yellow Triangle)
- Controlled changes with safety checks
- Requires approval for some operations
- Examples: cleanup scripts, optimizations

#### **High** (Red Triangle)
- Significant system changes
- Always requires approval
- Examples: migrations, structural changes

### **Priority Levels**

#### **Critical** (Red)
- System-critical operations
- Highest execution priority
- Examples: emergency fixes, security patches

#### **High** (Orange)
- High-priority operations
- Examples: migrations, major updates

#### **Medium** (Blue)
- Standard operations
- Examples: maintenance, optimizations

#### **Low** (Gray)
- Low-priority operations
- Examples: cleanup, documentation

## 🔧 **Script Categories**

### **Governance**
- System governance and oversight scripts
- Policy enforcement and compliance
- Security and quality standards

### **Migration**
- System migration and transformation scripts
- Structural changes and updates
- Data migration and cleanup

### **Cleanup**
- System cleanup and maintenance scripts
- Removal of redundant files
- Structure consolidation

### **Maintenance**
- Ongoing maintenance and optimization scripts
- Performance improvements
- Code quality enhancements

### **Protocol**
- System protocol and workflow scripts
- Session management
- Communication and coordination

## 📊 **App Potential Assessment**

### **Dashboard Potential** (1-5)
- **5**: Rich data visualization, real-time monitoring, interactive filtering
- **4**: Good data display, basic filtering, trend analysis
- **3**: Standard charts and graphs, basic metrics
- **2**: Simple data tables, basic reporting
- **1**: Minimal data display, text-only output

### **Automation Potential** (1-5)
- **5**: Full CI/CD integration, scheduled execution, event triggers
- **4**: Automated execution, basic scheduling, webhook integration
- **3**: Scriptable execution, manual scheduling
- **2**: Basic automation, simple triggers
- **1**: Manual execution only

### **Integration Potential** (1-5)
- **5**: Multiple system integrations, API ecosystem, extensible
- **4**: Good integration points, API support, modular design
- **3**: Standard integrations, basic API support
- **2**: Limited integrations, simple connections
- **1**: Standalone operation, no integrations

### **UI Potential** (1-5)
- **5**: Rich user interface, advanced controls, customization
- **4**: Good UI, user-friendly controls, responsive design
- **3**: Standard UI, basic controls, functional design
- **2**: Simple UI, minimal controls, basic functionality
- **1**: Command-line only, no UI

## 🚀 **Execution Rules**

### **Pre-Execution Checks**
1. **Safety Validation**: Verify script safety level and approval requirements
2. **Dependency Check**: Ensure all dependencies are available
3. **Resource Validation**: Check system resources and permissions
4. **Conflict Detection**: Identify potential conflicts with running scripts

### **Execution Monitoring**
1. **Real-time Status**: Track execution progress and status
2. **Resource Monitoring**: Monitor CPU, memory, and disk usage
3. **Error Handling**: Capture and log all errors and warnings
4. **Timeout Management**: Handle script timeouts and hanging processes

### **Post-Execution Actions**
1. **Result Logging**: Log execution results and outputs
2. **Performance Metrics**: Record execution time and resource usage
3. **Integration Updates**: Update related systems and dashboards
4. **Notification**: Send notifications for completion or failures

## 🔒 **Safety Protocols**

### **Approval Workflow**
1. **High Safety Scripts**: Always require manual approval
2. **Medium Safety Scripts**: Require approval for certain operations
3. **Safe Scripts**: Can run automatically with monitoring

### **Rollback Capabilities**
1. **Automatic Rollback**: Built-in rollback for failed migrations
2. **Manual Rollback**: Manual rollback procedures for complex changes
3. **State Preservation**: Preserve system state before changes

### **Audit Trail**
1. **Execution Logging**: Log all script executions with details
2. **Change Tracking**: Track all system changes made by scripts
3. **User Accountability**: Track who executed what and when

## 📈 **Analytics and Reporting**

### **Performance Metrics**
- Execution time tracking
- Success/failure rates
- Resource usage patterns
- Error frequency analysis

### **Usage Analytics**
- Most used scripts
- Peak usage times
- User behavior patterns
- Integration usage statistics

### **Business Intelligence**
- App potential scoring
- Revenue opportunity analysis
- Development priority recommendations
- Market trend analysis

## 🔄 **Integration Points**

### **Session Manager**
- Script execution context preservation
- Session state management during script runs
- Context restoration after script completion

### **Governance Orchestrator**
- Policy enforcement during script execution
- Compliance monitoring and reporting
- Governance rule application

### **Custodian Protocol**
- Safe maintenance coordination
- Script result integration
- Maintenance workflow management

### **CI/CD Pipeline**
- Automated script execution
- Build and deployment integration
- Quality gate enforcement

## 🛠️ **Development Guidelines**

### **Creating New Scripts**
1. **Register in Catalog**: Add script to `scripts/script_catalog.json`
2. **Implement Safety**: Include appropriate safety checks and rollback
3. **Add Documentation**: Document purpose, usage, and dependencies
4. **Test Thoroughly**: Test in safe environment before production
5. **Update Integration**: Update related systems and dashboards

### **Script Best Practices**
1. **Error Handling**: Implement comprehensive error handling
2. **Logging**: Add detailed logging for debugging and monitoring
3. **Validation**: Validate inputs and check prerequisites
4. **Modularity**: Design scripts for reusability and maintainability
5. **Documentation**: Include clear documentation and usage examples

### **Testing Requirements**
1. **Unit Testing**: Test individual script functions
2. **Integration Testing**: Test script interactions with other systems
3. **Safety Testing**: Test safety mechanisms and rollback procedures
4. **Performance Testing**: Test execution time and resource usage
5. **User Acceptance Testing**: Test with end users and stakeholders

## 📋 **Current Script Inventory**

### **Governance Scripts**
- **Migrations Manager**: System migration management with safety checks
- **Precommit Audit**: Comprehensive precommit validation
- **Custodian Protocol**: Safe maintenance and monitoring

### **Migration Scripts**
- **Migration Mess Analysis**: Analyzes migration issues
- **Cleanup Migration Executor**: Executes cleanup with validation

### **Cleanup Scripts**
- **Symlink Cleanup**: Removes symlinks and consolidates structure

### **Maintenance Scripts**
- **Audit and Optimize**: Comprehensive system audit and optimization

### **Protocol Scripts**
- **Launch Protocol**: System launch and initialization
- **End of Chat Protocol**: Session cleanup and context preservation
- **Pre-wrap Audit Protocol**: Pre-session wrap audit and validation
- **Session Communication Extractor**: Extracts session communication data

## 🎯 **Future Enhancements**

### **Planned Features**
1. **Advanced Analytics**: Machine learning-powered insights
2. **Automated Optimization**: AI-driven script optimization
3. **Enhanced Security**: Advanced security scanning and validation
4. **Mobile Interface**: Mobile app for script management
5. **API Ecosystem**: Comprehensive API for external integrations

### **App Development Opportunities**
1. **Dashboard Application**: High-value real-time monitoring dashboard
2. **CI/CD Integration App**: Automated pipeline management
3. **Code Quality Monitor**: Advanced quality tracking and reporting
4. **Security Compliance App**: Security policy enforcement and monitoring

## 📚 **References**

- [Script Catalog](./scripts/script_catalog.json)
- [SystemMaster Component](./src/components/SystemMaster/SystemMaster.tsx)
- [ScriptMaster Component](./src/components/SystemMaster/ScriptMaster.tsx)
- [Types Definition](./src/components/SystemMaster/types.ts)
- [Migration Mess Resolution](./MIGRATION_MESS_RESOLUTION_SUMMARY.md)
- [Living Roadmap](./LIVING_ROADMAP.md)

---

**Last Updated**: 2025-01-07  
**Version**: 1.0.0  
**Status**: Active 
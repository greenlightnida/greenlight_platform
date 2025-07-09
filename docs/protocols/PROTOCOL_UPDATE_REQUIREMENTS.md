# Protocol Update Requirements System

## 🎯 **Overview**

The Protocol Update Requirements System ensures that protocols remain current and accurate between work sessions. This system addresses the challenge of maintaining protocol accuracy as the system evolves, without requiring full session context.

## 🏗️ **System Architecture**

### **Core Components**

1. **Pre-commit Audit Integration**: Protocol update requirements are checked during pre-commit audits
2. **Protocol Update Script**: Automated script for updating protocols between sessions
3. **System State Analysis**: Continuous monitoring of system changes
4. **Test Generation**: Automatic test creation for protocol validation
5. **Documentation Sync**: Synchronization of protocol documentation

### **File Structure**
```
scripts/
├── governance/
│   └── precommit_audit.cjs          # Includes protocol update checks
├── protocols/
│   ├── update_protocols.cjs         # Main update script
│   ├── launch_protocol.cjs          # Updated automatically
│   ├── end_of_chat_protocol.js      # Updated automatically
│   └── pre_wrap_audit_protocol.cjs  # Updated automatically
data/
└── protocols/
    ├── system-state.json            # Current system state
    ├── protocol-update-*.json       # Update reports
    └── protocol-update-*-error.json # Error logs
```

## 🚀 **Usage**

### **Automatic Protocol Updates**
```bash
# Update all protocols
npm run protocol:update

# Update specific protocol
npm run protocol:update:launch
npm run protocol:update:audit
npm run protocol:update:custodian
```

### **Manual Protocol Updates**
```bash
# Update all protocols
node scripts/protocols/update_protocols.cjs

# Update specific protocol
node scripts/protocols/update_protocols.cjs --protocol=launch
node scripts/protocols/update_protocols.cjs --protocol=audit
node scripts/protocols/update_protocols.cjs --protocol=custodian
```

### **Pre-commit Integration**
```bash
# Run pre-commit audit (includes protocol checks)
npm run precommit
```

## 📋 **Protocol Update Process**

### **Phase 1: System State Analysis**
- Analyzes current directory structure
- Inventories protocol files
- Checks Git status for changes
- Validates dependencies
- Saves system state for reference

### **Phase 2: Protocol Updates**
- **Launch Protocol**: Updates context awareness tests and file paths
- **Audit Protocol**: Adds protocol update checks and integration points
- **Custodian Protocol**: Adds protocol update tasks to maintenance list

### **Phase 3: Test Updates**
- Generates `test-launch-protocol.cjs` for launch protocol validation
- Generates `test-protocol-integration.cjs` for integration testing
- Ensures protocols can be validated independently

### **Phase 4: Documentation Sync**
- Updates `greenlight-wiki/PROTOCOLS.md` with current status
- Synchronizes protocol registry
- Updates integration status and dependencies

### **Phase 5: Report Generation**
- Creates detailed update report in `data/protocols/`
- Logs all changes made
- Records any errors encountered
- Provides summary for review

## 🔍 **Pre-commit Audit Integration**

### **Protocol Update Checks**
The pre-commit audit now includes comprehensive protocol update requirements:

1. **Protocol File Existence**: Verifies all required protocol files exist
2. **Recent Modifications**: Checks if protocols have been updated recently (within 7 days)
3. **TypeScript Integration**: Validates ProtocolManager has real script execution
4. **Protocol Validation**: Ensures protocol validation methods exist
5. **Script Catalog**: Verifies protocol catalog has required protocols
6. **Documentation**: Checks for protocol documentation
7. **Test Coverage**: Validates protocol test files exist
8. **Recent Changes**: Detects protocol-related changes in Git

### **Example Audit Output**
```
✅ Protocol Update Requirements...
  • scripts/protocols/launch_protocol.cjs exists
  • scripts/protocols/end_of_chat_protocol.js exists
  • scripts/protocols/pre_wrap_audit_protocol.cjs exists
  • scripts/governance/custodian_protocol.cjs exists
  • ProtocolManager has real script execution
  • Protocol validation exists
  • Protocol catalog has 6 protocols
  • Protocol documentation exists: greenlight-wiki/PROTOCOLS.md
  • Protocol test exists: test-launch-protocol.cjs
  • Protocol-related changes detected: 2 files
```

## 📊 **Monitoring and Reporting**

### **Update Reports**
Each protocol update generates a detailed report:

```json
{
  "updateId": "protocol-update-1751988515273",
  "timestamp": "2025-07-08T15:28:35.332Z",
  "changes": [
    "System state analyzed and saved",
    "audit protocol updated",
    "custodian protocol updated",
    "Test created: test-launch-protocol.cjs",
    "Test created: test-protocol-integration.cjs",
    "Documentation updated: greenlight-wiki/PROTOCOLS.md"
  ],
  "errors": [],
  "summary": {
    "totalChanges": 6,
    "totalErrors": 0,
    "success": true
  }
}
```

### **System State Tracking**
The system maintains a current state snapshot:

```json
{
  "timestamp": "2025-07-08T15:28:35.332Z",
  "directories": {
    "src": ["components", "core", "services"],
    "scripts": ["protocols", "governance", "maintenance"]
  },
  "files": {
    "protocols": [
      "scripts/protocols/launch_protocol.cjs",
      "scripts/protocols/end_of_chat_protocol.js"
    ]
  },
  "gitStatus": {
    "hasChanges": true,
    "modifiedFiles": 2,
    "details": ["test-launch-protocol.cjs", "test-protocol-integration.cjs"]
  }
}
```

## 🛡️ **Safety and Validation**

### **Safety Features**
- **Read-only by default**: Protocols are analyzed before modification
- **Backup creation**: Original protocols are preserved
- **Error logging**: All errors are logged with context
- **Dry-run capability**: Can preview changes without applying them
- **Validation checks**: Protocols are validated after updates

### **Validation Process**
1. **Pre-update validation**: Checks system state before updates
2. **Update validation**: Validates each protocol update
3. **Post-update validation**: Tests updated protocols
4. **Integration validation**: Ensures protocols work with platform

## 🔄 **Integration Points**

### **With Pre-commit Audit**
- Protocol update requirements are checked during pre-commit
- Failed protocol checks block commits
- Protocol status is reported in audit summary

### **With Custodian Protocol**
- Protocol updates are added to maintenance tasks
- Custodian can trigger protocol updates
- Update results are logged in custodian reports

### **With ScriptMaster**
- Protocol update script is catalogued
- Update status is tracked in ScriptMaster
- Integration points are documented

## 📈 **Benefits**

### **For Development**
- **Reduced Context Loss**: Protocols stay current between sessions
- **Automated Maintenance**: No manual protocol updates required
- **Consistent Quality**: Protocols are validated automatically
- **Better Testing**: Automatic test generation for protocols

### **For System Health**
- **Current Protocols**: Protocols reflect actual system state
- **Validated Integration**: Protocol integration is continuously tested
- **Documentation Sync**: Documentation stays current with protocols
- **Error Prevention**: Protocol errors are caught early

### **For Team Collaboration**
- **Shared Understanding**: All team members see current protocol status
- **Automated Compliance**: Protocol requirements are enforced automatically
- **Clear Reporting**: Protocol status is clearly reported
- **Easy Updates**: Simple commands for protocol maintenance

## 🚀 **Future Enhancements**

### **Planned Features**
- **Automated Scheduling**: Regular protocol updates via cron
- **Change Detection**: Automatic updates when system changes detected
- **Version Control**: Protocol versioning and rollback capabilities
- **Advanced Testing**: More comprehensive protocol validation
- **Dashboard Integration**: Protocol status in system dashboard

### **Integration Opportunities**
- **CI/CD Pipeline**: Protocol updates in build process
- **Monitoring Systems**: Protocol health monitoring
- **Alert Systems**: Protocol update notifications
- **Analytics**: Protocol usage and effectiveness tracking

---

## 📝 **Usage Examples**

### **Between Sessions**
```bash
# Quick protocol update before starting new session
npm run protocol:update

# Check protocol status
npm run precommit
```

### **After System Changes**
```bash
# Update specific protocol after changes
npm run protocol:update:launch

# Verify all protocols are current
npm run precommit
```

### **Regular Maintenance**
```bash
# Weekly protocol maintenance
npm run protocol:update
npm run precommit
```

This system ensures that protocols remain accurate and effective between work sessions, reducing context loss and maintaining system quality. 
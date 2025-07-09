# Big Picture Command

## Overview

The Big Picture command provides a comprehensive overview of the Greenlight Platform system, including holons, managers, modules, and administrative units. It supports system ontology understanding and requirements improvement by showing the current state and identifying gaps or areas for enhancement.

## Usage

```bash
npm run big-picture
```

## Features

### 1. Holon Inventory
- **Platform Holons**: articulate, elaborate, knowledge, system-master, work
- **Component Holons**: SystemMaster, CoachingToolkit, Elevate, Administrate
- **Status Tracking**: active, incomplete, or missing
- **Component Count**: Number of TypeScript/React components
- **Manager Count**: Number of manager files
- **Module Count**: Number of subdirectories

### 2. Manager Analysis
- **Purpose Extraction**: Automatically extracts PURPOSE comments from manager files
- **Dependency Tracking**: Identifies required Node.js modules
- **File Size Monitoring**: Tracks file sizes for maintenance
- **Last Modified Tracking**: Shows when managers were last updated

### 3. Module Inventory
- **Core Modules**: core, services, utils, hooks, types, config
- **File Structure**: Lists all files in each module
- **Submodule Tracking**: Identifies nested module directories
- **Export Analysis**: Extracts exported functions/classes from index files

### 4. Administrative Units
- **Governance**: System governance, policies, and compliance
- **Protocols**: System protocols and procedures
- **Config**: Configuration management and environment setup
- **Docs**: Documentation and knowledge management
- **Scripts**: Automation and utility scripts
- **Data**: Data storage and session management

### 5. Protocol System
- **Version Tracking**: Extracts protocol versions from file headers
- **Status Assessment**: active, needs_attention, or deprecated
- **Purpose Documentation**: Extracts PURPOSE comments
- **Last Modified Tracking**: Shows when protocols were last updated

### 6. System Health Assessment
- **Build Status**: Checks if the system builds successfully
- **Git Status**: Monitors uncommitted changes
- **File Structure Integrity**: Validates required directories exist

### 7. Gap Analysis
- **Missing Holons**: Identifies expected holons that don't exist
- **Incomplete Holons**: Finds holons missing main components
- **Missing Managers**: Identifies expected managers that don't exist
- **Missing Protocols**: Finds expected protocols that don't exist
- **Build Issues**: Flags build failures requiring attention

### 8. Recommendations
- **Gap Resolution**: Prioritizes addressing identified gaps
- **Holon Completion**: Suggests completing incomplete holons
- **System Stability**: Recommends fixing build issues
- **Testing**: Suggests comprehensive testing implementation
- **Monitoring**: Recommends health monitoring and alerting
- **Documentation**: Suggests creating documentation for admin units

## Output

### Console Display
The command provides a formatted console output showing:
- ✅/⚠️/❌ status indicators for each component
- Summary statistics for each category
- Identified gaps and recommendations
- System health status

### JSON Report
A detailed JSON report is exported to `data/reports/big-picture-{sessionId}.json` containing:
- Complete metadata about the analysis session
- Detailed information about all holons, managers, modules, and protocols
- System health metrics
- Gap analysis results
- Specific recommendations

## System Ontology Support

The Big Picture command supports system ontology understanding by:

1. **Holon Mapping**: Clearly identifies all holons and their relationships
2. **Manager Tracking**: Shows which managers govern which parts of the system
3. **Module Dependencies**: Reveals how modules interact and depend on each other
4. **Administrative Structure**: Documents the governance and administrative hierarchy
5. **Protocol Coverage**: Shows which protocols are active and which need attention

## Requirements Improvement

The command helps improve requirements by:

1. **Gap Identification**: Clearly shows what's missing or incomplete
2. **Health Monitoring**: Identifies system issues that need immediate attention
3. **Progress Tracking**: Shows development progress across all system components
4. **Dependency Analysis**: Reveals potential bottlenecks and integration points
5. **Documentation Gaps**: Identifies areas needing better documentation

## Integration with Other Commands

The Big Picture command works alongside other system commands:

- **Launch Protocol**: Provides context for new sessions
- **Boundary Enforcement**: Shows governance structure
- **Audit Protocols**: Identifies areas needing audit attention
- **Anchor Manager**: Provides system-wide context for spot checks

## Future Enhancements

Potential improvements for the Big Picture command:

1. **Dependency Graph**: Visual representation of system dependencies
2. **Performance Metrics**: System performance indicators
3. **Security Assessment**: Security posture evaluation
4. **Compliance Checking**: Regulatory and policy compliance status
5. **Trend Analysis**: Historical progress tracking
6. **Integration Status**: External system integration health
7. **User Access Mapping**: User permissions and access patterns
8. **Data Flow Analysis**: How data moves through the system

## Example Output

```
🔍 Big Picture Analysis v1.0.0
================================
Session ID: big-picture-1752071222082-8d8i23lmb
Timestamp: 2025-07-09T14:27:02.080Z

🏗️ HOLONS:
==========
✅ articulate (platforms)
   Path: src/platforms/articulate
   Components: 1
   Managers: 0
   Modules: 2

⚠️ knowledge (platforms)
   Path: src/platforms/knowledge
   Components: 0
   Managers: 0
   Modules: 1

👥 MANAGERS:
============
✅ anchor_manager
   Purpose: Provides system-wide anchor command functionality for spot checks
   Dependencies: 3

🔍 IDENTIFIED GAPS:
==================
⚠️  Incomplete holon: knowledge - missing main component
⚠️  Build system failing - requires immediate attention

💡 RECOMMENDATIONS:
==================
💡 Address identified gaps before proceeding with new features
💡 Complete development of holons: knowledge, work, SystemMaster
💡 Fix build issues to ensure system stability
```

## Conclusion

The Big Picture command is a powerful tool for understanding the current state of the Greenlight Platform system. It provides the foundation for informed decision-making about system development, maintenance, and improvement priorities. By regularly running this command, teams can maintain a clear understanding of system health and identify areas needing attention before they become critical issues. 
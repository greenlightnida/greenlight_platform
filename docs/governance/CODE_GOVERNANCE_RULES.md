# Code Governance Rules

## Core Principles

### 1. **Precedent-First Development**
**RULE: No new code or services without checking existing precedent first**

**Requirements:**
- Search for existing implementations before creating new code
- Check for similar functionality in:
  - `scripts/` directory (protocols, utilities, managers)
  - `src/` directory (components, services, utilities)
  - `data/` directory (existing data structures and patterns)
  - `docs/` directory (documentation of existing patterns)
  - `archive/` directory (previous implementations)
  - `backup/` directory (historical versions)

**Process:**
1. **Search Phase**: Use semantic search and grep to find existing implementations
2. **Analysis Phase**: Evaluate existing code for reusability or extension
3. **Decision Phase**: Choose between:
   - Reuse existing code
   - Extend existing code
   - Refactor existing code
   - Create new code (only if no suitable precedent exists)
4. **Documentation Phase**: Document why existing code wasn't suitable

**Tools Required:**
- `codebase_search` for semantic discovery
- `grep_search` for exact pattern matching
- `file_search` for fuzzy file discovery
- `list_dir` for directory exploration

### 2. **Atomic Operations**
- All changes must be atomic and single-purpose
- Each operation should have clear start, progress, and completion states
- Log all operations to command center

### 3. **Command Center Integration**
- All project-wide commands must be executed from command center
- Use `npm run anchor` for session management
- Log all command executions with timestamps and results

### 4. **Error Handling**
- Automatic repair of lint, type, and syntax errors
- No confirmation required for code quality fixes
- Log all repairs to command center

### 5. **Documentation Standards**
- Organize around professional milestones
- Document major operations and their outcomes
- Maintain living documentation that reflects current state

### 6. **Code Organization**
- Client spaces should contain their own assets
- Maintain organic connections to primary system
- Follow established directory structure patterns

### 7. **Session Management**
- Use anchor for session context restoration
- Use launch for session initialization
- Use wrap for session completion
- Preserve context between sessions

### 8. **Performance Standards**
- Avoid blocking operations (execSync)
- Use CommandExecutionOptimizer for non-blocking execution
- Include timeouts and progress indicators
- Follow single-responsibility design

### 9. **Quality Assurance**
- Run comprehensive audits before major changes
- Use parallel-audit for system health assessment
- Maintain standards compliance through StandardsManager
- Regular health monitoring and reporting

### 10. **Integration Patterns**
- All systems must integrate through established interfaces
- Use command center for cross-system coordination
- Maintain clear separation of concerns
- Document integration points and dependencies

## Enforcement

**Precedent Check Required For:**
- New script files
- New protocol implementations
- New service classes
- New utility functions
- New data structures
- New configuration files

**Documentation Required:**
- Why existing code wasn't suitable
- What alternatives were considered
- How new code integrates with existing patterns
- Migration plan for any deprecated functionality

**Review Process:**
- All new code must pass precedent check
- Command center must log all creation decisions
- Audit system must validate integration points
- Standards manager must approve new patterns

## Compliance Monitoring

The command center will automatically:
- Track code creation patterns
- Flag potential duplicate implementations
- Suggest existing alternatives
- Maintain precedent database
- Generate compliance reports

**Non-Compliance Consequences:**
- Code creation blocked until precedent check completed
- Automatic rollback of non-compliant changes
- Required documentation of precedent analysis
- Integration testing to ensure compatibility 
# Protocol Registry

## Active Protocols

| Protocol | Status | Dependencies | Last Run | Next Run | Owner |
|----------|--------|--------------|----------|----------|-------|
| Launch Protocol | ✅ Active | None | 2025-07-09T13:07:09.777Z | On-demand | nida@greenlight.live |
| Custodian Protocol | ✅ Active | ScriptMaster | 2025-07-09T13:07:09.777Z | Daily | nida@greenlight.live |
| End-of-Chat Protocol | ✅ Active | SessionManager | 2025-07-09T13:07:09.777Z | Per session | nida@greenlight.live |
| Pre-wrap Audit Protocol | ✅ Active | CustodianProtocol | 2025-07-09T13:07:09.777Z | Per session | nida@greenlight.live |
| Protocol Update Script | ✅ Active | None | 2025-07-09T13:07:09.777Z | Between sessions | nida@greenlight.live |

## Protocol Dependencies
- Launch Protocol → None
- Custodian Protocol → ScriptMaster, SystemMaster
- End-of-Chat Protocol → SessionManager, DocumentationManager
- Pre-wrap Audit Protocol → CustodianProtocol, SessionManager
- Protocol Update Script → None

## Integration Status
- **Total Protocols**: 5
- **Active Protocols**: 5 (100%)
- **Integration**: 80% (target: 100%)

## Update Requirements
- Protocols are updated between sessions to reflect current system state
- Tests are run to validate protocol functionality
- Documentation is synchronized with protocol changes
- System state is analyzed and logged for protocol updates

## Next Actions
1. **Complete protocol integration**
2. **Establish execution logging**
3. **Set up dependency tracking**
4. **Implement status monitoring**
5. **Automate protocol updates**

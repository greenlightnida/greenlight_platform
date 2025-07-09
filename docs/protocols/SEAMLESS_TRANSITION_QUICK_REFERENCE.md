# Seamless Transition Protocols - Quick Reference

## 🚀 Quick Commands

### End Session (Wrap)
```bash
npm run wrap-annihilate
```

### Start Session (Launch)
```bash
npm run anchor launch-annihilate
```

## 📋 What Gets Preserved

### System State
- Git branch and commit
- Package versions
- Environment info
- Memory and CPU usage

### Execution Context
- Active plans and phases
- Completed steps
- Pending tasks
- Errors and warnings
- Last action performed

### Holon States
- Holon status and health
- Performance metrics
- Error states
- File structure validation

## 🔄 Workflow

### Session End
1. Run: `npm run wrap-annihilate`
2. System captures everything
3. Files saved to `data/` directories
4. Handoff instructions generated

### Session Start
1. Run: `npm run anchor launch-annihilate`
2. System restores context
3. Plan execution resumes
4. Full context provided to AI

## 📁 Generated Files

```
data/
├── transitions/
│   ├── {session-id}-transition.json          # Complete data
│   └── {session-id}-handoff-instructions.json # Next steps
├── system-state/
│   └── {session-id}-system-state.json        # System snapshot
└── context-preservation/
    └── {session-id}-context.json             # Execution context
```

## 🎯 Use Cases

### ✅ Perfect For
- Plan continuation across sessions
- Error recovery with context
- Performance testing handoffs
- Task switching
- System maintenance preparation

### ❌ Not For
- Simple one-off commands
- Quick file edits
- Temporary debugging
- When no context needed

## 🚨 Troubleshooting

### Wrap Fails
```bash
# Check permissions
ls -la data/transitions/

# Check space
df -h

# Verbose mode
DEBUG=* npm run wrap-annihilate
```

### Launch Fails
```bash
# Check files exist
ls -la data/transitions/*.json

# Manual restore
npm run anchor launch-annihilate --session-id=SESSION_ID

# Fallback
npm run anchor launch
```

### Context Not Restored
```bash
# Find session ID
cat data/transitions/*-handoff-instructions.json

# Manual context
node scripts/protocols/launch_annihilate_protocol.cjs --session-id=SESSION_ID
```

## 📊 System Health States

- **active_plan**: Has active plan, continue execution
- **needs_attention**: Has errors, address before continuing
- **ready**: Clean state, ready for new work

## 💡 Best Practices

1. **Always wrap** before ending session with active work
2. **Always launch** when starting to continue work
3. **Check system health** in transition summary
4. **Follow recommendations** provided by protocols
5. **Use session IDs** for manual operations

## 🔧 Advanced Usage

### Custom Session ID
```bash
npm run wrap-annihilate --session-id=custom-id
npm run anchor launch-annihilate --session-id=custom-id
```

### Verbose Logging
```bash
DEBUG=* npm run wrap-annihilate
DEBUG=* npm run anchor launch-annihilate
```

### Force Fallback
```bash
npm run anchor launch-annihilate --fallback
```

## 📞 Support

- **Documentation**: `docs/protocols/SEAMLESS_TRANSITION_PROTOCOLS.md`
- **Protocol Files**: `scripts/protocols/wrap_annihilate_protocol.cjs`
- **Launch Files**: `scripts/protocols/launch_annihilate_protocol.cjs`
- **Logs**: Check console output and `data/` directories

---

**Remember**: These protocols enable truly seamless development across chat sessions. Use them whenever you need to preserve and restore context! 
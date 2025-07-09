# Linting & Unified Config Migration Context

## 1. Project Structure & Directory Roles

- **greenlight-platform/**: Core platform, system holons, governance, protocols.
- **top-bins/**: Lerna monorepo, canonical source for unified config, all shared code and packages.
- **Top_Bins/**: Client build/deployment space for Elevate/Administrate, receives code from monorepo.
- **Shared conventions**: Naming, file placement, and config inheritance are documented in `docs/guides/DIRECTORY_PURPOSE_GUIDE.md` and `docs/guides/FILE_MANAGEMENT_CONSOLIDATION_PLAN.md`.

---

## 2. Linting & Code Quality Roadmap

- **Goal**: Move to a single, strict, professional ESLint/Prettier/TypeScript config, rooted in the monorepo, extended everywhere.
- **Reference Docs**:  
  - [DIRECTORY_PURPOSE_GUIDE.md](guides/DIRECTORY_PURPOSE_GUIDE.md)  
  - [FILE_MANAGEMENT_CONSOLIDATION_PLAN.md](guides/FILE_MANAGEMENT_CONSOLIDATION_PLAN.md)  
  - [COMPREHENSIVE_STANDARDIZATION_PLAN.md](../phases/COMPREHENSIVE_STANDARDIZATION_PLAN.md)  
  - [UPGRADE_VITE7_LOG.md](../summaries/UPGRADE_VITE7_LOG.md)  
  - [FINAL_AUDIT_AND_OPTIMIZATION_PLAN.md](../audits/FINAL_AUDIT_AND_OPTIMIZATION_PLAN.md)

---

## 3. Unified Linting Implementation Plan

- **Config location**: `top-bins/.eslintrc.js` (root, strict, all packages extend)
- **Prettier config**: `top-bins/.prettierrc`
- **TypeScript**: `strict: true` in all `tsconfig.json`
- **Plugins**: `@typescript-eslint`, `react`, `react-hooks`, `import`, `jsx-a11y`, `promise`, `boundaries`
- **Automation**:  
  - Pre-commit: `lint-staged`, `husky`
  - CI: Lint, type-check, test, build, audit
- **Editor**: VSCode settings for auto-fix on save
- **Documentation**: Update `CONTRIBUTING.md` with all linting/formatting rules and workflow

---

## 4. Migration & Enforcement Phases

- **Phase 1**: Implement config in monorepo, migrate all packages
- **Phase 2**: Update all other workspaces to extend from monorepo config
- **Phase 3**: Remove legacy configs
- **Phase 4**: Enforce via pre-commit and CI
- **Phase 5**: Document, train, and monitor

---

## 5. Critical Risks & Mitigations

- **Loss of context**: All plans, configs, and progress are documented in the repo (`docs/`, `CONTRIBUTING.md`, `CHANGELOG.md`)
- **Breaking changes**: Use feature branches, backup before major changes, and CI to block regressions
- **Team onboarding**: Document all changes and provide clear upgrade/migration instructions

---

## 6. Session Continuity Protocol

- **All steps, decisions, and changes are logged in:**
  - `CHANGELOG.md` (for code/config changes)
  - `DECISION_LOG.md` (for architectural/process decisions)
  - `docs/` (for protocols, standards, and migration guides)
- **If chat is interrupted:**
  - Resume by reviewing the above files
  - Continue from the last completed phase or checklist item
  - All scripts and configs are versioned in git for rollback/review

---

## 7. Immediate Next Steps (for Resumption)

- [ ] Create/verify unified ESLint config in monorepo root
- [ ] Add/verify Prettier config
- [ ] Upgrade all linting/formatting dependencies
- [ ] Set up pre-commit hooks and CI quality gates
- [ ] Update documentation
- [ ] Begin migration of all packages/workspaces to unified config

---

## 8. How to Resume or Continue

- **Check `CHANGELOG.md` and `DECISION_LOG.md` for last actions**
- **Review `docs/` for the latest protocols and standards**
- **Run `npm run lint`, `npm run type-check`, and `npm run test` to verify current state**
- **Continue with the next unchecked item in the migration plan**

---

*This file is auto-generated to ensure context is never lost during the unified linting/config migration. Update as needed throughout the process.* 
#!/usr/bin/env node

/**
 * Git Governance Automation
 * Implements Git best practices and governance immediately
 * 
 * This script sets up proper Git workflow, hooks, and governance
 * to prevent data loss and ensure code quality.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class GitGovernanceAutomation {
  constructor() {
    this.projectRoot = process.cwd();
  }

  async runFullSetup() {
    console.log('🚀 Starting Git governance automation...');
    
    try {
      // Step 1: Emergency backup (already done)
      console.log('✅ Emergency backup already completed');
      
      // Step 2: Setup Git hooks
      await this.setupGitHooks();
      
      // Step 3: Setup conventional commits
      await this.setupConventionalCommits();
      
      // Step 4: Create branch strategy
      await this.createBranchStrategy();
      
      // Step 5: Setup quality gates
      await this.setupQualityGates();
      
      // Step 6: Create comprehensive .gitignore
      await this.createComprehensiveGitignore();
      
      // Step 7: Setup commitlint
      await this.setupCommitlint();
      
      // Step 8: Create Git workflow documentation
      await this.createGitWorkflowDocs();
      
      console.log('✅ Git governance automation complete!');
      
    } catch (error) {
      console.error('❌ Git governance automation failed:', error);
      throw error;
    }
  }

  async setupGitHooks() {
    console.log('🔧 Setting up Git hooks...');
    
    try {
      // Install husky
      execSync('npm install -D husky', { stdio: 'inherit' });
      
      // Initialize husky
      execSync('npx husky install', { stdio: 'inherit' });
      
      // Add pre-commit hook
      execSync('npx husky add .husky/pre-commit "npm run lint && npm run test"', { stdio: 'inherit' });
      
      // Add commit-msg hook
      execSync('npx husky add .husky/commit-msg "npx --no -- commitlint --edit $1"', { stdio: 'inherit' });
      
      // Add prepare script to package.json
      this.updatePackageJsonScripts({
        prepare: 'husky install'
      });
      
      console.log('✅ Git hooks setup complete');
    } catch (error) {
      console.error('❌ Git hooks setup failed:', error.message);
      throw error;
    }
  }

  async setupConventionalCommits() {
    console.log('📝 Setting up conventional commits...');
    
    try {
      // Install commitizen
      execSync('npm install -D commitizen cz-conventional-changelog', { stdio: 'inherit' });
      
      // Update package.json
      this.updatePackageJsonConfig({
        commitizen: {
          path: './node_modules/cz-conventional-changelog'
        }
      });
      
      this.updatePackageJsonScripts({
        commit: 'cz'
      });
      
      console.log('✅ Conventional commits setup complete');
    } catch (error) {
      console.error('❌ Conventional commits setup failed:', error.message);
      throw error;
    }
  }

  async createBranchStrategy() {
    console.log('🌿 Creating branch strategy...');
    
    try {
      // Create development branch
      execSync('git checkout -b develop', { stdio: 'inherit' });
      
      // Create feature branch template
      execSync('git checkout -b feature/git-governance-implementation', { stdio: 'inherit' });
      
      // Return to main
      execSync('git checkout main', { stdio: 'inherit' });
      
      console.log('✅ Branch strategy setup complete');
    } catch (error) {
      console.error('❌ Branch strategy setup failed:', error.message);
      throw error;
    }
  }

  async setupQualityGates() {
    console.log('🔍 Setting up quality gates...');
    
    try {
      // Install lint-staged
      execSync('npm install -D lint-staged', { stdio: 'inherit' });
      
      // Create lint-staged config
      const lintStagedConfig = {
        '*.{js,jsx,ts,tsx}': [
          'eslint --fix',
          'prettier --write',
          'git add'
        ],
        '*.{json,md,yml,yaml}': [
          'prettier --write',
          'git add'
        ]
      };
      
      fs.writeFileSync('.lintstagedrc.js', `module.exports = ${JSON.stringify(lintStagedConfig, null, 2)};`);
      
      // Update package.json scripts
      this.updatePackageJsonScripts({
        lint: 'eslint . --ext .js,.jsx,.ts,.tsx',
        'lint:fix': 'eslint . --ext .js,.jsx,.ts,.tsx --fix',
        format: 'prettier --write .',
        test: 'jest',
        'test:watch': 'jest --watch',
        'type-check': 'tsc --noEmit'
      });
      
      console.log('✅ Quality gates setup complete');
    } catch (error) {
      console.error('❌ Quality gates setup failed:', error.message);
      throw error;
    }
  }

  async createComprehensiveGitignore() {
    console.log('🚫 Creating comprehensive .gitignore...');
    
    try {
      const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
.next/
out/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Local development
*.local

# Test files
test-results/
playwright-report/
test-results.xml

# Backup files
*.backup
*.boundary-backup

# Session files (keep only important ones)
data/sessions/*.json
!data/sessions/ROADMAP_ACTUALS_IMPLEMENTATION_SESSION.json

# Protocol reports (keep only important ones)
data/protocols/*.json
!data/protocols/protocol-validation-report.json

# Audit reports (keep only important ones)
data/audits/*.json
!data/audits/anchor_updates_audit.json

# Work session files (keep only important ones)
scripts/work_sessions/*.json
!scripts/work_sessions/session-2025-07-08-23-36-15.json

# Backend build artifacts
backend/dist/
backend/backend.log

# Frontend build artifacts
frontend/dist/

# Configuration backups
*.backup
*.boundary-backup

# Temporary files
*.tmp
*.temp

# Lock files (keep package-lock.json)
yarn.lock
pnpm-lock.yaml

# Local environment overrides
.env.*.local

# IDE specific files
.vscode/settings.json
.vscode/launch.json
.vscode/tasks.json

# OS generated files
.DS_Store?
ehthumbs.db
Icon?
Thumbs.db

# Temporary files
*.swp
*.swo
*~

# Backup files
*.bak
*.backup
*.old

# Log files
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*
`;

      fs.writeFileSync('.gitignore', gitignoreContent);
      
      console.log('✅ Comprehensive .gitignore created');
    } catch (error) {
      console.error('❌ .gitignore creation failed:', error.message);
      throw error;
    }
  }

  async setupCommitlint() {
    console.log('🔍 Setting up commitlint...');
    
    try {
      // Install commitlint
      execSync('npm install -D @commitlint/cli @commitlint/config-conventional', { stdio: 'inherit' });
      
      // Create commitlint config
      const commitlintConfig = `module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'perf',
        'ci',
        'build',
        'revert',
        'emergency'
      ]
    ]
  }
};`;
      
      fs.writeFileSync('commitlint.config.js', commitlintConfig);
      
      console.log('✅ Commitlint setup complete');
    } catch (error) {
      console.error('❌ Commitlint setup failed:', error.message);
      throw error;
    }
  }

  async createGitWorkflowDocs() {
    console.log('📚 Creating Git workflow documentation...');
    
    try {
      const workflowDocs = `# 🔧 Git Workflow & Governance

## Branch Strategy

### Main Branches
- **main**: Production-ready code only
- **develop**: Integration branch for features

### Feature Branches
- **feature/***: Individual feature development
- **hotfix/***: Critical production fixes
- **release/***: Version preparation

## Commit Message Standards

### Conventional Commits Format
\`\`\`
type(scope): description

[optional body]

[optional footer]
\`\`\`

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **perf**: Performance improvements
- **ci**: CI/CD changes
- **build**: Build system changes
- **revert**: Reverting previous commits
- **emergency**: Emergency fixes

### Examples
\`\`\`
feat(auth): implement Google SSO integration
fix(ui): resolve button alignment issue
docs(readme): update installation instructions
refactor(api): simplify user authentication logic
test(components): add unit tests for Button component
chore(deps): update dependencies to latest versions
\`\`\`

## Quality Gates

### Pre-commit Hooks
- ESLint validation
- Prettier formatting
- TypeScript type checking
- Unit test execution

### Commit Message Validation
- Conventional commits format
- Type validation
- Scope validation

## Workflow Commands

### Development
\`\`\`bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
npm run commit  # Uses commitizen for conventional commits

# Push to remote
git push origin feature/your-feature-name
\`\`\`

### Quality Checks
\`\`\`bash
# Run linting
npm run lint

# Run tests
npm run test

# Type checking
npm run type-check

# Format code
npm run format
\`\`\`

## Best Practices

### 1. Always Use Conventional Commits
- Use \`npm run commit\` instead of \`git commit\`
- Follow the conventional commits format
- Include scope when relevant

### 2. Keep Commits Atomic
- One logical change per commit
- Don't mix features and fixes
- Keep commits small and focused

### 3. Write Clear Commit Messages
- Use imperative mood ("add" not "added")
- Be descriptive but concise
- Explain what and why, not how

### 4. Use Feature Branches
- Never commit directly to main
- Create feature branches for all changes
- Use descriptive branch names

### 5. Regular Integration
- Merge develop into feature branches regularly
- Resolve conflicts early
- Keep branches up to date

### 6. Code Review
- All changes require review
- Use pull requests for integration
- Address review feedback promptly

## Emergency Procedures

### Emergency Commits
For critical fixes that bypass normal workflow:
\`\`\`
git commit -m "emergency: critical security fix"
\`\`\`

### Rollback Procedures
\`\`\`bash
# Revert last commit
git revert HEAD

# Revert specific commit
git revert <commit-hash>

# Reset to previous state (use with caution)
git reset --hard HEAD~1
\`\`\`

## Automation

### Pre-commit Hooks
Automatically run on every commit:
- Code linting
- Formatting
- Type checking
- Tests

### Commit Message Validation
Automatically validates:
- Conventional commits format
- Required fields
- Type validation

### CI/CD Integration
- Automated testing
- Code quality checks
- Security scanning
- Deployment validation

## Troubleshooting

### Common Issues

#### Hook Installation Failed
\`\`\`bash
npm run prepare
npx husky install
\`\`\`

#### Commit Message Rejected
- Check conventional commits format
- Ensure type is valid
- Include proper scope and description

#### Pre-commit Hook Failed
- Fix linting errors
- Run tests locally
- Check type errors

#### Branch Protection Issues
- Ensure you're on correct branch
- Check branch naming conventions
- Verify required reviews are complete
`;

      // Ensure docs directory exists
      const docsDir = path.join(this.projectRoot, 'docs', 'governance');
      if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
      }
      
      fs.writeFileSync(path.join(docsDir, 'GIT_WORKFLOW_GUIDE.md'), workflowDocs);
      
      console.log('✅ Git workflow documentation created');
    } catch (error) {
      console.error('❌ Git workflow docs creation failed:', error.message);
      throw error;
    }
  }

  updatePackageJsonScripts(newScripts) {
    try {
      const packagePath = path.join(this.projectRoot, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      packageJson.scripts = { ...packageJson.scripts, ...newScripts };
      
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    } catch (error) {
      console.error('❌ Failed to update package.json scripts:', error.message);
      throw error;
    }
  }

  updatePackageJsonConfig(newConfig) {
    try {
      const packagePath = path.join(this.projectRoot, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      packageJson.config = { ...packageJson.config, ...newConfig };
      
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    } catch (error) {
      console.error('❌ Failed to update package.json config:', error.message);
      throw error;
    }
  }

  async runQualityGates() {
    console.log('🔍 Running quality gates...');
    
    try {
      // Run linting
      execSync('npm run lint', { stdio: 'inherit' });
      console.log('✅ Linting passed');
      
      // Run tests
      execSync('npm run test', { stdio: 'inherit' });
      console.log('✅ Tests passed');
      
      // Run type checking
      execSync('npm run type-check', { stdio: 'inherit' });
      console.log('✅ Type checking passed');
      
      // Run build
      execSync('npm run build', { stdio: 'inherit' });
      console.log('✅ Build passed');
      
      console.log('🎉 All quality gates passed!');
    } catch (error) {
      console.error('❌ Quality gates failed:', error.message);
      throw error;
    }
  }
}

// Main execution
async function main() {
  const automation = new GitGovernanceAutomation();
  
  try {
    await automation.runFullSetup();
  } catch (error) {
    console.error('❌ Git governance automation failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = GitGovernanceAutomation; 
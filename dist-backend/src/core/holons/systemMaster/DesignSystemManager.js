#!/usr/bin/env tsx
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignSystemManager = void 0;
const events_1 = require("events");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class DesignSystemManager extends events_1.EventEmitter {
    constructor() {
        super();
        this.configPath = path_1.default.resolve(process.cwd(), 'config', 'design-system');
        this.state = this.initializeState();
        this.initializeDesignSystemManager();
    }
    static getInstance() {
        if (!DesignSystemManager.instance) {
            DesignSystemManager.instance = new DesignSystemManager();
        }
        return DesignSystemManager.instance;
    }
    initializeState() {
        return {
            index: {
                systems: new Map(),
                components: new Map(),
                tokens: new Map(),
                categories: new Map(),
                platforms: new Map(),
                holons: new Map()
            },
            governance: {
                standards: {
                    naming: {
                        components: 'PascalCase',
                        tokens: 'kebab-case',
                        files: 'kebab-case',
                        folders: 'kebab-case'
                    },
                    structure: {
                        organization: 'atomic',
                        nesting: true,
                        flat: false,
                        modular: true
                    },
                    documentation: {
                        required: true,
                        format: 'storybook',
                        examples: true,
                        props: true,
                        accessibility: true
                    },
                    testing: {
                        unit: true,
                        integration: true,
                        visual: true,
                        accessibility: true,
                        coverage: 90
                    }
                },
                policies: {
                    versioning: {
                        strategy: 'semantic',
                        major: ['breaking changes'],
                        minor: ['new features'],
                        patch: ['bug fixes']
                    },
                    deprecation: {
                        notice: 30,
                        grace: 60,
                        removal: 90
                    },
                    breaking: {
                        approval: true,
                        notification: true,
                        migration: true
                    },
                    migration: {
                        automated: true,
                        manual: true,
                        documentation: true,
                        support: true
                    }
                },
                compliance: {
                    accessibility: {
                        wcag: 'AA',
                        required: true,
                        testing: true,
                        documentation: true
                    },
                    performance: {
                        bundleSize: 50,
                        renderTime: 100,
                        memoryUsage: 10,
                        required: true
                    },
                    security: {
                        sanitization: true,
                        validation: true,
                        xss: true,
                        required: true
                    },
                    branding: {
                        colors: true,
                        typography: true,
                        spacing: true,
                        required: true
                    }
                },
                quality: {
                    metrics: {
                        coverage: 90,
                        documentation: 95,
                        accessibility: 100,
                        performance: 95,
                        consistency: 90
                    },
                    reviews: {
                        required: true,
                        frequency: 'per-component',
                        approvers: ['design-lead', 'tech-lead'],
                        checklist: [
                            'Design review completed',
                            'Accessibility audit passed',
                            'Performance benchmarks met',
                            'Documentation updated',
                            'Tests written and passing'
                        ]
                    },
                    automation: {
                        linting: true,
                        testing: true,
                        visual: true,
                        accessibility: true
                    }
                }
            },
            registry: new Map(),
            components: new Map(),
            tokens: new Map(),
            monitoring: {
                health: {
                    overall: 'healthy',
                    systems: {},
                    components: {},
                    documentation: {},
                    tests: {}
                },
                usage: {
                    components: {},
                    systems: {},
                    platforms: {},
                    trends: []
                },
                performance: {
                    bundleSize: 0,
                    renderTime: 0,
                    memoryUsage: 0,
                    loadTime: 0
                },
                alerts: []
            }
        };
    }
    async initializeDesignSystemManager() {
        try {
            if (!fs_1.default.existsSync(this.configPath)) {
                fs_1.default.mkdirSync(this.configPath, { recursive: true });
            }
            await this.initializeDefaultDesignSystems();
            await this.saveConfiguration();
            await this.startMonitoring();
            console.log('✅ DesignSystemManager initialized successfully');
            this.emit('initialized');
        }
        catch (error) {
            console.error('❌ Failed to initialize DesignSystemManager:', error);
            throw error;
        }
    }
    async initializeDefaultDesignSystems() {
        const greenlightDesignSystem = {
            id: 'greenlight-platform',
            name: 'Greenlight Platform Design System',
            version: '1.0.0',
            platform: 'greenlight-platform',
            holon: 'systemMaster',
            status: 'active',
            description: 'Core design system for Greenlight Platform',
            maintainer: 'system-master',
            lastUpdated: new Date(),
            components: [],
            tokens: this.getDefaultTokens(),
            documentation: {
                storybook: {
                    url: 'https://storybook.greenlight-platform.com',
                    version: '1.0.0',
                    stories: []
                },
                examples: {
                    playground: true,
                    codeExamples: true,
                    interactive: true
                },
                guidelines: {
                    usage: true,
                    accessibility: true,
                    bestPractices: true,
                    doAndDont: true
                },
                changelog: {
                    versioning: true,
                    migration: true,
                    breaking: true
                }
            },
            dependencies: [],
            metadata: {
                repository: 'greenlight-platform',
                maintainers: ['system-master'],
                contributors: []
            }
        };
        const topBinsDesignSystem = {
            id: 'top-bins',
            name: 'Top_Bins Design System',
            version: '1.0.0',
            platform: 'top-bins',
            holon: 'elevate',
            status: 'active',
            description: 'Design system for Top_Bins coaching platform',
            maintainer: 'elevate-manager',
            lastUpdated: new Date(),
            components: [],
            tokens: this.getDefaultTokens(),
            documentation: {
                storybook: {
                    url: 'https://storybook.top-bins.com',
                    version: '1.0.0',
                    stories: []
                },
                examples: {
                    playground: true,
                    codeExamples: true,
                    interactive: true
                },
                guidelines: {
                    usage: true,
                    accessibility: true,
                    bestPractices: true,
                    doAndDont: true
                },
                changelog: {
                    versioning: true,
                    migration: true,
                    breaking: true
                }
            },
            dependencies: ['greenlight-platform'],
            metadata: {
                repository: 'top-bins',
                maintainers: ['elevate-manager'],
                contributors: []
            }
        };
        await this.registerDesignSystem(greenlightDesignSystem);
        await this.registerDesignSystem(topBinsDesignSystem);
    }
    getDefaultTokens() {
        return {
            colors: {
                primary: {
                    '50': '#eff6ff',
                    '100': '#dbeafe',
                    '500': '#3b82f6',
                    '600': '#2563eb',
                    '700': '#1d4ed8',
                    '900': '#1e3a8a'
                },
                secondary: {
                    '50': '#faf5ff',
                    '100': '#f3e8ff',
                    '500': '#8b5cf6',
                    '600': '#7c3aed',
                    '700': '#6d28d9',
                    '900': '#581c87'
                },
                neutral: {
                    '50': '#f9fafb',
                    '100': '#f3f4f6',
                    '200': '#e5e7eb',
                    '300': '#d1d5db',
                    '400': '#9ca3af',
                    '500': '#6b7280',
                    '600': '#4b5563',
                    '700': '#374151',
                    '800': '#1f2937',
                    '900': '#111827'
                },
                success: {
                    '50': '#ecfdf5',
                    '100': '#d1fae5',
                    '500': '#10b981',
                    '600': '#059669',
                    '700': '#047857',
                    '900': '#064e3b'
                },
                warning: {
                    '50': '#fffbeb',
                    '100': '#fef3c7',
                    '500': '#f59e0b',
                    '600': '#d97706',
                    '700': '#b45309',
                    '900': '#92400e'
                },
                error: {
                    '50': '#fef2f2',
                    '100': '#fee2e2',
                    '500': '#ef4444',
                    '600': '#dc2626',
                    '700': '#b91c1c',
                    '900': '#7f1d1d'
                },
                semantic: {
                    text: {
                        primary: '#111827',
                        secondary: '#6b7280',
                        disabled: '#9ca3af',
                        inverse: '#ffffff'
                    },
                    background: {
                        primary: '#ffffff',
                        secondary: '#f9fafb',
                        tertiary: '#f3f4f6',
                        inverse: '#111827'
                    },
                    border: {
                        primary: '#e5e7eb',
                        secondary: '#f3f4f6',
                        focus: '#3b82f6',
                        error: '#ef4444'
                    }
                }
            },
            typography: {
                fontFamily: {
                    primary: 'Inter, system-ui, sans-serif',
                    secondary: 'Inter, system-ui, sans-serif',
                    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
                },
                fontSize: {
                    'xs': '0.75rem',
                    'sm': '0.875rem',
                    'base': '1rem',
                    'lg': '1.125rem',
                    'xl': '1.25rem',
                    '2xl': '1.5rem',
                    '3xl': '1.875rem',
                    '4xl': '2.25rem',
                    '5xl': '3rem',
                    '6xl': '3.75rem'
                },
                fontWeight: {
                    'light': 300,
                    'normal': 400,
                    'medium': 500,
                    'semibold': 600,
                    'bold': 700,
                    'extrabold': 800,
                    'black': 900
                },
                lineHeight: {
                    'tight': '1.25',
                    'normal': '1.5',
                    'relaxed': '1.75'
                }
            },
            spacing: {
                '0': '0',
                'px': '1px',
                '0.5': '0.125rem',
                '1': '0.25rem',
                '1.5': '0.375rem',
                '2': '0.5rem',
                '2.5': '0.625rem',
                '3': '0.75rem',
                '3.5': '0.875rem',
                '4': '1rem',
                '5': '1.25rem',
                '6': '1.5rem',
                '7': '1.75rem',
                '8': '2rem',
                '9': '2.25rem',
                '10': '2.5rem',
                '11': '2.75rem',
                '12': '3rem',
                '14': '3.5rem',
                '16': '4rem',
                '20': '5rem',
                '24': '6rem',
                '28': '7rem',
                '32': '8rem',
                '36': '9rem',
                '40': '10rem',
                '44': '11rem',
                '48': '12rem',
                '52': '13rem',
                '56': '14rem',
                '60': '15rem',
                '64': '16rem',
                '72': '18rem',
                '80': '20rem',
                '96': '24rem'
            },
            shadows: {
                'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'base': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
                'none': '0 0 #0000'
            },
            borders: {
                radius: {
                    'none': '0',
                    'sm': '0.125rem',
                    'base': '0.25rem',
                    'md': '0.375rem',
                    'lg': '0.5rem',
                    'xl': '0.75rem',
                    '2xl': '1rem',
                    '3xl': '1.5rem',
                    'full': '9999px'
                },
                width: {
                    '0': '0',
                    'thin': '1px',
                    'base': '1px',
                    'thick': '2px',
                    'thicker': '3px',
                    'thickest': '4px'
                }
            },
            animations: {
                duration: {
                    'fast': '150ms',
                    'normal': '300ms',
                    'slow': '500ms',
                    'slower': '700ms',
                    'slowest': '1000ms'
                },
                easing: {
                    'linear': 'linear',
                    'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
                    'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
                    'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
                }
            },
            breakpoints: {
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
                '2xl': '1536px'
            }
        };
    }
    async saveConfiguration() {
        try {
            const configFile = path_1.default.join(this.configPath, 'design-system-config.json');
            await fs_1.default.promises.writeFile(configFile, JSON.stringify(this.state, null, 2));
        }
        catch (error) {
            console.error('Failed to save design system configuration:', error);
        }
    }
    async startMonitoring() {
        setInterval(() => {
            this.updateDesignSystemMonitoring();
        }, 30000);
    }
    updateDesignSystemMonitoring() {
        this.emit('monitoring-updated', {
            timestamp: new Date(),
            health: this.state.monitoring.health,
            usage: this.state.monitoring.usage,
            performance: this.state.monitoring.performance
        });
    }
    getState() {
        return this.state;
    }
    async registerDesignSystem(designSystem) {
        try {
            this.state.registry.set(designSystem.id, designSystem);
            this.state.index.systems.set(designSystem.id, designSystem);
            if (!this.state.index.platforms.has(designSystem.platform)) {
                this.state.index.platforms.set(designSystem.platform, []);
            }
            this.state.index.platforms.get(designSystem.platform).push(designSystem.id);
            if (!this.state.index.holons.has(designSystem.holon)) {
                this.state.index.holons.set(designSystem.holon, []);
            }
            this.state.index.holons.get(designSystem.holon).push(designSystem.id);
            for (const component of designSystem.components) {
                await this.registerComponent(component, designSystem.id);
            }
            this.state.index.tokens.set(designSystem.id, designSystem.tokens);
            this.state.tokens.set(designSystem.id, designSystem.tokens);
            this.emit('design-system-registered', designSystem);
            await this.saveConfiguration();
        }
        catch (error) {
            console.error('Failed to register design system:', error);
            throw error;
        }
    }
    async registerComponent(component, systemId) {
        try {
            const componentId = `${systemId}:${component.id}`;
            this.state.components.set(componentId, component);
            this.state.index.components.set(componentId, component);
            if (!this.state.index.categories.has(component.category)) {
                this.state.index.categories.set(component.category, []);
            }
            this.state.index.categories.get(component.category).push(componentId);
            this.emit('component-registered', { component, systemId });
        }
        catch (error) {
            console.error('Failed to register component:', error);
            throw error;
        }
    }
    getDesignSystem(id) {
        return this.state.registry.get(id);
    }
    getAllDesignSystems() {
        return Array.from(this.state.registry.values());
    }
    getDesignSystemsByPlatform(platform) {
        const systemIds = this.state.index.platforms.get(platform) || [];
        return systemIds.map(id => this.state.registry.get(id));
    }
    getDesignSystemsByHolon(holon) {
        const systemIds = this.state.index.holons.get(holon) || [];
        return systemIds.map(id => this.state.registry.get(id));
    }
    getComponent(id) {
        return this.state.components.get(id);
    }
    getComponentsByCategory(category) {
        const componentIds = this.state.index.categories.get(category) || [];
        return componentIds.map(id => this.state.components.get(id));
    }
    getComponentsBySystem(systemId) {
        return Array.from(this.state.components.values()).filter(component => component.id.startsWith(`${systemId}:`));
    }
    getTokens(systemId) {
        return this.state.tokens.get(systemId);
    }
    updateDesignSystem(id, updates) {
        const designSystem = this.state.registry.get(id);
        if (designSystem) {
            const updatedSystem = { ...designSystem, ...updates, lastUpdated: new Date() };
            this.state.registry.set(id, updatedSystem);
            this.state.index.systems.set(id, updatedSystem);
            this.emit('design-system-updated', updatedSystem);
        }
    }
    updateComponent(id, updates) {
        const component = this.state.components.get(id);
        if (component) {
            const updatedComponent = { ...component, ...updates };
            this.state.components.set(id, updatedComponent);
            this.state.index.components.set(id, updatedComponent);
            this.emit('component-updated', updatedComponent);
        }
    }
    updateTokens(systemId, updates) {
        const tokens = this.state.tokens.get(systemId);
        if (tokens) {
            const updatedTokens = { ...tokens, ...updates };
            this.state.tokens.set(systemId, updatedTokens);
            this.state.index.tokens.set(systemId, updatedTokens);
            this.emit('tokens-updated', { systemId, tokens: updatedTokens });
        }
    }
    getGovernance() {
        return this.state.governance;
    }
    updateGovernance(governance) {
        this.state.governance = {
            ...this.state.governance,
            ...governance
        };
        this.emit('governance-updated', this.state.governance);
    }
    getMonitoring() {
        return this.state.monitoring;
    }
    addAlert(alert) {
        const newAlert = {
            ...alert,
            id: `alert-${Date.now()}`,
            timestamp: new Date(),
            resolved: false
        };
        this.state.monitoring.alerts.push(newAlert);
        this.emit('alert-added', newAlert);
    }
    resolveAlert(alertId) {
        const alert = this.state.monitoring.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.resolved = true;
            this.emit('alert-resolved', alert);
        }
    }
    async healthCheck() {
        try {
            const metrics = {
                designSystems: this.state.registry.size,
                components: this.state.components.size,
                tokens: this.state.tokens.size,
                governance: this.state.governance,
                monitoring: this.state.monitoring
            };
            return {
                status: 'healthy',
                timestamp: new Date(),
                metrics
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                timestamp: new Date(),
                metrics: { error: error instanceof Error ? error.message : String(error) }
            };
        }
    }
}
exports.DesignSystemManager = DesignSystemManager;
exports.default = DesignSystemManager;
//# sourceMappingURL=DesignSystemManager.js.map
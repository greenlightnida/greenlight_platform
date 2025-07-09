#!/usr/bin/env tsx
import { EventEmitter } from 'events';
export interface DesignSystem {
    id: string;
    name: string;
    version: string;
    platform: 'greenlight-platform' | 'top-bins' | 'shared';
    holon: string;
    status: 'active' | 'deprecated' | 'experimental';
    description: string;
    maintainer: string;
    lastUpdated: Date;
    components: ComponentRegistry[];
    tokens: DesignTokens;
    documentation: DesignSystemDocumentation;
    dependencies: string[];
    metadata: Record<string, any>;
}
export interface ComponentRegistry {
    id: string;
    name: string;
    category: ComponentCategory;
    version: string;
    status: 'stable' | 'beta' | 'deprecated';
    path: string;
    props: ComponentProps[];
    examples: ComponentExample[];
    documentation: string;
    tests: ComponentTests;
    accessibility: ComponentAccessibility;
}
export type ComponentCategory = 'atoms' | 'molecules' | 'organisms' | 'templates' | 'pages' | 'forms' | 'navigation' | 'feedback' | 'data-display' | 'layout';
export interface ComponentProps {
    name: string;
    type: string;
    required: boolean;
    defaultValue?: any;
    description: string;
    examples: any[];
}
export interface ComponentExample {
    name: string;
    description: string;
    code: string;
    preview: string;
}
export interface ComponentTests {
    unit: boolean;
    integration: boolean;
    visual: boolean;
    accessibility: boolean;
    coverage: number;
}
export interface ComponentAccessibility {
    wcagLevel: 'A' | 'AA' | 'AAA';
    keyboardNavigation: boolean;
    screenReader: boolean;
    colorContrast: boolean;
    focusManagement: boolean;
    ariaLabels: boolean;
}
export interface DesignTokens {
    colors: ColorTokens;
    typography: TypographyTokens;
    spacing: SpacingTokens;
    shadows: ShadowTokens;
    borders: BorderTokens;
    animations: AnimationTokens;
    breakpoints: BreakpointTokens;
}
export interface ColorTokens {
    primary: ColorPalette;
    secondary: ColorPalette;
    neutral: ColorPalette;
    success: ColorPalette;
    warning: ColorPalette;
    error: ColorPalette;
    semantic: SemanticColors;
}
export interface ColorPalette {
    [key: string]: string;
}
export interface SemanticColors {
    text: {
        primary: string;
        secondary: string;
        disabled: string;
        inverse: string;
    };
    background: {
        primary: string;
        secondary: string;
        tertiary: string;
        inverse: string;
    };
    border: {
        primary: string;
        secondary: string;
        focus: string;
        error: string;
    };
}
export interface TypographyTokens {
    fontFamily: {
        primary: string;
        secondary: string;
        mono: string;
    };
    fontSize: {
        [key: string]: string;
    };
    fontWeight: {
        [key: string]: number;
    };
    lineHeight: {
        [key: string]: string;
    };
}
export interface SpacingTokens {
    [key: string]: string;
}
export interface ShadowTokens {
    [key: string]: string;
}
export interface BorderTokens {
    radius: {
        [key: string]: string;
    };
    width: {
        [key: string]: string;
    };
}
export interface AnimationTokens {
    duration: {
        [key: string]: string;
    };
    easing: {
        [key: string]: string;
    };
}
export interface BreakpointTokens {
    [key: string]: string;
}
export interface DesignSystemDocumentation {
    storybook: StorybookConfig;
    examples: ExampleConfig;
    guidelines: GuidelineConfig;
    changelog: ChangelogConfig;
}
export interface StorybookConfig {
    url: string;
    version: string;
    stories: StoryConfig[];
}
export interface StoryConfig {
    name: string;
    description: string;
    category: string;
    component: string;
}
export interface ExampleConfig {
    playground: boolean;
    codeExamples: boolean;
    interactive: boolean;
}
export interface GuidelineConfig {
    usage: boolean;
    accessibility: boolean;
    bestPractices: boolean;
    doAndDont: boolean;
}
export interface ChangelogConfig {
    versioning: boolean;
    migration: boolean;
    breaking: boolean;
}
export interface DesignSystemIndex {
    systems: Map<string, DesignSystem>;
    components: Map<string, ComponentRegistry>;
    tokens: Map<string, DesignTokens>;
    categories: Map<ComponentCategory, string[]>;
    platforms: Map<string, string[]>;
    holons: Map<string, string[]>;
}
export interface DesignSystemGovernance {
    standards: DesignSystemStandards;
    policies: DesignSystemPolicies;
    compliance: DesignSystemCompliance;
    quality: DesignSystemQuality;
}
export interface DesignSystemStandards {
    naming: NamingStandards;
    structure: StructureStandards;
    documentation: DocumentationStandards;
    testing: TestingStandards;
}
export interface NamingStandards {
    components: 'PascalCase' | 'kebab-case' | 'camelCase';
    tokens: 'kebab-case' | 'camelCase' | 'snake_case';
    files: 'kebab-case' | 'PascalCase' | 'camelCase';
    folders: 'kebab-case' | 'PascalCase' | 'camelCase';
}
export interface StructureStandards {
    organization: 'atomic' | 'functional' | 'hybrid';
    nesting: boolean;
    flat: boolean;
    modular: boolean;
}
export interface DocumentationStandards {
    required: boolean;
    format: 'markdown' | 'jsdoc' | 'storybook';
    examples: boolean;
    props: boolean;
    accessibility: boolean;
}
export interface TestingStandards {
    unit: boolean;
    integration: boolean;
    visual: boolean;
    accessibility: boolean;
    coverage: number;
}
export interface DesignSystemPolicies {
    versioning: VersioningPolicy;
    deprecation: DeprecationPolicy;
    breaking: BreakingChangePolicy;
    migration: MigrationPolicy;
}
export interface VersioningPolicy {
    strategy: 'semantic' | 'calendar' | 'sequential';
    major: string[];
    minor: string[];
    patch: string[];
}
export interface DeprecationPolicy {
    notice: number;
    grace: number;
    removal: number;
}
export interface BreakingChangePolicy {
    approval: boolean;
    notification: boolean;
    migration: boolean;
}
export interface MigrationPolicy {
    automated: boolean;
    manual: boolean;
    documentation: boolean;
    support: boolean;
}
export interface DesignSystemCompliance {
    accessibility: AccessibilityCompliance;
    performance: PerformanceCompliance;
    security: SecurityCompliance;
    branding: BrandingCompliance;
}
export interface AccessibilityCompliance {
    wcag: 'A' | 'AA' | 'AAA';
    required: boolean;
    testing: boolean;
    documentation: boolean;
}
export interface PerformanceCompliance {
    bundleSize: number;
    renderTime: number;
    memoryUsage: number;
    required: boolean;
}
export interface SecurityCompliance {
    sanitization: boolean;
    validation: boolean;
    xss: boolean;
    required: boolean;
}
export interface BrandingCompliance {
    colors: boolean;
    typography: boolean;
    spacing: boolean;
    required: boolean;
}
export interface DesignSystemQuality {
    metrics: QualityMetrics;
    reviews: QualityReviews;
    automation: QualityAutomation;
}
export interface QualityMetrics {
    coverage: number;
    documentation: number;
    accessibility: number;
    performance: number;
    consistency: number;
}
export interface QualityReviews {
    required: boolean;
    frequency: 'per-component' | 'per-release' | 'monthly';
    approvers: string[];
    checklist: string[];
}
export interface QualityAutomation {
    linting: boolean;
    testing: boolean;
    visual: boolean;
    accessibility: boolean;
}
export interface DesignSystemManagerState {
    index: DesignSystemIndex;
    governance: DesignSystemGovernance;
    registry: Map<string, DesignSystem>;
    components: Map<string, ComponentRegistry>;
    tokens: Map<string, DesignTokens>;
    monitoring: DesignSystemMonitoring;
}
export interface DesignSystemMonitoring {
    health: DesignSystemHealth;
    usage: DesignSystemUsage;
    performance: DesignSystemPerformance;
    alerts: DesignSystemAlert[];
}
export interface DesignSystemHealth {
    overall: 'healthy' | 'degraded' | 'unhealthy';
    systems: Record<string, string>;
    components: Record<string, string>;
    documentation: Record<string, string>;
    tests: Record<string, string>;
}
export interface DesignSystemUsage {
    components: Record<string, number>;
    systems: Record<string, number>;
    platforms: Record<string, number>;
    trends: UsageTrend[];
}
export interface UsageTrend {
    component: string;
    usage: number;
    trend: 'up' | 'down' | 'stable';
    period: string;
}
export interface DesignSystemPerformance {
    bundleSize: number;
    renderTime: number;
    memoryUsage: number;
    loadTime: number;
}
export interface DesignSystemAlert {
    id: string;
    type: 'error' | 'warning' | 'info';
    message: string;
    component?: string;
    system?: string;
    timestamp: Date;
    resolved: boolean;
}
export declare class DesignSystemManager extends EventEmitter {
    private static instance;
    private state;
    private configPath;
    private constructor();
    static getInstance(): DesignSystemManager;
    private initializeState;
    private initializeDesignSystemManager;
    private initializeDefaultDesignSystems;
    private getDefaultTokens;
    private saveConfiguration;
    private startMonitoring;
    private updateDesignSystemMonitoring;
    getState(): DesignSystemManagerState;
    registerDesignSystem(designSystem: DesignSystem): Promise<void>;
    registerComponent(component: ComponentRegistry, systemId: string): Promise<void>;
    getDesignSystem(id: string): DesignSystem | undefined;
    getAllDesignSystems(): DesignSystem[];
    getDesignSystemsByPlatform(platform: string): DesignSystem[];
    getDesignSystemsByHolon(holon: string): DesignSystem[];
    getComponent(id: string): ComponentRegistry | undefined;
    getComponentsByCategory(category: ComponentCategory): ComponentRegistry[];
    getComponentsBySystem(systemId: string): ComponentRegistry[];
    getTokens(systemId: string): DesignTokens | undefined;
    updateDesignSystem(id: string, updates: Partial<DesignSystem>): void;
    updateComponent(id: string, updates: Partial<ComponentRegistry>): void;
    updateTokens(systemId: string, updates: Partial<DesignTokens>): void;
    getGovernance(): DesignSystemGovernance;
    updateGovernance(governance: Partial<DesignSystemGovernance>): void;
    getMonitoring(): DesignSystemMonitoring;
    addAlert(alert: Omit<DesignSystemAlert, 'id' | 'timestamp' | 'resolved'>): void;
    resolveAlert(alertId: string): void;
    healthCheck(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        timestamp: Date;
        metrics: Record<string, any>;
    }>;
}
export default DesignSystemManager;
//# sourceMappingURL=DesignSystemManager.d.ts.map
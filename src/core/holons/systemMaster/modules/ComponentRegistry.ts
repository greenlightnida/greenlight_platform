import { EventEmitter } from 'events';

export interface ComponentData {
  id: string;
  name: string;
  category: string;
  systemId: string;
  path: string;
  type: 'react' | 'typescript' | 'css' | 'other';
  lastModified: Date;
  size: number;
  dependencies: string[];
  health: 'healthy' | 'warning' | 'error';
  metrics: {
    complexity: number;
    maintainability: number;
    testCoverage: number;
  };
}

export interface ComponentQuery {
  category?: string;
  systemId?: string;
  type?: string;
  health?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ComponentMetrics {
  total: number;
  byCategory: Record<string, number>;
  bySystem: Record<string, number>;
  byType: Record<string, number>;
  byHealth: Record<string, number>;
  averageComplexity: number;
  averageMaintainability: number;
  averageTestCoverage: number;
}

export interface ComponentReport {
  timestamp: Date;
  metrics: ComponentMetrics;
  components: ComponentData[];
  recommendations: string[];
}

export class ComponentRegistry extends EventEmitter {
  private components: Map<string, ComponentData> = new Map();
  private categories: Map<string, string[]> = new Map();
  private systems: Map<string, string[]> = new Map();

  constructor() {
    super();
    this.initializeCategories();
  }

  private initializeCategories(): void {
    this.categories.set('ui', []);
    this.categories.set('business', []);
    this.categories.set('infrastructure', []);
    this.categories.set('integration', []);
    this.categories.set('utility', []);
  }

  public registerComponent(component: ComponentData): void {
    this.components.set(component.id, component);
    
    // Update category index
    if (!this.categories.has(component.category)) {
      this.categories.set(component.category, []);
    }
    this.categories.get(component.category)!.push(component.id);
    
    // Update system index
    if (!this.systems.has(component.systemId)) {
      this.systems.set(component.systemId, []);
    }
    this.systems.get(component.systemId)!.push(component.id);
    
    this.emit('component:registered', component);
  }

  public getComponent(id: string): ComponentData | undefined {
    return this.components.get(id);
  }

  public getComponentsByCategory(category: string): ComponentData[] {
    const componentIds = this.categories.get(category) || [];
    return componentIds.map(id => this.components.get(id)!);
  }

  public getComponentsBySystem(systemId: string): ComponentData[] {
    const componentIds = this.systems.get(systemId) || [];
    return componentIds.map(id => this.components.get(id)!);
  }

  public async queryComponents(query: ComponentQuery): Promise<ComponentData[]> {
    let results = Array.from(this.components.values());

    // Apply filters
    if (query.category) {
      results = results.filter(c => c.category === query.category);
    }
    if (query.systemId) {
      results = results.filter(c => c.systemId === query.systemId);
    }
    if (query.type) {
      results = results.filter(c => c.type === query.type);
    }
    if (query.health) {
      results = results.filter(c => c.health === query.health);
    }
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      results = results.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.id.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    if (query.offset) {
      results = results.slice(query.offset);
    }
    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    return results;
  }

  public getMetrics(): ComponentMetrics {
    const components = Array.from(this.components.values());
    
    const byCategory: Record<string, number> = {};
    const bySystem: Record<string, number> = {};
    const byType: Record<string, number> = {};
    const byHealth: Record<string, number> = {};

    components.forEach(component => {
      byCategory[component.category] = (byCategory[component.category] || 0) + 1;
      bySystem[component.systemId] = (bySystem[component.systemId] || 0) + 1;
      byType[component.type] = (byType[component.type] || 0) + 1;
      byHealth[component.health] = (byHealth[component.health] || 0) + 1;
    });

    const totalComplexity = components.reduce((sum, c) => sum + c.metrics.complexity, 0);
    const totalMaintainability = components.reduce((sum, c) => sum + c.metrics.maintainability, 0);
    const totalTestCoverage = components.reduce((sum, c) => sum + c.metrics.testCoverage, 0);

    return {
      total: components.length,
      byCategory,
      bySystem,
      byType,
      byHealth,
      averageComplexity: components.length > 0 ? totalComplexity / components.length : 0,
      averageMaintainability: components.length > 0 ? totalMaintainability / components.length : 0,
      averageTestCoverage: components.length > 0 ? totalTestCoverage / components.length : 0
    };
  }

  public async generateReport(): Promise<ComponentReport> {
    const metrics = this.getMetrics();
    const components = Array.from(this.components.values());
    
    const recommendations: string[] = [];
    
    // Generate recommendations based on metrics
    if (metrics.averageTestCoverage < 80) {
      recommendations.push('Increase test coverage across components');
    }
    if (metrics.averageComplexity > 10) {
      recommendations.push('Reduce component complexity');
    }
    if ((metrics.byHealth.error || 0) > 0) {
      recommendations.push('Address components with error health status');
    }

    return {
      timestamp: new Date(),
      metrics,
      components,
      recommendations
    };
  }

  public getAllComponents(): ComponentData[] {
    return Array.from(this.components.values());
  }

  public getCategories(): string[] {
    return Array.from(this.categories.keys());
  }

  public getSystems(): string[] {
    return Array.from(this.systems.keys());
  }
} 
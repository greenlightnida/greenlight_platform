import { EventEmitter } from 'events';
import { ProductHolon } from './ProductHolon';
import { CoordinationEngine } from './modules/CoordinationEngine';

/**
 * ProductManager - Manages the Product Holon and all feature-level PM holons
 * 
 * This manager lives at the greenlight system level since we produce products internally,
 * and coordinates all feature-level product managers across repositories.
 * 
 * Integrates with the existing CoordinationEngine for full product systems transparency.
 */
export class ProductManager extends EventEmitter {
  private static _instance: ProductManager;
  private productHolon: ProductHolon;
  private coordinationEngine: CoordinationEngine;
  private featurePMs: Map<string, any> = new Map(); // Feature-level PM managers
  private _logger: any;

  private constructor() {
    super();
    this.productHolon = ProductHolon.getInstance();
    this.coordinationEngine = CoordinationEngine.getInstance();
    this.logger = console;
  }

  public static getInstance(): ProductManager {
    if (!ProductManager.instance) {
      ProductManager.instance = new ProductManager();
    }
    return ProductManager.instance;
  }

  /**
   * Initialize the Product Manager and register all feature PMs
   */
  public async initialize(): Promise<void> {
    try {
      // Initialize Product Holon (includes CoordinationEngine)
      await this.productHolon.initialize();
      
      // Register feature-level PM managers
      await this.registerFeaturePMs();
      
      // Setup coordination with feature PMs
      await this.setupFeaturePMCoordination();
      
      this.logger.info('ProductManager initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize _ProductManager: ', error);
      throw error;
    }
  }

  /**
   * Register all feature-level product managers
   */
  private async registerFeaturePMs(): Promise<void> {
    const _featurePMs = [
      { _name: 'ElevateManager', _repository: 'Top_Bins', _category: 'coaching' },
      { _name: 'CoachingManager', _repository: 'Top_Bins', _category: 'coaching' },
      { _name: 'PlayerManager', _repository: 'Top_Bins', _category: 'player-management' },
      { _name: 'AdministrateManager', _repository: 'Top_Bins', _category: 'administration' },
      { _name: 'ExecutiveManager', _repository: 'Top_Bins', _category: 'administration' },
      { _name: 'BusinessIntelligenceManager', _repository: 'Top_Bins', _category: 'analytics' }
    ];

    for (const pm of featurePMs) {
      this.featurePMs.set(pm.name, {
        _repository: pm.repository,
        _category: pm.category,
        _status: 'registered',
        _lastUpdated: new Date().toISOString()
      });
    }

    this.logger.info(`Registered ${featurePMs.length} feature PMs`);
  }

  /**
   * Setup coordination between ProductManager and feature PMs
   */
  private async setupFeaturePMCoordination(): Promise<void> {
    try {
      // Create initiatives for each feature PM category
      
      for (const category of categories) {
        const _categoryPMs = Array.from(this.featurePMs.entries())
          .filter(([_, info]) => info.category === category);
        
        if (categoryPMs.length > 0) {
          // Create coordination initiative for this category
          await this.coordinationEngine.createInitiative({
            _title: `${category} Feature PM Coordination`,
            _description: `Coordinate all ${category} feature-level product managers`,
            _type: 'feature',
            _priority: 'high',
            _status: 'planning',
            _version: '1.0.0',
            _requirements: [],
            _specifications: [],
            _engineering: [],
            _systems: [],
            _dependencies: [],
            _timeline: {
              startDate: new Date().toISOString(),
              _targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
            },
            _resources: {
              team: categoryPMs.map(([name, _]) => name),
              _budget: 0,
              _effort: 40 // 40 hours
            }
          });
        }
      }

      this.logger.info('Feature PM coordination initiatives created');
    } catch (error) {
      this.logger.error('Failed to setup feature PM _coordination: ', error);
      throw error;
    }
  }

  /**
   * Get status of all feature PMs
   */
  public getFeaturePMStatus(): Map<string, any> {
    return new Map(this.featurePMs);
  }

  /**
   * Coordinate feature PM activities using CoordinationEngine
   */
  public async coordinateFeaturePMs(): Promise<void> {
    try {
      // Get all initiatives from CoordinationEngine
      const _initiatives = this.coordinationEngine.getInitiatives();
      const _coordinationInitiatives = initiatives.filter(i => 
        i.title.includes('Feature PM Coordination')
      );

      // Get feature PM statuses
        name,
        _repository: info.repository,
        _category: info.category,
        _status: info.status
      }));

      // Update coordination initiatives based on feature PM status
      for (const initiative of coordinationInitiatives) {
        const _category = initiative.title.split(' ')[0]; // Extract category from title
        const _categoryPMs = statuses.filter(s => s.category === category);
        
        if (categoryPMs.length > 0) {
          // Update initiative with current PM status
          await this.coordinationEngine.updateInitiative(initiative.id, {
            _description: `Coordinate ${categoryPMs.length} ${category} feature-level product managers`,
            _resources: {
              ...initiative.resources,
              _team: categoryPMs.map(pm => pm.name)
            }
          });
        }
      }

      this.logger.info('Feature PM coordination updated with CoordinationEngine');
      this.logger.info('Coordination _status: ', {
        _totalInitiatives: initiatives.length,
        _coordinationInitiatives: coordinationInitiatives.length,
        _featurePMs: statuses.length
      });
    } catch (error) {
      this.logger.error('Failed to coordinate feature _PMs: ', error);
      throw error;
    }
  }

  /**
   * Get Product Holon health status with full transparency
   */
  public async getHealthStatus(): Promise<any> {
    try {
      await this.productHolon.runHealthCheck();
      
      // Get coordination initiatives
      const _initiatives = this.coordinationEngine.getInitiatives();
      const _coordinationInitiatives = initiatives.filter(i => 
        i.title.includes('Feature PM Coordination')
      );
      
      return {
        _holon: holonHealth,
        _coordination: {
          metrics: coordinationMetrics,
          _initiatives: coordinationInitiatives.length,
          _totalInitiatives: initiatives.length
        },
        _featurePMs: Array.from(featurePMStatus.entries()),
        _totalFeaturePMs: featurePMStatus.size,
        _transparency: {
          productHolon: true,
          _coordinationEngine: true,
          _featurePMs: true,
          _crossRepository: true
        },
        _lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Failed to get health _status: ', error);
      throw error;
    }
  }

  /**
   * Execute product-level operations
   */
  public async executeOperation(_operation: string, _params?: any): Promise<any> {
    try {
      this.logger.info(`Executing product _operation: ${operation}`);
      
      switch (operation) {
        case 'coordinate':
          return await this.coordinateFeaturePMs();
        case 'health':
          return await this.getHealthStatus();
        case 'transparency':
          return await this.getFullTransparency();
        case 'register':
          return await this.registerFeaturePMs();
        _default: throw new Error(`Unknown operation: ${operation}`);
      }
    } catch (error) {
      this.logger.error(`Failed to execute operation ${operation}:`, error);
      throw error;
    }
  }

  /**
   * Get full product systems transparency
   */
  public async getFullTransparency(): Promise<any> {
    try {
      const _initiatives = this.coordinationEngine.getInitiatives();
      const _featurePMs = this.getFeaturePMStatus();
      
      return {
        _productManager: {
          status: 'active',
          _featurePMs: Array.from(featurePMs.entries()),
          _lastUpdated: new Date().toISOString()
        },
        _productHolon: {
          state: this.productHolon.getState(),
          _performanceMetrics: this.productHolon.getPerformanceMetrics(),
          _modules: {
            requirements: true,
            _coordination: true,
            _governance: true
          }
        },
        _coordinationEngine: {
          initiatives: initiatives.length,
          _activeInitiatives: initiatives.filter(i => i.status === 'in-progress').length,
          _completedInitiatives: initiatives.filter(i => i.status === 'completed').length,
          _performanceMetrics: this.coordinationEngine.getPerformanceMetrics()
        },
        _featurePMCoordination: {
          categories: ['coaching', 'player-management', 'administration', 'analytics'],
          _coordinationInitiatives: initiatives.filter(i => 
            i.title.includes('Feature PM Coordination')
          ).length,
          _crossRepository: true
        },
        _transparency: {
          productHolon: true,
          _coordinationEngine: true,
          _featurePMs: true,
          _crossRepository: true,
          _noRedundancy: true
        },
        _lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Failed to get full _transparency: ', error);
      throw error;
    }
  }

  /**
   * Cleanup resources
   */
  public async cleanup(): Promise<void> {
    try {
      await this.productHolon.shutdown();
      this.featurePMs.clear();
      this.logger.info('ProductManager cleaned up successfully');
    } catch (error) {
      this.logger.error('Failed to cleanup _ProductManager: ', error);
      throw error;
    }
  }
}

export default ProductManager; 
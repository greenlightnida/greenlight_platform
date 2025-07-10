import { useState, useEffect } from 'react';

import { FeaturesHolon } from '../../core/holons/features/FeaturesHolon';
import { FeatureDeployment , MaintenanceTask } from '../../core/holons/features/modules/DeliveryEngine';
import { FeatureImplementation } from '../../core/holons/features/modules/ImplementationEngine';
import { TechnicalStandard } from '../../core/holons/features/modules/TechnicalEngine';
import './FeaturesDashboard.css';

interface FeaturesDashboardProps {
  className?: string;
}

export const FeaturesDashboard: React.FC<FeaturesDashboardProps> = ({ className = '' }) => {
  const [featuresHolon, setFeaturesHolon] = useState<FeaturesHolon | null>(null);
  const [implementations, setImplementations] = useState<FeatureImplementation[]>([]);
  const [deployments, setDeployments] = useState<FeatureDeployment[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);
  const [standards, setStandards] = useState<TechnicalStandard[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'implementations' | 'deployments' | 'maintenance' | 'standards'>('implementations');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeFeaturesHolon = async () => {
      try {
        const holon = FeaturesHolon.getInstance();
        await holon.initialize();
        setFeaturesHolon(holon);
        
        // Load initial data
        setImplementations(holon.getImplementations());
        setDeployments(holon.getDeployments());
        setMaintenanceTasks(holon.getMaintenanceTasks());
        setStandards(holon.getStandards());
        setPerformanceMetrics(holon.getPerformanceMetrics());
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize Features Holon:', error);
        setLoading(false);
      }
    };

    initializeFeaturesHolon();
  }, []);

  // Helper function for status color
  /**
   *
   * @param status
   */
  function getStatusColor(status: string) {
    switch (status) {
      case 'running': return 'bg-green-200 text-green-800';
      case 'stopped': return 'bg-gray-200 text-gray-800';
      case 'maintenance': return 'bg-yellow-200 text-yellow-800';
      case 'error': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // Helper function for priority color
  /**
   *
   * @param priority
   */
  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // Restore handleStartImplementation if referenced
  const handleStartImplementation = async (requirementId: string, initiativeId: string) => {
    if (!featuresHolon) return;
    
    try {
      const implementation = await featuresHolon.startFeatureImplementation(requirementId, initiativeId);
      setImplementations(featuresHolon.getImplementations());
      console.log('Implementation started:', implementation);
    } catch (error) {
      console.error('Failed to start implementation:', error);
    }
  };

  const handleDeployFeature = async (implementationId: string) => {
    if (!featuresHolon) return;
    
    try {
      const deployment = await featuresHolon.deployFeature(implementationId);
      setDeployments(featuresHolon.getDeployments());
      console.log('Feature deployed:', deployment);
    } catch (error) {
      console.error('Failed to deploy feature:', error);
    }
  };

  const handlePromoteToProduction = async (deploymentId: string) => {
    if (!featuresHolon) return;
    
    try {
      const success = await featuresHolon.promoteToProduction(deploymentId);
      if (success) {
        setDeployments(featuresHolon.getDeployments());
        console.log('Deployment promoted to production');
      }
    } catch (error) {
      console.error('Failed to promote deployment:', error);
    }
  };

  const handleRunQualityAudit = async () => {
    if (!featuresHolon) return;
    
    try {
      await featuresHolon.runQualityAudit();
      setPerformanceMetrics(featuresHolon.getPerformanceMetrics());
      console.log('Quality audit completed');
    } catch (error) {
      console.error('Failed to run quality audit:', error);
    }
  };

  if (loading) {
    return (
      <div className={`features-dashboard ${className}`}>
        <div className="loading">Loading Features Holon...</div>
      </div>
    );
  }

  return (
    <div className={`features-dashboard ${className}`}>
      <div className="dashboard-header">
        <h1>🎯 Features Holon Dashboard</h1>
        <div className="header-actions">
          <button onClick={handleRunQualityAudit} className="btn btn-primary">
            🔍 Run Quality Audit
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      {performanceMetrics && (
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Total Features</h3>
            <div className="metric-value">{performanceMetrics.totalFeatures}</div>
          </div>
          <div className="metric-card">
            <h3>Active Features</h3>
            <div className="metric-value">{performanceMetrics.activeFeatures}</div>
          </div>
          <div className="metric-card">
            <h3>Completed Features</h3>
            <div className="metric-value">{performanceMetrics.completedFeatures}</div>
          </div>
          <div className="metric-card">
            <h3>Average Quality</h3>
            <div className="metric-value">{performanceMetrics.averageQuality.toFixed(1)}%</div>
          </div>
          <div className="metric-card">
            <h3>On-Time Delivery</h3>
            <div className="metric-value">{performanceMetrics.onTimeDelivery.toFixed(1)}%</div>
          </div>
          <div className="metric-card">
            <h3>Compliance Rate</h3>
            <div className="metric-value">{performanceMetrics.complianceRate.toFixed(1)}%</div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'implementations' ? 'active' : ''}`}
          onClick={() => setActiveTab('implementations')}
        >
          🔨 Implementations ({implementations.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'deployments' ? 'active' : ''}`}
          onClick={() => setActiveTab('deployments')}
        >
          🚀 Deployments ({deployments.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'maintenance' ? 'active' : ''}`}
          onClick={() => setActiveTab('maintenance')}
        >
          🔧 Maintenance ({maintenanceTasks.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'standards' ? 'active' : ''}`}
          onClick={() => setActiveTab('standards')}
        >
          ⚙️ Standards ({standards.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'implementations' && (
          <div className="implementations-tab">
            <h2>Feature Implementations</h2>
            <div className="implementations-grid">
              {implementations.map((impl) => (
                <div key={impl.id} className="implementation-card">
                  <div className="card-header">
                    <h3>{impl.name}</h3>
                    <span className={`status-badge ${getStatusColor(impl.status)}`}>
                      {impl.status}
                    </span>
                  </div>
                  <p className="description">{impl.description}</p>
                  <div className="card-details">
                    <div className="detail-item">
                      <strong>Type:</strong> {impl.type}
                    </div>
                    <div className="detail-item">
                      <strong>Priority:</strong>
                      <span className={`priority-badge ${getPriorityColor(impl.priority)}`}>
                        {impl.priority}
                      </span>
                    </div>
                    <div className="detail-item">
                      <strong>Framework:</strong> {impl.technicalSpecs.framework}
                    </div>
                    <div className="detail-item">
                      <strong>Target Date:</strong> {new Date(impl.implementation.targetDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="quality-metrics">
                    <div className="quality-item">
                      <span>Test Coverage: {impl.quality.testCoverage}%</span>
                    </div>
                    <div className="quality-item">
                      <span>Code Quality: {impl.quality.codeQuality}%</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    {impl.status === 'planned' && (
                      <button
                        onClick={() => handleDeployFeature(impl.id)}
                        className="btn btn-secondary"
                      >
                        🚀 Deploy
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'deployments' && (
          <div className="deployments-tab">
            <h2>Feature Deployments</h2>
            <div className="deployments-grid">
              {deployments.map((deployment) => (
                <div key={deployment.id} className="deployment-card">
                  <div className="card-header">
                    <h3>{deployment.name}</h3>
                    <span className={`status-badge ${getStatusColor(deployment.status)}`}>
                      {deployment.status}
                    </span>
                  </div>
                  <div className="card-details">
                    <div className="detail-item">
                      <strong>Environment:</strong> {deployment.environment}
                    </div>
                    <div className="detail-item">
                      <strong>Version:</strong> {deployment.version}
                    </div>
                    <div className="detail-item">
                      <strong>Type:</strong> {deployment.deploymentType}
                    </div>
                    <div className="detail-item">
                      <strong>Deployed By:</strong> {deployment.deployment.deployedBy}
                    </div>
                  </div>
                  <div className="health-metrics">
                    <div className="health-item">
                      <span>Health: {deployment.health.status}</span>
                    </div>
                    <div className="health-item">
                      <span>Response Time: {deployment.health.responseTime}ms</span>
                    </div>
                    <div className="health-item">
                      <span>Error Rate: {deployment.health.errorRate.toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    {deployment.status === 'staging' && (
                      <button
                        onClick={() => handlePromoteToProduction(deployment.id)}
                        className="btn btn-primary"
                      >
                        🚀 Promote to Production
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="maintenance-tab">
            <h2>Maintenance Tasks</h2>
            <div className="maintenance-grid">
              {maintenanceTasks.map((task) => (
                <div key={task.id} className="maintenance-card">
                  <div className="card-header">
                    <h3>{task.name}</h3>
                    <span className={`status-badge ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="description">{task.description}</p>
                  <div className="card-details">
                    <div className="detail-item">
                      <strong>Type:</strong> {task.type}
                    </div>
                    <div className="detail-item">
                      <strong>Priority:</strong>
                      <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="detail-item">
                      <strong>Assigned To:</strong> {task.assignedTo}
                    </div>
                    <div className="detail-item">
                      <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="time-metrics">
                    <div className="time-item">
                      <span>Estimated: {task.estimatedHours}h</span>
                    </div>
                    {task.actualHours && (
                      <div className="time-item">
                        <span>Actual: {task.actualHours}h</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'standards' && (
          <div className="standards-tab">
            <h2>Technical Standards</h2>
            <div className="standards-grid">
              {standards.map((standard) => (
                <div key={standard.id} className="standard-card">
                  <div className="card-header">
                    <h3>{standard.name}</h3>
                    <span className={`status-badge ${getStatusColor(standard.status)}`}>
                      {standard.status}
                    </span>
                  </div>
                  <p className="description">{standard.description}</p>
                  <div className="card-details">
                    <div className="detail-item">
                      <strong>Category:</strong> {standard.category}
                    </div>
                    <div className="detail-item">
                      <strong>Version:</strong> {standard.version}
                    </div>
                    <div className="detail-item">
                      <strong>Enforcement:</strong> {standard.enforcement}
                    </div>
                  </div>
                  <div className="requirements-list">
                    <strong>Requirements:</strong>
                    <ul>
                      {standard.requirements.slice(0, 3).map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturesDashboard; 
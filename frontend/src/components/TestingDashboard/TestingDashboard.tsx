import React, { useEffect, useState } from 'react';
import './TestingDashboard.css';

interface TestResult {
  id: string;
  name: string;
  status: 'PASS' | 'FAIL' | 'SKIP' | 'RUNNING';
  duration: number;
  cost: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  layer: 'UNIT' | 'INTEGRATION' | 'E2E' | 'PERFORMANCE' | 'SECURITY';
  timestamp: string;
  error?: string;
  coverage?: number;
  impact?: number;
}

interface TestSuite {
  id: string;
  name: string;
  tests: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  duration: number;
  cost: number;
  status: 'RUNNING' | 'COMPLETE' | 'FAILED';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

interface TestingHolonState {
  isInitialized: boolean;
  isRunning: boolean;
  currentTestSuite: TestSuite | null;
  testHistory: TestResult[];
  costMetrics: {
    totalCost: number;
    averageCostPerTest: number;
    costByLayer: Record<string, number>;
    costByPriority: Record<string, number>;
  };
  performanceMetrics: {
    totalTestsRun: number;
    successRate: number;
    averageDuration: number;
    failurePatterns: string[];
  };
  selfHealing: {
    autoRecoveryEnabled: boolean;
    recoveryAttempts: number;
    lastRecovery: string | null;
    failurePatterns: Record<string, number>;
  };
  predictiveAnalysis: {
    riskAssessment: Record<string, number>;
    testPrioritization: string[];
    predictedFailures: string[];
    optimizationRecommendations: string[];
  };
  managerIntegration: {
    activeManagers: string[];
    loadDistribution: Record<string, number>;
    coordinationStatus: 'ACTIVE' | 'DEGRADED' | 'FAILED';
  };
  cicdIntegration: {
    enabled: boolean;
    professionalStandards: {
      enforced: boolean;
      complianceLevel: 'basic' | 'standard' | 'enterprise';
      auditTrail: boolean;
      qualityGates: boolean;
      automatedReviews: boolean;
    };
    protocols: {
      featureTesting: boolean;
      regressionTesting: boolean;
      performanceTesting: boolean;
      securityTesting: boolean;
      accessibilityTesting: boolean;
      deploymentTesting: boolean;
    };
    efficiencyOptimization: {
      parallelExecution: boolean;
      intelligentPrioritization: boolean;
      resourceOptimization: boolean;
      costManagement: boolean;
      timeToMarket: boolean;
    };
    continuousImprovement: {
      learningFromFailures: boolean;
      patternOptimization: boolean;
      protocolEvolution: boolean;
      capabilityEnhancement: boolean;
    };
  };
}

const TestingDashboard: React.FC = () => {
  const [holonState, setHolonState] = useState<TestingHolonState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [activityLog, setActivityLog] = useState<{ timestamp: string; message: string }[]>([]);
  const [featuresMetrics, setFeaturesMetrics] = useState<any>(null);
  const [productMetrics, setProductMetrics] = useState<any>(null);

  useEffect(() => {
    fetchHolonState();
    fetchActivityLog();
    fetchFeaturesMetrics();
    fetchProductMetrics();
    const interval = setInterval(() => {
      fetchHolonState();
      fetchActivityLog();
      fetchFeaturesMetrics();
      fetchProductMetrics();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchHolonState = async () => {
    try {
      const response = await fetch('/api/testing/holon-state');
      if (!response.ok) throw new Error('Failed to fetch testing holon state');
      const data = await response.json();
      setHolonState(data.data); // <-- FIXED: use data.data
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  const fetchActivityLog = async () => {
    try {
      const response = await fetch('/api/testing/activity-log');
      if (!response.ok) throw new Error('Failed to fetch activity log');
      const data = await response.json();
      setActivityLog(data.data || []);
    } catch (err) {
      // Optionally handle error
    }
  };

  const fetchFeaturesMetrics = async () => {
    try {
      const response = await fetch('/api/features/performance-metrics');
      if (!response.ok) throw new Error('Failed to fetch features metrics');
      const data = await response.json();
      setFeaturesMetrics(data.data);
    } catch (err) {
      // Optionally handle error
    }
  };

  const fetchProductMetrics = async () => {
    try {
      const response = await fetch('/api/product/performance-metrics');
      if (!response.ok) throw new Error('Failed to fetch product metrics');
      const data = await response.json();
      setProductMetrics(data.data);
    } catch (err) {
      // Optionally handle error
    }
  };

  const startTestSuite = async () => {
    try {
      setIsRunningTests(true);
      const response = await fetch('/api/testing/start-suite', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to start test suite');
      
      // Poll for completion
      const pollInterval = setInterval(async () => {
        const stateResponse = await fetch('/api/testing/holon-state');
        const stateData = await stateResponse.json();
        setHolonState(stateData);
        
        if (!stateData.isRunning) {
          setIsRunningTests(false);
          clearInterval(pollInterval);
        }
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start tests');
      setIsRunningTests(false);
    }
  };

  const toggleSelfHealing = async () => {
    if (!holonState) return;
    
    try {
      const response = await fetch('/api/testing/toggle-self-healing', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !holonState.selfHealing.autoRecoveryEnabled })
      });
      
      if (!response.ok) throw new Error('Failed to toggle self-healing');
      await fetchHolonState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle self-healing');
    }
  };

  const integrateWithFeaturesHolon = async () => {
    try {
      const response = await fetch('/api/testing/integrate-features', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to integrate with Features Holon');
      await fetchHolonState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to integrate with Features Holon');
    }
  };

  const enforceProfessionalStandards = async () => {
    try {
      const response = await fetch('/api/testing/enforce-standards', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to enforce professional standards');
      await fetchHolonState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enforce professional standards');
    }
  };

  if (loading) return <div className="testing-dashboard loading">Loading Testing Holon...</div>;
  if (error) return <div className="testing-dashboard error">Error: {error}</div>;
  if (!holonState) return <div className="testing-dashboard error">No testing holon state available</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'DEGRADED': return 'orange';
      case 'FAILED': return 'red';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'red';
      case 'HIGH': return 'orange';
      case 'MEDIUM': return 'yellow';
      case 'LOW': return 'green';
      default: return 'gray';
    }
  };

  const getLayerColor = (layer: string) => {
    switch (layer) {
      case 'UNIT': return 'blue';
      case 'INTEGRATION': return 'purple';
      case 'E2E': return 'green';
      case 'PERFORMANCE': return 'orange';
      case 'SECURITY': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="testing-dashboard">
      <div className="dashboard-header">
        <h1>🧪 Testing Holon Dashboard</h1>
        <div className="header-controls">
          <button 
            onClick={startTestSuite} 
            disabled={isRunningTests || holonState.isRunning}
            className="btn-primary"
          >
            {isRunningTests ? 'Running Tests...' : 'Start Test Suite'}
          </button>
          <button 
            onClick={toggleSelfHealing}
            className={`btn-secondary ${holonState.selfHealing.autoRecoveryEnabled ? 'enabled' : 'disabled'}`}
          >
            Self-Healing: {holonState.selfHealing.autoRecoveryEnabled ? 'ON' : 'OFF'}
          </button>
          <button 
            onClick={integrateWithFeaturesHolon}
            className="btn-secondary"
          >
            🔗 Integrate Features
          </button>
          <button 
            onClick={enforceProfessionalStandards}
            className="btn-secondary"
          >
            🏛️ Enforce Standards
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* System Status */}
        <div className="status-card">
          <h3>System Status</h3>
          <div className="status-indicators">
            <div className="status-item">
              <span className="label">Holon Status:</span>
              <span className={`value status-${getStatusColor(holonState.managerIntegration.coordinationStatus)}`}>
                {holonState.managerIntegration.coordinationStatus}
              </span>
            </div>
            <div className="status-item">
              <span className="label">Initialized:</span>
              <span className={`value ${holonState.isInitialized ? 'status-green' : 'status-red'}`}>
                {holonState.isInitialized ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="status-item">
              <span className="label">Running:</span>
              <span className={`value ${holonState.isRunning ? 'status-orange' : 'status-green'}`}>
                {holonState.isRunning ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="metrics-card">
          <h3>Performance Metrics</h3>
          <div className="metrics-grid">
            <div className="metric">
              <span className="metric-value">{holonState.performanceMetrics.totalTestsRun}</span>
              <span className="metric-label">Total Tests</span>
            </div>
            <div className="metric">
              <span className="metric-value">{holonState.performanceMetrics.successRate.toFixed(1)}%</span>
              <span className="metric-label">Success Rate</span>
            </div>
            <div className="metric">
              <span className="metric-value">{holonState.performanceMetrics.averageDuration.toFixed(0)}ms</span>
              <span className="metric-label">Avg Duration</span>
            </div>
            <div className="metric">
              <span className="metric-value">{holonState.selfHealing.recoveryAttempts}</span>
              <span className="metric-label">Recovery Attempts</span>
            </div>
          </div>
        </div>

        {/* Cost Metrics */}
        <div className="cost-card">
          <h3>Cost Analysis</h3>
          <div className="cost-metrics">
            <div className="cost-item">
              <span className="label">Total Cost:</span>
              <span className="value">${holonState.costMetrics.totalCost.toFixed(2)}</span>
            </div>
            <div className="cost-item">
              <span className="label">Avg Cost/Test:</span>
              <span className="value">${holonState.costMetrics.averageCostPerTest.toFixed(2)}</span>
            </div>
          </div>
          <div className="cost-breakdown">
            <h4>Cost by Layer</h4>
            {Object.entries(holonState.costMetrics.costByLayer).map(([layer, cost]) => (
              <div key={layer} className="cost-layer">
                <span className="layer-name">{layer}</span>
                <span className="layer-cost">${cost.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Test Suite */}
        {holonState.currentTestSuite && (
          <div className="suite-card">
            <h3>Current Test Suite</h3>
            <div className="suite-info">
              <div className="suite-header">
                <span className="suite-name">{holonState.currentTestSuite.name}</span>
                <span className={`suite-status status-${getStatusColor(holonState.currentTestSuite.status)}`}>
                  {holonState.currentTestSuite.status}
                </span>
              </div>
              <div className="suite-metrics">
                <div className="metric">
                  <span className="metric-value">{holonState.currentTestSuite.passedTests}</span>
                  <span className="metric-label">Passed</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{holonState.currentTestSuite.failedTests}</span>
                  <span className="metric-label">Failed</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{holonState.currentTestSuite.skippedTests}</span>
                  <span className="metric-label">Skipped</span>
                </div>
                <div className="metric">
                  <span className="metric-value">${holonState.currentTestSuite.cost.toFixed(2)}</span>
                  <span className="metric-label">Cost</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Predictive Analysis */}
        <div className="predictive-card">
          <h3>Predictive Analysis</h3>
          <div className="predictive-content">
            <div className="risk-assessment">
              <h4>Risk Assessment</h4>
              {Object.entries(holonState.predictiveAnalysis.riskAssessment).map(([component, risk]) => (
                <div key={component} className="risk-item">
                  <span className="component-name">{component}</span>
                  <div className="risk-bar">
                    <div 
                      className="risk-fill" 
                      style={{ 
                        width: `${risk * 100}%`,
                        backgroundColor: risk > 0.7 ? '#ef4444' : risk > 0.4 ? '#f59e0b' : '#10b981'
                      }}
                    />
                  </div>
                  <span className="risk-value">{(risk * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
            
            <div className="optimization-recommendations">
              <h4>Optimization Recommendations</h4>
              <ul>
                {holonState.predictiveAnalysis.optimizationRecommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Test Results */}
        <div className="results-card">
          <h3>Recent Test Results</h3>
          <div className="test-results">
            {holonState.testHistory.slice(-10).reverse().map((test) => (
              <div key={test.id} className="test-result">
                <div className="test-header">
                  <span className="test-name">{test.name}</span>
                  <span className={`test-status status-${test.status.toLowerCase()}`}>
                    {test.status}
                  </span>
                </div>
                <div className="test-details">
                  <span className={`test-layer layer-${getLayerColor(test.layer)}`}>
                    {test.layer}
                  </span>
                  <span className={`test-priority priority-${getPriorityColor(test.priority)}`}>
                    {test.priority}
                  </span>
                  <span className="test-duration">{test.duration}ms</span>
                  <span className="test-cost">${test.cost.toFixed(2)}</span>
                </div>
                {test.error && (
                  <div className="test-error">{test.error}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Manager Integration */}
        <div className="managers-card">
          <h3>Manager Integration</h3>
          <div className="managers-list">
            {holonState.managerIntegration.activeManagers.map((manager) => (
              <div key={manager} className="manager-item">
                <span className="manager-name">{manager}</span>
                <span className="manager-load">
                  Load: {holonState.managerIntegration.loadDistribution[manager] || 0}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CI/CD Integration */}
        <div className="cicd-card">
          <h3>🔗 CI/CD Integration</h3>
          <div className="cicd-content">
            <div className="cicd-status">
              <div className="status-item">
                <span className="label">Integration:</span>
                <span className={`value ${holonState.cicdIntegration.enabled ? 'status-green' : 'status-red'}`}>
                  {holonState.cicdIntegration.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="status-item">
                <span className="label">Standards:</span>
                <span className={`value ${holonState.cicdIntegration.professionalStandards.enforced ? 'status-green' : 'status-red'}`}>
                  {holonState.cicdIntegration.professionalStandards.enforced ? 'Enforced' : 'Not Enforced'}
                </span>
              </div>
              <div className="status-item">
                <span className="label">Compliance:</span>
                <span className="value">{holonState.cicdIntegration.professionalStandards.complianceLevel}</span>
              </div>
            </div>
            
            <div className="cicd-protocols">
              <h4>Testing Protocols</h4>
              <div className="protocols-grid">
                {Object.entries(holonState.cicdIntegration.protocols).map(([protocol, enabled]) => (
                  <div key={protocol} className="protocol-item">
                    <span className="protocol-name">{protocol.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className={`protocol-status ${enabled ? 'enabled' : 'disabled'}`}>
                      {enabled ? '✅' : '❌'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cicd-optimization">
              <h4>Efficiency Optimization</h4>
              <div className="optimization-grid">
                {Object.entries(holonState.cicdIntegration.efficiencyOptimization).map(([optimization, enabled]) => (
                  <div key={optimization} className="optimization-item">
                    <span className="optimization-name">{optimization.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className={`optimization-status ${enabled ? 'enabled' : 'disabled'}`}>
                      {enabled ? '✅' : '❌'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cicd-improvement">
              <h4>Continuous Improvement</h4>
              <div className="improvement-grid">
                {Object.entries(holonState.cicdIntegration.continuousImprovement).map(([improvement, enabled]) => (
                  <div key={improvement} className="improvement-item">
                    <span className="improvement-name">{improvement.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className={`improvement-status ${enabled ? 'enabled' : 'disabled'}`}>
                      {enabled ? '✅' : '❌'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed Panel */}
        <div className="activity-feed-card">
          <h3>AI Thought Process & Activity Feed</h3>
          <div className="activity-feed-list">
            {activityLog.length === 0 ? (
              <div className="activity-feed-empty">No activity yet.</div>
            ) : (
              activityLog.slice().reverse().map((entry, idx) => (
                <div key={idx} className="activity-feed-entry">
                  <span className="activity-feed-timestamp">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                  <span className="activity-feed-message">{entry.message}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Features Holon Metrics */}
        {featuresMetrics && (
          <div className="metric-card">
            <h3>Features Holon Metrics</h3>
            <div className="metrics-grid">
              <div className="metric">
                <span className="metric-label">Total Features</span>
                <span className="metric-value">{featuresMetrics.totalFeatures}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Active Features</span>
                <span className="metric-value">{featuresMetrics.activeFeatures}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Average Quality</span>
                <span className="metric-value">{featuresMetrics.averageQuality}%</span>
              </div>
              <div className="metric">
                <span className="metric-label">On-Time Delivery</span>
                <span className="metric-value">{featuresMetrics.onTimeDelivery}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Product Holon Metrics */}
        {productMetrics && (
          <div className="metric-card">
            <h3>Product Holon Metrics</h3>
            <div className="metrics-grid">
              <div className="metric">
                <span className="metric-label">Total Requirements</span>
                <span className="metric-value">{productMetrics.totalRequirements}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Total Initiatives</span>
                <span className="metric-value">{productMetrics.totalInitiatives}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Overall Health</span>
                <span className="metric-value">{productMetrics.overallHealth}%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Compliance Rate</span>
                <span className="metric-value">{productMetrics.complianceRate}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestingDashboard; 
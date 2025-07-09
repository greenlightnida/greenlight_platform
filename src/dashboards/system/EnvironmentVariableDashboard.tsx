import React, { useState, useEffect } from 'react';
import './EnvironmentVariableDashboard.css';

interface EnvironmentVariable {
  _name: string;
  value: string | undefined;
  type: string;
  required: boolean;
  description: string;
  category: string;
}

interface VariableError {
  id: string;
  variableName: string;
  type: string;
  severity: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

interface VariableRecommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  impact: string;
  effort: string;
  variables: string[];
  timestamp: Date;
  implemented: boolean;
}

interface EnvironmentAlert {
  id: string;
  type: string;
  severity: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  resolved: boolean;
}

interface EnvironmentComplianceReport {
  id: string;
  timestamp: Date;
  compliance: number;
  violations: any[];
  recommendations: string[];
}

const EnvironmentVariableDashboard: React.FC = () => {
  const [variables, setVariables] = useState<EnvironmentVariable[]>([]);
  const [errors, setErrors] = useState<VariableError[]>([]);
  const [recommendations, setRecommendations] = useState<VariableRecommendation[]>([]);
  const [alerts, setAlerts] = useState<EnvironmentAlert[]>([]);
  const [complianceReports, setComplianceReports] = useState<EnvironmentComplianceReport[]>([]);
  const [statistics, setStatistics] = useState<any>({});
  const [governanceStats, setGovernanceStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
    return () => {
      // Cleanup
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data for now
      setVariables([]);
      setErrors([]);
      setRecommendations([]);
      setAlerts([]);
      setComplianceReports([]);
      setStatistics({});
      setGovernanceStats({});
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async () => {
    try {
      // Mock scan
      console.log('Performing environment variable scan...');
    } catch (error) {
      console.error('Error performing scan:', error);
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      // Mock acknowledge
      console.log('Acknowledging alert:', alertId);
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      // Mock resolve
      console.log('Resolving alert:', alertId);
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const handleImplementRecommendation = async (recommendationId: string) => {
    try {
      // Mock implement
      console.log('Implementing recommendation:', recommendationId);
    } catch (error) {
      console.error('Error implementing recommendation:', error);
    }
  };

  if (loading) {
    return (
      <div className="env-dashboard">
        <div className="env-dashboard-header">
          <h1>Environment Variable Governance</h1>
          <div className="env-dashboard-actions">
            <button onClick={handleScan} className="btn btn-primary">
              Perform Scan
            </button>
          </div>
        </div>
        <div className="env-dashboard-content">
          <div className="loading">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="env-dashboard">
      <div className="env-dashboard-header">
        <h1>Environment Variable Governance</h1>
        <div className="env-dashboard-actions">
          <button onClick={handleScan} className="btn btn-primary">
            Perform Scan
          </button>
        </div>
      </div>

      <div className="env-dashboard-content">
        <div className="env-dashboard-tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'variables' ? 'active' : ''}`}
            onClick={() => setActiveTab('variables')}
          >
            Variables ({variables.length})
          </button>
          <button
            className={`tab ${activeTab === 'errors' ? 'active' : ''}`}
            onClick={() => setActiveTab('errors')}
          >
            Errors ({errors.length})
          </button>
          <button
            className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            Recommendations ({recommendations.length})
          </button>
          <button
            className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            Alerts ({alerts.length})
          </button>
          <button
            className={`tab ${activeTab === 'compliance' ? 'active' : ''}`}
            onClick={() => setActiveTab('compliance')}
          >
            Compliance
          </button>
        </div>

        <div className="env-dashboard-panel">
          {activeTab === 'overview' && (
            <div className="overview-panel">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Variables</h3>
                  <p className="stat-value">{statistics.totalVariables || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Required Variables</h3>
                  <p className="stat-value">{statistics.requiredVariables || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Optional Variables</h3>
                  <p className="stat-value">{statistics.optionalVariables || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Unused Variables</h3>
                  <p className="stat-value">{statistics.unusedVariables || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Error Count</h3>
                  <p className="stat-value error">{statistics.errorCount || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Last Scan</h3>
                  <p className="stat-value">
                    {statistics.lastScan ? new Date(statistics.lastScan).toLocaleString() : 'Never'}
                  </p>
                </div>
              </div>

              <div className="governance-stats">
                <h3>Governance Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <h4>Active Alerts</h4>
                    <p className="stat-value">{governanceStats.activeAlerts || 0}</p>
                  </div>
                  <div className="stat-card">
                    <h4>Policy Violations</h4>
                    <p className="stat-value">{governanceStats.policyViolations || 0}</p>
                  </div>
                  <div className="stat-card">
                    <h4>Compliance Score</h4>
                    <p className="stat-value">{governanceStats.complianceScore || 0}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'variables' && (
            <div className="variables-panel">
              <div className="variables-list">
                {variables.length === 0 ? (
                  <p>No environment variables found.</p>
                ) : (
                  variables.map((variable) => (
                    <div key={variable._name} className="variable-item">
                      <div className="variable-header">
                        <h4>{variable._name}</h4>
                        <span className={`variable-type ${variable.type}`}>{variable.type}</span>
                        {variable.required && <span className="required-badge">Required</span>}
                      </div>
                      <p className="variable-description">{variable.description}</p>
                      <div className="variable-details">
                        <span className="variable-category">{variable.category}</span>
                        <span className="variable-value">
                          {variable.value ? 'Set' : 'Not Set'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'errors' && (
            <div className="errors-panel">
              <div className="errors-list">
                {errors.length === 0 ? (
                  <p>No errors found.</p>
                ) : (
                  errors.map((error) => (
                    <div key={error.id} className={`error-item ${error.severity}`}>
                      <div className="error-header">
                        <h4>{error.variableName}</h4>
                        <span className={`severity-badge ${error.severity}`}>
                          {error.severity}
                        </span>
                      </div>
                      <p className="error-message">{error.message}</p>
                      <div className="error-meta">
                        <span className="error-type">{error.type}</span>
                        <span className="error-timestamp">
                          {new Date(error.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="recommendations-panel">
              <div className="recommendations-list">
                {recommendations.length === 0 ? (
                  <p>No recommendations found.</p>
                ) : (
                  recommendations.map((recommendation) => (
                    <div key={recommendation.id} className="recommendation-item">
                      <div className="recommendation-header">
                        <h4>{recommendation.title}</h4>
                        <div className="recommendation-badges">
                          <span className={`impact-badge ${recommendation.impact}`}>
                            {recommendation.impact}
                          </span>
                          <span className={`effort-badge ${recommendation.effort}`}>
                            {recommendation.effort}
                          </span>
                        </div>
                      </div>
                      <p className="recommendation-description">{recommendation.description}</p>
                      <div className="recommendation-actions">
                        <button
                          onClick={() => handleImplementRecommendation(recommendation.id)}
                          className="btn btn-secondary"
                          disabled={recommendation.implemented}
                        >
                          {recommendation.implemented ? 'Implemented' : 'Implement'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="alerts-panel">
              <div className="alerts-list">
                {alerts.length === 0 ? (
                  <p>No alerts found.</p>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className={`alert-item ${alert.severity}`}>
                      <div className="alert-header">
                        <h4>{alert.type}</h4>
                        <span className={`severity-badge ${alert.severity}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="alert-message">{alert.message}</p>
                      <div className="alert-actions">
                        {!alert.acknowledged && (
                          <button
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                            className="btn btn-secondary"
                          >
                            Acknowledge
                          </button>
                        )}
                        {!alert.resolved && (
                          <button
                            onClick={() => handleResolveAlert(alert.id)}
                            className="btn btn-primary"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="compliance-panel">
              <div className="compliance-reports">
                {complianceReports.length === 0 ? (
                  <p>No compliance reports found.</p>
                ) : (
                  complianceReports.map((report) => (
                    <div key={report.id} className="compliance-report">
                      <div className="report-header">
                        <h4>Compliance Report</h4>
                        <span className="compliance-score">{report.compliance}%</span>
                      </div>
                      <div className="report-details">
                        <p>Generated: {new Date(report.timestamp).toLocaleString()}</p>
                        <p>Violations: {report.violations.length}</p>
                        <p>Recommendations: {report.recommendations.length}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnvironmentVariableDashboard; 
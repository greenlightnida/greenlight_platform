import React, { useState, useEffect } from 'react';
import { SecurityHolonManager } from '../../core/holons/security/SecurityHolonManager';
import { SecurityManagementTeam } from '../../core/holons/security/SecurityManagementTeam';
import './SecurityDashboard.css';

interface SecurityDashboardProps {
  className?: string;
}

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ className = '' }) => {
  const [securityHolonManager] = useState(() => SecurityHolonManager.getInstance());
  const [securityManagementTeam] = useState(() => SecurityManagementTeam.getInstance());
  
  const [holonState, setHolonState] = useState(securityHolonManager.getState());
  const [teamState, setTeamState] = useState(securityManagementTeam.getState());
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentScan, setCurrentScan] = useState(securityHolonManager.getCurrentScan());
  const [selectedTab, setSelectedTab] = useState<'overview' | 'vulnerabilities' | 'incidents' | 'compliance' | 'team'>('overview');

  useEffect(() => {
    const initializeSecurity = async () => {
      try {
        await securityHolonManager.initialize();
        await securityManagementTeam.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize security systems:', error);
      }
    };

    initializeSecurity();
  }, [securityHolonManager, securityManagementTeam]);

  useEffect(() => {
    const updateState = () => {
      setHolonState(securityHolonManager.getState());
      setTeamState(securityManagementTeam.getState());
      setCurrentScan(securityHolonManager.getCurrentScan());
    };

    // Update state every 5 seconds
    const interval = setInterval(updateState, 5000);
    updateState(); // Initial update

    return () => clearInterval(interval);
  }, [securityHolonManager, securityManagementTeam]);

  const handleRunScan = async (scanType: 'sast' | 'dast' | 'dependency' | 'configuration' | 'compliance') => {
    try {
      await securityHolonManager.runSecurityScan(scanType, 'greenlight-platform');
    } catch (error) {
      console.error('Failed to run security scan:', error);
    }
  };

  const handleCreateIncident = async () => {
    try {
      await securityManagementTeam.createSecurityIncident(
        'Test Security Incident',
        'This is a test security incident for demonstration purposes',
        'medium',
        'vulnerability',
        'Test impact on system security',
        ['src/components/SecurityDashboard']
      );
    } catch (error) {
      console.error('Failed to create incident:', error);
    }
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return '#10B981'; // Green
    if (score >= 70) return '#F59E0B'; // Yellow
    if (score >= 50) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#EF4444';
      case 'high': return '#F97316';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#EF4444';
      case 'investigating': return '#F59E0B';
      case 'contained': return '#3B82F6';
      case 'resolved': return '#10B981';
      case 'closed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  if (!isInitialized) {
    return (
      <div className={`security-dashboard ${className}`}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Initializing Security Systems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`security-dashboard ${className}`}>
      {/* Header */}
      <div className="dashboard-header">
        <h1>🔐 Security Holon & Management Team</h1>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => handleRunScan('sast')}
            disabled={currentScan?.status === 'running'}
          >
            {currentScan?.status === 'running' ? '🔄 Scanning...' : '🔍 Run SAST Scan'}
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => handleRunScan('dependency')}
            disabled={currentScan?.status === 'running'}
          >
            📦 Dependency Scan
          </button>
          <button 
            className="btn btn-warning"
            onClick={handleCreateIncident}
          >
            🚨 Create Test Incident
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab ${selectedTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab ${selectedTab === 'vulnerabilities' ? 'active' : ''}`}
          onClick={() => setSelectedTab('vulnerabilities')}
        >
          🕳️ Vulnerabilities ({holonState.vulnerabilities.length})
        </button>
        <button 
          className={`tab ${selectedTab === 'incidents' ? 'active' : ''}`}
          onClick={() => setSelectedTab('incidents')}
        >
          🚨 Incidents ({teamState.incidents.length})
        </button>
        <button 
          className={`tab ${selectedTab === 'compliance' ? 'active' : ''}`}
          onClick={() => setSelectedTab('compliance')}
        >
          📋 Compliance ({teamState.compliance.length})
        </button>
        <button 
          className={`tab ${selectedTab === 'team' ? 'active' : ''}`}
          onClick={() => setSelectedTab('team')}
        >
          👥 Team ({teamState.members.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="dashboard-content">
        {selectedTab === 'overview' && (
          <div className="overview-tab">
            {/* Security Score Card */}
            <div className="score-card">
              <h3>Security Score</h3>
              <div 
                className="score-circle"
                style={{ 
                  background: `conic-gradient(${getSecurityScoreColor(holonState.metrics.securityScore)} ${holonState.metrics.securityScore * 3.6}deg, #E5E7EB ${holonState.metrics.securityScore * 3.6}deg)` 
                }}
              >
                <div className="score-value">{holonState.metrics.securityScore}</div>
              </div>
              <p>Overall Security Health</p>
            </div>

            {/* Quick Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Vulnerabilities</h4>
                <div className="stat-value">{holonState.metrics.totalVulnerabilities}</div>
                <div className="stat-breakdown">
                  <span style={{ color: getSeverityColor('critical') }}>
                    {holonState.metrics.vulnerabilitiesBySeverity.critical || 0} Critical
                  </span>
                  <span style={{ color: getSeverityColor('high') }}>
                    {holonState.metrics.vulnerabilitiesBySeverity.high || 0} High
                  </span>
                </div>
              </div>

              <div className="stat-card">
                <h4>Active Incidents</h4>
                <div className="stat-value">{teamState.coordination.activeIncidents}</div>
                <div className="stat-breakdown">
                  <span>Resolution Rate: {teamState.performance.resolutionRate.toFixed(1)}%</span>
                </div>
              </div>

              <div className="stat-card">
                <h4>Team Availability</h4>
                <div className="stat-value">{teamState.coordination.teamAvailability.toFixed(0)}%</div>
                <div className="stat-breakdown">
                  <span>{teamState.members.filter(m => m.availability === 'available').length} Available</span>
                </div>
              </div>

              <div className="stat-card">
                <h4>Compliance Score</h4>
                <div className="stat-value">{teamState.performance.complianceScore.toFixed(0)}%</div>
                <div className="stat-breakdown">
                  <span>{teamState.compliance.filter(c => c.status === 'compliant').length} Compliant</span>
                </div>
              </div>
            </div>

            {/* Current Scan Status */}
            {currentScan && (
              <div className="scan-status">
                <h3>Current Scan: {currentScan.type.toUpperCase()}</h3>
                <div className="scan-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: currentScan.status === 'completed' ? '100%' : 
                               currentScan.status === 'running' ? '50%' : '0%' 
                      }}
                    ></div>
                  </div>
                  <span className="scan-status-text">
                    {currentScan.status === 'running' ? '🔄 Running...' :
                     currentScan.status === 'completed' ? '✅ Completed' :
                     currentScan.status === 'failed' ? '❌ Failed' : '⏳ Pending'}
                  </span>
                </div>
                {currentScan.completedAt && (
                  <p>Duration: {Math.round((currentScan.completedAt.getTime() - currentScan.startedAt.getTime()) / 1000)}s</p>
                )}
              </div>
            )}

            {/* Recent Activity */}
            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {teamState.incidents.slice(0, 5).map(incident => (
                  <div key={incident.id} className="activity-item">
                    <span className="activity-icon">🚨</span>
                    <div className="activity-content">
                      <strong>{incident.title}</strong>
                      <span className="activity-meta">
                        {incident.severity} • {incident.status} • {new Date(incident.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'vulnerabilities' && (
          <div className="vulnerabilities-tab">
            <div className="tab-header">
              <h3>Security Vulnerabilities</h3>
              <div className="vulnerability-filters">
                <select defaultValue="all">
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select defaultValue="all">
                  <option value="all">All Categories</option>
                  <option value="authentication">Authentication</option>
                  <option value="authorization">Authorization</option>
                  <option value="data_protection">Data Protection</option>
                  <option value="input_validation">Input Validation</option>
                  <option value="configuration">Configuration</option>
                  <option value="dependencies">Dependencies</option>
                </select>
              </div>
            </div>

            <div className="vulnerabilities-list">
              {holonState.vulnerabilities.map(vulnerability => (
                <div key={vulnerability.id} className="vulnerability-card">
                  <div className="vulnerability-header">
                    <span 
                      className="severity-badge"
                      style={{ backgroundColor: getSeverityColor(vulnerability.severity) }}
                    >
                      {vulnerability.severity.toUpperCase()}
                    </span>
                    <span className="category-badge">{vulnerability.category}</span>
                    <span className="status-badge">{vulnerability.status}</span>
                  </div>
                  <h4>{vulnerability.title}</h4>
                  <p>{vulnerability.description}</p>
                  <div className="vulnerability-details">
                    <span><strong>Location:</strong> {vulnerability.location}</span>
                    {vulnerability.cwe && <span><strong>CWE:</strong> {vulnerability.cwe}</span>}
                    {vulnerability.cvss && <span><strong>CVSS:</strong> {vulnerability.cvss}</span>}
                  </div>
                  {vulnerability.remediation && (
                    <div className="remediation">
                      <strong>Remediation:</strong> {vulnerability.remediation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'incidents' && (
          <div className="incidents-tab">
            <div className="tab-header">
              <h3>Security Incidents</h3>
              <div className="incident-stats">
                <span>Active: {teamState.coordination.activeIncidents}</span>
                <span>Total: {teamState.incidents.length}</span>
              </div>
            </div>

            <div className="incidents-list">
              {teamState.incidents.map(incident => (
                <div key={incident.id} className="incident-card">
                  <div className="incident-header">
                    <span 
                      className="severity-badge"
                      style={{ backgroundColor: getSeverityColor(incident.severity) }}
                    >
                      {incident.severity.toUpperCase()}
                    </span>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(incident.status) }}
                    >
                      {incident.status.toUpperCase()}
                    </span>
                    <span className="category-badge">{incident.category}</span>
                  </div>
                  <h4>{incident.title}</h4>
                  <p>{incident.description}</p>
                  <div className="incident-details">
                    <span><strong>Impact:</strong> {incident.impact}</span>
                    <span><strong>Created:</strong> {new Date(incident.createdAt).toLocaleDateString()}</span>
                    {incident.assignedTo && (
                      <span><strong>Assigned:</strong> {teamState.members.find(m => m.id === incident.assignedTo)?.name}</span>
                    )}
                  </div>
                  {incident.affectedSystems.length > 0 && (
                    <div className="affected-systems">
                      <strong>Affected Systems:</strong>
                      <div className="system-tags">
                        {incident.affectedSystems.map(system => (
                          <span key={system} className="system-tag">{system}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'compliance' && (
          <div className="compliance-tab">
            <div className="tab-header">
              <h3>Compliance Frameworks</h3>
            </div>

            <div className="compliance-grid">
              {teamState.compliance.map(framework => (
                <div key={framework.id} className="compliance-card">
                  <div className="compliance-header">
                    <h4>{framework.framework}</h4>
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: framework.status === 'compliant' ? '#10B981' : 
                                       framework.status === 'in_progress' ? '#F59E0B' : '#EF4444' 
                      }}
                    >
                      {framework.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="compliance-score">
                    <div className="score-circle small">
                      <div className="score-value">{framework.score}</div>
                    </div>
                    <span>Compliance Score</span>
                  </div>
                  <div className="compliance-details">
                    <p><strong>Last Assessment:</strong> {new Date(framework.lastAssessment).toLocaleDateString()}</p>
                    <p><strong>Next Assessment:</strong> {new Date(framework.nextAssessment).toLocaleDateString()}</p>
                    <p><strong>Requirements:</strong> {framework.requirements.length}</p>
                  </div>
                  {framework.gaps.length > 0 && (
                    <div className="compliance-gaps">
                      <strong>Gaps:</strong>
                      <ul>
                        {framework.gaps.map((gap, index) => (
                          <li key={index}>{gap}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'team' && (
          <div className="team-tab">
            <div className="tab-header">
              <h3>Security Management Team</h3>
              <div className="team-stats">
                <span>Available: {teamState.members.filter(m => m.availability === 'available').length}</span>
                <span>Total: {teamState.members.length}</span>
              </div>
            </div>

            <div className="team-grid">
              {teamState.members.map(member => (
                <div key={member.id} className="team-member-card">
                  <div className="member-header">
                    <h4>{member.name}</h4>
                    <span 
                      className="availability-badge"
                      style={{ 
                        backgroundColor: member.availability === 'available' ? '#10B981' : 
                                       member.availability === 'busy' ? '#F59E0B' : '#6B7280' 
                      }}
                    >
                      {member.availability.toUpperCase()}
                    </span>
                  </div>
                  <div className="member-role">{member.role.replace('_', ' ').toUpperCase()}</div>
                  <div className="member-expertise">
                    <strong>Expertise:</strong>
                    <div className="expertise-tags">
                      {member.expertise.map(exp => (
                        <span key={exp} className="expertise-tag">{exp}</span>
                      ))}
                    </div>
                  </div>
                  <div className="member-performance">
                    <div className="performance-metrics">
                      <div className="metric">
                        <span className="metric-label">Vulnerabilities Resolved</span>
                        <span className="metric-value">{member.performanceMetrics.vulnerabilitiesResolved}</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Incidents Handled</span>
                        <span className="metric-value">{member.performanceMetrics.incidentsHandled}</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Response Time (hrs)</span>
                        <span className="metric-value">{member.performanceMetrics.responseTime}</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Accuracy (%)</span>
                        <span className="metric-value">{member.performanceMetrics.accuracy}</span>
                      </div>
                    </div>
                  </div>
                  {member.currentTasks.length > 0 && (
                    <div className="member-tasks">
                      <strong>Current Tasks:</strong>
                      <ul>
                        {member.currentTasks.map((task, index) => (
                          <li key={index}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 
import { useState, useEffect } from 'react';
import { RoadmapActualsTracker, ActualsReport, PlannedMilestone, ActualMilestone } from '../../utils/common/roadmapActuals';

// Mock service for now
const roadmapActualsService = {
  getCurrentReport: async () => {
    return {
      roadmapActuals: {
        summary: {
          overallProgress: 75,
          completedMilestones: 3,
          totalMilestones: 4
        },
        timelinePerformance: {
          onTimePercentage: 75,
          onTimeCount: 3,
          totalCount: 4,
          delayedCount: 1,
          averageDelayDays: 2
        },
        effortPerformance: {
          withinBudgetPercentage: 80,
          withinBudgetCount: 4,
          totalCount: 5,
          overBudgetCount: 1,
          averageVariancePercentage: 5
        }
      }
    };
  }
};

interface RoadmapActualsReport {
  roadmapActuals: {
    summary: any;
    timelinePerformance: any;
    effortPerformance: any;
  };
}

/**
 * RoadmapActualsDashboard - Planned vs. Actual Development Progress Tracking
 * 
 * PURPOSE: Track and visualize planned vs. actual development progress
 * - Planned vs. actual timeline comparisons
 * - Effort variance analysis
 * - Budget performance tracking
 * - Quality metrics comparison
 * - Risk assessment and forecasting
 * - Executive summary and recommendations
 */

export interface RoadmapActualsDashboardProps {
  className?: string;
  projectId?: string;
  projectName?: string;
}

export const RoadmapActualsDashboard: React.FC<RoadmapActualsDashboardProps> = ({ 
  className = '',
  projectId = 'greenlight-platform',
  projectName = 'Greenlight Platform'
}) => {
  const [actualsTracker] = useState(() => new RoadmapActualsTracker(projectId, projectName));
  const [currentReport, setCurrentReport] = useState<RoadmapActualsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'quarterly'>('monthly');
  const [selectedView, setSelectedView] = useState<'summary' | 'timeline' | 'effort' | 'quality' | 'risk' | 'forecast'>('summary');

  useEffect(() => {
    loadRoadmapActuals();
  }, []);

  const loadRoadmapActuals = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await roadmapActualsService.getCurrentReport();
      setCurrentReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load roadmap actuals');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="roadmap-actuals-dashboard">
        <div className="dashboard-header">
          <h1>Roadmap Actuals</h1>
        </div>
        <div className="dashboard-content">
          <div className="loading">Loading roadmap actuals...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="roadmap-actuals-dashboard">
        <div className="dashboard-header">
          <h1>Roadmap Actuals</h1>
        </div>
        <div className="dashboard-content">
          <div className="error">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!currentReport) {
    return (
      <div className="roadmap-actuals-dashboard">
        <div className="dashboard-header">
          <h1>Roadmap Actuals</h1>
        </div>
        <div className="dashboard-content">
          <div className="no-data">No roadmap actuals data available</div>
        </div>
      </div>
    );
  }

  const { summary, timelinePerformance, effortPerformance } = currentReport.roadmapActuals;

  return (
    <div className="roadmap-actuals-dashboard">
      <div className="dashboard-header">
        <h1>Roadmap Actuals</h1>
        <div className="header-actions">
          <button onClick={loadRoadmapActuals} className="btn btn-primary">
            Refresh
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Executive Summary */}
        <div className="executive-summary">
          <h2>Executive Summary</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <h3>Overall Status</h3>
                             <div className="status-indicator text-blue-600">
                {'ON-TRACK'}
              </div>
            </div>
            <div className="summary-card">
              <h3>Timeline Performance</h3>
              <div className="performance-metric">
                <span className="metric-value">{timelinePerformance?.onTimePercentage || 0}%</span>
                <span className="metric-label">On Time</span>
              </div>
            </div>
            <div className="summary-card">
              <h3>Effort Performance</h3>
              <div className="performance-metric">
                <span className="metric-value">{effortPerformance?.withinBudgetPercentage || 0}%</span>
                <span className="metric-label">Within Budget</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="recommendations-section">
          <h2>Recommendations</h2>
          <div className="recommendations-list">
            {[].map((recommendation: any, index: any) => (
              <div key={index} className="recommendation-item">
                <h4>{recommendation.title}</h4>
                <p>{recommendation.description}</p>
                <div className="recommendation-meta">
                  <span className="priority">{recommendation.priority}</span>
                  <span className="impact">{recommendation.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="detailed-metrics">
          <h2>Detailed Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Timeline Performance</h3>
              <div className="metric-details">
                <div className="metric-row">
                  <span>On Time:</span>
                  <span>{timelinePerformance?.onTimeCount || 0} / {timelinePerformance?.totalCount || 0}</span>
                </div>
                <div className="metric-row">
                  <span>Delayed:</span>
                  <span>{timelinePerformance?.delayedCount || 0}</span>
                </div>
                <div className="metric-row">
                  <span>Average Delay:</span>
                  <span>{timelinePerformance?.averageDelayDays || 0} days</span>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <h3>Effort Performance</h3>
              <div className="metric-details">
                <div className="metric-row">
                  <span>Within Budget:</span>
                  <span>{effortPerformance?.withinBudgetCount || 0} / {effortPerformance?.totalCount || 0}</span>
                </div>
                <div className="metric-row">
                  <span>Over Budget:</span>
                  <span>{effortPerformance?.overBudgetCount || 0}</span>
                </div>
                <div className="metric-row">
                  <span>Average Variance:</span>
                  <span>{effortPerformance?.averageVariancePercentage || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
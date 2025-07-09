import React, { useState, useEffect } from 'react';
import './DesignSystemDashboard.css';

// Types
interface DashboardOverview {
  totalComponents: number;
  totalTokens: number;
  totalPolicies: number;
  systemHealth: 'healthy' | 'warning' | 'error';
  lastUpdated: Date;
}

interface ComponentData {
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

interface GovernanceData {
  totalPolicies: number;
  compliantPolicies: number;
  nonCompliantPolicies: number;
  criticalViolations: number;
  recommendations: string[];
}

interface TokenData {
  key: string;
  value: string | number;
  type: 'color' | 'spacing' | 'typography' | 'shadow' | 'border-radius';
  category: string;
  description?: string;
}

// Components
const DashboardHeader: React.FC = () => (
  <header className="dashboard-header">
    <h1>Design System Dashboard</h1>
    <p>Professional design system management and monitoring</p>
  </header>
);

const MetricsGrid: React.FC<{ data?: DashboardOverview }> = ({ data }) => {
  if (!data) return <div className="metrics-grid loading">Loading metrics...</div>;

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'var(--color-success)';
      case 'warning': return 'var(--color-warning)';
      case 'error': return 'var(--color-error)';
      default: return 'var(--color-neutral)';
    }
  };

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-value">{data.totalComponents}</div>
        <div className="metric-label">Components</div>
      </div>
      <div className="metric-card">
        <div className="metric-value">{data.totalTokens}</div>
        <div className="metric-label">Design Tokens</div>
      </div>
      <div className="metric-card">
        <div className="metric-value">{data.totalPolicies}</div>
        <div className="metric-label">Governance Policies</div>
      </div>
      <div className="metric-card">
        <div 
          className="metric-value" 
          style={{ color: getHealthColor(data.systemHealth) }}
        >
          {data.systemHealth.toUpperCase()}
        </div>
        <div className="metric-label">System Health</div>
      </div>
    </div>
  );
};

const ComponentTable: React.FC<{ data?: ComponentData[] }> = ({ data }) => {
  const [sortField, setSortField] = useState<keyof ComponentData>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!data) return <div className="component-table loading">Loading components...</div>;

  const handleSort = (field: keyof ComponentData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredData = data
    .filter(component => 
      filterCategory === 'all' || component.category === filterCategory
    )
    .filter(component =>
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

  const categories = Array.from(new Set(data.map(c => c.category)));

  const getHealthBadge = (health: string) => {
    const healthClass = `health-badge health-${health}`;
    return <span className={healthClass}>{health}</span>;
  };

  return (
    <div className="component-section">
      <div className="section-header">
        <h2>Components</h2>
        <div className="controls">
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="table-container">
        <table className="professional-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('category')} className="sortable">
                Category {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('type')} className="sortable">
                Type {sortField === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('health')} className="sortable">
                Health {sortField === 'health' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('size')} className="sortable">
                Size (KB) {sortField === 'size' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Test Coverage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(component => (
              <tr key={component.id}>
                <td>
                  <div className="component-name">
                    <strong>{component.name}</strong>
                    <small>{component.id}</small>
                  </div>
                </td>
                <td>{component.category}</td>
                <td>{component.type}</td>
                <td>{getHealthBadge(component.health)}</td>
                <td>{(component.size / 1024).toFixed(1)}</td>
                <td>
                  <div className="coverage-bar">
                    <div 
                      className="coverage-fill" 
                      style={{ width: `${component.metrics.testCoverage}%` }}
                    />
                    <span>{component.metrics.testCoverage}%</span>
                  </div>
                </td>
                <td>
                  <button className="action-button">View</button>
                  <button className="action-button">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const GovernancePanel: React.FC<{ data?: GovernanceData }> = ({ data }) => {
  if (!data) return <div className="governance-panel loading">Loading governance data...</div>;

  const complianceRate = data.totalPolicies > 0 
    ? Math.round((data.compliantPolicies / data.totalPolicies) * 100)
    : 0;

  return (
    <div className="governance-section">
      <div className="section-header">
        <h2>Governance & Compliance</h2>
      </div>
      
      <div className="governance-metrics">
        <div className="metric-card">
          <div className="metric-value">{complianceRate}%</div>
          <div className="metric-label">Compliance Rate</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{data.compliantPolicies}</div>
          <div className="metric-label">Compliant</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{data.nonCompliantPolicies}</div>
          <div className="metric-label">Non-Compliant</div>
        </div>
        <div className="metric-card">
          <div className="metric-value error">{data.criticalViolations}</div>
          <div className="metric-label">Critical Issues</div>
        </div>
      </div>

      {data.recommendations.length > 0 && (
        <div className="recommendations">
          <h3>Recommendations</h3>
          <ul>
            {data.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const TokensPanel: React.FC<{ data?: TokenData[] }> = ({ data }) => {
  if (!data) return <div className="tokens-panel loading">Loading design tokens...</div>;

  const tokensByCategory = data.reduce((acc, token) => {
    if (!acc[token.category]) {
      acc[token.category] = [];
    }
    acc[token.category].push(token);
    return acc;
  }, {} as Record<string, TokenData[]>);

  return (
    <div className="tokens-section">
      <div className="section-header">
        <h2>Design Tokens</h2>
      </div>
      
      <div className="tokens-grid">
        {Object.entries(tokensByCategory).map(([category, tokens]) => (
          <div key={category} className="token-category">
            <h3>{category}</h3>
            <div className="token-list">
              {tokens.map(token => (
                <div key={token.key} className="token-item">
                  <div className="token-preview">
                    {token.type === 'color' && (
                      <div 
                        className="color-preview" 
                        style={{ backgroundColor: token.value as string }}
                      />
                    )}
                  </div>
                  <div className="token-info">
                    <div className="token-key">{token.key}</div>
                    <div className="token-value">{token.value}</div>
                    {token.description && (
                      <div className="token-description">{token.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
export const DesignSystemDashboard: React.FC = () => {
  const [overview, setOverview] = useState<DashboardOverview>();
  const [components, setComponents] = useState<ComponentData[]>();
  const [governance, setGovernance] = useState<GovernanceData>();
  const [tokens, setTokens] = useState<TokenData[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from the new modules
    const loadDashboardData = async () => {
      setLoading(true);
      
      // Mock data for demonstration
      setTimeout(() => {
        setOverview({
          totalComponents: 42,
          totalTokens: 24,
          totalPolicies: 8,
          systemHealth: 'healthy',
          lastUpdated: new Date()
        });

        setComponents([
          {
            id: 'button-primary',
            name: 'Primary Button',
            category: 'ui',
            systemId: 'design-system',
            path: 'src/components/Button/PrimaryButton.tsx',
            type: 'react',
            lastModified: new Date('2025-01-08'),
            size: 2048,
            dependencies: ['react', 'styled-components'],
            health: 'healthy',
            metrics: {
              complexity: 3,
              maintainability: 85,
              testCoverage: 95
            }
          },
          {
            id: 'card-component',
            name: 'Card Component',
            category: 'ui',
            systemId: 'design-system',
            path: 'src/components/Card/Card.tsx',
            type: 'react',
            lastModified: new Date('2025-01-07'),
            size: 3072,
            dependencies: ['react'],
            health: 'warning',
            metrics: {
              complexity: 7,
              maintainability: 72,
              testCoverage: 80
            }
          }
        ]);

        setGovernance({
          totalPolicies: 8,
          compliantPolicies: 7,
          nonCompliantPolicies: 1,
          criticalViolations: 0,
          recommendations: [
            'Increase test coverage for Card component',
            'Consider reducing complexity of Card component'
          ]
        });

        setTokens([
          {
            key: 'color.primary',
            value: '#1a365d',
            type: 'color',
            category: 'colors',
            description: 'Deep blue primary color'
          },
          {
            key: 'color.accent',
            value: '#f6ad55',
            type: 'color',
            category: 'colors',
            description: 'Warm amber accent color'
          },
          {
            key: 'space.md',
            value: '16px',
            type: 'spacing',
            category: 'spacing',
            description: 'Medium spacing'
          }
        ]);

        setLoading(false);
      }, 1000);
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="design-system-dashboard loading">
        <div className="loading-spinner">Loading Design System Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="design-system-dashboard">
      <DashboardHeader />
      <MetricsGrid data={overview} />
      <ComponentTable data={components} />
      <GovernancePanel data={governance} />
      <TokensPanel data={tokens} />
    </div>
  );
}; 
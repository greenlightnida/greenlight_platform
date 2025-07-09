import React, { useState, useEffect } from 'react';

import { InformConsole } from './InformConsole';
import { ObserveConsole } from './ObserveConsole';
import { ResolveConsole } from './ResolveConsole';

interface SystemMasterProps {
  className?: string;
}

export const SystemMaster: React.FC<SystemMasterProps> = ({ className = '' }) => {
  const [activeConsole, setActiveConsole] = useState<'observe' | 'resolve' | 'inform'>('observe');
  const [systemHealth, setSystemHealth] = useState<any>(null);

  useEffect(() => {
    // Fetch system health data
    const fetchSystemHealth = async () => {
      try {
        const response = await fetch('/api/system/health');
        const data = await response.json();
        setSystemHealth(data);
      } catch (error) {
        console.error('Failed to fetch system health:', error);
      }
    };

    fetchSystemHealth();
    const interval = setInterval(fetchSystemHealth, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const consoles = [
    { id: 'observe', label: 'Observe', component: ObserveConsole },
    { id: 'resolve', label: 'Resolve', component: ResolveConsole },
    { id: 'inform', label: 'Inform', component: InformConsole }
  ];

  return (
    <div className={`system-master ${className}`}>
      <div className="system-master-header">
        <h2>System Master Console</h2>
        <div className="system-health-indicator">
          {systemHealth && (
            <span className={`health-status ${systemHealth.status}`}>
              {systemHealth.status.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <div className="console-tabs">
        {consoles.map(({ id, label }) => (
          <button
            key={id}
            className={`console-tab ${activeConsole === id ? 'active' : ''}`}
            onClick={() => setActiveConsole(id as any)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="console-content">
        {consoles.map(({ id, component: Component }) => (
          <div
            key={id}
            className={`console-panel ${activeConsole === id ? 'active' : ''}`}
          >
            <Component systemHealth={systemHealth} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemMaster; 
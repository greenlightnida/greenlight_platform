import React, { useState, useEffect } from 'react';

interface ObserveConsoleProps {
  systemHealth?: any;
}

export const ObserveConsole: React.FC<ObserveConsoleProps> = ({ systemHealth }) => {
  const [observations, setObservations] = useState<any[]>([]);
  const [isObserving, setIsObserving] = useState(false);

  useEffect(() => {
    if (systemHealth) {
      // Process system health data for observations
      const newObservations = [
        {
          id: Date.now(),
          type: 'system_health',
          message: `System health: ${systemHealth.status}`,
          timestamp: new Date(),
          severity: systemHealth.status === 'healthy' ? 'info' : 'warning'
        }
      ];
      setObservations(prev => [...newObservations, ...prev.slice(0, 9)]); // Keep last 10
    }
  }, [systemHealth]);

  const startObserving = () => {
    setIsObserving(true);
    // Simulate continuous observation
    const interval = setInterval(() => {
      const observation = {
        id: Date.now(),
        type: 'continuous',
        message: `System observation at ${new Date().toLocaleTimeString()}`,
        timestamp: new Date(),
        severity: 'info'
      };
      setObservations(prev => [observation, ...prev.slice(0, 9)]);
    }, 5000);

    return () => clearInterval(interval);
  };

  const stopObserving = () => {
    setIsObserving(false);
  };

  return (
    <div className="observe-console">
      <div className="console-header">
        <h3>Observe Console</h3>
        <div className="console-controls">
          {!isObserving ? (
            <button onClick={startObserving} className="btn-start">
              Start Observing
            </button>
          ) : (
            <button onClick={stopObserving} className="btn-stop">
              Stop Observing
            </button>
          )}
        </div>
      </div>

      <div className="observations-list">
        {observations.map((observation) => (
          <div key={observation.id} className={`observation ${observation.severity}`}>
            <div className="observation-header">
              <span className="observation-type">{observation.type}</span>
              <span className="observation-time">
                {observation.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <div className="observation-message">{observation.message}</div>
          </div>
        ))}
        {observations.length === 0 && (
          <div className="no-observations">
            No observations yet. Start observing to see system activity.
          </div>
        )}
      </div>
    </div>
  );
}; 
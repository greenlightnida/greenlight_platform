import React, { useState } from 'react';

interface ResolveConsoleProps {
  systemHealth?: any;
}

export const ResolveConsole: React.FC<ResolveConsoleProps> = ({ systemHealth }) => {
  const [resolutions, setResolutions] = useState<any[]>([]);
  const [newResolution, setNewResolution] = useState('');

  const addResolution = () => {
    if (newResolution.trim()) {
      const resolution = {
        id: Date.now(),
        message: newResolution,
        timestamp: new Date(),
        status: 'pending',
        priority: 'medium'
      };
      setResolutions(prev => [resolution, ...prev]);
      setNewResolution('');
    }
  };

  const updateResolutionStatus = (id: number, status: 'pending' | 'in-progress' | 'resolved') => {
    setResolutions(prev => 
      prev.map(res => 
        res.id === id ? { ...res, status } : res
      )
    );
  };

  const deleteResolution = (id: number) => {
    setResolutions(prev => prev.filter(res => res.id !== id));
  };

  return (
    <div className="resolve-console">
      <div className="console-header">
        <h3>Resolve Console</h3>
        <div className="resolution-input">
          <input
            type="text"
            value={newResolution}
            onChange={(e) => setNewResolution(e.target.value)}
            placeholder="Enter resolution action..."
            onKeyPress={(e) => e.key === 'Enter' && addResolution()}
          />
          <button onClick={addResolution} className="btn-add">
            Add Resolution
          </button>
        </div>
      </div>

      <div className="resolutions-list">
        {resolutions.map((resolution) => (
          <div key={resolution.id} className={`resolution ${resolution.status}`}>
            <div className="resolution-header">
              <span className="resolution-time">
                {resolution.timestamp.toLocaleTimeString()}
              </span>
              <span className={`resolution-status ${resolution.status}`}>
                {resolution.status}
              </span>
            </div>
            <div className="resolution-message">{resolution.message}</div>
            <div className="resolution-actions">
              <select
                value={resolution.status}
                onChange={(e) => updateResolutionStatus(resolution.id, e.target.value as any)}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <button 
                onClick={() => deleteResolution(resolution.id)}
                className="btn-delete"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {resolutions.length === 0 && (
          <div className="no-resolutions">
            No resolutions yet. Add resolution actions to track system improvements.
          </div>
        )}
      </div>

      {systemHealth && systemHealth.status !== 'healthy' && (
        <div className="system-issues">
          <h4>System Issues Detected</h4>
          <p>Current system status: {systemHealth.status}</p>
          <p>Consider adding resolutions for identified issues.</p>
        </div>
      )}
    </div>
  );
}; 
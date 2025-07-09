import React, { useState, useEffect } from 'react';

/**
 * SessionsManager - Work Session Management Interface
 * 
 * PURPOSE: Manage work sessions and collaboration
 * - Session creation and management
 * - Real-time collaboration tools
 * - Session history and analytics
 * - Team coordination
 * - Progress tracking
 */

export interface SessionState {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  participants: string[];
  host: string;
  type: 'development' | 'planning' | 'review' | 'debugging' | 'meeting';
  tags: string[];
  notes: string[];
  files: string[];
}

export interface SessionMetrics {
  totalSessions: number;
  activeSessions: number;
  averageDuration: number;
  participantEngagement: number;
  completionRate: number;
  productivityScore: number;
}

interface SessionsManagerProps {
  className?: string;
}

export const SessionsManager: React.FC<SessionsManagerProps> = ({ 
  className = '' 
}) => {
  const [sessions, setSessions] = useState<SessionState[]>([
    {
      id: '1',
      name: 'System Architecture Review',
      description: 'Review the current system architecture and plan improvements',
      status: 'active',
      startTime: new Date('2024-05-20T10:00:00'),
      participants: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      host: 'John Doe',
      type: 'review',
      tags: ['architecture', 'planning'],
      notes: ['Current architecture needs optimization', 'Consider microservices approach'],
      files: ['architecture-diagram.pdf', 'requirements.md']
    },
    {
      id: '2',
      name: 'Bug Fixing Session',
      description: 'Collaborative debugging session for critical issues',
      status: 'completed',
      startTime: new Date('2024-05-19T14:00:00'),
      endTime: new Date('2024-05-19T16:30:00'),
      participants: ['Jane Smith', 'Mike Johnson'],
      host: 'Jane Smith',
      type: 'debugging',
      tags: ['bugfix', 'critical'],
      notes: ['Authentication bug resolved', 'Performance issue identified'],
      files: ['bug-report.md', 'fix-implementation.ts']
    },
    {
      id: '3',
      name: 'Feature Planning',
      description: 'Plan new features for the upcoming sprint',
      status: 'paused',
      startTime: new Date('2024-05-21T09:00:00'),
      participants: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'],
      host: 'John Doe',
      type: 'planning',
      tags: ['planning', 'features'],
      notes: ['User dashboard feature planned', 'API endpoints defined'],
      files: ['feature-spec.md', 'wireframes.pdf']
    }
  ]);
  const [metrics, setMetrics] = useState<SessionMetrics>({
    totalSessions: 3,
    activeSessions: 1,
    averageDuration: 2.5,
    participantEngagement: 85,
    completionRate: 92,
    productivityScore: 78
  });
  const [currentSession, setCurrentSession] = useState<SessionState | null>(null);

  useEffect(() => {
    // Load sessions data
    loadSessionsData();
  }, []);

  const loadSessionsData = async () => {
// Data loading implementation
  try {
    
    return [];
  } catch (error) {
    console.error('Data loading failed:', error);
    return [];
  }
};
    console.log('Loading sessions data...');
  };

  const handleSessionUpdate = (sessionId: string, updates: Partial<SessionState>) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId ? { ...session, ...updates } : session
    ));
  };

  const handleSessionStatusChange = (sessionId: string, status: SessionState['status']) => {
    const updates: Partial<SessionState> = { status };
    if (status === 'completed' && !sessions.find(s => s.id === sessionId)?.endTime) {
      updates.endTime = new Date();
    }
    handleSessionUpdate(sessionId, updates);
  };

  const createNewSession = () => {
    const newSession: SessionState = {
      id: Date.now().toString(),
      name: 'New Session',
      description: 'Session description',
      status: 'active',
      startTime: new Date(),
      participants: [],
      host: 'Current User',
      type: 'development',
      tags: [],
      notes: [],
      files: []
    };
    setSessions(prev => [...prev, newSession]);
    setCurrentSession(newSession);
  };

  const getStatusColor = (status: SessionState['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: SessionState['type']) => {
    switch (type) {
      case 'development': return 'bg-purple-100 text-purple-800';
      case 'planning': return 'bg-indigo-100 text-indigo-800';
      case 'review': return 'bg-orange-100 text-orange-800';
      case 'debugging': return 'bg-red-100 text-red-800';
      case 'meeting': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (startTime: Date, endTime?: Date) => {
    if (!endTime) return 'Ongoing';
    const duration = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const renderSessionList = () => (
    <div className="space-y-4">
      {sessions.map(session => (
        <div 
          key={session.id} 
          className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer transition-colors ${
            currentSession?.id === session.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          onClick={() => setCurrentSession(session)}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">{session.name}</h3>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                {session.status}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(session.type)}`}>
                {session.type}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{session.description}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-500">Host: {session.host}</span>
              <span className="text-gray-500">{session.participants.length} participants</span>
            </div>
            <span className="text-gray-500">{formatDuration(session.startTime, session.endTime)}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSessionDetails = () => {
    if (!currentSession) return null;

    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{currentSession.name}</h2>
          <div className="flex space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentSession.status)}`}>
              {currentSession.status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(currentSession.type)}`}>
              {currentSession.type}
            </span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4">{currentSession.description}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Session Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Host:</span>
                <span>{currentSession.host}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Start Time:</span>
                <span>{currentSession.startTime.toLocaleString()}</span>
              </div>
              {currentSession.endTime && (
                <div className="flex justify-between">
                  <span className="text-gray-500">End Time:</span>
                  <span>{currentSession.endTime.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Duration:</span>
                <span>{formatDuration(currentSession.startTime, currentSession.endTime)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Participants</h3>
            <div className="space-y-1">
              {currentSession.participants.map(participant => (
                <div key={participant} className="text-sm">
                  <span className={participant === currentSession.host ? 'font-medium' : ''}>
                    {participant}
                  </span>
                  {participant === currentSession.host && (
                    <span className="text-xs text-gray-500 ml-2">(Host)</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {currentSession.notes.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Notes</h3>
            <div className="space-y-1">
              {currentSession.notes.map((note, index) => (
                <div key={index} className="text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  {note}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentSession.files.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Files</h3>
            <div className="space-y-1">
              {currentSession.files.map((file, index) => (
                <div key={index} className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                  📎 {file}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex space-x-2">
          <button
            onClick={() => handleSessionStatusChange(currentSession.id, 'active')}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            Start
          </button>
          <button
            onClick={() => handleSessionStatusChange(currentSession.id, 'paused')}
            className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
          >
            Pause
          </button>
          <button
            onClick={() => handleSessionStatusChange(currentSession.id, 'completed')}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Complete
          </button>
        </div>
      </div>
    );
  };

  const renderMetrics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sessions</h3>
          <p className="text-2xl font-bold text-blue-600">{metrics.totalSessions}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Sessions</h3>
          <p className="text-2xl font-bold text-green-600">{metrics.activeSessions}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Duration</h3>
          <p className="text-2xl font-bold text-purple-600">{metrics.averageDuration}h</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Engagement</h3>
          <p className="text-2xl font-bold text-orange-600">{metrics.participantEngagement}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</h3>
          <p className="text-2xl font-bold text-teal-600">{metrics.completionRate}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Productivity</h3>
          <p className="text-2xl font-bold text-indigo-600">{metrics.productivityScore}%</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`sessions-manager ${className}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sessions Manager</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage work sessions and collaboration</p>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex space-x-4">
        <button
          onClick={createNewSession}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          New Session
        </button>
      </div>

      {/* Metrics Overview */}
      <div className="mb-6">
        {renderMetrics()}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session List */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Sessions</h2>
          {renderSessionList()}
        </div>

        {/* Session Details */}
        <div>
          {currentSession ? (
            renderSessionDetails()
          ) : (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <p className="text-gray-500 text-center">Select a session to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 
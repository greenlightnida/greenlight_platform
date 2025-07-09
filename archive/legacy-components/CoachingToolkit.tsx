import React, { useState, useEffect } from 'react';
import { User } from '../../types';

import { 
  ElevateConsoleProps, 
  ToolkitView, 
  PlayerWithProgress, 
  CohortWithPlayers,
  CoachingStats,
  PlayerFilterState 
} from './types';

/**
 * ElevateConsole - Coaching Toolkit Interface
 * 
 * PURPOSE: Comprehensive coaching platform interface for Top_Bins
 * - Player management and progress tracking
 * - Cohort management and program operations
 * - Media intelligence and analysis
 * - Coaching statistics and insights
 * - Team collaboration and communication
 */

export const ElevateConsole: React.FC<ElevateConsoleProps> = ({ 
  className = '',
  initialView = 'dashboard'
}) => {
  const [currentView, setCurrentView] = useState<ToolkitView>(initialView);
  const [players, setPlayers] = useState<PlayerWithProgress[]>([]);
  const [cohorts, setCohorts] = useState<CohortWithPlayers[]>([]);
  const [stats, setStats] = useState<CoachingStats>({
    totalPlayers: 0,
    activeCohorts: 0,
    totalSessions: 0,
    averageProgress: 0,
    mediaUploads: 0,
    recentActivity: []
  });
  const [playerFilters, setPlayerFilters] = useState<PlayerFilterState>({
    position: 'all',
    status: 'all',
    cohort: 'all',
    searchQuery: ''
  });

  // Mock data initialization
  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Mock players data
    const mockPlayers: PlayerWithProgress[] = [
      {
        id: 'player-1',
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        position: 'forward',
        team: 'Top Bins',
        stats: {},
        progress: {
          id: 'progress-1',
          playerId: 'player-1',
          category: 'overall',
          score: 81,
          date: new Date('2025-01-27T10:00:00'),
          technical: 85,
          tactical: 78,
          physical: 82,
          mental: 80
        },
        status: 'active',
        jerseyNumber: 10,
        cohort: 'senior-varsity',
        lastSession: new Date('2025-01-27T10:00:00'),
        totalSessions: 24,
        mediaCount: 12,
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2025-01-27T10:00:00')
      },
      {
        id: 'player-2',
        name: 'Sarah Chen',
        email: 'sarah.chen@example.com',
        position: 'midfielder',
        team: 'Top Bins',
        stats: {},
        progress: {
          id: 'progress-2',
          playerId: 'player-2',
          category: 'overall',
          score: 84,
          date: new Date('2025-01-27T09:30:00'),
          technical: 88,
          tactical: 85,
          physical: 79,
          mental: 83
        },
        status: 'active',
        jerseyNumber: 8,
        cohort: 'senior-varsity',
        lastSession: new Date('2025-01-27T09:30:00'),
        totalSessions: 26,
        mediaCount: 15,
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2025-01-27T09:30:00')
      },
      {
        id: 'player-3',
        name: 'Marcus Rodriguez',
        email: 'marcus.rodriguez@example.com',
        position: 'defender',
        team: 'Top Bins',
        stats: {},
        progress: {
          id: 'progress-3',
          playerId: 'player-3',
          category: 'overall',
          score: 80,
          date: new Date('2025-01-26T16:00:00'),
          technical: 75,
          tactical: 82,
          physical: 85,
          mental: 78
        },
        status: 'active',
        jerseyNumber: 4,
        cohort: 'junior-varsity',
        lastSession: new Date('2025-01-26T16:00:00'),
        totalSessions: 20,
        mediaCount: 8,
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2025-01-26T16:00:00')
      }
    ];

    // Mock users for coaches
    const mockCoaches: User[] = [
      {
        id: 'coach-1',
        name: 'Coach Smith',
        email: 'coach.smith@example.com',
        domain: 'topbins',
        groups: [],
        permissions: [],
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2025-01-27T10:00:00')
      },
      {
        id: 'coach-2',
        name: 'Coach Johnson',
        email: 'coach.johnson@example.com',
        domain: 'topbins',
        groups: [],
        permissions: [],
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2025-01-27T10:00:00')
      },
      {
        id: 'coach-3',
        name: 'Coach Davis',
        email: 'coach.davis@example.com',
        domain: 'topbins',
        groups: [],
        permissions: [],
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2025-01-27T10:00:00')
      },
      {
        id: 'coach-4',
        name: 'Coach Wilson',
        email: 'coach.wilson@example.com',
        domain: 'topbins',
        groups: [],
        permissions: [],
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2025-01-27T10:00:00')
      }
    ];

    const [coachSmith, coachJohnson, coachDavis, coachWilson] = mockCoaches;

    // Mock cohorts data
    const mockCohorts: CohortWithPlayers[] = [
      {
        id: 'senior-varsity',
        name: 'Senior Varsity',
        description: 'Advanced training program for senior players',
        playerCount: 18,
        activePlayers: 16,
        programStatus: 'active',
        startDate: new Date('2024-09-01'),
        endDate: new Date('2025-05-31'),
        coaches: [coachSmith!, coachJohnson!],
        focusAreas: ['technical', 'tactical', 'leadership'],
        players: mockPlayers,
        status: 'active',
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2025-01-27T10:00:00')
      },
      {
        id: 'junior-varsity',
        name: 'Junior Varsity',
        description: 'Development program for junior players',
        playerCount: 22,
        activePlayers: 20,
        programStatus: 'active',
        startDate: new Date('2024-09-01'),
        endDate: new Date('2025-05-31'),
        coaches: [coachDavis!, coachWilson!],
        focusAreas: ['fundamentals', 'teamwork', 'fitness'],
        players: mockPlayers,
        status: 'active',
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2025-01-27T10:00:00')
      }
    ];

    setPlayers(mockPlayers);
    setCohorts(mockCohorts);
    updateStats(mockPlayers, mockCohorts);
  };

  const updateStats = (currentPlayers: PlayerWithProgress[], currentCohorts: CohortWithPlayers[]) => {
    const totalSessions = currentPlayers.reduce((sum, player) => sum + player.totalSessions, 0);
    const averageProgress = currentPlayers.length > 0 
      ? currentPlayers.reduce((sum, player) => {
          const avg = (player.progress.technical + player.progress.tactical + 
                      player.progress.physical + player.progress.mental) / 4;
          return sum + avg;
        }, 0) / currentPlayers.length
      : 0;

    const mediaUploads = currentPlayers.reduce((sum, player) => sum + player.mediaCount, 0);

    setStats({
      totalPlayers: currentPlayers.length,
      activeCohorts: currentCohorts.filter(c => c.programStatus === 'active').length,
      totalSessions,
      averageProgress: Math.round(averageProgress),
      mediaUploads,
      recentActivity: [
        { type: 'session', player: 'Alex Johnson', time: '2 hours ago' },
        { type: 'media', player: 'Sarah Chen', time: '4 hours ago' },
        { type: 'assessment', player: 'Marcus Rodriguez', time: '1 day ago' }
      ]
    });
  };

  const handleViewChange = (view: ToolkitView) => {
    setCurrentView(view);
  };

  const handlePlayerFilterChange = (filter: Partial<PlayerFilterState>) => {
    setPlayerFilters(prev => ({ ...prev, ...filter }));
  };

  const filteredPlayers = players.filter(player => {
    if (playerFilters.position !== 'all' && player.position !== playerFilters.position) return false;
    if (playerFilters.status !== 'all' && player.status !== playerFilters.status) return false;
    if (playerFilters.cohort !== 'all' && player.cohort !== playerFilters.cohort) return false;
    if (playerFilters.searchQuery && !player.name.toLowerCase().includes(playerFilters.searchQuery.toLowerCase())) return false;
    return true;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Players</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalPlayers}</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">👥</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Cohorts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.activeCohorts}</p>
            </div>
            <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400 text-sm font-semibold">📚</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalSessions}</p>
            </div>
            <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 text-sm font-semibold">⚽</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.averageProgress}%</p>
            </div>
            <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
              <span className="text-orange-600 dark:text-orange-400 text-sm font-semibold">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {stats.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`h-2 w-2 rounded-full ${
                activity.type === 'session' ? 'bg-blue-500' :
                activity.type === 'media' ? 'bg-green-500' : 'bg-purple-500'
              }`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {activity.player} - {activity.type}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPlayers = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search players..."
            value={playerFilters.searchQuery}
            onChange={(e) => handlePlayerFilterChange({ searchQuery: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
          />
          <select
            value={playerFilters.position}
            onChange={(e) => handlePlayerFilterChange({ position: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="all">All Positions</option>
            <option value="forward">Forward</option>
            <option value="midfielder">Midfielder</option>
            <option value="defender">Defender</option>
            <option value="goalkeeper">Goalkeeper</option>
          </select>
          <select
            value={playerFilters.cohort}
            onChange={(e) => handlePlayerFilterChange({ cohort: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="all">All Cohorts</option>
            {cohorts.map(cohort => (
              <option key={cohort.id} value={cohort.id}>{cohort.name}</option>
            ))}
          </select>
          <select
            value={playerFilters.status}
            onChange={(e) => handlePlayerFilterChange({ status: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Players List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map(player => (
          <div key={player.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{player.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">#{player.jerseyNumber} • {player.position}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                player.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {player.status}
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Progress</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Technical</span>
                    <span>{player.progress.technical}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${player.progress.technical}%` }} />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Sessions: {player.totalSessions}</span>
                <span>Media: {player.mediaCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCohorts = () => (
    <div className="space-y-6">
      {cohorts.map(cohort => (
        <div key={cohort.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{cohort.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">{cohort.description}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              cohort.programStatus === 'active' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}>
              {cohort.programStatus}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Players</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {cohort.activePlayers}/{cohort.playerCount}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Coaches</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{cohort.coaches.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Focus Areas</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{cohort.focusAreas.length}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {cohort.focusAreas.map(area => (
              <span key={area} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                {area}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'players':
        return renderPlayers();
      case 'cohorts':
        return renderCohorts();
      case 'media':
        return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Media Library - Coming Soon</div>;
      case 'analytics':
        return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Analytics Dashboard - Coming Soon</div>;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className={`elevate-console ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Elevate Console</h1>
        <p className="text-gray-600 dark:text-gray-400">Coaching toolkit for player development and team management</p>
      </div>

      {/* Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {(['dashboard', 'players', 'cohorts', 'media', 'analytics'] as ToolkitView[]).map(view => (
            <button
              key={view}
              onClick={() => handleViewChange(view)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === view
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}; 
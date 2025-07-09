import React, { useState, useCallback, useMemo } from 'react';
import { Users, TrendingUp, Activity, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { PlayerProgress, PlayerStatus } from '../../types';
import { loadMattCompleteData } from '../../utils/mattDataLoader';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  lastActive: Date;
}

interface TeamDashboardProps {
  teamMembers: TeamMember[];
}

const statusToFunnelStage: Record<PlayerStatus, string> = {
  new: 'Contacted',
  profile_populated: 'Profile Complete',
  engaged: 'Engaged',
  participating: 'Engaged',
  recruited: 'Offer',
  successful: 'Committed',
  prospect: 'Prospect',
};

const COLORS = ['#34d399', '#f87171'];

export const TeamDashboard: React.FC<TeamDashboardProps> = ({ teamMembers }) => {
  const [players, setPlayers] = useState<PlayerProgress[]>([]);
  const [playerData, setPlayerData] = useState<{ [key: string]: any }>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load player data
  useMemo(() => {
    const loadData = async () => {
      try {
        const data = await loadMattCompleteData();
        setPlayers(Array.from(data.playerProgressMap.values()));
        
        // Create a lookup map for player data
        const playerLookup: { [key: string]: any } = {};
        data.players.forEach(player => {
          playerLookup[player.id] = player;
        });
        setPlayerData(playerLookup);
      } catch (error) {
        console.error('Failed to load player data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate funnel data
  const funnelCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    players.forEach(progress => {
      const stage = statusToFunnelStage[progress.status];
      counts[stage] = (counts[stage] || 0) + 1;
    });
    return counts;
  }, [players]);

  const funnelData = useMemo(() => {
    return Object.entries(funnelCounts).map(([stage, count]) => ({
      stage,
      count,
      percentage: (count / players.length) * 100
    }));
  }, [funnelCounts, players.length]);

  // Calculate profile completeness
  const profileCompletenessData = useMemo(() => {
    const completenessRanges = [
      { range: '0-25%', count: 0 },
      { range: '26-50%', count: 0 },
      { range: '51-75%', count: 0 },
      { range: '76-100%', count: 0 }
    ];

    players.forEach(player => {
      const completeness = player.completionLevel || 0;
      if (completeness <= 25) completenessRanges[0].count++;
      else if (completeness <= 50) completenessRanges[1].count++;
      else if (completeness <= 75) completenessRanges[2].count++;
      else completenessRanges[3].count++;
    });

    return completenessRanges;
  }, [players]);

  const handlePlayerClick = useCallback(() => {
    // Navigate to player details
  }, []);

  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Overview of team performance and player progress</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{teamMembers.filter(m => m.status === 'online').length} online</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Players</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{players.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Players</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {players.filter(p => p.status === 'engaged' || p.status === 'participating').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recruited</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {players.filter(p => p.status === 'recruited' || p.status === 'successful').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Activity className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(players.reduce((sum, p) => sum + (p.completionLevel || 0), 0) / players.length)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Player Funnel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelData}>
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Profile Completeness */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Completeness</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={profileCompletenessData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => `${props.range}: ${props.percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {profileCompletenessData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {players.slice(0, 5).map((player) => (
            <div key={player.playerId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {playerData[player.playerId]?.name?.split(' ').map((n: string) => n[0]).join('') || 'P'}
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{playerData[player.playerId]?.name || 'Unknown Player'}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {statusToFunnelStage[player.status]} • {player.completionLevel}% complete
                  </p>
                </div>
              </div>
              <button
                onClick={handlePlayerClick}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 
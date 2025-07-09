import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { BellIcon, UsersIcon } from '@heroicons/react/24/outline';
import { ThemeToggle } from '../ThemeToggle';
import { getCurrentUser } from '../../lib/supabase';
import type { AuthUser } from '@supabase/supabase-js';
import { 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Home,
  TrendingUp,
  Database
} from 'lucide-react';
import { CampCohort } from '../../types';
import { signIn, signOut } from '../../lib/supabase';

// Lazy load components for code splitting
const SystemDashboard = React.lazy(() => import('../SystemDashboard').then(module => ({ default: module.SystemDashboard })));
const DataManagement = React.lazy(() => import('../DataManagement').then(module => ({ default: module.DataManagement })));
const TeamDashboard = React.lazy(() => import('./TeamDashboard').then(module => ({ default: module.TeamDashboard })));
const TeamSettings = React.lazy(() => import('./TeamSettings').then(module => ({ default: module.TeamSettings })));
const AIAssistant = React.lazy(() => import('./AIAssistant').then(module => ({ default: module.AIAssistant })));
const PlayerGrid = React.lazy(() => import('../PlayerGrid').then(module => ({ default: module.PlayerGrid })));

// Loading component for Suspense fallback
const TabLoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  lastActive: Date;
}

interface TeamPortalProps {
  currentUser: TeamMember;
}

// Memoized navigation items to prevent re-creation
const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, description: 'Team overview and key metrics' },
  { id: 'system', label: 'System', icon: BarChart3, description: 'System management and feature map' },
  { id: 'grid', label: 'Player Grid', icon: TrendingUp, description: 'Progress visualization and motivation' },
  { id: 'data', label: 'Data', icon: Database, description: 'Upload and manage player data' },
  { id: 'ai', label: 'AI', icon: MessageSquare, description: 'AI assistant and chat' },
  { id: 'settings', label: 'Settings', icon: Settings, description: 'Team configuration and preferences' },
] as const;

// Memoized team members data
const TEAM_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Partner, Greenlight', role: 'Partner, Greenlight', avatar: '🤝', status: 'online', lastActive: new Date() },
  { id: '2', name: 'Co-Founder 2', role: 'CTO & Co-Founder', avatar: '👨‍💻', status: 'online', lastActive: new Date() },
  { id: '3', name: 'Team Member 3', role: 'Head of Operations', avatar: '👩‍🔧', status: 'busy', lastActive: new Date(Date.now() - 300000) },
  { id: '4', name: 'Team Member 4', role: 'Marketing Lead', avatar: '👨‍💼', status: 'offline', lastActive: new Date(Date.now() - 1800000) },
  { id: '5', name: 'Team Member 5', role: 'Player Relations', avatar: '👩‍🎯', status: 'online', lastActive: new Date() },
];

// Memoized sample cohorts
const SAMPLE_COHORTS: CampCohort[] = [
  {
    id: 'camp-1',
    name: 'Spring Break Camp 2024',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-03-17'),
    maxCapacity: 100,
    currentEnrollment: 67,
    playerIds: ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'],
    status: 'upcoming'
  },
  {
    id: 'camp-2',
    name: 'Summer Elite Camp 2024',
    startDate: new Date('2024-06-20'),
    endDate: new Date('2024-06-22'),
    maxCapacity: 100,
    currentEnrollment: 23,
    playerIds: ['player-6', 'player-7', 'player-8'],
    status: 'upcoming'
  }
];

export const TeamPortal: React.FC<TeamPortalProps> = ({ currentUser }) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'grid' | 'system' | 'data' | 'ai' | 'settings'>('dashboard');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => setUser(null));
  }, []);

  // Memoized handlers
  const handleViewChange = useCallback((viewId: string) => {
    setCurrentView(viewId as 'dashboard' | 'grid' | 'system' | 'data' | 'ai' | 'settings');
  }, []);

  // Memoized tab content renderer with lazy loading
  const renderTabContent = useMemo(() => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <TeamDashboard teamMembers={TEAM_MEMBERS} />
          </Suspense>
        );
      case 'system':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <SystemDashboard />
          </Suspense>
        );
      case 'grid':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <PlayerGrid cohorts={SAMPLE_COHORTS} />
          </Suspense>
        );
      case 'data':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <DataManagement />
          </Suspense>
        );
      case 'ai':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <AIAssistant />
          </Suspense>
        );
      case 'settings':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <TeamSettings />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <TeamDashboard teamMembers={TEAM_MEMBERS} />
          </Suspense>
        );
    }
  }, [currentView]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <UsersIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">Team Portal</h1>
                <p className="text-secondary">Collaborative workspace for team coordination</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="flex items-center gap-2">
                <div className="relative">
                  <BellIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-primary">{currentUser.name}</div>
                    <div className="text-xs text-secondary">{currentUser.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            {user ? (
              <>
                <div className="mb-4">
                  <div className="text-lg font-bold mb-2">Signed in as</div>
                  <div className="mb-2">{user.email}</div>
                </div>
                <button
                  onClick={async () => {
                    await signOut();
                    setUser(null);
                    setShowAuthModal(false);
                    window.location.reload();
                  }}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mb-2"
                >
                  Log Out
                </button>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <div className="text-lg font-bold mb-2">Sign In</div>
                  <div className="text-sm text-gray-600 mb-4">Access your team portal</div>
                </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setAuthError(null);
                    try {
                      await signIn(email, password);
                      setShowAuthModal(false);
                      window.location.reload();
                    } catch {
                      setAuthError('Invalid credentials');
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  {authError && (
                    <div className="text-red-600 text-sm">{authError}</div>
                  )}
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </button>
                </form>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors mt-2"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleViewChange(item.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    currentView === item.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderTabContent}
      </main>
    </div>
  );
}; 
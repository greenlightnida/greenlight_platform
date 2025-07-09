import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Save
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/supabase';
import { useTheme } from '../theme/useTheme';
import type { AuthUser } from '@supabase/supabase-js';

export const TeamSettings: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    role: '',
    avatar: '',
    preferences: {
      theme: 'system' as 'light' | 'dark' | 'system',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      language: 'en',
      timezone: 'UTC'
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { setMode } = useTheme();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          // Fetch user profile from database
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();

          if (data && !error) {
            setProfile({
              fullName: data.full_name || '',
              email: currentUser.email || '',
              role: data.role || '',
              avatar: data.avatar_url || '',
              preferences: {
                theme: data.preferences?.theme || 'system',
                notifications: data.preferences?.notifications || {
                  email: true,
                  push: true,
                  sms: false
                },
                language: data.preferences?.language || 'en',
                timezone: data.preferences?.timezone || 'UTC'
              }
            });
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleThemeChange = (preference: 'light' | 'dark' | 'system') => {
    setMode(preference);
    setProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, theme: preference }
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.fullName,
          role: profile.role,
          avatar_url: profile.avatar,
          preferences: profile.preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      // Show success message
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage team preferences and configuration</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Profile Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="full-name">Full Name
              </label>
              <input
                id="full-name"
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email
              </label>
              <input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 dark:text-gray-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="role">Role
              </label>
              <input
                id="role"
                type="text"
                value={profile.role}
                onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Preferences
          </h3>
          
          <div className="space-y-6">
            {/* Theme */}
            <fieldset className="mb-4">
              <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</legend>
              <div className="flex space-x-4">
                {(['light', 'dark', 'system'] as const).map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => handleThemeChange(theme)}
                    className={`px-4 py-2 rounded-lg border ${
                      profile.preferences.theme === theme
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Notifications */}
            <fieldset className="mb-4">
              <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </legend>
              <div className="space-y-3">
                {Object.entries(profile.preferences.notifications).map(([key, value]) => (
                  <label key={key} className="flex items-center" htmlFor={`notification-${key}`}>
                    <input
                      id={`notification-${key}`}
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          notifications: {
                            ...prev.preferences.notifications,
                            [key]: e.target.checked
                          }
                        }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {key.charAt(0).toUpperCase() + key.slice(1)} notifications
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Language & Timezone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center" htmlFor="language">
                  <Globe className="w-4 h-4 mr-2" />
                  Language
                </label>
                <select
                  id="language"
                  value={profile.preferences.language}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, language: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="timezone">Timezone
                </label>
                <select
                  id="timezone"
                  value={profile.preferences.timezone}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, timezone: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security
          </h3>
          
          <div className="space-y-4">
            <button
              type="button"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
            >
              Change Password
            </button>
            <button
              type="button"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
            >
              Enable Two-Factor Authentication
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}; 
import React, { useState, useEffect, useMemo } from 'react';

import { THEME_STORAGE_KEY, THEME_MODES, type ThemeMode } from './constants';
import { ThemeContext, type ThemeState } from './ThemeContextDefinition';

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeState, setThemeState] = useState<ThemeState>(() => {
    // Initialize from localStorage or system preference
    const savedMode = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
    const mode = savedMode && Object.values(THEME_MODES).includes(savedMode) 
      ? savedMode 
      : THEME_MODES.SYSTEM;
    
    const isDark = mode === THEME_MODES.DARK || 
      (mode === THEME_MODES.SYSTEM && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    return { mode, isDark };
  });

  useEffect(() => {
    const updateTheme = () => {
      const isDark = themeState.mode === THEME_MODES.DARK || 
        (themeState.mode === THEME_MODES.SYSTEM && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      setThemeState(prev => ({ ...prev, isDark }));
    };

    updateTheme();
    localStorage.setItem(THEME_STORAGE_KEY, themeState.mode);

    // Listen for system theme changes
    if (themeState.mode === THEME_MODES.SYSTEM) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeState.mode]);

  const value = useMemo(() => ({
    themeState,
    setMode: (mode: ThemeMode) => setThemeState(prev => ({ ...prev, mode })),
    toggle: () => setThemeState(prev => ({
      ...prev,
      mode: prev.mode === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT
    }))
  }), [themeState]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 
import { createContext } from 'react';

import type { ThemeMode } from './constants';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
}

interface ThemeContextType {
  themeState: ThemeState;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
}


export type { ThemeContextType, ThemeState }; 
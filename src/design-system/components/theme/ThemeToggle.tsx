import React from 'react';

export const ThemeToggle: React.FC = () => {
  return (
    <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
      <span className="sr-only">Toggle theme</span>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>
  );
}; 
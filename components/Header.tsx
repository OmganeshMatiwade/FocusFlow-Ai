
import React from 'react';

interface HeaderProps {
  currentView: 'main' | 'dashboard';
  onViewChange: (view: 'main' | 'dashboard') => void;
}

const BrainCircuitIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary"><path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 1.23.39 2.36 1.07 3.25L5 13.5V16c0 .83.67 1.5 1.5 1.5h11c.83 0 1.5-.67 1.5-1.5v-2.5l-3.57-3.75A4.5 4.5 0 0 0 12 2Z"/><path d="M5.5 13.5h13"/><path d="M18 16.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 16.5"/><path d="M12 18v3"/><path d="M9 21h6"/><path d="M12 13.5a1.5 1.5 0 0 1-1.5-1.5v-1c0-.4.18-.78.49-1.01a1.5 1.5 0 0 1 2.02 0c.31.23.49.61.49 1.01v1A1.5 1.5 0 0 1 12 13.5Z"/></svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const BarChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="20" y2="10"/>
    <line x1="18" x2="18" y1="20" y2="4"/>
    <line x1="6" x2="6" y1="20" y2="16"/>
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  return (
    <header className="bg-dark-card border-b border-dark-border p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BrainCircuitIcon />
          <h1 className="text-2xl font-bold text-light-text tracking-tight">EduPulse</h1>
          <span className="text-sm text-medium-text mt-1">AI Engagement Engine</span>
        </div>
        
        <nav className="flex space-x-1">
          <button
            onClick={() => onViewChange('main')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'main'
                ? 'bg-brand-primary text-white'
                : 'text-medium-text hover:text-light-text hover:bg-dark-bg'
            }`}
          >
            <HomeIcon />
            <span>Focus</span>
          </button>
          <button
            onClick={() => onViewChange('dashboard')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'dashboard'
                ? 'bg-brand-primary text-white'
                : 'text-medium-text hover:text-light-text hover:bg-dark-bg'
            }`}
          >
            <BarChartIcon />
            <span>Dashboard</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

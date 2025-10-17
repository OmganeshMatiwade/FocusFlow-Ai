import React from 'react';
import type { Achievement } from './types';

export const FOCUS_DURATION = 25 * 60; // 25 minutes
export const BREAK_DURATION = 5 * 60; // 5 minutes

export const ENGAGEMENT_THRESHOLD = 0.9; // Trigger intervention below this score
export const ENGAGEMENT_DECAY_RATE = 0.005; // Score decay per second
export const ACTIVITY_BUMP = 0.1; // Score increase on activity
export const MAX_ENGAGEMENT_SCORE = 1.0;

// Fix: Converted icon components to use React.createElement to avoid JSX syntax in a .ts file.
const TrophyIcon = () => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "text-yellow-400" },
        React.createElement('path', { d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6" }),
        React.createElement('path', { d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18" }),
        React.createElement('path', { d: "M4 22h16" }),
        React.createElement('path', { d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" }),
        React.createElement('path', { d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" }),
        React.createElement('path', { d: "M8 21.79V14h8v7.79a2.42 2.42 0 0 1-2.42 2.21H10.42A2.42 2.42 0 0 1 8 21.79Z" })
    )
);
const BrainIcon = () => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "text-pink-400" },
        React.createElement('path', { d: "M12 2a4.5 4.5 0 0 0-4.5 4.5c0 1.23.39 2.36 1.07 3.25L5 13.5V16c0 .83.67 1.5 1.5 1.5h11c.83 0 1.5-.67 1.5-1.5v-2.5l-3.57-3.75A4.5 4.5 0 0 0 12 2Z" }),
        React.createElement('path', { d: "M5.5 13.5h13" }),
        React.createElement('path', { d: "M18 16.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 16.5" }),
        React.createElement('path', { d: "M12 18v3" }),
        React.createElement('path', { d: "M9 21h6" }),
        React.createElement('path', { d: "M12 13.5a1.5 1.5 0 0 1-1.5-1.5v-1c0-.4.18-.78.49-1.01a1.5 1.5 0 0 1 2.02 0c.31.23.49.61.49 1.01v1A1.5 1.5 0 0 1 12 13.5Z" })
    )
);
const StarIcon = () => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "text-blue-400" },
        React.createElement('polygon', { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })
    )
);

// Fix: Added missing 'condition' properties and used React.createElement to instantiate icons.
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_points', name: 'Point Scorer', description: 'Earn your first 10 points.', icon: React.createElement(StarIcon), condition: (p, _) => p >= 10 },
  { id: 'first_pomodoro', name: 'Focus Starter', description: 'Complete your first Focus session.', icon: React.createElement(BrainIcon), condition: (_, pc) => pc >= 1 },
  { id: 'master_pomodoro', name: 'Focus Master', description: 'Complete 5 Focus sessions.', icon: React.createElement(BrainIcon), condition: (_, pc) => pc >= 5 },
  { id: 'point_collector', name: 'Point Collector', description: 'Reach 100 points.', icon: React.createElement(TrophyIcon), condition: (p, _) => p >= 100 },
  { id: 'point_hoarder', name: 'Point Hoarder', description: 'Reach 500 points.', icon: React.createElement(TrophyIcon), condition: (p, _) => p >= 500 },
];
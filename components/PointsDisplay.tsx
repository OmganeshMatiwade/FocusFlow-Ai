
import React from 'react';
import type { Achievement } from '../types';

interface PointsDisplayProps {
  points: number;
  achievements: Achievement[];
}

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

export const PointsDisplay: React.FC<PointsDisplayProps> = ({ points, achievements }) => {
  return (
    <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
      <h3 className="font-bold text-lg text-light-text mb-4">Your Progress</h3>
      <div className="flex items-center justify-center bg-dark-bg p-4 rounded-lg mb-4">
        <StarIcon />
        <span className="ml-3 text-3xl font-bold text-yellow-400">{points}</span>
        <span className="ml-2 text-lg text-medium-text mt-1">Points</span>
      </div>
      <div>
        <h4 className="font-semibold text-medium-text mb-2">Achievements</h4>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
            {achievements.length > 0 ? achievements.map(ach => (
                <div key={ach.id} className="flex items-center space-x-3">
                    <div>{ach.icon}</div>
                    <div>
                        <p className="font-semibold text-sm text-light-text">{ach.name}</p>
                        <p className="text-xs text-medium-text">{ach.description}</p>
                    </div>
                </div>
            )) : (
                <p className="text-sm text-medium-text text-center py-4">Complete sessions to earn achievements!</p>
            )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';

interface EngagementGaugeProps {
  score: number;
  isTracking: boolean;
}

export const EngagementGauge: React.FC<EngagementGaugeProps> = ({ score, isTracking }) => {
  const normalizedScore = isTracking ? score : 1;
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (normalizedScore * circumference);

  const getStrokeColor = () => {
    if (normalizedScore > 0.7) return 'text-brand-secondary';
    if (normalizedScore > 0.4) return 'text-yellow-400';
    return 'text-red-500';
  };

  return (
    <div className="bg-dark-card p-6 rounded-lg border border-dark-border flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-lg text-light-text mb-1">Engagement Level</h3>
        <p className="text-sm text-medium-text mb-4">
            {isTracking ? 'Actively monitoring...' : 'Tracking paused'}
        </p>
      </div>
      <div className="flex items-center justify-center my-4">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full" viewBox="0 0 120 120">
            <circle
              className="text-dark-border"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="52"
              cx="60"
              cy="60"
            />
            <circle
              className={`${getStrokeColor()} transition-all duration-500`}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="52"
              cx="60"
              cy="60"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${getStrokeColor()}`}>
                {Math.round(normalizedScore * 100)}
            </span>
            <span className="text-sm text-medium-text">/ 100</span>
          </div>
        </div>
      </div>
      <div className={`text-center font-semibold transition-opacity duration-300 ${isTracking ? 'animate-pulse-slow' : 'opacity-50'} h-12 flex items-center justify-center`}>
        {isTracking ? "Stay Focused!" : "Start a session to begin."}
      </div>
    </div>
  );
};
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { EngagementRecord } from '../types';

interface EngagementChartProps {
  data: EngagementRecord[];
  isTracking: boolean;
}

export const EngagementChart: React.FC<EngagementChartProps> = ({ data, isTracking }) => {
    
  const formattedData = data.map(d => ({
    ...d,
    time: new Date(d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    score: d.score * 100 // Scale to 0-100
  }));

  return (
    <div className="bg-dark-card p-4 rounded-lg border border-dark-border h-64">
        <div className="flex items-center space-x-2 mb-4">
            <h3 className="font-bold text-lg text-light-text">Engagement History</h3>
            {isTracking && (
                <div className="flex items-center space-x-1.5 bg-red-900/50 text-red-400 rounded-full px-2 py-0.5">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-xs font-semibold uppercase">Live</span>
                </div>
            )}
        </div>
        {data.length > 1 ? (
        <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={formattedData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
            <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9CA3AF" fontSize={12} domain={[0, 100]} tickLine={false} axisLine={false} />
            <Tooltip
                contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '0.5rem'
                }}
                labelStyle={{ color: '#F3F4F6' }}
            />
            <Area type="monotone" dataKey="score" stroke="#4F46E5" fillOpacity={1} fill="url(#colorScore)" strokeWidth={2} />
            </AreaChart>
        </ResponsiveContainer>
        ) : (
            <div className="flex items-center justify-center h-full text-medium-text">
                <p>Start a focus session to see your engagement history.</p>
            </div>
        )}
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import type { EngagementRecord, Achievement } from '../types';

interface DashboardProps {
  points: number;
  achievements: Achievement[];
  pomodorosCompleted: number;
  engagementHistory: EngagementRecord[];
  currentEngagementScore: number;
  isTracking: boolean;
}

interface DailyStats {
  date: string;
  sessions: number;
  totalTime: number;
  avgEngagement: number;
  pointsEarned: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  points,
  achievements,
  pomodorosCompleted,
  engagementHistory,
  currentEngagementScore,
  isTracking
}) => {
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<DailyStats[]>([]);

  // Calculate focus time in minutes
  const totalFocusTime = pomodorosCompleted * 25; // 25 minutes per pomodoro
  const totalFocusHours = Math.floor(totalFocusTime / 60);
  const totalFocusMinutes = totalFocusTime % 60;

  // Calculate average engagement from history
  const avgEngagement = engagementHistory.length > 0 
    ? engagementHistory.reduce((sum, record) => sum + record.score, 0) / engagementHistory.length 
    : 0;

  // Calculate engagement trend (last 10 records vs first 10 records)
  const recentEngagement = engagementHistory.slice(-10);
  const earlyEngagement = engagementHistory.slice(0, 10);
  const recentAvg = recentEngagement.length > 0 
    ? recentEngagement.reduce((sum, record) => sum + record.score, 0) / recentEngagement.length 
    : 0;
  const earlyAvg = earlyEngagement.length > 0 
    ? earlyEngagement.reduce((sum, record) => sum + record.score, 0) / earlyEngagement.length 
    : 0;
  const engagementTrend = recentAvg - earlyAvg;

  // Generate mock daily stats for the past 7 days
  useEffect(() => {
    const generateDailyStats = () => {
      const stats: DailyStats[] = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Generate realistic mock data
        const sessions = Math.floor(Math.random() * 4) + (i === 0 ? (pomodorosCompleted > 0 ? 1 : 0) : 0);
        const totalTime = sessions * 25;
        const avgEngagement = 0.7 + Math.random() * 0.3;
        const pointsEarned = sessions * 25 + (Math.random() > 0.5 ? 10 : 0);
        
        stats.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          sessions,
          totalTime,
          avgEngagement,
          pointsEarned
        });
      }
      
      setDailyStats(stats);
    };

    generateDailyStats();
  }, [pomodorosCompleted]);

  // Generate weekly stats for the past 4 weeks
  useEffect(() => {
    const generateWeeklyStats = () => {
      const stats: DailyStats[] = [];
      
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (i * 7 + 6));
        
        const sessions = Math.floor(Math.random() * 15) + 5;
        const totalTime = sessions * 25;
        const avgEngagement = 0.6 + Math.random() * 0.4;
        const pointsEarned = sessions * 25 + Math.floor(Math.random() * 50);
        
        stats.push({
          date: `Week ${4-i}`,
          sessions,
          totalTime,
          avgEngagement,
          pointsEarned
        });
      }
      
      setWeeklyStats(stats);
    };

    generateWeeklyStats();
  }, []);

  // Prepare data for charts
  const dailyChartData = dailyStats.map(stat => ({
    ...stat,
    avgEngagement: Math.round(stat.avgEngagement * 100)
  }));

  const weeklyChartData = weeklyStats.map(stat => ({
    ...stat,
    avgEngagement: Math.round(stat.avgEngagement * 100)
  }));

  const engagementChartData = engagementHistory.slice(-20).map(record => ({
    time: new Date(record.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    score: Math.round(record.score * 100)
  }));

  // Achievement distribution
  const achievementData = [
    { name: 'Completed', value: achievements.length, color: '#4F46E5' },
    { name: 'Remaining', value: 5 - achievements.length, color: '#374151' }
  ];

  const StatCard = ({ title, value, subtitle, icon, color = "text-light-text" }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color?: string;
  }) => (
    <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-medium-text mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-medium-text mt-1">{subtitle}</p>}
        </div>
        <div className="text-2xl opacity-60">
          {icon}
        </div>
      </div>
    </div>
  );

  const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12,6 12,12 16,14"/>
    </svg>
  );

  const TargetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  );

  const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
      <path d="M4 22h16"/>
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
      <path d="M8 21.79V14h8v7.79a2.42 2.42 0 0 1-2.42 2.21H10.42A2.42 2.42 0 0 1 8 21.79Z"/>
    </svg>
  );

  const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );

  const TrendingUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
      <polyline points="16,7 22,7 22,13"/>
    </svg>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
        <h2 className="text-2xl font-bold text-light-text mb-2">Dashboard</h2>
        <p className="text-medium-text">Your focus and productivity insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Focus Time"
          value={`${totalFocusHours}h ${totalFocusMinutes}m`}
          subtitle="All time"
          icon={<ClockIcon />}
          color="text-blue-400"
        />
        <StatCard
          title="Sessions Completed"
          value={pomodorosCompleted}
          subtitle="Focus sessions"
          icon={<TargetIcon />}
          color="text-green-400"
        />
        <StatCard
          title="Current Score"
          value={`${Math.round(currentEngagementScore * 100)}%`}
          subtitle={isTracking ? "Live tracking" : "Not tracking"}
          icon={<TrendingUpIcon />}
          color={isTracking ? "text-yellow-400" : "text-medium-text"}
        />
        <StatCard
          title="Points Earned"
          value={points}
          subtitle="Total points"
          icon={<StarIcon />}
          color="text-yellow-400"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Progress */}
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <h3 className="font-bold text-lg text-light-text mb-4">Daily Progress (7 days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar dataKey="sessions" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Trend */}
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <h3 className="font-bold text-lg text-light-text mb-4">Engagement Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#4F46E5" 
                strokeWidth={2}
                dot={{ fill: '#4F46E5', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Overview */}
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <h3 className="font-bold text-lg text-light-text mb-4">Weekly Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyChartData}>
              <defs>
                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Area 
                type="monotone" 
                dataKey="sessions" 
                stroke="#4F46E5" 
                fill="url(#colorSessions)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Achievement Progress */}
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <h3 className="font-bold text-lg text-light-text mb-4">Achievement Progress</h3>
          <div className="flex items-center justify-center h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={achievementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {achievementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-2xl font-bold text-light-text">{achievements.length}/5</p>
            <p className="text-sm text-medium-text">Achievements Unlocked</p>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
        <h3 className="font-bold text-lg text-light-text mb-4">Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-light-text mb-2">Performance Summary</h4>
            <ul className="space-y-2 text-sm text-medium-text">
              <li>• Average engagement: {Math.round(avgEngagement * 100)}%</li>
              <li>• Engagement trend: {engagementTrend > 0 ? '+' : ''}{Math.round(engagementTrend * 100)}%</li>
              <li>• Best session: {Math.round(Math.max(...engagementHistory.map(r => r.score)) * 100)}%</li>
              <li>• Total achievements: {achievements.length}/5</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-light-text mb-2">Recommendations</h4>
            <ul className="space-y-2 text-sm text-medium-text">
              {avgEngagement < 0.8 && (
                <li>• Try shorter focus sessions to maintain higher engagement</li>
              )}
              {pomodorosCompleted < 5 && (
                <li>• Complete more sessions to unlock achievements</li>
              )}
              {engagementTrend < 0 && (
                <li>• Take regular breaks to prevent engagement decline</li>
              )}
              <li>• Keep your camera on for enhanced tracking accuracy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

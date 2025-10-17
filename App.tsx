import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { PomodoroTimer } from './components/PomodoroTimer';
import { EngagementGauge } from './components/EngagementGauge';
import { PointsDisplay } from './components/PointsDisplay';
import { EngagementChart } from './components/EngagementChart';
import { CameraView } from './components/CameraView';
import { EngagementChallengeModal } from './components/EngagementChallengeModal';
import { Dashboard } from './components/Dashboard';
import { useEngagement } from './hooks/useEngagement';
import { useLocalStorage } from './hooks/useLocalStorage';
import { PomodoroState, EngagementRecord, Achievement } from './types';
import { ENGAGEMENT_THRESHOLD, ACHIEVEMENTS } from './constants';

export default function App() {
  const [pomodoroState, setPomodoroState] = useState<PomodoroState>(PomodoroState.STOPPED);
  const [showIntervention, setShowIntervention] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'dashboard'>('main');

  const [points, setPoints] = useLocalStorage('edupulse-points', 0);
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>('edupulse-achievements', []);
  const [pomodorosCompleted, setPomodorosCompleted] = useLocalStorage('edupulse-pomodoros', 0);

  const onEngagementDrop = useCallback(() => {
    if (pomodoroState === PomodoroState.FOCUS) {
      setShowIntervention(true);
    }
  }, [pomodoroState]);

  const { 
    engagementScore, 
    engagementHistory, 
    resetEngagement, 
    stopTracking, 
    startTracking,
    handleActivity
  } = useEngagement({
    isTracking: pomodoroState === PomodoroState.FOCUS,
    threshold: ENGAGEMENT_THRESHOLD,
    onThresholdBreach: onEngagementDrop,
  });
  
  const handlePomodoroStateChange = useCallback((newState: PomodoroState) => {
    setPomodoroState(newState);
    if (newState === PomodoroState.FOCUS) {
      startTracking();
    } else {
      stopTracking();
    }
  }, [startTracking, stopTracking]);

  const onPomodoroComplete = useCallback(() => {
    setPomodorosCompleted(current => current + 1);
    setPoints(current => current + 25);
  }, [setPomodorosCompleted, setPoints]);

  const handleInterventionClose = (success: boolean) => {
    setShowIntervention(false);
    if (success) {
      setPoints(points + 10);
      resetEngagement();
    }
  };

  useEffect(() => {
    const newAchievements = ACHIEVEMENTS.filter(
      ach => !achievements.some(a => a.id === ach.id) && ach.condition(points, pomodorosCompleted)
    );
    if (newAchievements.length > 0) {
      setAchievements([...achievements, ...newAchievements]);
      // You could add a toast notification here to celebrate the new achievement
    }
  }, [points, pomodorosCompleted, achievements, setAchievements]);

  return (
    <div className="min-h-screen bg-dark-bg text-light-text font-sans">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {currentView === 'main' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PomodoroTimer 
                  onStateChange={handlePomodoroStateChange} 
                  onPomodoroComplete={onPomodoroComplete}
                />
                <EngagementGauge score={engagementScore} isTracking={pomodoroState === PomodoroState.FOCUS} />
              </div>
              <EngagementChart data={engagementHistory} isTracking={pomodoroState === PomodoroState.FOCUS} />
            </div>

            <div className="space-y-6">
              <PointsDisplay points={points} achievements={achievements} />
              <CameraView isCameraOn={isCameraOn} setIsCameraOn={setIsCameraOn} onMotionDetected={handleActivity} />
              <div className="bg-dark-card p-4 rounded-lg border border-dark-border">
                  <h3 className="font-bold text-lg mb-2">How it works</h3>
                  <p className="text-sm text-medium-text">
                      When you start a 'Focus' session, EduPulse monitors your activity. If your engagement drops below 90%, a quick challenge will appear. Stay active to earn points!
                      <br/><br/>
                      <span className="font-semibold text-light-text">{isCameraOn ? "Camera is active for enhanced tracking." : "Using behavioral tracking (mouse/keyboard)."}</span>
                  </p>
              </div>
            </div>

          </div>
        ) : (
          <Dashboard
            points={points}
            achievements={achievements}
            pomodorosCompleted={pomodorosCompleted}
            engagementHistory={engagementHistory}
            currentEngagementScore={engagementScore}
            isTracking={pomodoroState === PomodoroState.FOCUS}
          />
        )}
      </main>
      <EngagementChallengeModal
        isOpen={showIntervention}
        onClose={handleInterventionClose}
      />
    </div>
  );
}
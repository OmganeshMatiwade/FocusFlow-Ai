import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PomodoroState } from '../types';
import { FOCUS_DURATION, BREAK_DURATION } from '../constants';

interface PomodoroTimerProps {
  onStateChange: (state: PomodoroState) => void;
  onPomodoroComplete: () => void;
}

const PlayIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>);
const PauseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>);
const RotateCwIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>);

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onStateChange, onPomodoroComplete }) => {
  const [mode, setMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isActive, setIsActive] = useState(false);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const targetTimeRef = useRef<number>(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const switchMode = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (mode === 'FOCUS') {
      onPomodoroComplete();
      setMode('BREAK');
      setTimeLeft(BREAK_DURATION);
      onStateChange(PomodoroState.STOPPED);
    } else {
      setMode('FOCUS');
      setTimeLeft(FOCUS_DURATION);
      onStateChange(PomodoroState.STOPPED);
    }
  }, [mode, onStateChange, onPomodoroComplete]);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const tick = () => {
      const remainingTime = targetTimeRef.current - Date.now();
      if (remainingTime <= 0) {
        setTimeLeft(0);
        switchMode();
      } else {
        setTimeLeft(Math.ceil(remainingTime / 1000));
      }
    };

    if (!intervalRef.current) {
      tick(); // Run immediately
      intervalRef.current = setInterval(tick, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, switchMode]);

  const handleStartPause = () => {
    if (isActive) {
      setIsActive(false);
      onStateChange(PomodoroState.PAUSED);
    } else {
      targetTimeRef.current = Date.now() + timeLeft * 1000;
      setIsActive(true);
      onStateChange(mode === 'FOCUS' ? PomodoroState.FOCUS : PomodoroState.BREAK);
    }
  };
  
  const handleReset = () => {
    setIsActive(false);
    setMode('FOCUS');
    setTimeLeft(FOCUS_DURATION);
    onStateChange(PomodoroState.STOPPED);
  }

  const duration = mode === 'FOCUS' ? FOCUS_DURATION : BREAK_DURATION;
  const progress = (1 - timeLeft / duration) * 100;

  return (
    <div className="bg-dark-card p-6 rounded-lg border border-dark-border flex flex-col justify-evenly">
      <div>
        <h3 className="font-bold text-lg text-light-text mb-1">Pomodoro Timer</h3>
        <p className="text-sm text-medium-text">
          Current session: <span className={`font-semibold ${mode === 'FOCUS' ? 'text-brand-secondary' : 'text-blue-400'}`}>{mode}</span>
        </p>
      </div>

      <div className="relative flex justify-center items-center my-4">
        <svg className="w-40 h-40 transform -rotate-90">
            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" className="text-dark-border" fill="transparent" />
            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" className={mode === 'FOCUS' ? 'text-brand-primary' : 'text-blue-500'} fill="transparent"
                strokeDasharray={2 * Math.PI * 70}
                strokeDashoffset={(2 * Math.PI * 70) * (1 - progress / 100)}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s linear' }}
            />
        </svg>
        <span className="absolute text-4xl font-mono font-bold">{formatTime(timeLeft)}</span>
      </div>

      <div className="flex justify-center items-center space-x-4 h-12">
        <button onClick={handleReset} className="p-3 rounded-full bg-dark-border hover:bg-gray-600 transition-colors">
            <RotateCwIcon />
        </button>
        <button 
          onClick={handleStartPause} 
          className="px-8 py-3 rounded-full bg-brand-primary text-white font-bold flex items-center space-x-2 hover:bg-indigo-500 transition-colors"
        >
          {isActive ? <PauseIcon /> : <PlayIcon />}
          <span>{isActive ? 'Pause' : 'Start'}</span>
        </button>
      </div>
    </div>
  );
};
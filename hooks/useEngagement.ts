import { useState, useEffect, useRef, useCallback } from 'react';
import type { EngagementRecord } from '../types';
import { ENGAGEMENT_DECAY_RATE, ACTIVITY_BUMP, MAX_ENGAGEMENT_SCORE } from '../constants';
import { calculateIdlePenalty } from '../services/geminiService';

interface UseEngagementProps {
  isTracking: boolean;
  threshold: number;
  onThresholdBreach: () => void;
}

export const useEngagement = ({ isTracking, threshold, onThresholdBreach }: UseEngagementProps) => {
  const [engagementScore, setEngagementScore] = useState(MAX_ENGAGEMENT_SCORE);
  const [engagementHistory, setEngagementHistory] = useState<EngagementRecord[]>([]);
  
  const scoreRef = useRef(engagementScore);
  scoreRef.current = engagementScore;

  const thresholdBreached = useRef(false);
  const lastActivityRef = useRef(Date.now());
  const idlePenaltyAppliedRef = useRef(false);

  const handleActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (idlePenaltyAppliedRef.current) {
        idlePenaltyAppliedRef.current = false; // Reset penalty flag on new activity
    }
    setEngagementScore(prev => Math.min(prev + ACTIVITY_BUMP, MAX_ENGAGEMENT_SCORE));
  }, []);

  const startTracking = useCallback(() => {
    setEngagementScore(MAX_ENGAGEMENT_SCORE);
    setEngagementHistory([]);
    thresholdBreached.current = false;
    lastActivityRef.current = Date.now();
    idlePenaltyAppliedRef.current = false;
  }, []);

  const stopTracking = useCallback(() => {
    setEngagementScore(MAX_ENGAGEMENT_SCORE);
    setEngagementHistory([]);
  }, []);
  
  const resetEngagement = useCallback(() => {
    setEngagementScore(MAX_ENGAGEMENT_SCORE);
    thresholdBreached.current = false;
    lastActivityRef.current = Date.now();
    idlePenaltyAppliedRef.current = false;
  }, []);

  useEffect(() => {
    if (!isTracking) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setEngagementScore(prev => Math.max(0, prev - 0.5));
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const decayInterval = setInterval(() => {
      const newScore = Math.max(0, scoreRef.current - ENGAGEMENT_DECAY_RATE);

      if (newScore < threshold && !thresholdBreached.current) {
        thresholdBreached.current = true;
        onThresholdBreach();
      }
      
      setEngagementScore(newScore);
      
      setEngagementHistory(prevHistory => {
         const newRecord = { time: Date.now(), score: newScore };
         const last100 = prevHistory.slice(-99);
         return [...last100, newRecord];
      });

    }, 1000);

    return () => {
      clearInterval(decayInterval);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isTracking, threshold, onThresholdBreach, handleActivity]);
  
  useEffect(() => {
    if (!isTracking) return;

    const idleCheckInterval = setInterval(async () => {
        const idleTime = Date.now() - lastActivityRef.current;
        
        if (idleTime > 13000 && !idlePenaltyAppliedRef.current) {
            idlePenaltyAppliedRef.current = true;
            
            const newScore = await calculateIdlePenalty(scoreRef.current);
            setEngagementScore(newScore);
        }

    }, 1000);

    return () => clearInterval(idleCheckInterval);
  }, [isTracking]);

  return { engagementScore, engagementHistory, resetEngagement, stopTracking, startTracking, handleActivity };
};
import type { ReactElement } from 'react';

export enum PomodoroState {
  STOPPED = 'STOPPED',
  FOCUS = 'FOCUS',
  BREAK = 'BREAK',
  PAUSED = 'PAUSED',
}

export interface EngagementRecord {
  time: number;
  score: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: ReactElement;
  condition: (points: number, pomodorosCompleted: number) => boolean;
}

// --- NEW ---
// Defines the different types of challenges the AI can generate.
export type ChallengeType = 'joke' | 'fun_fact' | 'counting';

export interface BaseChallenge {
  type: ChallengeType;
}

export interface JokeChallenge extends BaseChallenge {
  type: 'joke';
  question: string;
  punchline: string;
}

export interface FunFactChallenge extends BaseChallenge {
  type: 'fun_fact';
  fact: string;
}

export interface CountingChallenge extends BaseChallenge {
  type: 'counting';
  question: string;
  correctAnswer: number;
  imageUrl: string;
}

export type EngagementChallenge = JokeChallenge | FunFactChallenge | CountingChallenge;

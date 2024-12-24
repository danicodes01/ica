import { GameArea } from './game';
import { ChallengeDifficulty } from './challenges';

export enum ModuleStatus {
  LOCKED = 'LOCKED',
  AVAILABLE = 'AVAILABLE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  challenges: string[];
  xpReward: number;
  completionStatus: ModuleStatus;
}

export interface StationPosition {
  x: number;
  y: number;
  radius: number;
}

export interface Station {
  id: string;
  name: string;
  type: 'moon' | 'venus' | 'saturn';
  area: GameArea;
  position: {
    x: number;
    y: number;
    radius: number;
  };
  icon: string;
  description: string;
  learningPath: {
    title: string;
    description: string;
    modules: Module[];
    totalXP: number;
  };
  isUnlocked: boolean;
  requiredStations?: string[];
}

export interface StationVisuals {
  baseScale: number;
  hoverScale: number;
  glowIntensity: number;
  animationSpeed: number;
}

export interface NPCDialogue {
  intro: string;
  hint: string;
  success: string;
  failure: string;
}

export interface StationNPC {
  name: string;
  role: string;
  dialogue: NPCDialogue;
  avatarUrl: string;
}
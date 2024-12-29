// planet.ts
import { GameArea } from './game';
import { ChallengeDifficulty } from './challenges';

export enum ModuleStatus {
  LOCKED = 'LOCKED',
  AVAILABLE = 'AVAILABLE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export type PlanetType = 'moon' | 'chromanova' | 'syntaxia' | 'quantumCore';  // Define PlanetType


export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  challenges: string[];
  xpReward: number;
  completionStatus: ModuleStatus;
}

export interface LearningPath {
  title: string;
  description: string;
  modules: Challenge[];
  totalXP: number;
}

export interface Position {
  x: number;
  y: number;
  radius: number;
}

export interface Planet {
  id: string;
  name: string;
  type: PlanetType; 
  area: GameArea;
  position: Position;
  icon: string;
  description: string;
  learningPath: LearningPath;
  isUnlocked: boolean;
  requiredStations?: string[]; // Optional field for dependencies
}

import { Model, ObjectId, Document } from 'mongoose';
import { ModuleStatus } from './planet';

export enum StationEnvironment {
  TRAINING = 'TRAINING',
  CHALLENGE = 'CHALLENGE',
  BOSS = 'BOSS'
}

export enum NPCType {
  MENTOR = 'MENTOR',
  CHALLENGER = 'CHALLENGER',
  GUIDE = 'GUIDE',
  ALIEN = 'ALIEN'
}

export interface NPC {
  type: NPCType;
  name: string;
  dialogue: {
    greeting: string;
    hint: string;
    success: string;
    failure: string;
  };
  appearance: string;
}

export interface StationChallenge {
  title: string;
  description: string;
  difficulty: string;
  initialCode: string;
  solution: string;
  examples?: string;
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
  hints: string[];
  baseXPReward: number;
  xpDecayFactor: number;
}

export interface StationProgress {
  currentCode?: string;
  attempts: Array<{
    timestamp?: Date;
    code: string;
    passed: boolean;
    earnedXP: number;
  }>;
  bestAttempt: {
    attemptNumber: number;
    earnedXP: number;
  } | null;
  isComplete: boolean;
}

export interface StationProgressStatus {
  stationNumber: number;
  isComplete: boolean;
  bestAttempt: {
    attemptNumber: number;
    earnedXP: number;
  } | null;
  isAccessible: boolean;
}

export interface StationTheme {
  backgroundColor?: string;
  ambientSound?: string;
  specialEffects: string[];
  planetStyle: 'chromanova' | 'syntaxia' | 'quantumcore' | 'mission-control';
  glowColor?: string;
  backgroundStars: boolean;
}

export interface IStation {
  _id: string | ObjectId;
  planetId: string | ObjectId;
  stationNumber: number;
  name: string;
  environment: StationEnvironment;
  npc: NPC;
  challenge: StationChallenge;
  progress: StationProgress;
  completionStatus: ModuleStatus;
  requiredStations: Array<string | ObjectId>;
  theme: StationTheme;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IStationMethods {
  calculateXP: (attemptNumber: number) => number;
  isAccessible: () => Promise<boolean>;
}

export interface IStationDocument extends Omit<IStation, '_id' | 'planetId' | 'requiredStations'>, Document {
  _id: ObjectId;
  planetId: ObjectId;
  requiredStations: ObjectId[];
}

export interface IStationModel extends Model<IStationDocument> {
  getProgress: (planetId: string | ObjectId) => Promise<StationProgressStatus[]>;
}
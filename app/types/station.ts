// app/types/station.ts
import { Document, Model, Types } from 'mongoose';
import { ModuleStatus } from './planet';

export enum NPCType {
  MECHANIC = 'MECHANIC',
  BARTENDER = 'BARTENDER',
  MERCHANT = 'MERCHANT',
  SCIENTIST = 'SCIENTIST',
  PILOT = 'PILOT',
  ENGINEER = 'ENGINEER',
  ALIEN = 'ALIEN',
  ROBOT = 'ROBOT',
  EXPLORER = 'EXPLORER',
  MYSTIC = 'MYSTIC',
}

export enum StationEnvironment {
  // Chromanova-themed stations
  HOLOGRAPHIC_STUDIO = 'HOLOGRAPHIC_STUDIO',
  DESIGN_LAB = 'DESIGN_LAB',
  CREATIVE_HUB = 'CREATIVE_HUB',
  
  // Quantumcore-themed stations
  QUANTUM_LAB = 'QUANTUM_LAB',
  DATA_CENTER = 'DATA_CENTER',
  ALGORITHM_CHAMBER = 'ALGORITHM_CHAMBER',
  
  // Syntaxia-themed stations
  CODE_FORGE = 'CODE_FORGE',
  DEBUG_ARENA = 'DEBUG_ARENA',
  SYNTAX_SANCTUARY = 'SYNTAX_SANCTUARY',
  
  // Mission Control-themed stations
  MISSION_BRIDGE = 'MISSION_BRIDGE',
  CONTROL_CENTER = 'CONTROL_CENTER',
  SPACE_DOCK = 'SPACE_DOCK'
}

export interface IStationMethods {
  calculateXP(attemptNumber: number): number;
  isAccessible(): Promise<boolean>;
}

export interface IStationModel extends Model<IStationDocument> {
  getProgress(planetId: string): Promise<Array<{
    stationNumber: number;
    isComplete: boolean;
    bestAttempt: {
      attemptNumber: number;
      earnedXP: number;
    } | null;
    isAccessible: boolean;
  }>>;
}

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface Attempt {
  timestamp: Date;
  code: string;
  passed: boolean;
  earnedXP: number;
}

interface BestAttempt {
  attemptNumber: number;
  earnedXP: number;
}

// Base station interface
export interface IStation {
  planetId: Types.ObjectId;
  stationNumber: number;
  name: string;
  environment: StationEnvironment;
  npc: {
    type: NPCType;
    name: string;
    dialogue: {
      greeting: string;
      hint: string;
      success: string;
      failure: string;
    };
    appearance: string;
  };
  challenge: {
    title: string;
    description: string;
    difficulty: string;
    initialCode: string;
    solution: string;
    testCases: TestCase[];
    hints: string[];
    baseXPReward: number;
    xpDecayFactor: number;
  };
  progress: {
    currentCode?: string;
    attempts: Attempt[];
    bestAttempt: BestAttempt | null;
    isComplete: boolean;
  };
  completionStatus: ModuleStatus;
  requiredStations: Types.ObjectId[];
  theme: {
    backgroundColor?: string;
    ambientSound?: string;
    specialEffects: string[];
    planetStyle: 'chromanova' | 'syntaxia' | 'quantumcore' | 'mission-control';
    glowColor?: string;
    backgroundStars: boolean;
  };
}

// Methods interface
export interface IStationMethods {
  calculateXP(attemptNumber: number): number;
  isAccessible(): Promise<boolean>;
}

// Document interface
export interface IStationDocument extends Document<Types.ObjectId>, IStation {
  calculateXP(attemptNumber: number): number;
  isAccessible(): Promise<boolean>;
}
// Model interface
export interface IStationModel extends Model<IStationDocument> {
  getProgress(planetId: string): Promise<Array<{
    stationNumber: number;
    isComplete: boolean;
    bestAttempt: {
      attemptNumber: number;
      earnedXP: number;
    } | null;
    isAccessible: boolean;
  }>>;
}
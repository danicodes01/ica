export enum ChallengeDifficulty {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED',
    EXPERT = 'EXPERT'
  }
  
  export interface Challenge {
    id: string;
    title: string;
    description: string;
    difficulty: ChallengeDifficulty;
    xpReward: number;
    timeLimit?: number; // in minutes
    attempts: number;
    hints: string[];
    solution: string;
    testCases: {
      input: string;
      expectedOutput: string;
      isHidden: boolean;
    }[];
  }
  
  export interface ChallengeProgress {
    challengeId: string;
    completed: boolean;
    attempts: number;
    bestTime?: number;
    lastAttemptAt?: Date;
  }
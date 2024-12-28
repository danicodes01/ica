import { Station, ModuleStatus } from '../types/station';
import { GameArea } from '../types/game';
import { ChallengeDifficulty } from '../types/challenges';

// Helper function to calculate positions
const getRelativePosition = (
  width: number,
  height: number,
  percentX: number,
  percentY: number,
) => ({
  x: width * percentX,
  y: height * percentY,
  radius: Math.min(width, height) * 0.05, // 5% of smallest dimension
});

export const getGameStations = (width: number, height: number): Station[] => [
  {
    id: 'frontend-corps',
    name: 'CHROMANOVA',
    type: 'venus', // Added type for drawing
    area: GameArea.CHROMANOVA,
    position: getRelativePosition(width, height, 0.25, 0.5),
    icon: '🌌',
    description: 'Master UI/UX & frontend systems',
    learningPath: {
      title: 'Frontend Development Path',
      description: 'Learn modern frontend development practices and design.',
      modules: [
        {
          id: 'react-basics',
          title: 'React Fundamentals',
          description: 'Learn the core concepts of React',
          difficulty: ChallengeDifficulty.BEGINNER,
          challenges: ['react-intro', 'state-props', 'hooks-basic'],
          xpReward: 100,
          completionStatus: ModuleStatus.AVAILABLE,
        },
      ],
      totalXP: 1000,
    },
    isUnlocked: true,
  },
  {
    id: 'systems-division',
    name: 'SYNTAXIA',
    type: 'saturn', // Added type for drawing
    area: GameArea.SYNTAXIA,
    position: getRelativePosition(width, height, 0.75, .56),
    icon: '🛰️',
    description: 'Core systems & algorithms',
    learningPath: {
      title: 'Systems Engineering Path',
      description: 'Core systems & algorithms where logic, backend systems, and APIs are mastered.',
      modules: [
        {
          id: 'algo-basics',
          title: 'Algorithm Fundamentals',
          description: 'Learn essential algorithms and data structures',
          difficulty: ChallengeDifficulty.BEGINNER,
          challenges: ['sorting-basics', 'search-algo', 'data-structures'],
          xpReward: 100,
          completionStatus: ModuleStatus.LOCKED,
        },
      ],
      totalXP: 1200,
    },
    isUnlocked: false,
    requiredStations: ['frontend-corps'],
  },
  {
    id: 'mission-control',
    name: 'Mission Control',
    type: 'moon', // Added type for drawing
    area: GameArea.MISSION_CONTROL,
    position: getRelativePosition(width, height, 0.5, 0.7),
    icon: '🪐',
    description: 'Central hub for learning and progress',
    learningPath: {
      title: 'Mission Control',
      description: 'Track your progress',
      modules: [],
      totalXP: 0,
    },
    isUnlocked: true,
  },  {
    id: 'quantum-core',
    name: 'QUANTUMCORE',
    type: 'niburu', 
    area: GameArea.QUANTUMCORE,
    position: getRelativePosition(width, height, 0.5, .36),
    icon: '⚛️',
    description: 'Where quantum algorithms and data science solve complex problems',
    learningPath: {
      title: 'Data Science & Quantum Computing Path',
      description: 'Dive into the mysteries of data science, quantum computing, and machine learning.',
      modules: [
        {
          id: 'quantum-algorithms',
          title: 'Quantum Algorithm Fundamentals',
          description: 'Explore quantum computing principles and how to solve complex problems with quantum algorithms.',
          difficulty: ChallengeDifficulty.INTERMEDIATE,
          challenges: ['quantum-basics', 'machine-learning-basics'],
          xpReward: 200,
          completionStatus: ModuleStatus.LOCKED,
        },
      ],
      totalXP: 1500,
    },
    isUnlocked: false,
    requiredStations: ['frontend-corps', 'systems-division'],
  },
];

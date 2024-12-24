import { Station, ModuleStatus } from '../types/station';
import { GameArea } from '../types/game';
import { ChallengeDifficulty } from '../types/challenges';

// Helper function to calculate positions
const getRelativePosition = (
  width: number, 
  height: number,
  percentX: number,
  percentY: number
) => ({
  x: width * percentX,
  y: height * percentY,
  radius: Math.min(width, height) * 0.05 // 5% of smallest dimension
});

export const getGameStations = (width: number, height: number): Station[] => [
  {
    id: 'frontend-corps',
    name: 'Frontend Engineering Corps',
    type: 'venus', // Added type for drawing
    area: GameArea.FRONTEND_CORPS,
    position: getRelativePosition(width, height, 0.25, 0.3),
    icon: '🛸',
    description: 'Master frontend engineering with challenges in UI/UX, state management, and optimization.',
    learningPath: {
      title: 'Frontend Development Path',
      description: 'Learn modern frontend development practices',
      modules: [
        {
          id: 'react-basics',
          title: 'React Fundamentals',
          description: 'Learn the core concepts of React',
          difficulty: ChallengeDifficulty.BEGINNER,
          challenges: ['react-intro', 'state-props', 'hooks-basic'],
          xpReward: 100,
          completionStatus: ModuleStatus.AVAILABLE
        }
      ],
      totalXP: 1000
    },
    isUnlocked: true
  },
  {
    id: 'systems-division',
    name: 'Systems Engineering Division',
    type: 'saturn', // Added type for drawing
    area: GameArea.SYSTEMS_DIVISION,
    position: getRelativePosition(width, height, 0.75, 0.3),
    icon: '🛰️',
    description: 'Dive into systems engineering with algorithms, data structures, and system design.',
    learningPath: {
      title: 'Systems Engineering Path',
      description: 'Master system design and backend development',
      modules: [
        {
          id: 'algo-basics',
          title: 'Algorithm Fundamentals',
          description: 'Learn essential algorithms and data structures',
          difficulty: ChallengeDifficulty.BEGINNER,
          challenges: ['sorting-basics', 'search-algo', 'data-structures'],
          xpReward: 100,
          completionStatus: ModuleStatus.LOCKED
        }
      ],
      totalXP: 1200
    },
    isUnlocked: false,
    requiredStations: ['frontend-corps']
  },
  {
    id: 'mission-control',
    name: 'Mission Control',
    type: 'moon', // Added type for drawing
    area: GameArea.MISSION_CONTROL,
    position: getRelativePosition(width, height, 0.5, 0.7),
    icon: '🪐',
    description: 'Central hub for learning path selection and progress tracking.',
    learningPath: {
      title: 'Mission Control Center',
      description: 'Track your progress and choose your path',
      modules: [],
      totalXP: 0
    },
    isUnlocked: true
  }
];
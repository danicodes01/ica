import { ModuleStatus } from '@/app/types/planet';
import { Planet } from '../../../../../models/Planet'; // Adjust the import path accordingly
import { connect } from 'mongoose'; // Make sure you're connecting to MongoDB before running this script

const seedPlanets = async () => {
  await connect(process.env.MONGODB_URI!); // Connect to MongoDB

  const planets = [
    {
      name: 'Mission Control',
      type: 'mission-control',
      description: 'A place where your adventure begins.',
      position: { x: 100, y: 200, radius: 300 },
      learningPath: {
        title: 'Mission Control Path',
        description: 'A series of challenges to prepare for the journey.',
        modules: [
          {
            id: 'module-id-1',
            title: 'Introduction to Coding',
            description: 'Basic coding fundamentals',
            difficulty: 'beginner',
            challenges: ['challenge-1', 'challenge-2'],
            xpReward: 100,
            completionStatus: ModuleStatus.LOCKED
          },
          {
            id: 'module-id-2',
            title: 'First Steps',
            description: 'Getting started with programming',
            difficulty: 'beginner',
            challenges: ['challenge-3', 'challenge-4'],
            xpReward: 150,
            completionStatus: ModuleStatus.UNLOCKED
          }
        ],
        totalXP: 1000
      },
      isUnlocked: true,
      requiredPlanets: []
    },
    {
      name: 'Syntaxia',
      type: 'syntaxia',
      description: 'A planet focused on learning coding fundamentals.',
      position: { x: 200, y: 300, radius: 400 },
      learningPath: {
        title: 'Syntaxia Path',
        description: 'Master basic coding syntax and structures.',
        modules: [
          {
            id: 'module-id-3',
            title: 'Advanced Syntax',
            description: 'Exploring complex syntax structures',
            difficulty: 'intermediate',
            challenges: ['challenge-5', 'challenge-6'],
            xpReward: 200,
            completionStatus: ModuleStatus.LOCKED
          },
          {
            id: 'module-id-4',
            title: 'Code Patterns',
            description: 'Understanding common coding patterns',
            difficulty: 'intermediate',
            challenges: ['challenge-7', 'challenge-8'],
            xpReward: 250,
            completionStatus: ModuleStatus.AVAILABLE
          }
        ],
        totalXP: 1200
      },
      isUnlocked: false,
      requiredPlanets: []
    }
  ];

  try {
    await Planet.insertMany(planets);
    console.log('Planets seeded successfully!');
  } catch (error) {
    console.error('Error seeding planets:', error);
  } finally {
    process.exit(0); // Close the process after seeding
  }
};

seedPlanets();

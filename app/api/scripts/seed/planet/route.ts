import { Planet } from '../../../../../models/Planet'; // Adjust the import path accordingly
import { connect } from 'mongoose'; // Make sure you're connecting to MongoDB before running this script

const seedPlanets = async () => {
  await connect(process.env.MONGODB_URI!); // Connect to MongoDB

  const planets = [
    {
      id: '1',
      name: 'Mission Control',
      type: 'mission-control',
      area: 'some-area', // Adjust based on your actual `GameArea` type
      position: { x: 100, y: 200, radius: 300 },
      icon: '/assets/mission-control.png',
      description: 'A place where your adventure begins.',
      learningPath: {
        title: 'Mission Control Path',
        description: 'A series of challenges to prepare for the journey.',
        modules: ['module-id-1', 'module-id-2'], // List of module ids
        totalXP: 1000,
      },
      isUnlocked: true,
      requiredStations: ['Launch Station'],
    },
    {
      id: '2',
      name: 'Syntaxia',
      type: 'syntaxia',
      area: 'some-area',
      position: { x: 200, y: 300, radius: 400 },
      icon: '/assets/syntaxia.png',
      description: 'A planet focused on learning coding fundamentals.',
      learningPath: {
        title: 'Syntaxia Path',
        description: 'Master basic coding syntax and structures.',
        modules: ['module-id-3', 'module-id-4'],
        totalXP: 1200,
      },
      isUnlocked: false,
      requiredStations: ['Syntax Station'],
    },
    // Add more planets as needed
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

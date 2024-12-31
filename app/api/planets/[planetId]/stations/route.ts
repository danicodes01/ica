import { NextRequest, NextResponse } from 'next/server';
import { StationEnvironment, NPCType } from '@/app/types/station';
import { ModuleStatus } from '@/app/types/planet';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ planetId: string }> }
) {
  try {
    const resolvedParams = await context.params;
    const planetId = resolvedParams.planetId;

    if (!planetId) {
      return NextResponse.json(
        { error: 'Invalid or missing planetId' },
        { status: 400 }
      );
    }

    const stations = Array.from({ length: 10 }, (_, i) => {
      const stationNumber = i + 1;
      const stationId = `${planetId}-${stationNumber}`;
      
      return {
        _id: stationId,
        planetId,
        stationNumber,
        name: getStationName(stationNumber),
        environment: getEnvironment(stationNumber),
        npc: generateNPC(stationNumber),
        challenge: generateChallenge(stationNumber),
        progress: {
          currentCode: undefined,
          attempts: [],
          bestAttempt: null,
          isComplete: false,
        },
        completionStatus:
          stationNumber === 1 ? ModuleStatus.UNLOCKED : ModuleStatus.LOCKED,
        requiredStations:
          stationNumber > 1 ? [`${planetId}-${stationNumber - 1}`] : [],
        theme: getTheme(planetId, stationNumber),
      };
    });

    return NextResponse.json(stations);
  } catch (error) {
    console.error('Error in stations route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
function getStationName(stationNumber: number): string {
  const names = [
    'Quantum Gas Station',
    'Code Café',
    'Debug Diner',
    'Binary Bar',
    'Algorithm Arena',
    'Data Structure Den',
    'Function Factory',
    'Logic Lab',
    'Memory Market',
    'Recursion Resort'
  ];
  return names[stationNumber - 1];
}

function getEnvironment(stationNumber: number): StationEnvironment {
  if (stationNumber === 10) return StationEnvironment.BOSS;
  return stationNumber % 2 === 0 ? StationEnvironment.TRAINING : StationEnvironment.CHALLENGE;
}

function generateNPC(stationNumber: number) {
  return {
    type: NPCType.ALIEN,
    name: `Instructor ${stationNumber}`,
    dialogue: {
      greeting: `Welcome to Station ${stationNumber}!`,
      hint: 'Think carefully about your approach...',
      success: 'Excellent work! You\'ve mastered this challenge.',
      failure: 'Don\'t give up! Every error is a learning opportunity.'
    },
    appearance: '👽'
  };
}

function generateChallenge(stationNumber: number) {
  return {
    title: `Challenge ${stationNumber}`,
    description: `Station ${stationNumber} Coding Challenge`,
    difficulty: stationNumber <= 3 ? 'Beginner' : 
                stationNumber <= 7 ? 'Intermediate' : 'Advanced',
    initialCode: 'function solution() {\n  // Your code here\n}',
    solution: 'function solution() {\n  return true;\n}',
    testCases: [
      { input: 'test', expectedOutput: 'test' }
    ],
    hints: ['Think carefully about the problem'],
    baseXPReward: 100 * stationNumber,
    xpDecayFactor: 0.8
  };
}

function getTheme(planetId: string, stationNumber: number) {
  const themes = {
    'systems-division': {
      backgroundColor: '#1a1a2e',
      glowColor: '#5E00FF',
      planetStyle: 'syntaxia',
      specialEffects: ['data-particles', 'code-rain']
    },
    'frontend-corps': {
      backgroundColor: '#2e1a1a',
      glowColor: '#FF5E00',
      planetStyle: 'chromanova',
      specialEffects: ['pixel-dust', 'color-shift']
    },
    'quantum-core': {
      backgroundColor: '#1a2e1a',
      glowColor: '#00FF5E',
      planetStyle: 'quantumcore',
      specialEffects: ['quantum-particles', 'matrix-rain']
    }
  };

  return {
    ...themes[planetId as keyof typeof themes],
    ambientSound: `station-${stationNumber}-ambient.mp3`,
    backgroundStars: true
  };
}
'use client';
// app/_components/game/stations/station-view.tsx
import { useEffect, useState } from 'react';
import { useStationsStore } from '@/app/store/stations';
import { useRouter } from 'next/navigation';
import { IStation, StationProgress } from '@/app/types/station';
import { ModuleStatus } from '@/app/types/planet';

interface StationViewProps {
  stationId: string;
}

export default function StationView({ stationId }: StationViewProps) {
  const router = useRouter();
  const [station, setStation] = useState<IStation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { updateStationProgress } = useStationsStore();
  const [phase, setPhase] = useState<'entrance' | 'challenge' | 'completion'>('entrance');
  const [isEntering, setIsEntering] = useState(true);


  useEffect(() => {
    let entranceTimeout: NodeJS.Timeout;
    let errorTimeout: NodeJS.Timeout;

    const loadStation = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const planetId = stationId.split('-').slice(0, -1).join('-');
        if (!planetId) {
          throw new Error('Invalid station ID format');
        }

        const response = await fetch(`/api/planets/${planetId}/stations`);
        if (!response.ok) {
          throw new Error('Failed to fetch station data');
        }

        const stations = await response.json();
        const stationNumber = parseInt(stationId.split('-').pop() || '1');
        const currentStation = stations.find((s: { stationNumber: number }) => 
          s.stationNumber === stationNumber
        );

        if (!currentStation) {
          throw new Error('Station not found');
        }

        if (currentStation.completionStatus === ModuleStatus.LOCKED) {
          throw new Error('Station is locked');
        }

        setStation(currentStation);
        entranceTimeout = setTimeout(() => setIsEntering(false), 1000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        errorTimeout = setTimeout(() => router.push('/'), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    loadStation();

    return () => {
      clearTimeout(entranceTimeout);
      clearTimeout(errorTimeout);
    };
  }, [stationId, router]);

  // Handle challenge completion
  const handleChallengeComplete = async (progress: StationProgress) => {
    if (!station) return;
    
    // Convert ObjectId to string
    await updateStationProgress(station._id.toString(), progress);
    setPhase('completion');
  };

  const handleExit = () => {
    router.push('/');
  };

  if (!station) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-white font-ps2p">Loading station...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-red-500 font-ps2p">{error}</div>
      </div>
    );
  }

  // Render different phases of the station
  const renderPhase = () => {
    switch (phase) {
      case 'entrance':
        return (
          <div className='fixed inset-0 flex items-center justify-center'>
            <div
              className={`transition-opacity duration-1000 
                ${isEntering ? 'opacity-0' : 'opacity-100'}`}
            >
              <h2 className='text-2xl font-ps2p text-[color:var(--game-text)] mb-4'>
                {station.name}
              </h2>
              <div className='bg-black/50 p-6 rounded-lg'>
                <div className='mb-4'>
                  <p className='font-ps2p text-white'>
                    {station.npc.dialogue.greeting}
                  </p>
                </div>
                <button
                  onClick={() => setPhase('challenge')}
                  className='bg-purple-600 hover:bg-purple-700 text-white font-ps2p py-2 px-4 rounded'
                >
                  Begin Challenge
                </button>
              </div>
            </div>
          </div>
        );

        case 'challenge':
            return (
                <div className='fixed inset-0 flex items-center justify-center'>
                  <div className='bg-black/50 p-6 rounded-lg max-w-4xl w-full mx-4'>
                    <h3 className='text-xl font-ps2p text-[color:var(--game-text)] mb-4'>
                      {station.challenge.title}
                    </h3>
                    <p className='font-ps2p text-white mb-4'>
                      {station.challenge.description}
                    </p>
                    <div className='bg-gray-800 p-4 rounded mb-4'>
                      <pre className='text-white font-mono'>
                        {station.challenge.initialCode}
                      </pre>
                      {/* Temporary submission button until CodeEditor is implemented */}
                      <button
                        onClick={() => handleChallengeComplete({
                          currentCode: station.challenge.initialCode,
                          attempts: [],
                          bestAttempt: null,
                          isComplete: true
                        })}
                        className='bg-blue-600 hover:bg-blue-700 text-white font-ps2p py-2 px-4 rounded mt-4'
                      >
                        Submit Solution
                      </button>
                    </div>
                    <div className='flex justify-between mt-4'>
                      <button
                        onClick={() => setPhase('entrance')}
                        className='bg-gray-600 hover:bg-gray-700 text-white font-ps2p py-2 px-4 rounded'
                      >
                        Back
                      </button>
                      <button
                        onClick={handleExit}
                        className='bg-red-600 hover:bg-red-700 text-white font-ps2p py-2 px-4 rounded'
                      >
                        Exit Station
                      </button>
                    </div>
                  </div>
                </div>
              );
      case 'completion':
        return (
          <div className='fixed inset-0 flex items-center justify-center'>
            <div className='bg-black/50 p-6 rounded-lg'>
              <h3 className='text-xl font-ps2p text-[color:var(--game-text)] mb-4'>
                Challenge Complete!
              </h3>
              <p className='font-ps2p text-white mb-4'>
                {station.npc.dialogue.success}
              </p>
              <button
                onClick={handleExit}
                className='bg-green-600 hover:bg-green-700 text-white font-ps2p py-2 px-4 rounded'
              >
                Return to Space
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className='fixed inset-0'
      style={{
        backgroundColor: station.theme.backgroundColor,
        transition: 'all 0.5s ease-in-out',
      }}
    >
      {renderPhase()}
    </div>
  );
}

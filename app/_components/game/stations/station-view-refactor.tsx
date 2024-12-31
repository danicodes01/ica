// // app/_components/game/stations/station-view.tsx
// 'use client';
// import { useEffect, useState } from 'react';
// import { useStationsStore } from '@/app/store/stations';
// import { useRouter } from 'next/navigation';
// import { IStation, StationProgress } from '@/app/types/station';
// import { ModuleStatus } from '@/app/types/planet';
// import CodeEditor from '../../editor/CodeEditor';

// import EntrancePhase from './phases/EntrancePhase';
// import ChallengePhase from './phases/ChallengePhase';
// import CompletionPhase from './phases/CompletionPhase';

// interface StationViewProps {
//   stationId: string;
// }

// export default function StationView({ stationId }: StationViewProps) {
//   const router = useRouter();
//   const [station, setStation] = useState<IStation | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const { updateStationProgress } = useStationsStore();
//   const [phase, setPhase] = useState<'entrance' | 'challenge' | 'completion'>(
//     'entrance',
//   );
//   const [language, setLanguage] = useState<string>('typescript'); // Default language

//   useEffect(() => {
//     let entranceTimeout: NodeJS.Timeout;
//     let errorTimeout: NodeJS.Timeout;

//     const loadStation = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         const planetId = stationId.split('-').slice(0, -1).join('-');
//         if (!planetId) {
//           throw new Error('Invalid station ID format');
//         }

//         const response = await fetch(`/api/planets/${planetId}/stations`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch station data');
//         }

//         const stations = await response.json();
//         const stationNumber = parseInt(stationId.split('-').pop() || '1');
//         const currentStation = stations.find(
//           (s: { stationNumber: number }) => s.stationNumber === stationNumber,
//         );

//         if (!currentStation) {
//           throw new Error('Station not found');
//         }

//         if (currentStation.completionStatus === ModuleStatus.LOCKED) {
//           throw new Error('Station is locked');
//         }

//         setStation(currentStation);
//         entranceTimeout = setTimeout(() => {}, 1000);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An error occurred');
//         errorTimeout = setTimeout(() => router.push('/'), 3000);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadStation();

//     return () => {
//       clearTimeout(entranceTimeout);
//       clearTimeout(errorTimeout);
//     };
//   }, [stationId, router]);

//   const handleLanguageChange = (newLanguage: string) => {
//     setLanguage(newLanguage);
//   };

//   const handleChallengeComplete = async (progress: StationProgress) => {
//     if (!station) return;

//     await updateStationProgress(station._id.toString(), progress);
//     setPhase('completion');
//   };

//   const handleExit = () => {
//     router.push('/');
//   };

//   if (!station) return null;

//   if (isLoading) {
//     return (
//       <div className='fixed inset-0 flex items-center justify-center bg-black'>
//         <div className='text-white font-ps2p'>Loading station...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className='fixed inset-0 flex items-center justify-center bg-black'>
//         <div className='text-red-500 font-ps2p'>{error}</div>
//       </div>
//     );
//   }

//   // Render different phases
//   const renderPhase = () => {
//     switch (phase) {
//       case 'entrance':
//         return (
//           <EntrancePhase
//             station={station}
//             onNext={() => setPhase('challenge')}
//           />
//         );
  
//       case 'challenge':
//         return (
//           <ChallengePhase
//             station={station}
//             language={language}
//             onLanguageChange={handleLanguageChange}
//             onComplete={handleChallengeComplete}
//             onBack={() => setPhase('entrance')}
//             onExit={handleExit}
//           />
//         );
  
//       case 'completion':
//         return (
//           <CompletionPhase
//             station={station}
//             onExit={handleExit}
//           />
//         );
  
//       default:
//         return null;
//     }
//   };
  
//   return (
//     <div
//       className='fixed inset-0'
//       style={{
//         backgroundColor: station.theme.backgroundColor,
//         transition: 'all 0.5s ease-in-out',
//       }}
//     >
//       {renderPhase()}
//     </div>
//   );
// }

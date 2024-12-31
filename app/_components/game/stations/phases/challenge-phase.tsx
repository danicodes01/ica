// import React from 'react';
// import CodeEditor from '../../../editor/CodeEditor';
// import { IStation, StationProgress } from '@/app/types/station';
// import router from 'next/router';

// interface ChallengePhaseProps {
//   station: IStation;
//   language: string;
//   onLanguageChange: (language: string) => void;
//   onComplete: (progress: StationProgress) => void;
//   onBack: () => void;
//   onExit: () => void;
// }

// const handleExit = () => {
//   router.push('/');
// };

// export default function ChallengePhase({
//   station,
//   language,
//   onLanguageChange,
//   onComplete,
//   onBack,
//   onExit,
// }: ChallengePhaseProps) {
//   return (
//        <div className='fixed inset-0 flex flex-col p-4 overflow-auto'>
//             <div className='max-w-4xl w-full mx-auto'>
//               {/* Challenge Information */}
//               <div className='bg-black/50 p-6 rounded-lg mb-4'>
//                 <h3 className='text-xl font-ps2p text-[color:var(--game-text)] mb-4'>
//                   {station.challenge.title}
//                 </h3>
//                 <div className='space-y-4 mb-6'>
//                   <p className='font-ps2p text-white'>
//                     {station.challenge.description}
//                   </p>
//                   {station.challenge.examples ? (
//                     <div>
//                       <h4 className='text-lg font-ps2p text-[color:var(--game-text)] mb-2'>
//                         Examples:
//                       </h4>
//                       <pre className='bg-gray-800 p-4 rounded font-mono text-white'>
//                         {station.challenge.examples}
//                       </pre>
//                     </div>
//                   ) : null}
//                 </div>
//               </div>

//               {/* Code Editor Section */}
//               <div className='bg-black/50 p-6 rounded-lg'>
//                 <CodeEditor
//                   initialCode={station.challenge.initialCode}
//                   language={language}
//                   onCodeSubmit={async code => {
//                     // Handle code submission
//                     handleChallengeComplete({
//                       currentCode: code,
//                       attempts: [],
//                       bestAttempt: null,
//                       isComplete: true,
//                     });
//                   }}
//                 />
//               </div>

//                 {/* Language Switcher */}
//                 <div className="flex justify-end mt-4">
//                 <button
//                   onClick={() => handleLanguageChange('javascript')}
//                   className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
//                 >
//                   JavaScript
//                 </button>
//                 <button
//                   onClick={() => handleLanguageChange('typescript')}
//                   className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
//                 >
//                   TypeScript
//                 </button>
//                 <button
//                   onClick={() => handleLanguageChange('python')}
             
//                   className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded ml-2"
//                 >
//                   Python
//                 </button>
//               </div>

//               {/* Navigation Buttons */}
//               <div className='flex justify-between mt-4'>
//                 <button
//                   onClick={() => setPhase('entrance')}
//                   className='bg-gray-600 hover:bg-gray-700 text-white font-ps2p py-2 px-4 rounded'
//                 >
//                   Back
//                 </button>
//                 <button
//                   onClick={handleExit}
//                   className='bg-red-600 hover:bg-red-700 text-white font-ps2p py-2 px-4 rounded'
//                 >
//                   Exit Station
//                 </button>
//               </div>
//             </div>
//     </div>
//   );
// }

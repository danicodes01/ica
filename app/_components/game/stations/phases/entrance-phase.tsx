// import React from 'react';
// import { IStation } from '@/app/types/station';

// interface EntrancePhaseProps {
//   station: IStation;
//   onNext: () => void;
// }

// export default function EntrancePhase({ station, onNext }: EntrancePhaseProps) {
//   return (
//     <div className='fixed inset-0 flex items-center justify-center'>
//       <div>
//         <h2 className='text-2xl font-ps2p text-[color:var(--game-text)] mb-4'>
//           {station.name}
//         </h2>
//         <div className='bg-black/50 p-6 rounded-lg'>
//           <p className='font-ps2p text-white'>{station.npc.dialogue.greeting}</p>
//           <button
//             onClick={onNext}
//             className='bg-purple-600 hover:bg-purple-700 text-white font-ps2p py-2 px-4 rounded'
//           >
//             Begin Challenge
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

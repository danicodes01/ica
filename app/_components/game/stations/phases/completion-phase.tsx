// import React from 'react';
// import { IStation } from '@/app/types/station';

// interface CompletionPhaseProps {
//   station: IStation;
//   onExit: () => void;
// }



// export default function CompletionPhase({
//   station,
//   onExit,
// }: CompletionPhaseProps) {
//   return (
//     <div className='fixed inset-0 flex items-center justify-center'>
//       <div className='bg-black/50 p-6 rounded-lg'>
//         <h3 className='text-xl font-ps2p text-[color:var(--game-text)] mb-4'>
//           Challenge Complete!
//         </h3>
//         <p className='font-ps2p text-white mb-4'>
//           {station.npc.dialogue.success}
//         </p>
//         <button
//           onClick={onExit}
//           className='bg-green-600 hover:bg-green-700 text-white font-ps2p py-2 px-4 rounded'
//         >
//           Return to Space
//         </button>
//       </div>
//     </div>
//   );
// }

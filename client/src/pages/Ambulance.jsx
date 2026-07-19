// // import { useNavigate } from 'react-router-dom'

// // function Ambulance() {
// //   const navigate = useNavigate()

// //   const numbers = [
// //     { icon: '🚑', name: 'Ambulance', number: '108', desc: 'National Ambulance Service' },
// //     { icon: '🏥', name: 'Maternity Ambulance', number: '102', desc: 'Pregnancy / Maternity Emergency' },
// //     { icon: '🚨', name: 'National Emergency', number: '112', desc: 'All Emergency Services' },
// //     { icon: '👮', name: 'Police', number: '100', desc: 'Police Emergency' },
// //     { icon: '🚒', name: 'Fire Brigade', number: '101', desc: 'Fire Emergency' },
// //     { icon: '👩', name: 'Women Helpline', number: '1091', desc: 'Women Safety' },
// //   ]

// //   return (
// //     <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
// //       <h2 style={{ color: '#922B21' }}>🚑 Emergency Numbers</h2>
// //       <p style={{ color: '#666', fontSize: '14px' }}>Tap karke seedha call karo</p>

// //       {numbers.map((item) => (
// //         <a
// //           key={item.number}
// //           href={`tel:${item.number}`}
// //           style={{
// //             textDecoration: 'none',
// //             display: 'flex',
// //             alignItems: 'center',
// //             justifyContent: 'space-between',
// //             background: '#fff',
// //             border: '1px solid #eee',
// //             boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
// //             padding: '16px',
// //             borderRadius: '10px',
// //             marginBottom: '12px',
// //             color: '#333'
// //           }}
// //         >
// //           <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
// //             <span style={{ fontSize: '28px' }}>{item.icon}</span>
// //             <div>
// //               <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{item.name}</div>
// //               <div style={{ fontSize: '12px', color: '#999' }}>{item.desc}</div>
// //             </div>
// //           </div>
// //           <div style={{
// //             background: '#922B21',
// //             color: 'white',
// //             padding: '8px 16px',
// //             borderRadius: '20px',
// //             fontWeight: 'bold',
// //             fontSize: '16px'
// //           }}>
// //             {item.number}
// //           </div>
// //         </a>
// //       ))}

// //       <button
// //         onClick={() => navigate('/home')}
// //         style={{ width: '100%', padding: '12px', background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}
// //       >
// //         ← Back to Home
// //       </button>
// //     </div>
// //   )
// // }

// // export default Ambulance





// import { useNavigate } from 'react-router-dom'

// function Ambulance() {
//   const navigate = useNavigate()

//   const numbers = [
//     { icon: '🚑', name: 'Ambulance', number: '108', desc: 'National Ambulance Service', color: 'bg-red-500' },
//     { icon: '🏥', name: 'Maternity Ambulance', number: '102', desc: 'Pregnancy & Maternity Emergency', color: 'bg-pink-500' },
//     { icon: '🚨', name: 'National Emergency', number: '112', desc: 'All Emergency Services', color: 'bg-orange-500' },
//     { icon: '👮', name: 'Police', number: '100', desc: 'Police Emergency', color: 'bg-blue-600' },
//     { icon: '🚒', name: 'Fire Brigade', number: '101', desc: 'Fire Emergency', color: 'bg-red-600' },
//     { icon: '👩', name: 'Women Helpline', number: '1091', desc: 'Women Safety Helpline', color: 'bg-purple-500' },
//   ]

//   return (
//     <div className="min-h-screen bg-[#f7f7f8] flex flex-col">
//       <div className="max-w-4xl mx-auto w-full px-4 pt-6">
//         <div className="bg-white border border-gray-200 rounded-3xl shadow-sm px-6 py-4 flex items-center justify-between">
//           <div>
//             <h2 className="text-xl md:text-2xl font-semibold text-gray-900">🚑 Emergency Numbers</h2>
//             <p className="text-sm text-gray-500">Tap any number to call directly</p>
//           </div>
//           <button
//             onClick={() => navigate('/home')}
//             className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition"
//           >
//             Back Home
//           </button>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto w-full px-4 py-4">
//         <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-4 md:p-6 space-y-3">
          
//           {numbers.map((item) => (
//             <a
//               key={item.number}
//               href={`tel:${item.number}`}
//               className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 active:scale-[0.98] transition-all"
//             >
//               <div className="flex items-center gap-4">
//                 <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center text-2xl shadow-sm`}>
//                   {item.icon}
//                 </div>
//                 <div>
//                   <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
//                   <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <span className="text-lg font-bold text-gray-900">{item.number}</span>
//                 <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
//                   📞
//                 </div>
//               </div>
//             </a>
//           ))}
//         </div>

//         <div className="mt-4 bg-red-50 border border-red-100 rounded-3xl p-5">
//           <p className="text-red-600 text-sm font-semibold mb-1">⚠️ In case of life-threatening emergency</p>
//           <p className="text-red-500 text-xs">Call 112 immediately — National Emergency number works across all networks, even without balance.</p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Ambulance



















//DARK +LLIGHT MOOD---------------
import { useNavigate } from 'react-router-dom'

function Ambulance() {
  const navigate = useNavigate()

  const numbers = [
    { icon: '🚑', name: 'Ambulance', number: '108', desc: 'National Ambulance Service', color: 'bg-red-500' },
    { icon: '🏥', name: 'Maternity Ambulance', number: '102', desc: 'Pregnancy & Maternity Emergency', color: 'bg-pink-500' },
    { icon: '🚨', name: 'National Emergency', number: '112', desc: 'All Emergency Services', color: 'bg-orange-500' },
    { icon: '👮', name: 'Police', number: '100', desc: 'Police Emergency', color: 'bg-blue-600' },
    { icon: '🚒', name: 'Fire Brigade', number: '101', desc: 'Fire Emergency', color: 'bg-red-600' },
    { icon: '👩', name: 'Women Helpline', number: '1091', desc: 'Women Safety Helpline', color: 'bg-purple-500' },
  ]

  return (
    <div className="min-h-screen bg-[#f7f7f8] dark:bg-[#1e3d4a] dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-[#2d6176] dark:via-[#1e3d4a] dark:to-[#12262e] flex flex-col transition-colors duration-300">
      <div className="max-w-4xl mx-auto w-full px-4 pt-6">
        <div className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700/40 rounded-3xl shadow-sm dark:shadow-lg px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">🚑 Emergency Numbers</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">Tap any number to call directly</p>
          </div>
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-200 transition"
          >
            Back Home
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 py-4">
        <div className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700/40 rounded-3xl shadow-sm dark:shadow-lg p-4 md:p-6 space-y-3">
          
          {numbers.map((item) => (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-slate-700/40 hover:bg-gray-50 dark:hover:bg-slate-800/60 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center text-2xl shadow-sm`}>
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.name}</p>
                  <p className="text-xs text-gray-400 dark:text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">{item.number}</span>
                <div className="w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-gray-500 dark:text-slate-300">
                  📞
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/30 rounded-3xl p-5">
          <p className="text-red-600 dark:text-red-400 text-sm font-semibold mb-1">⚠️ In case of life-threatening emergency</p>
          <p className="text-red-500 dark:text-red-300/80 text-xs">Call 112 immediately — National Emergency number works across all networks, even without balance.</p>
        </div>
      </div>
    </div>
  )
}

export default Ambulance
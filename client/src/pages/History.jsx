// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'

// const EMERGENCY_ICONS = {
//   'Heart Attack': '❤️',
//   'Road Accident': '🚗',
//   'Period Emergency': '🩸',
//   'Safety Emergency': '🚨',
//   'Medical Emergency': '💊',
//   'Mental Health Crisis': '🧠',
//   'General Emergency': '🚨'
// }

// function History() {
//   const navigate = useNavigate()
//   const [logs, setLogs] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [searchTerm, setSearchTerm] = useState('')
//   const [filter, setFilter] = useState('all') // all | call | sms

//   const userId = localStorage.getItem('userId')

//   useEffect(() => {
//     if (!userId) {
//       navigate('/')
//       return
//     }
//     fetchHistory()
//   }, [userId, navigate])

//   const fetchHistory = async () => {
//     setLoading(true)
//     setError('')
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/quicksos/${userId}`)
//       setLogs(res.data)
//     } catch (err) {
//       setError('Unable to load SOS history. Please check your internet connection and try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const formatDate = (dateStr) => {
//     const d = new Date(dateStr)
//     const now = new Date()
//     const isToday = d.toDateString() === now.toDateString()
//     const yesterday = new Date(now)
//     yesterday.setDate(now.getDate() - 1)
//     const isYesterday = d.toDateString() === yesterday.toDateString()

//     const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

//     if (isToday) return `Today • ${time}`
//     if (isYesterday) return `Yesterday • ${time}`
//     return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ` • ${time}`
//   }

//   const filteredLogs = logs.filter((log) => {
//     const matchesFilter = filter === 'all' || log.method === filter
//     const matchesSearch =
//       log.phoneNumber?.includes(searchTerm) ||
//       log.emergencyType?.toLowerCase().includes(searchTerm.toLowerCase())
//     return matchesFilter && matchesSearch
//   })

//   return (
//     <div className="min-h-screen bg-[#f7f7f8] flex flex-col">

//       <div className="max-w-4xl mx-auto w-full px-4 pt-6">
//         <div className="bg-white border border-gray-200 rounded-3xl shadow-sm px-6 py-4 flex items-center justify-between">
//           <div>
//             <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
//               📜 SOS History {logs.length > 0 && `(${logs.length})`}
//             </h2>
//             <p className="text-sm text-gray-500">Your past Quick Call &amp; SMS alerts</p>
//           </div>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition"
//           >
//             ← Back
//           </button>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto w-full px-4 py-4 space-y-4">

//         {logs.length > 0 && (
//           <>
//             {/* Search bar */}
//             <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-4 py-3">
//               <input
//                 type="text"
//                 placeholder="🔍 Search phone number or emergency..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
//               />
//             </div>

//             {/* Filter buttons */}
//             <div className="flex gap-2">
//               {[
//                 { key: 'all', label: 'All' },
//                 { key: 'call', label: '📞 Calls' },
//                 { key: 'sms', label: '💬 SMS' }
//               ].map((f) => (
//                 <button
//                   key={f.key}
//                   onClick={() => setFilter(f.key)}
//                   className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
//                     filter === f.key
//                       ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
//                       : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   {f.label}
//                 </button>
//               ))}
//             </div>
//           </>
//         )}

//         {error && (
//           <div className="px-4 py-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
//             <p className="font-medium mb-1">Unable to load SOS history.</p>
//             <p className="text-xs text-red-500">Please check your internet connection and try again.</p>
//           </div>
//         )}

//         {loading ? (
//           <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-10 text-center">
//             <div className="w-6 h-6 border-2 border-gray-200 border-t-cyan-500 rounded-full animate-spin mx-auto" />
//             <p className="text-gray-400 text-sm mt-3">Loading SOS History...</p>
//           </div>
//         ) : logs.length === 0 ? (
//           <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-10 text-center">
//             <span className="text-4xl block mb-3">📭</span>
//             <p className="text-gray-600 text-sm font-medium">No SOS history found.</p>
//             <p className="text-gray-400 text-xs mt-1 mb-5">
//               Your emergency calls and SMS alerts will appear here.
//             </p>
//             <button
//               onClick={() => navigate('/sos')}
//               className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-sm font-medium transition"
//             >
//               Go to SOS
//             </button>
//           </div>
//         ) : filteredLogs.length === 0 ? (
//           <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8 text-center">
//             <p className="text-gray-400 text-sm">No results match your search/filter.</p>
//           </div>
//         ) : (
//           <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden divide-y divide-gray-100">
//             {filteredLogs.map((log) => (
//               <div
//                 key={log.id}
//                 className="px-5 py-5 flex items-start justify-between gap-3 hover:bg-gray-50 hover:shadow-inner transition-all duration-200"
//               >
//                 <div className="flex items-start gap-3">
//                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${
//                     log.method === 'call' ? 'bg-emerald-500' : 'bg-blue-500'
//                   }`}>
//                     {log.method === 'call' ? '📞' : '💬'}
//                   </div>
//                   <div>
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
//                         log.method === 'call'
//                           ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
//                           : 'bg-blue-50 text-blue-600 border border-blue-200'
//                       }`}>
//                         {log.method === 'call' ? 'Call' : 'SMS'}
//                       </span>
//                       <p className="text-sm font-medium text-gray-900">{log.phoneNumber}</p>
//                     </div>
//                     {log.emergencyType && (
//                       <span className="inline-block mt-1.5 text-[11px] bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
//                         {EMERGENCY_ICONS[log.emergencyType] || '🚨'} {log.emergencyType}
//                       </span>
//                     )}
//                     {log.location && (
//                       <p className="text-xs text-gray-400 mt-1.5">📍 {log.location}</p>
//                     )}
//                   </div>
//                 </div>
//                 <p className="text-xs text-gray-400 whitespace-nowrap">{formatDate(log.createdAt)}</p>
//               </div>
//             ))}
//           </div>
//         )}

//       </div>
//     </div>
//   )
// }

// export default History












//DARK+LIGHT MOOD BOTH-----------
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const EMERGENCY_ICONS = {
  'Heart Attack': '❤️',
  'Road Accident': '🚗',
  'Period Emergency': '🩸',
  'Safety Emergency': '🚨',
  'Medical Emergency': '💊',
  'Mental Health Crisis': '🧠',
  'General Emergency': '🚨'
}

function History() {
  const navigate = useNavigate()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all') // all | call | sms

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    if (!userId) {
      navigate('/')
      return
    }
    fetchHistory()
  }, [userId, navigate])

  const fetchHistory = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/quicksos/${userId}`)
      setLogs(res.data)
    } catch (err) {
      setError('Unable to load SOS history. Please check your internet connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const now = new Date()
    const isToday = d.toDateString() === now.toDateString()
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    const isYesterday = d.toDateString() === yesterday.toDateString()

    const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

    if (isToday) return `Today • ${time}`
    if (isYesterday) return `Yesterday • ${time}`
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ` • ${time}`
  }

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === 'all' || log.method === filter
    const matchesSearch =
      log.phoneNumber?.includes(searchTerm) ||
      log.emergencyType?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#f7f7f8] dark:bg-[#1e3d4a] dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-[#2d6176] dark:via-[#1e3d4a] dark:to-[#12262e] flex flex-col transition-colors duration-300">

      <div className="max-w-4xl mx-auto w-full px-4 pt-6">
        <div className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700/40 rounded-3xl shadow-sm dark:shadow-lg px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
              📜 SOS History {logs.length > 0 && `(${logs.length})`}
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">Your past Quick Call &amp; SMS alerts</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-200 transition"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 py-4 space-y-4">

        {logs.length > 0 && (
          <>
            {/* Search bar */}
            <div className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700/40 rounded-2xl shadow-sm px-4 py-3">
              <input
                type="text"
                placeholder="🔍 Search phone number or emergency..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'call', label: '📞 Calls' },
                { key: 'sms', label: '💬 SMS' }
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    filter === f.key
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700/40 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </>
        )}

        {error && (
          <div className="px-4 py-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl text-red-600 dark:text-red-400 text-sm">
            <p className="font-medium mb-1">Unable to load SOS history.</p>
            <p className="text-xs text-red-500 dark:text-red-300/80">Please check your internet connection and try again.</p>
          </div>
        )}

        {loading ? (
          <div className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700/40 rounded-3xl shadow-sm dark:shadow-lg p-10 text-center">
            <div className="w-6 h-6 border-2 border-gray-200 dark:border-slate-600 border-t-cyan-500 rounded-full animate-spin mx-auto" />
            <p className="text-gray-400 dark:text-slate-400 text-sm mt-3">Loading SOS History...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700/40 rounded-3xl shadow-sm dark:shadow-lg p-10 text-center">
            <span className="text-4xl block mb-3">📭</span>
            <p className="text-gray-600 dark:text-slate-200 text-sm font-medium">No SOS history found.</p>
            <p className="text-gray-400 dark:text-slate-400 text-xs mt-1 mb-5">
              Your emergency calls and SMS alerts will appear here.
            </p>
            <button
              onClick={() => navigate('/sos')}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-sm font-medium transition"
            >
              Go to SOS
            </button>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700/40 rounded-3xl shadow-sm dark:shadow-lg p-8 text-center">
            <p className="text-gray-400 dark:text-slate-400 text-sm">No results match your search/filter.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700/40 rounded-3xl shadow-sm dark:shadow-lg overflow-hidden divide-y divide-gray-100 dark:divide-slate-700/50">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="px-5 py-5 flex items-start justify-between gap-3 hover:bg-gray-50 dark:hover:bg-slate-800/60 hover:shadow-inner transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${
                    log.method === 'call' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}>
                    {log.method === 'call' ? '📞' : '💬'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        log.method === 'call'
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                          : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30'
                      }`}>
                        {log.method === 'call' ? 'Call' : 'SMS'}
                      </span>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{log.phoneNumber}</p>
                    </div>
                    {log.emergencyType && (
                      <span className="inline-block mt-1.5 text-[11px] bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 px-2 py-0.5 rounded-full">
                        {EMERGENCY_ICONS[log.emergencyType] || '🚨'} {log.emergencyType}
                      </span>
                    )}
                    {log.location && (
                      <p className="text-xs text-gray-400 dark:text-slate-400 mt-1.5">📍 {log.location}</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-400 dark:text-slate-400 whitespace-nowrap">{formatDate(log.createdAt)}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default History



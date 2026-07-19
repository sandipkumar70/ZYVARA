import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const MOODS = [
  { label: 'Happy', emoji: '😄', color: 'bg-yellow-50 border-yellow-300 text-yellow-700' },
  { label: 'Calm', emoji: '😌', color: 'bg-blue-50 border-blue-300 text-blue-700' },
  { label: 'Excited', emoji: '🤩', color: 'bg-pink-50 border-pink-300 text-pink-700' },
  { label: 'Neutral', emoji: '😐', color: 'bg-gray-50 border-gray-300 text-gray-700' },
  { label: 'Tired', emoji: '😴', color: 'bg-purple-50 border-purple-300 text-purple-700' },
  { label: 'Anxious', emoji: '😰', color: 'bg-orange-50 border-orange-300 text-orange-700' },
  { label: 'Sad', emoji: '😢', color: 'bg-indigo-50 border-indigo-300 text-indigo-700' },
  { label: 'Angry', emoji: '😠', color: 'bg-red-50 border-red-300 text-red-700' },
]

function Mood() {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [todayEntry, setTodayEntry] = useState(null)
  const [selectedMood, setSelectedMood] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const userId = localStorage.getItem('userId') || 1
  const isDark = document.documentElement.classList.contains("dark");

  useEffect(() => {
    fetchToday()
    fetchHistory()
  }, [])

  const fetchToday = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/mood/${userId}/today`)
      if (res.data) {
        setTodayEntry(res.data)
        setSelectedMood(res.data.mood)
        setNote(res.data.note || '')
      }
    } catch (err) {
      console.error('Error fetching today mood:', err)
    }
  }

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/mood/${userId}`)
      setHistory(res.data)
    } catch (err) {
      console.error('Error fetching mood history:', err)
    }
  }

  const saveMood = async () => {
    if (!selectedMood) {
      setMessage('Please select a mood first.')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      await axios.post('http://localhost:5000/api/mood', {
        userId,
        mood: selectedMood,
        note
      })
      setMessage(todayEntry ? 'Mood updated!' : 'Mood saved!')
      fetchToday()
      fetchHistory()
    } catch (err) {
      setMessage('Failed to save mood. Please try again.')
    }
    setLoading(false)
  }

  const deleteEntry = async (id) => {
    if (!window.confirm('Delete this mood entry?')) return
    try {
      await axios.delete(`http://localhost:5000/api/mood/${id}`)
      setHistory(prev => prev.filter(e => e.id !== id))
      if (todayEntry && todayEntry.id === id) {
        setTodayEntry(null)
        setSelectedMood('')
        setNote('')
      }
    } catch (err) {
      setMessage('Failed to delete entry.')
    }
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getMoodMeta = (moodLabel) => MOODS.find(m => m.label === moodLabel) || MOODS[3]

  // Stats calculate karo poori history se
  const getStats = () => {
    if (history.length === 0) return { mostFrequent: null, total: 0, streak: 0 }

    const counts = {}
    history.forEach(e => { counts[e.mood] = (counts[e.mood] || 0) + 1 })
    const mostFrequent = Object.keys(counts).reduce((a, b) => counts[a] >= counts[b] ? a : b)

    // Streak: aaj/kal se shuru karke consecutive days dekhna hai
    const sortedDates = [...history]
      .map(e => { const d = new Date(e.date); d.setHours(0, 0, 0, 0); return d.getTime() })
      .sort((a, b) => b - a)

    let streak = 0
    let cursor = new Date()
    cursor.setHours(0, 0, 0, 0)

    // Agar aaj entry nahi hai, kal se check karo
    if (!sortedDates.includes(cursor.getTime())) {
      cursor.setDate(cursor.getDate() - 1)
    }

    while (sortedDates.includes(cursor.getTime())) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    }

    return { mostFrequent, total: history.length, streak }
  }

  const stats = getStats()
  const recentHistory = history.slice(0, 7)

  return (
  <div
  className={`min-h-screen flex flex-col transition-colors duration-300 ${
    isDark
      ? "bg-[#111827] text-white"
      : "bg-[#f7f7f8] text-gray-900"
  }`}
>

  <div className="max-w-4xl mx-auto w-full px-4 pt-6">

 <div
   className={`rounded-3xl shadow-sm px-6 py-4 flex items-center justify-between ${
    isDark
      ? "bg-gray-800  backdrop-blur-md  border-white/10 border border-gray-700"
      : "bg-white border border-gray-200"
  }`}
>



 <div>
    <h2
      className={`text-xl md:text-2xl font-semibold ${
        isDark ? "text-white" : "text-gray-900"
      }`}
       >   🧠 Mood Tracker</h2>


        <p className={isDark ? "text-sm text-gray-400" : "text-sm text-gray-500"}>How are you feeling today?</p>
          </div>

          <button
            onClick={() => navigate(-1)}
          
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}

          >
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 py-4 space-y-4">

        {message && (
          <div className={`px-4 py-3 rounded-2xl text-sm font-medium ${
            message.includes('saved') || message.includes('updated')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {message}
          </div>
        )}

   <div
    className={`rounded-3xl shadow-sm p-6 space-y-4 ${
      isDark
        ? "bg-gray-800 border border-gray-700"
        : "bg-white border border-gray-200"
    }`}
  >


    <h3
      className={`font-semibold ${
        isDark ? "text-white" : "text-gray-900"
      }`}
    > 
    {todayEntry ? "Today's mood" : "Log today's mood"}
      </h3>


      <div className="grid grid-cols-4 gap-2.5">
            {MOODS.map((m) => (
              <button
                key={m.label}
                onClick={() => setSelectedMood(m.label)}
                className={`flex flex-col items-center gap-1.5 py-3.5 rounded-2xl border-2 transition ${
                  selectedMood === m.label
                    ? `${m.color} border-current scale-[1.03]`
                    
                  : isDark
                      ? "bg-slate-600 border-transparent text-white hover:bg-gray-600"
                      : "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100"

                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-[11px] font-medium">{m.label}</span>
              </button>
            ))}
          </div>

          <div>
            <textarea
              placeholder="Add a note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 200))}
              maxLength={200}
              rows={3}
              
            className={`w-full px-4 py-3 rounded-2xl text-sm transition resize-none focus:outline-none ${
                isDark
                  ? "bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500"
                  : "bg-gray-50 border border-gray-200 text-gray-900 focus:border-gray-400"
              }`}

            />
            <p className="text-[11px] text-gray-400 text-right mt-1">{note.length}/200</p>
          </div>

          <button
            onClick={saveMood}
            disabled={loading}
            
          className={`w-full font-medium py-3.5 rounded-2xl text-sm transition disabled:opacity-50 ${
            isDark
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-black hover:bg-gray-900 text-white"
          }`}

          >
            {loading ? 'Saving...' : todayEntry ? 'Update Mood' : 'Save Mood'}
          </button>
        </div>

        {history.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
          <div
              className={`rounded-2xl shadow-sm p-4 text-center ${
                isDark
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >

              <p className="text-2xl mb-1">{stats.mostFrequent ? getMoodMeta(stats.mostFrequent).emoji : '—'}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Most Frequent</p>

              <p
                className={`text-xs font-semibold mt-0.5 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >{stats.mostFrequent || '—'}</p>

            </div>
            <div
              className={`rounded-2xl shadow-sm p-4 text-center ${
                isDark
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >

              <p className="text-2xl mb-1">📅</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Total Entries</p>

              <p
                className={`text-xs font-semibold mt-0.5 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >{stats.total}</p>

            </div>
            <div
              className={`rounded-2xl shadow-sm p-4 text-center ${
                isDark
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >

              <p className="text-2xl mb-1">🔥</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Current Streak</p>

              <p
                className={`text-xs font-semibold mt-0.5 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >{stats.streak} {stats.streak === 1 ? 'Day' : 'Days'}</p>
            </div>
          </div>
        )}


        <div
          className={`rounded-3xl shadow-sm overflow-hidden ${
            isDark
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >

          <div
              className={`px-5 py-4 border-b ${
                isDark ? "border-gray-700" : "border-gray-100"
              }`}
            >
            
        <h3
          className={`font-semibold text-sm ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Mood History (Last 7 Days)
        </h3>

          </div>

          {recentHistory.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl block mb-3">🧠</span>
              <p className="text-gray-500 text-sm">No mood entries yet.</p>
              <p className="text-gray-400 text-xs mt-1">Log your mood daily to track patterns over time.</p>
            </div>
          ) : (
          <div
              className={`divide-y ${
                isDark ? "divide-gray-700" : "divide-gray-100"
              }`}
>
              {recentHistory.map((entry) => {
                const meta = getMoodMeta(entry.mood)
                return (
                  <div key={entry.id} className="flex items-start justify-between px-5 py-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl border ${meta.color}`}>
                        {meta.emoji}
                      </div>
                      <div>
                        
                      <p
                        className={`font-medium text-sm ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >

                          {entry.mood} · <span
                                            className={`font-normal ${
                                              isDark ? "text-gray-300" : "text-gray-400"
                                            }`}
                                          >{formatDate(entry.date)}</span>
                        </p>
                        {entry.note && <p
                                          className={`text-xs mt-0.5 ${
                                            isDark ? "text-gray-300" : "text-gray-500"
                                          }`}
                                        >{entry.note}</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Mood



















//FOMATEDD CODE -------------------
// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'

// const MOODS = [
//   { label: 'Happy', emoji: '😄', color: 'bg-yellow-50 border-yellow-300 text-yellow-700' },
//   { label: 'Calm', emoji: '😌', color: 'bg-blue-50 border-blue-300 text-blue-700' },
//   { label: 'Excited', emoji: '🤩', color: 'bg-pink-50 border-pink-300 text-pink-700' },
//   { label: 'Neutral', emoji: '😐', color: 'bg-gray-50 border-gray-300 text-gray-700' },
//   { label: 'Tired', emoji: '😴', color: 'bg-purple-50 border-purple-300 text-purple-700' },
//   { label: 'Anxious', emoji: '😰', color: 'bg-orange-50 border-orange-300 text-orange-700' },
//   { label: 'Sad', emoji: '😢', color: 'bg-indigo-50 border-indigo-300 text-indigo-700' },
//   { label: 'Angry', emoji: '😠', color: 'bg-red-50 border-red-300 text-red-700' },
// ]

// function Mood() {
//   const navigate = useNavigate()
//   const [history, setHistory] = useState([])
//   const [todayEntry, setTodayEntry] = useState(null)
//   const [selectedMood, setSelectedMood] = useState('')
//   const [note, setNote] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState('')

//   const userId = localStorage.getItem('userId') || 1
  

//   useEffect(() => {
//     fetchToday()
//     fetchHistory()
//   }, [])

//   const fetchToday = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/mood/${userId}/today`)
//       if (res.data) {
//         setTodayEntry(res.data)
//         setSelectedMood(res.data.mood)
//         setNote(res.data.note || '')
//       }
//     } catch (err) {
//       console.error('Error fetching today mood:', err)
//     }
//   }

//   const fetchHistory = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/mood/${userId}`)
//       setHistory(res.data)
//     } catch (err) {
//       console.error('Error fetching mood history:', err)
//     }
//   }

//   const saveMood = async () => {
//     if (!selectedMood) {
//       setMessage('Please select a mood first.')
//       return
//     }
//     setLoading(true)
//     setMessage('')
//     try {
//       await axios.post('http://localhost:5000/api/mood', {
//         userId,
//         mood: selectedMood,
//         note
//       })
//       setMessage(todayEntry ? 'Mood updated!' : 'Mood saved!')
//       fetchToday()
//       fetchHistory()
//     } catch (err) {
//       setMessage('Failed to save mood. Please try again.')
//     }
//     setLoading(false)
//   }

//   const deleteEntry = async (id) => {
//     if (!window.confirm('Delete this mood entry?')) return
//     try {
//       await axios.delete(`http://localhost:5000/api/mood/${id}`)
//       setHistory(prev => prev.filter(e => e.id !== id))
//       if (todayEntry && todayEntry.id === id) {
//         setTodayEntry(null)
//         setSelectedMood('')
//         setNote('')
//       }
//     } catch (err) {
//       setMessage('Failed to delete entry.')
//     }
//   }

//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr)
//     const today = new Date()
//     const yesterday = new Date(today)
//     yesterday.setDate(today.getDate() - 1)

//     if (date.toDateString() === today.toDateString()) return 'Today'
//     if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
//     return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
//   }

//   const getMoodMeta = (moodLabel) => MOODS.find(m => m.label === moodLabel) || MOODS[3]

//   // Stats calculate karo poori history se
//   const getStats = () => {
//     if (history.length === 0) return { mostFrequent: null, total: 0, streak: 0 }

//     const counts = {}
//     history.forEach(e => { counts[e.mood] = (counts[e.mood] || 0) + 1 })
//     const mostFrequent = Object.keys(counts).reduce((a, b) => counts[a] >= counts[b] ? a : b)

//     // Streak: aaj/kal se shuru karke consecutive days dekhna hai
//     const sortedDates = [...history]
//       .map(e => { const d = new Date(e.date); d.setHours(0, 0, 0, 0); return d.getTime() })
//       .sort((a, b) => b - a)

//     let streak = 0
//     let cursor = new Date()
//     cursor.setHours(0, 0, 0, 0)

//     // Agar aaj entry nahi hai, kal se check karo
//     if (!sortedDates.includes(cursor.getTime())) {
//       cursor.setDate(cursor.getDate() - 1)
//     }

//     while (sortedDates.includes(cursor.getTime())) {
//       streak++
//       cursor.setDate(cursor.getDate() - 1)
//     }

//     return { mostFrequent, total: history.length, streak }
//   }

//   const stats = getStats()
//   const recentHistory = history.slice(0, 7)

//   return (

//   <div className="min-h-screen flex flex-col transition-colors duration-300 bg-[#f7f7f8] text-gray-900 dark:bg-[#111827] dark:text-white">

//   <div className="max-w-4xl mx-auto w-full px-4 pt-6">

//  <div className="rounded-3xl shadow-sm px-6 py-4 flex items-center justify-between bg-white border border-gray-200 dark:bg-gray-800 dark:backdrop-blur-md dark:border-gray-700">



//  <div>
//     <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">🧠 Mood Tracker</h2>

//          <p className="text-sm text-gray-500 dark:text-gray-400">How are you feeling today?</p>
//           </div>

//           <button
//             onClick={() => navigate(-1)}
          
//           className="px-4 py-2 rounded-xl text-sm font-medium transition bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"

//           >
//             ← Back
//           </button>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto w-full px-4 py-4 space-y-4">

//         {message && (
//           <div className={`px-4 py-3 rounded-2xl text-sm font-medium ${
//             message.includes('saved') || message.includes('updated')
//               ? 'bg-green-50 text-green-700 border border-green-200'
//               : 'bg-red-50 text-red-600 border border-red-200'
//           }`}>
//             {message}
//           </div>
//         )}

   
//       <div className="rounded-3xl shadow-sm p-6 space-y-4 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">


//      <h3 className="font-semibold text-gray-900 dark:text-white">
//     {todayEntry ? "Today's mood" : "Log today's mood"}
//       </h3>

//       <div className="grid grid-cols-4 gap-2.5">
//             {MOODS.map((m) => (
//               <button
//                 key={m.label}
//                 onClick={() => setSelectedMood(m.label)}
//                 className={`flex flex-col items-center gap-1.5 py-3.5 rounded-2xl border-2 transition ${
//                   selectedMood === m.label
//                   ? `${m.color} border-current scale-[1.03]`
//                     : "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100 dark:bg-slate-600 dark:text-white dark:hover:bg-gray-600"
//                 }`}
//               >
//                 <span className="text-2xl">{m.emoji}</span>
//                 <span className="text-[11px] font-medium">{m.label}</span>
//               </button>
//             ))}
//           </div>

//           <div>
//             <textarea
//               placeholder="Add a note (optional)"
//               value={note}
//               onChange={(e) => setNote(e.target.value.slice(0, 200))}
//               maxLength={200}
//               rows={3}
              
            
//                 className="w-full px-4 py-3 rounded-2xl text-sm transition resize-none focus:outline-none bg-gray-50 border border-gray-200 text-gray-900 focus:border-gray-400 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500"

//             />
//             <p className="text-[11px] text-gray-400 text-right mt-1">{note.length}/200</p>
//           </div>

//           <button
//             onClick={saveMood}
//             disabled={loading}
            
          

//           >
//             {loading ? 'Saving...' : todayEntry ? 'Update Mood' : 'Save Mood'}
//           </button>
//         </div>

//         {history.length > 0 && (
//           <div className="grid grid-cols-3 gap-3">
//           <div
//               className="text-xs font-semibold mt-0.5 text-gray-800 dark:text-white"
//             >

//               <p className="text-2xl mb-1">{stats.mostFrequent ? getMoodMeta(stats.mostFrequent).emoji : '—'}</p>
//               <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Most Frequent</p>

//               <p
//                 className={`text-xs font-semibold mt-0.5 ${
//                   isDark ? "text-white" : "text-gray-800"
//                 }`}
//               >{stats.mostFrequent || '—'}</p>

//             </div>
//             <div
//               className="text-xs font-semibold mt-0.5 text-gray-800 dark:text-white"
//             >

//               <p className="text-2xl mb-1">📅</p>
//               <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Total Entries</p>

//               <p
//                 className={`text-xs font-semibold mt-0.5 ${
//                   isDark ? "text-white" : "text-gray-800"
//                 }`}
//               >{stats.total}</p>

//             </div>
//             <div
//               className="text-xs font-semibold mt-0.5 text-gray-800 dark:text-white"
//             >

//               <p className="text-2xl mb-1">🔥</p>
//               <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Current Streak</p>

//               <p
//                 className={`text-xs font-semibold mt-0.5 ${
//                   isDark ? "text-white" : "text-gray-800"
//                 }`}
//               >{stats.streak} {stats.streak === 1 ? 'Day' : 'Days'}</p>
//             </div>
//           </div>
//         )}


//         <div className="rounded-3xl shadow-sm overflow-hidden bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">

//           <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            
//         <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
//           Mood History (Last 7 Days)
//         </h3>

//           </div>

//           {recentHistory.length === 0 ? (
//             <div className="text-center py-12">
//               <span className="text-4xl block mb-3">🧠</span>
//               <p className="text-gray-500 text-sm">No mood entries yet.</p>
//               <p className="text-gray-400 text-xs mt-1">Log your mood daily to track patterns over time.</p>
//             </div>
//           ) : (
//           <div className="divide-y divide-gray-100 dark:divide-gray-700">

//               {recentHistory.map((entry) => {
//                 const meta = getMoodMeta(entry.mood)
//                 return (
//                   <div key={entry.id} className="flex items-start justify-between px-5 py-4">
//                     <div className="flex items-start gap-4">
//                       <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl border ${meta.color}`}>
//                         {meta.emoji}
//                       </div>
//                       <div>
                        
//                       <p className="font-medium text-sm text-gray-900 dark:text-white">
//                           {entry.mood} · <span className="font-normal text-gray-400 dark:text-gray-300">{formatDate(entry.date)}</span>
//                         </p>

//                       {entry.note && <p className="text-xs mt-0.5 text-gray-500 dark:text-gray-300">{entry.note}</p>}
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => deleteEntry(entry.id)}
//                       className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
//                     >
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                       </svg>
//                     </button>
//                   </div>
//                 )
//               })}
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   )
// }

// export default Mood
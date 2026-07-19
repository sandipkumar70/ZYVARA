import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const FLOW_OPTIONS = ['Light', 'Medium', 'Heavy']
const SYMPTOM_OPTIONS = ['Cramps', 'Headache', 'Mood Swings', 'Back Pain', 'Fatigue', 'Bloating']
const DAY_MS = 24 * 60 * 60 * 1000

function toDateOnly(d) {
  const date = new Date(d)
  date.setHours(0, 0, 0, 0)
  return date
}

function formatShort(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function Period() {
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId') || 1
  const isDark = document.documentElement.classList.contains("dark");
  const gender = localStorage.getItem('gender') || 'female'

  const [history, setHistory] = useState([])
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [flow, setFlow] = useState('')
  const [symptoms, setSymptoms] = useState([])
  const [notes, setNotes] = useState('')

  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  useEffect(() => {
    if (gender !== 'female') return
    fetchHistory()
    fetchPrediction()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/period/${userId}/history`)
      setHistory(res.data)
    } catch (err) {
      console.error('Error fetching period history:', err)
    }
  }

  const fetchPrediction = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/period/${userId}/prediction`)
      setPrediction(res.data)
    } catch (err) {
      console.error('Error fetching prediction:', err)
    }
  }

  const toggleSymptom = (s) => {
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const resetForm = () => {
    setStartDate('')
    setEndDate('')
    setFlow('')
    setSymptoms([])
    setNotes('')
  }

  const logPeriod = async () => {
    if (!startDate) {
      setMessage('Start date is required.')
      return
    }
    if (endDate && new Date(endDate) < new Date(startDate)) {
      setMessage('End date cannot be before start date.')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      await axios.post('http://localhost:5000/api/period', {
        userId,
        startDate,
        endDate: endDate || null,
        flowIntensity: flow || null,
        symptoms,
        notes
      })
      setMessage('Period logged successfully!')
      resetForm()
      fetchHistory()
      fetchPrediction()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to log period.')
    }
    setLoading(false)
  }

  // --- Calendar helpers ---
  const isInPeriodRange = (date) => {
    return history.some(e => {
      const start = toDateOnly(e.startDate)
      const end = e.endDate ? toDateOnly(e.endDate) : start
      return date >= start && date <= end
    })
  }

  const isPredictedDay = (date) => {
    if (!prediction?.hasData) return false
    const predStart = toDateOnly(prediction.nextExpectedDate)
    const duration = prediction.avgDuration || 5
    const predEnd = new Date(predStart.getTime() + (duration - 1) * DAY_MS)
    return date >= predStart && date <= predEnd
  }

  const buildCalendarDays = () => {
    const { year, month } = calendarMonth
    const firstDay = new Date(year, month, 1)
    const startOffset = firstDay.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const cells = []
    for (let i = 0; i < startOffset; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
    return cells
  }

  const changeMonth = (delta) => {
    setCalendarMonth(prev => {
      let m = prev.month + delta
      let y = prev.year
      if (m < 0) { m = 11; y-- }
      if (m > 11) { m = 0; y++ }
      return { year: y, month: m }
    })
  }

  const today = toDateOnly(new Date())
  const monthLabel = new Date(calendarMonth.year, calendarMonth.month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  // Gender restriction — sirf female users access karein
  if (gender !== 'female') {
    return (
      <div className="min-h-screen bg-[#f7f7f8] flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8 text-center max-w-sm">
          <span className="text-4xl block mb-3">🌸</span>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Not Available</h2>
          <p className="text-sm text-gray-500 mb-5">Period Cycle Tracker is available for female user accounts only.</p>
          <button
            onClick={() => navigate('/home')}
            className="px-5 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
        className={`min-h-screen flex flex-col ${
          isDark
            ? "bg-[#111827] text-white"
            : "bg-[#f7f7f8] text-gray-900"
        }`}
      >

      <div className="max-w-4xl mx-auto w-full px-4 pt-6">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">🌸 Period Tracker</h2>
            <p className="text-sm text-gray-500">Track your cycle with ease</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 py-4 space-y-4">

        {message && (
          <div className={`px-4 py-3 rounded-2xl text-sm font-medium ${
            message.includes('success')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Current Cycle + Prediction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prediction?.hasData && (
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-5">
              <p className="text-xs font-semibold text-pink-500 uppercase tracking-widest mb-3">🌸 Current Cycle</p>
              <p className="text-3xl font-bold text-gray-900">Day {prediction.currentCycleDay}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <span>Started: <span className="font-medium text-gray-700">{formatShort(prediction.lastPeriodDate)}</span></span>
                {prediction.lastFlow && <span>Flow: <span className="font-medium text-gray-700">{prediction.lastFlow}</span></span>}
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-5">
            <p className="text-xs font-semibold text-purple-500 uppercase tracking-widest mb-3">🔮 Prediction</p>
            {prediction?.hasData ? (
              <>
                <p className="text-3xl font-bold text-gray-900">{formatShort(prediction.nextExpectedDate)}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {prediction.daysRemaining >= 0
                    ? `${prediction.daysRemaining} days remaining`
                    : `${Math.abs(prediction.daysRemaining)} days overdue`}
                </p>
                <p className="text-[11px] text-gray-400 mt-3 italic">Estimated prediction only. Not medical advice.</p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Log your first period to see predictions.</p>
            )}
          </div>
        </div>

        {/* Log Period Form */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Log Period</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-gray-400 transition"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">End Date (optional)</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-gray-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Flow</label>
            <div className="flex gap-2">
              {FLOW_OPTIONS.map(f => (
                <button
                  key={f}
                  onClick={() => setFlow(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition ${
                    flow === f
                      ? 'bg-pink-50 border-pink-300 text-pink-700'
                      : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Symptoms</label>
            <div className="flex flex-wrap gap-2">
              {SYMPTOM_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => toggleSymptom(s)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium border-2 transition ${
                    symptoms.includes(s)
                      ? 'bg-purple-50 border-purple-300 text-purple-700'
                      : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <textarea
              placeholder="Add a note (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 200))}
              maxLength={200}
              rows={2}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-gray-400 transition resize-none"
            />
            <p className="text-[11px] text-gray-400 text-right mt-1">{notes.length}/200</p>
          </div>

          <button
            onClick={logPeriod}
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3.5 rounded-2xl text-sm transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Log Period'}
          </button>
        </div>

        {/* Calendar */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => changeMonth(-1)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500">‹</button>
            <h3 className="font-semibold text-gray-900 text-sm">{monthLabel}</h3>
            <button onClick={() => changeMonth(1)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500">›</button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <span key={i} className="text-[10px] font-semibold text-gray-400">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {buildCalendarDays().map((date, i) => {
              if (!date) return <div key={i} />
              const isToday = date.getTime() === today.getTime()
              const isPeriod = isInPeriodRange(date)
              const isPredicted = !isPeriod && isPredictedDay(date)

              let cls = 'text-gray-600'
              if (isPeriod) cls = 'bg-pink-400 text-white font-semibold'
              else if (isPredicted) cls = 'bg-purple-100 text-purple-600 font-semibold'
              if (isToday && !isPeriod) cls += ' ring-2 ring-gray-400'

              return (
                <div key={i} className={`aspect-square flex items-center justify-center text-xs rounded-xl ${cls}`}>
                  {date.getDate()}
                </div>
              )
            })}
          </div>

          <div className="flex items-center gap-4 mt-4 text-[11px] text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-pink-400"></span>Period</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-100 border border-purple-300"></span>Predicted</span>
          </div>
        </div>

        {/* Stats */}
        {history.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Avg Cycle</p>
              <p className="text-sm font-semibold text-gray-800">{prediction?.avgCycleLength || '—'} days</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Avg Duration</p>
              <p className="text-sm font-semibold text-gray-800">{prediction?.avgDuration ? `${prediction.avgDuration} days` : '—'}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Last Period</p>
              <p className="text-sm font-semibold text-gray-800">{prediction?.lastPeriodDate ? formatShort(prediction.lastPeriodDate) : '—'}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Next Expected</p>
              <p className="text-sm font-semibold text-gray-800">{prediction?.nextExpectedDate ? formatShort(prediction.nextExpectedDate) : '—'}</p>
            </div>
          </div>
        )}

        {/* History */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Cycle History</h3>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl block mb-3">🌸</span>
              <p className="text-gray-500 text-sm">No cycles logged yet.</p>
              <p className="text-gray-400 text-xs mt-1">Log your period to start tracking.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {history.map((entry) => {
                const duration = entry.endDate
                  ? Math.round((toDateOnly(entry.endDate) - toDateOnly(entry.startDate)) / DAY_MS) + 1
                  : null
                return (
                  <div key={entry.id} className="px-5 py-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="font-medium text-gray-900 text-sm">
                        {formatShort(entry.startDate)} {entry.endDate ? `– ${formatShort(entry.endDate)}` : '(ongoing)'}
                      </p>
                      {duration && <span className="text-xs text-gray-400">{duration} days</span>}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {entry.flowIntensity && (
                        <span className="text-[11px] px-2.5 py-1 rounded-lg bg-pink-50 text-pink-600 font-medium">{entry.flowIntensity}</span>
                      )}
                      {entry.symptoms?.map(s => (
                        <span key={s} className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-50 text-purple-600 font-medium">{s}</span>
                      ))}
                    </div>
                    {entry.notes && <p className="text-xs text-gray-500 mt-2">{entry.notes}</p>}
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

export default Period
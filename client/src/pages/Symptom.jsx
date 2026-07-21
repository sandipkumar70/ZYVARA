

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Symptom() {
  const navigate = useNavigate()
  const [symptoms, setSymptoms] = useState('')
  const [category, setCategory] = useState('general')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const checkSymptoms = async () => {
    if (!symptoms.trim()) return
    setLoading(true)
    setResult(null)
    const userId = localStorage.getItem('userId') || 1
    try {
      const res = await api.post('/api/symptom', { symptoms, category, userId })
      setResult(res.data)
    } catch (err) {
      setResult({ severity: 'ERROR', advice: 'Something went wrong. Please try again.', color: 'gray' })
    }
    setLoading(false)
  }

  const severityConfig = {
    RED: { bg: 'bg-red-500', text: 'Serious — Visit Hospital Immediately', icon: '🔴' },
    YELLOW: { bg: 'bg-yellow-500', text: 'Moderate — Rest & Observe', icon: '🟡' },
    GREEN: { bg: 'bg-emerald-500', text: 'Mild — No Immediate Concern', icon: '🟢' },
    ERROR: { bg: 'bg-gray-400', text: 'Error', icon: '⚠️' },
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] dark:bg-[#1e3d4a] dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-[#2d6176] dark:via-[#1e3d4a] dark:to-[#12262e] flex flex-col transition-colors duration-300">
      <div className="max-w-4xl mx-auto w-full px-4 pt-6">
        <div className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700/40 rounded-3xl shadow-sm dark:shadow-lg px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">🩺 Symptom Checker</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">AI Severity Analysis</p>
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
        <div className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700/40 rounded-3xl shadow-sm dark:shadow-lg p-6 md:p-8">
          <div className="mb-5">
            <label className="text-xs font-semibold text-gray-500 dark:text-cyan-400/80 uppercase tracking-wider mb-2 block">
              Select Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-gray-400 dark:focus:border-cyan-500 transition"
            >
              <option value="general">💊 General Health</option>
              <option value="period">🩸 Period Emergency</option>
              <option value="pregnancy">🤰 Pregnancy</option>
              <option value="heart">❤️ Heart Attack</option>
              <option value="mental">🧠 Mental Health</option>
              <option value="breathing">🫁 Breathing Problem</option>
              <option value="injury">🦴 Physical Injury</option>
              <option value="food">🤢 Food Poisoning</option>
              <option value="fever">🤒 Fever / Cold</option>
            </select>
          </div>

          <div className="mb-5">
            <label className="text-xs font-semibold text-gray-500 dark:text-cyan-400/80 uppercase tracking-wider mb-2 block">
              Describe Your Symptoms
            </label>
            <textarea
              placeholder="e.g. I have severe chest pain, difficulty breathing, left arm pain since 30 minutes..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-800 text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-gray-400 dark:focus:border-cyan-500 transition resize-none"
            />
          </div>

          <button
            onClick={checkSymptoms}
            disabled={loading || !symptoms.trim()}
            className="w-full bg-black hover:bg-gray-800 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-emerald-400 dark:hover:from-cyan-600 dark:hover:to-emerald-500 active:scale-[0.98] disabled:opacity-50 transition-all text-white dark:text-slate-950 font-medium py-3.5 rounded-2xl text-sm"
          >
            {loading ? 'Analyzing...' : 'Check Symptoms'}
          </button>
        </div>

        {result && (
          <div className="mt-4 bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700/40 rounded-3xl shadow-sm dark:shadow-lg overflow-hidden">
            <div className={`${severityConfig[result.severity]?.bg || 'bg-gray-400'} px-6 py-4`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{severityConfig[result.severity]?.icon}</span>
                <div>
                  <p className="text-white font-bold text-lg">{result.severity}</p>
                  <p className="text-white/80 text-sm">{severityConfig[result.severity]?.text}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-xs font-semibold text-gray-500 dark:text-cyan-400/80 uppercase tracking-wider mb-3">AI Advice</p>
              <p className="text-gray-700 dark:text-slate-200 text-sm leading-relaxed">{result.advice}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Symptom
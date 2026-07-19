

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Sun, Moon } from 'lucide-react'
import axios from 'axios'
import healthTips from '../data/healthTips'
import { useTheme } from '../context/ThemeContext'

const MOOD_EMOJIS = {
  Happy: '😄', Calm: '😌', Excited: '🤩', Neutral: '😐',
  Tired: '😴', Anxious: '😰', Sad: '😢', Angry: '😠'
}

function Home() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const gender = localStorage.getItem('gender') || 'female'
  const userId = localStorage.getItem('userId') 
  const [todayMood, setTodayMood] = useState(null)
  const [periodPrediction, setPeriodPrediction] = useState(null)

  useEffect(() => {
    if (!userId) {
  navigate('/')
  return
}
    const fetchTodayMood = async () => {
      try {
        const res = await  axios.get(`${import.meta.env.VITE_API_URL}/api/mood/${userId}/today`)
        setTodayMood(res.data)
      } catch (err) {
        console.error('Error fetching today mood:', err)
      }
    }
    fetchTodayMood()

    if (gender === 'female') {
      const fetchPeriodPrediction = async () => {
        try {
          const res = await  axios.get(`${import.meta.env.VITE_API_URL}/api/period/${userId}/prediction`) 
          setPeriodPrediction(res.data)
        } catch (err) {
          console.error('Error fetching period prediction:', err)
        }
      }
      fetchPeriodPrediction()
    }
  }, [gender])

// ye get day of year hai 
const getDayOfYear = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now - start
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  const [tipIndex, setTipIndex] = useState(getDayOfYear() % healthTips.length)
  const [tipVisible, setTipVisible] = useState(true)

  const categoryColors = {
    'Hydration': 'from-blue-500/20 to-blue-400/10 border-blue-400/30 text-blue-300',
    'Nutrition': 'from-emerald-500/20 to-emerald-400/10 border-emerald-400/30 text-emerald-300',
    'Fitness': 'from-orange-500/20 to-orange-400/10 border-orange-400/30 text-orange-300',
    'Sleep': 'from-purple-500/20 to-purple-400/10 border-purple-400/30 text-purple-300',
    'Mental Health': 'from-indigo-500/20 to-indigo-400/10 border-indigo-400/30 text-indigo-300',
    'Heart Health': 'from-red-500/20 to-red-400/10 border-red-400/30 text-red-300',
    "Women's Health": 'from-pink-500/20 to-pink-400/10 border-pink-400/30 text-pink-300',
    'General Health': 'from-cyan-500/20 to-cyan-400/10 border-cyan-400/30 text-cyan-300'
  }

  const categoryIcons = {
    'Hydration': '💧', 'Nutrition': '🥗', 'Fitness': '🏃', 'Sleep': '😴',
    'Mental Health': '🧠', 'Heart Health': '❤️', "Women's Health": '🚺', 'General Health': '🛡️'
  }

  const currentTip = healthTips[tipIndex]

  const showNewTip = () => {
    setTipVisible(false)
    setTimeout(() => {
      let newIndex = Math.floor(Math.random() * healthTips.length)
      if (newIndex === tipIndex) newIndex = (newIndex + 1) % healthTips.length
      setTipIndex(newIndex)
      setTipVisible(true)
    }, 300)
  }



  const commonEmergencies = [
    { icon: '❤️', title: 'Heart Attack', category: 'heart' },
    { icon: '🫁', title: 'Breathing Problem', category: 'breathing' },
    { icon: '🦴', title: 'Physical Injury', category: 'injury' },
    { icon: '🤢', title: 'Food Poisoning', category: 'food' },
    { icon: '🩸', title: 'Bleeding', category: 'bleeding' },
    { icon: '🧠', title: 'Mental Health', category: 'mental' },
    { icon: '🚨', title: 'Safety Emergency', category: 'safety' },
    { icon: '💊', title: 'General Health', category: 'general' },
    { icon: '🤒', title: 'Fever / Cold', category: 'fever' },
    { icon: '😵', title: 'Dizziness / Faint', category: 'dizziness' },
  ]

  const femaleOnly = [
    { icon: '🩸', title: 'Period Emergency', category: 'period' },
    { icon: '🤰', title: 'Pregnancy Issue', category: 'pregnancy' },
    { icon: '🧘', title: 'Hormonal Issues', category: 'hormonal' },
  ]

  const maleOnly = [
    { icon: '💪', title: 'Muscle / Chest Pain', category: 'muscle' },
    { icon: '😡', title: 'Anger / Stress', category: 'anger' },
    { icon: '🚗', title: 'Road Accident', category: 'accident' },
  ]

  const specificEmergencies = gender === 'male' ? maleOnly : femaleOnly

  return (
   <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-cyan-50 to-white dark:bg-[#1e3d4a] dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-[#2d6176] dark:via-[#1e3d4a] dark:to-[#12262e] antialiased font-sans relative overflow-x-hidden pb-12 transition-all duration-300">

      <div className="hidden dark:block absolute top-[-20%] left-[-20%] w-[700px] h-[700px] bg-cyan-400/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="hidden dark:block absolute bottom-[-20%] right-[-20%] w-[700px] h-[700px] bg-emerald-400/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 md:px-8 pt-8 md:pt-14 relative z-10">
     <div className="flex flex-col items-center text-center mb-6 md:mb-10">

        <button
          onClick={toggleTheme}
          className="absolute top-5 left-5 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-gray-200 dark:border-cyan-400/30 rounded-full flex items-center justify-center text-gray-600 dark:text-cyan-400 hover:scale-110 hover:ring-2 hover:ring-cyan-400 hover:shadow-lg active:scale-95 transition-all duration-300 z-20 shadow-sm"
        >
          {theme === 'dark' ? <Sun size={18} strokeWidth={2.2} /> : <Moon size={18} strokeWidth={2.2} />}
        </button>

          <button
            onClick={() => navigate('/profile')}
           className="absolute top-5 right-5 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-gray-200 dark:border-cyan-400/30 rounded-full flex items-center justify-center text-gray-600 dark:text-cyan-400 hover:scale-110 hover:ring-2 hover:ring-cyan-400 hover:shadow-lg active:scale-95 hover:bg-gray-50 dark:hover:bg-slate-900/70 dark:hover:border-cyan-400/60 dark:hover:shadow-[0_0_18px_rgba(34,211,238,0.5)] transition-all duration-300 z-20 group shadow-sm"
          >
            <User size={20} strokeWidth={2.2} />
            <span className="absolute -bottom-8 right-0 bg-gray-800 dark:bg-slate-800 text-white text-[11px] px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Profile
            </span>
          </button>

          <img src="/logo.png" alt="Zyvara" className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.35)] mb-1 md:mb-3" />
          <h1 className="text-2xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-widest uppercase">Zyvara</h1>
          <p className="text-[11px] md:text-base text-cyan-600 dark:text-cyan-400 font-semibold tracking-widest uppercase opacity-90 mt-0.5 md:mt-2">
            Your companion in every crisis
          </p>
        </div>

        <div className="flex justify-center gap-2 md:gap-4 mb-6 md:mb-10">
          <button
            onClick={() => { localStorage.setItem('gender', 'female'); window.location.reload() }}
            className={`px-5 md:px-8 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wide transition-all ${
              gender === 'female'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-gray-100 dark:bg-slate-900/40 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700/40'
            }`}
          >
            👩 Female
          </button>
          <button
            onClick={() => { localStorage.setItem('gender', 'male'); window.location.reload() }}
            className={`px-5 md:px-8 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wide transition-all ${
              gender === 'male'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-gray-100 dark:bg-slate-900/40 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700/40'
            }`}
          >
            👨 Male
          </button>
        </div>

        
         <div className={`grid grid-cols-2 ${gender === 'female' ? 'md:grid-cols-3' : 'md:grid-cols-5'} gap-3 md:gap-6 mb-3 md:mb-6`}>
          <button
            onClick={() => navigate('/sos')}
            className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:scale-[0.97] transition-all text-white font-bold py-5 md:py-10 rounded-2xl   shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-1 duration-300    flex flex-col items-center gap-1.5 md:gap-3"
          >
            <span className="text-2xl md:text-5xl">🚨</span>
            <span className="text-xs md:text-base tracking-wide uppercase">SOS Alert</span>
          </button>

          <button
            onClick={() => navigate('/ambulance')}
            className="bg-white dark:bg-slate-900/60 hover:bg-gray-50 dark:hover:bg-slate-900/80 border border-gray-200 dark:border-slate-700/40 active:scale-[0.97]   transition-all duration-300 hover:-translate-y-1 hover:shadow-xl   text-gray-800 dark:text-white font-bold py-5 md:py-10 rounded-2xl shadow-sm dark:shadow-lg flex flex-col items-center gap-1.5 md:gap-3"
          >
            <span className="text-2xl md:text-5xl">🚑</span>
            <span className="text-xs md:text-base tracking-wide uppercase">Ambulance</span>
          </button>

          <button
            onClick={() => navigate('/symptom')}
            className="bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-600 hover:to-emerald-500 active:scale-[0.98]  transition-all duration-300 hover:-translate-y-1 hover:shadow-xl  text-slate-950 font-bold py-5 md:py-10 rounded-2xl shadow-lg shadow-cyan-500/20 flex flex-col items-center gap-1.5 md:gap-3"
          >
            <span className="text-2xl md:text-5xl">🩺</span>
            <span className="text-xs md:text-base tracking-wide uppercase">Symptom Checker</span>
          </button>

          <button
            onClick={() => navigate('/hospital-finder')}
            className="bg-white dark:bg-slate-900/60 hover:bg-gray-50 dark:hover:bg-slate-900/80 border border-gray-200 dark:border-slate-700/40 active:scale-[0.97]  transition-all duration-300 hover:-translate-y-1 hover:shadow-xl   text-gray-800 dark:text-white font-bold py-5 md:py-10 rounded-2xl shadow-sm dark:shadow-lg flex flex-col items-center gap-1.5 md:gap-3"
          >
            <span className="text-2xl md:text-5xl">🏥</span>
            <span className="text-xs md:text-base tracking-wide uppercase">Hospital Finder</span>
          </button>

          <button
            onClick={() => navigate('/mood')}
            className="bg-white dark:bg-slate-900/60 hover:bg-gray-50 dark:hover:bg-slate-900/80 border border-gray-200 dark:border-slate-700/40 active:scale-[0.97]  transition-all duration-300 hover:-translate-y-1 hover:shadow-xl  text-gray-800 dark:text-white font-bold py-5 md:py-10 rounded-2xl shadow-sm dark:shadow-lg flex flex-col items-center gap-1.5 md:gap-3"
          >
            <span className="text-2xl md:text-5xl">🧠</span>
            <span className="text-xs md:text-base tracking-wide uppercase">Mood Tracker</span>
          </button>

          {gender === 'female' && (
            <button
              onClick={() => navigate('/period')}
              className="bg-white dark:bg-slate-900/60 hover:bg-gray-50 dark:hover:bg-slate-900/80 border border-gray-200 dark:border-slate-700/40 active:scale-[0.97]   transition-all duration-300 hover:-translate-y-1 hover:shadow-xl   text-gray-800 dark:text-white font-bold py-5 md:py-10 rounded-2xl shadow-sm dark:shadow-lg flex flex-col items-center gap-1.5 md:gap-3"
            >
              <span className="text-2xl md:text-5xl">🌸</span>
              <span className="text-xs md:text-base tracking-wide uppercase">Period Tracker</span>
            </button>
          )}
        </div>     

        {todayMood && (
          <button
            onClick={() => navigate('/mood')}
           className="w-full bg-white dark:bg-slate-900/40 hover:bg-cyan-50 dark:hover:bg-slate-900/60 backdrop-blur-sm border border-gray-200 dark:border-slate-700/30 active:scale-[0.98] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-cyan-400/40 rounded-2xl px-5 py-3.5 mb-3 flex items-center justify-between shadow-sm dark:shadow-none"
          >
            <span className="text-xs md:text-sm font-semibold text-cyan-600 dark:text-cyan-400/80 uppercase tracking-widest">Today's Mood</span>
            <span className="text-sm md:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {MOOD_EMOJIS[todayMood.mood]} {todayMood.mood}
            </span>
          </button>
        )}

        {gender === 'female' && periodPrediction?.hasData && (
          <button
            onClick={() => navigate('/period')}
            className="w-full bg-white dark:bg-slate-900/40 hover:bg-cyan-50 dark:hover:bg-slate-900/60 backdrop-blur-sm border border-gray-200 dark:border-slate-700/30 active:scale-[0.98] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-cyan-400/40 rounded-2xl px-5 py-3.5 mb-7 md:mb-10 flex items-center justify-between shadow-sm dark:shadow-none"
          >
            <span className="text-xs md:text-sm font-semibold text-cyan-600 dark:text-cyan-400/80 uppercase tracking-widest">
              🌸 Cycle Day {periodPrediction.currentCycleDay}
            </span>
            <span className="text-sm md:text-base font-bold text-gray-900 dark:text-white">
              Next Period: {new Date(periodPrediction.nextExpectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          </button>
        )}



        <h3 className="text-[11px] md:text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.2em] mb-3 md:mb-4 ml-1">
          {gender === 'female' ? 'Female specific' : 'Male specific'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-4 mb-7 md:mb-10">
          {specificEmergencies.map((item) => (
            <button
              key={item.category}
              onClick={() => navigate(`/chat/${item.category}`)}
              className="flex items-center gap-3 md:gap-4 bg-white dark:bg-slate-900/40 hover:bg-cyan-50 dark:hover:bg-slate-900/60 backdrop-blur-sm active:scale-[0.98] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-cyan-400/40 rounded-2xl px-4 md:px-5 py-3.5 md:py-6 border border-gray-200 dark:border-slate-700/30 text-left shadow-sm dark:shadow-none"
            >
              <span className="text-2xl md:text-3xl">{item.icon}</span>
              <span className="text-sm md:text-base font-semibold text-gray-800 dark:text-slate-100">{item.title}</span>
            </button>
          ))}
        </div>

      
<h3 className="text-[11px] md:text-sm font-bold text-cyan-600 dark:text-cyan-400/80 uppercase tracking-widest mb-3 md:mb-4 ml-1">
          Common emergencies
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 md:gap-4 mb-7 md:mb-10">
          {commonEmergencies.map((item) => (
            <button
              key={item.category}
              onClick={() => navigate(`/chat/${item.category}`)}
              className="group flex flex-col items-center gap-1.5 md:gap-2.5 bg-white dark:bg-slate-900/40 hover:bg-cyan-50 dark:hover:bg-slate-900/60 backdrop-blur-sm active:scale-[0.97] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.04] hover:shadow-2xl hover:border-cyan-400/60 rounded-2xl px-3 md:px-4 py-4 md:py-6 border border-gray-200 dark:border-slate-700/30 shadow-sm dark:shadow-none cursor-pointer"
            >
              <span className="text-xl md:text-3xl transition-transform duration-300 group-hover:scale-125">{item.icon}</span>
             <span className="text-xs md:text-sm font-semibold text-gray-600 dark:text-slate-300 text-center leading-tight transition-colors duration-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-300">{item.title}</span>
            </button>
          ))}
        </div>

        {/* Health Tip of the Day */}
        <div className={`bg-gradient-to-br ${categoryColors[currentTip.category]} dark:bg-opacity-100 backdrop-blur-sm border rounded-3xl p-5 md:p-7 mb-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${tipVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-800 dark:text-white/90">💡 Health Tip of the Day</p>
            <span className="text-[10px] font-semibold text-gray-500 dark:text-white/70">🗓 Today</span>
          </div>
          <p className="text-gray-800 dark:text-white text-sm md:text-base font-medium mb-4 leading-relaxed">
            {categoryIcons[currentTip.category]} {currentTip.tip}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 text-gray-700 dark:text-inherit">
              🏷 {currentTip.category}
            </span>
            <button
              onClick={showNewTip}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 border border-black/10 dark:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-md text-gray-700 dark:text-inherit"
            >
              🔄 New Tip
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}


export default Home










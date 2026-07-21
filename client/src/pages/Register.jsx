

import { useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [city, setCity] = useState('')
  const [gender, setGender] = useState('female')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)




  const handleRegister = async () => {
    if (!name || !email || !password) {
      setMessage('Please fill all required fields')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      await api.post('/api/auth/register', { name, email, password, city, gender })
      setMessage('Registered successfully! Redirecting to login...')
      setTimeout(() => navigate('/'), 1000)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed!')
    }
    setLoading(false)
  }



  return (
    <div className="min-h-screen w-full bg-[#1e3d4a] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2d6176] via-[#1e3d4a] to-[#12262e] flex items-center justify-center p-4 antialiased font-sans relative overflow-hidden">

      <div className="absolute top-[-20%] left-[-20%] w-[700px] h-[700px] bg-cyan-400/25 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[700px] h-[700px] bg-emerald-400/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-300/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[440px] bg-slate-900/40 backdrop-blur-2xl border border-slate-700/30 rounded-3xl p-8 md:p-10 shadow-[0_25px_65px_rgba(0,0,0,0.3),_0_0_40px_rgba(34,211,238,0.08)] relative z-10 my-8">

        <div className="flex flex-col items-center text-center mb-6">
          <img
            src="/logo.png"
            alt="Zyvara Z+ Logo"
            className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.35)] mb-1"
          />

          <h1 className="text-4xl font-extrabold text-white tracking-widest uppercase mb-1 drop-shadow-sm">
            Zyvara
          </h1>
          <p className="text-xs text-cyan-400 font-semibold tracking-widest uppercase opacity-95">
            Your companion in every crisis
          </p>
        </div>

        <div className="space-y-5">

          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#081821]/80 border border-slate-700/40 rounded-2xl pl-12 pr-4 py-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 shadow-inner"
            />
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
              </svg>
            </span>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#081821]/80 border border-slate-700/40 rounded-2xl pl-12 pr-4 py-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 shadow-inner"
            />
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#081821]/80 border border-slate-700/40 rounded-2xl pl-12 pr-4 py-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 shadow-inner"
            />
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
              className="w-full bg-[#081821]/80 border border-slate-700/40 rounded-2xl pl-12 pr-4 py-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 shadow-inner"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
              Gender
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  gender === 'female'
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950'
                    : 'bg-[#081821]/80 border border-slate-700/40 text-slate-400'
                }`}
              >
                👩 Female
              </button>
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  gender === 'male'
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950'
                    : 'bg-[#081821]/80 border border-slate-700/40 text-slate-400'
                }`}
              >
                👨 Male
              </button>
            </div>
          </div>



          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-600 hover:to-emerald-500 text-slate-950 font-bold py-4 rounded-2xl text-sm tracking-wider uppercase shadow-[0_4px_25px_rgba(6,182,212,0.18)] active:scale-[0.98] disabled:opacity-60 transition-all duration-200 mt-2"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          {message && (
            <div className={`text-center text-xs px-4 py-3 rounded-xl border transition-all ${
              message.includes('successfully')
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-red-500/10 text-red-400 border-red-500/30'
            }`}>
              {message}
            </div>
          )}

        </div>

        <p className="text-center text-xs text-slate-400 font-medium mt-8 pt-5 border-t border-slate-800/40">
          Already have an account?{' '}
          <a href="/" className="text-cyan-400 hover:text-cyan-300 font-bold transition ml-1">
            Login
          </a>
        </p>

        <div className="text-center text-[11px] text-slate-300/70 mt-6 space-y-1.5">
          <p>© 2026 Zyvara Technologies. All rights reserved.</p>
          <p className="space-x-2 text-cyan-300/80">
            <a href="#privacy" className="hover:text-cyan-300 hover:underline transition-colors">Privacy Policy</a>
            <span className="text-slate-500">•</span>
            <a href="#terms" className="hover:text-cyan-300 hover:underline transition-colors">Terms of Service</a>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Register
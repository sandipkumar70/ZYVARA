
import { useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotStep, setForgotStep] = useState(1) // 1 = enter email, 2 = enter OTP + new password
  const [forgotEmail, setForgotEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [forgotMessage, setForgotMessage] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage('Please enter both email and password')
      return
    }
    setLoading(true)
    setMessage('')

    try {
     const res = await api.post('/api/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('userId', res.data.user.id)
      localStorage.setItem('gender', res.data.user.gender || 'female')
      setMessage('Login successful!')
      
      setTimeout(() => navigate('/home'), 700)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed!')
    }
    setLoading(false)
  }

  const openForgotModal = () => {
    setShowForgotModal(true)
    setForgotStep(1)
    setForgotEmail('')
    setOtp('')
    setNewPassword('')
    setConfirmNewPassword('')
    setForgotMessage('')
  }

  const closeForgotModal = () => {
    setShowForgotModal(false)
  }

  const sendOtp = async () => {
    if (!forgotEmail.trim()) {
      setForgotMessage('Please enter your email.')
      return
    }
    setForgotLoading(true)
    setForgotMessage('')
    try {
      const res = await api.post('/api/auth/forgot-password', { email: forgotEmail })
      setForgotMessage(res.data.message)
      setForgotStep(2)
    } catch (err) {
      setForgotMessage(err.response?.data?.message || 'Failed to send OTP.')
    }
    setForgotLoading(false)
  }

  const resetPassword = async () => {
    if (!otp || !newPassword || !confirmNewPassword) {
      setForgotMessage('Please fill all fields.')
      return
    }
    if (newPassword !== confirmNewPassword) {
      setForgotMessage('Passwords do not match.')
      return
    }
    setForgotLoading(true)
    setForgotMessage('')
    try {
      const res = await api.post('/api/auth/reset-password', {
        email: forgotEmail, otp, newPassword
      })
      setForgotMessage(res.data.message + ' You can now login with your new password.')
      setTimeout(() => {
        setShowForgotModal(false)
      }, 2000)
    } catch (err) {
      setForgotMessage(err.response?.data?.message || 'Failed to reset password.')
    }
    setForgotLoading(false)
  }

  return (
    <div className="min-h-screen w-full bg-[#1e3d4a] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2d6176] via-[#1e3d4a] to-[#12262e] flex items-center justify-center p-4 antialiased font-sans relative overflow-hidden">
      
      <div className="absolute top-[-20%] left-[-20%] w-[700px] h-[700px] bg-cyan-400/25 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[700px] h-[700px] bg-emerald-400/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-300/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[440px] bg-slate-900/40 backdrop-blur-2xl border border-slate-700/30 rounded-3xl p-8 md:p-10 shadow-[0_25px_65px_rgba(0,0,0,0.3),_0_0_40px_rgba(34,211,238,0.08)] relative z-10">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-3">
            <img 
              src="/logo.png" 
              alt="Zyvara Z+ Logo" 
              className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.35)]"
            />
          </div>
          
          <h1 className="text-4xl font-extrabold text-white tracking-widest uppercase mb-1 drop-shadow-sm">
            Zyvara
          </h1>
          <p className="text-xs text-cyan-400 font-semibold tracking-widest uppercase opacity-95">
            Your companion in every crisis
          </p>
        </div>

        <div className="space-y-5">
          
          <div className="space-y-1.5">
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
          </div>

          <div className="space-y-1.5">
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
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full bg-[#081821]/80 border border-slate-700/40 rounded-2xl pl-12 pr-4 py-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 shadow-inner"
              />
            </div>
            <div className="text-right">
              <button
                type="button"
                onClick={openForgotModal}
                className="text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-600 hover:to-emerald-500 text-slate-950 font-bold py-4 rounded-2xl text-sm tracking-wider uppercase shadow-[0_4px_25px_rgba(6,182,212,0.18)] active:scale-[0.98] disabled:opacity-60 transition-all duration-200 mt-2"
          >
            {loading ? 'Logging In...' : 'Login to your account'}
          </button>

          {message && (
            <div className={`text-center text-xs px-4 py-3 rounded-xl border transition-all ${
              message.includes('successful') 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-red-500/10 text-red-400 border-red-500/30'
            }`}>
              {message}
            </div>
          )}

        </div>

        <p className="text-center text-xs text-slate-400 font-medium mt-8 pt-5 border-t border-slate-800/40">
          Don't have an account?{' '}
          <a href="/register" className="text-cyan-400 hover:text-cyan-300 font-bold transition ml-1">
            Sign Up
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

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-[420px] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/40 rounded-3xl p-7 relative">

            <button
              onClick={closeForgotModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-xl leading-none"
            >
              ×
            </button>

            <h2 className="text-lg font-bold text-white mb-1">🔒 Reset Password</h2>
            <p className="text-xs text-slate-400 mb-6">
              {forgotStep === 1 ? 'Enter your registered email to receive an OTP' : 'Enter the OTP sent to your email and set a new password'}
            </p>

            {forgotMessage && (
              <div className={`text-xs px-4 py-3 rounded-xl border mb-4 ${
                forgotMessage.includes('success') || forgotMessage.includes('sent')
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-red-500/10 text-red-400 border-red-500/30'
              }`}>
                {forgotMessage}
              </div>
            )}

            {forgotStep === 1 ? (
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Registered Email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full bg-[#081821]/80 border border-slate-700/40 rounded-2xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                />
                <button
                  onClick={sendOtp}
                  disabled={forgotLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold py-3.5 rounded-2xl text-sm uppercase tracking-wide disabled:opacity-60 transition"
                >
                  {forgotLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-[#081821]/80 border border-slate-700/40 rounded-2xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#081821]/80 border border-slate-700/40 rounded-2xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full bg-[#081821]/80 border border-slate-700/40 rounded-2xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                />
                <button
                  onClick={resetPassword}
                  disabled={forgotLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold py-3.5 rounded-2xl text-sm uppercase tracking-wide disabled:opacity-60 transition"
                >
                  {forgotLoading ? 'Resetting...' : 'Reset Password'}
                </button>
                <button
                  onClick={() => setForgotStep(1)}
                  className="w-full text-xs text-slate-400 hover:text-slate-300 transition"
                >
                  ← Back / Resend OTP
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}

export default Login
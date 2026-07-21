
import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import ReactMarkdown from 'react-markdown'

function Chat() {
  const { category } = useParams()
  const navigate = useNavigate()

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(null)

  const bottomRef = useRef(null)
  const recognitionRef = useRef(null)

  const userId = localStorage.getItem('userId') || 1

  const categoryTitles = {
    period: '🩸 Period Emergency', pregnancy: '🤰 Pregnancy Issue', mental: '🧠 Mental Health',
    safety: '🚨 Safety Emergency', general: '💊 General Health', heart: '❤️ Heart Attack',
    breathing: '🫁 Breathing Problem', injury: '🦴 Physical Injury', food: '🤢 Food Poisoning',
    bleeding: '🩸 Bleeding', fever: '🤒 Fever / Cold', dizziness: '😵 Dizziness / Faint',
    muscle: '💪 Muscle / Chest Pain', anger: '😡 Anger / Stress', accident: '🚗 Road Accident',
    hormonal: '🧘 Hormonal Issues',
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Voice not supported. Please use Chrome browser.')
      return
    }

    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }

    window.speechSynthesis.cancel()
    setSpeaking(null)

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setListening(true)
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setMessage(transcript)
      setListening(false)
    }

    recognition.onerror = (e) => {
      console.error('Speech error:', e.error)
      setListening(false)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const cleanTextForSpeech = (text) => {
    return text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/[🔍⚠️✅💊🏥🚨]/g, '')
      .replace(/[-•]\s/g, '')
      .replace(/\n+/g, ' ')
      .trim()
  }

const speakText = (text, index) => {
    if (!('speechSynthesis' in window)) return

    if (speaking === index) {
      window.speechSynthesis.cancel()
      setSpeaking(null)
      return
    }

    window.speechSynthesis.cancel()

    const cleanText = cleanTextForSpeech(text)

    const isHindi = /[\u0900-\u097F]/.test(text)
    const isHinglish = /\b(hai|mein|karo|aap|hoga|nahi|kya|toh|aur|se|ko)\b/i.test(text)

    const utterance = new SpeechSynthesisUtterance(cleanText)

    const setVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices()

      let selectedVoice = null

      if (isHindi) {
        selectedVoice = voices.find(v => v.lang === 'hi-IN')
      }

      
     else if (isHinglish) {
        selectedVoice = voices.find(v => v.name === 'Google हिन्दी')
        utterance.lang = 'hi-IN'
      }
      
      
      else {
        selectedVoice =
          voices.find(v => v.lang === 'en-IN') ||
          voices.find(v => v.name.toLowerCase().includes('india'))
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice
      }

      utterance.lang = isHindi ? 'hi-IN' : 'en-IN'
      utterance.rate = 0.85
      utterance.pitch = 1

      utterance.onstart = () => setSpeaking(index)
      utterance.onend = () => setSpeaking(null)
      utterance.onerror = () => setSpeaking(null)

      window.speechSynthesis.speak(utterance)
    }

    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      setVoiceAndSpeak()
    } else {
      window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak
    }
  }

  const sendMessage = async () => {
    if (!message.trim() || loading) return

    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
    }

    const userMsg = { role: 'user', text: message }
    const currentMessages = [...messages]

    setMessages(prev => [...prev, userMsg])
    setMessage('')
    setLoading(true)

    try {
      const res = await api.post('/api/chat', {
        message: userMsg.text,
        category,
        userId,
        history: currentMessages,
      })

      setMessages(prev => [...prev, { role: 'ai', text: res.data.response }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Sorry, something went wrong. Please try again.',
      }])
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] dark:bg-[#1e3d4a] dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-[#2d6176] dark:via-[#1e3d4a] dark:to-[#12262e] flex flex-col transition-colors duration-300">

      <div className="max-w-4xl mx-auto w-full px-4 pt-6">
        <div className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700/40 rounded-3xl shadow-sm dark:shadow-lg px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
              {categoryTitles[category] || '💊 General Health'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">AI Health Assistant</p>
          </div>
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 bg-gray-50 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-200 transition"
          >
            Back Home
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full flex-1 px-4 py-4 overflow-y-auto"
        style={{ minHeight: '60vh', maxHeight: '68vh' }}>
        <div className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700/40 rounded-3xl shadow-sm dark:shadow-lg min-h-full px-5 py-4">

          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center pt-16">
              <div className="bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/40 shadow-sm rounded-3xl px-10 py-8 max-w-md">
                <span className="text-5xl mb-4 block">🩺</span>
                <p className="text-gray-500 dark:text-slate-300 leading-relaxed">
                  Describe your symptoms or press the mic.<br />
                  The AI assistant will guide you step by step.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4 py-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-4 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gray-900 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-emerald-400 text-white dark:text-slate-950 shadow-md rounded-3xl rounded-br-lg'
                    : 'bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/40 text-gray-800 dark:text-slate-100 shadow-sm rounded-3xl rounded-bl-lg'
                }`}>
                  {msg.role === 'user' ? (
                    msg.text
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                          strong: ({children}) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
                          ul: ({children}) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                          li: ({children}) => <li className="text-gray-700 dark:text-slate-200">{children}</li>,
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                      <button
                        onClick={() => speakText(msg.text, i)}
                        className={`mt-2 text-sm transition ${
                          speaking === i ? 'text-red-500' : 'text-gray-400 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
                        }`}
                      >
                        {speaking === i ? '⏹️ Stop' : '🔊'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/40 shadow-sm px-4 py-3 rounded-3xl flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 dark:bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 dark:bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 dark:bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 pb-6">
        <div className="bg-white dark:bg-slate-900/60 border border-gray-300 dark:border-slate-700/40 rounded-3xl shadow-md dark:shadow-lg px-3 py-3 flex items-center gap-3">

          <button
            onClick={startListening}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative group ${
              listening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            {listening ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
              </svg>
            )}
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
              {listening ? 'Click to stop' : 'Click to speak'}
            </span>
          </button>

          <input
            type="text"
            placeholder={listening ? '🎙️ Listening... speak now' : 'Describe your symptoms...'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 text-sm"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="shrink-0 bg-black hover:bg-gray-800 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-emerald-400 dark:hover:from-cyan-600 dark:hover:to-emerald-500 active:scale-95 disabled:opacity-50 transition-all text-white dark:text-slate-950 px-5 py-2 rounded-xl font-medium text-sm"
          >
            Send
          </button>
        </div>

        {listening && (
          <p className="text-center text-xs text-red-500 mt-2 animate-pulse">
            🎙️ Listening... speak clearly, then click mic to stop
          </p>
        )}
      </div>

    </div>
  )
}

export default Chat
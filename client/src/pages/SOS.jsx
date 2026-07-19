
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function SOS() {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [emergencyType, setEmergencyType] = useState('General Emergency')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)
  const [sent, setSent] = useState(false)
  const [quickNumber, setQuickNumber] = useState('')
  const [savedContacts, setSavedContacts] = useState([])

  const userId = localStorage.getItem('userId') || 1

const isValidPhone = (number) => {
  return /^[6-9]\d{9}$/.test(number);
};


  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/contact/${userId}`)
      setSavedContacts(res.data.filter(c => c.phone))
    } catch (err) {
      console.error('Error fetching contacts:', err)
    }
  }

  const getLiveLocation = () => {
    setGettingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          setLocation(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`)
          setGettingLocation(false)
        },
        () => {
          setMessage('Location access denied. Please enter manually.')
          setGettingLocation(false)
        }
      )
    } else {
      setMessage('Geolocation not supported in this browser.')
      setGettingLocation(false)
    }
  }

  const sendSOS = async () => {
    if (!location.trim()) {
      setMessage('Please enter your location first.')
      return
    }
    setLoading(true)
    setMessage('')

    try {
      const res = await axios.post('http://localhost:5000/api/sos', {
        userId,
        location,
        emergencyType
      })
      setSent(true)
      setMessage(res.data.message)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send SOS. Please try again.')
    }
    setLoading(false)
  }

  const logQuickSOS = async (phoneNumber, method) => {
    try {
      await axios.post('http://localhost:5000/api/quicksos', {
        userId,
        phoneNumber,
        method,
        location,
        emergencyType
      })
    } catch (err) {
      console.error('Quick SOS log failed:', err.message)
    }
  }

  const handleCall = (phoneNumber) => {
    if (!isValidPhone(phoneNumber)) {
    setMessage("Please enter a valid 10-digit mobile number.");
    return;
  }
  
  setMessage("");

    logQuickSOS(phoneNumber, 'call')
    window.location.href = `tel:${phoneNumber}`
  }



  const handleSMS = (phoneNumber) => {
  if (!isValidPhone(phoneNumber)) {
    setMessage("Please enter a valid 10-digit mobile number.");
    return;
  }
 setMessage("");  

  logQuickSOS(phoneNumber, 'sms')
  const smsBody = encodeURIComponent(
    `Emergency! I need help. Type: ${emergencyType}. Location: ${location || 'Not shared'}`
  )
  window.location.href = `sms:${phoneNumber}?body=${smsBody}`
}


  return (
    <div className="min-h-screen bg-[#f7f7f8] dark:bg-[#1e3d4a] dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-[#2d6176] dark:via-[#1e3d4a] dark:to-[#12262e] flex flex-col transition-colors duration-300">

      <div className="max-w-4xl mx-auto w-full px-4 pt-6">
        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-sm border border-gray-200 dark:border-slate-500/10 rounded-3xl shadow-sm dark:shadow-none px-6 py-4 flex items-center justify-between transition-colors duration-300">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">🚨 SOS Emergency Alert</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">Send instant alert to trusted contacts</p>
          </div>
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 bg-gray-100 dark:bg-slate-900/40 hover:bg-gray-200 dark:hover:bg-slate-900/60 border border-gray-200 dark:border-cyan-400/30 rounded-xl text-sm font-medium text-gray-700 dark:text-cyan-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            Back Home
          </button>
        </div>
      </div>


     <div className="max-w-4xl mx-auto w-full px-4 pt-3 flex gap-2">
        <button
          onClick={() => navigate('/contacts')}
        className="flex-1 bg-white dark:bg-slate-900/40 backdrop-blur-sm border border-gray-200 dark:border-slate-500/10 hover:bg-gray-50 dark:hover:bg-slate-900/60 active:scale-[0.98] transition-all duration-300 rounded-2xl px-4 py-3.5 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 dark:text-white"
        >
          👥 Contacts
        </button>
        <button
          onClick={() => navigate('/history')}
        className="flex-1 bg-white dark:bg-slate-900/40 backdrop-blur-sm border border-gray-200 dark:border-slate-500/10 hover:bg-gray-50 dark:hover:bg-slate-900/60 active:scale-[0.98] transition-all duration-300 rounded-2xl px-4 py-3.5 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 dark:text-white"
        >
          📜 History
        </button>
      </div>



      <div className="max-w-4xl mx-auto w-full px-4 py-4">

        {!sent ? (
          <div className="bg-white dark:bg-slate-900/40 backdrop-blur-sm border border-gray-200 dark:border-slate-500/10 rounded-3xl shadow-sm dark:shadow-none p-6 md:p-8 space-y-5 transition-colors duration-300">

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Emergency Type
              </label>
              <select
                value={emergencyType}
                onChange={(e) => setEmergencyType(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:border-gray-400 transition"
              >
                <option>General Emergency</option>
                <option>Period Emergency</option>
                <option>Safety Emergency</option>
                <option>Medical Emergency</option>
                <option>Heart Attack</option>
                <option>Road Accident</option>
                <option>Mental Health Crisis</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Your Location
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter location or use GPS..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition"
                />
                <button
                  onClick={getLiveLocation}
                  disabled={gettingLocation}
                  className="px-4 py-3 bg-gray-900 hover:bg-black text-white rounded-2xl text-sm font-medium transition disabled:opacity-60 whitespace-nowrap"
                >
                  {gettingLocation ? '...' : '📍 GPS'}
                </button>
              </div>
            </div>

            {/* Saved contacts jinke paas phone number hai */}
            {savedContacts.length > 0 && (
              <div className="border-t border-gray-100 pt-5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  Saved Contacts — Call / SMS
                </label>
                <div className="space-y-2">
                  {savedContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{contact.name}</p>
                        <p className="text-xs text-gray-400">{contact.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCall(contact.phone)}
                          className="w-9 h-9 bg-emerald-500 hover:bg-emerald-600 rounded-xl flex items-center justify-center text-white transition"
                        >
                          📞
                        </button>
                        <button
                          onClick={() => handleSMS(contact.phone)}
                          className="w-9 h-9 bg-blue-500 hover:bg-blue-600 rounded-xl flex items-center justify-center text-white transition"
                        >
                          💬
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Number — direct call/SMS bina save kiye */}
            <div className="border-t border-gray-100 pt-5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Quick Number (no need to save contact)
              </label>
              <input
                type="tel"
                placeholder="Type any number here..."
                value={quickNumber}
                onChange={(e) => setQuickNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleCall(quickNumber)}
                  disabled={false}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 active:scale-[0.98] transition-all text-white font-semibold py-3 rounded-2xl text-sm"
                >
                  📞 Call Now
                </button>
                <button
                  onClick={() => handleSMS(quickNumber)}
                  disabled={false}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 active:scale-[0.98] transition-all text-white font-semibold py-3 rounded-2xl text-sm"
                >
                  💬 Send SMS
                </button>
              </div>
            </div>

            {message && (
              <div
                className={`px-4 py-3 rounded-2xl text-sm border transition-colors duration-300 ${
                  message.toLowerCase().includes("success") ||
                  message.toLowerCase().includes("sent")
                    ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/30 dark:text-green-300"
                    : "bg-red-50 border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-300"
                }`}
              >
                {message}
              </div>
            )}

            <button
              onClick={sendSOS}
              disabled={loading || !location.trim()}
              className="w-full bg-red-500 hover:bg-red-600 active:scale-[0.98] disabled:opacity-50 transition-all text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-red-500/20"
            >
              {loading ? 'Sending Alert...' : '🚨 Send SOS Now (Email to Trusted Contacts)'}
            </button>

            <p className="text-center text-xs text-gray-400">
              This will send an emergency email to all your trusted contacts with your location.
            </p>

          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900/40 backdrop-blur-sm border border-gray-200 dark:border-slate-700/30 rounded-3xl shadow-sm dark:shadow-none p-8 text-center transition-colors duration-300">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">SOS Alert Sent!</h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
              Your trusted contacts have been notified with your location and emergency type.
            </p>
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800/70 dark:to-slate-900/60 border border-gray-200 dark:border-cyan-400/20 rounded-2xl px-5 py-4 text-left mb-6 space-y-2 shadow-sm dark:shadow-cyan-500/5 transition-all duration-300">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Alert Details</p>
              <p className="text-sm text-gray-700 dark:text-slate-200">📍 Location: <span className="font-semibold text-gray-900 dark:text-white">{location}</span></p>
              <p className="text-sm text-gray-700 dark:text-slate-200">🚨 Type: <span className="font-semibold text-gray-900 dark:text-white">{emergencyType}</span></p>
            </div>
            <button
              onClick={() => { setSent(false); setLocation(''); setMessage('') }}
              className="w-full bg-gray-900 hover:bg-black text-white font-medium py-3 rounded-2xl text-sm transition mb-3"
            >
              Send Another Alert
            </button>

           <p className="text-center text-xs text-slate-300 mt-2">
            Want to manage your contacts?{" "}
            <a
              href="/contacts"
              className="text-cyan-400 hover:text-cyan-300 underline font-medium transition-colors duration-300"
            >
              Manage Contacts →
            </a>
          </p>
            <button
              onClick={() => navigate('/home')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-2xl text-sm transition"
            >
              Back Home
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default SOS
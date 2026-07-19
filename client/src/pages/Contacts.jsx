import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Contacts() {
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)

  const userId = localStorage.getItem('userId') || 1

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/contact/${userId}`)
      setContacts(res.data)
    } catch (err) {
      console.error('Error fetching contacts:', err)
    }
  }

  const addContact = async () => {
    if (!name || (!email && !phone)) {
      setMessage('Name and at least one of email or phone are required.')
      return
    }


    setLoading(true)
    setMessage('')
    try {
      await axios.post('http://localhost:5000/api/contact', {
        userId,
        name,
        email,
        phone
      })
      setName('')
      setEmail('')
      setPhone('')
      setShowForm(false)
      setMessage('Contact added successfully!')
      fetchContacts()
    } catch (err) {
      setMessage('Failed to add contact. Please try again.')
    }
    setLoading(false)
  }

  const deleteContact = async (id) => {
    if (!window.confirm('Delete this contact?')) return
    try {
      await axios.delete(`http://localhost:5000/api/contact/${id}`)
      setContacts(prev => prev.filter(c => c.id !== id))
      setMessage('Contact deleted.')
    } catch (err) {
      setMessage('Failed to delete contact.')
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] dark:bg-[#1e3d4a] dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-[#2d6176] dark:via-[#1e3d4a] dark:to-[#12262e] flex flex-col transition-colors duration-300">

      <div className="max-w-4xl mx-auto w-full px-4 pt-6">
        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-sm border border-gray-200 dark:border-slate-700/30 rounded-3xl shadow-sm dark:shadow-none px-6 py-4 flex items-center justify-between transition-colors duration-300">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">👥 Trusted Contacts</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">Manage your emergency contacts</p>
          </div>


          <button
            onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-100 dark:bg-slate-900/40 hover:bg-gray-200 dark:hover:bg-slate-900/60 border border-gray-200 dark:border-cyan-400/30 rounded-xl text-sm font-medium text-gray-700 dark:text-cyan-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            ← Back
          </button>

        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 py-4 space-y-4">

        {message && (
          <div className={`px-4 py-3 rounded-2xl text-sm font-medium ${
            message.includes('success') || message.includes('added')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-medium py-3.5 rounded-2xl text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-cyan-500/20"
          >
            + Add New Contact
          </button>
        ) : (
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Add New Contact</h3>

            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Full Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-gray-400 transition"
              />
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                </svg>
              </span>


              <input
                type="email"
                placeholder="Email Address (optional if phone given)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-gray-400 transition"
              />
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
                </svg>
              </span>


              <input
                type="tel"
                placeholder="Phone Number (optional if email given)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-gray-400 transition"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={addContact}
                disabled={loading}
                className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-2xl text-sm transition disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Contact'}
              </button>
              <button
                onClick={() => { setShowForm(false); setMessage('') }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-2xl text-sm transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-sm border border-gray-200 dark:border-slate-700/30 rounded-3xl shadow-sm dark:shadow-none overflow-hidden transition-colors duration-300">
          {contacts.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl block mb-3">👥</span>
              <p className="text-gray-500 text-sm">No trusted contacts yet.</p>
              <p className="text-gray-400 text-xs mt-1">Add contacts who will receive your SOS alerts.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {contacts.map((contact, i) => (
                <div key={contact.id} className="flex items-center justify-between px-5 py-4 transition-all duration-300 hover:bg-cyan-50 dark:hover:bg-slate-900/60">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-2xl flex items-center justify-center font-semibold text-white text-sm shadow-md">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{contact.name}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-400">{contact.email}</p>
                      {contact.phone && <p className="text-xs text-gray-400 dark:text-slate-400">{contact.phone}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Contacts
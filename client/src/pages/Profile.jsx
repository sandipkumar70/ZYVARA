// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'

// function Profile() {
//   const navigate = useNavigate()
//   const [profile, setProfile] = useState(null)
//   const [name, setName] = useState('')
//   const [city, setCity] = useState('')
//   const [gender, setGender] = useState('female')
//   const [message, setMessage] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [editing, setEditing] = useState(false)

//   const userId = localStorage.getItem('userId') || 1

//   useEffect(() => {
//     fetchProfile()
//   }, [])

//   const fetchProfile = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/user/${userId}`)
//       setProfile(res.data)
//       setName(res.data.name)
//       setCity(res.data.city || '')
//       setGender(res.data.gender || 'female')
//     } catch (err) {
//       console.error('Error fetching profile:', err)
//     }
//   }

//   const saveProfile = async () => {
//     setLoading(true)
//     setMessage('')
//     try {
//       const res = await axios.put(`http://localhost:5000/api/user/${userId}`, {
//         name, city, gender
//       })
//       setProfile(res.data.user)
//       localStorage.setItem('gender', res.data.user.gender)
//       setMessage('Profile updated successfully!')
//       setEditing(false)
//     } catch (err) {
//       setMessage('Failed to update profile.')
//     }
//     setLoading(false)
//   }

//   const handleLogout = () => {
//     localStorage.clear()
//     navigate('/')
//   }

//   if (!profile) {
//     return (
//       <div className="min-h-screen bg-[#f7f7f8] flex items-center justify-center">
//         <p className="text-gray-400 text-sm">Loading profile...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-[#f7f7f8] flex flex-col">

//       <div className="max-w-4xl mx-auto w-full px-4 pt-6">
//         <div className="bg-white border border-gray-200 rounded-3xl shadow-sm px-6 py-4 flex items-center justify-between">
//           <div>
//             <h2 className="text-xl md:text-2xl font-semibold text-gray-900">👤 My Profile</h2>
//             <p className="text-sm text-gray-500">Manage your account details</p>
//           </div>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition"
//           >
//             ← Back
//           </button>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto w-full px-4 py-4">
//         <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 md:p-8 space-y-5">

//           <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
//             <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
//               {profile.name.charAt(0).toUpperCase()}
//             </div>
//             <div>
//               <p className="font-semibold text-gray-900">{profile.name}</p>
//               <p className="text-xs text-gray-400">{profile.email}</p>
//             </div>
//           </div>

//           {message && (
//             <div className={`px-4 py-3 rounded-2xl text-sm font-medium ${
//               message.includes('success')
//                 ? 'bg-green-50 text-green-700 border border-green-200'
//                 : 'bg-red-50 text-red-600 border border-red-200'
//             }`}>
//               {message}
//             </div>
//           )}

//           {!editing ? (
//             <>
//               <div className="space-y-3">
//                 <div className="flex justify-between px-4 py-3 bg-gray-50 rounded-2xl">
//                   <span className="text-xs text-gray-500 uppercase tracking-wider">City</span>
//                   <span className="text-sm font-medium text-gray-800">{profile.city || 'Not set'}</span>
//                 </div>
//                 <div className="flex justify-between px-4 py-3 bg-gray-50 rounded-2xl">
//                   <span className="text-xs text-gray-500 uppercase tracking-wider">Gender</span>
//                   <span className="text-sm font-medium text-gray-800 capitalize">{profile.gender}</span>
//                 </div>
//               </div>

//               <button
//                 onClick={() => setEditing(true)}
//                 className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3.5 rounded-2xl text-sm transition"
//               >
//                 Edit Profile
//               </button>
//             </>
//           ) : (
//             <>
//               <div className="space-y-4">
//                 <input
//                   type="text"
//                   placeholder="Full Name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-gray-400 transition"
//                 />
//                 <input
//                   type="text"
//                   placeholder="City"
//                   value={city}
//                   onChange={(e) => setCity(e.target.value)}
//                   className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-gray-400 transition"
//                 />
//                 <div className="flex gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setGender('female')}
//                     className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all ${
//                       gender === 'female' ? 'bg-black text-white' : 'bg-gray-50 border border-gray-200 text-gray-500'
//                     }`}
//                   >
//                     👩 Female
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setGender('male')}
//                     className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all ${
//                       gender === 'male' ? 'bg-black text-white' : 'bg-gray-50 border border-gray-200 text-gray-500'
//                     }`}
//                   >
//                     👨 Male
//                   </button>
//                 </div>
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={saveProfile}
//                   disabled={loading}
//                   className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-2xl text-sm transition disabled:opacity-50"
//                 >
//                   {loading ? 'Saving...' : 'Save Changes'}
//                 </button>
//                 <button
//                   onClick={() => { setEditing(false); setMessage('') }}
//                   className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-2xl text-sm transition"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </>
//           )}

//           <button
//             onClick={handleLogout}
//             className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 rounded-2xl text-sm transition"
//           >
//             Logout
//           </button>

//         </div>
//       </div>
//     </div>
//   )
// }

// export default Profile













//NEW POLISHED VERSION-----------------------
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [gender, setGender] = useState('female')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)

  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwMessage, setPwMessage] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const userId = localStorage.getItem('userId') || 1

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/${userId}`)
      setProfile(res.data)
      setName(res.data.name)
      setCity(res.data.city || '')
      setGender(res.data.gender || 'female')
    } catch (err) {
      console.error('Error fetching profile:', err)
    }
  }

  const saveProfile = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await axios.put(`http://localhost:5000/api/user/${userId}`, {
        name, city, gender
      })
      setProfile(res.data.user)
      localStorage.setItem('gender', res.data.user.gender)
      setMessage('Profile updated successfully!')
      setEditing(false)
    } catch (err) {
      setMessage('Failed to update profile.')
    }
    setLoading(false)
  }

  const cancelEdit = () => {
    setEditing(false)
    setMessage('')
    setName(profile.name)
    setCity(profile.city || '')
    setGender(profile.gender || 'female')
  }

  const updatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwMessage('Please fill all password fields.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwMessage('New password and confirm password do not match.')
      return
    }
    setPwLoading(true)
    setPwMessage('')
    try {
      const res = await axios.put(`http://localhost:5000/api/user/${userId}/password`, {
        currentPassword, newPassword
      })
      setPwMessage(res.data.message)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPwMessage(err.response?.data?.message || 'Failed to update password.')
    }
    setPwLoading(false)
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f7f7f8] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] dark:bg-[#1e3d4a] dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-[#2d6176] dark:via-[#1e3d4a] dark:to-[#12262e] flex flex-col relative transition-colors duration-300">

      <div className="max-w-2xl mx-auto w-full px-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-cyan-400/30 hover:bg-cyan-50 dark:hover:bg-slate-900/60 text-sm font-medium text-gray-700 dark:text-white rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          ← Back
        </button>
      </div>

      <div className="max-w-2xl mx-auto w-full px-4 py-4">
        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-sm border border-gray-200 dark:border-slate-700/30 rounded-3xl shadow-sm dark:shadow-none p-6 md:p-8 space-y-6 transition-colors duration-300">

          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-3xl flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-105">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <p className="font-bold text-xl text-gray-900 dark:text-white">{profile.name}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">{profile.email}</p>
          </div>

          <div className="border-t border-gray-200 dark:border-slate-700/40" />

          {message && (
            <div className={`px-4 py-3 rounded-2xl text-sm font-medium ${
              message.includes('success')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-cyan-300 uppercase tracking-[0.18em] mb-1.5 block">
              Full Name
            </label>
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-700/40 bg-gray-50 dark:bg-slate-900/40 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20 transition-all duration-300"
              />
            ) : (
              <p className="text-sm text-gray-800 dark:text-white font-medium">{profile.name}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-cyan-300 uppercase tracking-[0.18em] mb-1.5 flex items-center gap-1">
              Email 🔒
            </label>
            {editing ? (
              <>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-3 rounded-2xl border border-slate-700/40 bg-slate-800/60 text-slate-300 text-sm"
                />
                <p className="text-[11px] text-slate-400 mt-1">Read only — email cannot be changed</p>
              </>
            ) : (
              <p className="text-sm text-gray-800 dark:text-white font-medium">{profile.email}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-cyan-300 uppercase tracking-[0.18em] mb-1.5 block">
              City
            </label>
            {editing ? (
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-700/40 bg-gray-50 dark:bg-slate-900/40 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20 transition-all duration-300"
              />
            ) : (
              <p className="text-sm text-gray-800 dark:text-white font-medium">{profile.city || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-cyan-300 uppercase tracking-[0.18em] mb-1.5 block">
              Gender
            </label>
            {editing ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    gender === 'male' ? 'bg-black text-white' : 'bg-gray-50 border border-gray-200 text-gray-500'
                  }`}
                >
                  👨 Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    gender === 'female' ? 'bg-black text-white' : 'bg-gray-50 border border-gray-200 text-gray-500'
                  }`}
                >
                  👩 Female
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-800 dark:text-white font-medium capitalize">{profile.gender}</p>
            )}
          </div>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-medium py-3.5 rounded-2xl text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-cyan-500/20"
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={saveProfile}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-medium py-3 rounded-2xl text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-cyan-500/20 disabled:opacity-50"
              >
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>
              <button
                onClick={cancelEdit}
                className="flex-1 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-white font-medium py-3 rounded-2xl text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                ❌ Cancel
              </button>
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-slate-700/40" />

          <div>
            <button
              onClick={() => setShowPasswordSection(prev => !prev)}
              className="w-full flex items-center justify-between text-left text-gray-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors duration-300"
            >
              <span className="font-semibold text-gray-900 dark:text-white text-sm">🔒 Change Password</span>
              <span className="text-gray-500 dark:text-slate-300 text-sm">{showPasswordSection ? '▲' : '▼'}</span>
            </button>

            {showPasswordSection && (
              <div className="mt-4 space-y-4">
                {pwMessage && (
                  <div className={`px-4 py-3 rounded-2xl text-sm font-medium ${
                    pwMessage.includes('success')
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-600 border border-red-200'
                  }`}>
                    {pwMessage}
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-cyan-300 uppercase tracking-[0.18em] mb-1.5 block">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-700/40 bg-gray-50 dark:bg-slate-900/40 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-cyan-300 uppercase tracking-[0.18em] mb-1.5 block">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-700/40 bg-gray-50 dark:bg-slate-900/40 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-cyan-300 uppercase tracking-[0.18em] mb-1.5 block">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-700/40 bg-gray-50 dark:bg-slate-900/40 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20 transition-all duration-300"
                  />
                </div>

                <button
                  onClick={updatePassword}
                  disabled={pwLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-medium py-3 rounded-2xl text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-cyan-500/20 disabled:opacity-50"
                >
                  {pwLoading ? 'Updating...' : '🔄 Update Password'}
                </button>
              </div>
            )}
          </div>




         <div className="border-t border-gray-200 dark:border-slate-700/40"/>

          {/* History */}
          <button
            onClick={() => navigate('/history')}
            className="w-full bg-cyan-50 dark:bg-slate-900/40 hover:bg-cyan-100 dark:hover:bg-slate-900/60 text-cyan-600 dark:text-cyan-400 font-medium py-3.5 rounded-2xl text-sm border border-cyan-200 dark:border-cyan-400/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            📜 View SOS History
          </button>

          {/* Logout */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-medium py-3.5 rounded-2xl text-sm border border-red-200 dark:border-red-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            🚪 Logout
          </button>



        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-lg p-6 max-w-sm w-full text-center">
            <p className="text-gray-800 font-medium mb-5">Are you sure you want to logout?</p>
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-2xl text-sm transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-white font-medium py-3 rounded-2xl text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Profile
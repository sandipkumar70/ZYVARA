import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Symptom from './pages/Symptom'
import SOS from './pages/SOS'
import Ambulance from './pages/Ambulance'
import Contacts from './pages/Contacts'
import Profile from './pages/Profile'
import HospitalFinder from './pages/HospitalFinder'
import History from './pages/History'
import Mood from './pages/Mood'
import Period from './pages/Period'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat/:category" element={<Chat />} />
        <Route path="/symptom" element={<Symptom />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/ambulance" element={<Ambulance />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/hospital-finder" element={<HospitalFinder />} />
        <Route path="/history" element={<History />} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/period" element={<Period />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
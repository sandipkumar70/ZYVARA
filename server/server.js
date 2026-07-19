const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const chatRoutes = require('./routes/chat')
const symptomRoutes = require('./routes/symptom')
const sosRoutes = require('./routes/sos')
const contactRoutes = require('./routes/contact')
const userRoutes = require('./routes/user')
const quickSosRoutes = require('./routes/quicksos')
const locationRoutes = require('./routes/location')
const moodRoutes = require('./routes/mood')
const periodRoutes = require('./routes/period')

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/symptom', symptomRoutes)
app.use('/api/sos', sosRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/user', userRoutes)
app.use('/api/quicksos', quickSosRoutes)
app.use('/api/location', locationRoutes)
app.use('/api/mood', moodRoutes)
app.use('/api/period', periodRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Zyvara Server Running!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Mood add/update karo (ek din mein ek hi entry - upsert)
router.post('/', async (req, res) => {
  try {
    const { userId, mood, note, date } = req.body

    if (!userId || !mood) {
      return res.status(400).json({ message: 'userId and mood are required' })
    }

    // date agar nahi diya to aaj ki date use karo (sirf date part, time nahi)
    const entryDate = date ? new Date(date) : new Date()
    entryDate.setHours(0, 0, 0, 0)

    const entry = await prisma.moodEntry.upsert({
      where: {
        userId_date: {
          userId: parseInt(userId),
          date: entryDate
        }
      },
      update: {
        mood,
        note: note || null
      },
      create: {
        userId: parseInt(userId),
        mood,
        note: note || null,
        date: entryDate
      }
    })

    res.status(201).json({
      message: 'Mood saved!',
      entry
    })
  }
  catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Mood history dekho (saari entries, latest pehle)
router.get('/:userId', async (req, res) => {
  try {
    const entries = await prisma.moodEntry.findMany({
      where: { userId: parseInt(req.params.userId) },
      orderBy: { date: 'desc' }
    })
    res.json(entries)
  }
  catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Aaj ka mood dekho
router.get('/:userId/today', async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const entry = await prisma.moodEntry.findUnique({
      where: {
        userId_date: {
          userId: parseInt(req.params.userId),
          date: today
        }
      }
    })
    res.json(entry)
  }
  catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Mood entry delete karo
router.delete('/:id', async (req, res) => {
  try {
    await prisma.moodEntry.delete({
      where: { id: parseInt(req.params.id) }
    })
    res.json({ message: 'Mood entry deleted!' })
  }
  catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router
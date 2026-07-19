const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Naya period cycle log karo (start date ke sath)
router.post('/', async (req, res) => {
  try {
    const { userId, startDate, endDate, flowIntensity, symptoms, notes } = req.body

    if (!userId || !startDate) {
      return res.status(400).json({ message: 'userId and startDate are required' })
    }

    if (endDate && new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: 'End date cannot be before start date' })
    }

    const entry = await prisma.periodEntry.create({
      data: {
        userId: parseInt(userId),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        flowIntensity: flowIntensity || null,
        symptoms: symptoms || [],
        notes: notes || null
      }
    })

    res.status(201).json({ message: 'Period logged!', entry })
  }
  catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Existing entry update karo (jaise end date, flow, symptoms baad me add karna)
router.put('/:id', async (req, res) => {
  try {
    const { startDate, endDate, flowIntensity, symptoms, notes } = req.body

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: 'End date cannot be before start date' })
    }

    const entry = await prisma.periodEntry.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(flowIntensity !== undefined && { flowIntensity }),
        ...(symptoms !== undefined && { symptoms }),
        ...(notes !== undefined && { notes })
      }
    })

    res.json({ message: 'Period entry updated!', entry })
  }
  catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Poori cycle history dekho (latest pehle)
router.get('/:userId/history', async (req, res) => {
  try {
    const entries = await prisma.periodEntry.findMany({
      where: { userId: parseInt(req.params.userId) },
      orderBy: { startDate: 'desc' }
    })
    res.json(entries)
  }
  catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Prediction: average cycle length se next period calculate karo
router.get('/:userId/prediction', async (req, res) => {
  try {
    const entries = await prisma.periodEntry.findMany({
      where: { userId: parseInt(req.params.userId) },
      orderBy: { startDate: 'asc' }
    })

    if (entries.length === 0) {
      return res.json({
        hasData: false,
        message: 'Log your first period to see predictions'
      })
    }

    const DAY = 24 * 60 * 60 * 1000
    const lastEntry = entries[entries.length - 1]
    const lastStart = new Date(lastEntry.startDate)

    // Cycle lengths nikaalo (consecutive start dates ke beech ka gap)
    let avgCycleLength = 28 // default fallback
    if (entries.length >= 2) {
      const gaps = []
      for (let i = 1; i < entries.length; i++) {
        const gap = Math.round((new Date(entries[i].startDate) - new Date(entries[i - 1].startDate)) / DAY)
        gaps.push(gap)
      }
      avgCycleLength = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length)
    }

    // Average period duration (sirf jinka endDate hai)
    const durationsEntries = entries.filter(e => e.endDate)
    let avgDuration = null
    if (durationsEntries.length > 0) {
      const durations = durationsEntries.map(e =>
        Math.round((new Date(e.endDate) - new Date(e.startDate)) / DAY) + 1
      )
      avgDuration = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const currentCycleDay = Math.floor((today - new Date(lastStart.setHours(0, 0, 0, 0))) / DAY) + 1

    const nextExpected = new Date(lastEntry.startDate)
    nextExpected.setDate(nextExpected.getDate() + avgCycleLength)
    nextExpected.setHours(0, 0, 0, 0)

    const daysRemaining = Math.round((nextExpected - today) / DAY)

    res.json({
      hasData: true,
      currentCycleDay,
      lastPeriodDate: lastEntry.startDate,
      lastFlow: lastEntry.flowIntensity,
      avgCycleLength,
      avgDuration,
      nextExpectedDate: nextExpected,
      daysRemaining,
      totalCyclesLogged: entries.length
    })
  }
  catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router
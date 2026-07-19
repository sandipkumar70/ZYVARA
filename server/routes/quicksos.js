const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

router.post('/', async (req, res) => {
  try {
    const { userId, phoneNumber, method, location, emergencyType } = req.body

    if (!userId || !phoneNumber || !method) {
      return res.status(400).json({ message: 'userId, phoneNumber and method are required' })
    }

    const log = await prisma.quickSOSLog.create({
      data: {
        userId: parseInt(userId),
        phoneNumber,
        method,
        location: location || null,
        emergencyType: emergencyType || null
      }
    })

    res.status(201).json({ message: 'Logged successfully', log })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})


// User ka Quick SOS history dekho
router.get('/:userId', async (req, res) => {
  try {
    const logs = await prisma.quickSOSLog.findMany({
      where: { userId: parseInt(req.params.userId) },
      orderBy: { createdAt: 'desc' }
    })
    res.json(logs)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})


module.exports = router
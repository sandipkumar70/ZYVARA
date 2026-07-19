const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Database mein saved locations dekho (city ke hisab se, optional filter)
router.get('/', async (req, res) => {
  try {
    const { city } = req.query
    const locations = await prisma.location.findMany({
      where: city ? { city: { equals: city, mode: 'insensitive' } } : {}
    })
    res.json(locations)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router
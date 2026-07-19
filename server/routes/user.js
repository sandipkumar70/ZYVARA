const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Profile fetch karo
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      select: {
        id: true,
        name: true,
        email: true,
        city: true,
        gender: true,
        createdAt: true
      }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Profile update karo
router.put('/:id', async (req, res) => {
  try {
    const { name, city, gender } = req.body

    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { name, city, gender },
      select: {
        id: true,
        name: true,
        email: true,
        city: true,
        gender: true
      }
    })

    res.json({ message: 'Profile updated!', user })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router
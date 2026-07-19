const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


// Contact add karo
router.post('/', async (req, res) => {
  try {
    const { userId, name, email, phone } = req.body

    if (!name || (!email && !phone)) {
      return res.status(400).json({ message: 'Name and at least one of email or phone are required' })
    }

    const contact = await prisma.trustedContact.create({
      data: {
        userId: parseInt(userId),
        name,
        email: email || null,
        phone: phone || null
      }
    })



    res.status(201).json({ 
      message: 'Contact added!', 
      contact 
    })
  } 
  catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Contacts list dekho
router.get('/:userId', async (req, res) => {
  try {
    const contacts = await prisma.trustedContact.findMany({
      where: { userId: parseInt(req.params.userId) }
    })
    res.json(contacts)
  } 
  
  catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})



// Contact delete karo
router.delete('/:id', async (req, res) => {
  try {
    await prisma.trustedContact.delete({
      where: { id: parseInt(req.params.id) }
    })
    res.json({ message: 'Contact deleted!' })
  } 

  catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})


module.exports = router
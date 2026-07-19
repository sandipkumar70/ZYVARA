const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

router.post('/', async (req, res) => {
  try {
    const { userId, location, emergencyType } = req.body

    // User dhundho
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: { contacts: true }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.contacts.length === 0) {
      return res.status(400).json({ message: 'No trusted contacts found' })
    }

    // Email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })


    
    // Har contact ko email bhejo (jinke paas email hai)
    for (const contact of user.contacts) {
      if (!contact.email) continue

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: contact.email,
        subject: `🚨 ZYVARA SOS Alert - ${user.name} needs help!`,
        html: `
          <h2>🚨 Emergency Alert!</h2>
          <p><strong>${user.name}</strong> needs immediate help!</p>
          <p><strong>Emergency Type:</strong> ${emergencyType}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p>Please contact them immediately!</p>
          <br>
          <p>-- ZYVARA Emergency System --</p>
        `
      })
    }




    res.json({ message: 'SOS alert sent successfully!' })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router
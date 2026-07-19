const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, city, gender } = req.body



    // Email already exist karta hai?
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    // Password encrypt karo
    const hashedPassword = await bcrypt.hash(password, 10)

    // User save karo
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        city,
        gender: gender || 'female'
      }
    })


    res.status(201).json({ message: 'Register successful!' })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // User dhundho
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(400).json({ message: 'Email not found' })
    }

    // Password check karo
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong password' })
    }

    // Token banao
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )


    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender
      }
    })


  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})


// Forgot Password - OTP bhejo
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minute expiry

    await prisma.user.update({
      where: { email },
      data: { resetOtp: otp, resetOtpExpiry: expiry }
    })

    const nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 ZYVARA Password Reset OTP',
      html: `
        <h2>Password Reset Request</h2>
        <p>Your OTP is: <strong style="font-size: 24px;">${otp}</strong></p>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    })

    res.json({ message: 'OTP sent to your email!' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})


// OTP verify karo
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.resetOtp) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: 'Incorrect OTP' })
    }

    if (new Date() > user.resetOtpExpiry) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' })
    }

    res.json({ message: 'OTP verified!' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Naya password set karo
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.resetOtp) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: 'Incorrect OTP' })
    }

    if (new Date() > user.resetOtpExpiry) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetOtp: null,
        resetOtpExpiry: null
      }
    })

    res.json({ message: 'Password reset successfully!' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router
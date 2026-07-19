const express = require('express')
const router = express.Router()
const Groq = require('groq-sdk')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })


router.post('/', async (req, res) => {
  try {
    const { symptoms, category, userId } = req.body


    const prompt = `You are a medical expert. Analyze these symptoms: "${symptoms}" 
    related to ${category}. 
    
    IMPORTANT - Language rules:
    - By default, match the user's input language and script (English stays English, Hinglish stays Hinglish).
    - SPECIAL RULE: If the user explicitly asks for Hindi script (e.g. says "hindi mein batao","in hindi", "hindi akshar mein", "हिंदी में जवाब दो", or writes in Devanagari script), then respond ONLY in Devanagari Hindi script (हिंदी अक्षर), not Hinglish.
    
    Respond in this exact format:
    SEVERITY: (write only RED or YELLOW or GREEN)
    ADVICE: (write 2-3 lines of advice following the language rules above)
    
    RED means = go to hospital immediately
    YELLOW means = rest and observe
    GREEN means = normal, no worry`
    

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
    })

    const response = completion.choices[0].message.content

    // Severity parse karo
    const severityMatch = response.match(/SEVERITY:\s*(RED|YELLOW|GREEN)/i)
    const adviceMatch = response.match(/ADVICE:\s*([\s\S]+)/i)

    const severity = severityMatch ? severityMatch[1].toUpperCase() : 'YELLOW'
    const advice = adviceMatch ? adviceMatch[1].trim() : response

    // Symptom check ko EmergencyRequest table mein save karo
    if (userId) {
      await prisma.emergencyRequest.create({
        data: {
          userId: parseInt(userId),
          category,
          symptom: symptoms,
          severity
        }
      })
    }

    res.json({
      severity,
      advice,
      color: severity === 'RED' ? 'red' : severity === 'GREEN' ? 'green' : 'yellow'
    })


  } catch (error) {
     console.error('Symptom error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router
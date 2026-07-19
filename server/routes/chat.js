
const express = require('express')
const router = express.Router()
const Groq = require('groq-sdk')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

router.post('/', async (req, res) => {
  try {
    const { message, category, userId, history } = req.body

    const languageRule = `
IMPORTANT - Language rules:
- Match the user's input language exactly (English → English, Hinglish → Hinglish, Hindi script → Hindi script).

IMPORTANT - Behave like a REAL DOCTOR in a clinic:

STEP 1 - When patient describes a problem for the FIRST TIME:
- Show empathy first
- Ask 2-3 relevant follow-up questions to understand better
- Do NOT give full advice yet

STEP 2 - When patient ANSWERS your questions:
- Acknowledge their answers
- Give proper assessment and advice:
  🔍 Assessment: (based on what patient told)
  ⚠️ Severity: Mild / Moderate / Serious
  ✅ What to do: (3-4 practical steps)
  🏥 Should you see a doctor: Yes/No and when

STEP 3 - For FOLLOW-UP questions:
- Answer conversationally like a doctor
- Short and natural response

STEP 4 - For EMERGENCY symptoms:
- 🚨 Call 108 immediately
- Give 2-3 instant first-aid steps

ALWAYS remember full conversation history.
NEVER use same format for every message.
Respond naturally like a caring Indian doctor.
`

    const prompts = {
      period: `You are an experienced gynecologist. Give helpful advice. ${languageRule}`,
      safety: `You are a women safety expert. Give immediate safety advice. ${languageRule}`,
      pregnancy: `You are an obstetrician. Give helpful pregnancy advice. ${languageRule}`,
      mental: `You are a counselor. Give calming and supportive advice. ${languageRule}`,
      general: `You are a general doctor. Give helpful health advice. ${languageRule}`,
      heart: `You are a cardiologist. Give helpful advice for heart-related symptoms. ${languageRule}`,
      breathing: `You are a pulmonologist. Give helpful advice for breathing problems. ${languageRule}`,
      injury: `You are an emergency physician. Give helpful advice for physical injuries. ${languageRule}`,
      food: `You are a doctor. Give helpful advice for food poisoning symptoms. ${languageRule}`,
      bleeding: `You are an emergency physician. Give helpful advice for bleeding issues. ${languageRule}`,
      fever: `You are a general physician. Give helpful advice for fever and cold. ${languageRule}`,
      dizziness: `You are a doctor. Give helpful advice for dizziness and fainting. ${languageRule}`,
      muscle: `You are a doctor. Give helpful advice for muscle and chest pain. ${languageRule}`,
      anger: `You are a counselor. Give helpful advice for anger and stress management. ${languageRule}`,
      accident: `You are an emergency physician. Give helpful advice for road accident injuries. ${languageRule}`,
      hormonal: `You are an endocrinologist. Give helpful advice for hormonal issues. ${languageRule}`,
    }

    const systemPrompt = prompts[category] || prompts.general

    const conversationHistory = (history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.text
    }))

    //console.log('History received:', conversationHistory.length, 'messages')  //ye backend me janane ke liye ki histry create ho  rha hai ki nhi 

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
    })

    const aiResponse = completion.choices[0].message.content

    await prisma.chatHistory.create({
      data: {
        userId: parseInt(userId),
        category: category || 'general',
        message,
        aiResponse
      }
    })

    res.json({ response: aiResponse })

  } catch (error) {
    console.error('Chat error:', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router
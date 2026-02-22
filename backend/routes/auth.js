const express = require('express')
const router = express.Router()
const admin = require('../firebaseAdmin')
const pool = require('../db')

router.post('/register', async (req, res) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split('Bearer ')[1]

  // 🔍 DEBUG LOGS — DO NOT KEEP IN PRODUCTION
  console.log("=== /auth/register hit ===")
  console.log("Authorization header exists:", !!authHeader)
  console.log("Token exists:", !!token)
  console.log("Request email:", req.body?.email)

  try {
    const decoded = await admin.auth().verifyIdToken(token)

    console.log("Token verified for UID:", decoded.uid)
    console.log("Token project:", decoded.aud)

    const { email } = req.body

    await pool.query(
      'INSERT INTO users (firebase_uid, email) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [decoded.uid, email]
    )

    console.log("User inserted into DB")

    res.status(201).json({ message: 'User registered' })
  } catch (error) {
    console.error("❌ VERIFY TOKEN ERROR:", error)
    res.status(401).json({ error: 'Unauthorized' })
  }
})

module.exports = router
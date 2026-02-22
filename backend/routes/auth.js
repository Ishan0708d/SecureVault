const express = require('express')
const router = express.Router()
const admin = require('../firebaseAdmin')
const pool = require('../db')

router.post('/register', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1]

  try {
    const decoded = await admin.auth().verifyIdToken(token)

    const { email } = req.body

    await pool.query(
      'INSERT INTO users (firebase_uid, email) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [decoded.uid, email]
    )

    res.status(201).json({ message: 'User registered' })
  } catch (error) {
    console.log('Error:', error.message)
    res.status(401).json({ error: 'Unauthorized' })
  }
})

module.exports = router
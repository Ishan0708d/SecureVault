const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const admin = require('../firebaseAdmin')
const pool = require('../db')
const fs = require('fs')

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`
    cb(null, uniqueName)
  }
})

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|txt/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (extname && mimetype) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
})

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1]
  try {
    const decoded = await admin.auth().verifyIdToken(token)
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Unauthorized' })
  }
}

// Upload route
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const { originalname, filename, path: filePath } = req.file

    // Get user from PostgreSQL
    const userResult = await pool.query(
      'SELECT id FROM users WHERE firebase_uid = $1',
      [req.user.uid]
    )
    const userId = userResult.rows[0].id

    // Save file metadata to PostgreSQL
    await pool.query(
      'INSERT INTO files (user_id, filename, file_url) VALUES ($1, $2, $3)',
      [userId, originalname, filePath]
    )

    res.status(201).json({ message: 'File uploaded successfully' })
  } catch (error) {
    console.log('Error:', error.message)
    res.status(500).json({ error: 'Failed to upload file' })
  }
})

// Get all files for logged in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT id FROM users WHERE firebase_uid = $1',
      [req.user.uid]
    )

    if (userResult.rows.length === 0) {
      return res.json([])
    }

    const userId = userResult.rows[0].id
    const result = await pool.query(
      'SELECT * FROM files WHERE user_id = $1 ORDER BY uploaded_at DESC',
      [userId]
    )
    res.json(result.rows)
  } catch (error) {
    console.log('Fetch error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Delete a file
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT id FROM users WHERE firebase_uid = $1',
      [req.user.uid]
    )
    const userId = userResult.rows[0].id
    const fileResult = await pool.query(
      'SELECT file_url FROM files WHERE id = $1 AND user_id = $2',
      [req.params.id, userId]
    )

    if (fileResult.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' })
    }

    const filePath = fileResult.rows[0].file_url


    await pool.query(
      'DELETE FROM files WHERE id = $1 AND user_id = $2',
      [req.params.id, userId]
    )

    // Delete from local storage
    fs.unlink(filePath, (err) => {
      if (err) console.log('Error deleting file from storage:', err.message)
    })

    res.json({ message: 'File deleted' })
  } catch (error) {
    console.log('Error:', error.message)
    res.status(500).json({ error: 'Failed to delete file' })
  }
})

module.exports = router
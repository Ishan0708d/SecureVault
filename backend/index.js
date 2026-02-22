const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth')
const filesRoutes = require('./routes/files')
const path = require('path')
require('dotenv').config();

const app = express();
app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      origin === 'https://secure-vault-six-plum.vercel.app' ||
      origin.includes('ishand694') ||
      origin === 'http://localhost:5173'
    ) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

app.use('/auth', authRoutes)
app.use('/files', filesRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
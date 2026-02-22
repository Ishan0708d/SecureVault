const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth')
const filesRoutes = require('./routes/files')
const path = require('path')
require('dotenv').config();

const app = express();
app.use(cors());
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
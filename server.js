const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const uploadRoutes = require('./routes/uploadRoutes');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // if you need cookies/auth
}));

// Connect MongoDB
mongoose
  .connect('mongodb+srv://guptaadarshfxdx:987654321@cluster0.kjxvltk.mongodb.net/svngoderma')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
app.use('/api/upload', uploadRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

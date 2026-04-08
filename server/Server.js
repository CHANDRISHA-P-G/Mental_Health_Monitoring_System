// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const responseRoutes = require('./routes/responseRoutes');
const authRoutes = require('./routes/auth'); // your auth routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug logger
app.use((req, res, next) => {
  console.log('Incoming:', req.method, req.url);
  next();
});

// Connect to MongoDB
console.log("Connecting to:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => {
    console.error("❌ Mongo Error:", err);
  });

// Routes
app.use('/api/auth', authRoutes); // your auth routes
app.use('/api/responses', responseRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route Not Found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
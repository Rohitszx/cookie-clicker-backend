const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { processClick, getUserStats, resetGame } = require('./jobs/clickJobs');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb+srv://rohitszx:Test123@cluster0.jl4wr.mongodb.net/clickGame')
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));
app.use(express.json());

app.post('/api/click', async (req, res) => {
  try {
    const result = await processClick();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Click processing failed' });
  }
});

app.get('/api/user-stats', async (req, res) => {
  try {
    const stats = await getUserStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'User stats retrieval failed' });
  }
});

app.post('/api/reset', async (req, res) => {
  try {
    const result = await resetGame();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Game reset failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
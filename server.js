import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Problem } from './models/Problem.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ---------------- DATABASE CONNECTION ----------------
// Local MongoDB URI (or replace with your MongoDB Atlas Cloud URI in .env)
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://harunasherif41_db_user:2TRVktqRuvS2VbUt@cluster0.kzxcxrd.mongodb.net/mindhaven?appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('🍃 MongoDB connected successfully!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));


// ---------------- API ENDPOINTS ----------------

// GET /api/problems - Fetch all anonymous problems from DB
app.get('/api/problems', async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch problems from database.' });
  }
});

// POST /api/problems - Create a new anonymous problem in DB
app.post('/api/problems', async (req, res) => {
  const { title, category, description } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Title, category, and description are required.' });
  }

  try {
    const newProblem = await Problem.create({ title, category, description });
    res.status(201).json(newProblem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save problem to database.' });
  }
});

// POST /api/problems/:id/ideas - Save an anonymous idea to a problem
app.post('/api/problems/:id/ideas', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Idea content cannot be empty.' });
  }

  try {
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found.' });
    }

    problem.ideas.push({ content });
    await problem.save();

    const newIdea = problem.ideas[problem.ideas.length - 1];
    res.status(201).json(newIdea);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save idea to database.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🧠 MindHaven Backend running on http://localhost:${PORT}`);
});
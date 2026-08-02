import mongoose from 'mongoose';

// Schema for individual community ideas/solutions
const ideaSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Main Schema for anonymous problems
const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Academic', 'Domestic', 'Career', 'General'],
    default: 'General'
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  ideas: [ideaSchema], // Embedded sub-document array for community ideas
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Problem = mongoose.model('Problem', problemSchema);
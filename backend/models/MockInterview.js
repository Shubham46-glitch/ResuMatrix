const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  analysisReport: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'AnalysisReport',
  },
  questions: {
    type: [String],
    required: true,
  },
  answers: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  evaluation: {
    overallScore: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    technicalKnowledge: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    improvementTips: { type: [String], default: [] },
    idealAnswer: { type: [String], default: [] }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MockInterview', mockInterviewSchema);

const mongoose = require('mongoose');

const analysisReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  resumeName: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    default: '',
  },
  atsScore: {
    type: Number,
    required: true,
  },
  grammar: {
    type: String,
  },
  missingSkills: {
    type: [String],
    default: [],
  },
  matchedSkills: {
    type: [String],
    default: [],
  },
  strengths: {
    type: [String],
    default: [],
  },
  weaknesses: {
    type: [{
        point: String,
        description: String
    }],
    default: [],
  },
  professionalSummary: {
    type: String,
  },
  suggestedProjects: {
    type: [{
        name: String,
        description: String
    }],
    default: [],
  },
  suggestedCertifications: {
    type: [String],
    default: [],
  },
  suggestedTechnologies: {
    type: [String],
    default: [],
  },
  quickImprovements: {
    type: [String],
    default: [],
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AnalysisReport', analysisReportSchema);

const { GoogleGenAI } = require('@google/genai');
const MockInterview = require('../models/MockInterview');
const AnalysisReport = require('../models/AnalysisReport');

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc    Generate interview questions based on resume analysis
// @route   POST /api/interview/generate/:reportId
// @access  Private
const generateInterview = async (req, res) => {
  try {
    const report = await AnalysisReport.findById(req.params.reportId);
    if (!report) {
      return res.status(404).json({ message: 'Analysis Report not found' });
    }

    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const prompt = `
      You are an expert technical interviewer and HR recruiter.
      I need you to generate exactly 10 interview questions for a candidate based on their resume analysis and target job description.
      
      Job Description Context: ${report.jobDescription || 'General Tech Role'}
      Candidate Strengths: ${report.strengths.join(', ')}
      Candidate Weaknesses: ${report.weaknesses.map(w => w.point).join(', ')}
      Matched Skills: ${report.matchedSkills.join(', ')}
      Missing Skills: ${report.missingSkills.join(', ')}
      
      Requirements for the 10 questions:
      - 2 HR/Cultural Fit Questions
      - 3 Technical Questions (based on their skills)
      - 2 Project-based Questions (asking about past experience or hypothetical projects)
      - 2 Scenario-based Questions (problem-solving)
      - 1 Behavioral Question (e.g., handling conflicts, leadership)
      
      Return ONLY a JSON array of 10 strings representing the questions.
      Example:
      [
        "Can you tell me about yourself and your background in tech?",
        "How do you handle disagreements with a team member?",
        "Explain how you would optimize a slow database query in MongoDB.",
        ...
      ]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
          responseMimeType: "application/json",
      }
    });

    const aiResponseText = response.text;
    let questions;
    try {
        const cleanText = aiResponseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        questions = JSON.parse(cleanText);
        if (!Array.isArray(questions) || questions.length !== 10) {
            throw new Error("AI did not return exactly 10 questions in an array.");
        }
    } catch (e) {
        console.error("Failed to parse Gemini JSON:", aiResponseText);
        return res.status(500).json({ message: 'AI returned invalid format.' });
    }

    const mockInterview = await MockInterview.create({
      user: req.user._id,
      analysisReport: report._id,
      questions: questions,
      status: 'pending'
    });

    res.status(201).json(mockInterview);
  } catch (error) {
    console.error('Error in generateInterview:', error);
    if (error.status === 503 || error.message?.includes('503') || error.message?.includes('high demand')) {
        return res.status(503).json({ message: 'The AI is currently experiencing high demand. Please try again in a few moments.' });
    }
    res.status(500).json({ message: 'Server Error generating interview' });
  }
};

// @desc    Evaluate interview answers
// @route   POST /api/interview/evaluate/:interviewId
// @access  Private
const evaluateInterview = async (req, res) => {
  try {
    const interview = await MockInterview.findById(req.params.interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { answers } = req.body;
    
    if (!answers || answers.length !== interview.questions.length) {
        return res.status(400).json({ message: 'Please provide answers for all questions.' });
    }

    const qaPairs = interview.questions.map((q, i) => ({
        question: q,
        answer: answers[i]
    }));

    const prompt = `
      You are an expert technical interviewer evaluating a candidate's mock interview.
      Please evaluate the following questions and the candidate's corresponding answers.
      
      Q&A Pairs:
      ${JSON.stringify(qaPairs, null, 2)}
      
      Return ONLY a JSON object with the following exact structure (no markdown, no code blocks):
      {
        "overallScore": number (0-100),
        "communication": number (0-100),
        "technicalKnowledge": number (0-100),
        "confidence": number (0-100),
        "strengths": [string],
        "weaknesses": [string],
        "improvementTips": [string],
        "idealAnswer": [string (provide 1 ideal answer for each question, so exactly ${qaPairs.length} strings in this array)]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
          responseMimeType: "application/json",
      }
    });

    let evaluation;
    try {
        const cleanText = response.text.replace(/```json/gi, '').replace(/```/g, '').trim();
        evaluation = JSON.parse(cleanText);
    } catch (e) {
        console.error("Failed to parse Gemini JSON:", response.text);
        return res.status(500).json({ message: 'AI returned invalid format.' });
    }

    interview.answers = answers;
    interview.evaluation = evaluation;
    interview.status = 'completed';
    await interview.save();

    res.status(200).json(interview);
  } catch (error) {
    console.error('Error in evaluateInterview:', error);
    if (error.status === 503 || error.message?.includes('503') || error.message?.includes('high demand')) {
        return res.status(503).json({ message: 'The AI is currently experiencing high demand. Please try submitting again in a few moments.' });
    }
    res.status(500).json({ message: 'Server Error evaluating interview' });
  }
};

// @desc    Get all mock interviews for user
// @route   GET /api/interview/history
// @access  Private
const getInterviewHistory = async (req, res) => {
    try {
        const interviews = await MockInterview.find({ user: req.user._id })
            .populate('analysisReport', 'resumeName')
            .sort({ createdAt: -1 });
        res.status(200).json(interviews);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching interview history' });
    }
};

// @desc    Get a single mock interview by ID
// @route   GET /api/interview/:id
// @access  Private
const getInterviewById = async (req, res) => {
    try {
        const interview = await MockInterview.findById(req.params.id)
            .populate('analysisReport', 'resumeName jobDescription');

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        if (interview.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view this interview' });
        }

        res.status(200).json(interview);
    } catch (error) {
        console.error('Error fetching interview:', error);
        res.status(500).json({ message: 'Server Error fetching interview' });
    }
};

// @desc    Delete a mock interview
// @route   DELETE /api/interview/:id
// @access  Private
const deleteInterview = async (req, res) => {
    try {
        const interview = await MockInterview.findById(req.params.id);
        
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        if (interview.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this interview' });
        }

        await MockInterview.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Interview removed' });
    } catch (error) {
        console.error('Error deleting interview:', error);
        res.status(500).json({ message: 'Server Error deleting interview' });
    }
};

// @desc    Delete all mock interviews for a user
// @route   DELETE /api/interview
// @access  Private
const deleteAllInterviews = async (req, res) => {
    try {
        await MockInterview.deleteMany({ user: req.user._id });
        res.status(200).json({ message: 'All interviews removed' });
    } catch (error) {
        console.error('Error deleting all interviews:', error);
        res.status(500).json({ message: 'Server Error deleting all interviews' });
    }
};

module.exports = {
  generateInterview,
  evaluateInterview,
  getInterviewHistory,
  getInterviewById,
  deleteInterview,
  deleteAllInterviews
};

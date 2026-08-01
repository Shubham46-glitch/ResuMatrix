const pdf = require('pdf-parse');
const { GoogleGenAI } = require('@google/genai');
const AnalysisReport = require('../models/AnalysisReport');

// Initialize Gemini API
// Note: Requires GEMINI_API_KEY in .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc    Upload resume, extract text, analyze with Gemini, save report
// @route   POST /api/analyze
// @access  Private
const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (req.file.mimetype !== 'application/pdf') {
       return res.status(400).json({ message: 'Only PDF files are supported' });
    }

    const jobDescription = req.body.jobDescription || '';

    // 1. Extract text from the PDF buffer
    const data = await pdf(req.file.buffer);
    const resumeText = data.text;
    
    // 2. Prepare the prompt for Gemini
    const prompt = `
      You are an expert ATS (Applicant Tracking System) and senior technical recruiter.
      Analyze the following resume text against the provided job description (if any).
      
      Job Description:
      ${jobDescription || 'None provided. Evaluate for general software engineering/tech roles.'}
      
      Resume Text:
      ${resumeText}
      
      Return ONLY a JSON object (no markdown, no code blocks, just raw JSON) with the following exact structure:
      {
        "atsScore": number (0-100),
        "grammar": string (brief feedback on grammar/spelling),
        "matchedSkills": [string],
        "missingSkills": [string],
        "strengths": [string],
        "weaknesses": [
           { "point": "short title", "description": "detailed explanation" }
        ],
        "professionalSummary": string (a short summary of the candidate's profile),
        "suggestedProjects": [
           { "name": "project title", "description": "what to build to fill gaps" }
        ],
        "suggestedCertifications": [string],
        "suggestedTechnologies": [string],
        "quickImprovements": [string]
      }
    `;

    // 3. Call Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
          responseMimeType: "application/json",
      }
    });

    const aiResponseText = response.text;
    
    let analysisResult;
    try {
        const cleanText = aiResponseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        analysisResult = JSON.parse(cleanText);
    } catch (e) {
        console.error("Failed to parse Gemini JSON:", aiResponseText);
        return res.status(500).json({ message: 'AI returned invalid format.' });
    }

    // 4. Save to Database
    const report = await AnalysisReport.create({
        user: req.user._id,
        resumeName: req.file.originalname,
        jobDescription: jobDescription,
        ...analysisResult
    });

    // 5. Send response
    res.status(200).json({ 
        message: 'Analysis complete',
        report
    });

  } catch (error) {
    console.error('Error in analyzeResume:', error);
    if (error.status === 503 || error.message?.includes('503') || error.message?.includes('high demand')) {
        return res.status(503).json({ message: 'The AI is currently experiencing high demand. Please try again in a few moments.' });
    }
    res.status(500).json({ message: 'Server Error during analysis' });
  }
};

// @desc    Get all reports for logged in user
// @route   GET /api/analyze/history
// @access  Private
const getHistory = async (req, res) => {
    try {
        const reports = await AnalysisReport.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching history' });
    }
}

// @desc    Get a single report by ID
// @route   GET /api/analyze/:id
// @access  Private
const getReportById = async (req, res) => {
    try {
        const report = await AnalysisReport.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Make sure user owns the report
        if (report.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view this report' });
        }

        res.status(200).json(report);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: 'Server Error fetching report' });
    }
};

// @desc    Delete a report by ID
// @route   DELETE /api/analyze/:id
// @access  Private
const deleteReport = async (req, res) => {
    try {
        const report = await AnalysisReport.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        if (report.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this report' });
        }

        await AnalysisReport.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ message: 'Server Error deleting report' });
    }
};

module.exports = {
  analyzeResume,
  getHistory,
  getReportById,
  deleteReport
};

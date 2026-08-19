require('dotenv').config({ path: 'C:/Users/SUBHAM BAIKAR/OneDrive/Desktop/Resume Analyzer/backend/.env' });
const { GoogleGenAI } = require('@google/genai');

async function test() {
    console.log("Starting...");
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const qaPairs = [
          { question: "What is your name?", answer: "Shubham" },
          { question: "What is React?", answer: "A library" }
        ];

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
        "idealAnswer": [string (provide 1 ideal answer for each question, so exactly 2 strings in this array)]
      }
    `;

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        console.log("Response:", response.text);
    } catch (e) {
        console.error("Error:", e);
    }
    console.log("Done.");
}

test();

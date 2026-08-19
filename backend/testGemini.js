require('dotenv').config({ path: 'C:/Users/SUBHAM BAIKAR/OneDrive/Desktop/Resume Analyzer/backend/.env' });
const { GoogleGenAI } = require('@google/genai');

async function test() {
    console.log("Starting...");
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const prompt = "Say hello in JSON array: [\"hello\"]";
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

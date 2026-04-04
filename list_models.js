require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        console.log("Fetching available models...");
        
        // This is a lower-level check to see what the API key can actually do
        const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await result.json();
        
        if (data.models) {
            console.log("--- AVAILABLE MODELS ---");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
            console.log("-------------------------");
        } else {
            console.log("No models found. Error:", data.error?.message || "Unknown error");
        }
    } catch (e) {
        console.error("FAILED TO FETCH MODELS:", e.message);
    }
}

listModels();

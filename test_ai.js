require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("ERROR: GEMINI_API_KEY is missing in .env!");
        process.exit(1);
    }

    try {
        console.log("--- MJOMBA AI DIAGNOSTIC V2 ---");
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Using "gemini-1.5-flash" (the most stable standard name)
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash" 
        });
        
        console.log("Testing model: gemini-1.5-flash...");
        const result = await model.generateContent("Translate 'Steak is ready' to Swahili.");
        const response = await result.response;
        const text = response.text();
        
        console.log("SUCCESS! Response:", text);
    } catch (e) {
        console.error("DIAGNOSTIC FAILED!");
        console.error("Type:", e.constructor.name);
        console.error("Message:", e.message);
        console.log("--------------------------");
    }
}

testGemini();

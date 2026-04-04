const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const https = require('https');

class GeminiService {
    constructor(apiKey, systemInstruction) {
        this.agent = new https.Agent({ keepAlive: true, maxSockets: 50 });
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.systemInstruction = systemInstruction.substring(0, 1000); 
        // [HYPERPOOL] 5 Different models to maximize RPM quota
        this.modelPool = [
            "gemini-2.5-flash", 
            "gemini-2.5-pro", 
            "gemini-3.1-flash-live-preview", 
            "gemini-2.0-flash",
            "gemini-pro-latest"
        ];
        this.currentIdx = 0;
        this.initModel();
    }

    initModel() {
        const modelName = this.modelPool[this.currentIdx];
        console.log(`[AI-HUB] Hyper-Pool Active: ${modelName}`);
        this.modelName = modelName;
        this.model = this.genAI.getGenerativeModel({
            model: modelName,
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ]
        });
    }

    async getResponseFromHistory(prompt, history = [], retryCount = 0) {
        try {
            let context = `Mjomba Assistant. ${this.systemInstruction}\n`;
            history.slice(-2).forEach(h => {
                context += `${h.role === 'model' ? "MJOMBA" : "USER"}: ${h.parts[0].text}\n`;
            });
            context += `USER: ${prompt}\nMJOMBA:`;

            const result = await this.model.generateContent(context);
            if (!result.response) throw new Error("BRAIN_EMPTY");
            return result.response.text();

        } catch (error) {
            const errorMsg = error.message.toLowerCase();
            console.error(`[AI FAIL] ${this.modelName}:`, error.message);

            // [MODEL ROTATION] If Quota (429) happens, jump to the next engine in the Hyper-Pool
            if (errorMsg.includes("429") || errorMsg.includes("limit") || errorMsg.includes("404") || errorMsg.includes("400")) {
                if (this.currentIdx < this.modelPool.length - 1) {
                    this.currentIdx++;
                    this.initModel();
                    // Longer "Cool Down" (3 seconds) to let Google API reset
                    await new Promise(r => setTimeout(r, 3000));
                    return this.getResponseFromHistory(prompt, history, retryCount + 1);
                }
            }

            // [REBORN] If ALL brains are hit, return the most important signature info instantly
            return `Piga 0694 980 000! 🥩🔥 Mjomba busy kidogo na maelfu ya nyama, nitajibu sasa hivi! 👊`;
        }
    }
}

module.exports = GeminiService;

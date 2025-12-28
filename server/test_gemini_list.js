require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        console.log("Fetching available models...");
        // For GoogleGenerativeAI package, looking for a way to list models if available,
        // but the standard way is to just try a known working model.
        // Let's try 'gemini-pro' which is the base model.

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Test");
        const response = await result.response;
        console.log("SUCCESS: 'gemini-pro' works!");
        console.log("Response:", response.text());
    } catch (error) {
        console.error("ERROR listing/testing models:", error.message);
        if (error.response) {
            console.error("Details:", JSON.stringify(error.response, null, 2));
        }
    }
}

listModels();

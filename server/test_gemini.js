require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    console.log("Checking API Key setup...");
    if (!process.env.GEMINI_API_KEY) {
        console.error("ERROR: GEMINI_API_KEY is not set in .env");
        process.exit(1);
    }
    console.log("API Key found (length: " + process.env.GEMINI_API_KEY.length + ")");

    try {
        console.log("Initializing Gemini...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("Accessing model...");
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        const text = response.text();

        console.log("SUCCESS! Gemini Response:", text);
    } catch (error) {
        console.error("Gemini Test FAILED:");
        console.error(error);
    }
}

testGemini();

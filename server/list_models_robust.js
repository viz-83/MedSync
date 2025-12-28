require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function main() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("Using API Key:", process.env.GEMINI_API_KEY ? "Present" : "Missing");

    try {
        // There isn't a direct listModels method on the client instance in some versions,
        // but let's try to infer availability by trying the most basic model: 'gemini-pro'
        // If that failed, let's try 'gemini-1.5-flash-latest'

        // Actually, one trick is to use the API purely via fetch to get the list if the SDK hides it.
        console.log("Fetching models via raw HTTP...");
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", JSON.stringify(data.error, null, 2));
        } else {
            console.log("Available Models:");
            if (data.models) {
                data.models.forEach(m => console.log(`- ${m.name}`));
            } else {
                console.log("No models returned (empty list).");
            }
        }

    } catch (error) {
        console.error("Network Error:", error);
    }
}

main();

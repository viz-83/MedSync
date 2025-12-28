const { GoogleGenerativeAI } = require('@google/generative-ai');
const SYSTEM_PROMPT = require('../config/symptomCheckerPrompt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Priority list of models to try
const MODEL_PRIORITY = [
    "gemini-2.5-flash-lite", // Lowest cost/quota usage first
    "gemini-2.5-flash",      // Fallback 1
    "gemini-1.5-flash-8b",   // Fallback 2 (Super fast/cheap)
    "gemini-1.5-flash"       // Standard Fallback
];

exports.analyzeSymptoms = catchAsync(async (req, res, next) => {
    const { symptoms, history = [] } = req.body;

    if (!symptoms) {
        return next(new AppError('Please provide symptoms description', 400));
    }

    let lastError = null;

    // Try each model in sequence
    for (const modelName of MODEL_PRIORITY) {
        try {
            console.log(`AI Strategy: Attempting with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: SYSTEM_PROMPT }],
                    },
                    {
                        role: "model",
                        parts: [{ text: "Understood. I am ready to act as the AI Health Information Assistant following all safety protocols and outputting strict JSON." }],
                    },
                    ...history.map(msg => ({
                        role: msg.role === 'user' ? 'user' : 'model',
                        parts: [{ text: msg.content }]
                    }))
                ],
                generationConfig: {
                    maxOutputTokens: 1000,
                    temperature: 0.4,
                    responseMimeType: "application/json",
                },
            });

            const result = await chat.sendMessage(symptoms);
            const response = await result.response;
            const text = response.text();

            // Clean up markdown code blocks if present
            const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();

            let analysisResult;
            try {
                analysisResult = JSON.parse(jsonStr);

                // If SUCCESS, send response and BREAK the loop
                return res.status(200).json({
                    status: 'success',
                    data: analysisResult,
                    meta: { used_model: modelName } // Helpful for debugging
                });

            } catch (e) {
                console.error(`JSON Parse Error (${modelName}):`, e);
                // If JSON is bad, we might want to try another model or just fail.
                // Let's treat it as a failure to try the next model which might be smarter.
                throw new Error("Invalid JSON response");
            }

        } catch (error) {
            console.error(`Model ${modelName} Failed: ${error.message}`);
            lastError = error;
            // Configurable: Only continue if the error is "Quota" (429) or "Not Found" (404) or "Overloaded" (503)
            // But for simplicity/robustness, we try the next one for ANY error except client-side bad requests.
            continue;
        }
    }

    // If loop finishes without success
    console.error("All AI models failed.");
    console.error("Final Error Details:", JSON.stringify(lastError, null, 2));

    return next(new AppError(`AI Service Unavailable: All models failed. Last error: ${lastError?.message || 'Unknown'}`, 503));
});

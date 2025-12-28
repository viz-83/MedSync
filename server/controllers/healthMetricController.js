const HealthMetric = require('../models/healthMetricModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const healthTrackerSystemPrompt = require('../ai/systemPrompts/healthTrackerPrompt');

// Initialize Gemini
const getGeminiClient = () => {
    if (!process.env.GEMINI_API_KEY) return null;
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const getGeminiModel = (genAI) => {
    return genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: healthTrackerSystemPrompt,
        generationConfig: { responseMimeType: "application/json" }
    });
};

// Threshold helpers
const checkAbnormal = (type, value) => {
    switch (type) {
        case 'GLUCOSE':
            // < 70 (Hypoglycemia) or > 180 (Hyperglycemia)
            return value < 70 || value > 180;
        case 'BLOOD_PRESSURE':
            // Systolic > 140 or Diastolic > 90
            return value.systolic > 140 || value.diastolic > 90;
        case 'HEART_RATE':
            // < 50 or > 110 (Resting rate generic bounds)
            return value < 50 || value > 110;
        // CALORIES, PROTEIN, HEIGHT, WEIGHT: Context dependent
        case 'CALORIES':
        case 'PROTEIN':
        case 'HEIGHT':
        case 'WEIGHT':
        default:
            return false;
    }
};

const { encrypt, decrypt } = require('../utils/encryption');

// Helper to safely parse if needed or return value
const parseDecrypted = (val) => {
    try {
        return JSON.parse(val);
    } catch (e) {
        return val;
    }
}

exports.logHealthMetric = catchAsync(async (req, res, next) => {
    const { metricType, value, note } = req.body;

    if (!metricType || !value) {
        return next(new AppError('Please provide metric type and value', 400));
    }

    // Basic structure validation for BP
    if (metricType === 'BLOOD_PRESSURE') {
        if (!value.systolic || !value.diastolic) {
            return next(new AppError('Blood pressure requires systolic and diastolic values', 400));
        }
    }

    // Encrypt sensitive data
    const encryptedValue = encrypt(JSON.stringify(value));
    const encryptedNote = note ? encrypt(note) : undefined;

    const metric = await HealthMetric.create({
        patient: req.user._id,
        metricType,
        value: encryptedValue,
        note: encryptedNote
    });

    const isAbnormal = checkAbnormal(metricType, value); // Use original raw value for check

    res.status(201).json({
        status: 'success',
        data: {
            metric: {
                ...metric.toObject(),
                value: value, // Return raw input to user
                note: note,   // Return raw input
                isAbnormal
            }
        }
    });
});

exports.getMyHealthMetrics = catchAsync(async (req, res, next) => {
    // Optional filters
    const { metricType, fromDate, toDate } = req.query;

    let filter = { patient: req.user._id };

    if (metricType) {
        filter.metricType = metricType.toUpperCase();
    }

    if (fromDate || toDate) {
        filter.recordedAt = {};
        if (fromDate) filter.recordedAt.$gte = new Date(fromDate);
        if (toDate) filter.recordedAt.$lte = new Date(toDate);
    }

    const metrics = await HealthMetric.find(filter).sort('recordedAt'); // Sort ASC for charts

    // Decrypt and Add isAbnormal flag
    const metricsWithFlags = metrics.map(m => {
        const decryptedVal = parseDecrypted(decrypt(m.value));
        const decryptedNote = m.note ? decrypt(m.note) : undefined;
        return {
            ...m.toObject(),
            value: decryptedVal,
            note: decryptedNote,
            isAbnormal: checkAbnormal(m.metricType, decryptedVal)
        };
    });

    // Group by type if no specific type requested
    let responseData = metricsWithFlags;
    if (!metricType) {
        responseData = metricsWithFlags.reduce((acc, curr) => {
            if (!acc[curr.metricType]) acc[curr.metricType] = [];
            acc[curr.metricType].push(curr);
            return acc;
        }, {});
    }

    res.status(200).json({
        status: 'success',
        results: metrics.length,
        data: {
            metrics: responseData
        }
    });
});

exports.getPatientHealthMetrics = catchAsync(async (req, res, next) => {
    const { patientId } = req.params;

    const metrics = await HealthMetric.find({ patient: patientId }).sort('recordedAt');

    const metricsWithFlags = metrics.map(m => {
        const decryptedVal = parseDecrypted(decrypt(m.value));
        const decryptedNote = m.note ? decrypt(m.note) : undefined;
        return {
            ...m.toObject(),
            value: decryptedVal,
            note: decryptedNote,
            isAbnormal: checkAbnormal(m.metricType, decryptedVal)
        };
    });

    const grouped = metricsWithFlags.reduce((acc, curr) => {
        if (!acc[curr.metricType]) acc[curr.metricType] = [];
        acc[curr.metricType].push(curr);
        return acc;
    });
});

exports.getAIHealthInsights = catchAsync(async (req, res, next) => {
    // We ignore req.body largely, and fetch authoritative data from DB
    const userId = req.user._id;

    try {
        // 1. Fetch all recent metrics for this user
        const allMetrics = await HealthMetric.find({ patient: userId }).sort({ recordedAt: -1 }).limit(50);

        // 2. Organize by type
        const organized = {
            HEIGHT: null,
            WEIGHT: null,
            CALORIES: [], // Recent history
            PROTEIN: [],  // Recent history
            GLUCOSE: [],
            BLOOD_PRESSURE: [],
            HEART_RATE: []
        };

        // Populate organized data
        // We iterate backwards (newest first)
        for (const m of allMetrics) {
            // Decrypt value
            let val = parseDecrypted(decrypt(m.value));

            // Set latest single values if not set
            if (m.metricType === 'HEIGHT' && !organized.HEIGHT) organized.HEIGHT = val;
            if (m.metricType === 'WEIGHT' && !organized.WEIGHT) organized.WEIGHT = val;

            // Add to arrays (limit to 5 recent)
            if (organized[m.metricType] && organized[m.metricType].length < 5) {
                organized[m.metricType].push({
                    value: val,
                    date: m.recordedAt.toISOString().split('T')[0],
                    note: m.note ? decrypt(m.note) : undefined
                });
            }
        }

        // 3. Calculate Derived Metrics (BMI)
        let derived = {};
        if (organized.HEIGHT && organized.WEIGHT) {
            const heightM = organized.HEIGHT / 100;
            const weightKg = organized.WEIGHT;
            const bmi = (weightKg / (heightM * heightM)).toFixed(1);
            derived.bmi = bmi;

            // BMI Category
            if (bmi < 18.5) derived.bmi_category = "Underweight";
            else if (bmi < 24.9) derived.bmi_category = "Normal weight";
            else if (bmi < 29.9) derived.bmi_category = "Overweight";
            else derived.bmi_category = "Obese";
        }

        // 4. Construct AI Context
        const aiContext = {
            user_profile: {
                latest_weight_kg: organized.WEIGHT,
                latest_height_cm: organized.HEIGHT,
                ...derived
            },
            recent_activity: {
                calories_log: organized.CALORIES, // AI can see trends
                protein_log: organized.PROTEIN,
                glucose_log: organized.GLUCOSE,
                bp_log: organized.BLOOD_PRESSURE
            },
            // Metadata
            request_note: "Please analyze the calorie and protein trends if available, and explain the BMI context."
        };

        const genAI = getGeminiClient();
        if (!genAI) throw new Error("API Key missing");

        const model = getGeminiModel(genAI);

        // Construct the input prompt
        const inputPrompt = JSON.stringify(aiContext, null, 2);

        const result = await model.generateContent(inputPrompt);
        const responseText = result.response.text();
        const jsonResponse = JSON.parse(responseText);

        res.status(200).json({
            status: 'success',
            data: jsonResponse
        });

    } catch (error) {
        console.error("Health Tracker AI Error:", error);

        // Graceful degradation
        res.status(200).json({
            status: 'success',
            data: {
                summary: "We couldn't fully analyze your trends right now.",
                bmi_insight: "Ensure you have logged both height and weight for BMI analysis.",
                calorie_insight: "Try to log your meals consistently to see calorie trends.",
                protein_insight: "Protein is key for recovery. Log your intake!",
                diet_suggestions: ["Stay hydrated", "Eat whole foods", "Monitor portions"],
                habit_insights: [],
                motivational_message: "Every data point helps you understand your health better.",
                safety_note: "Consult a doctor for medical advice.",
                disclaimer: "This information is for educational purposes only and is not medical or nutritional advice. Please consult a qualified healthcare professional for personalized guidance.",
                error: error.message
            }
        });
    }
});

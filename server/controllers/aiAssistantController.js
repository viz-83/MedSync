const symptomRules = require('../config/symptomRules');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// -- Mock Intent Detection --
const detectIntent = (message) => {
    const lower = message.toLowerCase();
    if (lower.match(/(hi|hello|hey|start|greetings)/)) return 'GREETING';
    if (lower.match(/(symptom|pain|hurt|ache|feel|fever|cough)/)) return 'SYMPTOM';
    if (lower.match(/(test|lab|blood|checkup|diagnos)/)) return 'TEST';
    if (lower.match(/(medicine|pill|drug|pharmacy|prescription)/)) return 'MEDICINE';
    if (lower.match(/(doctor|appoint|consult|specialist)/)) return 'DOCTOR';
    return 'GENERAL';
};

// -- Response Generators --

const handleGreeting = () => {
    return {
        message: "Hi there! 👋 I'm your Care Assistant. I can help you understand symptoms, find the right doctor, or book tests. How can I help you today?",
        suggestedActions: [
            { label: "Check Symptoms", action: "SYMPTOM_START" }, // Frontend triggers intent
            { label: "Find a Doctor", action: "NAVIGATE", payload: "/find-doctors" },
            { label: "Book Lab Tests", action: "NAVIGATE", payload: "/tests" },
            { label: "Order Medicines", action: "NAVIGATE", payload: "/medicines" }
        ]
    };
};

const handleSymptoms = (message) => {
    // 1. Basic Emergency Check (Regex based on common emergency terms)
    const emergencyKeywords = ['chest pain', 'breath', 'unconscious', 'stroke', 'bleeding', 'heart attack'];
    if (emergencyKeywords.some(k => message.toLowerCase().includes(k))) {
        return {
            message: "⚠️ **This sounds like a medical emergency.** Please stop using this app and call emergency services immediately.\n\nWe cannot provide medical advice for critical situations.",
            suggestedActions: []
        };
    }

    // 2. Logic from SymptomController (simplified)
    const symptomsLower = message.toLowerCase();
    let highestSeverity = 'LOW';
    let matchedSpecializations = new Set();

    for (const rule of symptomRules) {
        if (rule.keywords.some(k => symptomsLower.includes(k.toLowerCase()))) {
            matchedSpecializations.add(rule.specialization);
            if (rule.severity === 'EMERGENCY') highestSeverity = 'EMERGENCY'; // Double check
            else if (rule.severity === 'HIGH' && highestSeverity !== 'EMERGENCY') highestSeverity = 'HIGH';
        }
    }

    if (highestSeverity === 'EMERGENCY') {
        return {
            message: "⚠️ **This sounds serious.** Based on your description, you should seek immediate medical attention.",
            suggestedActions: []
        };
    }

    if (matchedSpecializations.size > 0) {
        const specs = Array.from(matchedSpecializations).join(', ');
        return {
            message: `I understand. Based on "${message}", it might be helpful to consult a **${specs}**.\n\nWould you like to find a doctor or check available tests?`,
            suggestedActions: [
                { label: `Find ${Array.from(matchedSpecializations)[0]}s`, action: "NAVIGATE", payload: `/find-doctors?search=${Array.from(matchedSpecializations)[0]}` },
                { label: "See All Doctors", action: "NAVIGATE", payload: "/find-doctors" },
                { label: "Check Symptoms Again", action: "NAVIGATE", payload: "/symptom-checker" }
            ]
        };
    }

    return {
        message: "I can't be sure just from that description. Could you tell me more about your symptoms? Or you can use our advanced Symptom Checker tool.",
        suggestedActions: [
            { label: "Open Symptom Checker", action: "NAVIGATE", payload: "/symptom-checker" },
            { label: "Talk to a General Physician", action: "NAVIGATE", payload: "/find-doctors?search=General Physician" }
        ]
    };
};

const handleTests = () => {
    return {
        message: "We offer a wide range of diagnostic tests with home sample collection. You can browse by category or search for specific tests.",
        suggestedActions: [
            { label: "Browse All Tests", action: "NAVIGATE", payload: "/tests" },
            { label: "Popular Packages", action: "NAVIGATE", payload: "/tests?category=package" }
        ]
    };
};

const handleMedicine = () => {
    return {
        message: "You can order medicines directly from our online pharmacy. If you have a prescription, you can upload it for quick ordering.",
        suggestedActions: [
            { label: "Go to Pharmacy", action: "NAVIGATE", payload: "/medicines" },
            { label: "Upload Prescription", action: "NAVIGATE", payload: "/my-prescriptions" }
        ]
    };
};

const handleDoctor = () => {
    return {
        message: "Our verified specialists are available for video consultations. You can filter by specialization, language, and availability.",
        suggestedActions: [
            { label: "Find a Doctor", action: "NAVIGATE", payload: "/find-doctors" },
            { label: "My Appointments", action: "NAVIGATE", payload: "/my-appointments" }
        ]
    };
};

const handleGeneral = () => {
    return {
        message: "I'm here to help you navigate MedSync. You can ask me about symptoms, booking doctors, or ordering tests.",
        suggestedActions: [
            { label: "Check Symptoms", action: "SYMPTOM_START" },
            { label: "Find a Doctor", action: "NAVIGATE", payload: "/find-doctors" }
        ]
    };
};

exports.handleMessage = catchAsync(async (req, res, next) => {
    const { message, context } = req.body; // context can store user role, etc.

    const intent = detectIntent(message || '');
    let response;

    switch (intent) {
        case 'GREETING': response = handleGreeting(); break;
        case 'SYMPTOM': response = handleSymptoms(message); break;
        case 'TEST': response = handleTests(); break;
        case 'MEDICINE': response = handleMedicine(); break;
        case 'DOCTOR': response = handleDoctor(); break;
        default: response = handleGeneral();
    }

    // Add a slight delay to simulate "thinking" if needed, but for now instant.
    res.status(200).json({
        status: 'success',
        data: response
    });
});

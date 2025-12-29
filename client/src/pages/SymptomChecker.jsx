import React, { useState, useRef, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Stethoscope, Send, User, Bot, AlertTriangle, ShieldAlert, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SymptomChecker = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            role: 'model',
            content: "Hello! I am your AI Health Assistant. I'm here to help you understand your symptoms and guide you to appropriate care. How are you feeling today?",
            type: 'intro'
        }
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // Prepare history for API (excluding the very first intro message if needed, or keeping it)
            // The backend expects "history" array of {role, content}
            // We should filter out non-text messages if any complex types exist
            const history = messages
                .filter(m => m.role !== 'system') // Filter out invalid roles if any
                .map(m => ({
                    role: m.role,
                    content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content)
                }));

            const { data } = await axios.post('/v1/symptoms/analyze', {
                symptoms: input,
                history
            });

            if (data.status === 'success') {
                const aiResponse = data.data;
                setMessages(prev => [...prev, {
                    role: 'model',
                    content: aiResponse, // Store the full JSON object
                    type: 'analysis'
                }]);
            }
        } catch (error) {
            console.error('Error analyzing symptoms:', error);
            setMessages(prev => [...prev, {
                role: 'model',
                content: "I apologize, but I'm having trouble connecting to the server right now. Please try again later.",
                type: 'error'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const getSeverityColor = (level) => {
        switch (level?.toUpperCase()) {
            case 'HIGH': return 'danger';
            case 'MEDIUM': return 'warning';
            case 'LOW': return 'success';
            default: return 'default';
        }
    };

    const MessageBubble = ({ message }) => {
        const isUser = message.role === 'user';
        const isError = message.type === 'error';
        const data = message.content; // Can be string or object

        if (isUser) {
            return (
                <div className="flex justify-end mb-6 animate-slideUp">
                    <div className={`rounded-2xl rounded-br-none px-5 py-3.5 max-w-[85%] sm:max-w-[75%] shadow-md text-sm sm:text-base leading-relaxed border ${theme === 'dark'
                        ? 'bg-teal-900/50 text-teal-100 border-teal-800'
                        : 'bg-white text-teal-900 border-teal-100'
                        }`}>
                        {data}
                    </div>
                </div>
            );
        }

        // AI Response Handling
        if (isError || typeof data === 'string') {
            return (
                <div className="flex justify-start mb-6 animate-slideUp">
                    <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center mr-3 shadow-sm flex-shrink-0 mt-1">
                        <Bot size={18} className="text-teal-700" />
                    </div>
                    <div className={`rounded-2xl rounded-bl-none px-5 py-4 max-w-[90%] sm:max-w-[80%] shadow-sm border text-sm sm:text-base leading-relaxed ${theme === 'dark'
                        ? 'bg-gray-800 border-white/5 text-text-primary'
                        : 'bg-teal-50 border-teal-100 text-text-primary'
                        } ${isError ? 'text-red-500' : ''}`}>
                        {data}
                    </div>
                </div>
            );
        }

        // Complex JSON Response
        const { needs_clarification, clarifying_questions, symptom_summary, severity, education, wellness_tips, doctor_specialization, escalation_message, disclaimer } = data;

        let severityLevel = 'UNKNOWN';
        let severityReason = '';

        if (severity) {
            if (typeof severity === 'string') {
                severityLevel = severity;
            } else if (severity.level) {
                severityLevel = severity.level;
                severityReason = severity.reason;
            }
        }

        const isHighSeverity = severityLevel === 'HIGH';

        return (
            <div className="flex justify-start mb-8 animate-slideUp group">
                <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center mr-3 shadow-sm flex-shrink-0 mt-1">
                    <Bot size={18} className="text-teal-700" />
                </div>

                <div className="flex-1 max-w-[90%] sm:max-w-[85%] space-y-3">
                    {/* Main Bubble */}
                    <div className={`rounded-2xl rounded-bl-none p-5 shadow-sm border space-y-4 ${theme === 'dark'
                        ? 'bg-gray-800 border-white/5'
                        : 'bg-teal-50 border-teal-100'
                        }`}>

                        {/* 1. Summary & Education */}
                        <div className="space-y-2">
                            {symptom_summary && <p className="font-medium text-text-primary mb-2 text-sm sm:text-base">{symptom_summary}</p>}
                            {education && <p className="text-text-secondary leading-relaxed text-sm sm:text-base">{education}</p>}
                        </div>

                        {/* 2. Clarifying Questions (if any) */}
                        {needs_clarification && clarifying_questions?.length > 0 && (
                            <div className={`rounded-xl p-4 border ${theme === 'dark'
                                ? 'bg-blue-900/20 border-blue-800/30'
                                : 'bg-blue-100 border-blue-200'
                                }`}>
                                <p className="text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                    <Activity size={16} /> Please help me understand better:
                                </p>
                                <ul className="list-disc list-inside space-y-1">
                                    {clarifying_questions.map((q, idx) => (
                                        <li key={idx} className="text-sm font-medium text-text-primary">{q}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 3. Severity Badge & Warning (If detected) */}
                        {severity && severityLevel !== 'UNKNOWN' && (
                            (() => {
                                const getSeverityStyles = (level) => {
                                    switch (level?.toUpperCase()) {
                                        case 'HIGH':
                                        case 'SERIOUS':
                                            return {
                                                container: theme === 'dark'
                                                    ? 'bg-red-900/20 border-red-800/30'
                                                    : 'bg-red-50 border-red-100',
                                                icon: theme === 'dark' ? 'text-red-400' : 'text-red-700'
                                            };
                                        case 'MEDIUM':
                                            return {
                                                container: theme === 'dark'
                                                    ? 'bg-orange-900/20 border-orange-800/30'
                                                    : 'bg-orange-100 border-orange-200',
                                                icon: theme === 'dark' ? 'text-orange-400' : 'text-orange-700'
                                            };
                                        case 'LOW':
                                        default:
                                            return {
                                                container: theme === 'dark'
                                                    ? 'bg-yellow-900/20 border-yellow-800/30'
                                                    : 'bg-yellow-50/50 border-yellow-100',
                                                icon: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'
                                            };
                                    }
                                };
                                const styles = getSeverityStyles(severityLevel);
                                const textColor = theme === 'dark' ? '#ffffff' : '#000000';

                                return (
                                    <div className={`flex items-start gap-3 p-4 rounded-xl border ${styles.container}`}>
                                        <AlertTriangle size={20} className={`flex-shrink-0 mt-0.5 ${styles.icon}`} />
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-bold uppercase tracking-wider" style={{ color: textColor }}>
                                                    {severityLevel} Severity Indications
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium" style={{ color: textColor }}>{severityReason}</p>
                                        </div>
                                    </div>
                                );
                            })()
                        )}

                        {/* 4. Escalation Message (HIGH ONLY) */}
                        {isHighSeverity && escalation_message && (
                            <div className={`border-l-4 p-4 rounded-r-xl ${theme === 'dark'
                                ? 'bg-red-900/30 border-red-500'
                                : 'bg-red-100 border-red-500'
                                }`}>
                                <p className="font-bold flex items-center gap-2 text-sm sm:text-base" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                                    <ShieldAlert size={20} /> Urgent Attention Recommended
                                </p>
                                <p className="text-text-primary mt-1 text-sm leading-relaxed font-medium">
                                    {escalation_message}
                                </p>
                            </div>
                        )}


                        {/* 5. Wellness Tips (LOW/MEDIUM ONLY) */}
                        {!isHighSeverity && wellness_tips?.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                                    <Activity size={16} className="text-cta" /> Wellness Suggestions
                                </h4>
                                <ul className="grid gap-2">
                                    {wellness_tips.map((tip, idx) => (
                                        <li key={idx} className={`text-sm text-text-primary flex items-start gap-2 p-2 rounded-lg border font-medium ${theme === 'dark'
                                            ? 'bg-white/5 border-transparent'
                                            : 'bg-gray-50 border-gray-100'
                                            }`}>
                                            <span className="text-cta mt-0.5">•</span> {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 6. Doctor Recommendation */}
                        {doctor_specialization && (
                            <div className="pt-2">
                                <Button
                                    size="sm"
                                    className="w-full sm:w-auto"
                                    onClick={() => navigate(`/find-doctors?specialization=${doctor_specialization}`)}
                                >
                                    Find {doctor_specialization}s
                                </Button>
                            </div>
                        )}

                        {/* 7. Disclaimer */}
                        {disclaimer && (
                            <p className={`text-[11px] pt-3 mt-2 italic ${theme === 'dark'
                                ? 'text-gray-400 border-white/10 border-t'
                                : 'text-gray-600 border-gray-200 border-t'
                                }`}>
                                {disclaimer}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`h-screen flex flex-col font-body transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#f0fdfa]'
            }`}>
            <Navbar />

            {/* Main Content Container with rounded styling like Wellbeing Support */}
            <div className="flex-1 max-w-4xl mx-auto w-full p-4 flex flex-col overflow-hidden h-[calc(100vh-80px)]">

                {/* Header matching Wellbeing Support */}
                <div className={`backdrop-blur-md p-4 rounded-t-3xl shadow-sm border-b flex justify-between items-center z-10 ${theme === 'dark'
                    ? 'bg-gray-800/80 border-white/5'
                    : 'bg-cta border-teal-700'
                    }`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                            <Stethoscope size={20} />
                        </div>
                        <div>
                            <h1 className={`text-xl font-heading font-bold ${theme === 'dark' ? 'text-teal-400' : 'text-white'
                                }`}>AI Symptom Checker</h1>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-teal-50'
                                }`}>Educational guidance & specialist recommendations</p>
                        </div>
                    </div>
                </div>

                {/* Chat Area matching Wellbeing Support */}
                <div className={`flex-1 overflow-y-auto p-4 space-y-6 rounded-b-3xl ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/50'
                    }`}>
                    {messages.map((msg, index) => (
                        <MessageBubble key={index} message={msg} />
                    ))}
                    {loading && (
                        <div className="flex justify-start mb-6">
                            <div className={`p-4 rounded-2xl rounded-bl-none border shadow-sm flex gap-1 ${theme === 'dark'
                                ? 'bg-gray-800 border-gray-700'
                                : 'bg-teal-50 border-teal-100'
                                }`}>
                                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className={`mt-4 flex-shrink-0 rounded-2xl shadow-lg border p-2 flex items-end gap-2 ${theme === 'dark'
                    ? 'bg-surface border-white/5'
                    : 'bg-white border-gray-100'
                    }`}>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe your symptoms..."
                        className="flex-1 max-h-32 min-h-[50px] bg-transparent border-0 focus:ring-0 p-3 text-sm sm:text-base text-text-primary placeholder:text-gray-400 resize-none"
                        rows={1}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="rounded-xl w-12 h-12 flex items-center justify-center p-0 flex-shrink-0 mb- \t"
                    >
                        <Send size={20} className={loading ? 'opacity-50' : ''} />
                    </Button>
                </div>

                <p className="text-[10px] text-center text-text-muted mt-2">
                    Start a new conversation for different health concerns. In emergencies, call 112 immediately.
                </p>
            </div>
        </div>
    );
};

export default SymptomChecker;

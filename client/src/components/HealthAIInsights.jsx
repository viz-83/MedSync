import React from 'react';
import { Sparkles, Activity, Utensils, TrendingUp, AlertTriangle, Info, Heart, ArrowRight } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';

const InsightCard = ({ title, icon, children, className = "" }) => (
    <div className={`p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-background-subtle ${className}`}>
        <div className="flex items-center gap-2 mb-3">
            {icon}
            <h4 className="font-bold text-text-primary">{title}</h4>
        </div>
        <div className="text-sm text-text-secondary leading-relaxed space-y-2">
            {children}
        </div>
    </div>
);

const HealthAIInsights = ({ data, loading }) => {
    if (loading) {
        return (
            <Card className="border border-teal-100 dark:border-teal-900/30 bg-teal-50/50 dark:bg-teal-900/10 p-6 md:p-8 animate-pulse">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-teal-200 dark:bg-teal-800"></div>
                    <div className="h-6 w-48 bg-teal-200 dark:bg-teal-800 rounded"></div>
                </div>
                <div className="space-y-4">
                    <div className="h-20 bg-teal-100 dark:bg-teal-800/50 rounded-xl"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-32 bg-teal-100 dark:bg-teal-800/50 rounded-xl"></div>
                        <div className="h-32 bg-teal-100 dark:bg-teal-800/50 rounded-xl"></div>
                    </div>
                </div>
            </Card>
        );
    }

    if (!data) return null;

    return (
        <Card className="border border-teal-100 dark:border-teal-900/30 bg-teal-50/30 dark:bg-teal-900/10 p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h3 className="text-xl font-heading font-bold text-text-primary">Health Insights</h3>
                    <p className="text-sm text-text-secondary">AI-powered analysis of your recent metrics</p>
                </div>
            </div>

            {/* Summary */}
            <div className="mb-8 bg-white dark:bg-background-subtle p-5 rounded-xl border border-teal-100 dark:border-teal-900/30 shadow-sm">
                <p className="text-lg text-text-primary font-medium leading-relaxed">
                    {data.summary}
                </p>
            </div>

            {/* Core Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {data.bmi_insight && (
                    <InsightCard title="BMI Analysis" icon={<Activity size={18} className="text-blue-500" />}>
                        {data.bmi_insight}
                    </InsightCard>
                )}

                {data.calorie_insight && (
                    <InsightCard title="Calorie Balance" icon={<Utensils size={18} className="text-orange-500" />}>
                        {data.calorie_insight}
                    </InsightCard>
                )}

                {data.protein_insight && (
                    <InsightCard title="Protein Intake" icon={<TrendingUp size={18} className="text-purple-500" />}>
                        {data.protein_insight}
                    </InsightCard>
                )}

                {data.habit_insights?.length > 0 && (
                    <InsightCard title="Habit & Trends" icon={<TrendingUp size={18} className="text-green-500" />}>
                        <ul className="list-disc list-inside space-y-1">
                            {data.habit_insights.map((habit, idx) => (
                                <li key={idx}>{habit}</li>
                            ))}
                        </ul>
                    </InsightCard>
                )}
            </div>

            {/* Diet Suggestions */}
            {data.diet_suggestions?.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                        <Heart size={18} className="text-red-500" /> Nutrition Suggestions
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {data.diet_suggestions.map((suggestion, idx) => (
                            <div key={idx} className="bg-white dark:bg-background-subtle px-4 py-3 rounded-lg border border-gray-100 dark:border-gray-700 text-sm font-medium text-text-primary flex items-start gap-2">
                                <ArrowRight size={16} className="text-teal-500 mt-0.5 flex-shrink-0" />
                                {suggestion}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Motivation & Safety */}
            <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-sm italic">
                    <div className="flex-shrink-0 mt-1"><Sparkles size={16} /></div>
                    "{data.motivational_message}"
                </div>

                {/* Disclaimer */}
                <div className="flex gap-3 text-xs text-text-muted border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                    <Info size={14} className="flex-shrink-0 mt-0.5" />
                    <p>{data.disclaimer}</p>
                </div>
            </div>
        </Card>
    );
};

export default HealthAIInsights;

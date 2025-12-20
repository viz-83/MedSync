import React from 'react';
import { FaPlay } from 'react-icons/fa';

const BentoGrid = () => {
    return (
        <section className="py-24 bg-primary text-white"> {/* Helper dark color similar to Hertility but warm */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-heading font-medium tracking-tight mb-4 text-white">
                        We're here to support you
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-auto lg:h-[600px]">
                    {/* Card 1: Clinical Grade Results (Top Left - Wide on mobile, 1x1 on desktop?) 
                        Actually Hertility layout is:
                        [  1  ] [  2  ] [  3  ]
                        [    4 (Wide) ] [  5  ]
                    */}

                    {/* 1. Instant Results (Top Left) */}
                    <div className="bg-white rounded-[2rem] p-8 text-text-primary flex flex-col justify-between group overflow-hidden relative min-h-[300px]">
                        <div className="relative z-10 block">
                            <h3 className="text-2xl font-body font-bold mb-2">Clinical-grade results</h3>
                            <p className="text-text-secondary">Delivered 24/7 to your dashboard.</p>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        {/* Fake "Result" UI */}
                        <div className="mt-8 bg-background-light p-4 rounded-xl shadow-sm border border-gray-100 transform rotate-2 group-hover:rotate-0 transition-transform duration-500">
                            <div className="h-2 w-24 bg-gray-200 rounded mb-3"></div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-2 w-2 bg-cta rounded-full"></div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full w-3/4 bg-cta"></div>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-text-muted">
                                <span>Low</span>
                                <span>Normal</span>
                                <span>High</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Insights (Top Middle) */}
                    <div className="bg-secondary/30 rounded-[2rem] p-8 text-text-primary flex flex-col justify-between group overflow-hidden min-h-[300px]">
                        <div>
                            <h3 className="text-2xl font-body font-bold mb-2">Track Your Vitals</h3>
                            <p className="text-text-secondary">Real-time monitoring of BP & Glucose.</p>
                        </div>
                        {/* Fake "Graph" UI */}
                        <div className="mt-6 relative h-32 flex items-end gap-2 px-2">
                            <div className="w-full bg-white/80 rounded-xl shadow-sm p-3 h-full flex items-end justify-between gap-1">
                                <div className="w-1/6 bg-cta/20 h-1/3 rounded-t-lg group-hover:h-1/2 transition-all duration-500"></div>
                                <div className="w-1/6 bg-cta/30 h-1/2 rounded-t-lg group-hover:h-2/3 transition-all duration-500 delay-75"></div>
                                <div className="w-1/6 bg-cta/40 h-1/4 rounded-t-lg group-hover:h-1/3 transition-all duration-500 delay-100"></div>
                                <div className="w-1/6 bg-cta/60 h-3/4 rounded-t-lg group-hover:h-full transition-all duration-500 delay-150 relative">
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-cta text-white text-[10px] px-1.5 py-0.5 rounded">120</div>
                                </div>
                                <div className="w-1/6 bg-cta/40 h-2/3 rounded-t-lg group-hover:h-1/2 transition-all duration-500 delay-200"></div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Symptoms (Top Right) */}
                    <div className="bg-white rounded-[2rem] p-8 text-text-primary flex flex-col justify-between group overflow-hidden min-h-[300px]">
                        <div className="z-10 relative">
                            <h3 className="text-2xl font-body font-bold mb-2">Symptom Checker</h3>
                            <p className="text-text-secondary">AI-powered health assessment.</p>
                        </div>
                        {/* Fake "Bubbles" UI */}
                        <div className="mt-4 relative h-40">
                            <div className="absolute top-0 right-0 bg-secondary/30 text-cta text-xs font-bold px-3 py-1.5 rounded-full transform translate-x-2 -translate-y-2">Migraine</div>
                            <div className="absolute top-10 left-0 bg-red-50 text-red-500 text-xs font-bold px-3 py-1.5 rounded-full transform -translate-x-2">Fever</div>
                            <div className="absolute bottom-4 right-8 bg-blue-50 text-blue-500 text-xs font-bold px-4 py-2 rounded-full scale-110 shadow-sm">Nausea?</div>
                            <div className="absolute bottom-10 left-4 w-16 h-16 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50 group-hover:scale-110 transition-transform">
                                <div className="w-2 h-2 bg-cta rounded-full animate-ping"></div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Doctor Report (Bottom Left - Wide) */}
                    <div className="lg:col-span-2 bg-background-light rounded-[2rem] p-8 text-text-primary flex flex-col md:flex-row items-center gap-8 group overflow-hidden min-h-[300px]">
                        <div className="md:w-1/2">
                            <h3 className="text-2xl font-body font-bold mb-4">Doctor-written reports & care plans</h3>
                            <p className="text-text-secondary leading-relaxed mb-6">
                                Receive a comprehensive breakdown of your health, reviewed by board-certified specialists, with actionable next steps.
                            </p>
                            <div className="flex gap-2">
                                <span className="bg-white px-3 py-1 rounded-md text-xs font-medium text-cta border border-cta/10">Board Certified</span>
                                <span className="bg-white px-3 py-1 rounded-md text-xs font-medium text-cta border border-cta/10">ISO 27001</span>
                            </div>
                        </div>
                        {/* Fake "Document" UI */}
                        <div className="md:w-1/2 w-full relative">
                            <div className="bg-white p-6 rounded-t-xl shadow-lg border border-gray-100 w-3/4 mx-auto transform translate-y-4 group-hover:translate-y-2 transition-transform duration-500">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                                    <div className="space-y-1">
                                        <div className="h-2 w-20 bg-gray-200 rounded"></div>
                                        <div className="h-1.5 w-12 bg-gray-100 rounded"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-gray-100 rounded"></div>
                                    <div className="h-2 w-full bg-gray-100 rounded"></div>
                                    <div className="h-2 w-2/3 bg-gray-100 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5. Expert Support (Bottom Right) */}
                    <div className="bg-white rounded-[2rem] p-8 text-text-primary flex flex-col justify-between group overflow-hidden min-h-[300px] relative">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-body font-bold mb-2">Expert support included</h3>
                            <p className="text-text-secondary">Free 1:1 call to review your results.</p>
                        </div>
                        {/* Fake "Video Call" UI */}
                        <div className="mt-6 relative rounded-2xl overflow-hidden bg-gray-900 h-48 w-full shadow-lg group-hover:shadow-2xl transition-shadow">
                            <div className="absolute inset-0 flex items-center justify-center">
                                {/* Abstract avatar */}
                                <div className="w-16 h-16 bg-cta/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <div className="w-0 h-0 border-l-[10px] border-l-white border-y-[6px] border-y-transparent ml-1"></div>
                                </div>
                            </div>
                            {/* Small PiP */}
                            <div className="absolute bottom-3 right-3 w-12 h-16 bg-gray-700 rounded-lg border border-white/20"></div>
                            {/* Controls */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]">✕</div>
                                <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <button className="bg-secondary text-cta font-bold py-3 px-8 rounded-full hover:bg-white transition-colors shadow-lg shadow-cta/10">
                        Start your journey
                    </button>
                    {/* The yellow/lime button from example */}
                </div>
            </div>
        </section>
    );
};

export default BentoGrid;

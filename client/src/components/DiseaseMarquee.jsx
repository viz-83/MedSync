import React from 'react';
import handsBackground from '../assets/hands_background.png';

const diseases = [
    "Endometriosis", "PCOS", "Fibroids", "Adenomyosis", "Hyperprolactinaemia", "Premature Ovarian Insufficiency",
    "Hypothyroidism", "Menopause", "Iron Deficiency Anaemia", "Hyperandrogenism", "Pelvic Inflammatory Disease",
    "Diabetes Type 2", "Hypertension", "Fatty Liver Disease", "Vitamin D Deficiency", "Migraine", "Anxiety",
    "Depression", "IBS", "Celiac Disease", "Sleep Apnea", "Eczema", "Psoriasis"
];

const DiseaseMarquee = () => {
    return (
        <section className="relative w-full h-[500px] overflow-hidden flex items-center justify-center">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${handsBackground})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]"></div> {/* Overlay for readability */}
            </div>

            <div className="relative z-10 w-full flex flex-col gap-8">

                <div className="text-center px-4 mb-4">
                    <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 drop-shadow-md">
                        World-class treatment, <span className="italic font-light">without</span> the wait
                    </h2>
                    <p className="text-white/90 text-lg max-w-2xl mx-auto drop-shadow-sm">
                        74% of people with symptoms receive a diagnosis from MedSync.
                    </p>
                </div>

                {/* Marquee Row 1 (Left Direction) */}
                <div className="w-full overflow-hidden whitespace-nowrap mask-gradient relative">
                    <div className="inline-block animate-marquee">
                        {diseases.map((disease, i) => (
                            <span key={i} className="inline-block px-6 py-2 mx-2 border border-white/50 text-white rounded-full backdrop-blur-md bg-white/10 text-sm md:text-base font-medium font-body hover:bg-white/20 transition-colors cursor-default">
                                {disease}
                            </span>
                        ))}
                        {/* Duplicate for seamless loop */}
                        {diseases.map((disease, i) => (
                            <span key={`dup-${i}`} className="inline-block px-6 py-2 mx-2 border border-white/50 text-white rounded-full backdrop-blur-md bg-white/10 text-sm md:text-base font-medium font-body hover:bg-white/20 transition-colors cursor-default">
                                {disease}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Marquee Row 2 (Reverse/Right Direction) - Optional variation */}
                <div className="w-full overflow-hidden whitespace-nowrap mask-gradient relative hidden md:block">
                    <div className="inline-block animate-marquee-reverse">
                        {/* Reversed list for variety */}
                        {[...diseases].reverse().map((disease, i) => (
                            <span key={i} className="inline-block px-6 py-2 mx-2 border border-white/50 text-white rounded-full backdrop-blur-md bg-white/10 text-sm md:text-base font-medium font-body hover:bg-white/20 transition-colors cursor-default">
                                {disease}
                            </span>
                        ))}
                        {[...diseases].reverse().map((disease, i) => (
                            <span key={`dup-rev-${i}`} className="inline-block px-6 py-2 mx-2 border border-white/50 text-white rounded-full backdrop-blur-md bg-white/10 text-sm md:text-base font-medium font-body hover:bg-white/20 transition-colors cursor-default">
                                {disease}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-8">
                    <button className="bg-cta hover:bg-white hover:text-cta text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg border border-cta">
                        Start 5-min assessment
                    </button>
                </div>

            </div>
        </section>
    );
};

export default DiseaseMarquee;

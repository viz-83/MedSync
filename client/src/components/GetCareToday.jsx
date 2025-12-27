import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const diseases = [
    "Diabetes", "Back Pain", "Sinus Infection", "Hypertension", "Migraines",
    "Acid Reflux", "Anxiety", "Arthritis", "Asthma", "Allergies",
    "Bronchitis", "Cold & Flu", "Depression", "Eczema", "Fatigue",
    "Gout", "Hair Loss", "High Cholesterol", "Insomnia", "Joint Pain",
    "Kidney Stones", "Laryngitis", "Menopause", "Nausea", "Obesity",
    "Pink Eye", "Pneumonia", "Psoriasis", "Rashes", "Sciatica",
    "Sore Throat", "Thyroid Issues", "Urinary Tract Infection", "Vertigo", "Weight Loss"
];

const GetCareToday = () => {
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);
    // Phases: 'idle' (center), 'exiting' (going down), 'entering' (coming from top)
    const [animationClass, setAnimationClass] = useState('translate-y-0 opacity-100 duration-500');

    useEffect(() => {
        const interval = setInterval(() => {
            // 1. Exit Down
            setAnimationClass('translate-y-full opacity-0 duration-500');

            setTimeout(() => {
                // 2. Update Text and Jump to Top (Instant)
                setIndex((prevIndex) => (prevIndex + 1) % diseases.length);
                setAnimationClass('-translate-y-full opacity-0 duration-0');

                // 3. Enter from Top (Short delay to allow render at top)
                setTimeout(() => {
                    setAnimationClass('translate-y-0 opacity-100 duration-500');
                }, 50);
            }, 500); // 500ms to exit

        }, 2000); // 2 seconds total cycle

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-24 bg-white dark:bg-surface flex flex-col items-center justify-center text-center px-4 overflow-hidden">
            <h2 className="text-5xl md:text-7xl font-heading font-bold leading-tight mb-4">
                <span className="text-cta block mb-2">Get care today for</span>
                {/* Fixed height container to prevent layout shifts */}
                <div className="h-[1.2em] overflow-hidden relative w-full flex justify-center">
                    <span
                        className={`block text-primary transform transition-all ease-in-out absolute ${animationClass}`}
                    >
                        {diseases[index].toLowerCase()}
                    </span>
                    {/* Placeholder to keep width correct if absolute positioning causes issues, 
                        but 'absolute' + 'w-full' + 'text-center' usually works for centering. 
                        Let's stick to absolute for animation container. 
                    */}
                </div>
            </h2>

            <button
                onClick={() => navigate('/find-doctors')}
                className="mt-8 text-cta font-bold text-lg hover:underline flex items-center gap-1 group"
            >
                See all our services
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </section>
    );
};

export default GetCareToday;

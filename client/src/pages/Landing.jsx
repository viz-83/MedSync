import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import doctorsHero from '../assets/doctors_hero.jpeg';
import Button from '../components/ui/Button';
import ServiceCard from '../components/ui/ServiceCard';
import BentoGrid from '../components/BentoGrid';
import { FaLaptopMedical, FaUserMd, FaNotesMedical, FaHeartbeat } from 'react-icons/fa';
import DiseaseMarquee from '../components/DiseaseMarquee';

const Landing = () => {
    const navigate = useNavigate();

    const services = [
        {
            title: "Symptom Checker",
            description: "Understand your health instantly with our AI-powered assessment tool. Get guided to the right care.",
            icon: FaNotesMedical,
            action: () => navigate('/symptom-checker')
        },
        {
            title: "Video Consultations",
            description: "Connect with top specialists from the comfort of home. Secure, private, and convenient.",
            icon: FaLaptopMedical,
            action: () => navigate('/find-doctors')
        },
        {
            title: "Health Tracking",
            description: "Log your vitals and monitor your wellbeing over time with our comprehensive dashboard.",
            icon: FaHeartbeat,
            action: () => navigate('/patient/health-tracker')
        },
        {
            title: "Find Specialists",
            description: "Browse our network of verified doctors, read reviews, and book appointments that suit you.",
            icon: FaUserMd,
            action: () => navigate('/find-doctors')
        }
    ];

    return (
        <div className="min-h-screen bg-background-light flex flex-col font-body">
            <Navbar />

            {/* 1. HERO SECTION - Editorial Style */}
            <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
                    <span className="inline-block px-4 py-1.5 bg-secondary/30 text-cta font-bold text-xs tracking-wider uppercase rounded-full mb-6">
                        The Future of Care
                    </span>
                    <h1 className="text-5xl lg:text-7xl font-heading font-bold text-text-primary mb-6 leading-tight">
                        Healthcare <br />
                        <span className="text-cta italic">Reimagined.</span>
                    </h1>
                    <p className="text-lg text-text-secondary mb-10 leading-relaxed max-w-lg">
                        MedSync brings the clinic to your home. From instant symptom checks to video consults with specialists, your health journey starts here.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Button
                            size="lg"
                            className="shadow-xl shadow-cta/20 w-full sm:w-auto hover:scale-105 transition-transform"
                            onClick={() => navigate('/find-doctors')}
                        >
                            Get Started
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto hover:bg-white"
                            onClick={() => navigate('/symptom-checker')}
                        >
                            Check Symptoms
                        </Button>
                    </div>
                </div>

                <div className="lg:w-1/2 relative w-full max-w-lg lg:max-w-none">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[3rem] transform rotate-3 scale-105 -z-10 blur-sm"></div>
                    <img
                        src={doctorsHero}
                        alt="MedSync Doctor"
                        className="w-full h-[500px] object-cover rounded-[2.5rem] shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-700 ease-out border-4 border-white"
                    />

                    {/* Floating Badge */}
                    <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow hidden sm:flex">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <FaUserMd size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-text-primary">24/7 Access</p>
                            <p className="text-xs text-text-secondary">Verified Specialists</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. TRUST MARQUEE */}
            <section className="py-10 border-y border-gray-200/60 bg-white/50">
                <div className="max-w-7xl mx-auto px-4 overflow-hidden">
                    <p className="text-center text-sm font-bold text-text-muted mb-6 uppercase tracking-widest">Trusted by healthcare professionals from</p>
                    <div className="flex justify-center flex-wrap gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <span className="text-xl font-heading font-bold">HealthPlus</span>
                        <span className="text-xl font-heading font-bold">MediCare</span>
                        <span className="text-xl font-heading font-bold">GlobalClinic</span>
                        <span className="text-xl font-heading font-bold">DocNet</span>
                        <span className="text-xl font-heading font-bold">CareAlliance</span>
                    </div>
                </div>
            </section>

            {/* 3. THINGS WE OFFER (Services Grid) */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold text-text-primary mb-6">
                            Things we offer
                        </h2>
                        <p className="text-lg text-text-secondary leading-relaxed">
                            We've unified every aspect of your healthcare journey. No more fragmented records or confusing pathways—just clear, connected care.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, index) => (
                            <ServiceCard key={index} {...service} />
                        ))}
                    </div>
                </div>
            </section>



            {/* BENTO GRID */}
            <BentoGrid />

            {/* DISEASE MARQUEE */}
            <DiseaseMarquee />

            {/* 4. MISSION / ABOUT - Split Section */}
            <section className="py-24 bg-background-subtle">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <div className="relative">
                                <div className="absolute -inset-4 border-2 border-cta/20 rounded-3xl transform rotate-6"></div>
                                <div className="bg-cta p-12 rounded-3xl text-white relative overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                    <h3 className="text-3xl font-heading font-bold mb-6">Our Mission</h3>
                                    <p className="text-lg leading-relaxed opacity-90 mb-8">
                                        We believe healthcare should be proactive, not reactive. MedSync was built to bridge the gap between patients and providers, creating a seamless ecosystem where data flows securely and care is delivered instantly.
                                    </p>
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-4xl font-bold mb-1">10k+</p>
                                            <p className="text-sm opacity-75">Consultations</p>
                                        </div>
                                        <div>
                                            <p className="text-4xl font-bold mb-1">500+</p>
                                            <p className="text-sm opacity-75">Specialists</p>
                                        </div>
                                        <div>
                                            <p className="text-4xl font-bold mb-1">98%</p>
                                            <p className="text-sm opacity-75">Satisfaction</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl font-heading font-bold text-text-primary mb-6">
                                Why choose MedSync?
                            </h2>
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-cta shrink-0">
                                        <FaHeartbeat size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-text-primary mb-2">Holistic Health View</h4>
                                        <p className="text-text-secondary">Your vitals, prescriptions, and reports in one place. Doctors see the whole picture, not just a snapshot.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-cta shrink-0">
                                        <FaUserMd size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-text-primary mb-2">Expert Care, Anywhere</h4>
                                        <p className="text-text-secondary">Access board-certified specialists without travel or long waiting rooms.</p>
                                    </div>
                                </div>
                                <Button variant="outline" onClick={() => navigate('/signup')} className="mt-4">
                                    Join MedSync Today
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. FOOTER */}
            <Footer />
        </div>
    );
};

export default Landing;

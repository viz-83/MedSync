import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from './ui/Button';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Helper to check active state
    const isActive = (path) => location.pathname === path;

    const NavItem = ({ to, children }) => (
        <Link
            to={to}
            className={`
                text-sm font-medium transition-colors duration-200
                ${isActive(to)
                    ? 'text-cta font-semibold border-b-2 border-cta pb-0.5'
                    : 'text-text-secondary hover:text-cta'}
            `}
        >
            {children}
        </Link>
    );

    return (
        <>
            <nav className={`
                fixed top-0 w-full z-50 transition-all duration-300
                ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100' : 'bg-transparent'}
            `}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        <div className="flex items-center space-x-8">
                            <Link to="/" className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cta to-primary flex items-center justify-center text-white font-bold font-heading">
                                    M
                                </div>
                                <span className={`text-xl font-heading font-bold ${scrolled ? 'text-primary' : 'text-primary'}`}>
                                    MedSync
                                </span>
                            </Link>

                            <div className="hidden md:flex space-x-8">
                                <NavItem to="/">Home</NavItem>

                                {user.role === 'patient' && (
                                    <>
                                        <NavItem to="/symptom-checker">Symptom Checker</NavItem>
                                        <NavItem to="/find-doctors">Find Doctors</NavItem>
                                        <NavItem to="/my-appointments">Appointments</NavItem>
                                        <NavItem to="/patient/health-tracker">Health Tracker</NavItem>
                                    </>
                                )}

                                {user.role === 'doctor' && (
                                    <>
                                        <NavItem to="/doctor/dashboard">Dashboard</NavItem>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex items-center space-x-2 text-sm text-text-muted">
                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                <span>{user.name}</span>
                                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full uppercase tracking-wider">{user.role}</span>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleLogout}
                                className="!px-4"
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>
            {location.pathname !== '/' && (
                <div className="h-16 sm:h-20" />
            )}
        </>
    );
};

export default Navbar;

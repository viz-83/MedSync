import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Navbar from '../components/Navbar';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp }, { withCredentials: true });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            if (res.data.user.role === 'doctor') {
                if (res.data.isDoctorProfileComplete) {
                    navigate('/doctor/dashboard');
                } else {
                    navigate('/doctor/onboarding');
                }
            } else {
                navigate('/');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen bg-background-light flex flex-col font-body">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <Card className="max-w-md w-full p-8 text-center bg-red-50 border-red-100">
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-red-700 mb-2">Error</h2>
                        <p className="text-red-600 mb-6">No email provided. Please sign up again.</p>
                        <Button onClick={() => navigate('/signup')} className="w-full">
                            Back to Sign Up
                        </Button>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light flex flex-col font-body">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
                    <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-blob"></div>
                    <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-gradient-to-bl from-cta/10 to-primary/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                </div>

                <Card className="w-full max-w-md p-8 md:p-10 shadow-2xl border-t-4 border-cta">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-secondary/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
                            🔐
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-text-primary mb-2">Verify OTP</h2>
                        <p className="text-text-secondary">
                            Enter the code sent to <span className="font-semibold text-text-primary">{email}</span>
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="One-Time Password"
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="text-center tracking-[0.5em] text-lg font-bold"
                            maxLength={6}
                        />

                        <Button
                            type="submit"
                            disabled={loading}
                            size="lg"
                            className="w-full shadow-lg shadow-cta/20"
                        >
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-text-secondary">
                        Didn't receive the code?{' '}
                        <button className="text-cta hover:text-cta-dark font-semibold hover:underline transition-colors">
                            Resend OTP
                        </button>
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default VerifyOTP;

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Lock, LogIn, CheckCircle } from 'lucide-react';

const Login = () => {
    const location = useLocation();
    const registrationData = location.state;

    const [formData, setFormData] = useState({
        referralId: registrationData?.referralCode || '',
        password: registrationData?.password || ''
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.referralId, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background font-poppins">
            {/* Right Panel: Form (Shown first on mobile) */}
            <div className="flex items-center justify-center p-6 sm:p-12 order-2 lg:order-1 relative">
                <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10"></div>
                
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-full max-w-md glass-card p-8 glow-border"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-400">Login to manage your WOMUP account.</p>
                    </div>

                    {registrationData?.registered && (
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-success/10 border border-success/20 text-success p-6 rounded-2xl mb-8 space-y-3"
                        >
                            <div className="flex items-center space-x-2 font-bold">
                                <CheckCircle size={20} />
                                <span>Registration Successful!</span>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl space-y-2 text-sm border border-white/5">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Referral ID:</span>
                                    <span className="text-white font-mono font-bold">{registrationData.referralCode}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Password:</span>
                                    <span className="text-white font-mono font-bold">{registrationData.password}</span>
                                </div>
                            </div>
                            <p className="text-xs opacity-70 italic text-center">Please save these credentials for future login.</p>
                        </motion.div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-center text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Referral ID / Email"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary transition-all outline-none"
                                value={formData.referralId}
                                onChange={(e) => setFormData({...formData, referralId: e.target.value})}
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="password"
                                placeholder="Password"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary transition-all outline-none"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <label className="flex items-center text-gray-400 cursor-pointer">
                                <input type="checkbox" className="mr-2 accent-primary" />
                                Remember me
                            </label>
                            <a href="#" className="text-primary hover:underline">Forgot Password?</a>
                        </div>

                        <button type="submit" className="w-full gradient-btn mt-4">
                            Login
                        </button>
                    </form>

                    <p className="text-center mt-8 text-gray-400">
                        Don't have an account? <Link to="/register" className="text-primary hover:underline">Register now</Link>
                    </p>
                </motion.div>
            </div>

            {/* Left Panel: Branding (Shown second on mobile) */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-primary-gradient p-12 text-white relative overflow-hidden order-1 lg:order-2">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="z-10 text-center"
                >
                    <h1 className="text-6xl font-bold mb-6 font-cormorant">WOMUP</h1>
                    <p className="text-2xl font-light max-w-md">Empowerment • Shopping • Revolutions</p>
                    <div className="mt-12">
                        <LogIn size={120} className="mx-auto opacity-20" />
                    </div>
                </motion.div>
                
                <div className="absolute top-1/2 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default Login;

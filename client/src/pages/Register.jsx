import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, UserPlus, CheckCircle, XCircle } from 'lucide-react';
import { useEffect } from 'react';
import axios from 'axios';

const Register = () => {
    const [searchParams] = useSearchParams();
    const refCode = searchParams.get('ref') || '';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        referralCode: refCode
    });
    const [sponsorName, setSponsorName] = useState('');
    const [verifyingCode, setVerifyingCode] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    // Verify referral code
    useEffect(() => {
        const verifyCode = async () => {
            if (formData.referralCode && formData.referralCode.length >= 3) {
                setVerifyingCode(true);
                try {
                    const { data } = await axios.get(`http://localhost:5001/api/auth/verify-referral/${formData.referralCode}`);
                    if (data.valid) {
                        setSponsorName(data.name);
                    } else {
                        setSponsorName('invalid');
                    }
                } catch (err) {
                    console.error('Error verifying code:', err);
                }
                setVerifyingCode(false);
            } else {
                setSponsorName('');
            }
        };

        const timer = setTimeout(verifyCode, 500);
        return () => clearTimeout(timer);
    }, [formData.referralCode]);

    // Update referralCode if URL changes
    useEffect(() => {
        if (refCode) {
            setFormData(prev => ({ ...prev, referralCode: refCode }));
        }
    }, [refCode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background font-poppins">
            {/* Left Panel: Branding */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-primary-gradient p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="z-10 text-center"
                >
                    <h1 className="text-6xl font-bold mb-6 font-cormorant">WOMUP</h1>
                    <p className="text-2xl font-light max-w-md">Empowerment • Shopping • Revolutions</p>
                    <div className="mt-12 space-y-6">
                        <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
                            <div className="bg-white/20 p-3 rounded-xl"><UserPlus size={24} /></div>
                            <div className="text-left">
                                <p className="font-cormorant">Join the Community</p>
                                <p className="text-sm opacity-80">Be part of the financial revolution.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
                
                {/* Decorative Blobs */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
            </div>

            {/* Right Panel: Form */}
            <div className="flex items-center justify-center p-6 sm:p-12 relative">
                {/* Floating Blobs for background */}
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary-dark/20 rounded-full blur-[100px] -z-10 animate-pulse delay-1000"></div>

                <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-full max-w-3xl glass-card p-8 glow-border"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-white mb-2 font-cormorant">Create Account</h2>
                        <p className="text-gray-400">Join WOMUP and start earning today.</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-center text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Full Name"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary transition-all outline-none"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary transition-all outline-none"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>

                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text"
                                    placeholder="Mobile Number"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary transition-all outline-none"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="password"
                                    placeholder="Confirm Password"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary transition-all outline-none"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="relative">
                                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text"
                                    placeholder="Referral Code (Optional)"
                                    className={`w-full bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white transition-all outline-none ${
                                        sponsorName === 'invalid' ? 'border-red-500/50' : 
                                        sponsorName ? 'border-success/50' : 'border-white/10'
                                    }`}
                                    value={formData.referralCode}
                                    onChange={(e) => setFormData({...formData, referralCode: e.target.value.toUpperCase()})}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    {verifyingCode ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                                    ) : sponsorName === 'invalid' ? (
                                        <XCircle size={18} className="text-red-500" />
                                    ) : sponsorName ? (
                                        <CheckCircle size={18} className="text-success" />
                                    ) : null}
                                </div>
                            </div>
                            {sponsorName && sponsorName !== 'invalid' && (
                                <p className="text-xs text-success px-2 flex items-center">
                                    <CheckCircle size={12} className="mr-1" /> Referred by: <span className="font-bold ml-1">{sponsorName}</span>
                                </p>
                            )}
                            {sponsorName === 'invalid' && (
                                <p className="text-xs text-red-500 px-2 flex items-center">
                                    <XCircle size={12} className="mr-1" /> Invalid referral code
                                </p>
                            )}
                        </div>

                        <button type="submit" className="w-full gradient-btn mt-4">
                            Sign Up
                        </button>
                    </form>

                    <p className="text-center mt-8 text-gray-400">
                        Already have an account? <Link to="/login" className="text-primary hover:underline">Login here</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;

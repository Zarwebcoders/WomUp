import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    User as UserIcon,
    Mail,
    Phone,
    ShieldCheck,
    Wallet,
    Layers,
    HandCoins,
    CircleDollarSign,
    Calendar,
    Check,
    Copy,
    UserCheck,
    Users
} from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user || !user.token) return;
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get(`${API_URL}/api/auth/profile`, config);
                setProfileData(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleCopyCode = () => {
        if (!profileData?.referralCode) return;
        const referralUrl = `${window.location.origin}/register?ref=${profileData.referralCode}`;
        navigator.clipboard.writeText(referralUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const referralCode = profileData?.referralCode || 'N/A';
    const sponsorCode = profileData?.referredBy || 'None (System Root)';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 pb-10"
        >
            {/* Header Profile Summary */}
            <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-center md:justify-between gap-6 relative overflow-hidden bg-gradient-to-br from-card/80 to-primary-dark/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-primary-gradient flex items-center justify-center font-bold text-white text-4xl shadow-lg border border-white/10 shrink-0">
                        {profileData?.name?.charAt(0)}
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <h2 className="text-3xl font-bold font-cormorant text-white">{profileData?.name}</h2>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <span className="bg-primary/20 text-primary-light px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {profileData?.role === 'admin' ? 'Admin' : 'Member'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                profileData?.isActive ? 'bg-success/20 text-success' : 'bg-red-500/20 text-red-500'
                            }`}>
                                {profileData?.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 font-mono tracking-wider uppercase">User ID: {profileData?.userId}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Share Referral Link</p>
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 hover:border-white/20 transition-all max-w-[280px]">
                        <span className="text-white font-bold tracking-widest font-space text-sm truncate mr-4">{referralCode}</span>
                        <button
                            onClick={handleCopyCode}
                            className="text-primary-light hover:text-white transition-colors"
                            title="Copy Link"
                        >
                            {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Account Details & Contact */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Basic Info */}
                    <div className="glass-card p-6 md:p-8 space-y-6">
                        <h3 className="text-xl font-bold border-b border-white/5 pb-3">Contact Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-white/5 rounded-xl text-gray-400">
                                    <Mail size={18} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email Address</p>
                                    <p className="text-white text-sm font-medium truncate">{profileData?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-white/5 rounded-xl text-gray-400">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Mobile Number</p>
                                    <p className="text-white text-sm font-medium">{profileData?.mobile}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-white/5 rounded-xl text-gray-400">
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Registration Date</p>
                                    <p className="text-white text-sm font-medium">
                                        {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Network Info */}
                    <div className="glass-card p-6 md:p-8 space-y-6">
                        <h3 className="text-xl font-bold border-b border-white/5 pb-3">Network Summary</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Users size={16} /></div>
                                    <span className="text-gray-400 text-sm">Total Team Size</span>
                                </div>
                                <span className="text-white font-bold font-space">{profileData?.teamCount || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><UserCheck size={16} /></div>
                                    <span className="text-gray-400 text-sm">Sponsor ID</span>
                                </div>
                                <span className="text-white font-bold font-space text-sm tracking-wide bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                                    {sponsorCode}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Investment Info & Financial Summary */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Financial Summary */}
                    <div className="glass-card p-6 md:p-8 space-y-6">
                        <h3 className="text-xl font-bold border-b border-white/5 pb-3">Financial Overview</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Total Income */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Total Income</p>
                                    <p className="text-2xl font-bold text-success font-space">₹{(profileData?.totalIncome || 0).toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-success/15 rounded-xl text-success"><Wallet size={20} /></div>
                            </div>

                            {/* ROI Income */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">ROI Earnings</p>
                                    <p className="text-2xl font-bold text-cyan-400 font-space">₹{(profileData?.roiIncome || 0).toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-cyan-500/15 rounded-xl text-cyan-400"><CircleDollarSign size={20} /></div>
                            </div>

                            {/* Referral Income */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Referral Earnings</p>
                                    <p className="text-2xl font-bold text-pink-400 font-space">₹{(profileData?.referralIncome || 0).toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-pink-500/15 rounded-xl text-pink-400"><HandCoins size={20} /></div>
                            </div>

                            {/* Level Income */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Level Earnings</p>
                                    <p className="text-2xl font-bold text-orange-400 font-space">₹{Number(profileData?.levelIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</p>
                                </div>
                                <div className="p-3 bg-orange-500/15 rounded-xl text-orange-400"><Layers size={20} /></div>
                            </div>
                        </div>
                    </div>

                    {/* Active Investment Package */}
                    {profileData?.role !== 'distributer' && (
                        <div className="glass-card p-6 md:p-8 space-y-6">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <h3 className="text-xl font-bold">Active Package Details</h3>
                                <ShieldCheck size={24} className="text-primary-light" />
                            </div>
                            {profileData?.packageId ? (
                                <div className="flex flex-col sm:flex-row justify-between gap-6 sm:items-center">
                                    <div className="space-y-1">
                                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Plan Name</span>
                                        <h4 className="text-2xl font-bold text-white font-space">{profileData?.packageId?.packageName}</h4>
                                        <p className="text-sm text-primary-light font-bold">Price: ₹{profileData?.packageId?.price?.toLocaleString() || 0}</p>
                                    </div>
                                    <div className="flex flex-col sm:items-end gap-3 text-sm">
                                        <div className="flex justify-between sm:justify-start gap-4">
                                            <span className="text-gray-400">Activated At:</span>
                                            <span className="text-white font-semibold">
                                                {profileData?.activatedAt ? new Date(profileData.activatedAt).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between sm:justify-start gap-4">
                                            <span className="text-gray-400">Expires At:</span>
                                            <span className="text-white font-semibold">
                                                {profileData?.expiresAt ? new Date(profileData.expiresAt).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-gray-400 text-sm mb-4">You do not have any active packages currently.</p>
                                    <button
                                        onClick={() => window.location.href = '/packages'}
                                        className="px-6 py-2.5 bg-primary hover:bg-primary-dark rounded-xl text-white font-bold transition-all text-xs uppercase tracking-wider"
                                    >
                                        Purchase a Package
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </motion.div>
    );
};

export default Profile;

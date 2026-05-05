import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config/api';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
    User, Mail, Phone, Lock, Calendar, Shield, 
    ArrowLeft, Users, Wallet, TrendingUp, CreditCard,
    Zap, Key, History, UserCheck, UserMinus
} from 'lucide-react';

const AdminUserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: adminUser } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${adminUser.token}` }
                };
                const { data } = await axios.get(`${API_URL}/api/auth/users/${id}`, config);
                setUser(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchUserDetails();
    }, [id, adminUser.token]);

    if (loading) return <div className="p-20 text-center text-white">Loading detailed profile...</div>;
    if (!user) return <div className="p-20 text-center text-red-500">User not found!</div>;

    const stats = [
        { label: 'Total Income', value: `₹${user.totalIncome.toLocaleString()}`, icon: Wallet, color: 'text-success' },
        { label: 'ROI Income', value: `₹${user.roiIncome.toLocaleString()}`, icon: TrendingUp, color: 'text-primary' },
        { label: 'Referral Income', value: `₹${user.referralIncome.toLocaleString()}`, icon: Users, color: 'text-purple-500' },
        { label: 'Level Income', value: `₹${user.levelIncome.toLocaleString()}`, icon: Zap, color: 'text-yellow-500' },
    ];

    return (
        <div className="space-y-8 pb-20">
            <button 
                onClick={() => navigate('/admin/users')}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft size={18} />
                <span>Back to Users</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="glass-card p-8 lg:col-span-1 space-y-6 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center font-bold text-4xl text-primary border-4 border-primary/10">
                        {user.name.charAt(0)}
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                        <p className="text-gray-500 text-sm">Joined on {new Date(user.createdAt).toLocaleDateString()}</p>
                        <div className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                            <Shield size={12} />
                            <span>{user.role}</span>
                        </div>
                    </div>

                    <div className="w-full space-y-4 pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">System ID</span>
                            <span className="text-white font-mono">{user._id}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Email</span>
                            <span className="text-white">{user.email}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Mobile</span>
                            <span className="text-white">{user.mobile}</span>
                        </div>
                    </div>
                </div>

                {/* Main Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((s, i) => (
                            <div key={i} className="glass-card p-4 space-y-2 border-white/5">
                                <div className="p-2 bg-white/5 rounded-lg w-fit">
                                    <s.icon size={16} className={s.color} />
                                </div>
                                <p className="text-gray-500 text-[10px] uppercase font-bold">{s.label}</p>
                                <p className={`text-lg font-bold font-space ${s.color}`}>{s.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Technical & Referral Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass-card p-6 space-y-6">
                            <h3 className="text-lg font-bold flex items-center space-x-2">
                                <Key size={18} className="text-primary" />
                                <span>Security & Credentials</span>
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Plain Password</span>
                                        <span className="text-sm text-yellow-500 font-mono font-bold">{user.plainPassword || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Referral Code</span>
                                        <span className="text-sm text-primary font-mono font-bold uppercase">{user.referralCode}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6 space-y-6">
                            <h3 className="text-lg font-bold flex items-center space-x-2">
                                <History size={18} className="text-primary" />
                                <span>Network & Package</span>
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                    <span className="text-xs text-gray-500">Current Package</span>
                                    <span className="text-sm text-white font-bold">{user.packageId?.packageName || 'No Active Package'}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                    <span className="text-xs text-gray-500">Sponsor</span>
                                    <div className="text-right">
                                        <p className="text-sm text-white font-bold">{user.referredBy?.name || 'Root User'}</p>
                                        <p className="text-[10px] text-gray-500">{user.referredBy?.email || '-'}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                    <span className="text-xs text-gray-500">Team Count</span>
                                    <span className="text-sm text-white font-bold">{user.teamCount} Members</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Advanced System Information - Replacing Raw JSON with Structured Cards */}
            <div className="space-y-6">
                <div className="flex items-center space-x-3">
                    <div className="h-8 w-1 bg-primary rounded-full"></div>
                    <h3 className="text-2xl font-bold text-white font-cormorant tracking-wide">System Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Security & Access Card */}
                    <div className="glass-card p-6 border-white/5 space-y-4">
                        <div className="flex items-center space-x-3 text-primary">
                            <Shield size={20} />
                            <h4 className="font-bold text-sm uppercase tracking-widest">Security & Access</h4>
                        </div>
                        <div className="space-y-3">
                            <InfoRow label="User ID" value={user.userId} isMono />
                            <InfoRow label="Plain Password" value={user.plainPassword} isYellow />
                            <InfoRow label="Hashed Pass" value={user.password.substring(0, 20) + "..."} isMono />
                            <InfoRow label="Account Role" value={user.role} isTag />
                        </div>
                    </div>

                    {/* Network & Referrals Card */}
                    <div className="glass-card p-6 border-white/5 space-y-4">
                        <div className="flex items-center space-x-3 text-success">
                            <Users size={20} />
                            <h4 className="font-bold text-sm uppercase tracking-widest">Network Context</h4>
                        </div>
                        <div className="space-y-3">
                            <InfoRow label="Referral Code" value={user.referralCode} isMono isPrimary />
                            <InfoRow label="Sponsor ID" value={user.referredBy?.userId || "None (Root)"} isMono />
                            <InfoRow label="Sponsor Name" value={user.referredBy?.name || "System"} />
                            <InfoRow label="Team Members" value={`${user.teamCount} Active`} />
                        </div>
                    </div>

                    {/* Database Metadata Card */}
                    <div className="glass-card p-6 border-white/5 space-y-4">
                        <div className="flex items-center space-x-3 text-purple-500">
                            <History size={20} />
                            <h4 className="font-bold text-sm uppercase tracking-widest">System Metadata</h4>
                        </div>
                        <div className="space-y-3">
                            {/* <InfoRow label="Object ID" value={user._id} isMono /> */}
                            <InfoRow label="Created At" value={new Date(user.createdAt).toLocaleString()} />
                            {/* <InfoRow label="Version (v)" value={user.__v} /> */}
                            {/* <InfoRow label="Package ID" value={user.packageId?._id || "Not Purchased"} isMono /> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper component for structured info rows
const InfoRow = ({ label, value, isMono, isYellow, isPrimary, isTag }) => (
    <div className="flex flex-col space-y-1 py-1 border-b border-white/[0.03] last:border-0">
        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{label}</span>
        <span className={`text-sm truncate ${
            isMono ? 'font-mono' : ''
        } ${
            isYellow ? 'text-yellow-500 font-bold' : 
            isPrimary ? 'text-primary font-bold' : 
            isTag ? 'bg-white/5 px-2 py-0.5 rounded w-fit text-[10px] uppercase font-bold text-gray-400' :
            'text-gray-300'
        }`}>
            {value || "N/A"}
        </span>
    </div>
);

export default AdminUserDetails;

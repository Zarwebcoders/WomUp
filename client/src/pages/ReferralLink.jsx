import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { motion } from 'framer-motion';
import { Copy, MessageCircle, Send, Check, Lock, Users, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';

const LEVEL_RULES = [
    { level: 'L1', num: 1, ref: '₹3,000 / ₹6,000', pct: '18%', cond: "1 Direct Any User's Active Package Compulsory", req: 1, color: 'text-blue-400' },
    { level: 'L2', num: 2, ref: '₹1,200 / ₹2,500', pct: '9%', cond: "1 Direct Any User's Active Package Compulsory", req: 1, color: 'text-purple-400' },
    { level: 'L3', num: 3, ref: '₹1,100 / ₹2,500', pct: '6%', cond: "2 Direct Any User's Active Package Compulsory", req: 2, color: 'text-pink-400' },
    { level: 'L4', num: 4, ref: '₹900 / ₹2,000', pct: '4.8%', cond: "2 Direct Any User's Active Package Compulsory", req: 2, color: 'text-orange-400' },
    { level: 'L5', num: 5, ref: '₹900 / ₹2,000', pct: '3%', cond: "3 Direct Any User's Active Package Compulsory", req: 3, color: 'text-yellow-400' },
    { level: 'L6', num: 6, ref: '₹700 / ₹1,500', pct: '3%', cond: "3 Direct Any User's Active Package Compulsory", req: 3, color: 'text-green-400' },
    { level: 'L7', num: 7, ref: '₹700 / ₹1,500', pct: '1.8%', cond: "4 Direct Any User's Active Package Compulsory", req: 4, color: 'text-teal-400' },
    { level: 'L8', num: 8, ref: '₹500 / ₹1,000', pct: '1.8%', cond: "4 Direct Any User's Active Package Compulsory", req: 4, color: 'text-blue-500' },
    { level: 'L9', num: 9, ref: '₹500 / ₹1,000', pct: '1.8%', cond: "5 Direct Any User's Active Package Compulsory", req: 5, color: 'text-indigo-400' },
    { level: 'L10', num: 10, ref: '₹500 / ₹1,000', pct: '0.8%', cond: "5 Direct Any User's Active Package Compulsory", req: 5, color: 'text-violet-400' },
];

const ReferralLink = () => {
    const { user: authUser } = useAuth();
    const [user] = useState(authUser);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('user'); // 'user' or 'distributer'
    const [eligibility, setEligibility] = useState(null);

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        const fetchEligibility = async () => {
            if (!user?.token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${API_URL}/api/referral/eligibility`, config);
                setEligibility(data);
            } catch (err) {
                console.error('Failed to load level eligibility:', err);
            }
        };
        fetchEligibility();
    }, [user?.token]);

    const userReferralUrl = `${window.location.origin}/register?ref=${user?.referralCode || ''}`;
    const distributorReferralUrl = `${window.location.origin}/distributer/register?ref=${user?.referralCode || ''}`;
    const referralUrl = activeTab === 'user' ? userReferralUrl : distributorReferralUrl;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareWhatsApp = () => {
        const text = `Join WOMUP and start earning! Use my referral link: ${referralUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const shareTelegram = () => {
        const text = `Join WOMUP and start earning!`;
        window.open(`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(text)}`, '_blank');
    };

    const directCount = eligibility?.directCount ?? 0;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1400px] mx-auto space-y-8"
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Side: Referral Tools */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="glass-card p-8 bg-gradient-to-br from-card to-primary/5">
                        <h3 className="text-xl font-bold mb-4 font-cormorant text-white">Your Referral Link</h3>

                        {/* Tab Switcher */}
                        <div className="flex bg-white/5 p-1 rounded-xl mb-6 border border-white/5">
                            <button
                                onClick={() => { setActiveTab('user'); setCopied(false); }}
                                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                                    activeTab === 'user'
                                        ? 'bg-primary-gradient text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Customer Link
                            </button>
                            <button
                                onClick={() => { setActiveTab('distributer'); setCopied(false); }}
                                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                                    activeTab === 'distributer'
                                        ? 'bg-primary-gradient text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Distributor Link
                            </button>
                        </div>
                        
                        <div className="relative mb-8">
                            <input 
                                type="text" 
                                readOnly 
                                value={referralUrl}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-sm text-gray-300 outline-none focus:border-primary/50 transition-all font-mono"
                            />
                            <button 
                                onClick={handleCopy}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-primary-light transition-colors"
                            >
                                {copied ? <Check size={20} className="text-success" /> : <Copy size={20} />}
                            </button>
                        </div>

                        <div className="mb-8">
                            <p className="text-sm text-gray-400 mb-4">Share directly on social media:</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={shareWhatsApp}
                                    className="flex items-center justify-center space-x-2 py-3 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded-xl font-bold hover:bg-[#25D366]/20 transition-all"
                                >
                                    <MessageCircle size={20} />
                                    <span>WhatsApp</span>
                                </button>
                                <button 
                                    onClick={shareTelegram}
                                    className="flex items-center justify-center space-x-2 py-3 bg-[#0088cc]/10 text-[#0088cc] border border-[#0088cc]/20 rounded-xl font-bold hover:bg-[#0088cc]/20 transition-all"
                                >
                                    <Send size={20} />
                                    <span>Telegram</span>
                                </button>
                            </div>
                        </div>

                        {/* QR Code integrated inside */}
                        <div className="pt-8 border-t border-white/5 flex flex-col items-center">
                            <div className="p-3 bg-white rounded-xl mb-4">
                                <QRCodeSVG value={referralUrl} size={150} />
                            </div>
                            <p className="text-xs text-gray-500 text-center">Scan this code to quickly register under your network.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Reward Structure */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="glass-card p-6 md:p-8 h-full">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                            <div>
                                <h3 className="text-xl font-bold font-cormorant text-white">Network Reward Structure (10 Levels)</h3>
                                <p className="text-xs text-gray-400 mt-0.5">Compulsory direct requirements with any user's active package to open each level and earn its income.</p>
                            </div>
                            {!isAdmin && (
                                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs">
                                    <Users size={14} className="text-primary-light" />
                                    <span className="text-gray-300">Your Directs (Active Package):</span>
                                    <span className="text-white font-bold">{directCount}</span>
                                </div>
                            )}
                        </div>

                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-xs md:text-sm">
                                <thead>
                                    <tr className="text-left text-gray-400 border-b border-white/5">
                                        <th className="pb-3 font-medium">Level</th>
                                        <th className="pb-3 font-medium">Referral Bonus</th>
                                        <th className="pb-3 font-medium">Level Income</th>
                                        <th className="pb-3 font-medium">Condition</th>
                                        <th className="pb-3 font-medium text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {LEVEL_RULES.map((row, i) => {
                                        const isOpen = isAdmin || directCount >= row.req;
                                        return (
                                            <tr key={i} className="hover:bg-white/5 transition-colors group">
                                                <td className={`py-3.5 font-bold ${row.color}`}>{row.level}</td>
                                                <td className="py-3.5 text-white font-medium">{row.ref}</td>
                                                <td className="py-3.5 text-success font-bold font-space">{row.pct}</td>
                                                <td className="py-3.5">
                                                    <span className="text-xs text-gray-300 font-medium">
                                                        {row.cond}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 text-center">
                                                    {isOpen ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success border border-success/20">
                                                            <Check size={10} className="mr-1" /> Open
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                                            <Lock size={10} className="mr-1" /> Locked
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Rules Callout Box */}
                        <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-2">
                            <div className="flex items-center space-x-2 text-primary-light font-bold text-xs uppercase tracking-wider">
                                <ShieldCheck size={16} />
                                <span>Level Opening & Income Qualification Policy</span>
                            </div>
                            <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                                <li><strong className="text-white">L1 and L2:</strong> 1 direct compulsory to open levels & receive income.</li>
                                <li><strong className="text-white">L3 and L4:</strong> 2 directs compulsory to open levels & receive income.</li>
                                <li><strong className="text-white">L5 and L6:</strong> 3 directs compulsory to open levels & receive income.</li>
                                <li><strong className="text-white">L7 and L8:</strong> 4 directs compulsory to open levels & receive income.</li>
                                <li><strong className="text-white">L9 and L10:</strong> 5 directs compulsory to open levels & receive income.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ReferralLink;

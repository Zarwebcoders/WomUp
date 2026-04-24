import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Copy, MessageCircle, Send, Check, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';

const ReferralLink = () => {
    const { user: authUser } = useAuth();
    const [user, setUser] = useState(authUser);
    const [copied, setCopied] = useState(false);
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${authUser.token}` }
                };
                const { data } = await axios.get('http://localhost:5001/api/auth/profile', config);
                setUser(data);
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };
        fetchProfile();
    }, [authUser.token]);

    const referralUrl = `${window.location.origin}/register?ref=${user?.referralCode || ''}`;

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

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1400px] mx-auto space-y-8"
        >
            {/* <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-4 font-sora">Invite & Earn</h1>
                <p className="text-gray-400">Share your referral link with friends and earn rewards across 10 levels.</p>
            </div> */}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Side: Referral Tools */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="glass-card p-8 bg-gradient-to-br from-card to-primary/5">
                        <h3 className="text-xl font-bold mb-6 font-cormorant">Your Referral Link</h3>
                        
                        <div className="relative mb-8">
                            <input 
                                type="text" 
                                readOnly 
                                value={referralUrl}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-sm text-gray-300 outline-none focus:border-primary/50 transition-all"
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
                <div className="lg:col-span-7">
                    <div className="glass-card p-8 h-full">
                        <h3 className="text-xl font-bold mb-6 font-cormorant">Network Reward Structure (10 Levels)</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-400 border-b border-white/5">
                                        <th className="pb-4 font-medium">Level</th>
                                        <th className="pb-4 font-medium">Referral Bonus</th>
                                        <th className="pb-4 font-medium">Level Income</th>
                                        <th className="pb-4 font-medium">Potential</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        { level: 'L1', ref: '₹3,000 / ₹7,000', pct: '18%', color: 'text-blue-400' },
                                        { level: 'L2', ref: '₹1,000 / ₹2,000', pct: '9%', color: 'text-purple-400' },
                                        { level: 'L3', ref: '₹1,000 / ₹2,000', pct: '6%', color: 'text-pink-400' },
                                        { level: 'L4', ref: '₹700 / ₹1,500', pct: '4.8%', color: 'text-orange-400' },
                                        { level: 'L5', ref: '₹700 / ₹1,500', pct: '3%', color: 'text-yellow-400' },
                                        { level: 'L6', ref: '₹700 / ₹1,500', pct: '3%', color: 'text-green-400' },
                                        { level: 'L7', ref: '₹700 / ₹1,500', pct: '1.2%', color: 'text-teal-400' },
                                        { level: 'L8', ref: '₹500 / ₹1,000', pct: '1.2%', color: 'text-blue-500' },
                                        { level: 'L9', ref: '₹500 / ₹1,000', pct: '1.2%', color: 'text-indigo-400' },
                                        { level: 'L10', ref: '₹500 / ₹1,000', pct: '1.2%', color: 'text-violet-400' },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                                            <td className={`py-4 font-bold ${row.color}`}>{row.level}</td>
                                            <td className="py-4 text-white font-medium">{row.ref}</td>
                                            <td className="py-4 text-success font-bold font-space">{row.pct}</td>
                                            <td className="py-4 text-gray-400 group-hover:text-white transition-colors">Unlimited</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10 text-[10px] text-gray-500 text-center">
                            Note: Referral bonuses depend on the package type purchased by your downline.
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ReferralLink;

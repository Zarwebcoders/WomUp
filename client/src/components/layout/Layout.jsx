import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Menu, Wallet, User as UserIcon, Copy, Check } from 'lucide-react';

const Layout = () => {
    const { user, loading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopyId = () => {
        navigator.clipboard.writeText(user.referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-background text-white">Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    const location = useLocation();
    const getPageInfo = () => {
        const path = location.pathname;
        if (path.includes('/dashboard')) return { title: `Welcome, ${user.name}`, desc: "Manage your team and track your earnings." };
        if (path.includes('/referral-link')) return { title: "Invite & Earn", desc: "Share your referral link with friends and earn rewards across 10 levels." };
        if (path.includes('/team')) return { title: "My Network", desc: "View and manage your multi-level team structure." };
        if (path.includes('/level-income')) return { title: "Level Income", desc: "Earnings from your extended network (Level 2 & 3)." };
        if (path.includes('/referral-income')) return { title: "Referral Income", desc: "Direct commissions from your immediate referrals (Level 1)." };
        if (path.includes('/packages')) return { title: "Investment Packages", desc: "Choose the perfect plan to accelerate your earnings." };
        if (path.includes('/purchase-history')) return { title: "Purchase History", desc: "Track your package purchase requests and their current status." };
        if (path.includes('/roi-income')) return { title: "ROI Earnings", desc: "Track your monthly return on investment from active packages." };
        if (path.includes('/admin/package-requests')) return { title: "Admin Overview", desc: "Monitor platform health and manage package purchase requests." };
        
        return { title: `Welcome, ${user.name}`, desc: "Manage your platform activity." };
    };

    const { title, desc } = getPageInfo();

    return (
        <div className="flex h-screen bg-background overflow-hidden relative">
            {/* Sidebar with state control */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Top Navbar */}
                <header className="lg:hidden h-16 bg-card border-b border-white/5 flex items-center justify-between px-4 z-30">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 hover:bg-white/5 rounded-lg text-gray-400"
                    >
                        <Menu size={24} />
                    </button>
                    
                    <h1 className="text-xl font-bold bg-primary-gradient bg-clip-text text-transparent">
                        WOMUP
                    </h1>

                    <div className="w-10 h-10 rounded-full bg-primary-gradient flex items-center justify-center font-bold text-sm">
                        {user.name.charAt(0)}
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        {/* Hidden on mobile, shown on desktop if needed, 
                            but we'll rely on page-specific headers for better layout */}
                        <header className="hidden lg:flex mb-10 justify-between items-center">
                            <div>
                                <div className="flex items-center space-x-3">
                                    <h2 className="text-3xl font-bold text-white font-cormorant">{title}</h2>
                                    <button 
                                        onClick={handleCopyId}
                                        className="bg-primary/10 text-primary-light border border-primary/20 px-3 py-1 rounded-full text-xs font-bold tracking-widest flex items-center group hover:bg-primary/20 transition-all"
                                        title="Copy Referral ID"
                                    >
                                        ID: {user.referralCode}
                                        {copied ? (
                                            <Check size={12} className="ml-2 text-success" />
                                        ) : (
                                            <Copy size={12} className="ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-gray-400 mt-1">{desc}</p>
                            </div>
                            <div className="flex items-center space-x-6 bg-card/50 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Available Balance</p>
                                    <p className="text-2xl font-bold text-success font-space">₹{user.walletBalance || 0}</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light">
                                    <Wallet size={24} />
                                </div>
                            </div>
                        </header>

                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;

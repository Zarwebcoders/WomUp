import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { useAuth } from '../context/AuthContext';
import { Bell, Package, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [count, setCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [lastSeenCount, setLastSeenCount] = useState(0);
    const [animate, setAnimate] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API_URL}/api/packages/notifications`, config);
            setNotifications(data.notifications || []);
            const newCount = data.count || 0;
            // Trigger shake animation when new notification arrives
            if (newCount > lastSeenCount && lastSeenCount !== 0) {
                setAnimate(true);
                setTimeout(() => setAnimate(false), 600);
            }
            setCount(newCount);
        } catch (err) {
            // silently fail
        }
    };

    useEffect(() => {
        if (user?.role !== 'admin') return;
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // poll every 30s
        return () => clearInterval(interval);
    }, [user]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleOpen = () => {
        setOpen(prev => !prev);
        setLastSeenCount(count);
    };

    const hasNew = count > lastSeenCount;

    if (user?.role !== 'admin') return null;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={handleOpen}
                className={`relative p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all ${animate ? 'animate-bell-shake' : ''}`}
                title="Package Notifications"
            >
                <Bell size={20} />
                {count > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
                        {count > 99 ? '99+' : count}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {open && (
                <div className="absolute right-0 top-full mt-2 w-[360px] bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                        <div className="flex items-center gap-2">
                            <Bell size={15} className="text-primary-light" />
                            <span className="text-sm font-bold text-white">Package Requests</span>
                            {count > 0 && (
                                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded-full">
                                    {count} Pending
                                </span>
                            )}
                        </div>
                        <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                            <X size={15} />
                        </button>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                <Bell size={32} className="mb-3 opacity-30" />
                                <p className="text-sm">No pending requests</p>
                            </div>
                        ) : (
                            notifications.map((notif, idx) => (
                                <div
                                    key={notif._id}
                                    className="px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Avatar */}
                                        <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary text-sm shrink-0">
                                            {notif.userId?.name?.charAt(0) || '?'}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            {/* User name + time */}
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-white text-sm font-semibold truncate">
                                                    {notif.userId?.name || 'Unknown User'}
                                                </p>
                                                <span className="text-[9px] text-gray-500 shrink-0">
                                                    {new Date(notif.createdAt).toLocaleDateString('en-IN', {
                                                        day: '2-digit', month: 'short',
                                                    })}{' '}
                                                    {new Date(notif.createdAt).toLocaleTimeString('en-IN', {
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>

                                            {/* Referral code */}
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                                                {notif.userId?.referralCode || '—'}
                                            </p>

                                            {/* Package info */}
                                            <div className="mt-1.5 flex items-center gap-1.5">
                                                <Package size={11} className="text-primary-light shrink-0" />
                                                <span className="text-xs text-primary-light font-medium">
                                                    {notif.packageId?.packageName || 'Package'}
                                                </span>
                                                <span className="text-[10px] text-gray-400">
                                                    — ₹{notif.packageId?.price?.toLocaleString() || '0'}
                                                </span>
                                            </div>

                                            {/* Transaction ID */}
                                            <p className="text-[10px] text-gray-500 mt-0.5">
                                                TXN: <span className="text-gray-400 font-mono">{notif.transactionId}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 bg-white/5 border-t border-white/10">
                        <Link
                            to="/admin/package-requests"
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-center gap-2 w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary-light text-xs font-bold rounded-xl transition-all"
                        >
                            View All Requests <ExternalLink size={12} />
                        </Link>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes bell-shake {
                    0%, 100% { transform: rotate(0deg); }
                    20% { transform: rotate(-12deg); }
                    40% { transform: rotate(12deg); }
                    60% { transform: rotate(-8deg); }
                    80% { transform: rotate(8deg); }
                }
                .animate-bell-shake { animation: bell-shake 0.6s ease; }
            `}</style>
        </div>
    );
};

export default NotificationBell;

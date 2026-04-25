import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { motion } from 'framer-motion';
import {
    Users,
    UserCheck,
    Wallet,
    ArrowUpRight,
    TrendingUp,
    Clock,
    ShieldCheck,
    HandCoins,
    CircleDollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('6months');

    useEffect(() => {
        const fetchStats = async () => {
            if (!user || !user.token) return;
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                    params: { period }
                };
                const { data } = await axios.get(`${API_URL}/api/dashboard`, config);
                setStats(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchStats();
    }, [user, period]);

    if (loading) return <div className="text-white p-10">Loading dashboard...</div>;

    const isAdmin = stats?.isAdmin === true;

    const summaryCards = isAdmin ? [
        { title: 'Total Users', value: stats.totalUsers || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { title: 'Pending Requests', value: stats.pendingRequests || 0, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        { title: 'Total Revenue', value: `₹${stats.totalRevenue?.toLocaleString() || 0}`, icon: Wallet, color: 'text-success', bg: 'bg-success/10' },
        { title: 'System Status', value: 'Live', icon: ShieldCheck, color: 'text-primary-light', bg: 'bg-primary/10' },
    ] : [
        { title: 'Total Team', value: stats?.user?.teamCount || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { title: 'Direct Referrals', value: stats?.directReferrals || 0, icon: UserCheck, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { title: 'Total Income', value: `₹${stats?.user?.totalIncome || 0}`, icon: Wallet, color: 'text-success', bg: 'bg-success/10' },
        { title: 'ROI Income', value: `₹${stats?.user?.roiIncome || 0}`, icon: CircleDollarSign, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        { title: 'Referral Income', value: `₹${stats?.user?.referralIncome || 0}`, icon: HandCoins, color: 'text-pink-400', bg: 'bg-pink-500/10' },
        { title: 'Level Income', value: `₹${stats?.user?.levelIncome || 0}`, icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    ];

    const chartData = {
        labels: stats?.chartLabels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: isAdmin ? [
            {
                label: 'Platform Revenue',
                data: stats?.chartData || [0, 0, 0, 0, 0, 0],
                fill: true,
                borderColor: '#AD49E1',
                backgroundColor: 'rgba(173, 73, 225, 0.1)',
                tension: 0.4,
            }
        ] : [
            {
                label: 'Earnings',
                data: stats?.incomeData || [0, 0, 0, 0, 0, 0],
                fill: true,
                borderColor: '#AD49E1',
                backgroundColor: 'rgba(173, 73, 225, 0.05)',
                tension: 0.4,
            },
            {
                label: 'Investment',
                data: stats?.investmentData || [0, 0, 0, 0, 0, 0],
                fill: true,
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.05)',
                tension: 0.4,
            }
        ],
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section - Only shown for Admin since User has it in Layout */}
            {isAdmin && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-cormorant text-white">
                            Admin Overview
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Monitor platform health and manage requests.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl w-fit">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                        <span className="text-primary-light text-xs font-bold uppercase">System Online</span>
                    </div>
                </div>
            )}

            {/* Summary Cards Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
                {summaryCards.map((card, index) => (
                    <div
                        key={index}
                        className="glass-card p-6 flex items-center justify-between hover:border-white/20 transition-all"
                    >
                        <div>
                            <p className="text-gray-400 text-sm mb-1">{card.title}</p>
                            <h3 className="text-2xl font-bold text-white font-space">{card.value}</h3>
                        </div>
                        <div className={`${card.bg} ${card.color} p-4 rounded-2xl`}>
                            <card.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart and Package Section */}
            <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-8`}>
                <div className={`${isAdmin ? 'lg:col-span-1' : 'lg:col-span-2'} glass-card p-4 md:p-8`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h3 className="text-lg md:text-xl font-bold">{isAdmin ? 'Platform Performance' : 'Income Analytics'}</h3>
                        <select 
                            className="w-full sm:w-auto bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none text-gray-400 cursor-pointer hover:border-primary/50"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                        >
                            <option value="6months">Last 6 Months</option>
                            <option value="year">Last Year</option>
                        </select>
                    </div>
                    <div className="h-[200px] md:h-[300px]">
                        <Line 
                            data={chartData} 
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
                                    x: { grid: { display: false }, ticks: { color: '#9ca3af' } },
                                }
                            }} 
                        />
                    </div>
                </div>

                {!isAdmin && (
                    <div className="glass-card p-8 bg-gradient-to-br from-card to-primary-dark/20 relative overflow-hidden flex flex-col justify-center">
                        <div className="relative z-10 text-center">
                            <ShieldCheck className="text-primary-light mx-auto mb-4" size={40} />
                            <h3 className="text-gray-400 text-sm mb-1">Active Package</h3>
                            <h2 className="text-3xl font-bold mb-6 font-cormorant">{stats?.user?.packageId?.packageName || 'No Package'}</h2>
                            <button
                                onClick={() => window.location.href = '/packages'}
                                className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold transition-all"
                            >
                                {stats?.user?.packageId ? 'Upgrade Package' : 'View Packages'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Activities Table */}
            <div className="glass-card overflow-hidden">
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-xl font-bold">Recent Activities</h3>
                    <button className="text-primary text-sm font-semibold flex items-center">
                        View All <ArrowUpRight size={16} className="ml-1" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-400 text-sm border-b border-white/5">
                                <th className="px-8 py-4 font-medium">Activity</th>
                                <th className="px-8 py-4 font-medium">Type</th>
                                <th className="px-8 py-4 font-medium">{isAdmin ? 'Package' : 'Amount'}</th>
                                <th className="px-8 py-4 font-medium">Date</th>
                                <th className="px-8 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {stats?.recentActivities?.length > 0 ? stats.recentActivities.map((activity, i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-8 py-4 flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                            {isAdmin ? <Users size={14} /> : <Clock size={14} />}
                                        </div>
                                        <span className="font-medium text-white">
                                            {isAdmin ? `${activity.fromUser?.name} requested package` : `Income from ${activity.fromUser?.name || 'System'}`}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-gray-400 capitalize">{activity.incomeType}</td>
                                    <td className={`px-8 py-4 font-bold font-space ${isAdmin ? 'text-primary-light' : 'text-success'}`}>
                                        {isAdmin ? activity.amount : `+₹${activity.amount}`}
                                    </td>
                                    <td className="px-8 py-4 text-gray-400">{new Date(activity.createdAt).toLocaleDateString()}</td>
                                    <td className="px-8 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            activity.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-success/10 text-success'
                                        }`}>
                                            {activity.status || 'Completed'}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-10 text-center text-gray-500">No recent activities found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

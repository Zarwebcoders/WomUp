import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, ArrowDownLeft, Clock, User } from 'lucide-react';

const IncomePage = ({ type, title, description }) => {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get(`http://localhost:5001/api/income/${type}?search=${searchTerm}`, config);
                setLogs(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        
        const timeoutId = setTimeout(() => {
            if (searchTerm) setLoading(true);
            fetchLogs();
        }, 500);
        
        return () => clearTimeout(timeoutId);
    }, [type, user.token, searchTerm]);

    const totalIncome = logs.reduce((sum, log) => sum + log.amount, 0);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 pb-10"
        >
            <div className="flex justify-end">
                <div className="glass-card p-6 bg-gradient-to-br from-card to-success/10 border-success/20 min-w-[240px]">
                    <p className="text-gray-400 text-sm mb-1">Total {type === 'level' ? 'Level' : 'Referral'} Income</p>
                    <h2 className="text-3xl font-bold text-success font-space">₹{totalIncome.toLocaleString()}</h2>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <div className="relative w-full max-w-md">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by user name or amount..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-primary transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-400 text-sm border-b border-white/5">
                                <th className="px-8 py-4 font-medium">Transaction ID</th>
                                <th className="px-8 py-4 font-medium">From User</th>
                                <th className="px-8 py-4 font-medium">Amount</th>
                                <th className="px-8 py-4 font-medium">Date</th>
                                <th className="px-8 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr><td colSpan="5" className="px-8 py-10 text-center">Loading logs...</td></tr>
                            ) : logs.length > 0 ? logs.map((log, i) => (
                                <tr key={log._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-8 py-4">
                                        <code className="text-primary-light bg-primary/10 px-2 py-1 rounded text-xs">
                                            #TXN-{log._id.substring(18).toUpperCase()}
                                        </code>
                                    </td>
                                    <td className="px-8 py-4 flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><User size={14} className="text-gray-400" /></div>
                                        <div>
                                            <p className="font-medium text-white">{log.fromUser?.name || 'System'}</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Level {log.level || 'Direct'}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center space-x-1 text-success font-bold font-space">
                                            <ArrowDownLeft size={14} />
                                            <span>₹{log.amount}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-gray-400">
                                        <div className="flex items-center space-x-2">
                                            <Clock size={14} />
                                            <span>{new Date(log.createdAt).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className="px-3 py-1 bg-success/10 text-success rounded-full text-[10px] font-bold uppercase">Credited</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-10 text-center text-gray-500">
                                        No income logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default IncomePage;

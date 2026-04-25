import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Package, Search, Calendar, CreditCard, User, ExternalLink, Filter, Download } from 'lucide-react';

const AdminPackageHistory = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get(`${API_URL}/api/packages/requests`, config);
                setRequests(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user.token]);

    const filteredHistory = requests.filter(req => {
        const matchesSearch = 
            req.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.packageId?.packageName?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const getStatusStyles = (status) => {
        switch(status) {
            case 'approved': return 'bg-success/10 text-success border-success/20';
            case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-cormorant">Package History</h1>
                    <p className="text-gray-400 text-sm">A complete log of all package purchase attempts and their outcomes.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Search history..."
                            className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-primary min-w-[250px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                        {['all', 'approved', 'rejected', 'pending'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                    statusFilter === s 
                                    ? 'bg-primary text-white shadow-lg' 
                                    : 'text-gray-500 hover:text-white'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">User / Date</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Package Details</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Transaction Info</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="4" className="px-8 py-20 text-center text-gray-500">Loading history logs...</td></tr>
                            ) : filteredHistory.length > 0 ? filteredHistory.map((req) => (
                                <tr key={req._id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium">{req.userId?.name}</span>
                                            <div className="flex items-center text-[10px] text-gray-500 mt-1">
                                                <Calendar size={10} className="mr-1" />
                                                {new Date(req.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Package size={16} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm">{req.packageId?.packageName}</p>
                                                <p className="text-xs text-success font-space">₹{req.packageId?.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col space-y-1">
                                            <div className="flex items-center text-xs text-gray-300 font-mono">
                                                <CreditCard size={12} className="mr-1.5 text-gray-500" />
                                                {req.transactionId}
                                            </div>
                                            <a 
                                                href={`${API_URL}/${req.transactionSlip}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-primary-light hover:underline text-[10px] flex items-center"
                                            >
                                                View Attachment <ExternalLink size={10} className="ml-1" />
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyles(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center text-gray-500">
                                        No history records found for the selected filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPackageHistory;

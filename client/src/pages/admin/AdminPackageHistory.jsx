import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Package, Search, Calendar, CreditCard, ExternalLink } from 'lucide-react';

const AdminPackageHistory = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(25);

    // Debounce Logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); 
        }, 1000);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            // The API supports a search query which we trigger via debouncedSearch
            const { data } = await axios.get(`${API_URL}/api/packages/requests?search=${debouncedSearch}`, config);
            setRequests(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [debouncedSearch, user.token]);

    const filteredHistory = requests.filter(req => {
        const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
        return matchesStatus;
    });

    const getStatusStyles = (status) => {
        switch(status) {
            case 'approved': return 'bg-success/10 text-success border-success/20';
            case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        }
    };

    const viewImage = (slip) => {
        if (!slip) return;
        const imageUrl = slip.startsWith('data:') ? slip : `${API_URL}/${slip}`;
        const newWindow = window.open();
        newWindow.document.write(`
            <html>
                <head><title>Transaction Slip</title></head>
                <body style="margin:0; background: #000; display: flex; align-items: center; justify-content: center;">
                    <img src="${imageUrl}" style="max-width: 100%; max-height: 100vh;">
                </body>
            </html>
        `);
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Search history..."
                            className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-primary min-w-[250px] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                        {['all', 'approved', 'rejected', 'pending'].map((s) => (
                            <button
                                key={s}
                                onClick={() => {
                                    setStatusFilter(s);
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                    statusFilter === s 
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
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
                            ) : currentItems.length > 0 ? currentItems.map((req) => (
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
                                            <button 
                                                onClick={() => viewImage(req.transactionSlip)}
                                                className="text-primary-light hover:underline text-[10px] flex items-center"
                                            >
                                                View Attachment <ExternalLink size={10} className="ml-1" />
                                            </button>
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
                                        No history records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {filteredHistory.length > itemsPerPage && (
                    <div className="p-4 border-t border-white/10 flex items-center justify-between">
                        <p className="text-[10px] text-gray-500">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredHistory.length)} of {filteredHistory.length} records
                        </p>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${
                                        currentPage === i + 1 
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                        : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPackageHistory;

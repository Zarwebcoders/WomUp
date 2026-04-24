import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Check, X, Eye, Clock, Search, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminPackageRequests = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');
    const [processingId, setProcessingId] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        setCurrentPage(1);
        const timeoutId = setTimeout(() => {
            fetchRequests();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const fetchRequests = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get('http://localhost:5001/api/packages/requests', config);
            setRequests(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this request?`)) return;

        setProcessingId(id);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.put(`http://localhost:5001/api/packages/requests/${id}`, { status }, config);
            setMessage({ type: 'success', text: `Request ${status} successfully` });
            fetchRequests();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
        }
        setProcessingId(null);
    };

    const filteredRequests = requests.filter(req => 
        req.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.packageId?.packageName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

    if (loading) return <div className="text-white p-8 text-center">Loading requests...</div>;

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-cormorant">Package Requests</h1>
                    <p className="text-gray-400 text-sm">Manage user package purchase requests and verification.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Search user, email or TXID..."
                        className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-primary min-w-[300px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-xl text-center border ${
                    message.type === 'success' ? 'bg-success/10 border-success/20 text-success' : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">User Details</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Package</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Transaction Info</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {currentItems.map((req) => (
                                <tr key={req._id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium">{req.userId?.name}</span>
                                            <span className="text-gray-500 text-xs">{req.userId?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-primary font-bold">{req.packageId?.packageName}</span>
                                            <span className="text-gray-400 text-xs">₹{req.packageId?.price.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col space-y-1">
                                            <span className="text-gray-300 text-xs font-mono">{req.transactionId}</span>
                                            <a 
                                                href={`http://localhost:5001/${req.transactionSlip}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-primary-light hover:underline text-[10px] flex items-center"
                                            >
                                                View Slip <ExternalLink size={10} className="ml-1" />
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                            req.status === 'approved' ? 'bg-success/10 text-success' :
                                            'bg-red-500/10 text-red-500'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {req.status === 'pending' ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <button 
                                                    onClick={() => handleStatusUpdate(req._id, 'approved')}
                                                    disabled={processingId === req._id}
                                                    className="p-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-all"
                                                    title="Approve"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusUpdate(req._id, 'rejected')}
                                                    disabled={processingId === req._id}
                                                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all"
                                                    title="Reject"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center text-gray-500 text-xs italic">
                                                Processed
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredRequests.length === 0 && (
                    <div className="p-20 text-center text-gray-500">
                        No purchase requests found.
                    </div>
                )}

                {/* Pagination Controls */}
                {filteredRequests.length > itemsPerPage && (
                    <div className="p-4 border-t border-white/10 flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRequests.length)} of {filteredRequests.length} requests
                        </p>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                        currentPage === i + 1 
                                        ? 'bg-primary-gradient text-white shadow-lg' 
                                        : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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

export default AdminPackageRequests;

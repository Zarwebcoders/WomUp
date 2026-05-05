import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle, Search, Calendar, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PurchaseHistory = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get(`${API_URL}/api/packages/my-requests`, config);
                setRequests(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchRequests();
    }, [user.token]);

    const filteredRequests = requests.filter(req => 
        req.packageId?.packageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch(status) {
            case 'approved': return 'bg-success/10 text-success border-success/20';
            case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'approved': return <CheckCircle size={14} />;
            case 'rejected': return <XCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    const viewImage = (slip) => {
        if (!slip) return;
        const imageUrl = slip.startsWith('data:') ? slip : `${API_URL}/${slip}`;
        const newWindow = window.open();
        newWindow.document.write(`
            <html>
                <head><title>Receipt Preview</title></head>
                <body style="margin:0; background: #000; display: flex; align-items: center; justify-content: center;">
                    <img src="${imageUrl}" style="max-width: 100%; max-height: 100vh;">
                </body>
            </html>
        `);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-10"
        >
            {/* <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-cormorant text-white">Purchase History</h1>
                    <p className="text-gray-400 text-sm mt-1">Track your package purchase requests and their current status.</p>
                </div>
            </div> */}

            <div className="glass-card overflow-hidden">
                <div className="p-4 md:p-6 border-b border-white/5">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                            type="text"
                            placeholder="Search by package name or Transaction ID..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-primary transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="text-left text-gray-400 text-xs md:text-sm border-b border-white/5 uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Package Details</th>
                                <th className="px-6 py-4 font-medium">Transaction Info</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr><td colSpan="4" className="px-8 py-10 text-center text-gray-500">Loading purchase history...</td></tr>
                            ) : filteredRequests.length > 0 ? filteredRequests.map((req, i) => (
                                <tr key={req._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Package size={20} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{req.packageId?.packageName} Package</p>
                                                <p className="text-xs text-success font-space">₹{req.packageId?.price?.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2 text-gray-300">
                                                <CreditCard size={14} className="text-gray-500" />
                                                <span className="font-mono text-xs">{req.transactionId}</span>
                                            </div>
                                            {req.transactionSlip && (
                                                <button 
                                                    onClick={() => viewImage(req.transactionSlip)}
                                                    className="text-[10px] text-primary hover:underline flex items-center space-x-1"
                                                >
                                                    View Receipt
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-gray-400">
                                            <Calendar size={14} />
                                            <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(req.status)}`}>
                                            {getStatusIcon(req.status)}
                                            <span>{req.status}</span>
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="p-4 bg-white/5 rounded-full">
                                                <Package size={40} className="text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">No purchase history found</p>
                                                <p className="text-gray-500 text-sm">When you buy a package, your requests will appear here.</p>
                                            </div>
                                        </div>
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

export default PurchaseHistory;

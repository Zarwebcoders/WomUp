import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Search, Calendar, FileText, User, ShieldAlert, Image, ExternalLink } from 'lucide-react';

const AdminKycManagement = () => {
    const { user } = useAuth();
    const [kycRequests, setKycRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [message, setMessage] = useState('');
    const [processingId, setProcessingId] = useState(null);

    // Inspector Modal
    const [inspectingUser, setInspectingUser] = useState(null);
    const [loadingInspectId, setLoadingInspectId] = useState(null);

    const handleInspect = async (reqUser) => {
        setLoadingInspectId(reqUser._id);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get(`${API_URL}/api/kyc/admin/user/${reqUser._id}`, config);
            setInspectingUser(data);
        } catch (err) {
            console.error('Error fetching KYC documents:', err);
            setMessage({ type: 'error', text: 'Failed to load user documents.' });
        } finally {
            setLoadingInspectId(null);
        }
    };

    // Rejection Modal / Reason Input
    const [rejectingUser, setRejectingUser] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 1000);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchKycList();
    }, [debouncedSearch, user.token]);

    const fetchKycList = async () => {
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get(`${API_URL}/api/kyc/admin/list`, config);
            setKycRequests(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching KYC list:', err);
            setLoading(false);
        }
    };

    const handleKycReview = async (targetUserId, status, reason = '') => {
        setProcessingId(targetUserId);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.put(`${API_URL}/api/kyc/admin/review/${targetUserId}`, { 
                status, 
                rejectReason: reason 
            }, config);
            
            setMessage({ type: 'success', text: `KYC request ${status} successfully.` });
            setInspectingUser(null);
            setRejectingUser(null);
            setRejectReason('');
            fetchKycList();
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: err.response?.data?.message || 'Verification update failed.' });
        } finally {
            setProcessingId(null);
        }
    };

    const viewImage = (imageUrl) => {
        if (!imageUrl) return;
        const newWindow = window.open();
        newWindow.document.write(`
            <html>
                <head><title>KYC Document Preview</title></head>
                <body style="margin:0; background: #000; display: flex; align-items: center; justify-content: center;">
                    <img src="${imageUrl}" style="max-width: 100%; max-height: 100vh;">
                </body>
            </html>
        `);
    };

    // Filter local list
    const filteredRequests = kycRequests.filter(req => {
        const query = debouncedSearch.toLowerCase();
        const matchesSearch = (
            req.name?.toLowerCase().includes(query) ||
            req.email?.toLowerCase().includes(query) ||
            req.userId?.toLowerCase().includes(query) ||
            req.referralCode?.toLowerCase().includes(query)
        );
        if (!matchesSearch) return false;

        // Date filter
        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0,0,0,0);
            if (!req.kyc?.submittedAt || new Date(req.kyc.submittedAt) < start) return false;
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23,59,59,999);
            if (!req.kyc?.submittedAt || new Date(req.kyc.submittedAt) > end) return false;
        }

        return true;
    });

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold font-cormorant bg-primary-gradient bg-clip-text text-transparent">
                        KYC Management
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Review and verify user identity submissions.</p>
                </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="relative">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Search</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text"
                            placeholder="Search by name, email, code..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white outline-none focus:border-primary transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Start Date</label>
                    <input 
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white outline-none focus:border-primary transition-all"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">End Date</label>
                    <input 
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white outline-none focus:border-primary transition-all"
                    />
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-xl text-center border text-sm font-medium ${
                    message.type === 'success' ? 'bg-success/10 border-success/20 text-success' : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                    {message.text}
                </div>
            )}

            {/* Requests List */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">User Details</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Documents Submitted</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Submitted Date</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="4" className="px-8 py-20 text-center text-gray-500">Loading KYC requests...</td></tr>
                            ) : filteredRequests.length > 0 ? filteredRequests.map((req) => (
                                <tr key={req._id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            {req.kyc?.profilePhoto ? (
                                                <img 
                                                    src={req.kyc.profilePhoto} 
                                                    alt={req.name} 
                                                    className="w-10 h-10 rounded-full object-cover border border-white/10 cursor-pointer"
                                                    onClick={() => viewImage(req.kyc.profilePhoto)}
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xs">
                                                    {req.name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-white text-sm font-medium">{req.name}</p>
                                                <p className="text-gray-500 text-xs">{req.email}</p>
                                                <span className="text-[10px] text-primary-light font-semibold uppercase">{req.userId || req.referralCode}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                            <span className="flex items-center"><FileText size={12} className="mr-1.5" /> Aadhar: {req.kyc?.aadharNumber ? '✓' : '✗'}</span>
                                            <span className="flex items-center"><FileText size={12} className="mr-1.5" /> PAN: {req.kyc?.panNumber ? '✓' : '✗'}</span>
                                            <span className="flex items-center"><FileText size={12} className="mr-1.5" /> Bank: {req.kyc?.bankAccountNumber ? '✓' : '✗'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-300">
                                        <div className="flex items-center">
                                            <Calendar size={12} className="mr-1.5 text-gray-500" />
                                            {req.kyc?.submittedAt ? new Date(req.kyc.submittedAt).toLocaleString() : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button 
                                                onClick={() => handleInspect(req)}
                                                disabled={loadingInspectId === req._id}
                                                className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary-light text-xs font-bold rounded-lg transition-all disabled:opacity-50"
                                            >
                                                {loadingInspectId === req._id ? 'Loading...' : 'Inspect Documents'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="px-8 py-20 text-center text-gray-500">No pending KYC verifications.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Inspections Modal */}
            <AnimatePresence>
                {inspectingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setInspectingUser(null)}
                            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-card border border-white/10 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            <button 
                                onClick={() => setInspectingUser(null)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white p-2 rounded-lg"
                            >
                                <X size={20} />
                            </button>

                            <div className="space-y-6">
                                {/* Header */}
                                <div className="flex items-center space-x-4 border-b border-white/5 pb-4">
                                    {inspectingUser.kyc?.profilePhoto && (
                                        <img 
                                            src={inspectingUser.kyc.profilePhoto} 
                                            alt={inspectingUser.name} 
                                            className="w-16 h-16 rounded-full object-cover border border-white/10"
                                        />
                                    )}
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{inspectingUser.name}</h3>
                                        <p className="text-sm text-gray-500">{inspectingUser.email} • {inspectingUser.mobile}</p>
                                        <span className="text-xs text-primary font-bold uppercase">ID: {inspectingUser.userId || inspectingUser.referralCode} ({inspectingUser.role})</span>
                                    </div>
                                </div>

                                {/* Main Panels */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Panel: Aadhar & PAN */}
                                    <div className="space-y-6">
                                        {/* Aadhar details */}
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Aadhar Verification</h4>
                                            <p className="text-sm font-semibold font-mono text-white">Number: {inspectingUser.kyc?.aadharNumber}</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <span className="block text-[9px] text-gray-500 mb-1">Front</span>
                                                    <img 
                                                        src={inspectingUser.kyc?.aadharFront} 
                                                        alt="Aadhar Front" 
                                                        className="w-full aspect-video object-cover rounded-lg border border-white/10 cursor-pointer hover:opacity-80 transition-all"
                                                        onClick={() => viewImage(inspectingUser.kyc?.aadharFront)}
                                                    />
                                                </div>
                                                <div>
                                                    <span className="block text-[9px] text-gray-500 mb-1">Back</span>
                                                    <img 
                                                        src={inspectingUser.kyc?.aadharBack} 
                                                        alt="Aadhar Back" 
                                                        className="w-full aspect-video object-cover rounded-lg border border-white/10 cursor-pointer hover:opacity-80 transition-all"
                                                        onClick={() => viewImage(inspectingUser.kyc?.aadharBack)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* PAN Details */}
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">PAN Card Verification</h4>
                                            <p className="text-sm font-semibold font-mono text-white">Number: {inspectingUser.kyc?.panNumber}</p>
                                            <div>
                                                <span className="block text-[9px] text-gray-500 mb-1">PAN Card Image</span>
                                                <img 
                                                    src={inspectingUser.kyc?.panCardPhoto} 
                                                    alt="PAN Card" 
                                                    className="w-full max-w-[200px] aspect-video object-cover rounded-lg border border-white/10 cursor-pointer hover:opacity-80 transition-all"
                                                    onClick={() => viewImage(inspectingUser.kyc?.panCardPhoto)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Panel: Bank Details */}
                                    <div className="space-y-6">
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bank Details</h4>
                                            <div className="grid grid-cols-2 gap-4 text-xs">
                                                <div>
                                                    <span className="block text-gray-500">Holder Name</span>
                                                    <span className="font-semibold text-white">{inspectingUser.kyc?.bankHolderName}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-gray-500">Bank Name</span>
                                                    <span className="font-semibold text-white">{inspectingUser.kyc?.bankName}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-gray-500 font-mono">Account Number</span>
                                                    <span className="font-semibold text-white font-mono">{inspectingUser.kyc?.bankAccountNumber}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-gray-500 font-mono">IFSC Code</span>
                                                    <span className="font-semibold text-white font-mono">{inspectingUser.kyc?.bankIfscCode}</span>
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <span className="block text-[9px] text-gray-500 mb-1">Passbook / Cheque Slip</span>
                                                <img 
                                                    src={inspectingUser.kyc?.bankPassbookPhoto} 
                                                    alt="Passbook" 
                                                    className="w-full max-w-[250px] aspect-video object-cover rounded-lg border border-white/10 cursor-pointer hover:opacity-80 transition-all"
                                                    onClick={() => viewImage(inspectingUser.kyc?.bankPassbookPhoto)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Review Actions */}
                                <div className="flex items-center justify-end space-x-4 border-t border-white/5 pt-4 mt-6">
                                    <button 
                                        onClick={() => setRejectingUser(inspectingUser)}
                                        disabled={processingId === inspectingUser._id}
                                        className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                                    >
                                        Reject Verification
                                    </button>
                                    <button 
                                        onClick={() => handleKycReview(inspectingUser._id, 'approved')}
                                        disabled={processingId === inspectingUser._id}
                                        className="px-6 py-2.5 bg-success hover:bg-success/80 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider shadow-lg shadow-success/20"
                                    >
                                        Approve Verification
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Rejection Modal */}
            <AnimatePresence>
                {rejectingUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setRejectingUser(null)}
                            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-card border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
                        >
                            <h3 className="text-lg font-bold text-white flex items-center">
                                <ShieldAlert size={20} className="mr-2 text-red-500" />
                                Reject KYC Submission
                            </h3>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-2">Rejection Reason</label>
                                <textarea 
                                    placeholder="Enter details on why this application was rejected (e.g. blurry documents, name mismatch)..."
                                    rows="4"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-primary"
                                />
                            </div>
                            <div className="flex items-center justify-end space-x-3 pt-2">
                                <button 
                                    onClick={() => setRejectingUser(null)}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 font-bold rounded-lg text-xs"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => handleKycReview(rejectingUser._id, 'rejected', rejectReason)}
                                    disabled={processingId === rejectingUser._id || !rejectReason.trim()}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminKycManagement;

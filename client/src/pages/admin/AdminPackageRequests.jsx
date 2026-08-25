import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Eye, Clock, Search, ExternalLink, AlertCircle, Calendar, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminPackageRequests = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [message, setMessage] = useState('');
    const [processingId, setProcessingId] = useState(null);

    // Filter states
    const [packages, setPackages] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedPackage, setSelectedPackage] = useState('all');
    const [statusFilter, setStatusFilter] = useState('pending');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(25);

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        id: null,
        status: '',
        userName: '',
        packageName: ''
    });

    // Debounce Logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); 
        }, 1000);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch Packages for filtering dropdown
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/packages`);
                setPackages(data);
            } catch (err) {
                console.error('Error fetching packages', err);
            }
        };
        fetchPackages();
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [debouncedSearch, user.token]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get(`${API_URL}/api/packages/requests?search=${debouncedSearch}`, config);
            setRequests(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const exportToCSV = (data) => {
        const headers = ['User Name', 'Email', 'User ID', 'Package Name', 'Quantity', 'Price', 'Total Price', 'Transaction ID', 'Status', 'Request Date'];
        const rows = data.map(req => [
            req.userId?.name || '',
            req.userId?.email || '',
            req.userId?.userId || '',
            req.packageId?.packageName || '',
            req.quantity || 1,
            req.packageId?.price || 0,
            (req.packageId?.price || 0) * (req.quantity || 1),
            req.transactionId || '',
            req.status || '',
            new Date(req.createdAt).toLocaleString()
        ]);
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `package_requests_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToExcel = (data) => {
        const headers = ['User Name', 'Email', 'User ID', 'Package Name', 'Quantity', 'Price', 'Total Price', 'Transaction ID', 'Status', 'Request Date'];
        const rows = data.map(req => [
            req.userId?.name || '',
            req.userId?.email || '',
            req.userId?.userId || '',
            req.packageId?.packageName || '',
            req.quantity || 1,
            req.packageId?.price || 0,
            (req.packageId?.price || 0) * (req.quantity || 1),
            req.transactionId || '',
            req.status || '',
            new Date(req.createdAt).toLocaleString()
        ]);
        
        const tsvContent = [headers.join('\t'), ...rows.map(e => e.join('\t'))].join('\n');
        const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `package_requests_${new Date().toISOString().slice(0, 10)}.xls`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const triggerConfirm = (req, status) => {
        setConfirmModal({
            isOpen: true,
            id: req._id,
            status: status,
            userName: req.userId?.name,
            packageName: req.packageId?.packageName
        });
    };

    const handleStatusUpdate = async () => {
        const { id, status } = confirmModal;
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        setProcessingId(id);
        
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.put(`${API_URL}/api/packages/requests/${id}`, { status }, config);
            setMessage({ type: 'success', text: `Request ${status} successfully` });
            fetchRequests();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
        }
        setProcessingId(null);
    };

    const viewImage = async (requestId) => {
        if (!requestId) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${adminUser.token}` }
            };
            const { data } = await axios.get(`${API_URL}/api/packages/requests/${requestId}/slip`, config);
            const slip = data.slip;
            if (!slip) {
                alert('No slip found');
                return;
            }
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
        } catch (err) {
            console.error('Error fetching slip', err);
            alert('Failed to load transaction slip');
        }
    };

    // Filter requests based on status, package, and date range
    const filteredRequests = requests.filter(req => {
        // Status filter
        if (statusFilter !== 'all' && req.status !== statusFilter) return false;

        // Package filter
        if (selectedPackage !== 'all') {
            if (!req.packageId || req.packageId._id !== selectedPackage) return false;
        }

        // Date filter
        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0,0,0,0);
            if (new Date(req.createdAt) < start) return false;
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23,59,59,999);
            if (new Date(req.createdAt) > end) return false;
        }

        return true;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Status Tabs */}
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                    {['pending', 'approved', 'rejected', 'all'].map((s) => (
                        <button
                            key={s}
                            onClick={() => {
                                setStatusFilter(s);
                                setCurrentPage(1);
                            }}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase transition-all duration-200 ${
                                statusFilter === s 
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Search user, email or TXID..."
                        className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-primary min-w-[300px] transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Date Filters & Package Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 items-end">
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Start Date</label>
                    <input 
                        type="date"
                        value={startDate}
                        onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white outline-none focus:border-primary transition-all"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">End Date</label>
                    <input 
                        type="date"
                        value={endDate}
                        onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white outline-none focus:border-primary transition-all"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Package Filter</label>
                    <select
                        value={selectedPackage}
                        onChange={(e) => { setSelectedPackage(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                    >
                        <option value="all" className="bg-neutral-900">All Packages</option>
                        {packages.map(pkg => (
                            <option key={pkg._id} value={pkg._id} className="bg-neutral-900">
                                {pkg.packageName} (₹{pkg.price.toLocaleString()})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => exportToCSV(filteredRequests)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl transition-all"
                        title="Download CSV"
                    >
                        <Download size={14} /> CSV
                    </button>
                    <button
                        onClick={() => exportToExcel(filteredRequests)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-xl transition-all"
                        title="Download Excel"
                    >
                        <Download size={14} /> Excel
                    </button>
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
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Request Date</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Transaction Info</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="6" className="px-8 py-20 text-center text-gray-500">Loading requests...</td></tr>
                            ) : currentItems.length > 0 ? currentItems.map((req) => (
                                <tr key={req._id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium">{req.userId?.name}</span>
                                            <span className="text-gray-500 text-xs">{req.userId?.email}</span>
                                            {req.userId?.userId && (
                                                <span className="text-[10px] text-primary-light font-semibold mt-0.5">ID: {req.userId.userId}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-primary font-bold">{req.packageId?.packageName} (x{req.quantity || 1})</span>
                                            <span className="text-gray-400 text-xs">₹{((req.packageId?.price || 0) * (req.quantity || 1)).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-white">
                                            <Calendar size={14} className="text-primary-light" />
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold font-space text-white">{new Date(req.createdAt).toLocaleDateString()}</span>
                                                <span className="text-gray-500 text-[10px]">{new Date(req.createdAt).toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col space-y-1">
                                            <span className="text-gray-300 text-xs font-mono">{req.transactionId}</span>
                                            <button 
                                                onClick={() => viewImage(req._id)}
                                                className="text-primary-light hover:underline text-[10px] flex items-center"
                                            >
                                                View Slip <ExternalLink size={10} className="ml-1" />
                                            </button>
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
                                                    onClick={() => triggerConfirm(req, 'approved')}
                                                    disabled={processingId === req._id}
                                                    className="p-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-all"
                                                    title="Approve"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => triggerConfirm(req, 'rejected')}
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
                            )) : (
                                <tr><td colSpan="6" className="px-8 py-20 text-center text-gray-500">No purchase requests found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {filteredRequests.length > itemsPerPage && (
                    <div className="p-4 border-t border-white/10 flex items-center justify-between">
                        <p className="text-[10px] text-gray-500">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRequests.length)} of {filteredRequests.length} requests
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

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirmModal.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-card border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className={`p-4 rounded-full ${confirmModal.status === 'approved' ? 'bg-success/10 text-success' : 'bg-red-500/10 text-red-500'}`}>
                                    <AlertCircle size={40} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white capitalize">
                                        Confirm {confirmModal.status}
                                    </h3>
                                    <p className="text-gray-400 mt-2 text-sm">
                                        Are you sure you want to <span className="text-white font-bold">{confirmModal.status}</span> the <span className="text-primary font-bold">{confirmModal.packageName}</span> package request for <span className="text-white font-bold">{confirmModal.userName}</span>?
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4 w-full pt-4">
                                    <button 
                                        onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                                        className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-bold hover:bg-white/10 transition-all text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleStatusUpdate}
                                        className={`flex-1 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all text-sm ${
                                            confirmModal.status === 'approved' 
                                            ? 'bg-success hover:bg-success/80 shadow-success/20' 
                                            : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                        }`}
                                    >
                                        Yes, {confirmModal.status}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPackageRequests;

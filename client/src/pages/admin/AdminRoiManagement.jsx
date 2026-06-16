import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
    DollarSign, 
    Search, 
    Info,
    RefreshCcw,
    Download,
    Calendar
} from 'lucide-react';
import SetRoiModal from '../../components/SetRoiModal';

const AdminRoiManagement = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter states
    const [packages, setPackages] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedPackage, setSelectedPackage] = useState('all');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(25);

    // Debounce Logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // Reset to page 1 on search
        }, 1000);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch Packages for filtering
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/packages`);
                setPackages(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPackages();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get(`${API_URL}/api/auth/users?search=${debouncedSearch}`, config);
            const usersWithPackages = data.filter(u => u.packageId);
            setUsers(usersWithPackages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = (data) => {
        const headers = ['User Name', 'Email', 'User ID', 'Package Name', 'Price', 'Months Elapsed', 'Monthly ROI Payout', 'Registration Date'];
        const rows = data.map(u => [
            u.name || '',
            u.email || '',
            u.userId || u.referralCode || '',
            u.packageId?.packageName || '',
            u.packageId?.price || 0,
            getMonthsPassed(u.packagePurchaseDate),
            u.monthlyRoiAmount || 0,
            new Date(u.createdAt).toLocaleDateString()
        ]);
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `roi_investors_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToExcel = (data) => {
        const headers = ['User Name', 'Email', 'User ID', 'Package Name', 'Price', 'Months Elapsed', 'Monthly ROI Payout', 'Registration Date'];
        const rows = data.map(u => [
            u.name || '',
            u.email || '',
            u.userId || u.referralCode || '',
            u.packageId?.packageName || '',
            u.packageId?.price || 0,
            getMonthsPassed(u.packagePurchaseDate),
            u.monthlyRoiAmount || 0,
            new Date(u.createdAt).toLocaleDateString()
        ]);
        
        const tsvContent = [headers.join('\t'), ...rows.map(e => e.join('\t'))].join('\n');
        const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `roi_investors_${new Date().toISOString().slice(0, 10)}.xls`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        fetchUsers();
    }, [debouncedSearch, user.token]);

    const getMonthsPassed = (purchaseDate) => {
        if (!purchaseDate) return 0;
        const now = new Date();
        const start = new Date(purchaseDate);
        let months = (now.getFullYear() - start.getFullYear()) * 12;
        months += now.getMonth() - start.getMonth();
        return months;
    };

    // Filter investors based on search, package, and date range
    const filteredUsers = users.filter(u => {
        // Package filter
        if (selectedPackage !== 'all') {
            if (!u.packageId || u.packageId._id !== selectedPackage) return false;
        }

        // Date filter (using packagePurchaseDate)
        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0,0,0,0);
            if (new Date(u.packagePurchaseDate || u.createdAt) < start) return false;
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23,59,59,999);
            if (new Date(u.packagePurchaseDate || u.createdAt) > end) return false;
        }

        return true;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Search investors..."
                        className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-primary min-w-[300px] transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Date Filters, Package Filter, and Export Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 items-end">
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Purchase Start Date</label>
                    <input 
                        type="date"
                        value={startDate}
                        onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white outline-none focus:border-primary transition-all"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Purchase End Date</label>
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
                        onClick={() => exportToCSV(filteredUsers)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl transition-all"
                        title="Download CSV"
                    >
                        <Download size={14} /> CSV
                    </button>
                    <button
                        onClick={() => exportToExcel(filteredUsers)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-xl transition-all"
                        title="Download Excel"
                    >
                        <Download size={14} /> Excel
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">User</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Package Info</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Current Month</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Monthly ROI</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 text-center">ROI Decision</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr><td colSpan="5" className="px-8 py-20 text-center text-gray-500">Loading users...</td></tr>
                                ) : currentItems.length > 0 ? currentItems.map((u) => {
                                    const monthsPassed = getMonthsPassed(u.packagePurchaseDate);
                                    const isMonth8Plus = monthsPassed >= 8;
                                    const needsDecision = isMonth8Plus && !u.monthlyRoiAmount;

                                    return (
                                        <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xs">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-white text-sm font-medium">{u.name}</p>
                                                        <p className="text-gray-500 text-[10px] uppercase tracking-wider">{u.referralCode}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-primary-light text-xs font-bold uppercase">
                                                        {u.packageId.packageName}
                                                    </span>
                                                    <span className="text-gray-500 text-[10px]">
                                                        ₹{u.packageId.price.toLocaleString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                        monthsPassed >= 3 ? 'bg-success/10 text-success' : 'bg-yellow-500/10 text-yellow-500'
                                                    }`}>
                                                        Month {monthsPassed}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {u.monthlyRoiAmount > 0 ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-success font-bold font-space">₹{u.monthlyRoiAmount.toLocaleString()}</span>
                                                        <span className="text-gray-500 text-[9px] uppercase">Custom Amount</span>
                                                    </div>
                                                ) : isMonth8Plus ? (
                                                    <span className="text-red-500 text-[10px] font-bold uppercase animate-pulse">Decision Pending</span>
                                                ) : (
                                                    <span className="text-gray-500 text-[10px] italic font-medium tracking-tight">System Scheduled</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {isMonth8Plus ? (
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedUser(u);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className={`flex items-center justify-center space-x-1 mx-auto px-4 py-1.5 rounded-lg transition-all text-[10px] font-bold uppercase ${
                                                            needsDecision 
                                                            ? 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20' 
                                                            : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                                        }`}
                                                    >
                                                        <DollarSign size={12} />
                                                        <span>{needsDecision ? 'Set ROI' : 'Update ROI'}</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center">
                                                        <RefreshCcw size={10} className="mr-1 animate-spin-slow" />
                                                        Automatic
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center text-gray-500">
                                            No active investors found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {filteredUsers.length > itemsPerPage && (
                        <div className="p-4 border-t border-white/10 flex items-center justify-between">
                            <p className="text-[10px] text-gray-500">
                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} investors
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

                <div className="space-y-6">
                    <div className="glass-card p-6 bg-gradient-to-br from-card to-primary/5">
                        <h4 className="text-lg font-bold font-cormorant mb-4 flex items-center">
                            <Info className="mr-2 text-primary" size={18} />
                            How it works
                        </h4>
                        <ul className="space-y-3 text-xs text-gray-400">
                            <li className="flex items-start">
                                <div className="w-1.5 h-1.5 bg-success rounded-full mt-1 mr-2 shrink-0 shadow-sm shadow-success"></div>
                                <p><span className="text-white font-medium">Auto-Pilot:</span> From Month 3 to 7, ROI is distributed automatically by the system.</p>
                            </li>
                            <li className="flex items-start">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1 mr-2 shrink-0"></div>
                                <p><span className="text-white font-medium">8th Month+:</span> You must decide the amount. Once set, it also becomes automatic.</p>
                            </li>
                            <li className="flex items-start">
                                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-1 mr-2 shrink-0"></div>
                                <p><span className="text-white font-medium">Schedule:</span> The distribution engine runs every night at <span className="text-white font-medium">12:00 AM</span>.</p>
                            </li>
                        </ul>
                    </div>

                    <div className="glass-card p-6 border-success/20">
                        <p className="text-gray-400 text-xs mb-1">Active Investors</p>
                        <h3 className="text-2xl font-bold text-success font-space">{users.length}</h3>
                    </div>
                </div>
            </div>

            {selectedUser && (
                <SetRoiModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    user={selectedUser}
                    token={user.token}
                    onSuccess={fetchUsers}
                />
            )}
        </div>
    );
};

export default AdminRoiManagement;

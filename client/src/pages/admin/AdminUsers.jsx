import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Search, Eye, UserX, ShieldCheck, LogIn, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminUsers = () => {
    const { user: adminUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [activeTab, setActiveTab] = useState('all');

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
            setCurrentPage(1); 
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
                console.error('Error fetching packages', err);
            }
        };
        fetchPackages();
    }, []);

    const fetchUsers = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${adminUser.token}` }
            };
            const { data } = await axios.get(`${API_URL}/api/auth/users?search=${debouncedSearch}`, config);
            setUsers(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const exportToCSV = (data) => {
        const headers = ['Name', 'User ID', 'Email', 'Mobile', 'Sponsor Name', 'Sponsor Code', 'Team Members', 'Total Income', 'Status', 'Package', 'Price', 'Registration Date'];
        const rows = data.map(u => [
            u.name,
            u.userId || u.referralCode,
            u.email,
            u.mobile,
            u.referredBy?.name || 'No Sponsor',
            u.referredBy?.referralCode || 'Not Applicable',
            u.teamCount,
            u.totalIncome,
            u.isActive ? 'Active' : 'Inactive',
            u.packageId?.packageName || 'No Package',
            u.packageId?.price || 0,
            new Date(u.createdAt).toLocaleDateString()
        ]);
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `womup_users_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToExcel = (data) => {
        const headers = ['Name', 'User ID', 'Email', 'Mobile', 'Sponsor Name', 'Sponsor Code', 'Team Members', 'Total Income', 'Status', 'Package', 'Price', 'Registration Date'];
        const rows = data.map(u => [
            u.name,
            u.userId || u.referralCode,
            u.email,
            u.mobile,
            u.referredBy?.name || 'No Sponsor',
            u.referredBy?.referralCode || 'Not Applicable',
            u.teamCount,
            u.totalIncome,
            u.isActive ? 'Active' : 'Inactive',
            u.packageId?.packageName || 'No Package',
            u.packageId?.price || 0,
            new Date(u.createdAt).toLocaleDateString()
        ]);
        
        const tsvContent = [headers.join('\t'), ...rows.map(e => e.join('\t'))].join('\n');
        const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `womup_users_${new Date().toISOString().slice(0, 10)}.xls`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImpersonate = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to log in directly as ${userName}?`)) {
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${adminUser.token}` }
            };
            const { data } = await axios.post(`${API_URL}/api/auth/users/${userId}/impersonate`, {}, config);
            localStorage.setItem('userInfo', JSON.stringify(data));
            window.location.href = '/dashboard';
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Error logging in as user');
        }
    };

    const toggleUserStatus = async (userId, currentStatus) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) {
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${adminUser.token}` }
            };
            await axios.put(`${API_URL}/api/auth/users/${userId}/status`, { isActive: !currentStatus }, config);
            fetchUsers();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Error updating user status');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [debouncedSearch, adminUser.token]);

    // Tab filter counts
    const activeCount = users.filter(u => u.isActive).length;
    const inactiveCount = users.filter(u => !u.isActive).length;

    // Filter users based on search, tab, package, and date range
    const filteredUsers = users.filter(u => {
        // Tab filter
        if (activeTab === 'active' && !u.isActive) return false;
        if (activeTab === 'inactive' && u.isActive) return false;

        // Package filter
        if (selectedPackage !== 'all') {
            if (selectedPackage === 'none') {
                if (u.packageId) return false;
            } else {
                if (!u.packageId || u.packageId._id !== selectedPackage) return false;
            }
        }

        // Date filter
        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0,0,0,0);
            if (new Date(u.createdAt) < start) return false;
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23,59,59,999);
            if (new Date(u.createdAt) > end) return false;
        }

        return true;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const tabs = [
        { key: 'all',      label: 'All Users', count: users.length },
        { key: 'active',   label: 'Active',    count: activeCount },
        { key: 'inactive', label: 'Inactive',  count: inactiveCount },
    ];

    return (
        <div className="space-y-6 pb-10">
            {/* Tabs + Search row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Tabs */}
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
                            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                activeTab === tab.key
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {tab.label}
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                activeTab === tab.key
                                    ? 'bg-white/20 text-white'
                                    : tab.key === 'active'
                                    ? 'bg-green-500/20 text-green-400'
                                    : tab.key === 'inactive'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-white/10 text-gray-400'
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Search by name, email, mobile or code..."
                        className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-primary min-w-[300px] transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Date Filters, Package Filter, and Export Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end bg-white/5 p-4 rounded-2xl border border-white/10">
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
                        <option value="none" className="bg-neutral-900">No Package</option>
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

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">User Details</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Sponsor Info</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Team / Income</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Package</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="6" className="px-8 py-20 text-center text-gray-500">Loading platform users...</td></tr>
                            ) : currentItems.length > 0 ? currentItems.map((u) => (
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
                                            <span className="text-gray-300 text-xs">{u.referredBy?.name || 'No Sponsor'}</span>
                                            <span className="text-gray-500 text-[10px] uppercase">{u.referredBy?.referralCode || 'Not Applicable'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-white text-xs font-bold">{u.teamCount} Members</span>
                                            <span className="text-success text-[10px] font-space font-bold uppercase">₹{u.totalIncome.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            {u.packageId ? (
                                                <>
                                                    <span className="text-white text-xs font-medium">{u.packageId.packageName}</span>
                                                    <span className="text-primary-light text-[10px] font-bold">₹{u.packageId.price.toLocaleString()}</span>
                                                </>
                                            ) : (
                                                <span className="text-gray-500 text-xs">No Package</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col space-y-1">
                                            <div className="flex items-center space-x-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${u.isActive ? 'text-green-500' : 'text-red-500'}`}>
                                                    {u.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center space-x-2">
                                            <Link 
                                                to={`/admin/users/${u._id}`}
                                                className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-primary/20 hover:text-primary transition-all"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            {u._id !== adminUser._id && (
                                                <button 
                                                    onClick={() => handleImpersonate(u._id, u.name)}
                                                    className="p-2 bg-white/5 text-yellow-500 rounded-lg hover:bg-yellow-500/20 transition-all"
                                                    title="Login as User"
                                                >
                                                    <LogIn size={16} />
                                                </button>
                                            )}
                                            {u.role !== 'admin' && (
                                                u.isActive ? (
                                                    <button 
                                                        onClick={() => toggleUserStatus(u._id, true)}
                                                        className="p-2 bg-white/5 text-red-500 rounded-lg hover:bg-red-500/20 transition-all"
                                                        title="Deactivate User"
                                                    >
                                                        <UserX size={16} />
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => toggleUserStatus(u._id, false)}
                                                        className="p-2 bg-white/5 text-green-500 rounded-lg hover:bg-green-500/20 transition-all"
                                                        title="Activate User"
                                                    >
                                                        <ShieldCheck size={16} />
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="6" className="px-8 py-20 text-center text-gray-500">No users found on the platform.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {filteredUsers.length > itemsPerPage && (
                    <div className="p-4 border-t border-white/10 flex items-center justify-between">
                        <p className="text-[10px] text-gray-500">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
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

export default AdminUsers;

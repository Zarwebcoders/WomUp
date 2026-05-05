import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
    DollarSign, 
    Search, 
    Info,
    RefreshCcw
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

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(users.length / itemsPerPage);

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-end gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Search investors..."
                            className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-primary min-w-[280px] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
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
                    {users.length > itemsPerPage && (
                        <div className="p-4 border-t border-white/10 flex items-center justify-between">
                            <p className="text-[10px] text-gray-500">
                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, users.length)} of {users.length} investors
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

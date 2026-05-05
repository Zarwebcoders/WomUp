import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Search, Eye, UserX, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminUsers = () => {
    const { user: adminUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

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

    useEffect(() => {
        fetchUsers();
    }, [debouncedSearch, adminUser.token]);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(users.length / itemsPerPage);

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-end gap-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Search by name, email, mobile or code..."
                        className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-primary min-w-[320px] transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
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
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="5" className="px-8 py-20 text-center text-gray-500">Loading platform users...</td></tr>
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
                                        <div className="flex items-center space-x-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${u.packageId ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${u.packageId ? 'text-green-500' : 'text-red-500'}`}>
                                                {u.packageId ? 'Active' : 'Inactive'}
                                            </span>
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
                                            {u.role !== 'admin' && (
                                                <button 
                                                    className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-red-500/20 hover:text-red-500 transition-all"
                                                    title="Deactivate"
                                                >
                                                    <UserX size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className="px-8 py-20 text-center text-gray-500">No users found on the platform.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {users.length > itemsPerPage && (
                    <div className="p-4 border-t border-white/10 flex items-center justify-between">
                        <p className="text-[10px] text-gray-500">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, users.length)} of {users.length} users
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

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, User, Mail, Calendar, Eye, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get(`${API_URL}/api/auth/users?search=${searchTerm}`, config);
                setUsers(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, user.token]);

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-cormorant">User Management</h1>
                    <p className="text-gray-400 text-sm">View and manage all registered users on the platform.</p>
                </div>

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
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">User</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Contact</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Referral Code</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Joined</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="5" className="px-8 py-20 text-center text-gray-500">Loading users...</td></tr>
                            ) : users.length > 0 ? users.map((u) => (
                                <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium flex items-center">
                                                    {u.name}
                                                    {u.role === 'admin' && <Shield size={12} className="ml-1 text-yellow-500" />}
                                                </p>
                                                <p className="text-gray-500 text-xs">ID: {u.userId || u._id.substring(18).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col space-y-1">
                                            <span className="text-gray-300 text-xs flex items-center">
                                                <Mail size={12} className="mr-1 text-gray-500" /> {u.email}
                                            </span>
                                            <span className="text-gray-500 text-xs">Ph: {u.mobile}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="bg-primary/10 text-primary-light px-2 py-1 rounded text-xs font-bold">
                                            {u.referralCode}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-gray-400 text-xs">
                                            <Calendar size={12} className="mr-1" />
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => navigate(`/admin/users/${u._id}`)}
                                            className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all group"
                                            title="View Details"
                                        >
                                            <Eye size={18} className="group-hover:scale-110 transition-transform" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-gray-500">
                                        No users found.
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

export default AdminUsers;

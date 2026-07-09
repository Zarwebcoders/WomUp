import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config/api';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
    User, Mail, Phone, Lock, Calendar, Shield, 
    ArrowLeft, Users, Wallet, TrendingUp, CreditCard,
    Zap, Key, History, UserCheck, UserMinus,
    Edit, Save, X
} from 'lucide-react';

const AdminUserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: adminUser } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${adminUser.token}` }
                };
                const { data } = await axios.get(`${API_URL}/api/auth/users/${id}`, config);
                setUser(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchUserDetails();
    }, [id, adminUser.token]);

    const startEditing = () => {
        setFormData({
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            isActive: user.isActive,
            plainPassword: user.plainPassword || '',
            referralCode: user.referralCode,
            referredBy: user.referredBy?.referralCode || user.referredBy?.userId || (typeof user.referredBy === 'string' ? user.referredBy : ''),
            totalIncome: user.totalIncome || 0,
            referralIncome: user.referralIncome || 0,
            levelIncome: user.levelIncome || 0,
            roiIncome: user.roiIncome || 0,
            teamCount: user.teamCount || 0
        });
        setIsEditing(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${adminUser.token}` }
            };
            await axios.put(`${API_URL}/api/auth/users/${id}`, formData, config);
            
            // Re-fetch user details to get populated fields correctly
            const res = await axios.get(`${API_URL}/api/auth/users/${id}`, config);
            setUser(res.data);
            setIsEditing(false);
            alert('User details updated successfully!');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Error updating user details');
        }
    };

    const toggleUserStatus = async () => {
        if (!window.confirm(`Are you sure you want to ${user.isActive ? 'deactivate' : 'activate'} this user?`)) {
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${adminUser.token}` }
            };
            await axios.put(`${API_URL}/api/auth/users/${id}/status`, { isActive: !user.isActive }, config);
            
            // Re-fetch user details to get populated fields correctly
            const { data } = await axios.get(`${API_URL}/api/auth/users/${id}`, config);
            setUser(data);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Error updating user status');
        }
    };

    if (loading) return <div className="p-20 text-center text-white">Loading detailed profile...</div>;
    if (!user) return <div className="p-20 text-center text-red-500">User not found!</div>;

    if (isEditing) {
        return (
            <div className="space-y-8 pb-20">
                <div className="flex justify-between items-center">
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span>Cancel Editing</span>
                    </button>
                </div>

                <form onSubmit={handleSave} className="glass-card p-8 max-w-4xl mx-auto space-y-6 border border-white/5">
                    <div className="flex items-center space-x-3 pb-4 border-b border-white/5">
                        <Edit size={24} className="text-primary animate-pulse" />
                        <div>
                            <h2 className="text-2xl font-bold text-white font-space">Edit User Profile</h2>
                            <p className="text-sm text-gray-500">Update details for {user.name} ({user.userId})</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Basic Information</h3>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5 font-bold uppercase">Name</label>
                                <input
                                    type="text"
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-all duration-300"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5 font-bold uppercase">Email</label>
                                <input
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-all duration-300"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5 font-bold uppercase">Mobile</label>
                                <input
                                    type="text"
                                    value={formData.mobile || ''}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-all duration-300"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5 font-bold uppercase">Role</label>
                                <select
                                    value={formData.role || 'user'}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-all duration-300"
                                >
                                    <option value="user">User</option>
                                    <option value="distributer">Distributor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5 font-bold uppercase">Status</label>
                                <div className="flex items-center space-x-4 mt-2">
                                    <label className="inline-flex items-center cursor-pointer text-white">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive || false}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                        <span className="ms-3 text-sm font-medium">{formData.isActive ? 'Active' : 'Inactive'}</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Credentials & Network */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-success uppercase tracking-wider">Credentials & Network</h3>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5 font-bold uppercase">Plain Password</label>
                                <input
                                    type="text"
                                    value={formData.plainPassword || ''}
                                    onChange={(e) => setFormData({ ...formData, plainPassword: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-primary transition-all duration-300"
                                    placeholder="Enter password"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5 font-bold uppercase">Referral Code / User ID</label>
                                <input
                                    type="text"
                                    value={formData.referralCode || ''}
                                    onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-primary transition-all duration-300"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5 font-bold uppercase">Sponsor Referral ID</label>
                                <input
                                    type="text"
                                    value={formData.referredBy || ''}
                                    onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-primary transition-all duration-300"
                                    placeholder="e.g. WOM123456 (Leave blank for none)"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5 font-bold uppercase">Team Count Override</label>
                                <input
                                    type="number"
                                    value={formData.teamCount || 0}
                                    onChange={(e) => setFormData({ ...formData, teamCount: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-all duration-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Financial Metrics */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <h3 className="text-sm font-bold text-yellow-500 uppercase tracking-wider">Financial Balances (₹)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-[10px] text-gray-400 mb-1 font-bold uppercase">Total Income</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.totalIncome || 0}
                                    onChange={(e) => setFormData({ ...formData, totalIncome: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-primary transition-all duration-300"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-400 mb-1 font-bold uppercase">ROI Income</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.roiIncome || 0}
                                    onChange={(e) => setFormData({ ...formData, roiIncome: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-primary transition-all duration-300"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-400 mb-1 font-bold uppercase">Referral Income</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.referralIncome || 0}
                                    onChange={(e) => setFormData({ ...formData, referralIncome: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-primary transition-all duration-300"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-400 mb-1 font-bold uppercase">Level Income</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.levelIncome || 0}
                                    onChange={(e) => setFormData({ ...formData, levelIncome: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-primary transition-all duration-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-white/5">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold border border-white/10 text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center space-x-2"
                        >
                            <Save size={16} />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    const stats = [
        { label: 'Total Income', value: `₹${user.totalIncome.toLocaleString()}`, icon: Wallet, color: 'text-success' },
        { label: 'ROI Income', value: `₹${user.roiIncome.toLocaleString()}`, icon: TrendingUp, color: 'text-primary' },
        { label: 'Referral Income', value: `₹${user.referralIncome.toLocaleString()}`, icon: Users, color: 'text-purple-500' },
        { label: 'Level Income', value: `₹${user.levelIncome.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`, icon: Zap, color: 'text-yellow-500' },
    ];

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <button 
                    onClick={() => navigate('/admin/users')}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Users</span>
                </button>
                
                <button
                    onClick={startEditing}
                    className="flex items-center space-x-2 py-2 px-4 rounded-xl text-sm font-bold bg-primary/20 text-primary hover:bg-primary/30 border border-primary/10 transition-all"
                >
                    <Edit size={16} />
                    <span>Edit Profile</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="glass-card p-8 lg:col-span-1 space-y-6 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center font-bold text-4xl text-primary border-4 border-primary/10">
                        {user.name.charAt(0)}
                    </div>
                    <div className="text-center flex flex-col items-center space-y-2">
                        <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                        <p className="text-gray-500 text-sm">Joined on {new Date(user.createdAt).toLocaleDateString()}</p>
                        
                        <div className="flex items-center space-x-2">
                            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                <Shield size={12} />
                                <span>{user.role}</span>
                            </div>
                            <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                user.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                            }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span>{user.isActive ? 'Active' : 'Inactive'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full space-y-4 pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">System ID</span>
                            <span className="text-white font-mono">{user._id}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Email</span>
                            <span className="text-white">{user.email}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Mobile</span>
                            <span className="text-white">{user.mobile}</span>
                        </div>
                        {user.isActive && user.activatedAt && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Activated At</span>
                                <span className="text-white">{new Date(user.activatedAt).toLocaleDateString()}</span>
                            </div>
                        )}
                        {user.isActive && user.expiresAt && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Expires At</span>
                                <span className="text-white text-red-400 font-bold">{new Date(user.expiresAt).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>

                    {user.role !== 'admin' && (
                        <button
                            onClick={toggleUserStatus}
                            className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
                                user.isActive
                                ? 'bg-red-500/15 text-red-500 hover:bg-red-500/25 border border-red-500/10'
                                : 'bg-green-500/15 text-green-500 hover:bg-green-500/25 border border-green-500/10'
                            }`}
                        >
                            {user.isActive ? (
                                <>
                                    <UserMinus size={16} />
                                    <span>Deactivate Account</span>
                                </>
                            ) : (
                                <>
                                    <UserCheck size={16} />
                                    <span>Activate Account</span>
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Main Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((s, i) => (
                            <div key={i} className="glass-card p-4 space-y-2 border-white/5">
                                <div className="p-2 bg-white/5 rounded-lg w-fit">
                                    <s.icon size={16} className={s.color} />
                                </div>
                                <p className="text-gray-500 text-[10px] uppercase font-bold">{s.label}</p>
                                <p className={`text-lg font-bold font-space ${s.color}`}>{s.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Technical & Referral Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass-card p-6 space-y-6">
                            <h3 className="text-lg font-bold flex items-center space-x-2">
                                <Key size={18} className="text-primary" />
                                <span>Security & Credentials</span>
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Plain Password</span>
                                        <span className="text-sm text-yellow-500 font-mono font-bold">{user.plainPassword || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Referral Code</span>
                                        <span className="text-sm text-primary font-mono font-bold uppercase">{user.referralCode}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6 space-y-6">
                            <h3 className="text-lg font-bold flex items-center space-x-2">
                                <History size={18} className="text-primary" />
                                <span>Network & Package</span>
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                    <span className="text-xs text-gray-500">Current Package</span>
                                    <span className="text-sm text-white font-bold">{user.packageId?.packageName || 'No Active Package'}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                    <span className="text-xs text-gray-500">Sponsor</span>
                                    <div className="text-right">
                                        <p className="text-sm text-white font-bold">{user.referredBy?.name || 'Root User'}</p>
                                        <p className="text-[10px] text-gray-500">{user.referredBy?.email || '-'}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                    <span className="text-xs text-gray-500">Team Count</span>
                                    <span className="text-sm text-white font-bold">{user.teamCount} Members</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Advanced System Information - Replacing Raw JSON with Structured Cards */}
            <div className="space-y-6">
                <div className="flex items-center space-x-3">
                    <div className="h-8 w-1 bg-primary rounded-full"></div>
                    <h3 className="text-2xl font-bold text-white font-cormorant tracking-wide">System Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Security & Access Card */}
                    <div className="glass-card p-6 border-white/5 space-y-4">
                        <div className="flex items-center space-x-3 text-primary">
                            <Shield size={20} />
                            <h4 className="font-bold text-sm uppercase tracking-widest">Security & Access</h4>
                        </div>
                        <div className="space-y-3">
                            <InfoRow label="User ID" value={user?.userId} isMono />
                            <InfoRow label="Plain Password" value={user?.plainPassword} isYellow />
                            <InfoRow label="Hashed Pass" value={user?.password ? (user.password.substring(0, 20) + "...") : "N/A"} isMono />
                            <InfoRow label="Account Role" value={user?.role} isTag />
                        </div>
                    </div>

                    {/* Network & Referrals Card */}
                    <div className="glass-card p-6 border-white/5 space-y-4">
                        <div className="flex items-center space-x-3 text-success">
                            <Users size={20} />
                            <h4 className="font-bold text-sm uppercase tracking-widest">Network Context</h4>
                        </div>
                        <div className="space-y-3">
                            <InfoRow label="Referral Code" value={user.referralCode} isMono isPrimary />
                            <InfoRow label="Sponsor ID" value={user.referredBy?.userId || "None (Root)"} isMono />
                            <InfoRow label="Sponsor Name" value={user.referredBy?.name || "System"} />
                            <InfoRow label="Team Members" value={`${user.teamCount} Active`} />
                        </div>
                    </div>

                    {/* Database Metadata Card */}
                    <div className="glass-card p-6 border-white/5 space-y-4">
                        <div className="flex items-center space-x-3 text-purple-500">
                            <History size={20} />
                            <h4 className="font-bold text-sm uppercase tracking-widest">System Metadata</h4>
                        </div>
                        <div className="space-y-3">
                            {/* <InfoRow label="Object ID" value={user._id} isMono /> */}
                            <InfoRow label="Created At" value={new Date(user.createdAt).toLocaleString()} />
                            {/* <InfoRow label="Version (v)" value={user.__v} /> */}
                            {/* <InfoRow label="Package ID" value={user.packageId?._id || "Not Purchased"} isMono /> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper component for structured info rows
const InfoRow = ({ label, value, isMono, isYellow, isPrimary, isTag }) => (
    <div className="flex flex-col space-y-1 py-1 border-b border-white/[0.03] last:border-0">
        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{label}</span>
        <span className={`text-sm truncate ${
            isMono ? 'font-mono' : ''
        } ${
            isYellow ? 'text-yellow-500 font-bold' : 
            isPrimary ? 'text-primary font-bold' : 
            isTag ? 'bg-white/5 px-2 py-0.5 rounded w-fit text-[10px] uppercase font-bold text-gray-400' :
            'text-gray-300'
        }`}>
            {value || "N/A"}
        </span>
    </div>
);

export default AdminUserDetails;

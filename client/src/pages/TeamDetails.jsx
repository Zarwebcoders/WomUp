import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { motion } from 'framer-motion';
import { Users, Search, Filter, Package as PackageIcon, Lock, Unlock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const getRequiredDirects = (lvl) => {
    const l = parseInt(lvl, 10);
    if (l <= 2) return 1;
    if (l <= 4) return 2;
    if (l <= 6) return 3;
    if (l <= 8) return 4;
    if (l <= 10) return 5;
    return 5;
};

const TeamDetails = () => {
    const { user } = useAuth();
    const [activeLevel, setActiveLevel] = useState('all');
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [directCount, setDirectCount] = useState(0);
    const [maxUnlockedLevel, setMaxUnlockedLevel] = useState(10);
    const [isLevelLocked, setIsLevelLocked] = useState(false);

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get(`${API_URL}/api/referral/team/${activeLevel}?search=${searchTerm}`, config);
                
                const members = Array.isArray(data) ? data : (data.team || []);
                setTeam(members);

                if (data && typeof data === 'object' && !Array.isArray(data)) {
                    setIsLevelLocked(data.isLocked === true);
                    if (data.directCount !== undefined) {
                        setDirectCount(data.directCount);
                        setMaxUnlockedLevel(data.maxUnlockedLevel || 0);
                    }
                } else {
                    setIsLevelLocked(false);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        
        const timeoutId = setTimeout(() => {
            if (searchTerm) setLoading(true);
            fetchTeam();
        }, 500);
        
        return () => clearTimeout(timeoutId);
    }, [activeLevel, user.token, searchTerm]);

    const activeReqDirects = activeLevel !== 'all' ? getRequiredDirects(activeLevel) : 0;
    const isCurrentLevelLocked = !isAdmin && activeLevel !== 'all' && directCount < activeReqDirects;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 pb-10"
        >
            {/* Level Qualification Status Banner */}
            {!isAdmin && (
                <div className="glass-card p-5 border-white/10 bg-gradient-to-r from-card via-card to-primary/5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light shrink-0">
                                <Users size={24} />
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-lg font-bold text-white">Level Unlock Status</h2>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary-light border border-primary/30">
                                        {directCount} Active Direct{directCount === 1 ? '' : 's'}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    You have unlocked <span className="text-white font-semibold">{maxUnlockedLevel > 0 ? `Level 1 to ${maxUnlockedLevel}` : '0 Levels'}</span>.
                                    {maxUnlockedLevel < 10 && (
                                        <span className="ml-1 text-primary-light">
                                            Refer more active directs to unlock remaining levels.
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Quick Condition Pills */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                            {[
                                { lvls: 'L1 & L2', req: 1, open: directCount >= 1 },
                                { lvls: 'L3 & L4', req: 2, open: directCount >= 2 },
                                { lvls: 'L5 & L6', req: 3, open: directCount >= 3 },
                                { lvls: 'L7 & L8', req: 4, open: directCount >= 4 },
                                { lvls: 'L9 & L10', req: 5, open: directCount >= 5 },
                            ].map((rule, idx) => (
                                <div
                                    key={idx}
                                    className={`px-2.5 py-1.5 rounded-xl border flex items-center justify-between space-x-1.5 ${
                                        rule.open
                                            ? 'bg-success/10 border-success/30 text-success'
                                            : 'bg-white/5 border-white/10 text-gray-400'
                                    }`}
                                >
                                    <span className="font-bold">{rule.lvls}</span>
                                    <span className="text-[10px] flex items-center">
                                        {rule.open ? <CheckCircle size={12} className="ml-0.5" /> : <Lock size={11} className="ml-0.5 text-yellow-400" />}
                                        <span className="ml-1">{rule.req} Active Dir</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="glass-card overflow-hidden">
                <div className="p-4 md:p-6 border-b border-white/5 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search team..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-primary transition-all text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center space-x-2 w-full md:w-auto bg-white/5 p-1.5 rounded-xl border border-white/10">
                            <Filter className="text-gray-500 ml-2" size={16} />
                            <select
                                value={activeLevel}
                                onChange={(e) => setActiveLevel(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))}
                                className="bg-transparent text-gray-300 text-xs font-bold outline-none cursor-pointer pr-4 py-1.5 focus:text-white transition-all [&>option]:bg-[#0F172A] [&>option]:text-white border-0"
                            >
                                <option value="all">All Unlocked Levels</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => {
                                    const req = getRequiredDirects(level);
                                    const locked = !isAdmin && directCount < req;
                                    return (
                                        <option key={level} value={level}>
                                            Level {level} {locked ? `🔒 (${req} Active Direct Compulsory)` : '✓ Open'}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Locked Level Warning Card */}
                {(isLevelLocked || isCurrentLevelLocked) ? (
                    <div className="p-10 md:p-14 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
                            <Lock size={32} />
                        </div>
                        <div className="space-y-2 max-w-md">
                            <h3 className="text-2xl font-bold font-cormorant text-white">Level {activeLevel} is Locked</h3>
                            <p className="text-sm text-gray-400">
                                This level requires <span className="text-yellow-400 font-bold">{activeReqDirects} active direct referral{activeReqDirects === 1 ? '' : 's'} compulsory</span> to unlock and receive income.
                            </p>
                            <p className="text-xs text-gray-500">
                                You currently have <span className="text-white font-bold">{directCount}</span> active direct referral{directCount === 1 ? '' : 's'}. 
                                Refer <span className="text-primary-light font-bold">{Math.max(0, activeReqDirects - directCount)}</span> more to unlock Level {activeLevel} & its income.
                            </p>
                        </div>
                        <Link
                            to="/referral-link"
                            className="mt-2 inline-flex items-center px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs transition-all shadow-lg shadow-primary/20"
                        >
                            <span>Share Your Referral Link</span>
                            <ArrowRight size={14} className="ml-1.5" />
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="text-left text-gray-400 text-xs md:text-sm border-b border-white/5 uppercase tracking-wider">
                                    <th className="px-4 md:px-8 py-4 font-medium">User Details</th>
                                    <th className="px-4 md:px-8 py-4 font-medium">Join Date</th>
                                    <th className="px-4 md:px-8 py-4 font-medium">Level</th>
                                    <th className="px-4 md:px-8 py-4 font-medium">Package</th>
                                    <th className="px-4 md:px-8 py-4 font-medium">Income</th>
                                    <th className="px-4 md:px-8 py-4 font-medium text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {loading ? (
                                    <tr><td colSpan="6" className="px-8 py-10 text-center text-gray-500">Loading team members...</td></tr>
                                ) : team.length > 0 ? team.map((member, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-4 md:px-8 py-4 flex items-center space-x-3">
                                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xs md:text-base shrink-0">
                                                {member.name?.charAt(0) || 'U'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-white truncate">{member.name}</p>
                                                <p className="text-[10px] md:text-xs text-gray-500 truncate">{member.referralCode}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 text-gray-400 text-xs md:text-sm">
                                            {new Date(member.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 md:px-8 py-4">
                                            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-gray-300">
                                                Level {member.level}
                                            </span>
                                        </td>
                                        <td className="px-4 md:px-8 py-4">
                                            {member.packageId ? (
                                                <div className="flex items-center space-x-2 text-white text-xs md:text-sm">
                                                    <PackageIcon size={14} className="text-primary shrink-0" />
                                                    <span className="font-medium truncate">
                                                        {member.packageId.packageName}
                                                        {(member.packageQuantity || 1) > 1 && ` (x${member.packageQuantity})`}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 italic text-[10px] md:text-xs">No Package</span>
                                            )}
                                        </td>
                                        <td className="px-4 md:px-8 py-4">
                                            <p className="font-bold text-success font-space text-xs md:text-base">₹{member.incomeFromMember || 0}</p>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 text-center">
                                            <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wider ${member.isActive ? 'bg-success/10 text-success' : 'bg-red-500/10 text-red-400'
                                                }`}>
                                                {member.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-10 text-center text-gray-500">
                                            No team members found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default TeamDetails;

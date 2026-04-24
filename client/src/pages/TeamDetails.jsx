import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Search, Filter, Calendar, Package as PackageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TeamDetails = () => {
    const { user } = useAuth();
    const [activeLevel, setActiveLevel] = useState('all');
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get(`http://localhost:5001/api/referral/team/${activeLevel}?search=${searchTerm}`, config);
                setTeam(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        
        const timeoutId = setTimeout(() => {
            if (searchTerm) setLoading(true); // Only show loading for search after delay
            fetchTeam();
        }, 500);
        
        return () => clearTimeout(timeoutId);
    }, [activeLevel, user.token, searchTerm]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 pb-10"
        >
            {/* <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold font-sora">My Network</h1>
            </div> */}

            <div className="glass-card overflow-hidden">
                <div className="p-4 md:p-6 border-b border-white/5 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search team..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-primary transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap bg-white/5 p-1 rounded-xl border border-white/10 w-full md:w-auto overflow-x-auto justify-center md:justify-start">
                            <button
                                onClick={() => setActiveLevel('all')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all m-0.5 whitespace-nowrap ${activeLevel === 'all'
                                        ? 'bg-primary-gradient text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                All Levels
                            </button>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setActiveLevel(level)}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all m-0.5 ${activeLevel === level
                                            ? 'bg-primary-gradient text-white shadow-lg'
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    L{level}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="text-left text-gray-400 text-xs md:text-sm border-b border-white/5 uppercase tracking-wider">
                                <th className="px-4 md:px-8 py-4 font-medium">User Details</th>
                                <th className="px-4 md:px-8 py-4 font-medium">Join Date</th>
                                <th className="px-4 md:px-8 py-4 font-medium">Package</th>
                                <th className="px-4 md:px-8 py-4 font-medium">Income</th>
                                <th className="px-4 md:px-8 py-4 font-medium text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr><td colSpan="5" className="px-8 py-10 text-center text-gray-500">Loading team members...</td></tr>
                            ) : team.length > 0 ? team.map((member, i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-4 md:px-8 py-4 flex items-center space-x-3">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xs md:text-base shrink-0">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-white truncate">{member.name}</p>
                                            <p className="text-[10px] md:text-xs text-gray-500 truncate">{member.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-8 py-4 text-gray-400 text-xs md:text-sm">
                                        {new Date(member.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 md:px-8 py-4">
                                        {member.packageId ? (
                                            <div className="flex items-center space-x-2 text-white text-xs md:text-sm">
                                                <PackageIcon size={14} className="text-primary shrink-0" />
                                                <span className="font-medium truncate">{member.packageId.packageName}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500 italic text-[10px] md:text-xs">No Package</span>
                                        )}
                                    </td>
                                    <td className="px-4 md:px-8 py-4">
                                        <p className="font-bold text-success font-space text-xs md:text-base">₹{member.totalIncome || 0}</p>
                                    </td>
                                    <td className="px-4 md:px-8 py-4 text-center">
                                        <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wider ${member.packageId ? 'bg-success/10 text-success' : 'bg-red-500/10 text-red-400'
                                            }`}>
                                            {member.packageId ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-10 text-center text-gray-500">
                                        No team members found.
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

export default TeamDetails;

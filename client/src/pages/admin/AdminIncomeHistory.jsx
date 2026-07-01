import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { Search, Download, TrendingUp, HandCoins, Layers, CircleDollarSign, Filter } from 'lucide-react';

const TYPE_CONFIG = {
    all:      { label: 'All Income',      color: 'text-white',        bg: 'bg-white/10',        border: 'border-white/20'        },
    referral: { label: 'Referral Income', color: 'text-yellow-400',   bg: 'bg-yellow-500/10',   border: 'border-yellow-500/20'   },
    level:    { label: 'Level Income',    color: 'text-blue-400',     bg: 'bg-blue-500/10',     border: 'border-blue-500/20'     },
    roi:      { label: 'ROI Income',      color: 'text-emerald-400',  bg: 'bg-emerald-500/10',  border: 'border-emerald-500/20'  },
};

const TypeBadge = ({ type }) => {
    const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.all;
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
            {type}
        </span>
    );
};

const AdminIncomeHistory = () => {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm]     = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [typeFilter, setTypeFilter]     = useState('all');
    const [startDate, setStartDate]       = useState('');
    const [endDate, setEndDate]           = useState('');

    // Pagination
    const [currentPage, setCurrentPage]   = useState(1);
    const ITEMS_PER_PAGE = 50;

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => { setDebouncedSearch(searchTerm); setCurrentPage(1); }, 700);
        return () => clearTimeout(t);
    }, [searchTerm]);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (typeFilter !== 'all') params.set('type', typeFilter);
            if (debouncedSearch)      params.set('search', debouncedSearch);
            if (startDate)            params.set('startDate', startDate);
            if (endDate)              params.set('endDate', endDate);

            const { data } = await axios.get(`${API_URL}/api/income/admin/all?${params}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setLogs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user.token, typeFilter, debouncedSearch, startDate, endDate]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    const toggleVisibility = async (id) => {
        try {
            const res = await axios.patch(`${API_URL}/api/income/admin/toggle-visibility/${id}`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setLogs(prev => prev.map(l => l._id === id ? { ...l, showToUser: res.data.income.showToUser } : l));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Error toggling visibility');
        }
    };

    // Reset page when filters change
    useEffect(() => { setCurrentPage(1); }, [typeFilter, startDate, endDate]);

    // Summary stats
    const totalAmount   = logs.reduce((s, l) => s + l.amount, 0);
    const referralTotal = logs.filter(l => l.incomeType === 'referral').reduce((s, l) => s + l.amount, 0);
    const levelTotal    = logs.filter(l => l.incomeType === 'level').reduce((s, l) => s + l.amount, 0);
    const roiTotal      = logs.filter(l => l.incomeType === 'roi').reduce((s, l) => s + l.amount, 0);

    // Pagination
    const totalPages     = Math.ceil(logs.length / ITEMS_PER_PAGE);
    const paginated      = logs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // CSV export
    const exportCSV = () => {
        const headers = ['Date', 'Recipient Name', 'Recipient ID', 'Income Type', 'Amount (₹)', 'From User', 'From ID', 'Level'];
        const rows = logs.map(l => [
            new Date(l.createdAt).toLocaleString(),
            l.userId?.name || '-',
            l.userId?.userId || l.userId?.referralCode || '-',
            l.incomeType,
            l.amount,
            l.fromUser?.name || '-',
            l.fromUser?.userId || l.fromUser?.referralCode || '-',
            l.level || '-'
        ]);
        const csv = "data:text/csv;charset=utf-8," +
            [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
        const a = document.createElement('a');
        a.href = encodeURI(csv);
        a.download = `income_history_${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
    };

    const pageNums = () => {
        if (totalPages <= 7) return [...Array(totalPages)].map((_, i) => i + 1);
        if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
        if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Paid Out', amount: totalAmount,   icon: TrendingUp,        color: 'text-white',       glow: 'shadow-white/5'        },
                    { label: 'Referral',        amount: referralTotal, icon: HandCoins,         color: 'text-yellow-400',  glow: 'shadow-yellow-500/10'  },
                    { label: 'Level',           amount: levelTotal,    icon: Layers,            color: 'text-blue-400',    glow: 'shadow-blue-500/10'    },
                    { label: 'ROI',             amount: roiTotal,      icon: CircleDollarSign,  color: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
                ].map(({ label, amount, icon: Icon, color, glow }) => (
                    <div key={label} className={`glass-card p-5 flex items-center space-x-4 shadow-lg ${glow}`}>
                        <div className={`p-3 rounded-xl bg-white/5 ${color}`}><Icon size={20} /></div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{label}</p>
                            <p className={`text-lg font-bold font-space ${color}`}>₹{amount.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters Row */}
            <div className="glass-card p-4 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[220px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by name, email, WOM ID..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white outline-none focus:border-primary transition-all"
                        />
                    </div>

                    {/* Type Filter Tabs */}
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 gap-0.5">
                        {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                            <button
                                key={key}
                                onClick={() => setTypeFilter(key)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                    typeFilter === key
                                        ? `bg-primary text-white shadow-lg shadow-primary/20`
                                        : 'text-gray-500 hover:text-white'
                                }`}
                            >
                                {cfg.label}
                            </button>
                        ))}
                    </div>

                    {/* Export */}
                    <button
                        onClick={exportCSV}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl transition-all"
                    >
                        <Download size={14} /> Export CSV
                    </button>
                </div>

                {/* Date Range */}
                <div className="flex flex-wrap items-center gap-3">
                    <Filter size={14} className="text-gray-400" />
                    <div className="flex items-center gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">From</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-primary transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">To</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-primary transition-all"
                        />
                    </div>
                    {(startDate || endDate || typeFilter !== 'all' || debouncedSearch) && (
                        <button
                            onClick={() => { setStartDate(''); setEndDate(''); setTypeFilter('all'); setSearchTerm(''); }}
                            className="text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors underline"
                        >
                            Clear Filters
                        </button>
                    )}
                    <span className="ml-auto text-[10px] text-gray-500 font-bold">
                        {loading ? 'Loading...' : `${logs.length} record${logs.length !== 1 ? 's' : ''} found`}
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-5 py-4 text-xs font-bold uppercase text-gray-400">#</th>
                                <th className="px-5 py-4 text-xs font-bold uppercase text-gray-400">Date & Time</th>
                                <th className="px-5 py-4 text-xs font-bold uppercase text-gray-400">Recipient</th>
                                <th className="px-5 py-4 text-xs font-bold uppercase text-gray-400">Type</th>
                                <th className="px-5 py-4 text-xs font-bold uppercase text-gray-400">Amount</th>
                                <th className="px-5 py-4 text-xs font-bold uppercase text-gray-400">From User</th>
                                <th className="px-5 py-4 text-xs font-bold uppercase text-gray-400 text-center">Level</th>
                                <th className="px-5 py-4 text-xs font-bold uppercase text-gray-400 text-center">Show to User</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-8 py-20 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            <span>Loading income records...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginated.length > 0 ? paginated.map((log, idx) => (
                                <tr key={log._id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-5 py-3.5 text-[10px] text-gray-600 font-mono">
                                        {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex flex-col">
                                            <span className="text-white text-xs">{new Date(log.createdAt).toLocaleDateString('en-IN')}</span>
                                            <span className="text-gray-500 text-[10px]">{new Date(log.createdAt).toLocaleTimeString('en-IN')}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex flex-col">
                                            <span className="text-white text-xs font-medium">{log.userId?.name || '—'}</span>
                                            <span className="text-primary-light text-[10px] font-bold uppercase">
                                                {log.userId?.userId || log.userId?.referralCode || '—'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <TypeBadge type={log.incomeType} />
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-emerald-400 font-bold font-space text-sm">
                                            ₹{log.amount.toLocaleString('en-IN')}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        {log.fromUser ? (
                                            <div className="flex flex-col">
                                                <span className="text-gray-300 text-xs">{log.fromUser.name}</span>
                                                <span className="text-gray-500 text-[10px] uppercase">
                                                    {log.fromUser.userId || log.fromUser.referralCode}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-600 text-xs">System</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        {log.level ? (
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                                                {log.level}
                                            </span>
                                        ) : (
                                            <span className="text-gray-600 text-xs">—</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                checked={log.showToUser !== false}
                                                onChange={() => toggleVisibility(log._id)} 
                                            />
                                            <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="px-8 py-20 text-center text-gray-500">
                                        No income records found for the selected filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
                        <p className="text-[10px] text-gray-500">
                            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, logs.length)} of {logs.length} records
                        </p>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                Prev
                            </button>
                            {pageNums().map((n, i) =>
                                n === '...' ? (
                                    <span key={`ellipsis-${i}`} className="text-gray-600 text-xs px-1">…</span>
                                ) : (
                                    <button
                                        key={n}
                                        onClick={() => setCurrentPage(n)}
                                        className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${
                                            currentPage === n
                                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        {n}
                                    </button>
                                )
                            )}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
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

export default AdminIncomeHistory;

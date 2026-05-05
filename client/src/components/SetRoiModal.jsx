import React, { useState } from 'react';
import { X, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config/api';

const SetRoiModal = ({ isOpen, onClose, user, token, onSuccess }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const pkgPrice = user.packageId?.price || 0;
    const minAmount = pkgPrice === 111000 ? 10000 : 4000;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (Number(amount) < minAmount) {
            setError(`Minimum ROI for this package is ₹${minAmount}`);
            return;
        }

        if (!confirming) {
            setConfirming(true);
            return;
        }

        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            await axios.post(`${API_URL}/api/roi/set-custom-roi`, { 
                userId: user._id, 
                amount: Number(amount) 
            }, config);
            
            onSuccess();
            onClose();
            setConfirming(false);
            setAmount('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error setting ROI');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="glass-card w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-xl font-bold font-cormorant flex items-center">
                        <DollarSign className="mr-2 text-primary" size={20} />
                        Set Monthly ROI
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
                        <p className="text-sm text-gray-400">Setting ROI for:</p>
                        <p className="text-lg font-bold text-white">{user.name}</p>
                        <p className="text-xs text-primary-light uppercase tracking-widest mt-1">
                            {user.packageId?.packageName} - ₹{pkgPrice.toLocaleString()}
                        </p>
                    </div>

                    {!confirming ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Decide Monthly ROI Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                    <input 
                                        type="number"
                                        required
                                        autoFocus
                                        placeholder={`Min ₹${minAmount}`}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white outline-none focus:border-primary transition-all"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1 italic">
                                    * This user has reached month 8+. Setting this will continue for all future months.
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-start space-x-2">
                                    <AlertCircle className="text-red-500 shrink-0" size={16} />
                                    <p className="text-xs text-red-500">{error}</p>
                                </div>
                            )}

                            <button 
                                type="submit"
                                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20"
                            >
                                Decide Income
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6 text-center py-4">
                            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
                                <AlertCircle className="text-yellow-500" size={32} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white mb-2">Are you sure?</h4>
                                <p className="text-sm text-gray-400">
                                    You are setting a monthly ROI of <span className="text-success font-bold text-lg mx-1">₹{Number(amount).toLocaleString()}</span> for {user.name}.
                                </p>
                            </div>

                            <div className="flex space-x-3">
                                <button 
                                    onClick={() => setConfirming(false)}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-all"
                                >
                                    No, Change
                                </button>
                                <button 
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-1 py-3 bg-success hover:bg-success-dark text-white rounded-xl font-bold transition-all flex items-center justify-center"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="mr-2" size={18} />
                                            Yes, Confirm
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SetRoiModal;

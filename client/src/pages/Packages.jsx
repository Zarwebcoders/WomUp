import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Shield, Zap, Diamond, Star, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Packages = () => {
    const { user } = useAuth();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(false);
    const [message, setMessage] = useState('');
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPkg, setSelectedPkg] = useState(null);
    const [transactionId, setTransactionId] = useState('');
    const [transactionSlip, setTransactionSlip] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/packages`);
                setPackages(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    const handleBuyClick = (pkg) => {
        setSelectedPkg(pkg);
        setIsModalOpen(true);
        setMessage('');
        setPreview(null);
        setTransactionSlip(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTransactionSlip(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        if (!transactionId || !transactionSlip) {
            return setMessage({ type: 'error', text: 'All fields are required' });
        }

        setBuying(true);
        const formData = new FormData();
        formData.append('packageId', selectedPkg._id);
        formData.append('transactionId', transactionId);
        formData.append('transactionSlip', transactionSlip);

        try {
            const config = {
                headers: { 
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
            const { data } = await axios.post(`${API_URL}/api/packages/buy`, formData, config);
            setMessage({ type: 'success', text: data.message });
            setIsModalOpen(false);
            setTransactionId('');
            setTransactionSlip(null);
            setBuying(false);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Submission failed' });
            setBuying(false);
        }
    };

    if (loading) return <div className="text-white">Loading packages...</div>;

    const getIcon = (name) => {
        switch(name) {
            case 'Standard': return <Star className="text-gray-300" size={32} />;
            case 'Premium': return <Diamond className="text-primary-light" size={32} />;
            default: return <Zap size={32} />;
        }
    };

    return (
        <>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12 pb-10"
            >
                {/* <div className="text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4 font-cormorant">Investment Packages</h1>
                    <p className="text-gray-400">Choose the perfect plan to accelerate your earnings and be part of the WOMUP revolution.</p>
                </div> */}

                {message && (
                    <div className={`max-w-md mx-auto p-4 rounded-xl text-center flex items-center justify-center space-x-2 border ${
                        message.type === 'success' ? 'bg-success/10 border-success/20 text-success' : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                        {message.type === 'error' && <AlertCircle size={20} />}
                        <span className="font-medium">{message.text}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {packages.map((pkg, index) => (
                        <motion.div 
                            key={pkg._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`glass-card p-10 flex flex-col relative overflow-hidden group hover:border-primary/50 transition-all ${
                                user.packageId?._id === pkg._id ? 'border-primary shadow-[0_0_30px_rgba(173,73,225,0.15)]' : ''
                            }`}
                        >
                            {user.packageId?._id === pkg._id && (
                                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">Current</div>
                            )}
                            
                            <div className="mb-8 p-4 bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                                {getIcon(pkg.packageName)}
                            </div>

                            <h3 className="text-2xl font-bold mb-2 font-cormorant">{pkg.packageName} Package</h3>
                            <div className="flex items-baseline mb-8">
                                <span className="text-5xl font-bold font-space">₹{pkg.price.toLocaleString()}</span>
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                <li className="flex items-start text-sm text-gray-300">
                                    <Check size={16} className="text-success mr-3 shrink-0 mt-0.5" />
                                    <span><b>10 Level</b> Referral Income (Fixed)</span>
                                </li>
                                <li className="flex items-start text-sm text-gray-300">
                                    <Check size={16} className="text-success mr-3 shrink-0 mt-0.5" />
                                    <span><b>10 Level</b> Level Income (Percentage)</span>
                                </li>
                                <li className="flex items-start text-sm text-gray-300">
                                    <Check size={16} className="text-success mr-3 shrink-0 mt-0.5" />
                                    <span><b>Guaranteed ROI</b> starting from 3rd month</span>
                                </li>
                                <li className="flex items-start text-sm text-gray-300">
                                    <Check size={16} className="text-success mr-3 shrink-0 mt-0.5" />
                                    <span>Maximum payout from 8th month onwards</span>
                                </li>
                                <li className="flex items-start text-sm text-gray-300">
                                    <Check size={16} className="text-success mr-3 shrink-0 mt-0.5" />
                                    <span>Priority 24/7 Premium Support</span>
                                </li>
                            </ul>

                            <button 
                                onClick={() => handleBuyClick(pkg)}
                                disabled={buying || user.packageId}
                                className={`w-full py-4 rounded-xl font-bold transition-all ${
                                    user.packageId 
                                    ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                                    : 'bg-primary-gradient hover:shadow-lg hover:shadow-primary/20 text-white'
                                }`}
                            >
                                {user.packageId?._id === pkg._id ? 'Active' : user.packageId ? 'Purchased' : 'Purchase Package'}
                            </button>
                        </motion.div>
                    ))}
                </div>

                <div className="glass-card p-10 bg-gradient-to-r from-card to-primary/5 text-center border-white/5">
                    <h3 className="text-2xl font-bold mb-2 font-cormorant">Need a custom plan?</h3>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">Contact our sales team for institutional investment options and dedicated account management.</p>
                    <button className="px-8 py-3 bg-white/5 rounded-xl text-primary font-bold hover:bg-white/10 transition-all border border-white/5">Contact Support</button>
                </div>
            </motion.div>

            {/* Purchase Modal - Now outside the main motion.div for perfect fixed positioning */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="glass-card p-8 w-full max-w-lg relative border-primary/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                        >
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-bold mb-2 font-cormorant">Complete Purchase</h2>
                            <p className="text-gray-400 text-sm mb-8">
                                Please pay <span className="text-white font-bold">₹{selectedPkg.price.toLocaleString()}</span> to the company account and upload your transaction details for verification.
                            </p>

                            <form onSubmit={handleSubmitRequest} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Transaction ID / UTR</label>
                                    <input 
                                        type="text"
                                        required
                                        placeholder="Enter your Transaction ID"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary transition-all"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Upload Transaction Slip</label>
                                    <div className="relative">
                                        <input 
                                            type="file"
                                            required
                                            accept="image/*"
                                            className="hidden"
                                            id="slip-upload"
                                            onChange={handleFileChange}
                                        />
                                        <label 
                                            htmlFor="slip-upload"
                                            className={`w-full flex flex-col items-center justify-center space-y-3 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 hover:border-primary/30 transition-all overflow-hidden ${preview ? 'p-2' : 'p-10'}`}
                                        >
                                            {preview ? (
                                                <div className="relative w-full aspect-video rounded-xl overflow-hidden group">
                                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <p className="text-white text-xs font-bold">Change Image</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="p-3 bg-primary/10 rounded-full">
                                                        <Zap size={28} className="text-primary" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-white font-medium">Click to select image</p>
                                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG or PDF up to 5MB</p>
                                                    </div>
                                                </>
                                            )}
                                        </label>
                                        {transactionSlip && !preview && (
                                            <p className="text-xs text-gray-400 mt-2 text-center">Selected: {transactionSlip.name}</p>
                                        )}
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={buying}
                                    className="w-full gradient-btn py-4 font-bold text-lg shadow-xl shadow-primary/20"
                                >
                                    {buying ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Submitting...</span>
                                        </div>
                                    ) : 'Submit Payment Request'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Packages;

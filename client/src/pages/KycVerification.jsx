import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
    User, 
    CreditCard, 
    FileText, 
    Briefcase, 
    Upload, 
    ArrowRight, 
    CheckCircle, 
    AlertTriangle,
    Eye
} from 'lucide-react';

const KycVerification = () => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [kycStatus, setKycStatus] = useState('unsubmitted');
    const [rejectReason, setRejectReason] = useState('');
    const [message, setMessage] = useState('');

    // Form Fields State
    const [aadharNumber, setAadharNumber] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [bankHolderName, setBankHolderName] = useState('');
    const [bankName, setBankName] = useState('');
    const [bankAccountNumber, setBankAccountNumber] = useState('');
    const [bankIfscCode, setBankIfscCode] = useState('');

    // Document Files State
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [aadharFront, setAadharFront] = useState(null);
    const [aadharBack, setAadharBack] = useState(null);
    const [panCardPhoto, setPanCardPhoto] = useState(null);
    const [bankPassbookPhoto, setBankPassbookPhoto] = useState(null);

    // Previews State
    const [previews, setPreviews] = useState({
        profilePhoto: null,
        aadharFront: null,
        aadharBack: null,
        panCardPhoto: null,
        bankPassbookPhoto: null
    });

    useEffect(() => {
        fetchKycStatus();
    }, [user.token]);

    const fetchKycStatus = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            // PERF: /api/kyc/status returns ONLY text metadata (~200 bytes).
            // Images are fetched separately via fetchKycImages() to avoid
            // blocking the page load on a potentially 10MB Base64 payload.
            const { data } = await axios.get(`${API_URL}/api/kyc/status`, config);
            if (data) {
                setKycStatus(data.status || 'unsubmitted');
                setRejectReason(data.rejectReason || '');

                // Pre-populate text fields if already submitted
                if (data.status && data.status !== 'unsubmitted') {
                    setAadharNumber(data.aadharNumber || '');
                    setPanNumber(data.panNumber || '');
                    setBankHolderName(data.bankHolderName || '');
                    setBankName(data.bankName || '');
                    setBankAccountNumber(data.bankAccountNumber || '');
                    setBankIfscCode(data.bankIfscCode || '');

                    // Lazily fetch document image previews after text fields are set
                    fetchKycImages(config);
                }
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching KYC status:', err);
            setLoading(false);
        }
    };

    // Fetches only the 5 Base64 image fields — called lazily after status is known.
    // Runs in the background; the page is already interactive by this point.
    const fetchKycImages = async (config) => {
        try {
            const { data } = await axios.get(`${API_URL}/api/kyc/images`, config);
            if (data) {
                setPreviews({
                    profilePhoto: data.profilePhoto || null,
                    aadharFront: data.aadharFront || null,
                    aadharBack: data.aadharBack || null,
                    panCardPhoto: data.panCardPhoto || null,
                    bankPassbookPhoto: data.bankPassbookPhoto || null
                });
            }
        } catch (err) {
            // Non-fatal: previews just won't show, user can still re-upload
            console.warn('Could not load KYC image previews:', err);
        }
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            // Client-side size validation (2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                setMessage({ type: 'error', text: `Image too large. Please upload an image under 2MB.` });
                e.target.value = '';
                return;
            }
            setMessage(''); // clear any previous error
            if (field === 'profilePhoto') setProfilePhoto(file);
            if (field === 'aadharFront') setAadharFront(file);
            if (field === 'aadharBack') setAadharBack(file);
            if (field === 'panCardPhoto') setPanCardPhoto(file);
            if (field === 'bankPassbookPhoto') setBankPassbookPhoto(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({
                    ...prev,
                    [field]: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setMessage('');

        const formData = new FormData();
        formData.append('aadharNumber', aadharNumber);
        formData.append('panNumber', panNumber);
        formData.append('bankHolderName', bankHolderName);
        formData.append('bankName', bankName);
        formData.append('bankAccountNumber', bankAccountNumber);
        formData.append('bankIfscCode', bankIfscCode);

        if (profilePhoto) formData.append('profilePhoto', profilePhoto);
        if (aadharFront) formData.append('aadharFront', aadharFront);
        if (aadharBack) formData.append('aadharBack', aadharBack);
        if (panCardPhoto) formData.append('panCardPhoto', panCardPhoto);
        if (bankPassbookPhoto) formData.append('bankPassbookPhoto', bankPassbookPhoto);

        try {
            const config = {
                headers: { 
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
            await axios.post(`${API_URL}/api/kyc/submit`, formData, config);
            setKycStatus('pending');
            setMessage({ type: 'success', text: 'KYC documents uploaded successfully!' });
            fetchKycStatus();
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: err.response?.data?.message || 'KYC submission failed.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-white text-center py-20">Loading KYC Verification...</div>;
    }

    const steps = [
        { id: 1, label: 'Profile', icon: User },
        { id: 2, label: 'Aadhar', icon: CreditCard },
        { id: 3, label: 'PAN Card', icon: FileText },
        { id: 4, label: 'Bank Details', icon: Briefcase }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            {/* Title & Info */}
            <div>
                <h1 className="text-4xl font-bold font-cormorant bg-primary-gradient bg-clip-text text-transparent">
                    KYC Verification
                </h1>
                <p className="text-gray-400 text-sm mt-2">
                    Complete your identity verification to unlock full platform access and secure your account.
                </p>
            </div>

            {/* KYC State Banner */}
            {kycStatus === 'pending' && (
                <div className="flex items-center space-x-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-4 rounded-xl">
                    <CheckCircle size={20} className="shrink-0" />
                    <div>
                        <p className="font-bold text-sm">KYC Submission Pending</p>
                        <p className="text-xs text-yellow-500/80">Your documents are under review. This usually takes 24-48 hours.</p>
                    </div>
                </div>
            )}

            {kycStatus === 'approved' && (
                <div className="flex items-center space-x-3 bg-success/10 border border-success/20 text-success p-4 rounded-xl">
                    <CheckCircle size={20} className="shrink-0" />
                    <div>
                        <p className="font-bold text-sm">KYC Approved</p>
                        <p className="text-xs text-success/80">Your account is fully verified.</p>
                    </div>
                </div>
            )}

            {kycStatus === 'rejected' && (
                <div className="flex flex-col space-y-2 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
                    <div className="flex items-center space-x-3">
                        <AlertTriangle size={20} className="shrink-0" />
                        <p className="font-bold text-sm">KYC Rejected</p>
                    </div>
                    <p className="text-xs ml-8 text-red-400/80">Reason: {rejectReason}</p>
                    <button 
                        onClick={() => { setKycStatus('unsubmitted'); setStep(1); }}
                        className="ml-8 w-fit px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-xs font-bold transition-all text-red-300 mt-2"
                    >
                        Re-submit KYC Documents
                    </button>
                </div>
            )}

            {message && (
                <div className={`p-4 rounded-xl text-center border text-sm font-medium ${
                    message.type === 'success' ? 'bg-success/10 border-success/20 text-success' : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                    {message.text}
                </div>
            )}

            {kycStatus === 'unsubmitted' && (
                <>
                    {/* Steps Indicator */}
                    <div className="flex items-center justify-center space-x-4 max-w-2xl mx-auto">
                        {steps.map((s, index) => (
                            <React.Fragment key={s.id}>
                                <div className="flex flex-col items-center space-y-2 relative">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                                        step === s.id 
                                        ? 'bg-primary-gradient border-primary text-white shadow-lg shadow-primary/20 scale-110' 
                                        : step > s.id 
                                        ? 'bg-success/10 border-success text-success' 
                                        : 'bg-white/5 border-white/10 text-gray-500'
                                    }`}>
                                        <s.icon size={20} />
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                        step === s.id ? 'text-white' : 'text-gray-500'
                                    }`}>{s.label}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-0.5 max-w-[80px] rounded transition-all ${
                                        step > s.id ? 'bg-success' : 'bg-white/10'
                                    }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Step Content */}
                    <div className="glass-card p-8 min-h-[350px] relative flex flex-col justify-between">
                        <div>
                            {/* STEP 1: Profile Photo */}
                            {step === 1 && (
                                <div className="space-y-6 text-center">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Upload Profile Photo</h3>
                                        <p className="text-xs text-gray-500 mt-1">Please provide a clear, recent photo of yourself for your profile.</p>
                                    </div>
                                    <div className="flex justify-center">
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            id="profile-upload"
                                            onChange={(e) => handleFileChange(e, 'profilePhoto')}
                                        />
                                        <label 
                                            htmlFor="profile-upload"
                                            className="w-48 h-48 rounded-full border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all overflow-hidden relative group"
                                        >
                                            {previews.profilePhoto ? (
                                                <>
                                                    <img src={previews.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                        <span className="text-[10px] font-bold text-white uppercase">Change Photo</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center space-y-2">
                                                    <div className="p-3 bg-white/5 rounded-full text-gray-400">
                                                        <Upload size={24} />
                                                    </div>
                                                    <span className="text-xs text-gray-400 font-medium">Upload Photo</span>
                                                    <span className="text-[9px] text-gray-600">JPG, PNG • Max 5MB</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: Aadhar Card */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-white">Aadhar Card Verification</h3>
                                        <p className="text-xs text-gray-500 mt-1">Provide your Aadhar number and upload clear photos of both sides.</p>
                                    </div>
                                    <div className="max-w-md mx-auto space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Aadhar Card Number</label>
                                            <input 
                                                type="text" 
                                                maxLength="12"
                                                placeholder="Enter 12-digit Aadhar Number"
                                                value={aadharNumber}
                                                onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, ''))}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary text-sm font-mono tracking-widest"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Front Side */}
                                            <div>
                                                <span className="block text-[9px] font-bold uppercase text-gray-500 mb-2">Front Side</span>
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="hidden" 
                                                    id="aadhar-front-upload"
                                                    onChange={(e) => handleFileChange(e, 'aadharFront')}
                                                />
                                                <label 
                                                    htmlFor="aadhar-front-upload"
                                                    className="aspect-video w-full border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all overflow-hidden relative group"
                                                >
                                                    {previews.aadharFront ? (
                                                        <>
                                                            <img src={previews.aadharFront} alt="Aadhar Front" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                                <span className="text-[10px] font-bold text-white">Change File</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex flex-col items-center text-center p-4 space-y-1 text-gray-400">
                                                            <Upload size={18} />
                                                            <span className="text-[10px] font-medium">Upload Front</span>
                                                        </div>
                                                    )}
                                                </label>
                                            </div>

                                            {/* Back Side */}
                                            <div>
                                                <span className="block text-[9px] font-bold uppercase text-gray-500 mb-2">Back Side</span>
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="hidden" 
                                                    id="aadhar-back-upload"
                                                    onChange={(e) => handleFileChange(e, 'aadharBack')}
                                                />
                                                <label 
                                                    htmlFor="aadhar-back-upload"
                                                    className="aspect-video w-full border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all overflow-hidden relative group"
                                                >
                                                    {previews.aadharBack ? (
                                                        <>
                                                            <img src={previews.aadharBack} alt="Aadhar Back" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                                <span className="text-[10px] font-bold text-white">Change File</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex flex-col items-center text-center p-4 space-y-1 text-gray-400">
                                                            <Upload size={18} />
                                                            <span className="text-[10px] font-medium">Upload Back</span>
                                                        </div>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: PAN Card */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-white">PAN Card Verification</h3>
                                        <p className="text-xs text-gray-500 mt-1">Provide your 10-character alphanumeric PAN Card details.</p>
                                    </div>
                                    <div className="max-w-md mx-auto space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">PAN Card Number</label>
                                            <input 
                                                type="text" 
                                                maxLength="10"
                                                placeholder="Enter PAN Number (e.g. ABCDE1234F)"
                                                value={panNumber}
                                                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary text-sm font-mono tracking-widest"
                                            />
                                        </div>
                                        <div>
                                            <span className="block text-[9px] font-bold uppercase text-gray-500 mb-2">PAN Card Photo</span>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                className="hidden" 
                                                id="pan-upload"
                                                onChange={(e) => handleFileChange(e, 'panCardPhoto')}
                                            />
                                            <label 
                                                htmlFor="pan-upload"
                                                className="aspect-video w-full max-w-sm mx-auto border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all overflow-hidden relative group"
                                            >
                                                {previews.panCardPhoto ? (
                                                    <>
                                                        <img src={previews.panCardPhoto} alt="PAN Card" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                            <span className="text-[10px] font-bold text-white">Change File</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center text-center p-6 space-y-2 text-gray-400">
                                                        <Upload size={20} />
                                                        <span className="text-xs font-medium">Upload PAN Card Image</span>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: Bank Details */}
                            {step === 4 && (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-white">Bank Account Details</h3>
                                        <p className="text-xs text-gray-500 mt-1">Provide your bank credentials and upload a passbook or cancelled cheque image.</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5">Account Holder Name</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter Holder Name"
                                                    value={bankHolderName}
                                                    onChange={(e) => setBankHolderName(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5">Bank Name</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter Bank Name"
                                                    value={bankName}
                                                    onChange={(e) => setBankName(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5">Account Number</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter Account Number"
                                                    value={bankAccountNumber}
                                                    onChange={(e) => setBankAccountNumber(e.target.value.replace(/\D/g, ''))}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-primary font-mono"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5">IFSC Code</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter IFSC Code"
                                                    value={bankIfscCode}
                                                    onChange={(e) => setBankIfscCode(e.target.value.toUpperCase())}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-primary font-mono uppercase"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <span className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Passbook / Cancelled Cheque Photo</span>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                className="hidden" 
                                                id="bank-photo-upload"
                                                onChange={(e) => handleFileChange(e, 'bankPassbookPhoto')}
                                            />
                                            <label 
                                                htmlFor="bank-photo-upload"
                                                className="aspect-square w-full border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all overflow-hidden relative group"
                                            >
                                                {previews.bankPassbookPhoto ? (
                                                    <>
                                                        <img src={previews.bankPassbookPhoto} alt="Bank Document" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                            <span className="text-[10px] font-bold text-white">Change File</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center text-center p-6 space-y-2 text-gray-400">
                                                        <Upload size={24} />
                                                        <span className="text-xs font-medium">Upload Document</span>
                                                        <span className="text-[9px] text-gray-600">Passbook photo or Cancelled Cheque</span>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation Row */}
                        <div className="flex items-center justify-between mt-10 pt-4 border-t border-white/5">
                            <button
                                onClick={() => setStep(prev => Math.max(prev - 1, 1))}
                                disabled={step === 1}
                                className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Previous Step
                            </button>
                            {step < 4 ? (
                                <button
                                    onClick={() => setStep(prev => Math.min(prev + 1, 4))}
                                    disabled={
                                        (step === 1 && !previews.profilePhoto) ||
                                        (step === 2 && (!aadharNumber || aadharNumber.length !== 12 || !previews.aadharFront || !previews.aadharBack)) ||
                                        (step === 3 && (!panNumber || panNumber.length !== 10 || !previews.panCardPhoto))
                                    }
                                    className="px-6 py-2.5 bg-primary-gradient text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-primary/20 flex items-center space-x-1.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <span>Next Step</span>
                                    <ArrowRight size={14} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={
                                        submitting || 
                                        !bankHolderName || 
                                        !bankName || 
                                        !bankAccountNumber || 
                                        !bankIfscCode || 
                                        !previews.bankPassbookPhoto
                                    }
                                    className="px-8 py-2.5 bg-success text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-success/20 flex items-center space-x-1.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Submitting...</span>
                                        </div>
                                    ) : (
                                        <span>Submit KYC</span>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default KycVerification;

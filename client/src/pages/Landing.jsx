import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    Building2, Users, PieChart, TrendingUp, ShieldCheck, CheckCircle2, 
    ArrowRight, Store, Settings, Handshake, Network, FileCheck, 
    Check, Menu, X, ChevronDown, Phone, Mail, User as UserIcon,
    Shield, Zap, Globe, Layers, Award, Sparkles, Rocket, Target, Heart
} from 'lucide-react';
import logo from '../assets/logo.png';

const Landing = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeFaq, setActiveFaq] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState('premium');
    const { scrollY } = useScroll();
    
    const headerBg = useTransform(scrollY, [0, 100], ['rgba(2, 6, 23, 0)', 'rgba(2, 6, 23, 0.9)']);
    const headerBlur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(16px)']);

    const scrollToSection = (id) => {
        setIsMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
            
            {/* STICKY HEADER */}
            <motion.nav 
                style={{ backgroundColor: headerBg, backdropFilter: headerBlur }}
                className="fixed top-0 left-0 right-0 z-[9999] border-b border-white/5"
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-4 cursor-pointer group" onClick={() => scrollToSection('home')}>
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-500 overflow-hidden p-1.5">
                            <img src={logo} alt="WOMUP Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-2xl font-bold font-serif tracking-tight text-white group-hover:text-blue-400 transition-colors uppercase">WOMUP</span>
                    </div>

                    <ul className="hidden lg:flex items-center gap-10">
                        {[
                            { label: 'FOCO Model', id: 'model' },
                            { label: 'Packages', id: 'packages' },
                            { label: 'Ecosystem', id: 'ecosystem' },
                            { label: 'FAQ', id: 'faq' }
                        ].map((item) => (
                            <li key={item.id}>
                                <button 
                                    onClick={() => scrollToSection(item.id)} 
                                    className="text-sm font-medium text-slate-400 hover:text-white transition-all relative group"
                                >
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="hidden lg:flex items-center gap-8">
                        <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
                            Login
                        </button>
                        <button onClick={() => scrollToSection('contact')} className="btn-primary !px-6 !py-3 !rounded-xl shadow-xl shadow-blue-600/30 whitespace-nowrap flex items-center gap-2 text-sm">
                            JOIN NOW <ArrowRight size={18} />
                        </button>
                    </div>

                    <button className="lg:hidden text-white p-2 hover:bg-white/5 rounded-xl transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="lg:hidden bg-slate-950 border-b border-white/5 absolute top-full left-0 right-0 overflow-hidden"
                        >
                            <div className="flex flex-col p-8 space-y-6">
                                <button onClick={() => scrollToSection('model')} className="text-left text-lg font-bold text-slate-300 hover:text-blue-400 transition-colors">FOCO Model</button>
                                <button onClick={() => scrollToSection('packages')} className="text-left text-lg font-bold text-slate-300 hover:text-blue-400 transition-colors">Packages</button>
                                <button onClick={() => scrollToSection('faq')} className="text-left text-lg font-bold text-slate-300 hover:text-blue-400 transition-colors">FAQ</button>
                                <div className="h-px bg-white/5 w-full" />
                                <button onClick={() => navigate('/login')} className="text-left text-lg font-black text-amber-500">LOGIN</button>
                                <button onClick={() => scrollToSection('contact')} className="btn-primary w-full flex items-center justify-center gap-2">APPLY NOW <ArrowRight size={18} /></button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* HERO SECTION */}
            <section id="home" className="relative min-h-screen flex items-center pt-32 pb-24 px-6 md:px-12 lg:px-24 overflow-hidden">
                <div className="mesh-bg" />
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
                <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] -z-10" />
                
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <motion.div 
                        initial="hidden" animate="visible" variants={staggerContainer}
                        className="space-y-8 text-center lg:text-left"
                    >
                        <motion.div 
                            variants={fadeInUp} 
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-[0.2em]"
                        >
                            <Sparkles size={14} className="animate-pulse" /> The Future of Franchise Ownership
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif leading-[1.1] tracking-tight">
                            Own the <span className="text-gradient">Success</span>, <br />
                            <span className="text-2xl md:text-3xl lg:text-4xl text-slate-400 font-light italic mt-4 block">Let Experts Run the Show.</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                            Experience a premium FOCO-based ecosystem designed for collective ownership and professional, company-managed operations.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="flex flex-wrap justify-center lg:justify-start gap-5 pt-4">
                            <button onClick={() => scrollToSection('packages')} className="btn-primary px-8 py-4 text-base shadow-xl shadow-blue-600/30 whitespace-nowrap flex items-center gap-2">
                                EXPLORE PACKAGES <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button onClick={() => scrollToSection('contact')} className="btn-secondary px-8 py-4 text-base whitespace-nowrap flex items-center gap-2">
                                Book Consultation
                            </button>
                        </motion.div>
                        
                        <motion.div variants={fadeInUp} className="flex flex-wrap justify-center lg:justify-start gap-8 pt-8 border-t border-white/5">
                            <div className="flex items-center gap-2 text-slate-400 font-semibold text-xs uppercase tracking-widest">
                                <CheckCircle2 className="text-emerald-500" size={18} /> Group Ownership
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 font-semibold text-xs uppercase tracking-widest">
                                <CheckCircle2 className="text-blue-500" size={18} /> Managed Operations
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
                        className="relative hidden lg:flex items-center justify-center"
                    >
                        <div className="grid grid-cols-2 gap-6 w-full max-w-md relative z-10">
                            {[
                                { icon: Building2, label: "Managed", sub: "Expert Ops", color: "text-blue-400", bg: "bg-blue-400/10" },
                                { icon: Users, label: "Shared", sub: "Group Model", color: "text-emerald-400", bg: "bg-emerald-400/10" },
                                { icon: PieChart, label: "Growth", sub: "Scalable", color: "text-amber-400", bg: "bg-amber-400/10" },
                                { icon: Network, label: "Ecosystem", sub: "Connected", color: "text-purple-400", bg: "bg-purple-400/10" }
                            ].map((item, i) => (
                                <motion.div 
                                    key={i} 
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className={`p-8 glass-card ${i % 2 !== 0 ? 'mt-12' : ''}`}
                                >
                                    <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-inner`}>
                                        <item.icon size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{item.label}</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.sub}</p>
                                </motion.div>
                            ))}
                        </div>
                        
                        <motion.div 
                            animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-8 -bottom-10 glass-card p-6 border-blue-500/20 shadow-2xl shadow-blue-500/20 z-30 flex items-center gap-4"
                        >
                            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-black shadow-lg">
                                <ShieldCheck size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Certified</p>
                                <p className="font-bold text-white whitespace-nowrap">FOCO Quality</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* WHAT IS FOCO MODEL */}
            <section id="model" className="py-32 px-6 lg:px-24 relative bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                        className="text-center max-w-3xl mx-auto mb-20"
                    >
                        <h2 className="text-5xl md:text-6xl font-bold mb-6">The <span className="text-gradient">FOCO</span> Advantage</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-emerald-500 mx-auto mb-8 rounded-full" />
                        <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed">
                            A seamless, product-driven model where the franchise is <span className="text-white font-medium">Owned by You</span>, but <span className="text-white font-medium">Operated by Company</span> experts.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Users, title: "Group Ownership", desc: "Collaborate with others to own premium franchise assets collectively.", color: "text-blue-400" },
                            { icon: Settings, title: "Company Ops", desc: "Leave the heavy lifting to us. We manage staff, stock, and sales.", color: "text-emerald-400" },
                            { icon: Handshake, title: "Partnership", desc: "Built on trust and long-term participation in a growing network.", color: "text-amber-400" },
                            { icon: TrendingUp, title: "Growth Engine", desc: "Scalable model designed to expand as the retail footprint grows.", color: "text-purple-400" }
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial="hidden" whileInView="visible" viewport={{ once: true }}
                                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } } }}
                                whileHover={{ y: -8 }}
                                className="glass-card p-10 flex flex-col items-center text-center group"
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                    <item.icon size={32} className={item.color} />
                                </div>
                                <h3 className="text-xl font-bold mb-4 tracking-tight">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm font-light">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY THIS MODEL WORKS */}
            <section className="py-32 px-6 lg:px-24">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-10">
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight font-serif">Professional <br /><span className="text-gradient">Operations.</span> <br />Zero Hassle.</h2>
                        <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed">
                            Traditional franchises fail when owners struggle with operations. We solve this by taking over management, while you hold the ownership position.
                        </p>
                        <div className="grid gap-4">
                            {[
                                { t: "Structured Partnership Model", c: "bg-blue-600" },
                                { t: "Real Product-Based Retail", c: "bg-emerald-500" },
                                { t: "Company-Managed Scalability", c: "bg-amber-500" }
                            ].map((item, i) => (
                                <motion.div 
                                    key={i} 
                                    whileHover={{ x: 10 }}
                                    className="flex items-center gap-5 p-5 glass-card !rounded-2xl"
                                >
                                    <div className={`w-2.5 h-2.5 rounded-full ${item.c} shadow-[0_0_15px_rgba(0,0,0,0.5)]`} />
                                    <span className="font-semibold text-slate-200">{item.t}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-600/20 rounded-[48px] blur-3xl -z-10" />
                        <div className="grid grid-cols-2 gap-6 p-8 md:p-12 glass-card !rounded-[48px]">
                            {[
                                { icon: Globe, label: "Scalable", sub: "Global Reach" },
                                { icon: Shield, label: "Secure", sub: "Asset Safety" },
                                { icon: Layers, label: "Tiered", sub: "Level Access" },
                                { icon: Award, label: "Premium", sub: "Top Quality" }
                            ].map((item, i) => (
                                <motion.div 
                                    key={i} 
                                    whileHover={{ scale: 1.05 }}
                                    className="flex flex-col items-center text-center gap-4 p-6 rounded-3xl bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center text-white border border-white/5 shadow-xl">
                                        <item.icon size={28} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-lg">{item.label}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.sub}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* PACKAGES */}
            <section id="packages" className="py-32 px-6 lg:px-24 bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-20">
                        <h2 className="text-5xl md:text-6xl font-bold mb-6">Participation <span className="text-gradient">Tiers</span></h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light italic">Select your level of involvement in the FOCO ecosystem.</p>
                        
                        <div className="mt-12 inline-flex p-1.5 glass-card !rounded-2xl border-white/5">
                            <button 
                                onClick={() => setSelectedPackage('standard')}
                                className={`px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-all ${selectedPackage === 'standard' ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
                            >
                                STANDARD
                            </button>
                            <button 
                                onClick={() => setSelectedPackage('premium')}
                                className={`px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-all ${selectedPackage === 'premium' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-white'}`}
                            >
                                PREMIUM
                            </button>
                        </div>
                    </motion.div>

                    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                        {/* Standard */}
                        <motion.div 
                            animate={{ opacity: selectedPackage === 'standard' ? 1 : 0.4, scale: selectedPackage === 'standard' ? 1 : 0.95 }}
                            className={`p-12 glass-card flex flex-col ${selectedPackage === 'standard' ? 'border-blue-500/30' : ''}`}
                        >
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 mb-8">
                                <Store size={32} />
                            </div>
                            <h3 className="text-3xl font-bold mb-4">Standard Tier</h3>
                            <p className="text-slate-500 mb-8 font-light">Essential entry into the FOCO retail network.</p>
                            
                            <div className="space-y-6 mb-12 flex-grow">
                                {[
                                    "Retail participation access",
                                    "Standard ecosystem growth",
                                    "E-onboarding support",
                                    "Digital dashboard"
                                ].map((t, i) => (
                                    <div key={i} className="flex items-center gap-4 text-slate-300 font-medium">
                                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                            <Check size={12} className="text-emerald-500" />
                                        </div>
                                        {t}
                                    </div>
                                ))}
                            </div>
                            
                            <button onClick={() => scrollToSection('contact')} className="btn-secondary w-full py-5 text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                                CHOOSE STANDARD <ArrowRight size={18} />
                            </button>
                        </motion.div>

                        {/* Premium */}
                        <motion.div 
                            animate={{ opacity: selectedPackage === 'premium' ? 1 : 0.4, scale: selectedPackage === 'premium' ? 1 : 0.95 }}
                            className={`p-12 glass-card flex flex-col relative overflow-hidden ${selectedPackage === 'premium' ? 'border-blue-500/50 shadow-2xl shadow-blue-500/10' : ''}`}
                        >
                            <div className="absolute top-8 right-8 px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-500 text-[10px] font-bold rounded-full uppercase tracking-tighter">
                                POPULAR
                            </div>
                            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 mb-8 shadow-inner shadow-blue-600/20">
                                <Award size={32} />
                            </div>
                            <h3 className="text-3xl font-bold mb-4">Premium Tier</h3>
                            <p className="text-slate-400 mb-8 font-light">Priority access with elite participation features.</p>
                            
                            <div className="space-y-6 mb-12 flex-grow">
                                {[
                                    "Priority asset allocation",
                                    "Advanced growth analytics",
                                    "Strategic level access",
                                    "Executive consultation",
                                    "Direct partner support"
                                ].map((t, i) => (
                                    <div key={i} className="flex items-center gap-4 text-white font-bold">
                                        <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                                            <Check size={12} className="text-blue-500" />
                                        </div>
                                        {t}
                                    </div>
                                ))}
                            </div>
                            
                            <button onClick={() => scrollToSection('contact')} className="btn-primary w-full py-5 text-sm uppercase tracking-widest shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2">
                                CHOOSE PREMIUM <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ROADMAP */}
            <section className="py-32 px-6 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-24">
                        <h2 className="text-5xl md:text-6xl font-bold mb-6">The <span className="text-gradient">Roadmap</span></h2>
                        <p className="text-slate-400 text-lg font-light">Your journey from consultation to expansion.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12 relative">
                        {/* Desktop Connector */}
                        <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-[1px] bg-white/10 -z-10" />
                        
                        {[
                            { step: "01", icon: Rocket, title: "Select Tier", sub: "Choose your package" },
                            { step: "02", icon: FileCheck, title: "Onboarding", sub: "Easy documentation" },
                            { step: "03", icon: Zap, title: "Activation", sub: "Network integration" },
                            { step: "04", icon: Target, title: "Operations", sub: "Company led growth" },
                            { step: "05", icon: TrendingUp, title: "Expansion", sub: "Scale your reach" }
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="w-20 h-20 bg-slate-950 border border-white/5 rounded-3xl flex items-center justify-center mb-8 relative group-hover:border-blue-500/50 transition-all shadow-xl">
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-white text-black rounded-xl flex items-center justify-center text-[10px] font-bold">
                                        {item.step}
                                    </div>
                                    <item.icon size={28} className="text-slate-300 group-hover:text-blue-500 transition-colors group-hover:scale-110 duration-500" />
                                </div>
                                <h3 className="text-lg font-bold mb-2 uppercase tracking-tighter">{item.title}</h3>
                                <p className="text-slate-500 text-xs font-light leading-relaxed max-w-[120px]">{item.sub}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ECOSYSTEM */}
            <section id="ecosystem" className="py-32 px-6 lg:px-24 relative overflow-hidden bg-slate-900/50">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative order-2 lg:order-1">
                        <div className="relative aspect-square max-w-[450px] mx-auto flex items-center justify-center">
                            {[0, 1, 2].map((i) => (
                                <motion.div 
                                    key={i}
                                    animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                                    transition={{ duration: 30 + (i * 15), repeat: Infinity, ease: "linear" }}
                                    className={`absolute inset-${i * 12} border border-white/5 rounded-full`}
                                />
                            ))}
                            
                            <motion.div 
                                animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }}
                                className="relative z-10 w-40 h-40 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-[40px] flex items-center justify-center shadow-2xl shadow-blue-500/20"
                            >
                                <Users size={48} className="text-white" />
                            </motion.div>
                            
                            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 + 0.5 }}
                                    className="absolute w-14 h-14 bg-slate-950 border border-white/10 rounded-2xl flex items-center justify-center shadow-xl"
                                    style={{ transform: `rotate(${deg}deg) translateY(-160px) rotate(-${deg}deg)` }}
                                >
                                    <UserIcon size={20} className="text-blue-500" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-10 order-1 lg:order-2">
                        <h2 className="text-5xl md:text-6xl font-bold leading-tight">Collaborative <br /><span className="text-gradient">Network.</span></h2>
                        <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed">
                            The FOCO model thrives on community growth. By collaborating and expanding the network, every participant benefits from a larger, more stable footprint.
                        </p>
                        
                        <div className="grid sm:grid-cols-2 gap-6">
                            {[
                                { title: "Tiered Growth", icon: Network },
                                { title: "Shared Success", icon: Heart },
                                { title: "Deep Analytics", icon: TrendingUp },
                                { title: "Global Reach", icon: Globe }
                            ].map((item, i) => (
                                <motion.div 
                                    key={i} 
                                    whileHover={{ y: -5 }}
                                    className="p-6 glass-card !rounded-2xl flex flex-col gap-4"
                                >
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                                        <item.icon size={20} />
                                    </div>
                                    <span className="font-bold tracking-tight">{item.title}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* TRUST & SAFETY */}
            <section className="py-32 px-6 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-24">
                        <h2 className="text-5xl md:text-6xl font-bold mb-6">Trust & <span className="text-gradient">Transparency</span></h2>
                        <p className="text-slate-400 text-lg font-light">Built for long-term professional alignment and asset security.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Registered Business", sub: "Fully Compliant", icon: FileCheck },
                            { title: "Real Retail Assets", sub: "Product-Driven", icon: Store },
                            { title: "Transparent Ops", sub: "Expert Management", icon: ShieldCheck },
                            { title: "Guided Support", sub: "Dedicated Help", icon: Users },
                            { title: "Asset Protection", sub: "Secure Participation", icon: Shield },
                            { title: "Legal Framework", sub: "Structured Partnership", icon: CheckCircle2 }
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="glass-card p-8 flex items-center gap-6 group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-blue-500/30 transition-colors">
                                    <item.icon size={24} className="text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight uppercase">{item.title}</h3>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.1em] mt-1">{item.sub}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-32 px-6 lg:px-24 bg-slate-900/50">
                <div className="max-w-3xl mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-20">
                        <h2 className="text-5xl font-bold">Inquiry Center</h2>
                    </motion.div>

                    <div className="space-y-4">
                        {[
                            { q: "What exactly is the FOCO model?", a: "FOCO stands for Franchise Owned, Company Operated. You secure ownership in the franchise system, while the corporate team handles 100% of the operational management and day-to-day tasks." },
                            { q: "Who manages the store operations?", a: "Our dedicated professional operations team handles everything: inventory, staffing, logistics, and sales, ensuring premium standards are met." },
                            { q: "How does collective ownership work?", a: "Multiple participants join together within the FOCO structure to build a collective retail footprint, sharing in the benefits of a large-scale managed network." },
                            { q: "What differentiates the packages?", a: "The Premium tier offers priority allocation, deeper strategic access to the growth ecosystem, and advanced analytics compared to the Standard tier." },
                            { q: "Is training provided?", a: "Yes, we provide full onboarding and continuous guidance on how to navigate and maximize your participation in the FOCO ecosystem." },
                            { q: "How do I join?", a: "Select your preferred tier below, complete the onboarding process, and our team will guide you through the activation and growth phases." }
                        ].map((faq, i) => (
                            <div key={i} className="glass-card !rounded-2xl overflow-hidden transition-all">
                                <button 
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-8 text-left hover:bg-white/[0.02] transition-colors"
                                >
                                    <span className="font-bold pr-8 uppercase tracking-tighter leading-tight">{faq.q}</span>
                                    <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 transition-transform duration-500 ${activeFaq === i ? 'rotate-180 bg-blue-500/10' : ''}`}>
                                        <ChevronDown size={20} className={activeFaq === i ? 'text-blue-500' : 'text-slate-400'} />
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {activeFaq === i && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-8 pb-8 text-slate-400 font-light text-sm leading-relaxed border-t border-white/5 pt-6">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTACT */}
            <section id="contact" className="py-32 px-6 lg:px-24">
                <div className="max-w-6xl mx-auto">
                    <div className="glass-card !rounded-[48px] overflow-hidden flex flex-col lg:flex-row shadow-2xl shadow-blue-500/10">
                        <div className="lg:w-5/12 p-12 lg:p-20 bg-gradient-to-br from-blue-600 to-emerald-500 text-white flex flex-col justify-center relative">
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
                            <h2 className="text-5xl font-bold mb-8 leading-tight font-serif">Apply for <br />Consultation</h2>
                            <p className="text-white/80 text-lg font-light mb-12 leading-relaxed">
                                Join the elite circle of FOCO franchise participants. Our experts will contact you for a private consultation.
                            </p>
                            <div className="space-y-8 relative z-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/10">
                                        <Phone size={24} className="text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Call Us</p>
                                        <span className="font-bold text-xl tracking-tight text-white">+91 XXXXX XXXXX</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/10">
                                        <Mail size={24} className="text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Email Us</p>
                                        <span className="font-bold text-xl tracking-tight text-white">contact@womup.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-7/12 p-12 lg:p-20 bg-slate-950/40">
                            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); alert('Success! Consultation request received.'); }}>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-4">Full Name</label>
                                        <input type="text" required className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all" placeholder="John Smith" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-4">Contact Number</label>
                                        <input type="tel" required className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all" placeholder="+91" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-4">Primary City</label>
                                    <input type="text" required className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all" placeholder="E.g. Delhi" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-4">Interested Tier</label>
                                    <div className="relative">
                                        <select className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer">
                                            <option>Premium Package</option>
                                            <option>Standard Package</option>
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={20} />
                                    </div>
                                </div>
                                <button type="submit" className="btn-primary w-full py-5 text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2">
                                    SUBMIT REQUEST <ArrowRight size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-20 px-6 lg:px-24 border-t border-white/5 bg-slate-900/50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg p-1.5">
                            <img src={logo} alt="WOMUP Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-2xl font-bold font-serif text-white tracking-tight">WOMUP</span>
                    </div>
                    <p className="text-slate-500 text-xs font-light text-center">© {new Date().getFullYear()} WOMUP FOCO Ecosystem. Professional Management Only.</p>
                    <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Legal</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;

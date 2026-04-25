import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    Link as LinkIcon, 
    Users, 
    Layers, 
    HandCoins, 
    Package, 
    CircleDollarSign,
    ChevronLeft,
    LogOut,
    ShieldCheck,
    X,
    History
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { logout, user } = useAuth();
    const location = useLocation();

    // Close sidebar on mobile when route changes
    useEffect(() => {
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    }, [location.pathname]);

    const userMenuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Referral Link', icon: LinkIcon, path: '/referral-link' },
        { name: 'Team Details', icon: Users, path: '/team' },
        { name: 'Level Income', icon: Layers, path: '/level-income' },
        { name: 'Referral Income', icon: HandCoins, path: '/referral-income' },
        { name: 'Packages', icon: Package, path: '/packages' },
        { name: 'Purchase History', icon: History, path: '/purchase-history' },
        { name: 'ROI Income', icon: CircleDollarSign, path: '/roi-income' },
    ];

    const adminMenuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'User Management', icon: Users, path: '/admin/users' },
        { name: 'Package Requests', icon: ShieldCheck, path: '/admin/package-requests' },
        { name: 'Package History', icon: History, path: '/admin/package-history' },
    ];

    const menuItems = user?.role === 'admin' ? adminMenuItems : userMenuItems;

    const sidebarVariants = {
        open: { x: 0, width: 280 },
        closed: { x: -280, width: 0 },
        desktop: { x: 0, width: isCollapsed ? 80 : 280 }
    };

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.div 
                className={`fixed lg:relative inset-y-0 left-0 bg-card border-r border-white/5 flex flex-col z-50 overflow-hidden shadow-2xl lg:shadow-none`}
                initial={false}
                animate={window.innerWidth < 1024 ? (isOpen ? 'open' : 'closed') : 'desktop'}
                variants={sidebarVariants}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            >
                <div className="p-2 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <motion.img 
                            src={logo} 
                            alt="WOMUP" 
                            className="w-20 h-16"
                            animate={{ scale: isCollapsed ? 0.8 : 1 }}
                        />
                        {/* <AnimatePresence>
                            {!isCollapsed && (
                                <motion.h1 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="text-2xl font-bold bg-primary-gradient bg-clip-text text-transparent whitespace-nowrap"
                                >
                                    WOMUP
                                </motion.h1>
                            )}
                        </AnimatePresence> */}
                    </div>
                    
                    <button 
                        onClick={() => window.innerWidth < 1024 ? setIsOpen(false) : setIsCollapsed(!isCollapsed)}
                        className="p-2 hover:bg-white/5 rounded-lg text-gray-400 lg:block"
                    >
                        {window.innerWidth < 1024 ? <X size={20} /> : <ChevronLeft className={`transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center p-3 rounded-xl transition-all duration-200 group relative
                                ${isActive ? 'bg-primary-gradient text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                            `}
                        >
                            <item.icon size={20} className={isCollapsed ? 'mx-auto' : 'mr-3 shrink-0'} />
                            <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.span 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="font-medium whitespace-nowrap"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-2 bg-card border border-white/10 rounded-xl text-xs invisible group-hover:visible whitespace-nowrap z-50 shadow-xl">
                                    {item.name}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button 
                        onClick={logout}
                        className="w-full flex items-center p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group"
                    >
                        <LogOut size={20} className={isCollapsed ? 'mx-auto' : 'mr-3 shrink-0'} />
                        {!isCollapsed && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </motion.div>
        </>
    );
};

export default Sidebar;

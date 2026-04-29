import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const navItems = [
  { label: 'FOCO Model', id: 'model' },
  { label: 'Partner Shops', id: 'partners' },
  { label: 'Token System', id: 'tokens' },
  { label: 'Income Plans', id: 'income' },
  { label: 'FAQ', id: 'faq' },
];

export default function LandingNav({ scrollTo }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-[10000]">
      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-[#7A3FF2] via-[#9B6FF5] via-[#F6C453] via-[#9B6FF5] to-[#7A3FF2] bg-[length:200%_100%] animate-[shimmerNav_4s_linear_infinite] text-white text-center text-[11px] sm:text-[13px] font-black py-2.5 px-4 tracking-wide shadow-sm relative z-[10002]">
        🛡️ Smart Shopping · Strong Income · Secure Future &nbsp;|&nbsp; 60-Day Refund Protected ✓
      </div>

      <nav className={`transition-all duration-300 w-full ${scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-[#7A3FF2] shadow-[0_4px_24px_rgba(122,63,242,0.5)]'
          : 'bg-white/80 backdrop-blur-md'
        }`}>
        <div className="max-w-[1400px] mx-auto px-6 h-[72px] flex items-center">

          {/* LEFT: Logo */}
          <div className="flex-1 flex justify-start items-center">
            <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileOpen(false); }}>
              <div className="w-10 h-10 bg-white rounded-[10px] p-1.5 shadow-[0_2px_12px_rgba(122,63,242,0.15)] flex items-center justify-center group-hover:scale-105 transition-transform">
                <img src={logo} alt="WOMUP" className="w-full h-full object-contain" />
              </div>
              <span className="text-[20px] font-black font-poppins text-[#1F2937] tracking-tighter hidden sm:inline-block">WOMUP</span>
            </div>
          </div>

          {/* CENTER: Navigation Links (Perfectly centered) */}
          <div className="hidden lg:flex flex-none items-center justify-center">
            <ul className="flex items-center list-none gap-10 m-0 p-0">
              {navItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollTo(item.id)}
                    className="bg-transparent border-none cursor-pointer text-[13.5px] font-black text-[#6B7280] font-poppins transition-colors hover:text-[#7A3FF2] whitespace-nowrap"
                  >{item.label}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: Action Buttons */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="hidden lg:flex items-center gap-6">
              <button
                onClick={() => navigate('/login')}
                className="bg-transparent border-none cursor-pointer text-[13.5px] font-black text-[#6B7280] font-poppins hover:text-[#7A3FF2] transition-colors"
              >Login</button>
              <button
                id="nav-join-btn"
                onClick={() => scrollTo('contact')}
                className="bg-gradient-to-br from-[#7A3FF2] to-[#9B6FF5] text-white px-7 py-2.5 rounded-[12px] font-black text-[13.5px] shadow-[0_4px_12px_rgba(122,63,242,0.2)] hover:shadow-[0_8px_20px_rgba(122,63,242,0.3)] hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
              >
                Join Now →
              </button>
            </div>

            {/* Hamburger for mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-2xl text-[#7A3FF2] bg-[#FAF7FF] rounded-lg border border-[#7A3FF21F] shadow-sm"
            >{mobileOpen ? '✕' : '☰'}</button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-[#F3F4F6] p-6 flex flex-col gap-4 animate-fadeIn shadow-2xl absolute top-full left-0 w-full">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { scrollTo(item.id); setMobileOpen(false); }}
                className="bg-transparent border-none cursor-pointer text-[15px] font-black text-[#1F2937] font-poppins text-left py-2 hover:text-[#7A3FF2]"
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-[#F3F4F6] pt-4 flex gap-3">
              <button
                onClick={() => navigate('/login')}
                className="flex-1 bg-white border-2 border-[#7A3FF2] text-[#7A3FF2] rounded-[12px] py-3.5 font-black text-[14px] font-poppins active:scale-95"
              >Login</button>
              <button
                onClick={() => { scrollTo('contact'); setMobileOpen(false); }}
                className="flex-[2] bg-gradient-to-br from-[#7A3FF2] to-[#9B6FF5] text-white rounded-[12px] py-3.5 font-black text-[14px] font-poppins shadow-lg active:scale-95"
              >Join Now →</button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
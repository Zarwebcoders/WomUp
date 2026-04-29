import React from 'react';
import logo from '../../assets/logo.png';

const links = [
  { label: 'About', href: '#home' },
  { label: 'FOCO Model', href: '#model' },
  { label: 'Partners', href: '#partners' },
  { label: 'Tokens', href: '#tokens' },
  { label: 'Income', href: '#income' },
  { label: 'FAQ', href: '#faq' },
];

const legal = [
  { label: 'Refund Policy', href: '#security' },
  { label: 'Legal Disclaimer', href: '#security' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Use', href: '#' },
];

export default function LandingFooter({ scrollTo }) {
  return (
    <footer className="bg-[#1F2937] text-white py-10 px-6 pb-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
              <div className="w-10 h-10 bg-white rounded-[12px] flex items-center justify-center p-1.5 shadow-lg">
                <img src={logo} alt="WOMUP" className="w-full h-full object-contain" />
              </div>
              <span className="text-[22px] font-black font-poppins tracking-tighter">WOMUP</span>
            </div>
            <p className="text-[14px] text-white/50 leading-relaxed max-w-[240px] font-medium">
              Smart Shopping. Shared Ownership. Token Rewards. Income Opportunity. Secure Future.
            </p>
            <div className="flex gap-3">
              {[
                { icon: '💬', href: 'https://wa.me/919999999999' },
                { icon: '📘', href: '#' },
                { icon: '📸', href: '#' },
                { icon: '▶️', href: '#' },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer"
                  className="w-10 h-10 bg-white/5 rounded-[10px] flex items-center justify-center text-base hover:bg-[#7A3FF2]/40 transition-colors shadow-sm"
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[13px] font-black text-[#F6C453] mb-6 uppercase tracking-widest">Navigate</h4>
            <div className="flex flex-col gap-3.5">
              {links.map((l, i) => (
                <a key={i} href={l.href} className="text-[13px] text-white/60 hover:text-white transition-colors font-semibold no-underline"
                >{l.label}</a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[13px] font-black text-[#F6C453] mb-6 uppercase tracking-widest">Legal</h4>
            <div className="flex flex-col gap-3.5">
              {legal.map((l, i) => (
                <a key={i} href={l.href} className="text-[13px] text-white/60 hover:text-white transition-colors font-semibold no-underline"
                >{l.label}</a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[13px] font-black text-[#F6C453] mb-6 uppercase tracking-widest">Contact</h4>
            <div className="flex flex-col gap-4">
              <a href="tel:+919999999999" className="text-[13px] text-white/60 hover:text-white transition-colors no-underline flex gap-2.5 items-center font-bold">
                <span className="text-lg opacity-70">📞</span> +91 99999 99999
              </a>
              <a href="mailto:contact@womup.com" className="text-[13px] text-white/60 hover:text-white transition-colors no-underline flex gap-2.5 items-center font-bold">
                <span className="text-lg opacity-70">📧</span> contact@womup.com
              </a>
              <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="text-[14px] text-[#25D366] hover:brightness-110 transition-all no-underline flex gap-2.5 items-center font-black">
                <span className="text-xl">💬</span> WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-wrap gap-4 justify-between items-center">
          <p className="text-[12px] text-white/30 font-medium tracking-tight">
            © {new Date().getFullYear()} WOMUP. All rights reserved. | Income figures are illustrative — not guaranteed returns.
          </p>
          <div className="flex gap-2 flex-wrap">
            {['60-Day Refund ✓', 'Registered Company ✓', 'Legal Model ✓'].map((t, i) => (
              <span key={i} className="text-[10px] bg-[#7A3FF226] border border-[#7A3FF233] text-[#C084FC] rounded-full px-3 py-0.5 font-black uppercase tracking-wider">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

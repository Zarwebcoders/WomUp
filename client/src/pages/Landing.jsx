import React from 'react';
import './landing/landingStyles.css';

import LandingNav from './landing/LandingNav';
import HeroSection from './landing/HeroSection';
import FocoModelSection from './landing/FocoModelSection';
import WomenSupportSection from './landing/WomenSupportSection';
import PartnerNetworkSection from './landing/PartnerNetworkSection';
import TokenSection from './landing/TokenSection';
import IncomeTabsSection from './landing/IncomeTabsSection';
import MembershipJourneySection from './landing/MembershipJourneySection';
import IncomeProjectionSection from './landing/IncomeProjectionSection';
import SecuritySection from './landing/SecuritySection';
import TestimonialsSection from './landing/TestimonialsSection';
import FaqSection from './landing/FaqSection';
import FinalCtaSection from './landing/FinalCtaSection';
import LandingFooter from './landing/LandingFooter';

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

export default function Landing() {
  return (
    <div className="lp-root selection:bg-[#7A3FF2] selection:text-white">
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ── NAVIGATION ── */}
      <LandingNav scrollTo={scrollTo} />

      {/* ── SECTIONS ── */}
      <main>
        <HeroSection scrollTo={scrollTo} />
        <FocoModelSection />
        <WomenSupportSection />
        <PartnerNetworkSection />
        <TokenSection />
        <IncomeTabsSection />
        <MembershipJourneySection />
        <IncomeProjectionSection />
        <SecuritySection />
        <TestimonialsSection />
        <FaqSection />
        <FinalCtaSection />
      </main>

      {/* ── FOOTER ── */}
      <LandingFooter scrollTo={scrollTo} />

      {/* ── FLOATING ELEMENTS ── */}
      
      {/* WhatsApp float */}
      <a
        href="https://wa.me/919999999999?text=Hi%20WOMUP%2C%20I%20want%20to%20know%20more"
        target="_blank"
        rel="noreferrer"
        id="whatsapp-float-btn"
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_12px_40px_rgba(37,211,102,0.5)] transition-all duration-300 group"
        title="Chat on WhatsApp"
      >
        <svg width="28" height="28" fill="white" viewBox="0 0 24 24" className="group-hover:rotate-[12deg] transition-transform">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-[9998] flex gap-2 p-1 bg-white/80 backdrop-blur-xl border border-white/20 rounded-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
        <button
          onClick={() => scrollTo('contact')}
          className="flex-[2] flex flex-col items-center justify-center gap-0.5 py-3 rounded-[16px] bg-gradient-to-br from-[#7A3FF2] to-[#9B6FF5] text-white font-black text-[12px] shadow-lg active:scale-95"
          id="mobile-sticky-join"
        >
          <span className="text-xl leading-none">🤝</span>
          <span>Join Now</span>
        </button>
        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 rounded-[16px] bg-[#25D366] text-white font-black text-[12px] no-underline active:scale-95 shadow-md"
          id="mobile-sticky-wa"
        >
          <span className="text-xl leading-none">💬</span>
          <span>WhatsApp</span>
        </a>
        <a
          href="tel:+919999999999"
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 rounded-[16px] bg-[#3B82F6] text-white font-black text-[12px] no-underline active:scale-95 shadow-md"
          id="mobile-sticky-call"
        >
          <span className="text-xl leading-none">📞</span>
          <span>Call</span>
        </a>
      </div>
    </div>
  );
}

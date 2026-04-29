import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const chips = [
  { icon: '🏢', text: 'Franchise Owned Company Operated' },
  { icon: '↩️', text: '60 Day Refund Policy' },
  { icon: '✅', text: 'Legal & Registered Model' },
  { icon: '💰', text: 'Multiple Income Opportunities' },
];

const counters = [
  { end: 10000, label: 'Members', suffix: '+' },
  { end: 500, label: 'Partner Shops', suffix: '+' },
  { end: 200, label: 'Communities', suffix: '+' },
  { end: 50000, label: 'Token Txns', suffix: '+' },
];

function useCounter(end, started) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(timer); }
      else setVal(start);
    }, 16);
    return () => clearInterval(timer);
  }, [started, end]);
  return val;
}

function Counter({ end, label, suffix }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const val = useCounter(end, started);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="text-center p-2 border border-[#7A3FF2] rounded-xl hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-[#7A3FF280]">
      <div className="text-[clamp(24px,4vw,36px)] font-extrabold text-[#7A3FF2] font-poppins">
        {val.toLocaleString('en-IN')}{suffix}
      </div>
      <div className="text-[13px] text-[#6B7280] font-semibold mt-1 uppercase tracking-wide">{label}</div>
    </div>
  );
}

export default function HeroSection({ scrollTo }) {
  return (
    <section id="home" className="relative pt-36 pb-10 px-6 overflow-hidden bg-gradient-to-br from-[#FAF7FF] via-white to-[#F5EDFF]">
      {/* Decorative blobs */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(122,63,242,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(246,196,83,0.1),transparent_70%)] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Eyebrow */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-bold bg-[#7A3FF214] border border-[#7A3FF2] text-[#7A3FF2]">
            ✨ Women Empowerment · Smart Shopping · Token Rewards
          </span>
        </div>

        {/* Hero headline */}
        <h1 className="text-[clamp(30px,6vw,60px)] font-black text-[#1F2937] text-center leading-[1.15] mb-5 font-poppins">
          Start Your Own Franchise.<br />
          Shop Smart. Build Income.<br />
          <span className="bg-gradient-to-r from-[#7A3FF2] via-[#C084FC] to-[#F6C453] bg-clip-text text-transparent">Grow With WOMUP.</span>
        </h1>

        <p className="text-center text-[clamp(15px,2.5vw,18px)] text-[#6B7280] max-w-[640px] mx-auto mb-10 leading-relaxed">
          Women empowerment driven franchise model with shopping benefits, token rewards, team growth and multiple income opportunities.
        </p>

        {/* CTA row */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <button
            className="inline-flex items-center gap-2 bg-gradient-to-br from-[#7A3FF2] to-[#9B6FF5] text-white px-8 py-4 rounded-[14px] font-bold text-sm shadow-[0_8px_24px_rgba(122,63,242,0.3)] hover:translate-y-[-5px] hover:shadow-[0_12px_32px_rgba(122,63,242,0.4)] transition-all whitespace-nowrap active:scale-95"
            onClick={() => scrollTo('contact')}
            id="hero-become-partner"
          >
            Become Partner <ArrowRight size={18} />
          </button>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-[#F6C453] to-[#E8A830] text-[#1F2937] px-8 py-4 rounded-[14px] font-bold text-sm shadow-[0_8px_24px_rgba(246,196,83,0.3)] hover:translate-y-[-5px] hover:shadow-[0_12px_32px_rgba(246,196,83,0.4)] transition-all whitespace-nowrap active:scale-95"
            id="hero-download-pdf"
            download
          >
            📄 Download Plan PDF
          </a>
          <a
            href="https://wa.me/919999999999?text=Hi%20WOMUP%2C%20I%20want%20to%20know%20more"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-[#25D366] to-[#1DA851] text-white px-8 py-4 rounded-[14px] font-bold text-sm shadow-[0_8px_24px_rgba(37,211,102,0.3)] hover:translate-y-[-5px] hover:shadow-[0_12px_32px_rgba(37,211,102,0.4)] transition-all whitespace-nowrap active:scale-95"
            id="hero-whatsapp"
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            Talk on WhatsApp
          </a>
        </div>

        {/* Trust chips */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-16">
          {chips.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-white border border-[#7A3FF2] rounded-full px-4 py-2 text-[13px] font-bold text-[#7A3FF2] shadow-[0_2px_8px_rgba(122,63,242,0.07)]">
              {c.icon} {c.text}
            </div>
          ))}
        </div>

        {/* Animated counters */}
        <div className="bg-white rounded-[24px] shadow-[0_4px_32px_rgba(122,63,242,0.1)] border border-[#7A3FF2] p-9 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {counters.map((c, i) => <Counter key={i} end={c.end} label={c.label} suffix={c.suffix} />)}
        </div>
      </div>
    </section>
  );
}

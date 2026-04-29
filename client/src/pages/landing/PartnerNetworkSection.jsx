import React from 'react';

const categories = [
  { icon: '🛒', name: 'Grocery', desc: 'Daily essentials & FMCG' },
  { icon: '👗', name: 'Fashion', desc: 'Clothing & accessories' },
  { icon: '💊', name: 'Pharmacy', desc: 'Medicines & wellness' },
  { icon: '💇', name: 'Salon', desc: 'Beauty & grooming' },
  { icon: '🍽️', name: 'Restaurant', desc: 'Food & dining' },
  { icon: '📱', name: 'Electronics', desc: 'Gadgets & appliances' },
];

export default function PartnerNetworkSection() {
  return (
    <section id="partners" className="py-10 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#7A3FF214] border border-[#7A3FF2] text-[#7A3FF2] mb-3">
            Partner Ecosystem
          </span>
          <div className="w-[60px] h-1 bg-gradient-to-r from-[#7A3FF2] to-[#F6C453] rounded-full mx-auto mb-5" />
          <h2 className="text-[clamp(28px,5vw,42px)] font-extrabold text-[#1F2937] mb-3">
            Connected Shopping Network <span className="bg-gradient-to-r from-[#7A3FF2] via-[#C084FC] to-[#F6C453] bg-clip-text text-transparent">Across Categories</span>
          </h2>
          <p className="text-[17px] text-[#6B7280] max-w-[600px] mx-auto">
            Every WOMUP franchise zone (2 lakh population) hosts 6+1 partner shops across essential categories — building a complete shopping ecosystem for members.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((cat, i) => (
            <div key={i} className="bg-white border border-[#7A3FF2] rounded-[24px] shadow-[0_4px_24px_rgba(122,63,242,0.08)] p-7 flex items-center gap-5 hover:shadow-[0_12px_40px_rgba(122,63,242,0.15)] hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 min-w-[56px] rounded-2xl bg-gradient-to-br from-[#F5EDFF] to-[#EDE0FF] flex items-center justify-center text-2xl border-[#7A3FF2] border">
                {cat.icon}
              </div>
              <div>
                <div className="font-extrabold text-base text-[#1F2937]">{cat.name}</div>
                <div className="text-[13px] text-[#6B7280] mt-0.5">{cat.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 6+1 model explainer */}
        <div className="bg-gradient-to-br from-[#7A3FF2] via-[#F5EDFF] to-[#7A3FF2] border border-[#7A3FF2] rounded-[24px] p-10 sm:p-12 shadow-sm">
          <div className="flex flex-wrap gap-10 items-center justify-center">
            {/* visual */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7A3FF2] to-[#9B6FF5] flex items-center justify-center text-[32px] shadow-[0_8px_24px_rgba(122,63,242,0.3)]">🏬</div>
              <div className="font-extrabold text-[#7A3FF2] text-[15px]">WOMUP Hub</div>
              <div className="flex gap-2.5 flex-wrap justify-center">
                {categories.map((c, i) => (
                  <div key={i} className="w-11 h-11 rounded-xl bg-white border border-black flex items-center justify-center text-xl shadow-[0_2px_8px_rgba(122,63,242,0.08)]">{c.icon}</div>
                ))}
              </div>
            </div>
            {/* text */}
            <div className="max-w-[420px] text-center sm:text-left">
              <h3 className="text-[22px] font-extrabold text-[#1F2937] mb-3">6+1 Partner Model Per Zone</h3>
              <p className="text-[15px] text-[#6B7280] leading-relaxed mb-5">
                Each WOMUP franchise zone serving <strong>2 lakh people</strong> features 6 essential partner store categories plus 1 exclusive WOMUP hub. Members shop using tokens and earn repurchase income on every purchase.
              </p>
              <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                {['Token Shopping Benefits', 'Repurchase Income', 'Cashback & Rewards', 'Wide Product Range'].map((t, i) => (
                  <span key={i} className="bg-white border border-black rounded-full px-3.5 py-1 text-xs font-bold text-[#7A3FF2] shadow-sm">✓ {t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';

const tiers = [
  { label: '20% Token', rate: 0.2, color: '#7A3FF2', bg: 'bg-[#FAF7FF]', border: 'border-[#7A3FF2]', desc: 'Premium member rate' },
  { label: '10% Token', rate: 0.1, color: '#3B82F6', bg: 'bg-[#EFF6FF]', border: 'border-[#3B82F6]', desc: 'Standard member rate' },
  { label: '5% Token', rate: 0.05, color: '#2FBF71', bg: 'bg-[#F0FDF4]', border: 'border-[#2FBF71]', desc: 'Basic member rate' },
];

const flows = [
  { icon: '🛍️', title: 'Shop at Partner Store', desc: 'Buy groceries, medicines, fashion at partner shops.' },
  { icon: '🪙', title: 'Tokens Credited', desc: 'Earn tokens based on your membership tier (5%–20%).' },
  { icon: '💵', title: 'Joining Token Income', desc: 'Earn from tokens generated in your 7-level downline.' },
  { icon: '🔄', title: 'Repurchase Income', desc: 'Earn on 50% of repurchase tokens from your team.' },
  { icon: '🛒', title: 'Use Tokens to Shop', desc: 'Redeem tokens for free or discounted shopping.' },
];

export default function TokenSection() {
  const [purchase, setPurchase] = useState(1000);

  return (
    <section id="tokens" className="py-10 px-6 bg-[#FAF7FF]">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#7A3FF214] border border-[#7A3FF2] text-[#7A3FF2] mb-3">
            Token Economy
          </span>
          <div className="w-[60px] h-1 bg-gradient-to-r from-[#7A3FF2] to-[#F6C453] rounded-full mx-auto mb-5" />
          <h2 className="text-[clamp(28px,5vw,42px)] font-extrabold text-[#1F2937] mb-3">
            How Shopping <span className="bg-gradient-to-r from-[#7A3FF2] via-[#C084FC] to-[#F6C453] bg-clip-text text-transparent">Tokens Work</span>
          </h2>
          <p className="text-[17px] text-[#6B7280] max-w-[600px] mx-auto">
            Every rupee spent at partner stores earns you tokens. Tokens = Income + Shopping power. The more your team shops, the more you earn.
          </p>
        </div>

        {/* Token Calculator */}
        <div className="bg-white border border-[#7A3FF2] rounded-[24px] shadow-[0_4px_24px_rgba(122,63,242,0.08)] p-8 mb-12 max-w-[720px] mx-auto">
          <h3 className="font-extrabold text-xl text-[#1F2937] mb-1.5">🧮 Token Estimator</h3>
          <p className="text-[13px] text-[#6B7280] mb-6">Enter purchase amount to see how many tokens you'd earn:</p>

          <div className="mb-7">
            <label className="text-[13px] font-bold text-[#7A3FF2] block mb-2">
              Purchase Amount: <span className="text-xl text-[#1F2937] ml-1">₹{purchase.toLocaleString('en-IN')}</span>
            </label>
            <input
              id="token-calc-slider"
              type="range" min={500} max={50000} step={500}
              value={purchase}
              onChange={e => setPurchase(Number(e.target.value))}
              className="w-full h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#7A3FF2]"
            />
            <div className="flex justify-between text-[11px] text-[#9CA3AF] mt-1 font-bold">
              <span>₹500</span><span>₹50,000</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tiers.map((tier, i) => {
              const tokens = Math.round(purchase * tier.rate);
              return (
                <div key={i} className={`${tier.bg} rounded-[16px] p-5 border ${tier.border} text-center`}>
                  <div className="text-[11px] font-bold mb-1" style={{ color: tier.color }}>{tier.label}</div>
                  <div className="text-3xl font-black text-[#1F2937] font-poppins">{tokens}</div>
                  <div className="text-[11px] text-[#6B7280] mt-0.5 font-bold">Tokens earned</div>
                  <div className="text-[10px] text-[#9CA3AF] mt-0.5 font-medium leading-tight">{tier.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flow */}
        <div className="relative">
          <div className="flex flex-wrap gap-3 justify-center items-center">
            {flows.map((f, i) => (
              <React.Fragment key={i}>
                <div className="bg-white border border-[#7A3FF2] rounded-[24px] shadow-[0_4px_24px_rgba(122,63,242,0.08)] p-6 w-[180px] text-center flex-shrink-0 hover:shadow-xl hover:shadow-[#7A3FF280] hover:-translate-y-1 transition-all">
                  <div className="text-[32px] mb-2.5">{f.icon}</div>
                  <div className="font-extrabold text-[14px] text-[#1F2937] mb-1.5">{f.title}</div>
                  <div className="text-[12px] text-[#6B7280] leading-relaxed font-medium">{f.desc}</div>
                </div>
                {i < flows.length - 1 && (
                  <div className="text-[22px] text-[#7A3FF2] font-black flex-shrink-0 px-1 select-none hidden md:block">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

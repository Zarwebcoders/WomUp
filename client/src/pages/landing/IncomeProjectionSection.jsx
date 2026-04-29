import React from 'react';

const projections = [
  { team: '500', low: '10K', high: '20K', bar: 10, color: '#7A3FF2' },
  { team: '1,000', low: '25K', high: '40K', bar: 22, color: '#9B6FF5' },
  { team: '2,000', low: '50K', high: '60K', bar: 40, color: '#3B82F6' },
  { team: '5,000', low: '1.2L', high: '2L', bar: 65, color: '#2FBF71' },
  { team: '50,000', low: '11L', high: '15L+', bar: 100, color: '#F6C453' },
];

export default function IncomeProjectionSection() {
  return (
    <section id="potential" className="py-10 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#7A3FF214] border border-[#7A3FF2] text-[#7A3FF2] mb-3">
            Income Potential
          </span>
          <div className="w-[60px] h-1 bg-gradient-to-r from-[#7A3FF2] to-[#F6C453] rounded-full mx-auto mb-5" />
          <h2 className="text-[clamp(28px,5vw,42px)] font-extrabold text-[#1F2937] mb-3">
            Income Potential as Your <span className="bg-gradient-to-r from-[#7A3FF2] via-[#C084FC] to-[#F6C453] bg-clip-text text-transparent">Team Grows</span>
          </h2>
          <p className="text-[17px] text-[#6B7280] max-w-[600px] mx-auto">
            Your monthly income scales directly with your team size. Here's a realistic view of what active WOMUP franchise partners earn.
          </p>
        </div>

        <div className="max-w-[800px] mx-auto">
          {/* Header row - Hidden on small screens or adjust layout */}
          <div className="hidden sm:grid grid-cols-[140px_1fr_140px] gap-4 mb-3 px-4">
            <div className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest">Team Size</div>
            <div className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest">Growth Bar</div>
            <div className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest text-right">Monthly Income</div>
          </div>

          <div className="flex flex-col gap-3">
            {projections.map((p, i) => (
              <div key={i} className="bg-white border border-[#7A3FF2] rounded-[24px] shadow-[0_4px_24px_rgba(122,63,242,0.08)] p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-[140px_1fr_140px] gap-4 items-center hover:shadow-lg transition-shadow">
                {/* Team */}
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: p.color }} />
                  <span className="font-black text-[16px] text-[#1F2937]">{p.team} Members</span>
                </div>

                {/* Bar */}
                <div className="bg-[#F3F4F6] rounded-full h-2.5 overflow-hidden shadow-inner">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${p.bar}%`, backgroundColor: p.color, backgroundImage: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2))` }} 
                  />
                </div>

                {/* Income */}
                <div className="sm:text-right">
                  <span className="font-black text-lg font-poppins" style={{ color: p.color }}>₹{p.low}–{p.high}</span>
                  <span className="block text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider">per month</span>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-7 bg-[#FFFBEB] border border-[#F6C453] rounded-[12px] p-5 text-[12px] text-[#92400E] leading-relaxed shadow-sm">
            <span className="mr-1">⚠️</span> <strong>Disclaimer:</strong> Income figures are based on active participation and team performance. WOMUP does not guarantee fixed returns. Actual earnings depend on individual effort, team growth, and shopping activity. This is an opportunity-based model, not a fixed income scheme.
          </div>
        </div>
      </div>
    </section>
  );
}

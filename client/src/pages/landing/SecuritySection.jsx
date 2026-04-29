import React from 'react';

const securityCards = [
  {
    icon: '🛡️',
    title: 'Safety & Security',
    color: '#7A3FF2',
    bg: 'bg-gradient-to-br from-[#F5EDFF] to-[#EDE0FF]',
    points: [
      'Safe, real product-based business',
      'Registered & legally compliant company',
      'Transparent income plan',
      'No hidden charges or surprise fees',
      'Token-traceable income system',
    ],
  },
  {
    icon: '↩️',
    title: 'Refund Policy',
    color: '#2FBF71',
    bg: 'bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]',
    points: [
      '60-day joining refund window',
      'No questions asked within 60 days',
      'Process via official support channel',
      'Applicable on joining fee only',
      'Build confidence from day one',
    ],
  },
  {
    icon: '⚖️',
    title: 'Legal Disclaimer',
    color: '#3B82F6',
    bg: 'bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]',
    points: [
      'Opportunity-based income model',
      'Income not guaranteed or fixed',
      'Earnings depend on active effort',
      'Compliant with applicable laws',
      'Full plan document available on request',
    ],
  },
];

const comparisonRows = [
  { aspect: 'Initial Investment', traditional: 'High (₹10L+)', womup: 'Low & Accessible' },
  { aspect: 'Operations', traditional: 'You manage everything', womup: 'Company manages all' },
  { aspect: 'Profit Share', traditional: 'Fixed rent model', womup: 'Token-based sharing' },
  { aspect: 'Community Growth', traditional: 'Individual only', womup: 'Network compounding' },
  { aspect: 'Repeat Income', traditional: 'Not guaranteed', womup: 'Repurchase income' },
  { aspect: 'Flexibility', traditional: 'Full-time commitment', womup: 'Part-time friendly' },
];

export default function SecuritySection() {
  return (
    <section id="security" className="py-10 px-6 bg-[#FAF7FF]">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#7A3FF214] border border-[#7A3FF2] text-[#7A3FF2] mb-3">
            Safety & Trust
          </span>
          <div className="w-[60px] h-1 bg-gradient-to-r from-[#7A3FF2] to-[#F6C453] rounded-full mx-auto mb-5" />
          <h2 className="text-[clamp(28px,5vw,42px)] font-extrabold text-[#1F2937] mb-3">
            Your Security is Our <span className="bg-gradient-to-r from-[#7A3FF2] via-[#C084FC] to-[#F6C453] bg-clip-text text-transparent">Priority</span>
          </h2>
          <p className="text-[17px] text-[#6B7280] max-w-[600px] mx-auto">
            WOMUP is built on transparency, legal compliance, and member protection. Every policy is designed to give you confidence from Day 1.
          </p>
        </div>

        {/* 3 trust cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {securityCards.map((card, i) => (
            <div key={i} className="bg-white border-2 rounded-[24px] shadow-[0_4px_24px_rgba(122,63,242,0.08)] p-8 hover:shadow-xl transition-all duration-300" style={{ borderColor: `${card.color}` }}>
              <div className={`w-16 h-16 rounded-[18px] ${card.bg} flex items-center justify-center text-3xl mb-6 shadow-inner`}>
                {card.icon}
              </div>
              <h3 className="text-lg font-black text-[#1F2937] mb-4">{card.title}</h3>
              <ul className="flex flex-col gap-3">
                {card.points.map((p, j) => (
                  <li key={j} className="flex items-start gap-2 text-[13px] text-[#374151] leading-relaxed font-semibold">
                    <span className="mt-0.5 flex-shrink-0 font-black" style={{ color: card.color }}>✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Comparison */}
        <div className="text-center mb-10">
          <h2 className="text-[clamp(24px,4vw,36px)] font-extrabold text-[#1F2937]">
            Traditional Franchise vs <span className="bg-gradient-to-r from-[#7A3FF2] via-[#C084FC] to-[#F6C453] bg-clip-text text-transparent">WOMUP</span>
          </h2>
        </div>

        <div className="max-w-[800px] mx-auto bg-white rounded-[24px] overflow-hidden shadow-[0_4px_32px_rgba(122,63,242,0.1)] border border-[#7A3FF2]">
          {/* Table header */}
          <div className="grid grid-cols-3 bg-gradient-to-br from-[#7A3FF2] to-[#9B6FF5]">
            <div className="p-4 sm:p-5 text-[11px] font-black text-white/70 uppercase tracking-widest">Aspect</div>
            <div className="p-4 sm:p-5 text-[11px] font-black text-white/70 uppercase tracking-widest">Traditional</div>
            <div className="p-4 sm:p-5 text-[11px] font-black text-[#F6C453] uppercase tracking-widest">WOMUP ✓</div>
          </div>
          {comparisonRows.map((row, i) => (
            <div key={i} className={`grid grid-cols-3 border-b last:border-b-0 border-[#7A3FF2]  ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
              <div className="p-4 sm:p-5 text-[13px] font-bold text-[#1F2937] border-r border-[#F3F4F6]">{row.aspect}</div>
              <div className="p-4 sm:p-5 text-[13px] text-[#EF4444] font-medium flex items-center gap-2 border-r border-[#F3F4F6]">
                <span className="font-bold text-lg leading-none">×</span> {row.traditional}
              </div>
              <div className="p-4 sm:p-5 text-[13px] text-[#2FBF71] font-black flex items-center gap-2">
                <span className="font-bold text-lg leading-none">✓</span> {row.womup}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

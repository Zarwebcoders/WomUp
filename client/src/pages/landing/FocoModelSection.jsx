import React, { useState } from 'react';

const focoCards = [
  {
    icon: '🏢',
    title: 'Group Ownership',
    color: '#7A3FF2',
    bg: 'bg-gradient-to-br from-[#F5EDFF] to-[#EDE0FF]',
    short: 'Own together, prosper together.',
    detail: 'Multiple partners come together to own premium franchise assets. You hold a stake in a real, product-based retail business without managing daily operations.',
  },
  {
    icon: '⚙️',
    title: 'Company Operations',
    color: '#3B82F6',
    bg: 'bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]',
    short: 'We run it. You earn from it.',
    detail: "WOMUP's expert team handles everything — staffing, inventory, sales, customer service. You enjoy returns without operational headaches.",
  },
  {
    icon: '📊',
    title: 'Profit Sharing',
    color: '#2FBF71',
    bg: 'bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]',
    short: 'Real income from real business.',
    detail: 'Profits are distributed transparently based on your participation tier. Token-based model ensures traceable and verifiable income for every member.',
  },
  {
    icon: '💸',
    title: 'Multiple Income Streams',
    color: '#F6C453',
    bg: 'bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7]',
    short: 'Joining + Repurchase + Team growth.',
    detail: 'Earn from joining income (7 levels), repurchase income (token shopping), Silver/Gold bonuses, and team-building rewards — all from one platform.',
  },
];

export default function FocoModelSection() {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="model" className="py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#7A3FF214] border border-[#7A3FF2] text-[#7A3FF2] mb-3">
            The FOCO Advantage
          </span>
          <div className="w-[60px] h-1 bg-gradient-to-r from-[#7A3FF2] to-[#F6C453] rounded-full mx-auto mb-5" />
          <h2 className="text-[clamp(28px,5vw,42px)] font-extrabold text-[#1F2937] mb-3">
            Why WOMUP <span className="bg-gradient-to-r from-[#7A3FF2] via-[#C084FC] to-[#F6C453] bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-[17px] text-[#6B7280] max-w-[600px] mx-auto">
            A seamless model where you <strong>own</strong> the franchise and WOMUP <strong>operates</strong> it — combining the best of ownership and professional management.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {focoCards.map((card, i) => (
            <div
              key={i}
              className={`bg-white border border-[#7A3FF2] rounded-[24px] shadow-[0_4px_24px_rgba(122,63,242,0.08)] transition-all duration-300 p-5 hover:shadow-[0_12px_40px_rgba(122,63,242,0.15)] hover:-translate-y-1 cursor-default ${
                hovered === i ? 'ring-2 ring-[#7A3FF2]' : ''
              }`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={hovered === i ? { borderColor: card.color } : {}}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 ${card.bg}`}>
                {card.icon}
              </div>
              <h3 className="text-[17px] font-extrabold text-[#1F2937] mb-2">{card.title}</h3>
              <p className="text-[13px] text-[#6B7280] leading-relaxed">
                {hovered === i ? card.detail : card.short}
              </p>
              {hovered !== i && (
                <div
                  className="mt-4 text-[12px] font-bold transition-colors"
                  style={{ color: card.color }}
                >
                  Hover to learn more →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

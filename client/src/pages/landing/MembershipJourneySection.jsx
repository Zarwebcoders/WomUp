import React from 'react';

const milestones = [
  {
    tier: 'Active Member',
    icon: '🌱',
    badge: 'STARTER',
    color: '#2FBF71',
    bgGrad: 'bg-[#F0FDF4]',
    borderColor: 'border-[#2FBF71]',
    lightBorder: 'border-[#2FBF71]',
    requirement: 'Monthly purchase of ₹5,000',
    rewards: [
      'Token shopping benefits',
      'Joining income eligibility',
      'Repurchase income access',
      '₹2,000/month support (women)',
    ],
  },
  {
    tier: 'Silver Member',
    icon: '⭐',
    badge: 'GROWING',
    color: '#6B7280',
    bgGrad: 'bg-[#F9FAFB]',
    borderColor: 'border-[#9CA3AF]',
    lightBorder: 'border-[#9CA3AF]',
    requirement: '30 Direct Active Members',
    rewards: [
      'All Active benefits',
      'Silver bonus income',
      'Priority partner access',
      'Expanded team income levels',
    ],
  },
  {
    tier: 'Gold Member',
    icon: '👑',
    badge: 'LEADER',
    color: '#F6C453',
    bgGrad: 'bg-[#FFFBEB]',
    borderColor: 'border-[#F6C453]',
    lightBorder: 'border-[#F6C453]',
    requirement: '5 Silver Members under you',
    rewards: [
      'All Silver benefits',
      'Gold leadership bonus',
      'Maximum repurchase income',
      'Franchise expansion rights',
    ],
  },
];

export default function MembershipJourneySection() {
  return (
    <section id="journey" className="py-10 px-6 bg-[#FAF7FF]">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#7A3FF214] border border-[#7A3FF2] text-[#7A3FF2] mb-3">
            Membership Tiers
          </span>
          <div className="w-[60px] h-1 bg-gradient-to-r from-[#7A3FF2] to-[#F6C453] rounded-full mx-auto mb-5" />
          <h2 className="text-[clamp(28px,5vw,42px)] font-extrabold text-[#1F2937] mb-3">
            Your Membership <span className="bg-gradient-to-r from-[#7A3FF2] via-[#C084FC] to-[#F6C453] bg-clip-text text-transparent">Growth Journey</span>
          </h2>
          <p className="text-[17px] text-[#6B7280] max-w-[600px] mx-auto">
            Progress from Active → Silver → Gold and unlock exponentially greater income, rewards, and leadership benefits at each milestone.
          </p>
        </div>

        <div className="flex flex-col gap-0 max-w-[800px] mx-auto">
          {milestones.map((m, i) => (
            <div key={i} className="flex gap-0 items-stretch">
              {/* Left Connector */}
              <div className="flex flex-col items-center mr-6">
                <div className={`w-16 h-16 min-h-[64px] rounded-full ${m.bgGrad} ${m.borderColor} border-[3px] flex items-center justify-center text-3xl shadow-lg`}>
                  {m.icon}
                </div>
                {i < milestones.length - 1 && (
                  <div 
                    className="flex-1 w-0.5 min-h-[32px] my-2" 
                    style={{ background: `linear-gradient(180deg, ${m.color}, ${milestones[i+1].color})` }}
                  />
                )}
              </div>

              {/* Card */}
              <div className={`flex-1 ${i < milestones.length - 1 ? 'mb-6' : ''} bg-white ${m.lightBorder} border-2 rounded-[20px] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-xl transition-all duration-300`}>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-black text-[#1F2937] flex-1">{m.tier}</h3>
                  <span className={`text-[10px] font-extrabold ${m.bgGrad} border ${m.lightBorder} rounded-full px-2.5 py-1 tracking-widest uppercase`} style={{ color: m.color }}>{m.badge}</span>
                </div>
                <div className={`flex items-center gap-2 mb-4 ${m.bgGrad} rounded-[10px] px-3.5 py-2 border ${m.lightBorder}`}>
                  <span className="text-[13px] font-bold" style={{ color: m.color }}>📌 Requirement:</span>
                  <span className="text-[13px] font-extrabold text-[#1F2937]">{m.requirement}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {m.rewards.map((r, j) => (
                    <div key={j} className="flex items-center gap-2 text-[13px] text-[#374151] font-semibold">
                      <span className="text-lg font-black" style={{ color: m.color }}>✓</span> {r}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';

const tabs = ['Joining Income', 'Repurchase Income', 'Team Growth'];

const joiningLevels = [
  { level: 1, tokens: 400, desc: 'Direct referrals', color: '#7A3FF2' },
  { level: 2, tokens: 200, desc: 'Level 2 team', color: '#9B6FF5' },
  { level: 3, tokens: 160, desc: 'Level 3 team', color: '#3B82F6' },
  { level: 4, tokens: 120, desc: 'Level 4 team', color: '#2FBF71' },
  { level: 5, tokens: 100, desc: 'Level 5 team', color: '#F6C453' },
  { level: 6, tokens: 80, desc: 'Level 6 team', color: '#F97316' },
  { level: 7, tokens: 80, desc: 'Level 7 team', color: '#EC4899' },
];

const teamGrowth = [
  { members: 50, desc: 'Your starter network — build daily habits' },
  { members: 200, desc: 'First significant income milestone' },
  { members: 1000, desc: 'Silver leader territory' },
  { members: 5000, desc: 'Gold leader + passive income growing' },
  { members: 50000, desc: 'Top franchise income zone — ₹11L+/month' },
  { members: 200000, desc: '2 Lakh team — maximum earning bracket' },
];

export default function IncomeTabsSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="income" className="py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#7A3FF214] border border-[#7A3FF2] text-[#7A3FF2] mb-3">
            Income Opportunity
          </span>
          <div className="w-[60px] h-1 bg-gradient-to-r from-[#7A3FF2] to-[#F6C453] rounded-full mx-auto mb-5" />
          <h2 className="text-[clamp(28px,5vw,42px)] font-extrabold text-[#1F2937] mb-3">
            Multiple Ways to <span className="bg-gradient-to-r from-[#7A3FF2] via-[#C084FC] to-[#F6C453] bg-clip-text text-transparent">Earn with WOMUP</span>
          </h2>
          <p className="text-[17px] text-[#6B7280] max-w-[600px] mx-auto">
            Joining income, repurchase income, and team growth bonuses — layered income streams that compound as your network grows.
          </p>
        </div>

        {/* Tab nav */}
        <div className="flex gap-2 mb-10 bg-[#FAF7FF] border border-[#7A3FF2] rounded-[16px] p-1.5 max-w-[520px] mx-auto shadow-inner">
          {tabs.map((t, i) => (
            <button
              key={i}
              id={`income-tab-${i}`}
              onClick={() => setActiveTab(i)}
              className={`flex-1 py-3 px-2 rounded-[12px] font-bold text-[13px] font-poppins transition-all duration-200 ${
                activeTab === i 
                  ? 'bg-gradient-to-br from-[#7A3FF2] to-[#9B6FF5] text-white shadow-[0_4px_12px_rgba(122,63,242,0.3)]' 
                  : 'bg-transparent text-[#6B7280] hover:text-[#7A3FF2]'
              }`}
            >{t}</button>
          ))}
        </div>

        {/* Tab 0 — Joining Income */}
        {activeTab === 0 && (
          <div className="animate-fadeIn">
            <p className="text-center text-[#6B7280] mb-8 text-[14px] font-medium italic">
              Earn tokens when your team members join WOMUP across 7 levels of your network.
            </p>
            <div className="flex flex-col gap-3.5 max-w-[640px] mx-auto">
              {joiningLevels.map((l, i) => {
                const barW = `${(l.tokens / 400) * 100}%`;
                return (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] rounded-full text-white flex items-center justify-center text-[13px] font-black shadow-sm" style={{ backgroundColor: l.color }}>{l.level}</div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[13px] font-bold text-[#1F2937]">{l.desc}</span>
                        <span className="text-[13px] font-extrabold" style={{ color: l.color }}>{l.tokens} tokens</span>
                      </div>
                      <div className="bg-[#F3F4F6] rounded-full h-2 overflow-hidden shadow-inner">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: barW, backgroundColor: l.color, backgroundImage: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2))` }} 
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 1 — Repurchase */}
        {activeTab === 1 && (
          <div className="max-w-[640px] mx-auto animate-fadeIn">
            <div className="bg-white border border-[#7A3FF2] rounded-[24px] shadow-[0_4px_24px_rgba(122,63,242,0.08)] p-9 sm:p-10 text-center">
              <div className="text-[56px] mb-4">🔄</div>
              <h3 className="text-[22px] font-extrabold text-[#1F2937] mb-3">50% Repurchase Rule</h3>
              <p className="text-[15px] text-[#6B7280] leading-relaxed mb-8 font-medium">
                When your team members shop at partner stores, 50% of tokens generated from their purchases flow upward as <strong>repurchase income</strong> to you. The more your team shops, the more passive income you earn — every month, automatically.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  { label: 'Team Shopping', icon: '🛍️', val: '₹1,00,000', color: '#7A3FF2' },
                  { label: '20% Token Rate', icon: '🪙', val: '20,000 tokens', color: '#3B82F6' },
                  { label: 'Your 50% Share', icon: '💰', val: '10,000 tokens', color: '#2FBF71' },
                ].map((item, i) => (
                  <div key={i} className="bg-[#FAF7FF] border border-[#7A3FF2] rounded-[16px] p-5 min-w-[150px] text-center hover:shadow-md transition-shadow">
                    <div className="text-2xl mb-1.5">{item.icon}</div>
                    <div className="text-[14px] font-black text-[#1F2937]">{item.val}</div>
                    <div className="text-[11px] text-[#9CA3AF] mt-0.5 font-bold uppercase tracking-wider">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2 — Team Growth */}
        {activeTab === 2 && (
          <div className=" mx-auto animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 gap-y-10">
              {teamGrowth.map((row, i) => (
                <div key={i} className="bg-white border border-[#7A3FF2] rounded-[24px] shadow-[0_4px_24px_rgba(122,63,242,0.08)] p-5 sm:p-6 flex items-center gap-5 hover:shadow-lg transition-all duration-300 hover:translate-x-3">
                  <div 
                    className="w-14 h-14 min-w-[56px] rounded-2xl flex items-center justify-center font-black text-sm text-white font-poppins shadow-sm"
                    style={{ backgroundColor: `hsl(${260 - i * 30}, 70%, 60%)` }}
                  >
                    {row.members >= 1000 ? `${row.members / 1000}K` : row.members}
                  </div>
                  <div>
                    <div className="font-extrabold text-[16px] text-[#1F2937]">{row.members.toLocaleString('en-IN')} Members</div>
                    <div className="text-[13px] text-[#6B7280] mt-0.5 font-medium">{row.desc}</div>
                  </div>
                  <div className="ml-auto text-xl">{i === 0 ? '🌱' : i === 1 ? '🌿' : i === 2 ? '🌳' : i === 3 ? '⭐' : i === 4 ? '🏆' : '👑'}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

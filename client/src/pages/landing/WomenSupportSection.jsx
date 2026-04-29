import React from 'react';

const steps = [
  {
    num: '01',
    icon: '📋',
    title: 'Submit Application',
    desc: 'Fill a simple online form with your name, city, and income goal. No complex documents required to start.',
  },
  {
    num: '02',
    icon: '✅',
    title: 'Eligibility Check',
    desc: 'Our team reviews your application and confirms your active membership status within 2–3 working days.',
  },
  {
    num: '03',
    icon: '💰',
    title: 'Monthly Support Activated',
    desc: 'Eligible women members receive ₹2,000/month household support to empower financial independence from Day 1.',
  },
];

export default function WomenSupportSection() {
  return (
    <section className="py-10 px-6 bg-[#FAF7FF]">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#7A3FF214] border border-[#7A3FF2] text-[#7A3FF2] mb-3">
            Women Empowerment
          </span>
          <div className="w-[60px] h-1 bg-gradient-to-r from-[#7A3FF2] to-[#F6C453] rounded-full mx-auto mb-5" />
          <h2 className="text-[clamp(28px,5vw,42px)] font-extrabold text-[#1F2937] mb-3">
            Financial Support <span className="bg-gradient-to-r from-[#7A3FF2] via-[#C084FC] to-[#F6C453] bg-clip-text text-transparent">Model for Women</span>
          </h2>
          <p className="text-[17px] text-[#6B7280] max-w-[600px] mx-auto">
            WOMUP's unique ₹2,000/month support initiative helps women members achieve household financial empowerment while building their franchise journey.
          </p>
        </div>

        {/* Timeline */}
        <div className="flex flex-col gap-0 max-w-[720px] mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-10 top-14 bottom-16 w-0.5 bg-gradient-to-b from-[#7A3FF2] to-[#F6C453] rounded-full z-0" />

          {steps.map((step, i) => (
            <div key={i} className={`flex gap-7 items-start relative z-10 ${i < steps.length - 1 ? 'mb-10' : ''}`}>
              {/* Circle */}
              <div className="w-20 h-20 min-w-[80px] rounded-full bg-gradient-to-br from-[#7A3FF2] to-[#9B6FF5] flex flex-col items-center justify-center shadow-[0_8px_24px_rgba(122,63,242,0.3)] text-white font-poppins">
                <span className="text-xl">{step.icon}</span>
                <span className="text-[10px] font-extrabold opacity-80">{step.num}</span>
              </div>

              <div className="flex-1 bg-white border border-[#7A3FF2] rounded-[24px] shadow-[0_4px_24px_rgba(122,63,242,0.08)] p-6 mt-2 hover:shadow-[0_12px_40px_rgba(122,63,242,0.15)] transition-all duration-300">
                <h3 className="text-lg font-extrabold text-[#1F2937] mb-2">{step.title}</h3>
                <p className="text-[14px] text-[#6B7280] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Banner */}
        <div className="mt-12 bg-gradient-to-br from-[#7A3FF2] to-[#9B6FF5] rounded-[24px] p-8 sm:p-10 flex flex-wrap items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="text-[13px] text-white/75 font-semibold mb-1">Monthly Household Support</div>
            <div className="text-[clamp(28px,5vw,44px)] font-black text-[#F6C453] font-poppins leading-none">₹2,000 / month</div>
            <div className="text-[13px] text-white/80 mt-2 font-medium">For active women members · 60-day refund protected</div>
          </div>
          <div className="flex flex-col gap-2.5">
            {['Active membership required', 'Application-based eligibility', 'Monthly disbursement', 'Empowering 1000s of households'].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-white text-[13px] font-bold">
                <span className="text-[#F6C453] text-lg">✓</span> {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';

const faqs = [
  { q: 'Is this franchise or membership?', a: 'WOMUP is a FOCO-based franchise model where you own a stake and the company operates it. You also get a membership which gives you shopping benefits and token income — both combined into one platform.' },
  { q: 'How does token income work?', a: 'Every purchase at partner stores generates tokens based on your membership tier (5%, 10%, or 20%). These tokens are distributed as joining income (7 levels) and repurchase income (50% from team purchases).' },
  { q: 'How does the 60-day refund policy work?', a: 'If within 60 days of joining you feel WOMUP is not for you, you can request a full refund of your joining fee through our official support channel — no questions asked.' },
  { q: 'How do I become a Silver Member?', a: 'To achieve Silver status, you need to maintain your own monthly purchase of ₹5,000 and have at least 30 directly enrolled active members under you.' },
  { q: 'How do I become a Gold Member?', a: 'Gold status requires having at least 5 Silver Members directly under you. Once achieved, you unlock maximum repurchase income and franchise expansion rights.' },
  { q: 'How much investment is required?', a: 'The joining fee is affordable and designed for women and middle-class families. Contact us via WhatsApp or the form below to get the latest joining fee details.' },
  { q: 'Is WOMUP legally registered?', a: 'Yes, WOMUP operates as a fully registered and legally compliant company. The entire income plan, token model, and refund policy are documented and transparent.' },
  { q: 'Can I join part-time?', a: 'Absolutely! WOMUP is designed to be flexible. You can start part-time, build your team gradually, and transition to full-time as your income grows.' },
];

export default function FaqSection() {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" className="py-10 px-6 bg-[#FAF7FF]">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#7A3FF214] border border-[#7A3FF2] text-[#7A3FF2] mb-3">
            FAQs
          </span>
          <div className="w-[60px] h-1 bg-gradient-to-r from-[#7A3FF2] to-[#F6C453] rounded-full mx-auto mb-5" />
          <h2 className="text-[clamp(28px,5vw,42px)] font-extrabold text-[#1F2937] mb-3">
            Your Questions <span className="bg-gradient-to-r from-[#7A3FF2] via-[#C084FC] to-[#F6C453] bg-clip-text text-transparent">Answered</span>
          </h2>
          <p className="text-[17px] text-[#6B7280] max-w-[600px] mx-auto">
            Everything you need to know before you start your WOMUP journey.
          </p>
        </div>

        <div className=" mx-auto grid grid-cols-2 gap-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`bg-white border rounded-[24px] overflow-hidden transition-all duration-300 shadow-sm ${
                open === i ? 'border-[#7A3FF2] shadow-md' : 'border-[#7A3FF2] hover:shadow-md'
              }`}
            >
              <button
                id={`faq-btn-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
                className={`w-full flex items-center justify-between p-5 sm:p-6 text-left transition-colors gap-4 ${
                  open === i ? 'bg-[#FAF7FF]/50' : 'bg-white hover:bg-[#FAF7FF]/30'
                }`}
              >
                <span className="text-[15px] sm:text-base font-extrabold text-[#1F2937] leading-tight flex-1">{faq.q}</span>
                <span className={`w-8 h-8 min-w-[32px] rounded-full flex items-center justify-center text-xl transition-all duration-300 font-bold ${
                  open === i 
                    ? 'bg-gradient-to-br from-[#7A3FF2] to-[#9B6FF5] text-white rotate-45' 
                    : 'bg-[#F3F4F6] text-[#7A3FF2]'
                }`}>+</span>
              </button>
              {open === i && (
                <div className="px-6 pb-6 pt-4 border-t border-[#F3F4F6] text-[14px] text-[#6B7280] leading-relaxed font-semibold animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

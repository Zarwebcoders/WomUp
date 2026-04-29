import React, { useState } from 'react';

const testimonials = [
  {
    name: 'Priya Sharma',
    city: 'Ahmedabad',
    role: 'Active Member · Silver Track',
    quote: 'WOMUP ne meri zindagi badal di. Pehle sirf ghar ka kaam, ab main ₹18,000 har mahine kamaati hoon apne token income se!',
    avatar: '👩',
    stars: 5,
  },
  {
    name: 'Rekha Patel',
    city: 'Surat',
    role: 'Gold Member · Team Leader',
    quote: 'Maine 6 mahine mein 200+ log jode. Ab mera poora parivaar shopping karta hai aur income bhi milta hai. Bahut transparent system hai.',
    avatar: '👩‍💼',
    stars: 5,
  },
  {
    name: 'Sunita Verma',
    city: 'Jaipur',
    role: 'Franchise Partner',
    quote: 'Mujhe investment ki chinta nahi thi. FOCO model ne sab manage kiya. Main sirf apni team grow kar rahi hoon aur income aa raha hai.',
    avatar: '🧑‍🤝‍🧑',
    stars: 5,
  },
  {
    name: 'Meena Joshi',
    city: 'Pune',
    role: 'Active Member',
    quote: 'Refund policy dekh ke hi mujhe confidence aaya. 60 din ka guarantee. Aur ab mujhe zaroorat hi nahi padega refund ki — bahut acha business hai!',
    avatar: '👩‍🦰',
    stars: 5,
  },
];

export default function TestimonialsSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section id="testimonials" className="py-10 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#7A3FF214] border border-[#7A3FF2] text-[#7A3FF2] mb-3">
            Success Stories
          </span>
          <div className="w-[60px] h-1 bg-gradient-to-r from-[#7A3FF2] to-[#F6C453] rounded-full mx-auto mb-5" />
          <h2 className="text-[clamp(28px,5vw,42px)] font-extrabold text-[#1F2937] mb-3">
            Real Women. <span className="bg-gradient-to-r from-[#7A3FF2] via-[#C084FC] to-[#F6C453] bg-clip-text text-transparent">Real Income.</span>
          </h2>
          <p className="text-[17px] text-[#6B7280] max-w-[600px] mx-auto">
            Hear directly from WOMUP members who transformed their lives through smart shopping and franchise building.
          </p>
        </div>

        {/* Active testimonial */}
        <div className="max-w-[680px] mx-auto mb-8 animate-fadeIn">
          <div className="bg-white border border-[#7A3FF2] rounded-[24px] shadow-[0_4px_24px_rgba(122,63,242,0.08)] p-10 text-center relative overflow-hidden">
            <div className="absolute top-[-20px] left-[-20px] text-[120px] opacity-[0.03] select-none text-[#7A3FF2]">“</div>
            <div className="text-6xl mb-4 relative z-10">{testimonials[activeIdx].avatar}</div>
            <div className="text-2xl mb-5 tracking-tighter text-[#F6C453] font-bold relative z-10">
              {'★'.repeat(testimonials[activeIdx].stars)}
            </div>
            <p className="text-[17px] sm:text-lg text-[#374151] leading-relaxed mb-6 font-medium italic relative z-10">
              "{testimonials[activeIdx].quote}"
            </p>
            <div className="font-black text-lg text-[#1F2937]">{testimonials[activeIdx].name}</div>
            <div className="text-[13px] text-[#7A3FF2] font-bold mt-1 uppercase tracking-wider">{testimonials[activeIdx].role}</div>
            <div className="text-[11px] text-[#9CA3AF] mt-1 font-bold">📍 {testimonials[activeIdx].city}</div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex justify-center gap-3 flex-wrap">
          {testimonials.map((t, i) => (
            <button
              key={i}
              id={`testimonial-btn-${i}`}
              onClick={() => setActiveIdx(i)}
              className={`flex items-center gap-3 px-4 py-3 rounded-[16px] border-2 transition-all duration-300 font-poppins ${
                activeIdx === i 
                  ? 'border-[#7A3FF2] bg-[#F5EDFF] shadow-md -translate-y-0.5' 
                  : 'border-gray-300 bg-white hover:border-[#7A3FF280] text-[#6B7280] hover:text-[#7A3FF2]'
              }`}
            >
              <span className="text-2xl">{t.avatar}</span>
              <div className="text-left">
                <div className={`text-[13px] font-black ${activeIdx === i ? 'text-[#7A3FF2]' : 'text-[#1F2937]'}`}>{t.name}</div>
                <div className="text-[11px] font-bold opacity-60 uppercase tracking-tighter">{t.city}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Video CTA */}
        <div className="mt-12 bg-gradient-to-br from-[#F5EDFF] to-[#FAF7FF] rounded-[24px] p-8 sm:p-10 flex flex-wrap items-center justify-between gap-6 shadow-sm border border-[#7A3FF2]">
          <div>
            <div className="font-black text-[20px] text-[#1F2937] mb-1.5 flex items-center gap-2">
              <span className="text-2xl">🎥</span> Watch Franchise Presentation
            </div>
            <p className="text-[14px] text-[#6B7280] font-semibold">Full WOMUP business plan explained in under 15 minutes.</p>
          </div>
          <a
            href="https://wa.me/919999999999?text=Hi%20WOMUP%2C%20please%20share%20the%20presentation%20video"
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-[#7A3FF2] to-[#9B6FF5] text-white px-8 py-3.5 rounded-[14px] font-bold text-sm shadow-[0_8px_24px_rgba(122,63,242,0.2)] hover:shadow-[0_12px_32px_rgba(122,63,242,0.3)] transition-all active:scale-95"
            id="watch-presentation-btn"
          >
            ▶ Request Video
          </a>
        </div>
      </div>
    </section>
  );
}

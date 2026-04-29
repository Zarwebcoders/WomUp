import React, { useState } from 'react';

export default function FinalCtaSection() {
  const [form, setForm] = useState({ name: '', phone: '', city: '', role: 'Member' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contact" className="py-10 px-6 bg-gradient-to-br from-[#FAF7FF] to-[#F5EDFF]">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#7A3FF214] border border-[#7A3FF2] text-[#7A3FF2] mb-3">
            Start Today
          </span>
          <div className="w-[60px] h-1 bg-gradient-to-r from-[#7A3FF2] to-[#F6C453] rounded-full mx-auto mb-5" />
          <h2 className="text-[clamp(28px,5vw,42px)] font-extrabold text-[#1F2937] mb-3 leading-tight">
            Start Building Your Franchise <span className="bg-gradient-to-r from-[#7A3FF2] via-[#C084FC] to-[#F6C453] bg-clip-text text-transparent">With WOMUP Today</span>
          </h2>
          <p className="text-[17px] text-[#6B7280] max-w-[600px] mx-auto font-medium">
            Join thousands of women & entrepreneurs building income, freedom, and community through the WOMUP franchise model.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1000px] mx-auto items-center">
          {/* Left info */}
          <div className="flex flex-col gap-4">
            {[
              { icon: '🤝', label: 'Join Now', desc: 'Become a member and start earning from Day 1', action: 'JOIN', href: '#contact' },
              { icon: '📅', label: 'Book Presentation', desc: 'Schedule a live demo with our franchise advisor', action: 'BOOK', href: 'https://wa.me/919999999999?text=Hi%2C%20I%20want%20to%20book%20a%20presentation' },
              { icon: '📞', label: 'Talk to Advisor', desc: 'Speak directly with our team — no obligation', action: 'CALL', href: 'tel:+919999999999' },
              { icon: '💬', label: 'WhatsApp Join', desc: 'Quick & easy onboarding via WhatsApp', action: 'WHATSAPP', href: 'https://wa.me/919999999999?text=Hi%20WOMUP%2C%20I%20want%20to%20join' },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                id={`cta-${item.action.toLowerCase()}`}
                className="flex items-center gap-4 p-5 bg-white border border-[#7A3FF2] rounded-[16px] shadow-[0_2px_12px_rgba(122,63,242,0.06)] hover:translate-x-3 transition-all duration-300 no-underline group"
              >
                <div className="w-12 h-12 min-w-[48px] rounded-[14px] bg-gradient-to-br from-[#F5EDFF] to-[#EDE0FF] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="font-black text-[15px] text-[#1F2937]">{item.label}</div>
                  <div className="text-[12px] text-[#6B7280] mt-0.5 font-bold">{item.desc}</div>
                </div>
                <span className="text-[#7A3FF2] font-black text-2xl leading-none opacity-40 group-hover:opacity-100 transition-opacity">›</span>
              </a>
            ))}
          </div>

          {/* Right form */}
          <div className="bg-white border border-[#7A3FF2] rounded-[24px] shadow-[0_4px_24px_rgba(122,63,242,0.08)] p-9 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#7A3FF2] opacity-[0.03] rounded-bl-full pointer-events-none" />
            
            {submitted ? (
              <div className="text-center py-10 animate-fadeIn">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="font-black text-[22px] text-[#2FBF71] mb-2">Request Received!</h3>
                <p className="text-[#6B7280] text-[14px] font-bold">Our team will contact you within 24 hours. Welcome to the WOMUP family!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative z-10">
                <h3 className="font-black text-xl text-[#1F2937] mb-6 flex items-center gap-2">
                  <span className="text-[#F6C453]">📄</span> Get the Full Business Plan
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-black text-[#6B7280] ml-1 uppercase tracking-widest">Full Name *</label>
                    <input 
                      id="cta-form-name" 
                      required 
                      className="w-full bg-[#F9FAFB] border-[1.5px] border-[#7A3FF2] rounded-[12px] p-3.5 text-[#1F2937] font-semibold focus:outline-none focus:border-[#7A3FF2] focus:ring-4 focus:ring-[#7A3FF21F] transition-all" 
                      placeholder="Priya Sharma" 
                      value={form.name} 
                      onChange={e => setForm({ ...form, name: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-black text-[#6B7280] ml-1 uppercase tracking-widest">Phone Number *</label>
                    <input 
                      id="cta-form-phone" 
                      required 
                      className="w-full bg-[#F9FAFB] border-[1.5px] border-[#7A3FF2] rounded-[12px] p-3.5 text-[#1F2937] font-semibold focus:outline-none focus:border-[#7A3FF2] focus:ring-4 focus:ring-[#7A3FF21F] transition-all" 
                      placeholder="+91 98765 43210" 
                      type="tel" 
                      value={form.phone} 
                      onChange={e => setForm({ ...form, phone: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-black text-[#6B7280] ml-1 uppercase tracking-widest">City *</label>
                    <input 
                      id="cta-form-city" 
                      required 
                      className="w-full bg-[#F9FAFB] border-[1.5px] border-[#7A3FF2] rounded-[12px] p-3.5 text-[#1F2937] font-semibold focus:outline-none focus:border-[#7A3FF2] focus:ring-4 focus:ring-[#7A3FF21F] transition-all" 
                      placeholder="e.g. Ahmedabad" 
                      value={form.city} 
                      onChange={e => setForm({ ...form, city: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-black text-[#6B7280] ml-1 uppercase tracking-widest">Interested As</label>
                    <div className="relative">
                      <select 
                        id="cta-form-role" 
                        className="w-full bg-[#F9FAFB] border-[1.5px] border-[#7A3FF2] rounded-[12px] p-3.5 text-[#1F2937] font-semibold focus:outline-none focus:border-[#7A3FF2] focus:ring-4 focus:ring-[#7A3FF21F] transition-all appearance-none cursor-pointer" 
                        value={form.role} 
                        onChange={e => setForm({ ...form, role: e.target.value })}
                      >
                        <option>Member</option>
                        <option>Franchise Partner</option>
                        <option>Business Associate</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#7A3FF2] font-black">⌄</div>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    id="cta-form-submit" 
                    className="mt-2 bg-gradient-to-br from-[#7A3FF2] to-[#9B6FF5] text-white py-4 rounded-[14px] font-black text-sm shadow-[0_8px_24px_rgba(122,63,242,0.3)] hover:shadow-[0_12px_32px_rgba(122,63,242,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    Submit & Get Business Plan →
                  </button>
                  <p className="text-[11px] text-[#9CA3AF] text-center font-bold uppercase tracking-wider mt-1">🔒 Your information is 100% private & secure</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

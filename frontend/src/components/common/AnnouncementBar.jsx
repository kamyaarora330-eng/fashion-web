import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-[#141416] text-[#EFECE6] text-[11px] tracking-widest uppercase font-medium py-2 px-4 border-b border-[#2A2A2E]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1 text-center md:text-left">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>Complimentary Express Delivery on orders above ₹1,999 across India</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[10px] text-[#A58256]">
          <span>Use Code: <strong className="text-white tracking-widest">MODERA10</strong> for 10% Off</span>
          <span>•</span>
          <div className="flex items-center gap-1.5 text-[#EFECE6]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>100% Certified Authentic & Handcrafted</span>
          </div>
          <span>•</span>
          <span className="text-[#C5A880]">INR (₹)</span>
        </div>
      </div>
    </div>
  );
}


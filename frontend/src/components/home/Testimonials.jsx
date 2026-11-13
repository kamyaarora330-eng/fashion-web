import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      patron: 'Rohit Mehta',
      city: 'Bandra West, Mumbai',
      piece: 'Artisanal Egyptian Cotton Tuxedo Shirt',
      text: 'The collar architecture and drape are simply faultless. Easily stands alongside Savile Row bespoke tailoring. Delivered in opulent rigid box packaging.',
      rating: 5,
    },
    {
      patron: 'Kavita Chawla',
      city: 'Golf Links, New Delhi',
      piece: 'Mulberry Silk Bias-Cut Column Gown',
      text: 'Wore this for an embassy gala and received ceaseless compliments. The 19-momme silk catches evening light with mesmerizing liquid luster.',
      rating: 5,
    },
    {
      patron: 'Devashish Rao',
      city: 'Indiranagar, Bengaluru',
      piece: 'Handcrafted Italian Wool Overcoat',
      text: 'Finding an overcoat of this virgin wool density in India used to require international trips. MODÉRA has mastered both the cut and the fabric weight.',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-[#FAF9F5] border-t border-[#EAE6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[#A58256] text-xs font-semibold tracking-[0.25em] uppercase">
            PATRON VOICES
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#141416]">
            Words From Our Circle
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div 
              key={idx} 
              className="bg-white p-8 border border-[#EAE6DF] shadow-sm flex flex-col justify-between space-y-6 hover:border-[#C5A880] transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C5A880] text-[#C5A880]" />
                  ))}
                </div>
                <p className="font-editorial text-lg italic text-[#222225] leading-relaxed">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#F2EFE9]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#141416] tracking-wider uppercase">
                      {rev.patron}
                    </h4>
                    <p className="text-[11px] text-[#71717A]">{rev.city}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#A58256] font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </div>
                </div>
                <p className="text-[10px] text-[#A1A1AA] mt-1.5 truncate">
                  Acquired: {rev.piece}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


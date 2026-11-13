import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function EditorialBanner() {
  return (
    <section className="py-20 bg-[#141416] text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Showcase (2 stacked luxury images) */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4 relative">
            <div className="aspect-[3/4] overflow-hidden bg-[#222]">
              <img
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"
                alt="Editorial Craftsmanship 1"
                className="w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden bg-[#222] translate-y-6">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
                alt="Editorial Craftsmanship 2"
                className="w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-2 -left-2 bg-[#C5A880] text-[#141416] p-4 text-center font-serif hidden sm:block">
              <p className="text-2xl font-bold">140s</p>
              <p className="text-[9px] uppercase tracking-widest font-sans font-bold">Egyptian Giza</p>
            </div>
          </div>

          {/* Editorial Text */}
          <div className="lg:col-span-5 space-y-6 lg:pl-6">
            <div className="inline-flex items-center gap-2 text-[#C5A880] text-xs font-semibold tracking-[0.25em] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE ARTISAN MANIFESTO</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Honoring Heritage. <br />
              <span className="italic font-normal text-[#E8D8C3]">Refining Today.</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed font-light">
              Every MODÉRA garment is a dialogue between India’s storied handloom traditions and modern European architectural tailoring. 
              We partner directly with multi-generational master weavers in Chanderi, Maheshwar, and Varanasi, matching them with handpicked Italian virgin wools.
            </p>

            <div className="grid grid-cols-2 gap-4 py-2 border-y border-[#2A2A2E] text-xs">
              <div>
                <p className="text-[#C5A880] font-bold text-lg font-serif">100%</p>
                <p className="text-[#A1A1AA] text-[11px] uppercase tracking-wider">Natural Fibers Only</p>
              </div>
              <div>
                <p className="text-[#C5A880] font-bold text-lg font-serif">Zero</p>
                <p className="text-[#A1A1AA] text-[11px] uppercase tracking-wider">Mass Exploitation</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/shop/sale"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C5A880] text-[#141416] text-xs font-semibold tracking-[0.2em] uppercase hover:bg-white transition-all duration-300"
              >
                <span>EXPLORE ARCHIVE SALE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


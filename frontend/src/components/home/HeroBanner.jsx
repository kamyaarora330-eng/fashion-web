import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative h-[85vh] sm:h-[90vh] w-full overflow-hidden bg-[#141416]">
      {/* Editorial High-Resolution Background */}
      <img
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85"
        alt="MODÉRA Autumn Winter Couture Editorial"
        className="absolute inset-0 w-full h-full object-cover object-center brightness-75 scale-105 transition-transform duration-1000"
      />

      {/* Subtle Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-20 sm:pb-28">
        <div className="max-w-2xl space-y-4">
          <p className="text-[#C5A880] text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase">
            AUTUMN / WINTER 2026 COUTURE
          </p>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight">
            Artisanal Grace. <br />
            <span className="italic font-normal text-[#E8D8C3]">Pure Silhouette.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#D5D0C6] font-light max-w-lg leading-relaxed pt-1">
            Hand-tailored Egyptian cottons, grade-6A Mulberry silks, and sculptural virgin wools curated for India's most discerning wardrobes.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to="/shop/women"
              className="px-8 py-3.5 bg-[#FAF9F5] text-[#141416] text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#C5A880] hover:text-white transition-all duration-300 flex items-center gap-2 group shadow-lg"
            >
              <span>EXPLORE WOMEN</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/shop/men"
              className="px-8 py-3.5 bg-transparent border border-white text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-white hover:text-[#141416] transition-all duration-300 flex items-center gap-2 group"
            >
              <span>EXPLORE MEN</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


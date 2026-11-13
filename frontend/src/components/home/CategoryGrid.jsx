import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function CategoryGrid() {
  const dualSpotlights = [
    {
      title: "THE MEN'S ATELIER",
      subtitle: "Tailored Shirts, Virgin Wool Overcoats & Raw Silk Kurtas",
      image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=80",
      link: "/shop/men",
      buttonText: "SHOP MEN'S COLLECTION",
    },
    {
      title: "THE WOMEN'S ATELIER",
      subtitle: "Mulberry Silk Gowns, Chanderi Sarees & Structured Linen",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
      link: "/shop/women",
      buttonText: "SHOP WOMEN'S COLLECTION",
    },
  ];

  const categoryCards = [
    {
      name: "Tuxedo & Dress Shirts",
      category: "Men's Luxury",
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
      link: "/shop/men?category=men-shirts",
    },
    {
      name: "Mulberry Silk Gowns",
      category: "Women's Evening",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
      link: "/shop/women?category=women-dresses",
    },
    {
      name: "Handwoven Chanderi",
      category: "Heritage Sarees",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
      link: "/shop/women?category=women-ethnic",
    },
    {
      name: "Italian Virgin Wool",
      category: "Overcoats & Blazers",
      image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=600&q=80",
      link: "/shop/men?category=men-jackets",
    },
  ];

  return (
    <section className="py-20 bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Dual Primary Spotlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {dualSpotlights.map((spotlight, idx) => (
            <div 
              key={idx}
              className="relative aspect-[4/5] sm:aspect-[16/11] overflow-hidden group bg-[#141416]"
            >
              <img
                src={spotlight.image}
                alt={spotlight.title}
                className="w-full h-full object-cover object-top luxury-image-hover brightness-90 group-hover:brightness-75 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-end text-white space-y-3">
                <span className="text-[#C5A880] text-xs font-semibold tracking-[0.25em] uppercase">
                  MODÉRA CURATION
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
                  {spotlight.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#D5D0C6] max-w-md font-light">
                  {spotlight.subtitle}
                </p>
                <div className="pt-2">
                  <Link
                    to={spotlight.link}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#FAF9F5] text-[#141416] text-xs tracking-[0.2em] font-semibold uppercase hover:bg-[#C5A880] hover:text-white transition-all shadow-md group-hover:translate-x-1 duration-300"
                  >
                    <span>{spotlight.buttonText}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Editorial Categories Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[#A58256] text-xs font-semibold tracking-[0.25em] uppercase">
              DISTINCTIVE CATEGORIES
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#141416]">
              Curated Wardrobe Pillars
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categoryCards.map((card, idx) => (
              <Link
                key={idx}
                to={card.link}
                className="group relative aspect-[3/4] overflow-hidden bg-[#ECE8DF] block"
              >
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover object-top luxury-image-hover brightness-95 group-hover:brightness-90 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 text-white flex flex-col justify-end">
                  <span className="text-[10px] text-[#C5A880] tracking-widest uppercase font-medium">
                    {card.category}
                  </span>
                  <h4 className="font-serif text-base sm:text-lg font-bold group-hover:text-[#E8D8C3] transition-colors">
                    {card.name}
                  </h4>
                  <span className="text-[11px] font-medium tracking-wider text-white/80 flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Discover Pieces <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A880]" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}


import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, CreditCard, Award, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#141416] text-[#EFECE6] border-t border-[#2A2A2E] pt-16 pb-12">
      {/* Brand Values Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-[#2A2A2E]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <Truck className="w-6 h-6 text-[#C5A880]" />
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white">Pan-India Express</h4>
            <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
              Complimentary on acquisitions exceeding ₹1,999. Expedited insured transit.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <Award className="w-6 h-6 text-[#C5A880]" />
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white">Haute Artisanal Craft</h4>
            <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
              Egyptian Giza cotton, pure Mulberry silks & Italian virgin wools.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <RotateCcw className="w-6 h-6 text-[#C5A880]" />
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white">7-Day Curated Returns</h4>
            <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
              Hassle-free doorstep exchanges across all major Indian metro zones.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#C5A880]" />
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white">Verified Razorpay Gateway</h4>
            <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
              Bank-grade 256-bit encryption. UPI, Cards, NetBanking & COD supported.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl font-bold tracking-[0.2em] text-white">
                MODÉRA
              </span>
              <span className="block text-[9px] font-sans tracking-[0.4em] uppercase text-[#C5A880] mt-0.5">
                HAUTE COUTURE • INDIA
              </span>
            </Link>
            <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-sm">
              MODÉRA reimagines contemporary sartorial excellence for the modern Indian connoisseur. 
              Subtle minimalism harmonized with artisanal heritage tailoring.
            </p>
            <div className="pt-2 text-xs text-[#C5A880] flex items-center gap-2">
              <span>Flagship Atelier: Nariman Point, Mumbai</span>
            </div>
          </div>

          {/* Men's Collections */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C5A880]">Men's Atelier</h4>
            <ul className="space-y-2 text-xs text-[#A1A1AA]">
              <li><Link to="/shop/men?category=men-shirts" className="hover:text-white transition-colors">Tuxedo & Dress Shirts</Link></li>
              <li><Link to="/shop/men?category=men-tshirts" className="hover:text-white transition-colors">Heavyweight Supima Tees</Link></li>
              <li><Link to="/shop/men?category=men-jackets" className="hover:text-white transition-colors">Italian Wool Overcoats</Link></li>
              <li><Link to="/shop/men?category=men-ethnic" className="hover:text-white transition-colors">Raw Silk Kurtas & Bundis</Link></li>
              <li><Link to="/shop/men?category=men-trousers" className="hover:text-white transition-colors">Pleated Wool Trousers</Link></li>
            </ul>
          </div>

          {/* Women's Collections */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C5A880]">Women's Atelier</h4>
            <ul className="space-y-2 text-xs text-[#A1A1AA]">
              <li><Link to="/shop/women?category=women-dresses" className="hover:text-white transition-colors">Mulberry Silk Gowns</Link></li>
              <li><Link to="/shop/women?category=women-ethnic" className="hover:text-white transition-colors">Handwoven Chanderi Sarees</Link></li>
              <li><Link to="/shop/women?category=women-coord-sets" className="hover:text-white transition-colors">Tailored Linen Co-ords</Link></li>
              <li><Link to="/shop/women?category=women-tops" className="hover:text-white transition-colors">Architectural Poplin Blouses</Link></li>
              <li><Link to="/shop/women?category=women-jackets" className="hover:text-white transition-colors">Sculpted Blazers</Link></li>
            </ul>
          </div>

          {/* Client Concierge & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C5A880]">Client Concierge</h4>
            <ul className="space-y-2 text-xs text-[#A1A1AA]">
              <li><Link to="/track-order" className="hover:text-white transition-colors flex items-center gap-1">Track Consignment <ArrowUpRight className="w-3 h-3 text-[#C5A880]" /></Link></li>
              <li><Link to="/policies/shipping" className="hover:text-white transition-colors">Shipping & Delivery Policies</Link></li>
              <li><Link to="/policies/returns" className="hover:text-white transition-colors">Returns & Refund Framework</Link></li>
              <li><Link to="/policies/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/policies/terms" className="hover:text-white transition-colors">Terms of Service & GST</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Legal & Payment Badges Bottom Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#2A2A2E] text-[11px] text-[#71717A] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          © {new Date().getFullYear()} MODÉRA Luxury Fashion Pvt. Ltd. All rights reserved. GST Registered.
        </div>
        <div className="flex items-center space-x-3 text-xs text-[#A1A1AA]">
          <span className="px-2 py-0.5 border border-[#38383E] rounded text-[10px]">RAZORPAY</span>
          <span className="px-2 py-0.5 border border-[#38383E] rounded text-[10px]">UPI</span>
          <span className="px-2 py-0.5 border border-[#38383E] rounded text-[10px]">RUPAY</span>
          <span className="px-2 py-0.5 border border-[#38383E] rounded text-[10px]">VISA</span>
          <span className="px-2 py-0.5 border border-[#38383E] rounded text-[10px]">MASTERCARD</span>
          <span className="px-2 py-0.5 border border-[#38383E] rounded text-[10px]">COD</span>
        </div>
      </div>
    </footer>
  );
}


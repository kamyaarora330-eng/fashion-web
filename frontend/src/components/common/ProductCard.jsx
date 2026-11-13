import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useCartStore } from '../../store/useCartStore';

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  const wishlisted = isWishlisted(product.id);
  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80';
  const secondaryImage = product.images?.[1]?.url || primaryImage;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to first variant
    const defaultVariant = product.variants?.[0] || {
      id: `var-${product.id}-default`,
      size: 'M',
      colorName: 'Standard',
      colorHex: '#141416',
      stock: 10,
    };
    addToCart(product, defaultVariant, 1);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div 
      className="group relative flex flex-col transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <Link 
        to={`/product/${product.slug}`} 
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE8DF] block"
      >
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          className="h-full w-full object-cover object-top luxury-image-hover"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNewArrival && (
            <span className="bg-[#141416] text-[#EFECE6] text-[9px] font-medium tracking-[0.2em] uppercase px-2 py-0.5">
              NEW SILHOUETTE
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#C5A880] text-[#141416] text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5">
              BEST SELLER
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="bg-[#A58256] text-white text-[9px] font-bold tracking-[0.15em] px-2 py-0.5">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 z-10 ${
            wishlisted
              ? 'bg-[#141416] text-[#C5A880]'
              : 'bg-white/80 backdrop-blur-sm text-[#141416] hover:bg-white hover:text-[#C5A880]'
          }`}
          title={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-between">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-[#FAF9F5] text-[#141416] py-2.5 text-[11px] uppercase tracking-widest font-semibold hover:bg-[#C5A880] hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Quick Bag
          </button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="pt-4 pb-2 flex flex-col flex-grow">
        
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-[11px] text-[#71717A] mb-1">
          <span className="uppercase tracking-[0.15em] text-[#A58256] font-medium">
            {product.category?.name || product.gender}
          </span>
          {product.avgRating && (
            <div className="flex items-center gap-1 text-[#141416]">
              <Star className="w-3 h-3 fill-[#C5A880] text-[#C5A880]" />
              <span className="font-semibold">{product.avgRating}</span>
            </div>
          )}
        </div>

        {/* Product Title */}
        <Link to={`/product/${product.slug}`} className="block">
          <h3 className="font-serif text-sm font-semibold text-[#141416] group-hover:text-[#A58256] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-bold text-[#141416]">
            ₹{product.sellingPrice?.toLocaleString('en-IN')}
          </span>
          {product.originalPrice > product.sellingPrice && (
            <span className="text-xs text-[#A1A1AA] line-through">
              ₹{product.originalPrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Available Color Swatches Indicator */}
        {product.variants && product.variants.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2.5">
            {Array.from(new Set(product.variants.map((v) => v.colorHex))).slice(0, 4).map((hex, i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block"
                style={{ backgroundColor: hex }}
              />
            ))}
            {product.variants.length > 4 && (
              <span className="text-[10px] text-[#71717A]">
                +{product.variants.length - 4}
              </span>
            )}
          </div>
        )}

      </div>
    </div>
  );
}


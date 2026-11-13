import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../store/useWishlistStore';
import ProductCard from '../components/common/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist } = useWishlistStore();

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="border-b border-[#EAE6DF] pb-6">
          <span className="text-[#A58256] text-xs font-semibold tracking-[0.25em] uppercase">
            PATRON CURATIONS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#141416] mt-1">
            My Curated Wishlist ({wishlist.length})
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            Silhouettes saved for your considered acquisition.
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white p-16 border border-[#EAE6DF] text-center space-y-4 max-w-lg mx-auto">
            <Heart className="w-12 h-12 text-[#C5A880] mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#141416]">
              Your Wishlist Is Currently Empty
            </h3>
            <p className="text-xs text-[#71717A] leading-relaxed">
              Explore our current couture runway pieces and tap the heart icon to save your preferred silhouettes.
            </p>
            <Link
              to="/shop/collections"
              className="inline-block px-8 py-3 bg-[#141416] text-[#EFECE6] text-xs font-semibold tracking-widest uppercase hover:bg-[#C5A880] transition-colors"
            >
              Discover Silhouettes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}


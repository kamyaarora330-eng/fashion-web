import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products?search=${encodeURIComponent(searchTerm)}&limit=6`);
        setResults(res.data?.data?.products || []);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (!isOpen) return null;

  const handleSelectProduct = (slug) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleFullSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    onClose();
    navigate(`/shop/collections?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141416]/80 backdrop-blur-md flex flex-col justify-start pt-20 px-4 sm:px-6">
      <div className="max-w-3xl w-full mx-auto bg-[#FAF9F5] shadow-2xl p-6 sm:p-8 border border-[#EAE6DF] relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#141416] hover:text-[#C5A880] p-1 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="font-serif text-xl font-bold tracking-wider text-[#141416] mb-4">
          DISCOVER THE COLLECTION
        </h3>

        <form onSubmit={handleFullSearch} className="relative mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search shirts, dresses, raw silk kurtas, overcoats..."
            autoFocus
            className="w-full bg-white border border-[#D5D0C6] py-3.5 pl-12 pr-4 text-sm text-[#141416] placeholder-[#A1A1AA] focus:outline-none focus:border-[#C5A880] transition-colors"
          />
          <Search className="w-5 h-5 text-[#8A8A93] absolute left-4 top-1/2 -translate-y-1/2" />
          {loading && (
            <Loader2 className="w-4 h-4 text-[#C5A880] animate-spin absolute right-4 top-1/2 -translate-y-1/2" />
          )}
        </form>

        {/* Quick Suggestions / Results */}
        {results.length > 0 ? (
          <div>
            <p className="text-[11px] uppercase tracking-widest text-[#71717A] mb-3">
              Matched Silhouettes ({results.length})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-1">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.slug)}
                  className="flex items-center gap-4 p-2 bg-white border border-[#EAE6DF] hover:border-[#C5A880] transition-all cursor-pointer group"
                >
                  <img
                    src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80'}
                    alt={product.name}
                    className="w-16 h-20 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-[#A58256] font-medium truncate">
                      {product.category?.name || product.gender}
                    </p>
                    <h4 className="text-xs font-semibold text-[#141416] truncate group-hover:text-[#A58256] transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs font-bold text-[#141416] mt-1">
                      ₹{product.sellingPrice?.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#C5A880] opacity-0 group-hover:opacity-100 transition-opacity pr-1" />
                </div>
              ))}
            </div>
          </div>
        ) : searchTerm.trim() && !loading ? (
          <div className="text-center py-8 text-xs text-[#71717A]">
            No silhouettes matched "{searchTerm}". Try exploring "Silk", "Tuxedo", "Kurta", or "Coat".
          </div>
        ) : (
          <div className="text-xs text-[#71717A]">
            <p className="uppercase tracking-widest text-[10px] text-[#A58256] mb-2 font-semibold">
              Trending Inquiries
            </p>
            <div className="flex flex-wrap gap-2">
              {['Egyptian Cotton', 'Chanderi Saree', 'Italian Overcoat', 'Mulberry Silk', 'Linen Co-ord'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchTerm(tag)}
                  className="px-3 py-1 bg-white border border-[#EAE6DF] text-xs hover:border-[#C5A880] transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


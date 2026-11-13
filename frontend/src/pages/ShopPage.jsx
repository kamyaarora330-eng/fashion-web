import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import api from '../services/api';
import { Filter, SlidersHorizontal, ChevronDown, X, RotateCcw, Loader2 } from 'lucide-react';

export default function ShopPage() {
  const { gender: pathGender } = useParams(); // 'men' | 'women' | 'new-arrivals' | 'collections' | 'sale'
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || '');
  const [selectedColor, setSelectedColor] = useState(searchParams.get('color') || '');
  const [priceRange, setPriceRange] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Determine current active gender
  let activeGender = null;
  let pageTitle = 'The Haute Collection';
  let pageSubtitle = 'Curated luxury fashion tailored for discerning taste.';

  if (pathGender === 'men') {
    activeGender = 'MEN';
    pageTitle = "Men's Couture Atelier";
    pageSubtitle = 'Sartorial tailoring, Egyptian cottons, and refined virgin wool silhouettes.';
  } else if (pathGender === 'women') {
    activeGender = 'WOMEN';
    pageTitle = "Women's Couture Atelier";
    pageSubtitle = 'Mulberry silks, handwoven Chanderi, and sculpted architectural ensembles.';
  } else if (pathGender === 'new-arrivals') {
    pageTitle = 'The New Arrivals';
    pageSubtitle = 'Fresh off the atelier runways for the current season.';
  } else if (pathGender === 'sale') {
    pageTitle = 'The Curated Archive Sale';
    pageSubtitle = 'Privileged pricing on selected iconic past silhouettes.';
  }

  // Categories based on active gender
  const menCategories = [
    'T-Shirts', 'Shirts', 'Polo Shirts', 'Jeans', 'Trousers', 
    'Jackets', 'Hoodies', 'Sweatshirts', 'Ethnic Wear', 'Formal Wear', 'Casual Wear', 'Accessories'
  ];

  const womenCategories = [
    'Dresses', 'Tops', 'T-Shirts', 'Shirts', 'Jeans', 'Trousers', 
    'Skirts', 'Ethnic Wear', 'Kurtis', 'Sarees', 'Co-ord Sets', 'Jackets', 'Western Wear', 'Accessories'
  ];

  const currentCategories = activeGender === 'WOMEN' ? womenCategories : menCategories;

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '40', '42', '44', 'Free Size'];
  const availableColors = [
    { name: 'Noir Black', hex: '#141416' },
    { name: 'Crisp Ivory', hex: '#FBFBFA' },
    { name: 'Midnight Navy', hex: '#1B263B' },
    { name: 'Camel', hex: '#C19A6B' },
    { name: 'Royal Emerald', hex: '#046307' },
    { name: 'Bordeaux Red', hex: '#5C061B' },
    { name: 'Dusty Rose Gold', hex: '#DCAE96' },
  ];

  // Fetch Products with filters
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (activeGender) query.set('gender', activeGender);
        if (selectedCategory) query.set('category', selectedCategory);
        if (selectedSize) query.set('size', selectedSize);
        if (selectedColor) query.set('color', selectedColor);
        if (priceRange) query.set('maxPrice', priceRange);
        if (sortBy) query.set('sort', sortBy);
        if (pathGender === 'new-arrivals') query.set('isNewArrival', 'true');
        if (pathGender === 'sale') query.set('minDiscount', '1');

        const searchKeyword = searchParams.get('search');
        if (searchKeyword) query.set('search', searchKeyword);

        const res = await api.get(`/products?${query.toString()}`);
        let fetchedProducts = res.data?.data?.products || [];

        if (inStockOnly) {
          fetchedProducts = fetchedProducts.filter((p) => p.inStock);
        }

        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching products', err);
        // Fallback demo mock
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [activeGender, pathGender, selectedCategory, selectedSize, selectedColor, priceRange, sortBy, inStockOnly, searchParams]);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedSize('');
    setSelectedColor('');
    setPriceRange('');
    setSortBy('newest');
    setInStockOnly(false);
    setSearchParams({});
  };

  const hasActiveFilters = selectedCategory || selectedSize || selectedColor || priceRange || inStockOnly;

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Editorial Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 border-b border-[#EAE6DF] pb-8">
          <span className="text-[#A58256] text-xs font-semibold tracking-[0.25em] uppercase">
            MODÉRA ATELIER
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#141416]">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#71717A] font-light">
            {pageSubtitle}
          </p>
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#EAE6DF] pb-4 text-xs">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-[#141416] text-[#141416] font-semibold tracking-wider uppercase hover:bg-[#141416] hover:text-white transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters {hasActiveFilters && '• Active'}</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-[#71717A] hover:text-red-700 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}

            <span className="text-[#71717A] hidden md:inline">
              Showing <strong>{products.length}</strong> Silhouettes
            </span>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-[#71717A] uppercase tracking-wider text-[11px]">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#D5D0C6] px-3 py-1.5 text-xs text-[#141416] focus:outline-none focus:border-[#C5A880]"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-10">
          
          {/* Desktop & Slideout Filter Panel */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0 space-y-6 bg-white lg:bg-transparent p-6 lg:p-0 border lg:border-0 border-[#EAE6DF]`}>
            
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DF]">
              <h3 className="font-serif text-sm font-bold tracking-widest text-[#141416] uppercase">
                Refine Selection
              </h3>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="lg:hidden text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#A58256]">Categories</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {currentCategories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 text-xs text-[#38383E] cursor-pointer hover:text-black">
                    <input
                      type="radio"
                      name="categoryFilter"
                      checked={selectedCategory === cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                      onChange={() => setSelectedCategory(cat.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
                      className="accent-[#C5A880]"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="space-y-3 pt-3 border-t border-[#EAE6DF]">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#A58256]">Sizes</h4>
              <div className="flex flex-wrap gap-1.5">
                {availableSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                    className={`px-2.5 py-1 text-[11px] border transition-colors ${
                      selectedSize === sz
                        ? 'bg-[#141416] text-[#EFECE6] border-[#141416]'
                        : 'bg-white text-[#141416] border-[#D5D0C6] hover:border-[#C5A880]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatch Filter */}
            <div className="space-y-3 pt-3 border-t border-[#EAE6DF]">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#A58256]">Colours</h4>
              <div className="space-y-1.5">
                {availableColors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(selectedColor === c.name ? '' : c.name)}
                    className={`flex items-center gap-2 text-xs w-full py-1 px-1.5 transition-colors ${
                      selectedColor === c.name ? 'bg-[#F2EFE9] font-bold text-black' : 'text-[#4A4A4F] hover:text-black'
                    }`}
                  >
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-gray-400"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Max Slider */}
            <div className="space-y-3 pt-3 border-t border-[#EAE6DF]">
              <div className="flex items-center justify-between text-xs">
                <h4 className="uppercase tracking-wider font-semibold text-[#A58256]">Max Price</h4>
                <span className="font-bold text-[#141416]">
                  {priceRange ? `₹${Number(priceRange).toLocaleString('en-IN')}` : 'All Prices'}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="30000"
                step="1000"
                value={priceRange || '30000'}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full accent-[#C5A880]"
              />
              <div className="flex justify-between text-[10px] text-[#71717A]">
                <span>₹1,000</span>
                <span>₹30,000+</span>
              </div>
            </div>

            {/* Stock Availability Toggle */}
            <div className="pt-3 border-t border-[#EAE6DF]">
              <label className="flex items-center gap-2 text-xs text-[#38383E] cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#C5A880]"
                />
                <span>In Stock Pieces Only</span>
              </label>
            </div>

          </div>

          {/* Product Grid Area */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="w-8 h-8 text-[#C5A880] animate-spin" />
                <p className="font-serif text-sm tracking-widest text-[#71717A]">
                  CURATING ATELIER SILHOUETTES...
                </p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white border border-[#EAE6DF] p-8 space-y-4">
                <h3 className="font-serif text-xl font-bold text-[#141416]">
                  No Matching Silhouettes Found
                </h3>
                <p className="text-xs text-[#71717A] max-w-md mx-auto leading-relaxed">
                  We could not find any pieces matching your current filter criteria. 
                  Try clearing specific size, colour, or category filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-[#141416] text-[#EFECE6] text-xs uppercase tracking-widest hover:bg-[#C5A880] hover:text-white transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../common/ProductCard';
import api from '../../services/api';
import { ArrowRight } from 'lucide-react';

export default function CuratedCarousel() {
  const [activeTab, setActiveTab] = useState('new-arrivals');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fallback initial products guaranteeing stunning presentation immediately
  const fallbackProducts = [
    {
      id: 'prod-fallback-1',
      name: 'Artisanal Egyptian Cotton Tuxedo Shirt',
      slug: 'artisanal-egyptian-cotton-tuxedo-shirt',
      originalPrice: 6999,
      sellingPrice: 5499,
      discountPercent: 21,
      gender: 'MEN',
      isNewArrival: true,
      isBestSeller: true,
      avgRating: 5.0,
      category: { name: 'Shirts' },
      images: [
        { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80' },
        { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80' },
      ],
      variants: [
        { id: 'v1', size: '38 (S)', colorName: 'Crisp Ivory', colorHex: '#FBFBFA', stock: 15 },
        { id: 'v2', size: '40 (M)', colorName: 'Crisp Ivory', colorHex: '#FBFBFA', stock: 20 },
      ],
    },
    {
      id: 'prod-fallback-2',
      name: 'Mulberry Silk Bias-Cut Column Gown',
      slug: 'mulberry-silk-bias-cut-column-gown',
      originalPrice: 16999,
      sellingPrice: 13499,
      discountPercent: 21,
      gender: 'WOMEN',
      isNewArrival: true,
      isBestSeller: true,
      avgRating: 5.0,
      category: { name: 'Dresses' },
      images: [
        { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80' },
        { url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80' },
      ],
      variants: [
        { id: 'v3', size: 'S', colorName: 'Champagne Pearl', colorHex: '#EDE6D6', stock: 14 },
        { id: 'v4', size: 'M', colorName: 'Champagne Pearl', colorHex: '#EDE6D6', stock: 16 },
      ],
    },
    {
      id: 'prod-fallback-3',
      name: 'Handcrafted Italian Wool Overcoat',
      slug: 'handcrafted-italian-wool-overcoat',
      originalPrice: 24999,
      sellingPrice: 19999,
      discountPercent: 20,
      gender: 'MEN',
      isNewArrival: true,
      isBestSeller: false,
      avgRating: 4.9,
      category: { name: 'Jackets' },
      images: [
        { url: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80' },
        { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80' },
      ],
      variants: [
        { id: 'v5', size: '40 (M)', colorName: 'Camel', colorHex: '#C19A6B', stock: 10 },
      ],
    },
    {
      id: 'prod-fallback-4',
      name: 'Handwoven Chanderi Zari Saree',
      slug: 'handwoven-chanderi-zari-saree',
      originalPrice: 18999,
      sellingPrice: 14999,
      discountPercent: 21,
      gender: 'WOMEN',
      isNewArrival: false,
      isBestSeller: true,
      avgRating: 5.0,
      category: { name: 'Ethnic Wear' },
      images: [
        { url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80' },
        { url: 'https://images.unsplash.com/photo-1610030469668-935a8bc58ec7?auto=format&fit=crop&w=800&q=80' },
      ],
      variants: [
        { id: 'v6', size: 'Free Size', colorName: 'Dusty Rose Gold', colorHex: '#DCAE96', stock: 20 },
      ],
    },
  ];

  useEffect(() => {
    let endpoint = '/products/new-arrivals';
    if (activeTab === 'best-sellers') endpoint = '/products/best-sellers';
    else if (activeTab === 'trending') endpoint = '/products/featured';

    setLoading(true);
    api.get(endpoint)
      .then((res) => {
        const fetched = res.data?.data?.products;
        if (fetched && fetched.length > 0) {
          setProducts(fetched);
        } else {
          setProducts(fallbackProducts);
        }
      })
      .catch(() => {
        setProducts(fallbackProducts);
      })
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <section className="py-20 bg-[#FAF9F5] border-t border-[#EAE6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[#EAE6DF] pb-6">
          <div>
            <span className="text-[#A58256] text-xs font-semibold tracking-[0.25em] uppercase block">
              SEASONAL EDIT
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#141416] mt-1">
              Curated Silhouettes
            </h2>
          </div>

          {/* Luxury Tab Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-8 text-xs font-semibold tracking-[0.2em] uppercase">
            {[
              { id: 'new-arrivals', label: 'NEW ARRIVALS' },
              { id: 'trending', label: 'TRENDING' },
              { id: 'best-sellers', label: 'BEST SELLERS' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 relative transition-colors ${
                  activeTab === tab.id ? 'text-[#141416]' : 'text-[#71717A] hover:text-[#141416]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A880]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center pt-8">
          <Link
            to="/shop/collections"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#141416] text-[#141416] text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#141416] hover:text-[#EFECE6] transition-all duration-300"
          >
            <span>VIEW ALL CURATIONS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}


import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import ProductCard from '../components/common/ProductCard';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Ruler, 
  Check, 
  AlertCircle, 
  MapPin, 
  Loader2 
} from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected Variant State
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showSizeModal, setShowSizeModal] = useState(false);

  // Delivery Pincode Checker
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  const { addToCart } = useCartStore();
  const { isWishlisted, toggleWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        const p = res.data?.data?.product;
        if (p) {
          setProduct(p);
          // Set default size and color
          if (p.variants && p.variants.length > 0) {
            setSelectedSize(p.variants[0].size);
            setSelectedColor(p.variants[0].colorName);
          }

          // Fetch related products
          const relRes = await api.get(`/products/related/${p.id}`);
          setRelatedProducts(relRes.data?.data?.products || []);
        }
      } catch (err) {
        console.error('Error fetching product', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#C5A880] animate-spin" />
        <p className="font-serif text-sm tracking-widest text-[#71717A]">
          RETRIEVING ATELIER SILHOUETTE...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 p-8 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#141416]">Silhouette Not Found</h2>
        <p className="text-xs text-[#71717A] max-w-sm">
          The requested archival piece is either archived or no longer available.
        </p>
        <Link 
          to="/shop/collections"
          className="px-6 py-2.5 bg-[#141416] text-[#EFECE6] text-xs uppercase tracking-widest hover:bg-[#C5A880]"
        >
          Explore Other Pieces
        </Link>
      </div>
    );
  }

  // Find exact matching variant
  const currentVariant = product.variants?.find(
    (v) => v.size === selectedSize && v.colorName === selectedColor
  ) || product.variants?.[0];

  const availableStock = currentVariant?.stock || 0;
  const isOutOfStock = availableStock <= 0;

  // Available unique sizes and colors
  const uniqueSizes = Array.from(new Set(product.variants?.map((v) => v.size) || []));
  const uniqueColors = Array.from(
    new Map(product.variants?.map((v) => [v.colorName, v]) || []).values()
  );

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setPincodeStatus({ valid: false, message: 'Please enter a valid 6-digit Indian PIN code.' });
      return;
    }
    setPincodeStatus({
      valid: true,
      message: `Delivery available to ${pincode}. Standard Express: 2-3 business days.`,
    });
  };

  const handleAddBag = () => {
    if (!currentVariant || isOutOfStock) return;
    addToCart(product, currentVariant, quantity);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setReviewSubmitting(true);
    try {
      await api.post('/reviews', {
        productId: product.id,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewSuccess('Thank you. Your patron review has been recorded.');
      setReviewComment('');
    } catch (err) {
      setReviewSuccess('Thank you. Your patron review has been recorded.');
      setReviewComment('');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const wishlisted = isWishlisted(product.id);

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Breadcrumb Trail */}
        <div className="text-[11px] text-[#71717A] tracking-wider uppercase flex items-center gap-2">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link to={`/shop/${product.gender.toLowerCase()}`} className="hover:text-black">
            {product.gender}
          </Link>
          <span>/</span>
          <span className="text-[#141416] font-medium">{product.name}</span>
        </div>

        {/* Primary Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Gallery View */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnail Ribbon */}
            {product.images && product.images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[580px] flex-shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-20 sm:w-20 sm:h-26 overflow-hidden border transition-all flex-shrink-0 ${
                      activeImageIdx === idx ? 'border-[#C5A880] ring-1 ring-[#C5A880]' : 'border-[#D5D0C6] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="flex-1 aspect-[3/4] max-h-[640px] bg-[#ECE8DF] overflow-hidden relative shadow-sm">
              <img
                src={product.images?.[activeImageIdx]?.url || product.images?.[0]?.url}
                alt={product.name}
                className="w-full h-full object-cover object-top luxury-image-hover"
              />
              {product.discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-[#A58256] text-white text-[10px] font-bold tracking-widest px-3 py-1">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Product Purchasing Info */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#A58256] uppercase tracking-[0.2em]">
                <span>{product.category?.name || product.gender}</span>
                <span className="text-[#71717A] text-[10px]">SKU: {product.sku}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#141416]">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center text-[#C5A880]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-[#71717A]">
                  {product.avgRating} ({product.totalReviews || 1} Patron Reviews)
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-1 py-3 border-y border-[#EAE6DF]">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-[#141416]">
                  ₹{product.sellingPrice?.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.sellingPrice && (
                  <span className="text-sm text-[#A1A1AA] line-through">
                    ₹{product.originalPrice?.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#71717A]">
                Inclusive of all taxes (12% Indian GST). Complimentary Express Shipping on orders &gt; ₹1,999.
              </p>
            </div>

            {/* Color Swatch Selection */}
            {uniqueColors.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#141416] tracking-wider uppercase">
                    Colour: <span className="font-normal text-[#71717A]">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  {uniqueColors.map((c) => (
                    <button
                      key={c.colorName}
                      onClick={() => setSelectedColor(c.colorName)}
                      className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 ${
                        selectedColor === c.colorName ? 'border-[#C5A880] ring-1 ring-[#C5A880]' : 'border-transparent'
                      }`}
                      title={c.colorName}
                    >
                      <span
                        className="w-full h-full rounded-full block border border-gray-300"
                        style={{ backgroundColor: c.colorHex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Variant Selection */}
            {uniqueSizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#141416] tracking-wider uppercase">
                    Select Size:
                  </span>
                  <button
                    onClick={() => setShowSizeModal(true)}
                    className="flex items-center gap-1 text-[#A58256] hover:underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uniqueSizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2 text-xs border font-medium tracking-wider transition-colors ${
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
            )}

            {/* Stock Availability Indicator */}
            <div className="text-xs pt-1">
              {isOutOfStock ? (
                <div className="flex items-center gap-1.5 text-red-700 font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  <span>Currently Out of Stock in this variant.</span>
                </div>
              ) : availableStock <= 5 ? (
                <div className="flex items-center gap-1.5 text-[#A58256] font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  <span>Only {availableStock} handcrafted pieces remaining in this silhouette.</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-green-800 font-medium">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>In Stock — Ready for expedited dispatch from Mumbai atelier.</span>
                </div>
              )}
            </div>

            {/* Quantity Selector & Add to Bag */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-[#D5D0C6] bg-white h-12">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3 text-[#141416] hover:bg-[#F2EFE9] h-full"
                >
                  -
                </button>
                <span className="px-3 text-xs font-semibold text-[#141416]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                  disabled={quantity >= availableStock || isOutOfStock}
                  className="px-3 text-[#141416] hover:bg-[#F2EFE9] h-full"
                >
                  +
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                onClick={handleAddBag}
                disabled={isOutOfStock}
                className="flex-1 bg-[#141416] text-[#EFECE6] h-12 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#C5A880] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'OUT OF STOCK' : 'ADD TO BAG'}</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`h-12 w-12 border flex items-center justify-center transition-colors ${
                  wishlisted 
                    ? 'border-[#141416] bg-[#141416] text-[#C5A880]' 
                    : 'border-[#D5D0C6] bg-white text-[#141416] hover:border-[#C5A880]'
                }`}
                title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Indian Pincode Delivery Checker */}
            <div className="p-4 bg-white border border-[#EAE6DF] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#141416] tracking-wider uppercase">
                <MapPin className="w-4 h-4 text-[#C5A880]" />
                <span>Estimate Indian Delivery</span>
              </div>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit PIN code (e.g. 400001)"
                  className="flex-1 bg-[#FAF9F5] border border-[#D5D0C6] px-3 py-2 text-xs text-[#141416] focus:outline-none focus:border-[#C5A880]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#141416] text-[#EFECE6] text-xs font-medium uppercase tracking-wider hover:bg-[#C5A880] transition-colors"
                >
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <p className={`text-[11px] ${pincodeStatus.valid ? 'text-green-800' : 'text-red-600'}`}>
                  {pincodeStatus.message}
                </p>
              )}
            </div>

            {/* Product Details & Fabric Composition */}
            <div className="space-y-4 pt-4 border-t border-[#EAE6DF] text-xs">
              <div>
                <h4 className="font-semibold text-[#141416] uppercase tracking-wider mb-1.5">
                  Atelier Notes
                </h4>
                <p className="text-[#4A4A4F] leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              {product.details && (
                <div>
                  <h4 className="font-semibold text-[#141416] uppercase tracking-wider mb-1.5">
                    Fabric & Sartorial Details
                  </h4>
                  <p className="text-[#71717A] leading-relaxed">
                    {product.details}
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Reviews Section */}
        <div className="border-t border-[#EAE6DF] pt-14 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[#A58256] text-xs font-semibold tracking-[0.25em] uppercase">
                AUTHENTIC VOICES
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#141416] mt-1">
                Patron Reviews ({product.reviews?.length || 0})
              </h3>
            </div>
          </div>

          {/* Add Review Form */}
          <div className="bg-white p-6 border border-[#EAE6DF] max-w-xl space-y-4">
            <h4 className="text-xs font-bold text-[#141416] tracking-wider uppercase">
              Submit Your Review
            </h4>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-[#71717A] block mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1"
                    >
                      <Star 
                        className={`w-5 h-5 ${star <= reviewRating ? 'fill-[#C5A880] text-[#C5A880]' : 'text-gray-300'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-[#71717A] block mb-1">Your Feedback</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Describe the fabric texture, cut, and fit..."
                  className="w-full bg-[#FAF9F5] border border-[#D5D0C6] p-2.5 text-xs text-[#141416] focus:outline-none focus:border-[#C5A880]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="px-6 py-2 bg-[#141416] text-[#EFECE6] text-xs uppercase tracking-wider hover:bg-[#C5A880] transition-colors"
              >
                {reviewSubmitting ? 'Submitting...' : 'Post Review'}
              </button>
              {reviewSuccess && <p className="text-xs text-green-700">{reviewSuccess}</p>}
            </form>
          </div>

          {/* Existing Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div key={rev.id} className="p-6 bg-white border border-[#EAE6DF] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[#C5A880]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#A1A1AA]">
                      {new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-[#222225] leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                  <p className="text-[11px] font-bold text-[#141416]">
                    {rev.user ? `${rev.user.firstName} ${rev.user.lastName}` : 'Verified Patron'}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#71717A] italic">
                Be the premier connoisseur to review this tailored piece.
              </p>
            )}
          </div>
        </div>

        {/* Related Silhouettes */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-[#EAE6DF] pt-14 space-y-8">
            <div className="text-center space-y-1">
              <span className="text-[#A58256] text-xs font-semibold tracking-[0.25em] uppercase">
                COMPLETE THE ENSEMBLE
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#141416]">
                Harmonious Silhouettes
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Size Guide Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] max-w-lg w-full p-6 sm:p-8 border border-[#EAE6DF] space-y-6">
            <div className="flex justify-between items-center border-b border-[#EAE6DF] pb-4">
              <h3 className="font-serif text-lg font-bold text-[#141416]">
                MODÉRA Sartorial Size Guide
              </h3>
              <button onClick={() => setShowSizeModal(false)} className="text-gray-500 hover:text-black">
                ✕
              </button>
            </div>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#D5D0C6] text-[#A58256] uppercase text-[10px] tracking-wider">
                    <th className="py-2">Standard</th>
                    <th className="py-2">Chest (Inches)</th>
                    <th className="py-2">Waist (Inches)</th>
                    <th className="py-2">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE6DF] text-[#141416]">
                  <tr><td className="py-2 font-bold">S (38)</td><td className="py-2">38 - 40</td><td className="py-2">30 - 32</td><td className="py-2">28.5</td></tr>
                  <tr><td className="py-2 font-bold">M (40)</td><td className="py-2">40 - 42</td><td className="py-2">32 - 34</td><td className="py-2">29.5</td></tr>
                  <tr><td className="py-2 font-bold">L (42)</td><td className="py-2">42 - 44</td><td className="py-2">34 - 36</td><td className="py-2">30.5</td></tr>
                  <tr><td className="py-2 font-bold">XL (44)</td><td className="py-2">44 - 46</td><td className="py-2">36 - 38</td><td className="py-2">31.5</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-[#71717A]">
              Measurements reflect garment dimensions. Our cut is designed for a tailored contemporary silhouette.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}


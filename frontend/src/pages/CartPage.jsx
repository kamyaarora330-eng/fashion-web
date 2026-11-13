import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { 
    items, 
    totals, 
    coupon, 
    updateQuantity, 
    removeItem, 
    applyCoupon, 
    removeCoupon 
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  const handleApply = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError('');
    setIsApplying(true);
    const res = await applyCoupon(couponInput);
    setIsApplying(false);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FAF9F5] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-[#C5A880]" />
        <h2 className="font-serif text-3xl font-bold text-[#141416]">Your Shopping Bag Is Empty</h2>
        <p className="text-xs text-[#71717A] max-w-sm">
          Discover our curated sartorial collections designed for contemporary elegance.
        </p>
        <Link
          to="/shop/collections"
          className="px-8 py-3.5 bg-[#141416] text-[#EFECE6] text-xs uppercase tracking-[0.2em] hover:bg-[#C5A880] transition-colors"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="border-b border-[#EAE6DF] pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#141416]">
            Shopping Bag ({items.length})
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            Review your chosen bespoke pieces before proceeding to checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Items Table */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-[#EAE6DF] divide-y divide-[#EAE6DF]">
              {items.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-24 h-32 object-cover bg-neutral-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-2">
                    <h3 className="font-serif text-base font-bold text-[#141416] truncate">
                      {item.productName}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-[#71717A]">
                      <span>Size: <strong className="text-[#141416]">{item.size}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        Colour: 
                        <span 
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        <strong className="text-[#141416]">{item.colorName}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-[#D5D0C6] bg-white h-9">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 text-[#141416] hover:bg-[#F2EFE9] h-full"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-[#141416]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 text-[#141416] hover:bg-[#F2EFE9] h-full"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-700 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-right sm:self-center">
                    <p className="text-base font-bold text-[#141416]">
                      ₹{item.totalPrice?.toLocaleString('en-IN')}
                    </p>
                    {item.originalPrice > item.unitPrice && (
                      <p className="text-xs text-[#A1A1AA] line-through">
                        ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#EAE6DF] p-6 space-y-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#141416] uppercase tracking-wider border-b border-[#EAE6DF] pb-3">
                Order Summary
              </h3>

              {/* Privilege Code Box */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#141416] uppercase tracking-wider block">
                  Privilege Voucher
                </label>
                {coupon ? (
                  <div className="flex items-center justify-between bg-[#F2EFE9] px-3 py-2 border border-[#C5A880] text-xs">
                    <span className="font-bold text-[#141416] flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#C5A880]" />
                      {coupon.code} Applied
                    </span>
                    <button onClick={removeCoupon} className="text-red-700 hover:underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Code (e.g. MODERA10)"
                      className="flex-1 bg-[#FAF9F5] border border-[#D5D0C6] px-3 py-2 text-xs uppercase focus:outline-none focus:border-[#C5A880]"
                    />
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="px-4 py-2 bg-[#141416] text-[#EFECE6] text-xs uppercase tracking-wider hover:bg-[#C5A880] transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-xs text-red-600">{couponError}</p>}
              </div>

              {/* Price Details */}
              <div className="space-y-2.5 text-xs text-[#71717A] border-t border-[#EAE6DF] pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#141416]">₹{totals.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-green-700 font-medium">
                    <span>Privilege Discount</span>
                    <span>-₹{totals.discount?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Goods & Services Tax (12% GST)</span>
                  <span className="font-medium text-[#141416]">₹{totals.tax?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pan-India Delivery</span>
                  <span className="font-medium text-[#141416]">
                    {totals.shipping === 0 ? (
                      <span className="text-green-700 font-bold">COMPLIMENTARY</span>
                    ) : (
                      `₹${totals.shipping}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#141416] pt-3 border-t border-[#D5D0C6]">
                  <span>Total Amount</span>
                  <span>₹{totals.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#141416] text-[#EFECE6] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#C5A880] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-[11px] text-[#71717A] space-y-1 pt-2 text-center">
                <p className="flex items-center justify-center gap-1.5 text-green-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                  Bank-Grade 256-Bit Encrypted Payment
                </p>
                <p>7-Day Effortless Returns Across India</p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}


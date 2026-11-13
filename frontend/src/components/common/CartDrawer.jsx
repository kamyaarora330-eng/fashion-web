import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export default function CartDrawer() {
  const { 
    items, 
    totals, 
    coupon, 
    isCartOpen, 
    toggleCart, 
    updateQuantity, 
    removeItem, 
    applyCoupon, 
    removeCoupon 
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError('');
    setIsApplyingCoupon(true);

    const result = await applyCoupon(couponInput);
    setIsApplyingCoupon(false);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedCheckout = () => {
    toggleCart(false);
    navigate('/checkout');
  };

  const freeShippingThreshold = 1999;
  const progressPercent = Math.min(100, (totals.subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totals.subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#141416]/60 backdrop-blur-sm transition-opacity"
        onClick={() => toggleCart(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] shadow-2xl flex flex-col border-l border-[#EAE6DF]">
          
          {/* Header */}
          <div className="p-6 border-b border-[#EAE6DF] flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold tracking-widest text-[#141416]">
                SHOPPING BAG
              </h2>
              <p className="text-[10px] tracking-widest text-[#A58256] uppercase">
                {items.length} {items.length === 1 ? 'Curated Piece' : 'Curated Pieces'}
              </p>
            </div>
            <button
              onClick={() => toggleCart(false)}
              className="p-1 text-[#141416] hover:text-[#C5A880] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Complimentary Shipping Progress Banner */}
          <div className="bg-[#F2EFE9] px-6 py-3 border-b border-[#EAE6DF] text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-[#38383E]">
                Add <strong className="text-[#141416]">₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> more for <span className="text-[#A58256] font-semibold">Complimentary Express Delivery</span>
              </p>
            ) : (
              <p className="text-[#1B5E20] font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                You have unlocked Complimentary Express Delivery across India!
              </p>
            )}
            <div className="w-full bg-[#E5E0D6] h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-[#C5A880] h-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <p className="font-serif text-lg text-[#71717A]">Your shopping bag is empty.</p>
                <p className="text-xs text-[#A1A1AA] max-w-xs mx-auto">
                  Explore our modern haute couture collections for Men and Women.
                </p>
                <button
                  onClick={() => {
                    toggleCart(false);
                    navigate('/shop/collections');
                  }}
                  className="inline-block mt-4 px-6 py-2.5 bg-[#141416] text-[#EFECE6] text-xs tracking-widest uppercase hover:bg-[#C5A880] hover:text-white transition-colors"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b border-[#EAE6DF] last:border-b-0">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-20 h-26 object-cover bg-neutral-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-[#141416] truncate">
                      {item.productName}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-[#71717A] mt-1">
                      <span>Size: <strong className="text-[#141416]">{item.size}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        Color: 
                        <span 
                          className="w-2.5 h-2.5 rounded-full inline-block border border-gray-400"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        <strong className="text-[#141416]">{item.colorName}</strong>
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#D5D0C6] bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#F2EFE9] text-[#141416]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-medium text-[#141416]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#F2EFE9] text-[#141416]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-bold text-[#141416]">
                          ₹{item.totalPrice?.toLocaleString('en-IN')}
                        </p>
                        {item.originalPrice > item.unitPrice && (
                          <p className="text-[10px] text-[#A1A1AA] line-through">
                            ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#A1A1AA] hover:text-red-700 p-1 self-start transition-colors"
                    title="Remove piece"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Calculations & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-[#F2EFE9] border-t border-[#EAE6DF] space-y-4">
              
              {/* Coupon Code Section */}
              <div className="space-y-1">
                {coupon ? (
                  <div className="flex items-center justify-between bg-white px-3 py-2 border border-[#C5A880] text-xs">
                    <div className="flex items-center gap-1.5 text-[#141416] font-medium">
                      <Tag className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>{coupon.code} applied (-₹{totals.discount?.toLocaleString('en-IN')})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter Privilege Code (e.g. MODERA10)"
                      className="flex-1 bg-white border border-[#D5D0C6] px-3 py-1.5 text-xs text-[#141416] uppercase focus:outline-none focus:border-[#C5A880]"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingCoupon}
                      className="px-4 py-1.5 bg-[#141416] text-[#EFECE6] text-xs uppercase tracking-wider hover:bg-[#C5A880] transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[10px] text-red-600">{couponError}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#71717A] pt-2 border-t border-[#EAE6DF]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#141416]">₹{totals.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-green-700 font-medium">
                    <span>Privilege Discount</span>
                    <span>-₹{totals.discount?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Applicable GST (12%)</span>
                  <span className="text-[#141416]">₹{totals.tax?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Delivery</span>
                  <span className="text-[#141416]">
                    {totals.shipping === 0 ? (
                      <span className="text-green-700 font-medium">COMPLIMENTARY</span>
                    ) : (
                      `₹${totals.shipping}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#141416] pt-2 border-t border-[#D5D0C6]">
                  <span>Total Amount</span>
                  <span>₹{totals.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedCheckout}
                className="w-full bg-[#141416] text-[#EFECE6] py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#C5A880] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>PROCEED TO SECURE CHECKOUT</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


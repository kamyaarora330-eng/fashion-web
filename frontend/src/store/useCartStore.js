import { create } from 'zustand';
import api from '../services/api';

const savedCart = localStorage.getItem('modera_cart');
const initialItems = savedCart ? JSON.parse(savedCart) : [];

const calculateTotals = (items, coupon = null, paymentMethod = 'RAZORPAY') => {
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  let discount = 0;
  if (coupon) {
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    } else if (coupon.discountType === 'FIXED') {
      discount = Math.min(coupon.discountValue, subtotal);
    }
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Number((taxableAmount * 0.12).toFixed(2)); // 12% GST
  const shipping = subtotal >= 1999 || subtotal === 0 ? 0 : 149;
  const codFee = paymentMethod === 'COD' && subtotal > 0 ? 49 : 0;
  const total = Number((taxableAmount + tax + shipping + codFee).toFixed(2));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    tax,
    shipping,
    codFee,
    total,
  };
};

export const useCartStore = create((set, get) => ({
  items: initialItems,
  coupon: null,
  paymentMethod: 'RAZORPAY',
  isCartOpen: false,
  totals: calculateTotals(initialItems),

  toggleCart: (isOpen) => set((state) => ({ 
    isCartOpen: typeof isOpen === 'boolean' ? isOpen : !state.isCartOpen 
  })),

  setPaymentMethod: (method) => {
    set((state) => {
      const totals = calculateTotals(state.items, state.coupon, method);
      return { paymentMethod: method, totals };
    });
  },

  addToCart: (product, variant, quantity = 1) => {
    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.variantId === variant.id);
      let updatedItems;

      if (existingIndex > -1) {
        updatedItems = state.items.map((item, idx) => {
          if (idx === existingIndex) {
            const newQty = item.quantity + quantity;
            return {
              ...item,
              quantity: Math.min(newQty, variant.stock || 50),
              totalPrice: (item.unitPrice * Math.min(newQty, variant.stock || 50)),
            };
          }
          return item;
        });
      } else {
        const unitPrice = Number(product.sellingPrice) + Number(variant.additionalPrice || 0);
        const newItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          variantId: variant.id,
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          size: variant.size,
          colorName: variant.colorName,
          colorHex: variant.colorHex,
          image: product.images?.[0]?.url || product.image || '',
          unitPrice,
          originalPrice: Number(product.originalPrice),
          quantity,
          totalPrice: unitPrice * quantity,
          stock: variant.stock || 10,
        };
        updatedItems = [newItem, ...state.items];
      }

      localStorage.setItem('modera_cart', JSON.stringify(updatedItems));
      const totals = calculateTotals(updatedItems, state.coupon, state.paymentMethod);
      return { items: updatedItems, totals, isCartOpen: true };
    });
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => {
      const updatedItems = state.items.map((item) => {
        if (item.id === itemId) {
          const validQty = Math.min(quantity, item.stock || 50);
          return {
            ...item,
            quantity: validQty,
            totalPrice: item.unitPrice * validQty,
          };
        }
        return item;
      });

      localStorage.setItem('modera_cart', JSON.stringify(updatedItems));
      const totals = calculateTotals(updatedItems, state.coupon, state.paymentMethod);
      return { items: updatedItems, totals };
    });
  },

  removeItem: (itemId) => {
    set((state) => {
      const updatedItems = state.items.filter((item) => item.id !== itemId);
      localStorage.setItem('modera_cart', JSON.stringify(updatedItems));
      const totals = calculateTotals(updatedItems, state.coupon, state.paymentMethod);
      return { items: updatedItems, totals };
    });
  },

  applyCoupon: async (code) => {
    const trimmed = code.trim().toUpperCase();
    const currentSubtotal = get().totals.subtotal;

    try {
      const res = await api.post('/coupons/validate', {
        code: trimmed,
        orderAmount: currentSubtotal,
      });

      const couponData = res.data.data;
      set((state) => {
        const coupon = {
          code: couponData.code,
          discountType: couponData.discountType,
          discountValue: couponData.discountValue,
        };
        const totals = calculateTotals(state.items, coupon, state.paymentMethod);
        return { coupon, totals };
      });

      return { success: true, message: 'Privilege code applied successfully!' };
    } catch (err) {
      // Local fallback for common demo codes if backend offline
      if (trimmed === 'MODERA10') {
        const coupon = { code: 'MODERA10', discountType: 'PERCENTAGE', discountValue: 10 };
        set((state) => ({ coupon, totals: calculateTotals(state.items, coupon, state.paymentMethod) }));
        return { success: true, message: '10% privilege applied!' };
      }
      if (trimmed === 'FIRST500' && currentSubtotal >= 2999) {
        const coupon = { code: 'FIRST500', discountType: 'FIXED', discountValue: 500 };
        set((state) => ({ coupon, totals: calculateTotals(state.items, coupon, state.paymentMethod) }));
        return { success: true, message: '₹500 privilege applied!' };
      }
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid or inapplicable coupon code.',
      };
    }
  },

  removeCoupon: () => {
    set((state) => ({
      coupon: null,
      totals: calculateTotals(state.items, null, state.paymentMethod),
    }));
  },

  clearCart: () => {
    localStorage.removeItem('modera_cart');
    set({
      items: [],
      coupon: null,
      totals: calculateTotals([]),
    });
  },
}));


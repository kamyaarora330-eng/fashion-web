import { create } from 'zustand';

const savedWishlist = localStorage.getItem('modera_wishlist');
const initialWishlist = savedWishlist ? JSON.parse(savedWishlist) : [];

export const useWishlistStore = create((set, get) => ({
  wishlist: initialWishlist,

  isWishlisted: (productId) => {
    return get().wishlist.some((item) => item.id === productId || item.productId === productId);
  },

  toggleWishlist: (product) => {
    set((state) => {
      const exists = state.wishlist.some((item) => item.id === product.id);
      let updated;
      if (exists) {
        updated = state.wishlist.filter((item) => item.id !== product.id);
      } else {
        updated = [product, ...state.wishlist];
      }
      localStorage.setItem('modera_wishlist', JSON.stringify(updated));
      return { wishlist: updated };
    });
  },

  removeFromWishlist: (productId) => {
    set((state) => {
      const updated = state.wishlist.filter((item) => item.id !== productId);
      localStorage.setItem('modera_wishlist', JSON.stringify(updated));
      return { wishlist: updated };
    });
  },
}));


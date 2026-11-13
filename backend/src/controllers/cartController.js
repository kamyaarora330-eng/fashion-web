import prisma from '../config/database.js';
import { calculateOrderTotals } from '../utils/taxCalculator.js';

// Helper to get or create cart for user
const getOrCreateUserCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: { where: { isThumbnail: true } },
                  category: true,
                },
              },
              inventory: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: { where: { isThumbnail: true } },
                    category: true,
                  },
                },
                inventory: true,
              },
            },
          },
        },
      },
    });
  }

  return cart;
};

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await getOrCreateUserCart(userId);

    const formattedItems = cart.items.map((item) => {
      const prod = item.variant.product;
      const basePrice = Number(prod.sellingPrice);
      const addPrice = Number(item.variant.additionalPrice);
      const unitPrice = basePrice + addPrice;
      const availableStock = item.variant.inventory?.quantity || 0;

      return {
        id: item.id,
        variantId: item.variant.id,
        productId: prod.id,
        productName: prod.name,
        productSlug: prod.slug,
        size: item.variant.size,
        colorName: item.variant.colorName,
        colorHex: item.variant.colorHex,
        image: prod.images[0]?.url || '',
        quantity: item.quantity,
        unitPrice,
        originalPrice: Number(prod.originalPrice),
        totalPrice: Number((unitPrice * item.quantity).toFixed(2)),
        inStock: availableStock >= item.quantity,
        availableStock,
      };
    });

    const totals = calculateOrderTotals({ items: formattedItems });

    res.json({
      success: true,
      data: {
        cartId: cart.id,
        items: formattedItems,
        totalItems: formattedItems.reduce((acc, i) => acc + i.quantity, 0),
        totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { variantId, quantity = 1 } = req.body;

    // Check inventory
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { inventory: true },
    });

    if (!variant) {
      return res.status(404).json({ success: false, message: 'Variant not found' });
    }

    const availableStock = variant.inventory?.quantity || 0;
    if (availableStock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableStock} item(s) available in stock.`,
      });
    }

    const cart = await getOrCreateUserCart(userId);

    // Upsert cart item
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (availableStock < newQty) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Maximum available stock is ${availableStock}.`,
        });
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId,
          quantity,
        },
      });
    }

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity, newVariantId } = req.body;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        variant: { include: { inventory: true } },
      },
    });

    if (!cartItem || cartItem.cart.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    // Changing size/color directly
    const targetVariantId = newVariantId || cartItem.variantId;
    const variant = await prisma.productVariant.findUnique({
      where: { id: targetVariantId },
      include: { inventory: true },
    });

    if (!variant) {
      return res.status(404).json({ success: false, message: 'Selected variant not found' });
    }

    const availableStock = variant.inventory?.quantity || 0;
    if (availableStock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableStock} item(s) available in stock.`,
      });
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity,
        variantId: targetVariantId,
      },
    });

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    res.json({
      success: true,
      message: 'Cart cleared successfully.',
      data: { items: [], totalItems: 0, totals: calculateOrderTotals({ items: [] }) },
    });
  } catch (error) {
    next(error);
  }
};


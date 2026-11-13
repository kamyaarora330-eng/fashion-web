import prisma from '../config/database.js';

export const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                images: true,
                variants: { include: { inventory: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
        include: { items: true },
      });
    }

    const formatted = wishlist.items.map((item) => ({
      id: item.id,
      productId: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      category: item.product.category,
      originalPrice: Number(item.product.originalPrice),
      sellingPrice: Number(item.product.sellingPrice),
      discountPercent: item.product.discountPercent,
      image: item.product.images[0]?.url || '',
      inStock: item.product.variants.some((v) => (v.inventory?.quantity || 0) > 0),
    }));

    res.json({
      success: true,
      data: { wishlist: formatted },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    let wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId } });
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    let isAdded = false;
    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      isAdded = false;
    } else {
      await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId,
        },
      });
      isAdded = true;
    }

    res.json({
      success: true,
      message: isAdded ? 'Added to your curated wishlist' : 'Removed from wishlist',
      data: { isAdded, productId },
    });
  } catch (error) {
    next(error);
  }
};


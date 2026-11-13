import prisma from '../config/database.js';

export const listProducts = async (req, res, next) => {
  try {
    const {
      gender,
      category,
      search,
      minPrice,
      maxPrice,
      size,
      color,
      sort,
      isFeatured,
      isNewArrival,
      isBestSeller,
      page = 1,
      limit = 12,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where = {
      status: 'ACTIVE',
    };

    if (gender && ['MEN', 'WOMEN', 'UNISEX'].includes(gender.toUpperCase())) {
      where.gender = { in: [gender.toUpperCase(), 'UNISEX'] };
    }

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      where.sellingPrice = {};
      if (minPrice) where.sellingPrice.gte = Number(minPrice);
      if (maxPrice) where.sellingPrice.lte = Number(maxPrice);
    }

    if (isFeatured === 'true') where.isFeatured = true;
    if (isNewArrival === 'true') where.isNewArrival = true;
    if (isBestSeller === 'true') where.isBestSeller = true;

    // Filter by variant attributes (size, color)
    if (size || color) {
      where.variants = {
        some: {
          ...(size && { size: { equals: size, mode: 'insensitive' } }),
          ...(color && { colorName: { equals: color, mode: 'insensitive' } }),
        },
      };
    }

    // Sorting
    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { sellingPrice: 'asc' };
    else if (sort === 'price_desc') orderBy = { sellingPrice: 'desc' };
    else if (sort === 'popular' || sort === 'best_seller') orderBy = { isBestSeller: 'desc' };
    else if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { displayOrder: 'asc' } },
          variants: {
            include: {
              inventory: true,
            },
          },
          reviews: {
            where: { isApproved: true },
            select: { rating: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Format products with average rating & stock status
    const formatted = products.map((prod) => {
      const totalRatings = prod.reviews.length;
      const avgRating = totalRatings > 0
        ? Number((prod.reviews.reduce((acc, r) => acc + r.rating, 0) / totalRatings).toFixed(1))
        : 5.0;

      const totalStock = prod.variants.reduce((acc, v) => acc + (v.inventory?.quantity || 0), 0);

      return {
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        sku: prod.sku,
        description: prod.description,
        gender: prod.gender,
        category: prod.category,
        originalPrice: Number(prod.originalPrice),
        sellingPrice: Number(prod.sellingPrice),
        discountPercent: prod.discountPercent,
        isFeatured: prod.isFeatured,
        isNewArrival: prod.isNewArrival,
        isBestSeller: prod.isBestSeller,
        images: prod.images,
        variants: prod.variants.map((v) => ({
          id: v.id,
          size: v.size,
          colorName: v.colorName,
          colorHex: v.colorHex,
          sku: v.sku,
          additionalPrice: Number(v.additionalPrice),
          stock: v.inventory?.quantity || 0,
        })),
        avgRating,
        totalReviews: totalRatings,
        inStock: totalStock > 0,
      };
    });

    res.json({
      success: true,
      data: {
        products: formatted,
        pagination: {
          total: totalCount,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(totalCount / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
        variants: {
          include: {
            inventory: true,
          },
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: { select: { firstName: true, lastName: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product || product.status !== 'ACTIVE') {
      return res.status(404).json({
        success: false,
        message: 'Product not found or is currently unavailable.',
      });
    }

    const totalRatings = product.reviews.length;
    const avgRating = totalRatings > 0
      ? Number((product.reviews.reduce((acc, r) => acc + r.rating, 0) / totalRatings).toFixed(1))
      : 5.0;

    const totalStock = product.variants.reduce((acc, v) => acc + (v.inventory?.quantity || 0), 0);

    const formatted = {
      ...product,
      originalPrice: Number(product.originalPrice),
      sellingPrice: Number(product.sellingPrice),
      avgRating,
      totalReviews: totalRatings,
      inStock: totalStock > 0,
      variants: product.variants.map((v) => ({
        id: v.id,
        size: v.size,
        colorName: v.colorName,
        colorHex: v.colorHex,
        sku: v.sku,
        additionalPrice: Number(v.additionalPrice),
        stock: v.inventory?.quantity || 0,
      })),
    };

    res.json({
      success: true,
      data: { product: formatted },
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  req.query.isFeatured = 'true';
  return listProducts(req, res, next);
};

export const getNewArrivals = async (req, res, next) => {
  req.query.isNewArrival = 'true';
  return listProducts(req, res, next);
};

export const getBestSellers = async (req, res, next) => {
  req.query.isBestSeller = 'true';
  return listProducts(req, res, next);
};

export const getRelatedProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const current = await prisma.product.findUnique({
      where: { id },
      select: { categoryId: true, gender: true },
    });

    if (!current) {
      return res.json({ success: true, data: { products: [] } });
    }

    const related = await prisma.product.findMany({
      where: {
        id: { not: id },
        categoryId: current.categoryId,
        status: 'ACTIVE',
      },
      take: 4,
      include: {
        category: true,
        images: true,
        variants: { include: { inventory: true } },
      },
    });

    res.json({
      success: true,
      data: {
        products: related.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          originalPrice: Number(p.originalPrice),
          sellingPrice: Number(p.sellingPrice),
          discountPercent: p.discountPercent,
          images: p.images,
          category: p.category,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};


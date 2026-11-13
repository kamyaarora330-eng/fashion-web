import prisma from '../config/database.js';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

/**
 * Dashboard Overview Analytics
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      deliveredOrders,
      lowStockVariants,
      recentOrders,
      storeSettings,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.inventory.count({
        where: {
          quantity: { lte: 5 },
        },
      }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          payment: true,
        },
      }),
      prisma.storeSettings.findUnique({ where: { id: 'default' } }),
    ]);

    // Aggregate Total Revenue from completed or confirmed orders
    const revenueAgg = await prisma.order.aggregate({
      where: {
        status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'] },
      },
      _sum: {
        totalAmount: true,
      },
    });

    const totalRevenue = Number(revenueAgg._sum.totalAmount || 0);

    // Sales by Category
    const categoriesWithCount = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
    });

    // Best selling products
    const bestSellers = await prisma.product.findMany({
      where: { isBestSeller: true, status: 'ACTIVE' },
      take: 5,
      include: {
        images: true,
        category: true,
      },
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalRevenue,
          totalOrders,
          totalCustomers,
          totalProducts,
          pendingOrders,
          deliveredOrders,
          lowStockProducts: lowStockVariants,
        },
        recentOrders,
        bestSellers,
        categories: categoriesWithCount,
        storeSettings: storeSettings || {},
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Products Management
 */
export const adminCreateProduct = async (req, res, next) => {
  try {
    const {
      name,
      sku,
      description,
      details,
      gender,
      categoryId,
      originalPrice,
      sellingPrice,
      discountPercent,
      isFeatured,
      isNewArrival,
      isBestSeller,
      status,
      sizeChartUrl,
      variants,
      images,
    } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 7);

    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name,
          slug,
          sku,
          description,
          details,
          gender,
          categoryId,
          originalPrice,
          sellingPrice,
          discountPercent: discountPercent || Math.round(((originalPrice - sellingPrice) / originalPrice) * 100),
          isFeatured: isFeatured || false,
          isNewArrival: isNewArrival || false,
          isBestSeller: isBestSeller || false,
          status: status || 'ACTIVE',
          sizeChartUrl,
          images: {
            create: images.map((img, idx) => ({
              url: img.url,
              publicId: img.publicId,
              altText: img.altText || `${name} view ${idx + 1}`,
              displayOrder: img.displayOrder !== undefined ? img.displayOrder : idx,
              isThumbnail: img.isThumbnail || idx === 0,
            })),
          },
        },
      });

      for (const v of variants) {
        const variantCreated = await tx.productVariant.create({
          data: {
            productId: created.id,
            size: v.size,
            colorName: v.colorName,
            colorHex: v.colorHex,
            sku: v.sku || `${sku}-${v.size}-${v.colorName.replace(/\s+/g, '')}`,
            additionalPrice: v.additionalPrice || 0,
            inventory: {
              create: {
                quantity: v.quantity || 10,
                lowStockThreshold: v.lowStockThreshold || 5,
              },
            },
          },
        });
      }

      return tx.product.findUnique({
        where: { id: created.id },
        include: {
          category: true,
          images: true,
          variants: { include: { inventory: true } },
        },
      });
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      details,
      gender,
      categoryId,
      originalPrice,
      sellingPrice,
      discountPercent,
      isFeatured,
      isNewArrival,
      isBestSeller,
      status,
      sizeChartUrl,
    } = req.body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(details !== undefined && { details }),
        ...(gender && { gender }),
        ...(categoryId && { categoryId }),
        ...(originalPrice !== undefined && { originalPrice }),
        ...(sellingPrice !== undefined && { sellingPrice }),
        ...(discountPercent !== undefined && { discountPercent }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isNewArrival !== undefined && { isNewArrival }),
        ...(isBestSeller !== undefined && { isBestSeller }),
        ...(status && { status }),
        ...(sizeChartUrl !== undefined && { sizeChartUrl }),
      },
      include: {
        category: true,
        images: true,
        variants: { include: { inventory: true } },
      },
    });

    res.json({
      success: true,
      message: 'Product updated successfully.',
      data: { product: updated },
    });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Product removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateInventory = async (req, res, next) => {
  try {
    const { variantId } = req.params;
    const { quantity, lowStockThreshold } = req.body;

    const updated = await prisma.inventory.update({
      where: { variantId },
      data: {
        ...(quantity !== undefined && { quantity }),
        ...(lowStockThreshold !== undefined && { lowStockThreshold }),
      },
      include: {
        variant: {
          include: { product: true },
        },
      },
    });

    res.json({
      success: true,
      message: 'Inventory updated successfully.',
      data: { inventory: updated },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Orders Management
 */
export const adminListOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
          address: true,
          payment: true,
          items: {
            include: {
              product: { select: { name: true, sku: true } },
              variant: { select: { size: true, colorName: true } },
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, shippingCarrier } = req.body;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // If order is cancelled, restore inventory
    if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
      await prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          await tx.inventory.update({
            where: { variantId: item.variantId },
            data: { quantity: { increment: item.quantity } },
          });
        }
      });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status,
        ...(trackingNumber !== undefined && { trackingNumber }),
        ...(shippingCarrier !== undefined && { shippingCarrier }),
      },
      include: {
        user: true,
        payment: true,
        items: true,
      },
    });

    res.json({
      success: true,
      message: `Order status updated to ${status}.`,
      data: { order: updated },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Customers Management
 */
export const adminListCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = { role: 'CUSTOMER' };
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          isActive: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        customers: customers.map((c) => ({
          ...c,
          totalOrders: c._count.orders,
        })),
        pagination: {
          total,
          page: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const adminToggleCustomerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await prisma.user.findUnique({ where: { id } });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !customer.isActive },
    });

    res.json({
      success: true,
      message: `Customer account ${updated.isActive ? 'activated' : 'deactivated'}.`,
      data: { customer: updated },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Marketing & Coupons
 */
export const adminCreateCoupon = async (req, res, next) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      endDate,
      usageLimit,
      isActive,
    } = req.body;

    const coupon = await prisma.coupon.create({
      data: {
        code: code.trim().toUpperCase(),
        description,
        discountType,
        discountValue,
        minOrderAmount: minOrderAmount || 0,
        maxDiscountAmount,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: new Date(endDate),
        usageLimit,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Promotional coupon created successfully.',
      data: { coupon },
    });
  } catch (error) {
    next(error);
  }
};

export const adminListCoupons = async (req, res, next) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: { coupons },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Store Settings Configuration
 */
export const adminGetSettings = async (req, res, next) => {
  try {
    const settings = await prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: {},
      create: { id: 'default' },
    });

    res.json({
      success: true,
      data: { settings },
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateSettings = async (req, res, next) => {
  try {
    const {
      storeName,
      contactEmail,
      contactPhone,
      gstPercent,
      freeShippingThreshold,
      standardShippingFee,
      codEnabled,
      codFee,
      announcementText,
    } = req.body;

    const updated = await prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: {
        ...(storeName && { storeName }),
        ...(contactEmail && { contactEmail }),
        ...(contactPhone && { contactPhone }),
        ...(gstPercent !== undefined && { gstPercent }),
        ...(freeShippingThreshold !== undefined && { freeShippingThreshold }),
        ...(standardShippingFee !== undefined && { standardShippingFee }),
        ...(codEnabled !== undefined && { codEnabled }),
        ...(codFee !== undefined && { codFee }),
        ...(announcementText !== undefined && { announcementText }),
      },
      create: {
        id: 'default',
        storeName: storeName || 'MODÉRA',
        contactEmail: contactEmail || 'concierge@modera-fashion.com',
        contactPhone: contactPhone || '+91 98765 43210',
        gstPercent: gstPercent || 12.0,
        freeShippingThreshold: freeShippingThreshold || 1999.0,
        standardShippingFee: standardShippingFee || 149.0,
        codEnabled: codEnabled !== undefined ? codEnabled : true,
        codFee: codFee || 49.0,
        announcementText: announcementText || 'Complimentary Express Delivery on orders above ₹1,999 across India | Code: MODERA10',
      },
    });

    res.json({
      success: true,
      message: 'Store settings saved successfully.',
      data: { settings: updated },
    });
  } catch (error) {
    next(error);
  }
};


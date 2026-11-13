import prisma from '../config/database.js';

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or inactive promotional coupon code.',
      });
    }

    const now = new Date();
    if (coupon.endDate < now) {
      return res.status(400).json({
        success: false,
        message: 'This promotional coupon has expired.',
      });
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'This promotional coupon has reached its maximum usage limit.',
      });
    }

    const minOrder = Number(coupon.minOrderAmount || 0);
    if (orderAmount < minOrder) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum purchase value of ₹${minOrder.toLocaleString('en-IN')}.`,
      });
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (orderAmount * Number(coupon.discountValue)) / 100;
      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, Number(coupon.maxDiscountAmount));
      }
    } else {
      discount = Math.min(Number(coupon.discountValue), orderAmount);
    }

    res.json({
      success: true,
      message: 'Coupon code applied successfully.',
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
        discountAmount: Number(discount.toFixed(2)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const listPublicCoupons = async (req, res, next) => {
  try {
    const now = new Date();
    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        endDate: { gte: now },
      },
      select: {
        code: true,
        description: true,
        discountType: true,
        discountValue: true,
        minOrderAmount: true,
        maxDiscountAmount: true,
        endDate: true,
      },
    });

    res.json({
      success: true,
      data: { coupons },
    });
  } catch (error) {
    next(error);
  }
};


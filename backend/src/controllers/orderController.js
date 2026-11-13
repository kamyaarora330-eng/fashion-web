import prisma from '../config/database.js';
import { generateOrderNumber } from '../utils/orderNumber.js';
import { calculateOrderTotals } from '../utils/taxCalculator.js';
import { razorpayClient, verifyRazorpaySignature } from '../config/razorpay.js';

export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId, shippingAddress, paymentMethod, couponCode, items, notes } = req.body;

    // 1. Resolve Address
    let finalAddressId = addressId;
    if (!finalAddressId && shippingAddress) {
      const createdAddress = await prisma.address.create({
        data: {
          userId,
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          streetAddress: shippingAddress.streetAddress,
          apartment: shippingAddress.apartment,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country || 'India',
          isDefault: shippingAddress.saveAddress || false,
        },
      });
      finalAddressId = createdAddress.id;
    }

    if (!finalAddressId) {
      return res.status(400).json({
        success: false,
        message: 'A valid delivery address is required.',
      });
    }

    // 2. Fetch and Validate Variants and Current Stock inside a Transaction
    const orderResult = await prisma.$transaction(async (tx) => {
      const orderItemsData = [];
      let calculatedSubtotal = 0;

      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: {
            product: true,
            inventory: true,
          },
        });

        if (!variant || variant.product.status !== 'ACTIVE') {
          throw new Error(`Variant or product not found or unavailable.`);
        }

        const availableQty = variant.inventory?.quantity || 0;
        if (availableQty < item.quantity) {
          throw new Error(
            `Insufficient stock for "${variant.product.name}" (${variant.size} / ${variant.colorName}). Only ${availableQty} available.`
          );
        }

        // Deduct inventory atomically
        await tx.inventory.update({
          where: { variantId: variant.id },
          data: {
            quantity: { decrement: item.quantity },
          },
        });

        const unitPrice = Number(variant.product.sellingPrice) + Number(variant.additionalPrice);
        const itemTotal = unitPrice * item.quantity;
        calculatedSubtotal += itemTotal;

        orderItemsData.push({
          productId: variant.product.id,
          variantId: variant.id,
          quantity: item.quantity,
          unitPrice,
          totalPrice: itemTotal,
        });
      }

      // Check coupon
      let coupon = null;
      if (couponCode) {
        coupon = await tx.coupon.findUnique({
          where: { code: couponCode.toUpperCase() },
        });

        if (coupon && coupon.isActive) {
          const now = new Date();
          if (coupon.endDate < now) {
            throw new Error('This promotion coupon has expired.');
          }
          if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
            throw new Error('This promotion coupon has reached its usage limit.');
          }
          // Increment times used
          await tx.coupon.update({
            where: { id: coupon.id },
            data: { timesUsed: { increment: 1 } },
          });
        }
      }

      // Calculate totals
      const totals = calculateOrderTotals({
        items: orderItemsData,
        coupon,
        paymentMethod,
      });

      const orderNumber = generateOrderNumber();

      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId: finalAddressId,
          subtotalAmount: totals.subtotal,
          discountAmount: totals.discount,
          taxAmount: totals.tax,
          shippingAmount: totals.shipping + totals.codFee,
          totalAmount: totals.total,
          couponId: coupon?.id || null,
          status: paymentMethod === 'COD' ? 'CONFIRMED' : 'PENDING',
          paymentMethod,
          paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
          notes,
          items: {
            create: orderItemsData,
          },
          payment: {
            create: {
              paymentProvider: paymentMethod,
              amount: totals.total,
              currency: 'INR',
              status: 'PENDING',
            },
          },
        },
        include: {
          address: true,
          items: {
            include: {
              product: { include: { images: true } },
              variant: true,
            },
          },
          payment: true,
        },
      });

      return { order: createdOrder, totals };
    });

    const { order, totals } = orderResult;

    // Clear user cart upon successful order creation
    const userCart = await prisma.cart.findUnique({ where: { userId } });
    if (userCart) {
      await prisma.cartItem.deleteMany({ where: { cartId: userCart.id } });
    }

    // If Razorpay, generate razorpay order on backend
    let razorpayOrderData = null;
    if (paymentMethod === 'RAZORPAY') {
      if (razorpayClient) {
        try {
          const rzpOrder = await razorpayClient.orders.create({
            amount: Math.round(Number(order.totalAmount) * 100), // In Paise (e.g. ₹100 = 10000 paise)
            currency: 'INR',
            receipt: order.orderNumber,
            notes: {
              orderId: order.id,
              userId: req.user.id,
              customerEmail: req.user.email,
            },
          });

          await prisma.payment.update({
            where: { orderId: order.id },
            data: {
              razorpayOrderId: rzpOrder.id,
            },
          });

          razorpayOrderData = {
            id: rzpOrder.id,
            amount: rzpOrder.amount,
            currency: rzpOrder.currency,
            key: process.env.RAZORPAY_KEY_ID,
          };
        } catch (rzpErr) {
          console.error('[Razorpay Order Creation Error]', rzpErr);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: paymentMethod === 'COD' 
        ? 'Your order has been confirmed successfully!' 
        : 'Order created. Proceed to payment.',
      data: {
        order,
        razorpayOrder: razorpayOrderData,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check signature
    let isValid = false;
    try {
      isValid = verifyRazorpaySignature({
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      });
    } catch (sigErr) {
      console.warn('[Signature Check Warning]', sigErr.message);
      // If running in development without live secret, inspect key
      if (process.env.NODE_ENV === 'development') {
        isValid = true;
      }
    }

    if (!isValid) {
      await prisma.payment.update({
        where: { orderId },
        data: {
          status: 'FAILED',
          razorpayPaymentId,
          razorpaySignature,
        },
      });

      return res.status(400).json({
        success: false,
        message: 'Cryptographic payment signature verification failed.',
      });
    }

    // Idempotent order status update
    await prisma.$transaction([
      prisma.payment.update({
        where: { orderId },
        data: {
          status: 'COMPLETED',
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'CONFIRMED',
          paymentStatus: 'COMPLETED',
        },
      }),
    ]);

    res.json({
      success: true,
      message: 'Payment verified successfully. Order confirmed.',
      data: { orderId, status: 'CONFIRMED' },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        address: true,
        items: {
          include: {
            product: { include: { images: true } },
            variant: true,
          },
        },
        payment: true,
        coupon: true,
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Only allow customer owner or admin
    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

export const listCustomerOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        address: true,
        items: {
          include: {
            product: { include: { images: true } },
            variant: true,
          },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};

export const trackOrder = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        paymentMethod: true,
        trackingNumber: true,
        shippingCarrier: true,
        totalAmount: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            quantity: true,
            unitPrice: true,
            product: { select: { name: true, slug: true } },
            variant: { select: { size: true, colorName: true } },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No order found with the provided order tracking reference.',
      });
    }

    res.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};


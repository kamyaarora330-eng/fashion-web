import prisma from '../config/database.js';

export const createReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, rating, title, comment } = req.body;

    // Check if user has bought this product
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: 'DELIVERED',
        },
      },
    });

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating: Number(rating),
        title,
        comment,
        isVerifiedPurchase: !!hasPurchased,
        isApproved: true,
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Thank you. Your review has been published.',
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isApproved: true,
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: { reviews },
    });
  } catch (error) {
    next(error);
  }
};


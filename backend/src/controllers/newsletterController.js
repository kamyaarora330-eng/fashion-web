import prisma from '../config/database.js';

export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email is required.' });
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email: email.toLowerCase() },
      update: { isActive: true },
      create: { email: email.toLowerCase(), isActive: true },
    });

    res.json({
      success: true,
      message: 'Welcome to the MODÉRA private circle. Enjoy 10% off your first acquisition with code: MODERA10',
    });
  } catch (error) {
    next(error);
  }
};


import { Router } from 'express';
import { verifyPayment } from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { verifyPaymentSchema } from '../validators/orderValidator.js';
import crypto from 'crypto';
import prisma from '../config/database.js';

const router = Router();

router.post('/verify', authenticateToken, validate(verifyPaymentSchema), verifyPayment);

/**
 * Razorpay Webhook listener for asynchronous payment event updates
 */
router.post('/webhook', async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    if (webhookSecret && signature) {
      const shasum = crypto.createHmac('sha256', webhookSecret);
      shasum.update(JSON.stringify(req.body));
      const digest = shasum.digest('hex');

      if (digest !== signature) {
        return res.status(400).json({ status: 'invalid_signature' });
      }
    }

    const event = req.body.event;
    const paymentEntity = req.body.payload?.payment?.entity;

    if (event === 'payment.captured' && paymentEntity) {
      const razorpayOrderId = paymentEntity.order_id;
      const payment = await prisma.payment.findUnique({
        where: { razorpayOrderId },
      });

      if (payment) {
        await prisma.$transaction([
          prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'COMPLETED',
              razorpayPaymentId: paymentEntity.id,
              rawResponse: JSON.stringify(paymentEntity),
            },
          }),
          prisma.order.update({
            where: { id: payment.orderId },
            data: {
              status: 'CONFIRMED',
              paymentStatus: 'COMPLETED',
            },
          }),
        ]);
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('[Razorpay Webhook Error]', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;


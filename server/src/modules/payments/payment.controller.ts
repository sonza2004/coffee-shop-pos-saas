import { Request, Response } from 'express';
import prisma from '../../config/prisma';

// =========================
// UPLOAD PAYMENT SLIP
// =========================
export async function uploadSlip(req: Request, res: Response) {
  try {
    const { orderId, imageUrl } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const slip = await prisma.paymentSlip.create({
      data: {
        orderId,
        imageUrl,
      },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'payment_uploaded' },
    });

    return res.json(slip);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to upload slip' });
  }
}

// =========================
// APPROVE PAYMENT
// =========================
export async function approvePayment(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const slip = await prisma.paymentSlip.update({
      where: { id },
      data: {
        status: 'approved',
        reviewedAt: new Date(),
      },
      include: { order: true },
    });

    await prisma.order.update({
      where: { id: slip.orderId },
      data: { status: 'approved' },
    });

    return res.json(slip);
  } catch (err) {
    return res.status(500).json({ message: 'Approval failed' });
  }
}

// =========================
// REJECT PAYMENT
// =========================
export async function rejectPayment(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const slip = await prisma.paymentSlip.update({
      where: { id },
      data: {
        status: 'rejected',
        reviewedAt: new Date(),
      },
    });

    return res.json(slip);
  } catch (err) {
    return res.status(500).json({ message: 'Rejection failed' });
  }
}

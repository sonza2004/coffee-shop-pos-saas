import prisma from '../../config/prisma';

export async function uploadSlipService(orderId: string, imageUrl: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new Error('Order not found');

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

  return slip;
}

export async function approvePaymentService(id: string) {
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

  return slip;
}

export async function rejectPaymentService(id: string) {
  return prisma.paymentSlip.update({
    where: { id },
    data: {
      status: 'rejected',
      reviewedAt: new Date(),
    },
  });
}

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
  return await prisma.$transaction(async (tx) => {
    const slip = await tx.paymentSlip.findUnique({
      where: { id },
      include: { order: { include: { items: true } } },
    });

    if (!slip) throw new Error('Payment slip not found');

    const order = slip.order;

    // Validate stock
    for (const item of order.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) throw new Error('Product not found');

      if (product.stockQty < item.qty) {
        throw new Error('Insufficient stock');
      }
    }

    // Deduct stock + create logs
    for (const item of order.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockQty: product!.stockQty - item.qty,
        },
      });

      await tx.inventoryLog.create({
        data: {
          productId: item.productId,
          changeQty: -item.qty,
          type: 'sale',
        },
      });
    }

    const updatedSlip = await tx.paymentSlip.update({
      where: { id },
      data: {
        status: 'approved',
        reviewedAt: new Date(),
      },
    });

    await tx.order.update({
      where: { id: slip.orderId },
      data: { status: 'completed' },
    });

    return updatedSlip;
  });
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

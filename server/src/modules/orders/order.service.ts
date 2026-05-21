import prisma from '../../config/prisma';

export async function createOrderService(userId: string, items: any[]) {
  return await prisma.$transaction(async (tx) => {
    let totalAmount = 0;

    for (const item of items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) throw new Error('Product not found');

      totalAmount += product.price * item.qty;
    }

    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            qty: item.qty,
            price: item.price,
          })),
        },
      },
    });

    return order;
  });
}

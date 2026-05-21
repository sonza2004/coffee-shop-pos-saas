import prisma from '../../config/prisma';

export async function createOrderService(userId: string, items: any[]) {
  return await prisma.$transaction(async (tx) => {
    const productIds = items.map(i => i.productId);

    const products = await tx.product.findMany({
      where: { id: { in: productIds } }
    });

    const productMap = new Map(products.map(p => [p.id, p]));

    let totalAmount = 0;

    for (const item of items) {
      const product = productMap.get(item.productId);

      if (!product) throw new Error('Product not found');

      totalAmount += product.price * item.qty;
    }

    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
        status: 'pending',
        items: {
          create: items.map(item => {
            const product = productMap.get(item.productId);

            return {
              productId: item.productId,
              qty: item.qty,
              price: product?.price || 0
            };
          })
        }
      }
    });

    return order;
  });
}

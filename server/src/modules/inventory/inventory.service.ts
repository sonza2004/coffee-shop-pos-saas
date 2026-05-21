import prisma from '../../config/prisma';

export async function getInventoryService() {
  return prisma.inventoryLog.findMany({
    orderBy: { createdAt: 'desc' },
    include: { product: true },
  });
}

export async function adjustInventoryService(productId: string, changeQty: number, type: string) {
  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new Error('Product not found');

    const updated = await tx.product.update({
      where: { id: productId },
      data: {
        stockQty: product.stockQty + changeQty,
      },
    });

    const log = await tx.inventoryLog.create({
      data: {
        productId,
        changeQty,
        type,
      },
    });

    return { updated, log };
  });
}

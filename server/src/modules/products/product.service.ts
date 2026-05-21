import prisma from '../../config/prisma';

export async function getProductsService() {
  return prisma.product.findMany({
    where: { isActive: true },
  });
}

export async function createProductService(data: any) {
  return prisma.product.create({
    data,
  });
}

export async function updateProductService(id: string, data: any) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

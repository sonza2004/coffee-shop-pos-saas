import { Request, Response } from 'express';
import prisma from '../../config/prisma';

// =========================
// GET INVENTORY LOGS
// =========================
export async function getInventory(req: Request, res: Response) {
  try {
    const logs = await prisma.inventoryLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        product: true,
      },
    });

    return res.json(logs);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch inventory' });
  }
}

// =========================
// MANUAL ADJUSTMENT
// =========================
export async function adjustInventory(req: Request, res: Response) {
  try {
    const { productId, changeQty, type } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        stockQty: product.stockQty + changeQty,
      },
    });

    const log = await prisma.inventoryLog.create({
      data: {
        productId,
        changeQty,
        type,
      },
    });

    return res.json({ updatedProduct, log });
  } catch (err) {
    return res.status(500).json({ message: 'Inventory update failed' });
  }
}

import { Request, Response } from 'express';
import prisma from '../../config/prisma';

// =========================
// GET ALL PRODUCTS
// =========================
export async function getProducts(req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
    });

    return res.json(products);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch products' });
  }
}

// =========================
// CREATE PRODUCT
// =========================
export async function createProduct(req: Request, res: Response) {
  try {
    const { name, price, stockQty, imageUrl } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        price,
        stockQty,
        imageUrl,
      },
    });

    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create product' });
  }
}

// =========================
// UPDATE PRODUCT
// =========================
export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, price, stockQty, imageUrl, isActive } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        stockQty,
        imageUrl,
        isActive,
      },
    });

    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update product' });
  }
}

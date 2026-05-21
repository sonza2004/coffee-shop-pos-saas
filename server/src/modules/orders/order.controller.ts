import { Request, Response } from 'express';
import prisma from '../../config/prisma';

// =========================
// CREATE ORDER
// =========================
export async function createOrder(req: Request, res: Response) {
  try {
    const { userId, items } = req.body;

    let totalAmount = 0;

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      totalAmount += product.price * item.qty;
    }

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            qty: item.qty,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: 'Order creation failed' });
  }
}

// =========================
// GET MY ORDERS
// =========================
export async function getMyOrders(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true, paymentSlip: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
}

// =========================
// GET ORDER BY ID
// =========================
export async function getOrderById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true, paymentSlip: true },
    });

    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch order' });
  }
}

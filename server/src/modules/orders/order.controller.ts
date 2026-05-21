import { Request, Response } from 'express';
import prisma from '../../config/prisma';
import { createOrderService } from './order.service';

// =========================
// CREATE ORDER
// =========================
export async function createOrder(req: Request, res: Response) {
  try {
    const { userId, items } = req.body;

    const order = await createOrderService(userId, items);

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

import { Request, Response } from 'express';
import prisma from '../../config/prisma';
import { createOrderService } from './order.service';

export async function createOrder(req: any, res: Response) {
  try {
    const userId = req.user?.id;
    const { items } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const order = await createOrderService(userId, items);

    return res.json({ data: order });
  } catch {
    return res.status(500).json({ error: 'Order creation failed' });
  }
}

export async function getMyOrders(req: any, res: Response) {
  try {
    const userId = req.user?.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true, paymentSlip: true },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ data: orders });
  } catch {
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true, paymentSlip: true }
    });

    return res.json({ data: order });
  } catch {
    return res.status(500).json({ error: 'Failed to fetch order' });
  }
}
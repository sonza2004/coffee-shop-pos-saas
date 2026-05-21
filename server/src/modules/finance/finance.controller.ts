import { Request, Response } from 'express';
import prisma from '../../config/prisma';

// =========================
// DAILY REPORT
// =========================
export async function getDailyReport(req: Request, res: Response) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: {
        status: 'approved',
        createdAt: {
          gte: today,
        },
      },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    return res.json({
      date: today,
      totalOrders: orders.length,
      totalRevenue,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to generate daily report' });
  }
}

// =========================
// MONTHLY REPORT
// =========================
export async function getMonthlySummary(req: Request, res: Response) {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);

    const orders = await prisma.order.findMany({
      where: {
        status: 'approved',
        createdAt: {
          gte: start,
        },
      },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    return res.json({
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      totalOrders: orders.length,
      totalRevenue,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to generate monthly summary' });
  }
}

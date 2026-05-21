import prisma from '../../config/prisma';

export async function getDailyReportService() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: {
      status: 'approved',
      createdAt: { gte: today },
    },
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return {
    date: today,
    totalOrders: orders.length,
    totalRevenue,
  };
}

export async function getMonthlySummaryService() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);

  const orders = await prisma.order.findMany({
    where: {
      status: 'approved',
      createdAt: { gte: start },
    },
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    totalOrders: orders.length,
    totalRevenue,
  };
}

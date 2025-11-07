import { prisma } from "@/lib/prisma";

export async function getAnalyticsData() {
  // 1. Task counts by status
  const taskCounts = await prisma.task.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  });

  const tasksByStatus = taskCounts.reduce((acc, curr) => {
    acc[curr.status] = curr._count.status;
    return acc;
  }, {} as Record<string, number>);


  // 2. Total Revenue and Expenses
  const totalRevenueResult = await prisma.invoice.aggregate({
    where: { status: "Paid" },
    _sum: {
      amount: true,
    },
  });
  const totalRevenue = totalRevenueResult._sum.amount || 0;

  const totalExpenseResult = await prisma.expense.aggregate({
    where: { status: "Approved" },
    _sum: {
      amount: true,
    },
  });
  const totalExpense = totalExpenseResult._sum.amount || 0;

  // 3. Month-over-month growth
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const revenueThisMonthResult = await prisma.invoice.aggregate({
      _sum: { amount: true },
      where: {
          status: "Paid",
          createdAt: {
              gte: currentMonthStart,
          },
      },
  });
  const revenueThisMonth = revenueThisMonthResult._sum.amount || 0;

  const revenueLastMonthResult = await prisma.invoice.aggregate({
      _sum: { amount: true },
      where: {
          status: "Paid",
          createdAt: {
              gte: prevMonthStart,
              lt: currentMonthStart,
          },
      },
  });
  const revenueLastMonth = revenueLastMonthResult._sum.amount || 0;

  const revenueGrowth = revenueLastMonth > 0 ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 : (revenueThisMonth > 0 ? 100 : 0);


  const expenseThisMonthResult = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
          status: "Approved",
          createdAt: {
              gte: currentMonthStart,
          },
      },
  });
  const expenseThisMonth = expenseThisMonthResult._sum.amount || 0;

  const expenseLastMonthResult = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
          status: "Approved",
          createdAt: {
              gte: prevMonthStart,
              lt: currentMonthStart,
          },
      },
  });
  const expenseLastMonth = expenseLastMonthResult._sum.amount || 0;
  
  const expenseGrowth = expenseLastMonth > 0 ? ((expenseThisMonth - expenseLastMonth) / expenseLastMonth) * 100 : (expenseThisMonth > 0 ? 100 : 0);

  return {
    tasks: {
      byStatus: tasksByStatus,
    },
    finance: {
      totalRevenue,
      totalExpense,
      growth: {
          revenue: revenueGrowth.toFixed(2),
          expense: expenseGrowth.toFixed(2),
      },
      thisMonth: {
          revenue: revenueThisMonth,
          expense: expenseThisMonth
      },
      lastMonth: {
          revenue: revenueLastMonth,
          expense: expenseLastMonth
      }
    },
  };
}

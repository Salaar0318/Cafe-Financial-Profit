import { SaleRecord, ExpenseRecord, DailySummary, CafeOverviewStats, ExpenseCategory } from '../types';

export function computeDailySummaries(sales: SaleRecord[], expenses: ExpenseRecord[]): DailySummary[] {
  // Extract all unique dates from both sales and expenses
  const dateSet = new Set<string>();
  sales.forEach((s) => dateSet.add(s.date));
  expenses.forEach((e) => dateSet.add(e.date));

  // Sort dates descending (newest first)
  const sortedDates = Array.from(dateSet).sort((a, b) => b.localeCompare(a));

  return sortedDates.map((date) => {
    const daySales = sales.filter((s) => s.date === date);
    const dayExpenses = expenses.filter((e) => e.date === date);

    const totalSales = daySales.reduce((sum, s) => sum + s.totalSales, 0);
    const orderCount = daySales.reduce((sum, s) => sum + (s.orderCount || 0), 0);
    const totalExpenses = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

    const netProfit = totalSales - totalExpenses;
    const profitMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;

    let status: 'profit' | 'loss' | 'breakeven' = 'breakeven';
    if (netProfit > 0.009) status = 'profit';
    else if (netProfit < -0.009) status = 'loss';

    // Find top expense category for this day
    const catMap: Record<string, number> = {};
    dayExpenses.forEach((e) => {
      catMap[e.category] = (catMap[e.category] || 0) + e.amount;
    });
    let topCat = '';
    let topCatVal = 0;
    Object.entries(catMap).forEach(([cat, val]) => {
      if (val > topCatVal) {
        topCatVal = val;
        topCat = cat;
      }
    });

    return {
      date,
      orderCount,
      totalSales,
      totalExpenses,
      netProfit,
      profitMargin,
      status,
      salesCount: daySales.length,
      expensesCount: dayExpenses.length,
      topExpenseCategory: topCat || undefined,
    };
  });
}

export function computeOverviewStats(dailySummaries: DailySummary[]): CafeOverviewStats {
  if (dailySummaries.length === 0) {
    return {
      totalSales: 0,
      totalExpenses: 0,
      netProfit: 0,
      averageProfitMargin: 0,
      averageDailySales: 0,
      averageDailyProfit: 0,
      totalOrders: 0,
      profitableDaysCount: 0,
      lossDaysCount: 0,
      bestDay: null,
      worstDay: null,
    };
  }

  const totalSales = dailySummaries.reduce((sum, d) => sum + d.totalSales, 0);
  const totalExpenses = dailySummaries.reduce((sum, d) => sum + d.totalExpenses, 0);
  const netProfit = totalSales - totalExpenses;
  const totalOrders = dailySummaries.reduce((sum, d) => sum + d.orderCount, 0);

  const averageProfitMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;
  const daysCount = dailySummaries.length;
  const averageDailySales = daysCount > 0 ? totalSales / daysCount : 0;
  const averageDailyProfit = daysCount > 0 ? netProfit / daysCount : 0;

  const profitableDaysCount = dailySummaries.filter((d) => d.status === 'profit').length;
  const lossDaysCount = dailySummaries.filter((d) => d.status === 'loss').length;

  let bestDay: { date: string; profit: number } | null = null;
  let worstDay: { date: string; profit: number } | null = null;

  dailySummaries.forEach((d) => {
    if (!bestDay || d.netProfit > bestDay.profit) {
      bestDay = { date: d.date, profit: d.netProfit };
    }
    if (!worstDay || d.netProfit < worstDay.profit) {
      worstDay = { date: d.date, profit: d.netProfit };
    }
  });

  return {
    totalSales,
    totalExpenses,
    netProfit,
    averageProfitMargin,
    averageDailySales,
    averageDailyProfit,
    totalOrders,
    profitableDaysCount,
    lossDaysCount,
    bestDay,
    worstDay,
  };
}

export function computeCategoryExpenses(expenses: ExpenseRecord[]): { category: ExpenseCategory; amount: number; percentage: number; count: number }[] {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categoryMap: Record<string, { amount: number; count: number }> = {};

  expenses.forEach((e) => {
    if (!categoryMap[e.category]) {
      categoryMap[e.category] = { amount: 0, count: 0 };
    }
    categoryMap[e.category].amount += e.amount;
    categoryMap[e.category].count += 1;
  });

  return Object.entries(categoryMap)
    .map(([cat, data]) => ({
      category: cat as ExpenseCategory,
      amount: data.amount,
      percentage: total > 0 ? (data.amount / total) * 100 : 0,
      count: data.count,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDateDisplay(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return dateStr;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

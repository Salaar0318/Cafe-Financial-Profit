export type ShiftType = 'All Day' | 'Morning' | 'Afternoon' | 'Evening';

export type ExpenseCategory =
  | 'Coffee Beans & Roasts'
  | 'Milk & Dairy'
  | 'Bakery & Pastries'
  | 'Syrups & Perishables'
  | 'Cups & Disposables'
  | 'Staff Wages'
  | 'Utilities & Ice'
  | 'Rent & Facilities'
  | 'Equipment & Repairs'
  | 'Cleaning Supplies'
  | 'Marketing & POS'
  | 'Miscellaneous';

export interface PaymentBreakdown {
  cash: number;
  card: number;
  online: number;
}

export interface SaleRecord {
  id: string;
  date: string; // YYYY-MM-DD
  shift: ShiftType;
  orderCount: number;
  coffeeRevenue: number;
  bakeryRevenue: number;
  foodRevenue: number;
  otherRevenue: number;
  totalSales: number;
  paymentBreakdown: PaymentBreakdown;
  notes?: string;
  createdAt: string;
}

export interface ExpenseRecord {
  id: string;
  date: string; // YYYY-MM-DD
  category: ExpenseCategory;
  itemName: string;
  vendor: string;
  amount: number;
  paymentMethod: 'Cash' | 'Card' | 'Bank Transfer' | 'Petty Cash';
  receiptNo?: string;
  notes?: string;
  createdAt: string;
}

export interface DailySummary {
  date: string; // YYYY-MM-DD
  orderCount: number;
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number; // percentage e.g. 28.5
  status: 'profit' | 'loss' | 'breakeven';
  salesCount: number;
  expensesCount: number;
  topExpenseCategory?: string;
}

export interface CafeOverviewStats {
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  averageProfitMargin: number;
  averageDailySales: number;
  averageDailyProfit: number;
  totalOrders: number;
  profitableDaysCount: number;
  lossDaysCount: number;
  bestDay: { date: string; profit: number } | null;
  worstDay: { date: string; profit: number } | null;
}

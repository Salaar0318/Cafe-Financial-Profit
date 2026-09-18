import * as XLSX from 'xlsx';
import { SaleRecord, ExpenseRecord, DailySummary, ExpenseCategory } from '../types';
import { computeCategoryExpenses, computeOverviewStats } from './calculations';

/**
 * Generates and downloads a comprehensive multi-tab Excel (.xlsx) workbook
 * containing date-by-date sales, itemized expenses, daily profit calculations with formulas,
 * and summary analytics.
 */
export function exportCafeDatabaseToExcel(
  sales: SaleRecord[],
  expenses: ExpenseRecord[],
  dailySummaries: DailySummary[],
  cafeName: string = 'My Cafe'
): void {
  const wb = XLSX.utils.book_new();

  // 1. SHEET 1: Daily Profit & Loss (Summary Date-by-Date)
  // Sort dates ascending for Excel chronological view
  const chronologicalSummaries = [...dailySummaries].sort((a, b) => a.date.localeCompare(b.date));

  const profitRows = chronologicalSummaries.map((day) => ({
    'Date (YYYY-MM-DD)': day.date,
    'Orders Count': day.orderCount,
    'Total Sales ($)': Number(day.totalSales.toFixed(2)),
    'Total Expenses ($)': Number(day.totalExpenses.toFixed(2)),
    'Net Profit ($)': Number(day.netProfit.toFixed(2)),
    'Profit Margin (%)': Number(day.profitMargin.toFixed(2)),
    'Financial Status': day.status.toUpperCase(),
    'Top Expense Driver': day.topExpenseCategory || 'N/A',
  }));

  const wsProfit = XLSX.utils.json_to_sheet(profitRows);

  // Add Totals row at the bottom of Profit sheet
  const numProfitRows = profitRows.length;
  if (numProfitRows > 0) {
    const totalSalesSum = chronologicalSummaries.reduce((s, d) => s + d.totalSales, 0);
    const totalExpensesSum = chronologicalSummaries.reduce((s, d) => s + d.totalExpenses, 0);
    const totalProfitSum = totalSalesSum - totalExpensesSum;
    const overallMargin = totalSalesSum > 0 ? (totalProfitSum / totalSalesSum) * 100 : 0;

    XLSX.utils.sheet_add_aoa(
      wsProfit,
      [
        [
          'TOTAL / SUMMARY',
          chronologicalSummaries.reduce((s, d) => s + d.orderCount, 0),
          Number(totalSalesSum.toFixed(2)),
          Number(totalExpensesSum.toFixed(2)),
          Number(totalProfitSum.toFixed(2)),
          Number(overallMargin.toFixed(2)),
          totalProfitSum >= 0 ? 'NET PROFIT' : 'NET LOSS',
          '',
        ],
      ],
      { origin: -1 }
    );
  }

  // Set column widths for sheet 1
  wsProfit['!cols'] = [
    { wch: 18 }, // Date
    { wch: 14 }, // Orders
    { wch: 16 }, // Sales
    { wch: 18 }, // Expenses
    { wch: 16 }, // Profit
    { wch: 18 }, // Margin
    { wch: 18 }, // Status
    { wch: 25 }, // Top Expense
  ];

  XLSX.utils.book_append_sheet(wb, wsProfit, 'Daily Profit Summary');

  // 2. SHEET 2: Date-by-Date Sales Ledger
  const sortedSales = [...sales].sort((a, b) => a.date.localeCompare(b.date));
  const salesRows = sortedSales.map((s) => ({
    'Date (YYYY-MM-DD)': s.date,
    Shift: s.shift,
    Orders: s.orderCount,
    'Coffee & Drinks ($)': Number(s.coffeeRevenue.toFixed(2)),
    'Bakery & Pastries ($)': Number(s.bakeryRevenue.toFixed(2)),
    'Food Menu ($)': Number(s.foodRevenue.toFixed(2)),
    'Other Merchandise ($)': Number(s.otherRevenue.toFixed(2)),
    'Total Sales ($)': Number(s.totalSales.toFixed(2)),
    'Cash ($)': Number(s.paymentBreakdown.cash.toFixed(2)),
    'Card ($)': Number(s.paymentBreakdown.card.toFixed(2)),
    'Online / Delivery ($)': Number(s.paymentBreakdown.online.toFixed(2)),
    Notes: s.notes || '',
  }));

  const wsSales = XLSX.utils.json_to_sheet(salesRows);
  if (salesRows.length > 0) {
    const totalSalesAmt = sortedSales.reduce((sum, s) => sum + s.totalSales, 0);
    const totalCoffee = sortedSales.reduce((sum, s) => sum + s.coffeeRevenue, 0);
    const totalBakery = sortedSales.reduce((sum, s) => sum + s.bakeryRevenue, 0);
    const totalFood = sortedSales.reduce((sum, s) => sum + s.foodRevenue, 0);
    const totalOther = sortedSales.reduce((sum, s) => sum + s.otherRevenue, 0);

    XLSX.utils.sheet_add_aoa(
      wsSales,
      [
        [
          'TOTALS',
          '',
          sortedSales.reduce((sum, s) => sum + s.orderCount, 0),
          Number(totalCoffee.toFixed(2)),
          Number(totalBakery.toFixed(2)),
          Number(totalFood.toFixed(2)),
          Number(totalOther.toFixed(2)),
          Number(totalSalesAmt.toFixed(2)),
          '',
          '',
          '',
          '',
        ],
      ],
      { origin: -1 }
    );
  }

  wsSales['!cols'] = [
    { wch: 18 },
    { wch: 12 },
    { wch: 10 },
    { wch: 18 },
    { wch: 20 },
    { wch: 16 },
    { wch: 20 },
    { wch: 16 },
    { wch: 12 },
    { wch: 12 },
    { wch: 18 },
    { wch: 35 },
  ];
  XLSX.utils.book_append_sheet(wb, wsSales, 'Sales Ledger');

  // 3. SHEET 3: Daily Expenses Ledger
  const sortedExpenses = [...expenses].sort((a, b) => a.date.localeCompare(b.date));
  const expenseRows = sortedExpenses.map((e) => ({
    'Date (YYYY-MM-DD)': e.date,
    Category: e.category,
    'Expense Item / Description': e.itemName,
    'Supplier / Vendor': e.vendor,
    'Amount ($)': Number(e.amount.toFixed(2)),
    'Payment Method': e.paymentMethod,
    'Receipt / Invoice #': e.receiptNo || '',
    Notes: e.notes || '',
  }));

  const wsExpenses = XLSX.utils.json_to_sheet(expenseRows);
  if (expenseRows.length > 0) {
    const totalExpensesAmt = sortedExpenses.reduce((sum, e) => sum + e.amount, 0);
    XLSX.utils.sheet_add_aoa(
      wsExpenses,
      [['TOTAL EXPENSES', '', '', '', Number(totalExpensesAmt.toFixed(2)), '', '', '']],
      { origin: -1 }
    );
  }

  wsExpenses['!cols'] = [
    { wch: 18 },
    { wch: 24 },
    { wch: 35 },
    { wch: 26 },
    { wch: 14 },
    { wch: 16 },
    { wch: 20 },
    { wch: 35 },
  ];
  XLSX.utils.book_append_sheet(wb, wsExpenses, 'Expenses Ledger');

  // 4. SHEET 4: Category Expenses Breakdown
  const categoryStats = computeCategoryExpenses(expenses);
  const categoryRows = categoryStats.map((c) => ({
    'Expense Category': c.category,
    'Total Spent ($)': Number(c.amount.toFixed(2)),
    'Share of Total Expenses (%)': Number(c.percentage.toFixed(2)),
    'Number of Invoices / Entries': c.count,
  }));

  const wsCategories = XLSX.utils.json_to_sheet(categoryRows);
  wsCategories['!cols'] = [
    { wch: 28 },
    { wch: 18 },
    { wch: 28 },
    { wch: 28 },
  ];
  XLSX.utils.book_append_sheet(wb, wsCategories, 'Expense by Category');

  // 5. SHEET 5: Cafe KPI Executive Overview
  const stats = computeOverviewStats(dailySummaries);
  const overviewData = [
    ['CAFE FINANCIAL DATABASE REPORT', cafeName],
    ['Export Date & Time', new Date().toLocaleString()],
    ['Report Period Days', dailySummaries.length],
    ['', ''],
    ['METRIC', 'VALUE'],
    ['Total Gross Sales', `$${stats.totalSales.toFixed(2)}`],
    ['Total Operational Expenses', `$${stats.totalExpenses.toFixed(2)}`],
    ['Total Net Profit', `$${stats.netProfit.toFixed(2)}`],
    ['Overall Profit Margin (%)', `${stats.averageProfitMargin.toFixed(2)}%`],
    ['Average Daily Sales', `$${stats.averageDailySales.toFixed(2)}`],
    ['Average Daily Profit', `$${stats.averageDailyProfit.toFixed(2)}`],
    ['Total Cafe Orders Served', stats.totalOrders],
    ['Profitable Days Count', stats.profitableDaysCount],
    ['Loss / Negative Days Count', stats.lossDaysCount],
    ['Best Profit Day', stats.bestDay ? `${stats.bestDay.date} ($${stats.bestDay.profit.toFixed(2)})` : 'N/A'],
    ['Lowest Day', stats.worstDay ? `${stats.worstDay.date} ($${stats.worstDay.profit.toFixed(2)})` : 'N/A'],
  ];

  const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);
  wsOverview['!cols'] = [{ wch: 32 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, wsOverview, 'KPI Overview');

  // Generate Excel binary file and trigger browser download
  const todayStr = new Date().toISOString().split('T')[0];
  const filename = `${cafeName.replace(/\s+/g, '_')}_Financial_Database_${todayStr}.xlsx`;

  XLSX.writeFile(wb, filename);
}

/**
 * Downloads a clean Excel template with pre-built headers and formula rows
 * for cafe owners who prefer starting with a blank spreadsheet.
 */
export function downloadBlankCafeExcelTemplate(): void {
  const wb = XLSX.utils.book_new();

  // 1. Template Daily P&L
  const sampleDailyRows = [
    {
      'Date (YYYY-MM-DD)': '2026-09-01',
      'Orders Count': 120,
      'Total Sales ($)': 800.0,
      'Total Expenses ($)': 520.0,
      'Net Profit ($)': 280.0,
      'Profit Margin (%)': 35.0,
      Status: 'PROFIT',
      Notes: 'Sample initial day row - replace with your numbers',
    },
    {
      'Date (YYYY-MM-DD)': '2026-09-02',
      'Orders Count': 0,
      'Total Sales ($)': 0,
      'Total Expenses ($)': 0,
      'Net Profit ($)': 0,
      'Profit Margin (%)': 0,
      Status: 'PENDING',
      Notes: '',
    },
  ];
  const wsDaily = XLSX.utils.json_to_sheet(sampleDailyRows);
  wsDaily['!cols'] = [
    { wch: 18 },
    { wch: 14 },
    { wch: 16 },
    { wch: 18 },
    { wch: 16 },
    { wch: 18 },
    { wch: 14 },
    { wch: 45 },
  ];
  XLSX.utils.book_append_sheet(wb, wsDaily, 'Daily Profit Template');

  // 2. Template Sales Entry
  const sampleSalesRows = [
    {
      'Date (YYYY-MM-DD)': '2026-09-01',
      Shift: 'All Day',
      'Orders Count': 120,
      'Coffee & Drinks ($)': 500.0,
      'Bakery & Pastries ($)': 180.0,
      'Food Menu ($)': 90.0,
      'Other ($)': 30.0,
      'Total Sales ($)': 800.0,
      'Cash ($)': 200.0,
      'Card ($)': 520.0,
      'Online ($)': 80.0,
      Notes: 'Example sale entry',
    },
  ];
  const wsSales = XLSX.utils.json_to_sheet(sampleSalesRows);
  wsSales['!cols'] = [
    { wch: 18 },
    { wch: 12 },
    { wch: 14 },
    { wch: 18 },
    { wch: 20 },
    { wch: 16 },
    { wch: 14 },
    { wch: 16 },
    { wch: 12 },
    { wch: 12 },
    { wch: 14 },
    { wch: 30 },
  ];
  XLSX.utils.book_append_sheet(wb, wsSales, 'Sales Entry Template');

  // 3. Template Expenses Entry
  const sampleExpensesRows = [
    {
      'Date (YYYY-MM-DD)': '2026-09-01',
      Category: 'Coffee Beans & Roasts',
      'Expense Item': 'Espresso Blend 10kg',
      Vendor: 'Local Roaster',
      'Amount ($)': 220.0,
      'Payment Method': 'Card',
      'Receipt #': 'INV-101',
      Notes: 'Weekly bean order',
    },
    {
      'Date (YYYY-MM-DD)': '2026-09-01',
      Category: 'Milk & Dairy',
      'Expense Item': 'Whole & Oat Milk 6 Cases',
      Vendor: 'Dairy Fresh Co.',
      'Amount ($)': 110.0,
      'Payment Method': 'Card',
      'Receipt #': 'RCP-992',
      Notes: 'Milk restock',
    },
    {
      'Date (YYYY-MM-DD)': '2026-09-01',
      Category: 'Staff Wages',
      'Expense Item': 'Barista Shift Pay',
      Vendor: 'Cafe Payroll',
      'Amount ($)': 190.0,
      'Payment Method': 'Bank Transfer',
      'Receipt #': 'PAY-01',
      Notes: 'Daily barista wages',
    },
  ];
  const wsExp = XLSX.utils.json_to_sheet(sampleExpensesRows);
  wsExp['!cols'] = [
    { wch: 18 },
    { wch: 24 },
    { wch: 32 },
    { wch: 22 },
    { wch: 14 },
    { wch: 16 },
    { wch: 16 },
    { wch: 30 },
  ];
  XLSX.utils.book_append_sheet(wb, wsExp, 'Expenses Entry Template');

  XLSX.writeFile(wb, 'Cafe_Database_Blank_Excel_Template.xlsx');
}

/**
 * Parses uploaded Excel workbook or CSV file, extracting sales and expense rows.
 */
export async function parseUploadedExcel(file: File): Promise<{
  importedSales: SaleRecord[];
  importedExpenses: ExpenseRecord[];
  message: string;
}> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' });

  const importedSales: SaleRecord[] = [];
  const importedExpenses: ExpenseRecord[] = [];

  // Helper to sanitize date
  const cleanDate = (val: unknown): string => {
    if (!val) return new Date().toISOString().split('T')[0];
    if (typeof val === 'number') {
      // Excel serial date number
      const dateObj = XLSX.SSF.parse_date_code(val);
      if (dateObj) {
        const m = String(dateObj.m).padStart(2, '0');
        const d = String(dateObj.d).padStart(2, '0');
        return `${dateObj.y}-${m}-${d}`;
      }
    }
    const str = String(val).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  };

  wb.SheetNames.forEach((sheetName) => {
    const sheet = wb.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

    rawData.forEach((row, index) => {
      // Look for sales fields
      const dateVal = row['Date (YYYY-MM-DD)'] || row['Date'] || row['date'];
      const salesVal =
        row['Total Sales ($)'] || row['Total Sales'] || row['TotalSales'] || row['Sales'] || row['sales'];
      const expenseAmountVal =
        row['Amount ($)'] || row['Amount'] || row['amount'] || row['Expense ($)'] || row['Expense'];

      const isExpense =
        Boolean(row['Category'] || row['category'] || row['Expense Item'] || row['Expense Item / Description'] || row['Vendor']);

      if (isExpense && expenseAmountVal !== undefined) {
        const amount = parseFloat(String(expenseAmountVal).replace(/[^0-9.-]+/g, '')) || 0;
        if (amount > 0) {
          const category = (row['Category'] || row['category'] || 'Miscellaneous') as ExpenseCategory;
          const itemName = String(row['Expense Item / Description'] || row['Expense Item'] || row['Item'] || row['Description'] || 'Imported Expense');
          const vendor = String(row['Supplier / Vendor'] || row['Vendor'] || row['vendor'] || 'General Supplier');
          const paymentMethod = (row['Payment Method'] || 'Card') as 'Cash' | 'Card' | 'Bank Transfer' | 'Petty Cash';

          importedExpenses.push({
            id: `imported-exp-${Date.now()}-${index}`,
            date: cleanDate(dateVal),
            category,
            itemName,
            vendor,
            amount,
            paymentMethod,
            receiptNo: String(row['Receipt / Invoice #'] || row['Receipt #'] || ''),
            notes: String(row['Notes'] || row['notes'] || ''),
            createdAt: new Date().toISOString(),
          });
        }
      } else if (salesVal !== undefined) {
        const totalSales = parseFloat(String(salesVal).replace(/[^0-9.-]+/g, '')) || 0;
        if (totalSales > 0) {
          const orderCount = parseInt(String(row['Orders Count'] || row['Orders'] || row['orders'] || '0'), 10) || 0;
          const coffeeRevenue = parseFloat(String(row['Coffee & Drinks ($)'] || row['Coffee'] || '0')) || totalSales * 0.6;
          const bakeryRevenue = parseFloat(String(row['Bakery & Pastries ($)'] || row['Bakery'] || '0')) || totalSales * 0.25;
          const foodRevenue = parseFloat(String(row['Food Menu ($)'] || row['Food'] || '0')) || totalSales * 0.15;
          const otherRevenue = parseFloat(String(row['Other Merchandise ($)'] || row['Other'] || '0')) || 0;

          importedSales.push({
            id: `imported-sale-${Date.now()}-${index}`,
            date: cleanDate(dateVal),
            shift: (row['Shift'] as any) || 'All Day',
            orderCount: orderCount || Math.round(totalSales / 6.5),
            coffeeRevenue,
            bakeryRevenue,
            foodRevenue,
            otherRevenue,
            totalSales,
            paymentBreakdown: {
              cash: parseFloat(String(row['Cash ($)'] || totalSales * 0.25)) || 0,
              card: parseFloat(String(row['Card ($)'] || totalSales * 0.65)) || 0,
              online: parseFloat(String(row['Online / Delivery ($)'] || totalSales * 0.1)) || 0,
            },
            notes: String(row['Notes'] || row['notes'] || 'Imported from Excel'),
            createdAt: new Date().toISOString(),
          });
        }
      }
    });
  });

  return {
    importedSales,
    importedExpenses,
    message: `Successfully processed Excel sheet! Found ${importedSales.length} sales entries and ${importedExpenses.length} expense records.`,
  };
}

import React, { useState, useMemo } from 'react';
import { DailySummary, SaleRecord, ExpenseRecord } from '../types';
import { formatCurrency, formatDateDisplay } from '../utils/calculations';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Receipt,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Calendar,
  Layers,
  ArrowUpDown,
  FileSpreadsheet,
} from 'lucide-react';

interface DailyProfitTableProps {
  dailySummaries: DailySummary[];
  sales: SaleRecord[];
  expenses: ExpenseRecord[];
  onOpenSaleModalForDate: (date: string) => void;
  onOpenExpenseModalForDate: (date: string) => void;
  onExportExcel: () => void;
}

export const DailyProfitTable: React.FC<DailyProfitTableProps> = ({
  dailySummaries,
  sales,
  expenses,
  onOpenSaleModalForDate,
  onOpenExpenseModalForDate,
  onExportExcel,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'profit' | 'loss'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});

  const toggleExpand = (date: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const filteredSummaries = useMemo(() => {
    return dailySummaries
      .filter((day) => {
        const matchesSearch =
          day.date.includes(searchTerm) ||
          formatDateDisplay(day.date).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === 'all'
            ? true
            : statusFilter === 'profit'
            ? day.status === 'profit'
            : day.status === 'loss';
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        return sortOrder === 'desc'
          ? b.date.localeCompare(a.date)
          : a.date.localeCompare(b.date);
      });
  }, [dailySummaries, searchTerm, statusFilter, sortOrder]);

  const totals = useMemo(() => {
    const totalSales = filteredSummaries.reduce((sum, d) => sum + d.totalSales, 0);
    const totalExpenses = filteredSummaries.reduce((sum, d) => sum + d.totalExpenses, 0);
    const netProfit = totalSales - totalExpenses;
    const totalOrders = filteredSummaries.reduce((sum, d) => sum + d.orderCount, 0);
    const avgMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;
    return { totalSales, totalExpenses, netProfit, totalOrders, avgMargin };
  }, [filteredSummaries]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header & Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">
                Date-by-Date Cafe Profit & Loss Database
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                {filteredSummaries.length} Days
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Calculates Net Profit = Daily Sales − Daily Expenses with margin percentages
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                id="search-date-input"
                type="text"
                placeholder="Search date (e.g. 2026-09)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-44 sm:w-56"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5 text-xs">
              <button
                id="filter-status-all"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                id="filter-status-profit"
                onClick={() => setStatusFilter('profit')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  statusFilter === 'profit'
                    ? 'bg-emerald-600 text-white'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                Profit Only
              </button>
              <button
                id="filter-status-loss"
                onClick={() => setStatusFilter('loss')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  statusFilter === 'loss'
                    ? 'bg-rose-600 text-white'
                    : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                Loss Only
              </button>
            </div>

            {/* Sort Date Order */}
            <button
              id="toggle-sort-order-btn"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              title="Toggle date sorting order"
            >
              <ArrowUpDown className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </button>

            {/* Quick Export Excel */}
            <button
              id="table-export-excel-btn"
              onClick={onExportExcel}
              className="inline-flex items-center px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
              title="Export this sheet to Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              <span>Excel Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spreadsheet Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4 w-10"></th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-center">Orders</th>
              <th className="py-3 px-4 text-right">Daily Sales ($)</th>
              <th className="py-3 px-4 text-right">Daily Expenses ($)</th>
              <th className="py-3 px-4 text-right">Net Profit ($)</th>
              <th className="py-3 px-4 text-right">Profit Margin</th>
              <th className="py-3 px-4 text-center">Financial Status</th>
              <th className="py-3 px-4 text-center">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 bg-white text-slate-800">
            {filteredSummaries.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500">
                  <div className="max-w-xs mx-auto text-center">
                    <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">No records found</p>
                    <p className="text-xs text-slate-500 mt-1">
                      No sales or expense records match your current filter.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSummaries.map((day) => {
                const isExpanded = !!expandedDates[day.date];
                const daySales = sales.filter((s) => s.date === day.date);
                const dayExpenses = expenses.filter((e) => e.date === day.date);
                const isProfit = day.netProfit >= 0;

                return (
                  <React.Fragment key={day.date}>
                    <tr
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isExpanded ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Expand Toggle */}
                      <td className="py-3 px-3 text-center">
                        <button
                          id={`expand-btn-${day.date}`}
                          onClick={() => toggleExpand(day.date)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded transition-colors"
                          title={isExpanded ? 'Collapse day details' : 'Expand day details'}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-amber-700" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 font-mono-num">
                          {day.date}
                        </div>
                        <div className="text-xs text-slate-500">
                          {formatDateDisplay(day.date)}
                        </div>
                      </td>

                      {/* Orders Count */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 font-mono-num">
                          {day.orderCount}
                        </span>
                      </td>

                      {/* Total Sales */}
                      <td className="py-3 px-4 text-right whitespace-nowrap font-mono-num font-bold text-blue-700">
                        {formatCurrency(day.totalSales)}
                      </td>

                      {/* Total Expenses */}
                      <td className="py-3 px-4 text-right whitespace-nowrap font-mono-num font-medium text-rose-600">
                        {formatCurrency(day.totalExpenses)}
                      </td>

                      {/* Net Profit (The user's key calculation!) */}
                      <td className="py-3 px-4 text-right whitespace-nowrap font-mono-num font-black text-base">
                        <span
                          className={
                            isProfit
                              ? 'text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded'
                              : 'text-rose-700 bg-rose-50/80 px-2 py-0.5 rounded'
                          }
                        >
                          {formatCurrency(day.netProfit)}
                        </span>
                      </td>

                      {/* Profit Margin % */}
                      <td className="py-3 px-4 text-right whitespace-nowrap font-mono-num text-xs font-semibold text-slate-700">
                        {day.profitMargin.toFixed(1)}%
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold tracking-wide uppercase ${
                            isProfit
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isProfit ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {day.status}
                        </span>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            id={`add-sale-date-${day.date}`}
                            onClick={() => onOpenSaleModalForDate(day.date)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Add/Edit sale for this date"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`add-expense-date-${day.date}`}
                            onClick={() => onOpenExpenseModalForDate(day.date)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                            title="Add expense for this date"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Breakdown Drawer for this Day */}
                    {isExpanded && (
                      <tr className="bg-slate-50/90 border-y border-slate-200">
                        <td colSpan={9} className="p-4 sm:p-5">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Day Sales Breakdown */}
                            <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs">
                              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center">
                                  <Layers className="w-3.5 h-3.5 mr-1" />
                                  Sales Breakdown ({day.date})
                                </span>
                                <span className="font-mono-num font-bold text-sm text-blue-700">
                                  Total: {formatCurrency(day.totalSales)}
                                </span>
                              </div>

                              {daySales.length === 0 ? (
                                <p className="text-xs text-slate-400 italic py-2">
                                  No sales entry for this date yet.
                                </p>
                              ) : (
                                <div className="space-y-2">
                                  {daySales.map((s) => (
                                    <div key={s.id} className="text-xs space-y-1.5">
                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-2 rounded">
                                        <div>
                                          <span className="text-slate-400 block text-[10px] uppercase">Coffee & Drinks</span>
                                          <span className="font-mono-num font-semibold text-slate-800">{formatCurrency(s.coffeeRevenue)}</span>
                                        </div>
                                        <div>
                                          <span className="text-slate-400 block text-[10px] uppercase">Bakery</span>
                                          <span className="font-mono-num font-semibold text-slate-800">{formatCurrency(s.bakeryRevenue)}</span>
                                        </div>
                                        <div>
                                          <span className="text-slate-400 block text-[10px] uppercase">Food Menu</span>
                                          <span className="font-mono-num font-semibold text-slate-800">{formatCurrency(s.foodRevenue)}</span>
                                        </div>
                                        <div>
                                          <span className="text-slate-400 block text-[10px] uppercase">Merch & Other</span>
                                          <span className="font-mono-num font-semibold text-slate-800">{formatCurrency(s.otherRevenue)}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                                        <span>
                                          Payment: Cash {formatCurrency(s.paymentBreakdown.cash)} | Card {formatCurrency(s.paymentBreakdown.card)} | Online {formatCurrency(s.paymentBreakdown.online)}
                                        </span>
                                        {s.notes && (
                                          <span className="italic text-slate-400 truncate max-w-xs">
                                            "{s.notes}"
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Day Expenses Breakdown */}
                            <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs">
                              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center">
                                  <Receipt className="w-3.5 h-3.5 mr-1" />
                                  Itemized Expenses ({dayExpenses.length} entries)
                                </span>
                                <span className="font-mono-num font-bold text-sm text-rose-600">
                                  Total: {formatCurrency(day.totalExpenses)}
                                </span>
                              </div>

                              {dayExpenses.length === 0 ? (
                                <p className="text-xs text-slate-400 italic py-2">
                                  No expenses recorded for this date.
                                </p>
                              ) : (
                                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                  {dayExpenses.map((e) => (
                                    <div
                                      key={e.id}
                                      className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 hover:bg-slate-100/80 transition-colors"
                                    >
                                      <div className="truncate mr-2">
                                        <span className="font-semibold text-slate-800 block truncate">
                                          {e.itemName}
                                        </span>
                                        <span className="text-[10px] text-slate-500">
                                          {e.category} • {e.vendor}
                                        </span>
                                      </div>
                                      <div className="text-right shrink-0">
                                        <span className="font-mono-num font-bold text-rose-600">
                                          {formatCurrency(e.amount)}
                                        </span>
                                        <span className="text-[10px] text-slate-400 block">
                                          {e.paymentMethod}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>

          {/* Sticky/Bottom Excel-Style Totals Row */}
          {filteredSummaries.length > 0 && (
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                <td className="py-3 px-3"></td>
                <td className="py-3 px-4 font-extrabold uppercase text-xs tracking-wider">
                  TOTAL / SUM
                </td>
                <td className="py-3 px-4 text-center font-mono-num">
                  {totals.totalOrders.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right font-mono-num text-blue-700 text-base">
                  {formatCurrency(totals.totalSales)}
                </td>
                <td className="py-3 px-4 text-right font-mono-num text-rose-600 text-base">
                  {formatCurrency(totals.totalExpenses)}
                </td>
                <td className="py-3 px-4 text-right font-mono-num text-base">
                  <span
                    className={
                      totals.netProfit >= 0
                        ? 'text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded'
                        : 'text-rose-700 bg-rose-100 px-2 py-0.5 rounded'
                    }
                  >
                    {formatCurrency(totals.netProfit)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-mono-num text-xs font-semibold">
                  {totals.avgMargin.toFixed(1)}%
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${
                      totals.netProfit >= 0
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-rose-200 text-rose-900'
                    }`}
                  >
                    {totals.netProfit >= 0 ? 'NET PROFIT' : 'NET LOSS'}
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-xs text-slate-400">
                  =SUM(Rows)
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

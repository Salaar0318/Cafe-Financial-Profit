import React from 'react';
import { CafeOverviewStats } from '../types';
import { formatCurrency } from '../utils/calculations';
import { TrendingUp, TrendingDown, DollarSign, Receipt, Percent, ShoppingBag, Award } from 'lucide-react';

interface StatsCardsProps {
  stats: CafeOverviewStats;
  daysCount: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, daysCount }) => {
  const isProfitable = stats.netProfit >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Sales / Revenue */}
      <div
        id="card-total-sales"
        className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Gross Sales
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-black text-slate-900 font-mono-num tracking-tight">
            {formatCurrency(stats.totalSales)}
          </div>
        </div>
        <div className="mt-2.5 flex items-center text-xs text-slate-500 justify-between pt-2 border-t border-slate-100">
          <span className="flex items-center">
            <ShoppingBag className="w-3.5 h-3.5 mr-1 text-slate-400" />
            {stats.totalOrders.toLocaleString()} Orders
          </span>
          <span className="font-mono-num text-slate-600 font-medium">
            Avg {formatCurrency(stats.averageDailySales)}/day
          </span>
        </div>
      </div>

      {/* 2. Total Daily Expenses */}
      <div
        id="card-total-expenses"
        className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Expenses
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-black text-slate-900 font-mono-num tracking-tight">
            {formatCurrency(stats.totalExpenses)}
          </div>
        </div>
        <div className="mt-2.5 flex items-center text-xs text-slate-500 justify-between pt-2 border-t border-slate-100">
          <span>COGS, Dairy, Staff & Ops</span>
          <span className="font-mono-num text-slate-600 font-medium">
            Avg {formatCurrency(daysCount > 0 ? stats.totalExpenses / daysCount : 0)}/day
          </span>
        </div>
      </div>

      {/* 3. Net Cafe Profit (The Key Calculation!) */}
      <div
        id="card-net-profit"
        className={`bg-white rounded-xl p-5 border shadow-xs hover:shadow-sm transition-all ${
          isProfitable ? 'border-emerald-200 bg-linear-to-b from-white to-emerald-50/20' : 'border-rose-200 bg-linear-to-b from-white to-rose-50/20'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Net Cafe Profit
          </span>
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isProfitable ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}
          >
            {isProfitable ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div
            className={`text-2xl font-black font-mono-num tracking-tight ${
              isProfitable ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {formatCurrency(stats.netProfit)}
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              isProfitable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}
          >
            {isProfitable ? 'PROFIT' : 'NET LOSS'}
          </span>
        </div>
        <div className="mt-2.5 flex items-center text-xs text-slate-500 justify-between pt-2 border-t border-slate-100">
          <span className="font-mono-num text-slate-600">
            = Sales ({formatCurrency(stats.totalSales)}) − Expenses
          </span>
          <span className="font-mono-num font-semibold text-emerald-600">
            {stats.profitableDaysCount}/{daysCount} Days +
          </span>
        </div>
      </div>

      {/* 4. Profit Margin & Best Day */}
      <div
        id="card-profit-margin"
        className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Profit Margin %
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-black text-slate-900 font-mono-num tracking-tight">
            {stats.averageProfitMargin.toFixed(1)}%
          </div>
          <span className="text-xs text-slate-500 font-medium">
            (Profit ÷ Sales)
          </span>
        </div>
        <div className="mt-2.5 flex items-center text-xs text-slate-500 justify-between pt-2 border-t border-slate-100">
          <span className="flex items-center truncate text-slate-600">
            <Award className="w-3.5 h-3.5 mr-1 text-amber-500 shrink-0" />
            Best: {stats.bestDay ? `${stats.bestDay.date}` : 'N/A'}
          </span>
          <span className="font-mono-num text-emerald-600 font-semibold shrink-0">
            {stats.bestDay ? formatCurrency(stats.bestDay.profit) : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

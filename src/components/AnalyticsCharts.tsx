import React from 'react';
import { DailySummary, ExpenseRecord } from '../types';
import { computeCategoryExpenses, formatCurrency } from '../utils/calculations';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, BarChart3 } from 'lucide-react';

interface AnalyticsChartsProps {
  dailySummaries: DailySummary[];
  expenses: ExpenseRecord[];
}

const PIE_COLORS = [
  '#d97706', // amber
  '#2563eb', // blue
  '#f97316', // orange
  '#9333ea', // purple
  '#0d9488', // teal
  '#059669', // emerald
  '#0284c7', // sky
  '#4f46e5', // indigo
  '#e11d48', // rose
  '#64748b', // slate
];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ dailySummaries, expenses }) => {
  // Chronological data for timeline
  const chartData = [...dailySummaries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => ({
      date: d.date.slice(5), // MM-DD for compact axis
      fullDate: d.date,
      Sales: Number(d.totalSales.toFixed(2)),
      Expenses: Number(d.totalExpenses.toFixed(2)),
      Profit: Number(d.netProfit.toFixed(2)),
    }));

  const categoryData = computeCategoryExpenses(expenses).map((c) => ({
    name: c.category,
    amount: Number(c.amount.toFixed(2)),
    percentage: Number(c.percentage.toFixed(1)),
  }));

  return (
    <div className="space-y-6">
      {/* 1. Daily Sales vs Expenses vs Net Profit Chart */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Daily Financial Trends: Sales vs Expenses vs Net Profit
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Visual date-by-date trajectory comparing cash intake against operating costs
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs font-semibold">
            <span className="flex items-center text-blue-600">
              <span className="w-3 h-3 rounded-xs bg-blue-500 mr-1 inline-block" /> Sales
            </span>
            <span className="flex items-center text-rose-600">
              <span className="w-3 h-3 rounded-xs bg-rose-400 mr-1 inline-block" /> Expenses
            </span>
            <span className="flex items-center text-emerald-600">
              <span className="w-3 h-1 bg-emerald-500 mr-1 inline-block" /> Net Profit Line
            </span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                label={{ value: 'Date (MM-DD)', position: 'insideBottom', offset: -15, fontSize: 11, fill: '#94a3b8' }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                formatter={(value: any, name: any) => [formatCurrency(Number(value)), name]}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return `Date: ${payload[0].payload.fullDate}`;
                  }
                  return label;
                }}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12px',
                  padding: '8px 12px',
                }}
              />
              <Bar dataKey="Sales" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Line
                type="monotone"
                dataKey="Profit"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: '#10b981', strokeWidth: 1, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Expense Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie/Donut Chart */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs lg:col-span-1">
          <div className="pb-3 mb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <PieIcon className="w-4 h-4 mr-1.5 text-amber-600" />
              Expense Category Share
            </h3>
            <p className="text-xs text-slate-500">Distribution of operational spending</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => formatCurrency(Number(val))}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Breakdown List */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs lg:col-span-2">
          <div className="pb-3 mb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Category Spending Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Sorted by highest cost contributors to cafe overhead
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-600">
              {categoryData.length} Categories
            </span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {categoryData.map((item, idx) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                    />
                    <span className="font-semibold text-slate-800">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-500">{item.percentage}%</span>
                    <span className="font-mono-num font-bold text-slate-900">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: PIE_COLORS[idx % PIE_COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

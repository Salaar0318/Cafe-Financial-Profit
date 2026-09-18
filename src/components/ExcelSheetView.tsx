import React, { useState } from 'react';
import { DailySummary, SaleRecord, ExpenseRecord } from '../types';
import { formatCurrency } from '../utils/calculations';
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Table,
  Calculator,
  ExternalLink,
  Layers,
} from 'lucide-react';

interface ExcelSheetViewProps {
  dailySummaries: DailySummary[];
  sales: SaleRecord[];
  expenses: ExpenseRecord[];
  cafeName: string;
  onExportExcel: () => void;
  onDownloadTemplate: () => void;
}

export const ExcelSheetView: React.FC<ExcelSheetViewProps> = ({
  dailySummaries,
  sales,
  expenses,
  cafeName,
  onExportExcel,
  onDownloadTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<'profit' | 'sales' | 'expenses' | 'overview'>('profit');
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: string; formula: string; value: string }>({
    row: 2,
    col: 'E',
    formula: '=C2-D2 (Net Profit = Total Sales − Total Expenses)',
    value: formatCurrency(dailySummaries[0]?.netProfit || 0),
  });

  return (
    <div className="space-y-6">
      {/* Banner explaining Excel export */}
      <div className="bg-linear-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
              Microsoft Excel (.xlsx) & Google Sheets Compatible
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Direct Excel Sheet Generator
            </h2>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              Your cafe database is compiled into a multi-tab Microsoft Excel workbook (.xlsx) with embedded formulas, automated sales-minus-expenses profit totals, formatted column widths, and KPI dashboards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              id="excel-banner-download-btn"
              onClick={onExportExcel}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl font-bold text-sm bg-white text-emerald-900 hover:bg-emerald-50 shadow-lg transition-transform active:scale-95"
            >
              <Download className="w-4 h-4 mr-2 text-emerald-700" />
              <span>Download Live Excel (.xlsx)</span>
            </button>
            <button
              id="excel-banner-template-btn"
              onClick={onDownloadTemplate}
              className="inline-flex items-center justify-center px-4 py-3 rounded-xl font-semibold text-sm bg-emerald-700/60 hover:bg-emerald-700 text-white border border-emerald-500/40 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              <span>Download Blank Template</span>
            </button>
          </div>
        </div>

        {/* Feature badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-emerald-700/50 text-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Multi-Sheet Workbook</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Formula-Driven Profit</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Auto-Calculated Totals</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% Offline Excel Compatible</span>
          </div>
        </div>
      </div>

      {/* Simulated Excel Workbook Window */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
        {/* Excel Title Bar */}
        <div className="bg-slate-800 text-slate-200 px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="font-semibold text-white ml-2">
              {cafeName.replace(/\s+/g, '_')}_Financial_Database.xlsx
            </span>
            <span className="text-slate-400 text-[11px]">— Excel Workbook Viewer</span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">Ready</span>
        </div>

        {/* Excel Formula Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center space-x-3 text-xs">
          <div className="font-mono font-bold text-slate-700 bg-white border border-slate-300 rounded px-2 py-0.5 w-14 text-center">
            {selectedCell.col}{selectedCell.row}
          </div>
          <div className="text-slate-400 font-mono font-bold">fx</div>
          <div className="flex-1 bg-white border border-slate-300 rounded px-3 py-1 font-mono text-slate-800 truncate">
            {selectedCell.formula}
          </div>
        </div>

        {/* Spreadsheet Sheet Grid */}
        <div className="overflow-x-auto max-h-96">
          {activeTab === 'profit' && (
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-slate-200 text-slate-600 border-b border-slate-300">
                  <th className="w-10 py-1.5 px-2 bg-slate-300/80 border-r border-slate-300 text-center font-sans font-semibold">#</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-left font-sans">A: Date</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-center font-sans">B: Orders</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-right font-sans">C: Total Sales ($)</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-right font-sans">D: Total Expenses ($)</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-right font-sans bg-emerald-50 text-emerald-900 font-bold">E: Net Profit ($)</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-right font-sans">F: Margin (%)</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-center font-sans">G: Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {dailySummaries.map((day, idx) => {
                  const rowNum = idx + 2;
                  const isCellSelected = selectedCell.row === rowNum && selectedCell.col === 'E';
                  return (
                    <tr key={day.date} className="hover:bg-blue-50/40">
                      <td className="py-1.5 px-2 bg-slate-100 text-slate-400 border-r border-slate-200 text-center select-none">
                        {rowNum}
                      </td>
                      <td className="py-1.5 px-3 border-r border-slate-200">{day.date}</td>
                      <td className="py-1.5 px-3 border-r border-slate-200 text-center">{day.orderCount}</td>
                      <td className="py-1.5 px-3 border-r border-slate-200 text-right">{day.totalSales.toFixed(2)}</td>
                      <td className="py-1.5 px-3 border-r border-slate-200 text-right">{day.totalExpenses.toFixed(2)}</td>
                      <td
                        onClick={() =>
                          setSelectedCell({
                            row: rowNum,
                            col: 'E',
                            formula: `=C${rowNum}-D${rowNum}`,
                            value: formatCurrency(day.netProfit),
                          })
                        }
                        className={`py-1.5 px-3 border-r border-slate-200 text-right font-bold cursor-pointer transition-colors ${
                          isCellSelected
                            ? 'ring-2 ring-emerald-600 bg-emerald-100/60'
                            : day.netProfit >= 0
                            ? 'text-emerald-700 bg-emerald-50/40'
                            : 'text-rose-700 bg-rose-50/40'
                        }`}
                        title="Click to inspect Excel formula"
                      >
                        {day.netProfit.toFixed(2)}
                      </td>
                      <td className="py-1.5 px-3 border-r border-slate-200 text-right">{day.profitMargin.toFixed(1)}%</td>
                      <td className="py-1.5 px-3 border-r border-slate-200 text-center uppercase font-bold text-[10px]">
                        {day.status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {activeTab === 'sales' && (
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-slate-200 text-slate-600 border-b border-slate-300 font-sans">
                  <th className="w-10 py-1.5 px-2 bg-slate-300/80 border-r border-slate-300 text-center">#</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-left">A: Date</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-left">B: Shift</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-center">C: Orders</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-right">D: Coffee ($)</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-right">E: Bakery ($)</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-right">F: Food ($)</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-right font-bold bg-blue-50">G: Total Sales ($)</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-left">H: Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sales.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-blue-50/40">
                    <td className="py-1.5 px-2 bg-slate-100 text-slate-400 border-r border-slate-200 text-center">
                      {idx + 2}
                    </td>
                    <td className="py-1.5 px-3 border-r border-slate-200">{s.date}</td>
                    <td className="py-1.5 px-3 border-r border-slate-200">{s.shift}</td>
                    <td className="py-1.5 px-3 border-r border-slate-200 text-center">{s.orderCount}</td>
                    <td className="py-1.5 px-3 border-r border-slate-200 text-right">{s.coffeeRevenue.toFixed(2)}</td>
                    <td className="py-1.5 px-3 border-r border-slate-200 text-right">{s.bakeryRevenue.toFixed(2)}</td>
                    <td className="py-1.5 px-3 border-r border-slate-200 text-right">{s.foodRevenue.toFixed(2)}</td>
                    <td className="py-1.5 px-3 border-r border-slate-200 text-right font-bold text-blue-700 bg-blue-50/40">
                      {s.totalSales.toFixed(2)}
                    </td>
                    <td className="py-1.5 px-3 border-r border-slate-200 text-slate-500 font-sans truncate max-w-xs">
                      {s.notes || ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'expenses' && (
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-slate-200 text-slate-600 border-b border-slate-300 font-sans">
                  <th className="w-10 py-1.5 px-2 bg-slate-300/80 border-r border-slate-300 text-center">#</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-left">A: Date</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-left">B: Category</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-left">C: Expense Item</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-left">D: Vendor</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-right font-bold text-rose-700">E: Amount ($)</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-center">F: Payment</th>
                  <th className="py-1.5 px-3 border-r border-slate-300 text-left">G: Receipt #</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {expenses.map((e, idx) => (
                  <tr key={e.id} className="hover:bg-rose-50/30">
                    <td className="py-1.5 px-2 bg-slate-100 text-slate-400 border-r border-slate-200 text-center">
                      {idx + 2}
                    </td>
                    <td className="py-1.5 px-3 border-r border-slate-200">{e.date}</td>
                    <td className="py-1.5 px-3 border-r border-slate-200 font-sans">{e.category}</td>
                    <td className="py-1.5 px-3 border-r border-slate-200 font-sans">{e.itemName}</td>
                    <td className="py-1.5 px-3 border-r border-slate-200 font-sans">{e.vendor}</td>
                    <td className="py-1.5 px-3 border-r border-slate-200 text-right font-bold text-rose-600">
                      {e.amount.toFixed(2)}
                    </td>
                    <td className="py-1.5 px-3 border-r border-slate-200 text-center font-sans">{e.paymentMethod}</td>
                    <td className="py-1.5 px-3 border-r border-slate-200">{e.receiptNo || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Excel Bottom Sheet Tabs Bar (Authentic Excel style!) */}
        <div className="bg-slate-100 border-t border-slate-300 px-2 py-1.5 flex items-center space-x-1 text-xs">
          <span className="text-slate-400 text-xs px-2 select-none font-semibold">Sheets:</span>

          <button
            id="excel-tab-profit"
            onClick={() => setActiveTab('profit')}
            className={`px-3 py-1 rounded-t font-semibold transition-all border-t-2 ${
              activeTab === 'profit'
                ? 'bg-white text-emerald-800 border-emerald-600 shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/80 border-transparent'
            }`}
          >
            📊 Daily Profit Summary
          </button>

          <button
            id="excel-tab-sales"
            onClick={() => setActiveTab('sales')}
            className={`px-3 py-1 rounded-t font-semibold transition-all border-t-2 ${
              activeTab === 'sales'
                ? 'bg-white text-blue-800 border-blue-600 shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/80 border-transparent'
            }`}
          >
            ☕ Sales Ledger
          </button>

          <button
            id="excel-tab-expenses"
            onClick={() => setActiveTab('expenses')}
            className={`px-3 py-1 rounded-t font-semibold transition-all border-t-2 ${
              activeTab === 'expenses'
                ? 'bg-white text-rose-800 border-rose-600 shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/80 border-transparent'
            }`}
          >
            🧾 Expenses Ledger
          </button>

          <div className="flex-1" />

          <button
            id="excel-download-from-tabs-btn"
            onClick={onExportExcel}
            className="inline-flex items-center px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            <span>Export (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Excel Formula Guide */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
          <Calculator className="w-4 h-4 mr-2 text-amber-600" />
          Cafe Calculation Formulas Embedded in the Excel Sheet
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">1. Daily Net Profit</span>
            <code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono font-bold block mb-1">
              = Total Sales − Total Expenses
            </code>
            <p className="text-slate-500">
              Subtracts raw ingredients, dairy, whole beans, staff pay and operating costs from gross till sales.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">2. Profit Margin Percentage</span>
            <code className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-mono font-bold block mb-1">
              = (Net Profit ÷ Total Sales) × 100
            </code>
            <p className="text-slate-500">
              Shows how much percentage of every coffee and pastry dollar is kept as net earnings.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">3. Monthly / Period Totals</span>
            <code className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono font-bold block mb-1">
              = SUM(Range Start : Range End)
            </code>
            <p className="text-slate-500">
              Calculates cumulative revenue, aggregated overhead, and period net profit at the bottom of each sheet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

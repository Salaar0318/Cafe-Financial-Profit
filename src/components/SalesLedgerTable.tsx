import React, { useState, useMemo } from 'react';
import { SaleRecord } from '../types';
import { formatCurrency, formatDateDisplay } from '../utils/calculations';
import { PlusCircle, Search, Trash2, Calendar, Coffee, DollarSign } from 'lucide-react';

interface SalesLedgerTableProps {
  sales: SaleRecord[];
  onOpenSaleModal: () => void;
  onDeleteSale: (id: string) => void;
}

export const SalesLedgerTable: React.FC<SalesLedgerTableProps> = ({
  sales,
  onOpenSaleModal,
  onDeleteSale,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [shiftFilter, setShiftFilter] = useState<string>('all');

  const filteredSales = useMemo(() => {
    return sales
      .filter((s) => {
        const matchesSearch =
          s.date.includes(searchTerm) ||
          (s.notes && s.notes.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesShift = shiftFilter === 'all' || s.shift === shiftFilter;
        return matchesSearch && matchesShift;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [sales, searchTerm, shiftFilter]);

  const totalSalesSum = filteredSales.reduce((acc, s) => acc + s.totalSales, 0);
  const totalOrdersSum = filteredSales.reduce((acc, s) => acc + s.orderCount, 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-slate-900">
              Cafe Sales Ledger (Date-by-Date)
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              {filteredSales.length} Entries
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily coffee, bakery, food revenues and customer order volumes
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              id="search-sales-input"
              type="text"
              placeholder="Search date or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />
          </div>

          <select
            id="filter-sales-shift"
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          >
            <option value="all">All Shifts</option>
            <option value="All Day">All Day</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
          </select>

          <button
            id="add-new-sale-btn"
            onClick={onOpenSaleModal}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1" />
            <span>+ Record Daily Sale</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Shift</th>
              <th className="py-3 px-4 text-center">Orders</th>
              <th className="py-3 px-4 text-right">Coffee & Drinks</th>
              <th className="py-3 px-4 text-right">Bakery</th>
              <th className="py-3 px-4 text-right">Food</th>
              <th className="py-3 px-4 text-right">Total Sales ($)</th>
              <th className="py-3 px-4">Payment Breakdown</th>
              <th className="py-3 px-4">Notes</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 bg-white">
            {filteredSales.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-500">
                  <Coffee className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-700">No sales recorded yet</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Click '+ Record Daily Sale' to log revenue for any date.
                  </p>
                </td>
              </tr>
            ) : (
              filteredSales.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-bold font-mono-num text-slate-900 block">{s.date}</span>
                    <span className="text-[11px] text-slate-400">{formatDateDisplay(s.date)}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {s.shift}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap font-mono-num font-semibold text-slate-700">
                    {s.orderCount}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono-num text-slate-700">
                    {formatCurrency(s.coffeeRevenue)}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono-num text-slate-700">
                    {formatCurrency(s.bakeryRevenue)}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono-num text-slate-700">
                    {formatCurrency(s.foodRevenue)}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono-num font-bold text-blue-700 text-base">
                    {formatCurrency(s.totalSales)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-600">
                    <div className="flex items-center space-x-2">
                      <span title="Cash">💵 {formatCurrency(s.paymentBreakdown.cash)}</span>
                      <span title="Card">💳 {formatCurrency(s.paymentBreakdown.card)}</span>
                      {s.paymentBreakdown.online > 0 && (
                        <span title="Online">📱 {formatCurrency(s.paymentBreakdown.online)}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500 max-w-xs truncate">
                    {s.notes || '—'}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      id={`delete-sale-${s.id}`}
                      onClick={() => {
                        if (confirm(`Delete sale entry for ${s.date} ($${s.totalSales})?`)) {
                          onDeleteSale(s.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Delete sale"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {filteredSales.length > 0 && (
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                <td className="py-3 px-4 text-xs uppercase tracking-wider">TOTALS</td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4 text-center font-mono-num">
                  {totalOrdersSum.toLocaleString()}
                </td>
                <td colSpan={3} className="py-3 px-4 text-right text-xs text-slate-500">
                  Total Gross Sales:
                </td>
                <td className="py-3 px-4 text-right font-mono-num text-blue-700 text-base">
                  {formatCurrency(totalSalesSum)}
                </td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { ExpenseRecord, ExpenseCategory } from '../types';
import { formatCurrency, formatDateDisplay } from '../utils/calculations';
import { PlusCircle, Search, Trash2, Receipt, Tag } from 'lucide-react';

interface ExpenseLedgerTableProps {
  expenses: ExpenseRecord[];
  onOpenExpenseModal: () => void;
  onDeleteExpense: (id: string) => void;
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  'Coffee Beans & Roasts': 'bg-amber-100 text-amber-900 border-amber-200',
  'Milk & Dairy': 'bg-blue-100 text-blue-900 border-blue-200',
  'Bakery & Pastries': 'bg-orange-100 text-orange-900 border-orange-200',
  'Syrups & Perishables': 'bg-purple-100 text-purple-900 border-purple-200',
  'Cups & Disposables': 'bg-teal-100 text-teal-900 border-teal-200',
  'Staff Wages': 'bg-emerald-100 text-emerald-900 border-emerald-200',
  'Utilities & Ice': 'bg-cyan-100 text-cyan-900 border-cyan-200',
  'Rent & Facilities': 'bg-indigo-100 text-indigo-900 border-indigo-200',
  'Equipment & Repairs': 'bg-rose-100 text-rose-900 border-rose-200',
  'Cleaning Supplies': 'bg-sky-100 text-sky-900 border-sky-200',
  'Marketing & POS': 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-200',
  'Miscellaneous': 'bg-slate-100 text-slate-900 border-slate-200',
};

export const ExpenseLedgerTable: React.FC<ExpenseLedgerTableProps> = ({
  expenses,
  onOpenExpenseModal,
  onDeleteExpense,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((e) => {
        const matchesSearch =
          e.date.includes(searchTerm) ||
          e.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (e.receiptNo && e.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCat = selectedCategory === 'all' || e.category === selectedCategory;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [expenses, searchTerm, selectedCategory]);

  const totalExpenseSum = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-slate-900">
              Daily Expenses & COGS Ledger
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
              {filteredExpenses.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Itemized daily expenses for coffee beans, dairy, staff, bakery and cafe supplies
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              id="search-expenses-input"
              type="text"
              placeholder="Search item, vendor, date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 w-48 sm:w-56"
            />
          </div>

          {/* Category Dropdown */}
          <select
            id="filter-expense-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-700"
          >
            <option value="all">All Categories</option>
            <option value="Coffee Beans & Roasts">Coffee Beans & Roasts</option>
            <option value="Milk & Dairy">Milk & Dairy</option>
            <option value="Bakery & Pastries">Bakery & Pastries</option>
            <option value="Syrups & Perishables">Syrups & Perishables</option>
            <option value="Cups & Disposables">Cups & Disposables</option>
            <option value="Staff Wages">Staff Wages</option>
            <option value="Utilities & Ice">Utilities & Ice</option>
            <option value="Rent & Facilities">Rent & Facilities</option>
            <option value="Equipment & Repairs">Equipment & Repairs</option>
            <option value="Cleaning Supplies">Cleaning Supplies</option>
            <option value="Marketing & POS">Marketing & POS</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>

          {/* Add Expense Button */}
          <button
            id="add-new-expense-btn"
            onClick={onOpenExpenseModal}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1" />
            <span>+ Add Daily Expense</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Expense Item / Description</th>
              <th className="py-3 px-4">Supplier / Vendor</th>
              <th className="py-3 px-4 text-right">Amount ($)</th>
              <th className="py-3 px-4 text-center">Payment</th>
              <th className="py-3 px-4">Receipt / Ref</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 bg-white">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <Receipt className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-700">No expenses found</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Click '+ Add Daily Expense' to log an operational or ingredient cost.
                  </p>
                </td>
              </tr>
            ) : (
              filteredExpenses.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-bold font-mono-num text-slate-900 block">{e.date}</span>
                    <span className="text-[11px] text-slate-400">{formatDateDisplay(e.date)}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        CATEGORY_COLORS[e.category] || 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {e.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-medium max-w-xs">
                    <div className="truncate font-semibold">{e.itemName}</div>
                    {e.notes && (
                      <div className="text-xs text-slate-400 truncate italic">
                        {e.notes}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-xs whitespace-nowrap">
                    {e.vendor}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono-num font-bold text-rose-600 text-base">
                    {formatCurrency(e.amount)}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {e.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs font-mono-num text-slate-500 whitespace-nowrap">
                    {e.receiptNo || '—'}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      id={`delete-expense-${e.id}`}
                      onClick={() => {
                        if (confirm(`Delete expense "${e.itemName}" ($${e.amount})?`)) {
                          onDeleteExpense(e.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Delete expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {filteredExpenses.length > 0 && (
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                <td className="py-3 px-4 text-xs uppercase tracking-wider">TOTAL EXPENSES</td>
                <td colSpan={3} className="py-3 px-4 text-right text-xs text-slate-500">
                  Total Tracked Costs:
                </td>
                <td className="py-3 px-4 text-right font-mono-num text-rose-600 text-base">
                  {formatCurrency(totalExpenseSum)}
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

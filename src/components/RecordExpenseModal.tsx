import React, { useState } from 'react';
import { ExpenseRecord, ExpenseCategory } from '../types';
import { X, Receipt, Tag, DollarSign, Building } from 'lucide-react';

interface RecordExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (expense: ExpenseRecord) => void;
  initialDate?: string;
}

const QUICK_PRESETS = [
  { category: 'Milk & Dairy', item: 'Whole Milk & Oat Milk Restock', vendor: 'Valley Dairy Fresh', amount: '115' },
  { category: 'Coffee Beans & Roasts', item: 'Artisan Espresso Beans (15kg)', vendor: 'Artisan Roasters Co.', amount: '280' },
  { category: 'Bakery & Pastries', item: 'Fresh Artisan Croissants & Pastries', vendor: 'Golden Crust Artisan Bakery', amount: '95' },
  { category: 'Staff Wages', item: 'Barista Daily Shift Pay', vendor: 'Cafe Staff Payroll', amount: '190' },
  { category: 'Cups & Disposables', item: 'Biodegradable Cups & Lids (1,000 sets)', vendor: 'EcoPack Solutions', amount: '185' },
  { category: 'Cleaning Supplies', item: 'Espresso Detergent & Sanitizer', vendor: 'Barista Supply Depot', amount: '40' },
];

export const RecordExpenseModal: React.FC<RecordExpenseModalProps> = ({
  isOpen,
  onClose,
  onSaveExpense,
  initialDate,
}) => {
  const todayStr = initialDate || new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(todayStr);
  const [category, setCategory] = useState<ExpenseCategory>('Milk & Dairy');
  const [itemName, setItemName] = useState('');
  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'Bank Transfer' | 'Petty Cash'>('Card');
  const [receiptNo, setReceiptNo] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const applyPreset = (preset: (typeof QUICK_PRESETS)[0]) => {
    setCategory(preset.category as ExpenseCategory);
    setItemName(preset.item);
    setVendor(preset.vendor);
    setAmount(preset.amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!date || isNaN(numAmount) || numAmount <= 0) return;

    const newExpense: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      date,
      category,
      itemName: itemName.trim() || `${category} purchase`,
      vendor: vendor.trim() || 'General Supplier',
      amount: numAmount,
      paymentMethod,
      receiptNo: receiptNo.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onSaveExpense(newExpense);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add Daily Cafe Expense</h3>
              <p className="text-xs text-slate-500">Record COGS, ingredients, staff wages, or supplies</p>
            </div>
          </div>
          <button
            id="close-expense-modal-btn"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quick presets */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
              Quick Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 rounded-md transition-colors text-slate-700"
                >
                  {p.item.split(' ')[0]} {p.item.split(' ')[1]} (${p.amount})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expense Date *
              </label>
              <input
                id="expense-date-input"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expense Category *
              </label>
              <select
                id="expense-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              >
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
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Expense Item / Description *
            </label>
            <input
              id="expense-item-input"
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. 15kg Espresso Roast / Whole Milk & Oat Milk Cases"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Vendor / Supplier */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supplier / Vendor
              </label>
              <input
                id="expense-vendor-input"
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                placeholder="e.g. Valley Dairy Fresh"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Amount ($) *
              </label>
              <input
                id="expense-amount-input"
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 text-xs font-mono font-bold text-rose-600 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Payment Method */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Method
              </label>
              <select
                id="expense-payment-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="Card">Card</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Petty Cash">Petty Cash</option>
              </select>
            </div>

            {/* Receipt Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Receipt / Invoice #
              </label>
              <input
                id="expense-receipt-input"
                type="text"
                value={receiptNo}
                onChange={(e) => setReceiptNo(e.target.value)}
                placeholder="e.g. RCP-1049"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes (Optional)
            </label>
            <input
              id="expense-notes-input"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra milk for weekend farmers market"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              id="submit-expense-btn"
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
            >
              Save Daily Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

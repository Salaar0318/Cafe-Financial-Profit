import React, { useState } from 'react';
import { SaleRecord, ShiftType } from '../types';
import { formatCurrency } from '../utils/calculations';
import { X, DollarSign, Coffee, Calendar, ShoppingBag } from 'lucide-react';

interface RecordSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSale: (sale: SaleRecord) => void;
  initialDate?: string;
}

export const RecordSaleModal: React.FC<RecordSaleModalProps> = ({
  isOpen,
  onClose,
  onSaveSale,
  initialDate,
}) => {
  const todayStr = initialDate || new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(todayStr);
  const [shift, setShift] = useState<ShiftType>('All Day');
  const [orderCount, setOrderCount] = useState('140');
  const [coffeeRevenue, setCoffeeRevenue] = useState('550');
  const [bakeryRevenue, setBakeryRevenue] = useState('200');
  const [foodRevenue, setFoodRevenue] = useState('120');
  const [otherRevenue, setOtherRevenue] = useState('30');
  const [cash, setCash] = useState('220');
  const [card, setCard] = useState('600');
  const [online, setOnline] = useState('80');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const coffeeNum = parseFloat(coffeeRevenue) || 0;
  const bakeryNum = parseFloat(bakeryRevenue) || 0;
  const foodNum = parseFloat(foodRevenue) || 0;
  const otherNum = parseFloat(otherRevenue) || 0;
  const calculatedTotal = coffeeNum + bakeryNum + foodNum + otherNum;

  const handleAutoFillPayments = () => {
    // Distribute 65% card, 25% cash, 10% online
    const cardPart = Math.round(calculatedTotal * 0.65 * 100) / 100;
    const cashPart = Math.round(calculatedTotal * 0.25 * 100) / 100;
    const onlinePart = Math.round((calculatedTotal - cardPart - cashPart) * 100) / 100;
    setCard(String(cardPart));
    setCash(String(cashPart));
    setOnline(String(onlinePart));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    const newSale: SaleRecord = {
      id: `sale-${Date.now()}`,
      date,
      shift,
      orderCount: parseInt(orderCount, 10) || 0,
      coffeeRevenue: coffeeNum,
      bakeryRevenue: bakeryNum,
      foodRevenue: foodNum,
      otherRevenue: otherNum,
      totalSales: calculatedTotal,
      paymentBreakdown: {
        cash: parseFloat(cash) || 0,
        card: parseFloat(card) || 0,
        online: parseFloat(online) || 0,
      },
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    onSaveSale(newSale);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Record Daily Cafe Sale</h3>
              <p className="text-xs text-slate-500">Log customer orders and category revenue</p>
            </div>
          </div>
          <button
            id="close-sale-modal-btn"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sale Date *
              </label>
              <input
                id="sale-date-input"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Shift */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shift
              </label>
              <select
                id="sale-shift-select"
                value={shift}
                onChange={(e) => setShift(e.target.value as ShiftType)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Day">All Day</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>

            {/* Order Count */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Orders Count
              </label>
              <input
                id="sale-orders-input"
                type="number"
                min="0"
                value={orderCount}
                onChange={(e) => setOrderCount(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 145"
              />
            </div>
          </div>

          {/* Revenue Categories */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Revenue Breakdown by Product
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Coffee & Beverages ($)
                </label>
                <input
                  id="sale-coffee-input"
                  type="number"
                  step="0.01"
                  min="0"
                  value={coffeeRevenue}
                  onChange={(e) => setCoffeeRevenue(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-mono"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Pastries & Bakery ($)
                </label>
                <input
                  id="sale-bakery-input"
                  type="number"
                  step="0.01"
                  min="0"
                  value={bakeryRevenue}
                  onChange={(e) => setBakeryRevenue(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-mono"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Food & Breakfast ($)
                </label>
                <input
                  id="sale-food-input"
                  type="number"
                  step="0.01"
                  min="0"
                  value={foodRevenue}
                  onChange={(e) => setFoodRevenue(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-mono"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Merch & Retail Beans ($)
                </label>
                <input
                  id="sale-other-input"
                  type="number"
                  step="0.01"
                  min="0"
                  value={otherRevenue}
                  onChange={(e) => setOtherRevenue(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-mono"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Total Highlight */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Calculated Total Daily Sales:</span>
              <span className="text-base font-black font-mono text-blue-700">
                {formatCurrency(calculatedTotal)}
              </span>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Payment Tender</span>
              <button
                type="button"
                onClick={handleAutoFillPayments}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
              >
                Auto-Split Payments
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Cash ($)</label>
                <input
                  id="sale-cash-input"
                  type="number"
                  step="0.01"
                  min="0"
                  value={cash}
                  onChange={(e) => setCash(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Credit/Debit Card ($)</label>
                <input
                  id="sale-card-input"
                  type="number"
                  step="0.01"
                  min="0"
                  value={card}
                  onChange={(e) => setCard(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Online/App ($)</label>
                <input
                  id="sale-online-input"
                  type="number"
                  step="0.01"
                  min="0"
                  value={online}
                  onChange={(e) => setOnline(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md font-mono"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes (Optional)
            </label>
            <input
              id="sale-notes-input"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Rainy morning, special guest roast featured"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              id="submit-sale-btn"
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
            >
              Save Sale Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

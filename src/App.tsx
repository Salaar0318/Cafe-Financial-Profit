import React, { useState, useEffect, useMemo } from 'react';
import { SaleRecord, ExpenseRecord } from './types';
import {
  loadSalesFromStorage,
  saveSalesToStorage,
  loadExpensesFromStorage,
  saveExpensesToStorage,
  loadCafeName,
  saveCafeName,
  resetToDefaultData,
} from './utils/storage';
import { computeDailySummaries, computeOverviewStats } from './utils/calculations';
import { exportCafeDatabaseToExcel, downloadBlankCafeExcelTemplate } from './utils/excelGenerator';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { DailyProfitTable } from './components/DailyProfitTable';
import { SalesLedgerTable } from './components/SalesLedgerTable';
import { ExpenseLedgerTable } from './components/ExpenseLedgerTable';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { ExcelSheetView } from './components/ExcelSheetView';
import { RecordSaleModal } from './components/RecordSaleModal';
import { RecordExpenseModal } from './components/RecordExpenseModal';
import { ImportExcelModal } from './components/ImportExcelModal';
import {
  CalendarDays,
  Coffee,
  Receipt,
  LineChart,
  FileSpreadsheet,
  CheckCircle,
} from 'lucide-react';

export default function App() {
  const [sales, setSales] = useState<SaleRecord[]>(() => loadSalesFromStorage());
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => loadExpensesFromStorage());
  const [cafeName, setCafeName] = useState<string>(() => loadCafeName());

  const [activeView, setActiveView] = useState<'profit' | 'sales' | 'expenses' | 'analytics' | 'excel'>('profit');

  // Modal states
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [modalInitialDate, setModalInitialDate] = useState<string | undefined>(undefined);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync to storage
  useEffect(() => {
    saveSalesToStorage(sales);
  }, [sales]);

  useEffect(() => {
    saveExpensesToStorage(expenses);
  }, [expenses]);

  const handleUpdateCafeName = (name: string) => {
    setCafeName(name);
    saveCafeName(name);
    showToast(`Cafe name updated to "${name}"`);
  };

  // Calculations
  const dailySummaries = useMemo(() => {
    return computeDailySummaries(sales, expenses);
  }, [sales, expenses]);

  const overviewStats = useMemo(() => {
    return computeOverviewStats(dailySummaries);
  }, [dailySummaries]);

  // Handlers
  const handleSaveSale = (newSale: SaleRecord) => {
    setSales((prev) => [newSale, ...prev.filter((s) => s.id !== newSale.id)]);
    showToast(`Recorded sale for ${newSale.date} ($${newSale.totalSales.toFixed(2)})`);
  };

  const handleDeleteSale = (id: string) => {
    setSales((prev) => prev.filter((s) => s.id !== id));
    showToast('Sale record deleted');
  };

  const handleSaveExpense = (newExpense: ExpenseRecord) => {
    setExpenses((prev) => [newExpense, ...prev.filter((e) => e.id !== newExpense.id)]);
    showToast(`Added expense "${newExpense.itemName}" ($${newExpense.amount.toFixed(2)})`);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast('Expense record deleted');
  };

  const handleExportExcel = () => {
    try {
      exportCafeDatabaseToExcel(sales, expenses, dailySummaries, cafeName);
      showToast('Excel workbook (.xlsx) downloaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to generate Excel file');
    }
  };

  const handleDownloadTemplate = () => {
    try {
      downloadBlankCafeExcelTemplate();
      showToast('Blank Excel template downloaded!');
    } catch (err) {
      console.error(err);
      alert('Failed to download template');
    }
  };

  const handleImportData = (
    newSales: SaleRecord[],
    newExpenses: ExpenseRecord[],
    mode: 'merge' | 'replace'
  ) => {
    if (mode === 'replace') {
      setSales(newSales);
      setExpenses(newExpenses);
    } else {
      setSales((prev) => [...newSales, ...prev]);
      setExpenses((prev) => [...newExpenses, ...prev]);
    }
    showToast(`Successfully imported ${newSales.length} sales and ${newExpenses.length} expenses from Excel!`);
  };

  const handleResetData = () => {
    if (confirm('Reset database to sample 18-day cafe sales & expenses?')) {
      const reset = resetToDefaultData();
      setSales(reset.sales);
      setExpenses(reset.expenses);
      showToast('Reset database to default cafe records');
    }
  };

  const openSaleModalForDate = (date: string) => {
    setModalInitialDate(date);
    setIsSaleModalOpen(true);
  };

  const openExpenseModalForDate = (date: string) => {
    setModalInitialDate(date);
    setIsExpenseModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        cafeName={cafeName}
        onUpdateCafeName={handleUpdateCafeName}
        onExportExcel={handleExportExcel}
        onDownloadTemplate={handleDownloadTemplate}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenSaleModal={() => {
          setModalInitialDate(undefined);
          setIsSaleModalOpen(true);
        }}
        onOpenExpenseModal={() => {
          setModalInitialDate(undefined);
          setIsExpenseModalOpen(true);
        }}
        onResetData={handleResetData}
        daysCount={dailySummaries.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI Financial Overview Cards */}
        <StatsCards stats={overviewStats} daysCount={dailySummaries.length} />

        {/* View Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 mb-6 gap-3">
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-200/70 p-1 rounded-xl text-xs font-semibold">
            {/* Tab 1: Date-by-Date Profit Table */}
            <button
              id="nav-tab-profit"
              onClick={() => setActiveView('profit')}
              className={`flex items-center px-3.5 py-2 rounded-lg transition-all ${
                activeView === 'profit'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-4 h-4 mr-1.5 text-emerald-600" />
              <span>Daily Profit (P&L)</span>
            </button>

            {/* Tab 2: Sales Ledger */}
            <button
              id="nav-tab-sales"
              onClick={() => setActiveView('sales')}
              className={`flex items-center px-3.5 py-2 rounded-lg transition-all ${
                activeView === 'sales'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Coffee className="w-4 h-4 mr-1.5 text-blue-600" />
              <span>Sales Ledger</span>
              <span className="ml-1.5 px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-full text-[10px]">
                {sales.length}
              </span>
            </button>

            {/* Tab 3: Expenses Ledger */}
            <button
              id="nav-tab-expenses"
              onClick={() => setActiveView('expenses')}
              className={`flex items-center px-3.5 py-2 rounded-lg transition-all ${
                activeView === 'expenses'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Receipt className="w-4 h-4 mr-1.5 text-rose-600" />
              <span>Daily Expenses</span>
              <span className="ml-1.5 px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded-full text-[10px]">
                {expenses.length}
              </span>
            </button>

            {/* Tab 4: Analytics */}
            <button
              id="nav-tab-analytics"
              onClick={() => setActiveView('analytics')}
              className={`flex items-center px-3.5 py-2 rounded-lg transition-all ${
                activeView === 'analytics'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LineChart className="w-4 h-4 mr-1.5 text-amber-600" />
              <span>Analytics & Trends</span>
            </button>

            {/* Tab 5: Excel Sheet Simulator */}
            <button
              id="nav-tab-excel"
              onClick={() => setActiveView('excel')}
              className={`flex items-center px-3.5 py-2 rounded-lg transition-all ${
                activeView === 'excel'
                  ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-emerald-500/30'
                  : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-600" />
              <span>Excel View (.xlsx)</span>
            </button>
          </nav>

          {/* Context indicator */}
          <div className="hidden lg:flex items-center text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            Auto-Persisted Database
          </div>
        </div>

        {/* View Contents */}
        {activeView === 'profit' && (
          <DailyProfitTable
            dailySummaries={dailySummaries}
            sales={sales}
            expenses={expenses}
            onOpenSaleModalForDate={openSaleModalForDate}
            onOpenExpenseModalForDate={openExpenseModalForDate}
            onExportExcel={handleExportExcel}
          />
        )}

        {activeView === 'sales' && (
          <SalesLedgerTable
            sales={sales}
            onOpenSaleModal={() => {
              setModalInitialDate(undefined);
              setIsSaleModalOpen(true);
            }}
            onDeleteSale={handleDeleteSale}
          />
        )}

        {activeView === 'expenses' && (
          <ExpenseLedgerTable
            expenses={expenses}
            onOpenExpenseModal={() => {
              setModalInitialDate(undefined);
              setIsExpenseModalOpen(true);
            }}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {activeView === 'analytics' && (
          <AnalyticsCharts dailySummaries={dailySummaries} expenses={expenses} />
        )}

        {activeView === 'excel' && (
          <ExcelSheetView
            dailySummaries={dailySummaries}
            sales={sales}
            expenses={expenses}
            cafeName={cafeName}
            onExportExcel={handleExportExcel}
            onDownloadTemplate={handleDownloadTemplate}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{cafeName} Financial & Profit Database</span>
          <span>Formula: Daily Net Profit = Daily Sales − Daily Expenses</span>
        </div>
      </footer>

      {/* Modals */}
      <RecordSaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        onSaveSale={handleSaveSale}
        initialDate={modalInitialDate}
      />

      <RecordExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSaveExpense={handleSaveExpense}
        initialDate={modalInitialDate}
      />

      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportData={handleImportData}
      />
    </div>
  );
}

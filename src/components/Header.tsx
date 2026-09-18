import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Upload,
  PlusCircle,
  Receipt,
  RotateCcw,
  Edit2,
  Check,
  Coffee,
} from 'lucide-react';

interface HeaderProps {
  cafeName: string;
  onUpdateCafeName: (name: string) => void;
  onExportExcel: () => void;
  onDownloadTemplate: () => void;
  onOpenImportModal: () => void;
  onOpenSaleModal: () => void;
  onOpenExpenseModal: () => void;
  onResetData: () => void;
  daysCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  cafeName,
  onUpdateCafeName,
  onExportExcel,
  onDownloadTemplate,
  onOpenImportModal,
  onOpenSaleModal,
  onOpenExpenseModal,
  onResetData,
  daysCount,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(cafeName);

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateCafeName(tempName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Cafe Identity & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-600/10 border border-amber-600/20 flex items-center justify-center text-amber-700 shrink-0">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                {isEditingName ? (
                  <div className="flex items-center space-x-1">
                    <input
                      id="cafe-name-input"
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="text-lg font-bold text-slate-900 border border-amber-400 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName();
                        if (e.key === 'Escape') setIsEditingName(false);
                      }}
                    />
                    <button
                      id="save-cafe-name-btn"
                      onClick={handleSaveName}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                      title="Save name"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 group">
                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      {cafeName}
                    </h1>
                    <button
                      id="edit-cafe-name-btn"
                      onClick={() => {
                        setTempName(cafeName);
                        setIsEditingName(true);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                      title="Rename cafe"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  {daysCount} Days Logged
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily Sales, Expense Tracking & Profit Calculation Database
              </p>
            </div>
          </div>

          {/* Quick Actions / Excel Operations */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Download/Export to Excel Button */}
            <button
              id="export-excel-btn"
              onClick={onExportExcel}
              className="inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              title="Download entire cafe database as an Excel (.xlsx) file with multi-sheets and formulas"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              <span>Export to Excel (.xlsx)</span>
            </button>

            {/* Blank Excel Template */}
            <button
              id="download-template-btn"
              onClick={onDownloadTemplate}
              className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              title="Download empty Excel template for offline entry"
            >
              <Download className="w-4 h-4 mr-1.5 text-slate-500" />
              <span className="hidden md:inline">Excel Template</span>
            </button>

            {/* Import Excel */}
            <button
              id="import-excel-btn"
              onClick={onOpenImportModal}
              className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              title="Import sales or expenses from an Excel (.xlsx) or CSV spreadsheet"
            >
              <Upload className="w-4 h-4 mr-1.5 text-slate-500" />
              <span>Import</span>
            </button>

            {/* Add Sale Button */}
            <button
              id="add-sale-btn"
              onClick={onOpenSaleModal}
              className="inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              <span>Record Sale</span>
            </button>

            {/* Add Expense Button */}
            <button
              id="add-expense-btn"
              onClick={onOpenExpenseModal}
              className="inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-colors"
            >
              <Receipt className="w-4 h-4 mr-1.5" />
              <span>Add Expense</span>
            </button>

            {/* Reset / Sample Data */}
            <button
              id="reset-data-btn"
              onClick={onResetData}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Reset to sample demo data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

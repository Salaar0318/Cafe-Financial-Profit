import React, { useState, useRef } from 'react';
import { parseUploadedExcel } from '../utils/excelGenerator';
import { SaleRecord, ExpenseRecord } from '../types';
import { X, Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportData: (newSales: SaleRecord[], newExpenses: ExpenseRecord[], mode: 'merge' | 'replace') => void;
}

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({
  isOpen,
  onClose,
  onImportData,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedResult, setParsedResult] = useState<{
    sales: SaleRecord[];
    expenses: ExpenseRecord[];
    fileName: string;
    message: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      setErrorMsg('Please upload a valid Excel spreadsheet (.xlsx, .xls) or CSV file.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { importedSales, importedExpenses, message } = await parseUploadedExcel(file);
      if (importedSales.length === 0 && importedExpenses.length === 0) {
        setErrorMsg('No recognizable sales or expense rows found in this file. You can download our Excel Template for the standard format.');
      } else {
        setParsedResult({
          sales: importedSales,
          expenses: importedExpenses,
          fileName: file.name,
          message,
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`Failed to parse Excel file: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (parsedResult) {
      onImportData(parsedResult.sales, parsedResult.expenses, importMode);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Import Excel Spreadsheet</h3>
              <p className="text-xs text-slate-500">Upload .xlsx or .csv cafe calculations</p>
            </div>
          </div>
          <button
            id="close-import-modal-btn"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!parsedResult ? (
            <div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFile(e.target.files[0]);
                  }}
                />
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  Click to select or drag & drop Excel workbook
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports .xlsx, .xls and .csv formats
                </p>
              </div>

              {isLoading && (
                <div className="mt-4 text-center text-xs font-semibold text-slate-600 animate-pulse">
                  Reading Excel sheets and calculating totals...
                </div>
              )}

              {errorMsg && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>File Parsed Successfully!</span>
                </div>
                <p className="text-xs text-emerald-700 font-mono">{parsedResult.fileName}</p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-200 text-xs">
                  <div className="bg-white p-2 rounded border border-emerald-100">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Sales Found</span>
                    <span className="font-bold text-base text-blue-700 font-mono">
                      {parsedResult.sales.length} records
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded border border-emerald-100">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Expenses Found</span>
                    <span className="font-bold text-base text-rose-700 font-mono">
                      {parsedResult.expenses.length} records
                    </span>
                  </div>
                </div>
              </div>

              {/* Import Mode */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Import Action:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setImportMode('merge')}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      importMode === 'merge'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/30'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-bold text-slate-800 block">Append / Merge</span>
                    <span className="text-[11px] text-slate-500">Add to existing cafe data</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportMode('replace')}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      importMode === 'replace'
                        ? 'border-rose-600 bg-rose-50/60 ring-2 ring-rose-600/30'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-bold text-slate-800 block">Overwrite All</span>
                    <span className="text-[11px] text-slate-500">Replace existing database</span>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setParsedResult(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Choose Another File
                </button>
                <button
                  id="confirm-import-btn"
                  type="button"
                  onClick={handleConfirmImport}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                >
                  Confirm & Update Database
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

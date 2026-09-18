import { SaleRecord, ExpenseRecord } from '../types';
import { INITIAL_SALES, INITIAL_EXPENSES } from './sampleData';

const STORAGE_KEYS = {
  SALES: 'cafe_db_sales_v1',
  EXPENSES: 'cafe_db_expenses_v1',
  CAFE_NAME: 'cafe_db_name_v1',
};

export function loadSalesFromStorage(): SaleRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SALES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(INITIAL_SALES));
      return INITIAL_SALES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SALES;
  } catch (err) {
    console.error('Failed to load sales from storage:', err);
    return INITIAL_SALES;
  }
}

export function saveSalesToStorage(sales: SaleRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  } catch (err) {
    console.error('Failed to save sales to storage:', err);
  }
}

export function loadExpensesFromStorage(): ExpenseRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
      return INITIAL_EXPENSES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_EXPENSES;
  } catch (err) {
    console.error('Failed to load expenses from storage:', err);
    return INITIAL_EXPENSES;
  }
}

export function saveExpensesToStorage(expenses: ExpenseRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  } catch (err) {
    console.error('Failed to save expenses to storage:', err);
  }
}

export function loadCafeName(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.CAFE_NAME) || 'Morning Brew Cafe & Bakery';
  } catch {
    return 'Morning Brew Cafe & Bakery';
  }
}

export function saveCafeName(name: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CAFE_NAME, name);
  } catch {
    // ignore
  }
}

export function resetToDefaultData(): { sales: SaleRecord[]; expenses: ExpenseRecord[] } {
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(INITIAL_SALES));
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
  return { sales: INITIAL_SALES, expenses: INITIAL_EXPENSES };
}

export function clearAllDatabaseRecords(): { sales: SaleRecord[]; expenses: ExpenseRecord[] } {
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify([]));
  return { sales: [], expenses: [] };
}

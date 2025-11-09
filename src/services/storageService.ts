import type { Transaction } from '../types/data';

const TRANSACTIONS_KEY = 'transactions';
const BUDGET_KEY = 'monthlyBudget';

export const loadTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to load transactions:", error);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]) => {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error("Failed to save transactions:", error);
  }
};

export const loadBudget = (): number => {
  try {
    const data = localStorage.getItem(BUDGET_KEY);
    if (!data) return 0;
    return parseFloat(data);
  } catch (error) {
    console.error("Failed to load budget:", error);
    return 0;
  }
};

export const saveBudget = (budget: number) => {
  try {
    localStorage.setItem(BUDGET_KEY, budget.toString());
  } catch (error) {
    console.error("Failed to save budget:", error);
  }
};
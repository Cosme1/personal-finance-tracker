import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadTransactions, saveTransactions, loadBudget, saveBudget } from './storageService';
import type { Transaction } from '../types/data';

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadTransactions', () => {
    it('should return empty array when no transactions exist', () => {
      const result = loadTransactions();
      expect(result).toEqual([]);
    });

    it('should load transactions from localStorage', () => {
      const mockTransactions: Transaction[] = [
        { id: '1', date: '2024-01-01', amount: 100, type: 'expense', category: 'Food', account: 'Cash' }
      ];
      localStorage.setItem('transactions', JSON.stringify(mockTransactions));

      const result = loadTransactions();
      expect(result).toEqual(mockTransactions);
    });

    it('should return empty array on parse error', () => {
      localStorage.setItem('transactions', 'invalid json');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = loadTransactions();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('saveTransactions', () => {
    it('should save transactions to localStorage', () => {
      const mockTransactions: Transaction[] = [
        { id: '1', date: '2024-01-01', amount: 100, type: 'expense', category: 'Food', account: 'Cash' }
      ];

      saveTransactions(mockTransactions);
      const saved = localStorage.getItem('transactions');
      expect(saved).toBe(JSON.stringify(mockTransactions));
    });
  });

  describe('loadBudget', () => {
    it('should return 0 when no budget exists', () => {
      const result = loadBudget();
      expect(result).toBe(0);
    });

    it('should load budget from localStorage', () => {
      localStorage.setItem('monthlyBudget', '1000');

      const result = loadBudget();
      expect(result).toBe(1000);
    });
  });

  describe('saveBudget', () => {
    it('should save budget to localStorage', () => {
      saveBudget(1500);
      const saved = localStorage.getItem('monthlyBudget');
      expect(saved).toBe('1500');
    });
  });
});

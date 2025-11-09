import { useState, useEffect, useMemo } from 'react';
import type { Transaction } from './types/data';
import { loadTransactions, saveTransactions, loadBudget, saveBudget } from './services/storageService';
import { TransactionList } from './components/TransactionList';
import { TransactionForm } from './components/TransactionForm';
import { TransactionFilters } from './components/TransactionFilters';
import { BudgetSettings } from './components/BudgetSettings';
import { Dashboard } from './components/Dashboard';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());
  const [budget, setBudget] = useState<number>(() => loadBudget());
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveBudget(budget);
  }, [budget]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: crypto.randomUUID() };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const categories = useMemo(() => {
    const uniqueCategories = new Set(transactions.map(t => t.category));
    return Array.from(uniqueCategories).sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = searchQuery === '' || 
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.account.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === '' || t.category === categoryFilter;
      
      const matchesStartDate = startDate === '' || t.date >= startDate;
      const matchesEndDate = endDate === '' || t.date <= endDate;

      return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate;
    });
  }, [transactions, searchQuery, categoryFilter, startDate, endDate]);

  const currentMonthExpenses = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Personal Finance Tracker
      </h1>

      <div className="mb-8">
        <BudgetSettings
          budget={budget}
          onBudgetChange={setBudget}
          currentMonthExpenses={currentMonthExpenses}
        />
      </div>

      <div className="mb-8">
        <Dashboard transactions={transactions} />
      </div>

      <TransactionForm onAddTransaction={addTransaction} />

      <hr className="my-8 border-gray-700" />

      <h2 className="text-3xl font-bold mb-4">Transactions</h2>
      
      <TransactionFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categories={categories}
      />

      <TransactionList transactions={filteredTransactions} onDelete={deleteTransaction} />
    </div>
  );
}

export default App;

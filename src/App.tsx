import { useState, useEffect, useMemo } from 'react';
import type { Transaction } from './types/data';
import { loadTransactions, saveTransactions } from './services/storageService';
import { TransactionList } from './components/TransactionList';
import { TransactionForm } from './components/TransactionForm';
import { TransactionFilters } from './components/TransactionFilters';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

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

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Personal Finance Tracker
      </h1>

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

import { useState, useEffect } from 'react';
import type { Transaction } from './types/data';
import { loadTransactions, saveTransactions } from './services/storageService';
import { TransactionList } from './components/TransactionList';
import { TransactionForm } from './components/TransactionForm';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());

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

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Personal Finance Tracker
      </h1>

      <TransactionForm onAddTransaction={addTransaction} />

      <hr className="my-8 border-gray-700" />

      <h2 className="text-3xl font-bold mb-4">Transactions</h2>
      <TransactionList transactions={transactions} onDelete={deleteTransaction} />
    </div>
  );
}

export default App;

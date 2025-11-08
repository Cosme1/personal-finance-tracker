import { useState } from 'react';
import type { Transaction, TransactionType } from '../types/data';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const initialFormState = {
  type: 'expense' as TransactionType,
  date: new Date().toISOString().split('T')[0],
  amount: '',
  category: '',
  account: '',
};

export const TransactionForm = ({ onAddTransaction }: TransactionFormProps) => {
  const [formState, setFormState] = useState(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.amount || !formState.category || !formState.account) return;

    onAddTransaction({
      ...formState,
      amount: parseFloat(formState.amount),
    });

    setFormState(initialFormState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-2xl font-semibold">Add New Transaction</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Form fields go here */}
        <label className="flex flex-col">
          Type
          <select name="type" value={formState.type} onChange={handleChange} className="p-2 bg-gray-800 border border-gray-700 rounded-md mt-1">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>
        <label className="flex flex-col">
          Date
          <input type="date" name="date" value={formState.date} onChange={handleChange} className="p-2 bg-gray-800 border border-gray-700 rounded-md mt-1" />
        </label>
        <label className="flex flex-col">
          Amount
          <input type="number" name="amount" value={formState.amount} onChange={handleChange} placeholder="Enter amount..." className="p-2 bg-gray-800 border border-gray-700 rounded-md mt-1" />
        </label>
        <label className="flex flex-col">
          Category
          <input type="text" name="category" value={formState.category} onChange={handleChange} placeholder="Enter category..." className="p-2 bg-gray-800 border border-gray-700 rounded-md mt-1" />
        </label>
        <label className="flex flex-col md:col-span-2"> {/*  Two columns on bigger screens */}
          Account
          <input type="text" name="account" value={formState.account} onChange={handleChange} placeholder="Enter account..." className="p-2 bg-gray-800 border border-gray-700 rounded-md mt-1" />
        </label>
      </div>
      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
        Add Transaction
      </button>
    </form>
  );
};
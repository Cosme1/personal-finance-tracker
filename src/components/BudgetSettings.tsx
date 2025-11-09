import { useState } from 'react';

interface BudgetSettingsProps {
  budget: number;
  onBudgetChange: (budget: number) => void;
  currentMonthExpenses: number;
}

export const BudgetSettings = ({ budget, onBudgetChange, currentMonthExpenses }: BudgetSettingsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [budgetInput, setBudgetInput] = useState(budget.toString());

  const handleSave = () => {
    const newBudget = parseFloat(budgetInput);
    if (newBudget > 0) {
      onBudgetChange(newBudget);
      setIsEditing(false);
    }
  };

  const percentageUsed = budget > 0 ? (currentMonthExpenses / budget) * 100 : 0;
  const isOverBudget = currentMonthExpenses > budget && budget > 0;

  return (
    <div className={`p-4 rounded-lg ${isOverBudget ? 'bg-red-900/30 border-2 border-red-500' : 'bg-gray-800'}`}>
      <h3 className="text-xl font-semibold mb-3">Monthly Budget</h3>
      
      {isOverBudget && (
        <div className="mb-3 p-3 bg-red-500/20 border border-red-500 rounded-md">
          <p className="text-red-300 font-semibold">⚠️ Warning: You've exceeded your monthly budget!</p>
          <p className="text-sm text-red-200 mt-1">
            Over by ${(currentMonthExpenses - budget).toFixed(2)}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {isEditing ? (
          <div className="flex gap-2">
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="flex-1 p-2 bg-gray-900 border border-gray-700 rounded-md"
              placeholder="Enter budget amount"
            />
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setBudgetInput(budget.toString());
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400">Budget: <span className="text-white font-semibold">${budget.toFixed(2)}</span></p>
              <p className="text-gray-400">Spent: <span className="text-white font-semibold">${currentMonthExpenses.toFixed(2)}</span></p>
              <p className="text-gray-400">Remaining: <span className={`font-semibold ${isOverBudget ? 'text-red-400' : 'text-green-400'}`}>
                ${(budget - currentMonthExpenses).toFixed(2)}
              </span></p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              Edit
            </button>
          </div>
        )}

        {budget > 0 && (
          <div>
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Budget Usage</span>
              <span>{percentageUsed.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  percentageUsed >= 100 ? 'bg-red-500' : percentageUsed >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(percentageUsed, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

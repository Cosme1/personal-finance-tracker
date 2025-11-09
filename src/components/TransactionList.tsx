import type { Transaction } from '../types/data';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList = ({ transactions, onDelete }: TransactionListProps) => {
  if (transactions.length === 0) {
    return <p className="text-center text-gray-500">No transactions yet. Add one to get started!</p>;
  }

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-3">
      {sortedTransactions.map(t => {
        const amountColor = t.type === 'income' ? 'text-green-400' : 'text-red-400';
        const sign = t.type === 'income' ? '+' : '-';

        return (
          <div key={t.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
            <div className="text-left">
              <p className="font-bold text-lg">{t.category}</p>
              <p className="text-sm text-gray-400">{t.date} ({t.account})</p>
            </div>
            <div className="flex items-center gap-4">
              <p className={`text-xl font-semibold ${amountColor}`}>
                {sign} ${t.amount.toFixed(2)}
              </p>
              <button
                onClick={() => onDelete(t.id)}
                className="text-gray-400 hover:text-red-400 transition-colors"
                aria-label="Delete transaction"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
import type { Transaction } from '../types/data';

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
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
            <div>
              <p className="font-bold text-lg">{t.category}</p>
              <p className="text-sm text-gray-400">{t.date} ({t.account})</p>
            </div>
            <p className={`text-xl font-semibold ${amountColor}`}>
              {sign} ${t.amount.toFixed(2)}
            </p>
          </div>
        );
      })}
    </div>
  );
};
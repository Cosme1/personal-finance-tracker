import type { Transaction } from '../types/data';

interface DashboardProps {
  transactions: Transaction[];
}

export const Dashboard = ({ transactions }: DashboardProps) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const monthlyTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
  
  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const categoryBreakdown = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const categories = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1]);
  const maxExpense = Math.max(totalIncome, totalExpenses);

  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 
    'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-orange-500'
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Monthly Overview</h2>

      {/* Income vs Expenses Chart */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Income vs Expenses</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-green-400 font-semibold">Income</span>
              <span className="text-white">${totalIncome.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-8 overflow-hidden">
              <div
                className="bg-green-500 h-full flex items-center justify-end pr-2"
                style={{ width: maxExpense > 0 ? `${(totalIncome / maxExpense) * 100}%` : '0%' }}
              >
                {totalIncome > 0 && <span className="text-xs font-bold text-white">${totalIncome.toFixed(0)}</span>}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-red-400 font-semibold">Expenses</span>
              <span className="text-white">${totalExpenses.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-8 overflow-hidden">
              <div
                className="bg-red-500 h-full flex items-center justify-end pr-2"
                style={{ width: maxExpense > 0 ? `${(totalExpenses / maxExpense) * 100}%` : '0%' }}
              >
                {totalExpenses > 0 && <span className="text-xs font-bold text-white">${totalExpenses.toFixed(0)}</span>}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <div className="flex justify-between">
              <span className="font-semibold">Net Balance</span>
              <span className={`font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${(totalIncome - totalExpenses).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Pie Chart */}
      {categories.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Expenses by Category</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart Visualization */}
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {(() => {
                    let cumulativePercent = 0;
                    return categories.map(([category, amount], index) => {
                      const percent = (amount / totalExpenses) * 100;
                      const startAngle = (cumulativePercent * 360) / 100;
                      const endAngle = ((cumulativePercent + percent) * 360) / 100;
                      cumulativePercent += percent;

                      const startRad = (startAngle * Math.PI) / 180;
                      const endRad = (endAngle * Math.PI) / 180;

                      const x1 = 50 + 45 * Math.cos(startRad);
                      const y1 = 50 + 45 * Math.sin(startRad);
                      const x2 = 50 + 45 * Math.cos(endRad);
                      const y2 = 50 + 45 * Math.sin(endRad);

                      const largeArc = percent > 50 ? 1 : 0;

                      const pathData = [
                        `M 50 50`,
                        `L ${x1} ${y1}`,
                        `A 45 45 0 ${largeArc} 1 ${x2} ${y2}`,
                        `Z`
                      ].join(' ');

                      const colorClass = colors[index % colors.length].replace('bg-', 'fill-');

                      return (
                        <path
                          key={category}
                          d={pathData}
                          className={colorClass.replace('fill-', '')}
                          fill={`var(--${colorClass})`}
                          stroke="rgb(31, 41, 55)"
                          strokeWidth="1"
                          style={{
                            fill: colorClass.includes('blue') ? '#3b82f6' :
                                  colorClass.includes('green') ? '#22c55e' :
                                  colorClass.includes('yellow') ? '#eab308' :
                                  colorClass.includes('purple') ? '#a855f7' :
                                  colorClass.includes('pink') ? '#ec4899' :
                                  colorClass.includes('indigo') ? '#6366f1' :
                                  colorClass.includes('red') ? '#ef4444' :
                                  '#f97316'
                          }}
                        />
                      );
                    });
                  })()}
                </svg>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              {categories.map(([category, amount], index) => {
                const percent = (amount / totalExpenses) * 100;
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${colors[index % colors.length]}`} />
                      <span className="text-sm">{category}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">${amount.toFixed(2)}</span>
                      <span className="text-xs text-gray-400 ml-2">({percent.toFixed(1)}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

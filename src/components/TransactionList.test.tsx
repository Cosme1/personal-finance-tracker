import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionList } from './TransactionList';
import type { Transaction } from '../types/data';

describe('TransactionList', () => {
  const mockTransactions: Transaction[] = [
    { id: '1', date: '2024-01-15', amount: 50, type: 'expense', category: 'Food', account: 'Cash' },
    { id: '2', date: '2024-01-10', amount: 1000, type: 'income', category: 'Salary', account: 'Bank' },
  ];

  it('should render empty message when no transactions', () => {
    const mockDelete = vi.fn();
    render(<TransactionList transactions={[]} onDelete={mockDelete} />);
    
    expect(screen.getByText(/No transactions yet/i)).toBeInTheDocument();
  });

  it('should render all transactions', () => {
    const mockDelete = vi.fn();
    render(<TransactionList transactions={mockTransactions} onDelete={mockDelete} />);
    
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
  });

  it('should display expense with negative sign and red color', () => {
    const mockDelete = vi.fn();
    render(<TransactionList transactions={mockTransactions} onDelete={mockDelete} />);
    
    const expenseAmount = screen.getByText(/- \$50.00/);
    expect(expenseAmount).toBeInTheDocument();
    expect(expenseAmount).toHaveClass('text-red-400');
  });

  it('should display income with positive sign and green color', () => {
    const mockDelete = vi.fn();
    render(<TransactionList transactions={mockTransactions} onDelete={mockDelete} />);
    
    const incomeAmount = screen.getByText(/\+ \$1000.00/);
    expect(incomeAmount).toBeInTheDocument();
    expect(incomeAmount).toHaveClass('text-green-400');
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const mockDelete = vi.fn();
    render(<TransactionList transactions={mockTransactions} onDelete={mockDelete} />);
    
    const deleteButtons = screen.getAllByLabelText('Delete transaction');
    await user.click(deleteButtons[0]);
    
    expect(mockDelete).toHaveBeenCalledWith('2'); // Most recent (sorted by date)
  });

  it('should sort transactions by date descending', () => {
    const mockDelete = vi.fn();
    const { container } = render(<TransactionList transactions={mockTransactions} onDelete={mockDelete} />);
    
    const categories = container.querySelectorAll('.font-bold.text-lg');
    expect(categories[0].textContent).toBe('Food'); // 2024-01-15
    expect(categories[1].textContent).toBe('Salary'); // 2024-01-10
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionForm } from './TransactionForm';

describe('TransactionForm', () => {
  it('should render all form fields', () => {
    const mockOnAdd = vi.fn();
    render(<TransactionForm onAddTransaction={mockOnAdd} />);
    
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    render(<TransactionForm onAddTransaction={mockOnAdd} />);
    
    await user.type(screen.getByPlaceholderText('Enter amount...'), '100');
    await user.type(screen.getByPlaceholderText('Enter category...'), 'Food');
    await user.type(screen.getByPlaceholderText('Enter account...'), 'Cash');
    await user.click(screen.getByText('Add Transaction'));
    
    expect(mockOnAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'expense',
        amount: 100,
        category: 'Food',
        account: 'Cash',
      })
    );
  });

  it('should not submit form with missing fields', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    render(<TransactionForm onAddTransaction={mockOnAdd} />);
    
    await user.type(screen.getByPlaceholderText('Enter amount...'), '100');
    await user.click(screen.getByText('Add Transaction'));
    
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('should reset form after successful submission', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    render(<TransactionForm onAddTransaction={mockOnAdd} />);
    
    const amountInput = screen.getByPlaceholderText('Enter amount...') as HTMLInputElement;
    const categoryInput = screen.getByPlaceholderText('Enter category...') as HTMLInputElement;
    const accountInput = screen.getByPlaceholderText('Enter account...') as HTMLInputElement;
    
    await user.type(amountInput, '100');
    await user.type(categoryInput, 'Food');
    await user.type(accountInput, 'Cash');
    await user.click(screen.getByText('Add Transaction'));
    
    expect(amountInput.value).toBe('');
    expect(categoryInput.value).toBe('');
    expect(accountInput.value).toBe('');
  });
});

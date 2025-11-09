import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BudgetSettings } from './BudgetSettings';

describe('BudgetSettings', () => {
  it('should render budget information', () => {
    const mockOnChange = vi.fn();
    render(<BudgetSettings budget={1000} onBudgetChange={mockOnChange} currentMonthExpenses={500} />);
    
    expect(screen.getByText(/Budget:/)).toBeInTheDocument();
    expect(screen.getByText(/\$1000.00/)).toBeInTheDocument();
    expect(screen.getByText(/Spent:/)).toBeInTheDocument();
    expect(screen.getByText(/\$500.00/)).toBeInTheDocument();
  });

  it('should show warning when over budget', () => {
    const mockOnChange = vi.fn();
    render(<BudgetSettings budget={1000} onBudgetChange={mockOnChange} currentMonthExpenses={1200} />);
    
    expect(screen.getByText(/exceeded your monthly budget/i)).toBeInTheDocument();
    expect(screen.getByText(/Over by \$200.00/)).toBeInTheDocument();
  });

  it('should not show warning when under budget', () => {
    const mockOnChange = vi.fn();
    render(<BudgetSettings budget={1000} onBudgetChange={mockOnChange} currentMonthExpenses={500} />);
    
    expect(screen.queryByText(/exceeded your monthly budget/i)).not.toBeInTheDocument();
  });

  it('should enter edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<BudgetSettings budget={1000} onBudgetChange={mockOnChange} currentMonthExpenses={500} />);
    
    await user.click(screen.getByText('Edit'));
    
    expect(screen.getByPlaceholderText('Enter budget amount')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should save new budget when save is clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<BudgetSettings budget={1000} onBudgetChange={mockOnChange} currentMonthExpenses={500} />);
    
    await user.click(screen.getByText('Edit'));
    const input = screen.getByPlaceholderText('Enter budget amount');
    await user.clear(input);
    await user.type(input, '1500');
    await user.click(screen.getByText('Save'));
    
    expect(mockOnChange).toHaveBeenCalledWith(1500);
  });

  it('should cancel edit without saving', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<BudgetSettings budget={1000} onBudgetChange={mockOnChange} currentMonthExpenses={500} />);
    
    await user.click(screen.getByText('Edit'));
    const input = screen.getByPlaceholderText('Enter budget amount');
    await user.clear(input);
    await user.type(input, '1500');
    await user.click(screen.getByText('Cancel'));
    
    expect(mockOnChange).not.toHaveBeenCalled();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('should display budget usage percentage', () => {
    const mockOnChange = vi.fn();
    render(<BudgetSettings budget={1000} onBudgetChange={mockOnChange} currentMonthExpenses={750} />);
    
    expect(screen.getByText('75.0%')).toBeInTheDocument();
  });
});

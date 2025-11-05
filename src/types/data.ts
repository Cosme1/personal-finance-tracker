export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string; 
  amount: number;
  type: TransactionType;
  category: string; 
  account: string;
  note?: string; 
}
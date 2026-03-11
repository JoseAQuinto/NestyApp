export type Expense = {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  category: string;
  created_at: string;
};

export type CreateExpenseDto = {
  title: string;
  amount: number;
  category: string;
};
import { supabase } from './supabase';
import type { CreateExpenseDto, Expense } from '../features/sharedGroups/types/expense.types';

export const expensesService = {
  async getExpenses(): Promise<Expense[]> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(userError.message);
    }

    if (!user) {
      throw new Error('No hay usuario autenticado.');
    }

    const { data, error } = await supabase
      .from('expenses')
      .select('id, user_id, title, amount, category, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as Expense[];
  },

  async createExpense(payload: CreateExpenseDto): Promise<Expense> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(userError.message);
    }

    if (!user) {
      throw new Error('No hay usuario autenticado.');
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        title: payload.title,
        amount: payload.amount,
        category: payload.category,
      })
      .select('id, user_id, title, amount, category, created_at')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Expense;
  },
};
import { supabase } from './supabase';
import type {
  CreateSharedExpenseDto,
  SharedExpense,
} from '../features/sharedGroups/types/sharedExpense.types';

type GroupMemberRow = {
  user_id: string;
};

const getAuthenticatedUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error('No hay usuario autenticado.');
  }

  return user;
};

const roundToTwo = (value: number) => Number(value.toFixed(2));

export const sharedExpensesService = {
  async getGroupExpenses(groupId: string): Promise<SharedExpense[]> {
    const cleanGroupId = groupId.trim();

    if (!cleanGroupId) {
      throw new Error('El id del grupo es obligatorio.');
    }

    const { data, error } = await supabase
      .from('shared_expenses')
      .select(`
        id,
        group_id,
        created_by_user_id,
        title,
        amount,
        category,
        created_at,
        creator_profile:profiles!shared_expenses_created_by_user_id_fkey (
          display_name,
          email
        )
      `)
      .eq('group_id', cleanGroupId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as SharedExpense[];
  },

  async createSharedExpense({
    groupId,
    title,
    amount,
    category,
  }: CreateSharedExpenseDto): Promise<SharedExpense> {
    const user = await getAuthenticatedUser();

    const cleanGroupId = groupId.trim();
    const cleanTitle = title.trim();
    const cleanCategory = category.trim();

    if (!cleanGroupId) {
      throw new Error('El grupo es obligatorio.');
    }

    if (!cleanTitle) {
      throw new Error('El concepto es obligatorio.');
    }

    if (!cleanCategory) {
      throw new Error('La categoría es obligatoria.');
    }

    if (Number.isNaN(amount) || amount <= 0) {
      throw new Error('El importe debe ser mayor que cero.');
    }

    const { data: members, error: membersError } = await supabase
      .from('shared_group_members')
      .select('user_id')
      .eq('group_id', cleanGroupId);

    if (membersError) {
      throw new Error(membersError.message);
    }

    const groupMembers = (members ?? []) as GroupMemberRow[];

    if (groupMembers.length === 0) {
      throw new Error('El grupo no tiene miembros.');
    }

    const { data: createdExpense, error: expenseError } = await supabase
      .from('shared_expenses')
      .insert({
        group_id: cleanGroupId,
        created_by_user_id: user.id,
        title: cleanTitle,
        amount,
        category: cleanCategory,
      })
      .select(`
        id,
        group_id,
        created_by_user_id,
        title,
        amount,
        category,
        created_at,
        creator_profile:profiles!shared_expenses_created_by_user_id_fkey (
          display_name,
          email
        )
      `)
      .single();

    if (expenseError || !createdExpense) {
      throw new Error(expenseError?.message ?? 'No se pudo crear el gasto.');
    }

    const splitAmount = roundToTwo(amount / groupMembers.length);

    const splitRows = groupMembers.map((member) => ({
      shared_expense_id: createdExpense.id,
      user_id: member.user_id,
      amount_owed: splitAmount,
    }));

    const { error: splitsError } = await supabase
      .from('shared_expense_splits')
      .insert(splitRows);

    if (splitsError) {
      throw new Error(splitsError.message);
    }

    return createdExpense as SharedExpense;
  },
};
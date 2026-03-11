import { supabase } from './supabase';

export type GroupBalanceItemType = {
  user_id: string;
  display_name: string | null;
  email: string | null;
  total_paid: number;
  total_owed: number;
  balance: number;
};

type SplitRow = {
  amount_owed: number | string;
  user_id: string;
};

type ExpenseRow = {
  amount: number | string;
  created_by_user_id: string;
};

type MemberRow = {
  user_id: string;
  profiles: {
    display_name: string | null;
    email: string | null;
  } | null;
};

export const sharedGroupBalancesService = {
  async getGroupBalances(groupId: string): Promise<GroupBalanceItemType[]> {
    const cleanGroupId = groupId.trim();

    if (!cleanGroupId) {
      throw new Error('El id del grupo es obligatorio.');
    }

    const [{ data: members, error: membersError }, { data: expenses, error: expensesError }, { data: splits, error: splitsError }] =
      await Promise.all([
        supabase
          .from('shared_group_members')
          .select(`
            user_id,
            profiles (
              display_name,
              email
            )
          `)
          .eq('group_id', cleanGroupId),

        supabase
          .from('shared_expenses')
          .select('created_by_user_id, amount')
          .eq('group_id', cleanGroupId),

        supabase
          .from('shared_expense_splits')
          .select(`
            user_id,
            amount_owed,
            shared_expenses!inner (
              group_id
            )
          `)
          .eq('shared_expenses.group_id', cleanGroupId),
      ]);

    if (membersError) {
      throw new Error(membersError.message);
    }

    if (expensesError) {
      throw new Error(expensesError.message);
    }

    if (splitsError) {
      throw new Error(splitsError.message);
    }

    const memberRows = (members ?? []) as MemberRow[];
    const expenseRows = (expenses ?? []) as ExpenseRow[];
    const splitRows = (splits ?? []) as SplitRow[];

    const balancesMap = new Map<string, GroupBalanceItemType>();

    for (const member of memberRows) {
      balancesMap.set(member.user_id, {
        user_id: member.user_id,
        display_name: member.profiles?.display_name ?? null,
        email: member.profiles?.email ?? null,
        total_paid: 0,
        total_owed: 0,
        balance: 0,
      });
    }

    for (const expense of expenseRows) {
      const current = balancesMap.get(expense.created_by_user_id);

      if (!current) continue;

      current.total_paid += Number(expense.amount);
    }

    for (const split of splitRows) {
      const current = balancesMap.get(split.user_id);

      if (!current) continue;

      current.total_owed += Number(split.amount_owed);
    }

    const result = Array.from(balancesMap.values()).map((item) => ({
      ...item,
      balance: Number((item.total_paid - item.total_owed).toFixed(2)),
      total_paid: Number(item.total_paid.toFixed(2)),
      total_owed: Number(item.total_owed.toFixed(2)),
    }));

    result.sort((a, b) => b.balance - a.balance);

    return result;
  },
};
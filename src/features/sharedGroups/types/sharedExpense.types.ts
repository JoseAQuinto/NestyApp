export type SharedExpense = {
  id: string;
  group_id: string;
  created_by_user_id: string;
  title: string;
  amount: number;
  category: string;
  created_at: string;
  creator_profile?: {
    display_name: string | null;
    email: string | null;
  } | null;
};

export type CreateSharedExpenseDto = {
  groupId: string;
  title: string;
  amount: number;
  category: string;
};
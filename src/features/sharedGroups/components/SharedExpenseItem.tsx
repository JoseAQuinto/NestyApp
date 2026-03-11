import Card from '../../../components/ui/Card';
import type { SharedExpense } from '../types/sharedExpense.types';

type SharedExpenseItemProps = {
  expense: SharedExpense & {
    formattedDate?: string;
  };
};

const SharedExpenseItem = ({ expense }: SharedExpenseItemProps) => {
  const creatorName =
    expense.creator_profile?.display_name ||
    expense.creator_profile?.email ||
    'Usuario';

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-base font-medium text-slate-900">
            {expense.title}
          </p>

          <p className="mt-1 text-sm text-slate-500">{expense.category}</p>

          <p className="mt-2 text-xs font-medium text-slate-400">
            Añadido por {creatorName}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-base font-semibold text-slate-900">
            {Number(expense.amount).toFixed(2)} €
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {expense.formattedDate ?? expense.created_at}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SharedExpenseItem;
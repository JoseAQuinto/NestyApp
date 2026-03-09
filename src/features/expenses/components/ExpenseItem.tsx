import Card from '../../../components/ui/Card';

type ExpenseItemProps = {
  expense: {
    id: string;
    title: string;
    amount: number;
    category: string;
    created_at: string;
  };
};

const ExpenseItem = ({ expense }: ExpenseItemProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-base font-medium text-slate-900">
            {expense.title}
          </p>
          <p className="mt-1 text-sm text-slate-500">{expense.category}</p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-base font-semibold text-slate-900">
            {Number(expense.amount).toFixed(2)} €
          </p>
          <p className="mt-1 text-xs text-slate-500">{expense.created_at}</p>
        </div>
      </div>
    </Card>
  );
};

export default ExpenseItem;
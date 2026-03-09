import Card from '../../../components/ui/Card';

type ExpenseSummaryCardProps = {
  total: number;
  count: number;
};

const ExpenseSummaryCard = ({ total, count }: ExpenseSummaryCardProps) => {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Total registrado</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {total.toFixed(2)} €
          </p>
        </div>

        <div className="rounded-xl bg-brand-50 px-3 py-2 text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
            Gastos
          </p>
          <p className="mt-1 text-lg font-semibold text-brand-700">{count}</p>
        </div>
      </div>
    </Card>
  );
};

export default ExpenseSummaryCard;
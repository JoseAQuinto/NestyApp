import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

type ExpenseEmptyStateProps = {
  onCreate: () => void;
};

const ExpenseEmptyState = ({ onCreate }: ExpenseEmptyStateProps) => {
  return (
    <Card className="p-5">
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-2xl text-brand-600">
          €
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Todavía no hay gastos
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Empieza añadiendo tu primer gasto para ver el resumen aquí.
          </p>
        </div>

        <Button type="button" onClick={onCreate}>
          Añadir gasto
        </Button>
      </div>
    </Card>
  );
};

export default ExpenseEmptyState;
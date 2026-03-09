import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import Button from '../../components/ui/Button';
import ExpenseEmptyState from '../../features/expenses/components/ExpenseEmptyState';
import ExpenseItem from '../../features/expenses/components/ExpenseItem';
import ExpenseSummaryCard from '../../features/expenses/components/ExpenseSummaryCard';
import type { Expense } from '../../features/expenses/types/expense.types';
import { expensesService } from '../../services/expensesService';

const formatExpenseDate = (value: string) => {
  const date = new Date(value);

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

const ExpensesPage = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const total = useMemo(() => {
    return expenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
  }, [expenses]);

  const handleCreateExpense = () => {
    navigate('/expenses/new');
  };

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await expensesService.getExpenses();
        setExpenses(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'No se pudieron cargar los gastos.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, []);

  return (
    <AppShell
      title="Gastos"
      subtitle="Consulta y registra tus gastos"
      headerRight={
        <div>
          <Button
            type="button"
            onClick={handleCreateExpense}
            fullWidth={false}
            className="h-10 rounded-full px-4 text-sm"
          >
            Añadir
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <ExpenseSummaryCard total={total} count={expenses.length} />

        {loading ? (
          <p className="text-sm text-slate-500">Cargando gastos...</p>
        ) : error ? (
          <p className="text-sm font-medium text-red-600">{error}</p>
        ) : expenses.length === 0 ? (
          <ExpenseEmptyState onCreate={handleCreateExpense} />
        ) : (
          <section className="space-y-3">
            <p className="text-sm font-medium text-slate-500">Últimos gastos</p>

            <div className="space-y-3">
              {expenses.map((expense) => (
                <ExpenseItem
                  key={expense.id}
                  expense={{
                    ...expense,
                    created_at: formatExpenseDate(expense.created_at),
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
};

export default ExpensesPage;
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { sharedExpensesService } from '../../services/sharedExpensesService';


const NewSharedExpensePage = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!groupId) {
      setError('No se encontró el grupo.');
      return;
    }

    const cleanTitle = title.trim();
    const cleanCategory = category.trim();
    const numericAmount = Number(amount);

    if (!cleanTitle) {
      setError('Introduce un concepto.');
      return;
    }

    if (!amount.trim() || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError('Introduce un importe válido.');
      return;
    }

    if (!cleanCategory) {
      setError('Introduce una categoría.');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);

      await sharedExpensesService.createSharedExpense({
        groupId,
        title: cleanTitle,
        amount: numericAmount,
        category: cleanCategory,
      });

      navigate(`/shared-groups/${groupId}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'No se pudo guardar el gasto.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell
      title="Nuevo gasto compartido"
      subtitle="Añade un gasto al grupo"
    >
      <Card className="p-5">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            id="title"
            label="Concepto"
            type="text"
            placeholder="Ej. Cena"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />

          <Input
            id="amount"
            label="Importe"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="Ej. 24.95"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isSubmitting}
          />

          <Input
            id="category"
            label="Categoría"
            type="text"
            placeholder="Ej. Ocio"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSubmitting}
          />

          {error ? (
            <p className="text-sm font-medium text-red-600">{error}</p>
          ) : null}

          <div className="flex gap-3">
            <Button
              type="button"
              fullWidth
              className="bg-slate-200 text-slate-800 hover:bg-slate-300"
              onClick={() => navigate(groupId ? `/shared-groups/${groupId}` : '/shared-groups')}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>

            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Card>
    </AppShell>
  );
};

export default NewSharedExpensePage;
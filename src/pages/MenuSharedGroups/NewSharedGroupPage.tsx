import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { sharedGroupsService } from '../../services/sharedGroupsService';

const NewSharedGroupPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (isSubmitting) return;

    const cleanName = name.trim();

    if (!cleanName) {
      setError('Introduce un nombre para el grupo.');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);

      const createdGroup = await sharedGroupsService.createGroup({
        name: cleanName,
      });

      navigate(`/shared-groups/${createdGroup.id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'No se pudo crear el grupo.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell title="Nuevo grupo" subtitle="Crea un grupo para compartir gastos">
      <Card className="p-5">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            id="name"
            label="Nombre del grupo"
            type="text"
            placeholder="Ej. Piso Valencia"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
              onClick={() => navigate('/shared-groups')}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>

            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear grupo'}
            </Button>
          </div>
        </form>
      </Card>
    </AppShell>
  );
};

export default NewSharedGroupPage;
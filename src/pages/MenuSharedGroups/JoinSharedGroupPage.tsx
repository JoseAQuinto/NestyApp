import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { sharedGroupsService } from '../../services/sharedGroupsService';

const JoinSharedGroupPage = () => {
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (isSubmitting) return;

    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode) {
      setError('Introduce un código de invitación.');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);

      const group = await sharedGroupsService.joinGroupByCode(cleanCode);
      navigate(`/shared-groups/${group.id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'No se pudo unir al grupo.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell title="Unirse a grupo" subtitle="Introduce el código de invitación">
      <Card className="p-5">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            id="code"
            label="Código de invitación"
            type="text"
            placeholder="Ej. ABC123"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
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
              {isSubmitting ? 'Uniéndose...' : 'Unirse'}
            </Button>
          </div>
        </form>
      </Card>
    </AppShell>
  );
};

export default JoinSharedGroupPage;
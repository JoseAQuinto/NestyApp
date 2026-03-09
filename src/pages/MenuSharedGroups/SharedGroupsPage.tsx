import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import type { SharedGroup } from '../../features/sharedGroups/types/sharedGroup.types';
import { sharedGroupsService } from '../../services/sharedGroupsService';

const SharedGroupsPage = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<SharedGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await sharedGroupsService.getMyGroups();
        setGroups(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'No se pudieron cargar los grupos.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, []);

  return (
    <AppShell
      title="Grupos"
      subtitle="Gastos compartidos"
      headerRight={
        <Button
          fullWidth={false}
          className="h-10 rounded-full px-4 text-sm"
          onClick={() => navigate('/shared-groups/new')}
        >
          Crear
        </Button>
      }
    >
      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-slate-500">Cargando grupos...</p>
        ) : error ? (
          <p className="text-sm font-medium text-red-600">{error}</p>
        ) : groups.length === 0 ? (
          <Card>
            <p className="text-sm text-slate-500">
              Todavía no perteneces a ningún grupo.
            </p>

            <div className="mt-4 flex gap-3">
              <Button
                type="button"
                fullWidth={false}
                className="h-10 px-4"
                onClick={() => navigate('/shared-groups/new')}
              >
                Crear grupo
              </Button>

              <Button
                type="button"
                fullWidth={false}
                className="h-10 bg-slate-200 px-4 text-slate-800 hover:bg-slate-300"
                onClick={() => navigate('/join-group')}
              >
                Unirse
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/join-group')}
                className="text-sm font-medium text-brand-600"
              >
                Unirse con código
              </button>
            </div>

            {groups.map((group) => (
              <Card
                key={group.id}
                className="cursor-pointer"
                onClick={() => navigate(`/shared-groups/${group.id}`)}
              >
                <p className="text-base font-medium text-slate-900">
                  {group.name}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Código: {group.invite_code}
                </p>
              </Card>
            ))}
          </>
        )}
      </div>
    </AppShell>
  );
};

export default SharedGroupsPage;
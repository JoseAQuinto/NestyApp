import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import type { SharedGroup } from '../../features/sharedGroups/types/sharedGroup.types';
import { sharedGroupsService } from '../../services/sharedGroupsService';

const SharedGroupDetailPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState<SharedGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadGroup = async () => {
      if (!groupId) {
        setError('No se encontró el grupo.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const data = await sharedGroupsService.getGroupById(groupId);
        setGroup(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'No se pudo cargar el grupo.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadGroup();
  }, [groupId]);

  return (
    <AppShell
      title={group?.name ?? 'Grupo'}
      subtitle="Detalle del grupo"
      headerRight={
        groupId ? (
          <Button
            fullWidth={false}
            className="h-10 rounded-full px-4 text-sm"
            onClick={() => navigate(`/shared-groups/${groupId}/invite`)}
          >
            Invitar
          </Button>
        ) : null
      }
    >
      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-slate-500">Cargando grupo...</p>
        ) : error ? (
          <p className="text-sm font-medium text-red-600">{error}</p>
        ) : !group ? (
          <p className="text-sm text-slate-500">Grupo no encontrado.</p>
        ) : (
          <>
            <Card>
              <p className="text-sm text-slate-500">Nombre del grupo</p>
              <p className="mt-1 text-base font-medium text-slate-900">
                {group.name}
              </p>
            </Card>

            <Card>
              <p className="text-sm text-slate-500">Código de invitación</p>
              <p className="mt-1 text-base font-medium tracking-wide text-slate-900">
                {group.invite_code}
              </p>
            </Card>

            <Card>
              <p className="text-sm text-slate-500">
                Aquí irán los miembros y los gastos compartidos del grupo.
              </p>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
};

export default SharedGroupDetailPage;
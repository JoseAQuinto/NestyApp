import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import Card from '../../components/ui/Card';
import type { SharedGroup } from '../../features/sharedGroups/types/sharedGroup.types';
import { sharedGroupsService } from '../../services/sharedGroupsService';

const InviteMembersPage = () => {
  const { groupId } = useParams();

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
          err instanceof Error ? err.message : 'No se pudo cargar el código.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadGroup();
  }, [groupId]);

  return (
    <AppShell title="Invitar miembros" subtitle="Comparte este código">
      {loading ? (
        <p className="text-sm text-slate-500">Cargando código...</p>
      ) : error ? (
        <p className="text-sm font-medium text-red-600">{error}</p>
      ) : !group ? (
        <p className="text-sm text-slate-500">Grupo no encontrado.</p>
      ) : (
        <Card className="text-center">
          <p className="text-sm text-slate-500">Código de invitación</p>

          <p className="mt-3 text-3xl font-semibold tracking-widest text-brand-600">
            {group.invite_code}
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Comparte este código con las personas que quieras invitar.
          </p>
        </Card>
      )}
    </AppShell>
  );
};

export default InviteMembersPage;
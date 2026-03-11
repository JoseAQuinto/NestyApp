import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import GroupBalanceItem from '../../features/sharedGroups/components/GroupBalanceItem';
import GroupMemberItem from '../../features/sharedGroups/components/GroupMemberItem';
import SharedExpenseItem from '../../features/sharedGroups/components/SharedExpenseItem';
import type { SharedExpense } from '../../features/sharedGroups/types/sharedExpense.types';
import type { SharedGroup } from '../../features/sharedGroups/types/sharedGroup.types';
import { sharedExpensesService } from '../../services/sharedExpensesService';
import { type GroupBalanceItemType, sharedGroupBalancesService } from '../../services/sharedGroupBalancesService';
import { type GroupMember, sharedGroupMembersService } from '../../services/sharedGroupMembersService';
import { sharedGroupsService } from '../../services/sharedGroupsService';


const formatExpenseDate = (value: string) => {
  const date = new Date(value);

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

const SharedGroupDetailPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState<SharedGroup | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [expenses, setExpenses] = useState<SharedExpense[]>([]);
  const [balances, setBalances] = useState<GroupBalanceItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const total = useMemo(() => {
    return expenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
  }, [expenses]);

  useEffect(() => {
    const loadData = async () => {
      if (!groupId) {
        setError('No se encontró el grupo.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const [groupData, membersData, expensesData, balancesData] = await Promise.all([
          sharedGroupsService.getGroupById(groupId),
          sharedGroupMembersService.getMembers(groupId),
          sharedExpensesService.getGroupExpenses(groupId),
          sharedGroupBalancesService.getGroupBalances(groupId),
        ]);

        setGroup(groupData);
        setMembers(membersData);
        setExpenses(expensesData);
        setBalances(balancesData);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'No se pudo cargar el grupo.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
              <p className="text-sm text-slate-500">Código de invitación</p>
              <p className="mt-1 text-base font-medium tracking-wide text-slate-900">
                {group.invite_code}
              </p>
            </Card>

            <Card>
              <p className="text-sm text-slate-500">Resumen</p>
              <div className="mt-3 flex items-start justify-between gap-4">
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-slate-900">
                    {total.toFixed(2)} €
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Total acumulado del grupo
                  </p>
                </div>

                <div className="rounded-xl bg-brand-50 px-3 py-2 text-right">
                  <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
                    Gastos
                  </p>
                  <p className="mt-1 text-lg font-semibold text-brand-700">
                    {expenses.length}
                  </p>
                </div>
              </div>
            </Card>

            <section className="space-y-3">
              <p className="text-sm font-medium text-slate-500">Balances</p>

              {balances.length === 0 ? (
                <Card>
                  <p className="text-sm text-slate-500">
                    Todavía no hay balances para mostrar.
                  </p>
                </Card>
              ) : (
                balances.map((item) => (
                  <GroupBalanceItem key={item.user_id} item={item} />
                ))
              )}
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-500">Miembros</p>
              </div>

              {members.length === 0 ? (
                <Card>
                  <p className="text-sm text-slate-500">
                    Todavía no hay miembros en el grupo.
                  </p>
                </Card>
              ) : (
                members.map((member) => (
                  <GroupMemberItem key={member.id} member={member} />
                ))
              )}
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-500">
                  Gastos compartidos
                </p>

                {groupId ? (
                  <Button
                    type="button"
                    fullWidth={false}
                    className="h-10 rounded-full px-4 text-sm"
                    onClick={() => navigate(`/shared-groups/${groupId}/expenses/new`)}
                  >
                    Añadir gasto
                  </Button>
                ) : null}
              </div>

              {expenses.length === 0 ? (
                <Card>
                  <p className="text-sm text-slate-500">
                    Todavía no hay gastos compartidos en este grupo.
                  </p>
                </Card>
              ) : (
                expenses.map((expense) => (
                  <SharedExpenseItem
                    key={expense.id}
                    expense={{
                      ...expense,
                      formattedDate: formatExpenseDate(expense.created_at),
                    }}
                  />
                ))
              )}
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
};

export default SharedGroupDetailPage;
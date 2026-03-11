import Card from '../../../components/ui/Card';
import type { GroupBalanceItemType } from '../../../services/sharedGroupBalancesService';

type Props = {
  item: GroupBalanceItemType;
};

const GroupBalanceItem = ({ item }: Props) => {
  const displayName = item.display_name || item.email || 'Usuario';

  const balanceText =
    item.balance > 0
      ? `Debe recibir ${item.balance.toFixed(2)} €`
      : item.balance < 0
        ? `Debe ${Math.abs(item.balance).toFixed(2)} €`
        : 'Está al día';

  const balanceClass =
    item.balance > 0
      ? 'text-emerald-600'
      : item.balance < 0
        ? 'text-red-600'
        : 'text-slate-500';

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-900">{displayName}</p>
          <p className={`mt-1 text-sm font-medium ${balanceClass}`}>{balanceText}</p>
        </div>

        <div className="text-right text-xs text-slate-500">
          <p>Pagado: {item.total_paid.toFixed(2)} €</p>
          <p className="mt-1">Le corresponde: {item.total_owed.toFixed(2)} €</p>
        </div>
      </div>
    </Card>
  );
};

export default GroupBalanceItem;
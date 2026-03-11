import Card from '../../../components/ui/Card';
import type { GroupMember } from '../../../services/sharedGroupMembersService';

type Props = {
  member: GroupMember;
};

const GroupMemberItem = ({ member }: Props) => {
  const displayName =
    member.profiles?.display_name ||
    member.profiles?.email ||
    'Usuario';

  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-900">
          {displayName}
        </p>

        <p className="text-xs text-slate-500">
          {member.role === 'owner' ? 'Propietario' : 'Miembro'}
        </p>
      </div>
    </Card>
  );
};

export default GroupMemberItem;
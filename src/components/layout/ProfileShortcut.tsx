import { Link } from 'react-router-dom';

type ProfileShortcutProps = {
  name: string;
};

const getInitial = (value: string) => {
  return value.trim().charAt(0).toUpperCase() || 'U';
};

const ProfileShortcut = ({ name }: ProfileShortcutProps) => {
  return (
    <Link
      to="/profile"
      className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-2 shadow-sm"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
        {getInitial(name)}
      </div>

      <div className="hidden text-left sm:block">
        <p className="max-w-[120px] truncate text-sm font-medium text-slate-900">
          {name}
        </p>
        <p className="text-xs text-slate-500">Perfil</p>
      </div>
    </Link>
  );
};

export default ProfileShortcut;
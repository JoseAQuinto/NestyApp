
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type MenuCardProps = {
  to: string;
  title: string;
  description: string;
  icon?: ReactNode;
};

const MenuCard = ({ to, title, description, icon }: MenuCardProps) => {
  return (
    <Link
      to={to}
      className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          {icon ?? <span className="text-lg font-semibold">•</span>}
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MenuCard;
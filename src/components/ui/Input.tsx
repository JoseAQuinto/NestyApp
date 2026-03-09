type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const Input = ({ label, id, className = '', ...props }: InputProps) => {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        id={id}
        {...props}
        className={[
          'h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition',
          'focus:border-brand-500 focus:ring-4 focus:ring-brand-100',
          'disabled:cursor-not-allowed disabled:bg-slate-50',
          className,
        ].join(' ')}
      />
    </div>
  );
};

export default Input;
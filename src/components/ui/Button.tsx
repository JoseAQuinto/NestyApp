type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  fullWidth?: boolean;
};

const Button = ({
  children,
  className = '',
  fullWidth = true,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={[
        'inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70',
        fullWidth ? 'h-12 w-full' : 'h-12',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
};

export default Button;
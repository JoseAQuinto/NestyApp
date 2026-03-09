type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

const Card = ({ children, className = '', ...props }: CardProps) => {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
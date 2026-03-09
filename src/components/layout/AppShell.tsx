type AppShellProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  withPadding?: boolean;
  scrollable?: boolean;
};

const AppShell = ({
  title,
  subtitle,
  children,
  headerRight,
  withPadding = true,
  scrollable = true,
}: AppShellProps) => {
  return (
    <main className="safe-x safe-top min-h-full bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col bg-slate-50">
        {(title || subtitle || headerRight) && (
          <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/95 backdrop-blur">
            <div className="flex items-start justify-between gap-4 px-4 py-4">
              <div className="min-w-0">
                {title ? (
                  <h1 className="truncate text-xl font-semibold tracking-tight text-slate-900">
                    {title}
                  </h1>
                ) : null}

                {subtitle ? (
                  <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                ) : null}
              </div>

              {headerRight ? <div className="shrink-0">{headerRight}</div> : null}
            </div>
          </header>
        )}

        <section
          className={[
            'flex-1',
            withPadding ? 'px-4 py-4' : '',
            scrollable ? 'overflow-y-auto' : '',
            'safe-bottom',
          ].join(' ')}
        >
          {children}
        </section>
      </div>
    </main>
  );
};

export default AppShell;
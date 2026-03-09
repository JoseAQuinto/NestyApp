import { useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { authService } from '../../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (isSubmitting) return;

    const cleanEmail = email.trim();

    if (!cleanEmail || !password.trim()) {
      setError('Completa el correo y la contraseña.');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);

      await authService.signIn({
        email: cleanEmail,
        password,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'No se pudo iniciar sesión.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell withPadding={false} scrollable={false}>
      <div className="flex min-h-full items-center px-4 py-6">
        <Card className="w-full p-6 sm:p-8">
          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
              Nesty
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Iniciar sesión
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Accede a tu cuenta para continuar.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              id="email"
              label="Correo electrónico"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={isSubmitting}
            />

            <Input
              id="password"
              label="Contraseña"
              type="password"
              placeholder="Introduce tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={isSubmitting}
            />

            {error ? (
              <p className="text-sm font-medium text-red-600">{error}</p>
            ) : null}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Card>
      </div>
    </AppShell>
  );
};

export default LoginPage;
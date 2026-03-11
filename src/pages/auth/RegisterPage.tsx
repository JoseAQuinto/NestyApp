import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { authService } from '../../services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (isSubmitting) return;

    const cleanName = displayName.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setError('Introduce tu nombre.');
      return;
    }

    if (!cleanEmail) {
      setError('Introduce tu correo.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);

      await authService.signUp({
        email: cleanEmail,
        password,
        displayName: cleanName,
      });

      navigate('/home');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'No se pudo crear la cuenta.';
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
              Crear cuenta
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Regístrate para empezar a usar la aplicación.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              id="displayName"
              label="Nombre"
              type="text"
              placeholder="Tu nombre"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={isSubmitting}
            />

            <Input
              id="email"
              label="Correo electrónico"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />

            <Input
              id="password"
              label="Contraseña"
              type="password"
              placeholder="Introduce una contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />

            <Input
              id="confirmPassword"
              label="Confirmar contraseña"
              type="password"
              placeholder="Repite la contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
            />

            {error ? (
              <p className="text-sm font-medium text-red-600">{error}</p>
            ) : null}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-medium text-brand-600"
            >
              Inicia sesión
            </button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
};

export default RegisterPage;
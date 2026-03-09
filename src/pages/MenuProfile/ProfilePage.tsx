import AppShell from "../../components/layout/AppShell";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";


const ProfilePage = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      console.error('No se pudo cerrar sesión');
    }
  };

  const displayName =
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Usuario';

  return (
    <AppShell title="Perfil" subtitle="Información de tu cuenta">
      <div className="space-y-4">
        <Card>
          <p className="text-sm text-slate-500">Nombre</p>
          <p className="mt-1 text-base font-medium text-slate-900">
            {displayName}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Correo electrónico</p>
          <p className="mt-1 text-base font-medium text-slate-900">
            {user?.email ?? 'Sin correo'}
          </p>
        </Card>

        <Button type="button" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>
    </AppShell>
  );
};

export default ProfilePage;
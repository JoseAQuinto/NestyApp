import AppShell from "../components/layout/AppShell";
import ProfileShortcut from "../components/layout/ProfileShortcut";
import MenuCard from "../components/ui/MenuCard";
import { useAuth } from "../context/AuthContext";


const HomePage = () => {
  const { user } = useAuth();

  const displayName =
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Usuario';

  return (
    <AppShell
      title="Nesty"
      subtitle="Tus herramientas"
      headerRight={<ProfileShortcut name={displayName} />}
    >
      <div className="space-y-4">
        <section className="space-y-2">
          <p className="text-sm font-medium text-slate-500">
            Secciones disponibles
          </p>

          <div className="grid grid-cols-1 gap-3">
            <MenuCard
              to="/expenses"
              title="Gastos"
              description="Consulta y registra tus gastos."
              icon={<span className="text-lg">€</span>}
            />

            <MenuCard
              to="/shared-groups"
              title="Compartir gastos"
              description="Gestiona gastos en grupo."
              icon={<span className="text-lg">👥</span>}
            />

            <MenuCard
              to="/profile"
              title="Perfil"
              description="Revisa tu cuenta y tus datos."
              icon={<span className="text-lg">👤</span>}
            />
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default HomePage;
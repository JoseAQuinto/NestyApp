import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import ExpensesPage from './pages/MenuExpenses/ExpensesPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/MenuProfile/ProfilePage';
import NewExpensePage from './pages/MenuExpenses/NewExpensePage';
import InviteMembersPage from './pages/MenuSharedGroups/InviteMembersPage';
import JoinSharedGroupPage from './pages/MenuSharedGroups/JoinSharedGroupPage';
import NewSharedGroupPage from './pages/MenuSharedGroups/NewSharedGroupPage';
import SharedGroupDetailPage from './pages/MenuSharedGroups/SharedGroupDetailPage';
import SharedGroupsPage from './pages/MenuSharedGroups/SharedGroupsPage';
import NewSharedExpensePage from './pages/MenuSharedExpense/NewSharedExpensePage';
import RegisterPage from './pages/auth/RegisterPage';

function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return <p>Cargando aplicación...</p>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          session ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/login"
        element={session ? <Navigate to="/home" replace /> : <LoginPage />}
      />

      <Route
        path="/home"
        element={
          // <ProtectedRoute>
          <HomePage />
          // </ProtectedRoute>
        }
      />

      <Route
        path="/expenses"
        element={
          // <ProtectedRoute>
          <ExpensesPage />
          // </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          // <ProtectedRoute>
          <ProfilePage />
          // </ProtectedRoute>
        }
      />

      <Route
        path="/expenses/new"
        element={
          // <ProtectedRoute>
          <NewExpensePage />
          // </ProtectedRoute>
        }
      />

      <Route
        path="/shared-groups"
        element={
          // <ProtectedRoute>
          <SharedGroupsPage />
          // </ProtectedRoute>
        }
      />

      <Route
        path="/shared-groups/new"
        element={
          // <ProtectedRoute>
          <NewSharedGroupPage />
          // </ProtectedRoute>
        }
      />

      <Route
        path="/shared-groups/:groupId"
        element={
          // <ProtectedRoute>
          <SharedGroupDetailPage />
          // </ProtectedRoute>
        }
      />

      <Route
        path="/shared-groups/:groupId/invite"
        element={
          // <ProtectedRoute>
          <InviteMembersPage />
          // </ProtectedRoute>
        }
      />

      <Route
        path="/join-group"
        element={
          // <ProtectedRoute>
          <JoinSharedGroupPage />
          // </ProtectedRoute>
        }
      />

      <Route
        path="/shared-groups/:groupId/expenses/new"
        element={
          // <ProtectedRoute>
          <NewSharedExpensePage />
          // </ProtectedRoute>
        }
      />

      <Route
        path="/register"
        element={session ? <Navigate to="/home" replace /> : <RegisterPage />}
      />

    </Routes>
  );
}

export default App;
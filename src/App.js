import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';

// Pages
import { LoginPage } from './pages/LoginPage';
import SplashScreen from './pages/SplashScreen';
import { DashboardLayout } from './pages/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { OSPage } from './pages/OSPage';
import { ClientsPage } from './pages/ClientsPage';
import { MachinesPage } from './pages/MachinesPage';
import { ContractsPage } from './pages/ContractsPage';
import { SuppliesPage } from './pages/SuppliesPage';
import { DeliveryNotesPage } from './pages/DeliveryNotesPage';
import { CountersPage } from './pages/CountersPage';
import { BillingPage } from './pages/BillingPage';
import { TechnicianOSPage } from './pages/TechnicianOSPage';
import { TecnicosPage } from './pages/TecnicosPage';
import { FornecedoresPage } from './pages/FornecedoresPage';
import { PedidosPage } from './pages/PedidosPage';
import { SolicitacoesPage } from './pages/SolicitacoesPage';
import { BoletosPage } from './pages/BoletosPage';
import { UsuariosPage } from './pages/UsuariosPage';
import { RelatorioPage } from './pages/RelatorioPage';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
      // Redirect to login or dashboard based on auth
      const token = localStorage.getItem('token');
      if (token) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      {/* Login Route */}
      <Route path="/login" element={<LoginPage />} />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />

            {/* Support Module */}
            <Route
              path="os"
              element={
                <PrivateRoute requiredRole={['support', 'admin']}>
                  <OSPage />
                </PrivateRoute>
              }
            />
            <Route
              path="tecnicos"
              element={
                <PrivateRoute requiredRole={['support', 'admin']}>
                  <TecnicosPage />
                </PrivateRoute>
              }
            />

            {/* Supplies Module */}
            <Route
              path="pecas"
              element={
                <PrivateRoute requiredRole={['supply', 'admin']}>
                  <SuppliesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="notas-entrega"
              element={
                <PrivateRoute requiredRole={['supply', 'admin']}>
                  <DeliveryNotesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="fornecedores"
              element={
                <PrivateRoute requiredRole={['supply', 'admin']}>
                  <FornecedoresPage />
                </PrivateRoute>
              }
            />
            <Route
              path="pedidos"
              element={
                <PrivateRoute requiredRole={['supply', 'admin']}>
                  <PedidosPage />
                </PrivateRoute>
              }
            />

            {/* Counter Module */}
            <Route
              path="maquinas"
              element={
                <PrivateRoute requiredRole={['counter', 'admin']}>
                  <MachinesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="clientes"
              element={
                <PrivateRoute requiredRole={['counter', 'admin']}>
                  <ClientsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="contratos"
              element={
                <PrivateRoute requiredRole={['counter', 'admin']}>
                  <ContractsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="contadores"
              element={
                <PrivateRoute requiredRole={['counter', 'admin']}>
                  <CountersPage />
                </PrivateRoute>
              }
            />

            {/* Billing Module */}
            <Route
              path="faturamentos"
              element={
                <PrivateRoute requiredRole={['billing', 'admin']}>
                  <BillingPage />
                </PrivateRoute>
              }
            />
            <Route
              path="boletos"
              element={
                <PrivateRoute requiredRole={['billing', 'admin']}>
                  <BoletosPage />
                </PrivateRoute>
              }
            />

            {/* Technician Module */}
            <Route
              path="minhas-os"
              element={
                <PrivateRoute requiredRole={['technician']}>
                  <TechnicianOSPage />
                </PrivateRoute>
              }
            />
            <Route
              path="solicitacoes"
              element={
                <PrivateRoute requiredRole={['technician']}>
                  <SolicitacoesPage />
                </PrivateRoute>
              }
            />

            {/* Admin Module */}
            <Route
              path="usuarios"
              element={
                <PrivateRoute requiredRole={['admin']}>
                  <UsuariosPage />
                </PrivateRoute>
              }
            />
            <Route
              path="relatorio"
              element={
                <PrivateRoute requiredRole={['counter', 'admin']}>
                  <RelatorioPage />
                </PrivateRoute>
              }
            />
          </Route>

          {/* Redirect to login */}
          <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;

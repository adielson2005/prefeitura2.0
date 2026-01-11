import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { isSessionValid, touchActivity, secureLogout, getCurrentUser } from "@/lib/secureAuth";
import { canAccessRoute, getDefaultRoute, UserRole } from "@/lib/roleGuard";
import { MobileNavbar } from "@/components/layout/MobileNavbar";
import { ThemeProvider } from "@/hooks/use-theme";

// Páginas Admin (existentes)
import Login from "./pages/Login";
import Index from "./pages/Index";
import Vigias from "./pages/Vigias";
import Vigilantes from "./pages/Vigilantes";
import Guardas from "./pages/Guardas";
import Ponto from "./pages/Ponto";
import Escalas from "./pages/Escalas";
import Areas from "./pages/Areas";
import Supervisores from "./pages/Supervisores";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import Perfil from "./pages/Perfil";
import Notificacoes from "./pages/Notificacoes";
import Seguranca from "./pages/Seguranca";
import Buscar from "./pages/Buscar";
import NotFound from "./pages/NotFound";

// Páginas Funcionário
import EmployeeDashboard from "./modules/employee/pages/Dashboard";
import EmployeePonto from "./modules/employee/pages/Ponto";
import EmployeeEscala from "./modules/employee/pages/Escala";
import EmployeeHistorico from "./modules/employee/pages/Historico";
import EmployeePerfil from "./modules/employee/pages/Perfil";
import EmployeeConfiguracoes from "@/modules/employee/pages/Configuracoes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="employee-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          {/* Observador de sessão e atividade do usuário */}
          <AuthWatcher />
          <Routes>
            <Route path="/login" element={<Login />} />

          {/* ==================== ROTAS ADMIN (GERENTE) ==================== */}
          <Route 
            path="/" 
            element={
              <RequireAuth allowedRoles={['ADMINISTRADOR', 'GERENTE', 'ADMIN', 'COORDENADOR', 'SUPERVISOR']}>
                <AuthenticatedLayout>
                  <Index />
                </AuthenticatedLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/vigias" 
            element={
              <RequireAuth allowedRoles={['ADMINISTRADOR', 'GERENTE', 'ADMIN', 'COORDENADOR', 'SUPERVISOR']}>
                <AuthenticatedLayout>
                  <Vigias />
                </AuthenticatedLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/vigilantes" 
            element={
              <RequireAuth allowedRoles={['ADMINISTRADOR', 'GERENTE', 'ADMIN', 'COORDENADOR', 'SUPERVISOR']}>
                <AuthenticatedLayout>
                  <Vigilantes />
                </AuthenticatedLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/guardas" 
            element={
              <RequireAuth allowedRoles={['ADMINISTRADOR', 'GERENTE', 'ADMIN', 'COORDENADOR', 'SUPERVISOR']}>
                <AuthenticatedLayout>
                  <Guardas />
                </AuthenticatedLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/ponto" 
            element={
              <RequireAuth allowedRoles={['ADMINISTRADOR', 'GERENTE', 'ADMIN', 'COORDENADOR', 'SUPERVISOR']}>
                <AuthenticatedLayout>
                  <Ponto />
                </AuthenticatedLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/escalas" 
            element={
              <RequireAuth allowedRoles={['ADMINISTRADOR', 'GERENTE', 'ADMIN', 'COORDENADOR', 'SUPERVISOR']}>
                <AuthenticatedLayout>
                  <Escalas />
                </AuthenticatedLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/areas" 
            element={
              <RequireAuth allowedRoles={['ADMINISTRADOR', 'GERENTE', 'ADMIN', 'COORDENADOR', 'SUPERVISOR']}>
                <AuthenticatedLayout>
                  <Areas />
                </AuthenticatedLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/supervisores" 
            element={
              <RequireAuth allowedRoles={['ADMINISTRADOR', 'GERENTE', 'ADMIN', 'COORDENADOR', 'SUPERVISOR']}>
                <AuthenticatedLayout>
                  <Supervisores />
                </AuthenticatedLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/relatorios" 
            element={
              <RequireAuth allowedRoles={['ADMINISTRADOR', 'GERENTE', 'ADMIN', 'COORDENADOR', 'SUPERVISOR']}>
                <AuthenticatedLayout>
                  <Relatorios />
                </AuthenticatedLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/configuracoes" 
            element={
              <RequireAuth allowedRoles={['ADMINISTRADOR', 'GERENTE', 'ADMIN', 'COORDENADOR', 'SUPERVISOR']}>
                <AuthenticatedLayout>
                  <Configuracoes />
                </AuthenticatedLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/perfil" 
            element={
              <RequireAuth allowedRoles={['ADMINISTRADOR', 'GERENTE', 'ADMIN', 'COORDENADOR', 'SUPERVISOR']}>
                <AuthenticatedLayout>
                  <Perfil />
                </AuthenticatedLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/notificacoes" 
            element={
              <RequireAuth allowedRoles={['ADMINISTRADOR', 'GERENTE', 'ADMIN', 'COORDENADOR', 'SUPERVISOR']}>
                <AuthenticatedLayout>
                  <Notificacoes />
                </AuthenticatedLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/seguranca" 
            element={
              <RequireAuth allowedRoles={['ADMINISTRADOR', 'GERENTE', 'ADMIN', 'COORDENADOR', 'SUPERVISOR']}>
                <AuthenticatedLayout>
                  <Seguranca />
                </AuthenticatedLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/buscar" 
            element={
              <RequireAuth allowedRoles={['ADMINISTRADOR', 'GERENTE', 'ADMIN', 'COORDENADOR', 'SUPERVISOR']}>
                <AuthenticatedLayout>
                  <Buscar />
                </AuthenticatedLayout>
              </RequireAuth>
            } 
          />

          {/* ==================== ROTAS FUNCIONÁRIO ==================== */}
          <Route 
            path="/funcionario" 
            element={
              <RequireAuth allowedRoles={['VIGIA', 'VIGILANTE', 'GUARDA']}>
                <EmployeeDashboard />
              </RequireAuth>
            } 
          />
          <Route 
            path="/funcionario/ponto" 
            element={
              <RequireAuth allowedRoles={['VIGIA', 'VIGILANTE', 'GUARDA']}>
                <EmployeePonto />
              </RequireAuth>
            } 
          />
          <Route 
            path="/funcionario/escala" 
            element={
              <RequireAuth allowedRoles={['VIGIA', 'VIGILANTE', 'GUARDA']}>
                <EmployeeEscala />
              </RequireAuth>
            } 
          />
          <Route 
            path="/funcionario/historico" 
            element={
              <RequireAuth allowedRoles={['VIGIA', 'VIGILANTE', 'GUARDA']}>
                <EmployeeHistorico />
              </RequireAuth>
            } 
          />
          <Route 
            path="/funcionario/perfil" 
            element={
              <RequireAuth allowedRoles={['VIGIA', 'VIGILANTE', 'GUARDA']}>
                <EmployeePerfil />
              </RequireAuth>
            } 
          />
          <Route 
            path="/funcionario/configuracoes" 
            element={
              <RequireAuth allowedRoles={['VIGIA', 'VIGILANTE', 'GUARDA']}>
                <EmployeeConfiguracoes />
              </RequireAuth>
            } 
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

function RequireAuth({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactElement;
  allowedRoles?: UserRole[];
}) {
  const location = useLocation();
  
  if (!isSessionValid()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar permissão por role
  if (allowedRoles && allowedRoles.length > 0) {
    const currentUser = getCurrentUser();
    if (!currentUser || !allowedRoles.includes(currentUser.role as UserRole)) {
      // Redirecionar para rota padrão do usuário
      const defaultRoute = currentUser ? getDefaultRoute(currentUser.role as UserRole) : '/login';
      return <Navigate to={defaultRoute} replace />;
    }
  }
  
  return children;
}

function AuthenticatedLayout({ children }: { children: React.ReactElement }) {
  return (
    <>
      {children}
      <MobileNavbar />
    </>
  );
}

function AuthWatcher() {
  const navigate = useNavigate();

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "touchstart"];
    const handleActivity = () => touchActivity();
    events.forEach((e) => window.addEventListener(e, handleActivity));

    // Checa sessão periodicamente (a cada 30s)
    const interval = setInterval(() => {
      if (!isSessionValid()) {
        // isSessionValid já faz logout caso expirado
        navigate("/login");
      }
    }, 30 * 1000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      clearInterval(interval);
    };
  }, [navigate]);

  return null;
}



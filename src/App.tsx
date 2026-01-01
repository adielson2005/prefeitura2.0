import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { isAuthenticated, touch } from "@/lib/auth";
import { MobileNavbar } from "@/components/layout/MobileNavbar";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Observador de sessão e atividade do usuário */}
        <AuthWatcher />
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas - exigem autenticação */}
          <Route path="/" element={<RequireAuth><AuthenticatedLayout><Index /></AuthenticatedLayout></RequireAuth>} />
          <Route path="/vigias" element={<RequireAuth><AuthenticatedLayout><Vigias /></AuthenticatedLayout></RequireAuth>} />
          <Route path="/vigilantes" element={<RequireAuth><AuthenticatedLayout><Vigilantes /></AuthenticatedLayout></RequireAuth>} />
          <Route path="/guardas" element={<RequireAuth><AuthenticatedLayout><Guardas /></AuthenticatedLayout></RequireAuth>} />
          <Route path="/ponto" element={<RequireAuth><AuthenticatedLayout><Ponto /></AuthenticatedLayout></RequireAuth>} />
          <Route path="/escalas" element={<RequireAuth><AuthenticatedLayout><Escalas /></AuthenticatedLayout></RequireAuth>} />
          <Route path="/areas" element={<RequireAuth><AuthenticatedLayout><Areas /></AuthenticatedLayout></RequireAuth>} />
          <Route path="/supervisores" element={<RequireAuth><AuthenticatedLayout><Supervisores /></AuthenticatedLayout></RequireAuth>} />
          <Route path="/relatorios" element={<RequireAuth><AuthenticatedLayout><Relatorios /></AuthenticatedLayout></RequireAuth>} />
          <Route path="/configuracoes" element={<RequireAuth><AuthenticatedLayout><Configuracoes /></AuthenticatedLayout></RequireAuth>} />
          <Route path="/perfil" element={<RequireAuth><AuthenticatedLayout><Perfil /></AuthenticatedLayout></RequireAuth>} />
          <Route path="/notificacoes" element={<RequireAuth><AuthenticatedLayout><Notificacoes /></AuthenticatedLayout></RequireAuth>} />
          <Route path="/seguranca" element={<RequireAuth><AuthenticatedLayout><Seguranca /></AuthenticatedLayout></RequireAuth>} />
          <Route path="/buscar" element={<RequireAuth><AuthenticatedLayout><Buscar /></AuthenticatedLayout></RequireAuth>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

function RequireAuth({ children }: { children: React.ReactElement }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
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
    const handleActivity = () => touch();
    events.forEach((e) => window.addEventListener(e, handleActivity));

    // Checa sessão periodicamente (a cada 30s)
    const interval = setInterval(() => {
      if (!isAuthenticated()) {
        // isAuthenticated já faz logout caso expirado
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



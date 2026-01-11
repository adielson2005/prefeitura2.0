import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { isAuthenticated } from "@/lib/supabaseAuth";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticação ao montar
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    // Verificar sessão periodicamente (a cada minuto)
    const interval = setInterval(() => {
      if (!isAuthenticated()) {
        navigate('/login', { replace: true });
      }
    }, 60000); // 1 minuto

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800/50 to-slate-950 md:pb-0 pb-20 overflow-hidden">
      {/* Subtle professional background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Subtle accent */}
        <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-gradient-to-br from-slate-800/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-10 ml-16 md:ml-64">
        <AppHeader title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-auto bg-gradient-to-br from-transparent via-slate-800/10 to-slate-900/20">
          <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

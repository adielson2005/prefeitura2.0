/**
 * Navegação Inferior para o Portal do Funcionário
 * Design mobile-first com acesso rápido às funcionalidades principais
 */

import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      icon: Home,
      label: "Início",
      path: "/funcionario",
    },
    {
      icon: Calendar,
      label: "Escala",
      path: "/funcionario/escalas",
    },
    {
      icon: User,
      label: "Perfil",
      path: "/funcionario/perfil",
    },
    {
      icon: Settings,
      label: "Config",
      path: "/funcionario/configuracoes",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-50 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full relative transition-colors",
                active ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-6 w-6", active && "scale-110")} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] mt-1 font-medium",
                  active && "font-bold"
                )}
              >
                {item.label}
              </span>
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-b-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

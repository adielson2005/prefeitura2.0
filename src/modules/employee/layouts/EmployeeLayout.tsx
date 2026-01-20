/**
 * Layout Principal do Portal do Funcionário
 * Usando o mesmo estilo do AppSidebar
 */

import { ReactNode, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Clock,
  Calendar,
  User,
  Settings,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "../components/BottomNav";
import { secureLogout } from "@/lib/secureAuth";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EmployeeLayoutProps {
  children: ReactNode;
  title?: string;
  showNotifications?: boolean;
}

const menuItems = [
  { path: "/funcionario", icon: Home, label: "Dashboard" },
  { path: "/funcionario/escalas", icon: Calendar, label: "Escalas" },
  { path: "/funcionario/perfil", icon: User, label: "Perfil" },
  {
    path: "/funcionario/configuracoes",
    icon: Settings,
    label: "Configurações",
  },
];

export function EmployeeLayout({
  children,
  title = "Portal do Funcionário",
  showNotifications = true,
}: EmployeeLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    secureLogout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/funcionario") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800/50 to-slate-950 pb-20 md:pb-0">
      {/* Sidebar Desktop */}
      <aside
        className={cn(
          "hidden md:flex fixed left-0 top-0 h-screen bg-slate-900/95 backdrop-blur-lg border-r border-slate-700/50 flex-col z-50 transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-700/50">
          {!collapsed && (
            <h2 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Portal Funcionário
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white hover:bg-slate-800 ml-auto"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 group relative overflow-hidden",
                  active &&
                    "text-white bg-gradient-to-r from-violet-600/80 via-purple-600/70 to-violet-600/80 border border-violet-500/60 shadow-lg shadow-violet-500/30",
                  !active &&
                    "text-slate-400 hover:text-violet-300 hover:bg-slate-800/60 border border-transparent hover:border-violet-700/40 hover:shadow-md",
                  collapsed && "justify-center px-2"
                )}
              >
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-400 via-purple-400 to-violet-500 rounded-r-full shadow-lg shadow-violet-500/50"></div>
                )}

                <Icon
                  className={cn(
                    "h-4 w-4 flex-shrink-0 transition-all duration-300",
                    active
                      ? "text-white scale-110"
                      : "group-hover:scale-110 group-hover:text-violet-400"
                  )}
                />
                {!collapsed && (
                  <span className="truncate text-xs">{item.label}</span>
                )}
                {active && !collapsed && (
                  <div className="absolute right-2 w-2 h-2 rounded-full bg-gradient-to-r from-violet-300 to-purple-300 shadow-lg shadow-violet-400/60 animate-pulse"></div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700/50">
          <Button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 justify-start bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 border border-red-600/30 hover:border-red-500/50 transition-all shadow-md",
              collapsed && "justify-center px-2"
            )}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span className="text-xs font-bold">Sair</span>}
          </Button>
        </div>
      </aside>

      {/* Conteúdo */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 relative transition-all duration-300",
          collapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
        {/* Header Mobile */}
        <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 shadow-lg md:hidden">
          <div className="flex items-center justify-between h-14 px-4">
            <h1 className="text-lg font-bold text-white truncate">{title}</h1>
            <div className="flex items-center gap-2">
              {showNotifications && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-slate-300 hover:text-white hover:bg-slate-800"
                  onClick={() => navigate("/funcionario/notificacoes")}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-slate-800 border-slate-700"
                >
                  <DropdownMenuLabel className="text-slate-300">
                    Minha Conta
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem
                    onClick={() => navigate("/funcionario/perfil")}
                    className="text-slate-200 focus:text-white focus:bg-slate-700"
                  >
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/funcionario/configuracoes")}
                    className="text-slate-200 focus:text-white focus:bg-slate-700"
                  >
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-400 focus:text-red-300 focus:bg-slate-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-transparent via-slate-800/10 to-slate-900/20">
          <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>

        {/* Bottom Nav Mobile */}
        <BottomNav />
      </div>
    </div>
  );
}

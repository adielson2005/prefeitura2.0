import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Shield,
  Eye,
  Clock,
  Calendar,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building2,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { secureLogout } from "@/lib/secureAuth";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Vigias", url: "/vigias", icon: Eye },
  { title: "Vigilantes", url: "/vigilantes", icon: Shield },
  { title: "Guardas", url: "/guardas", icon: Users },
];

const managementNavItems = [
  { title: "Controle de Ponto", url: "/ponto", icon: Clock },
  { title: "Folgas e Escalas", url: "/escalas", icon: Calendar },
  { title: "Áreas", url: "/areas", icon: Building2 },
  { title: "Supervisores", url: "/supervisores", icon: UserCog },
];

const reportNavItems = [
  { title: "Relatórios", url: "/relatorios", icon: FileText },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const NavItem = ({ item }: { item: typeof mainNavItems[0] }) => (
    <NavLink
      to={item.url}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 group relative overflow-hidden",
        isActive(item.url) && "text-white bg-gradient-to-r from-violet-600/80 via-purple-600/70 to-violet-600/80 border border-violet-500/60 shadow-lg shadow-violet-500/30",
        !isActive(item.url) && "text-slate-400 hover:text-violet-300 hover:bg-slate-800/60 border border-transparent hover:border-violet-700/40 hover:shadow-md",
        collapsed && "justify-center px-2"
      )}
    >
      {/* Barra lateral colorida para item ativo */}
      {isActive(item.url) && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-400 via-purple-400 to-violet-500 rounded-r-full shadow-lg shadow-violet-500/50"></div>
      )}
      
      <item.icon className={cn(
        "h-4 w-4 flex-shrink-0 transition-all duration-300",
        isActive(item.url) ? "text-white scale-110" : "group-hover:scale-110 group-hover:text-violet-400"
      )} />
      {!collapsed && <span className="truncate text-xs">{item.title}</span>}
      {isActive(item.url) && !collapsed && (
        <div className="absolute right-2 w-2 h-2 rounded-full bg-gradient-to-r from-violet-300 to-purple-300 shadow-lg shadow-violet-400/60 animate-pulse"></div>
      )}
    </NavLink>
  );

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-gradient-to-b from-slate-900 via-slate-800/40 to-slate-950 border-r border-slate-700/40 transition-all duration-300 ease-in-out h-screen fixed left-0 top-0 backdrop-blur-sm shadow-xl",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Professional line accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-600/30 to-transparent"></div>

      {/* Header - Logo */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/50 to-slate-800/30 backdrop-blur-md",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 via-purple-600 to-violet-700 border-2 border-violet-500/60 flex items-center justify-center flex-shrink-0 shadow-xl shadow-violet-500/40 hover:shadow-violet-500/60 transition-all hover:scale-110 ring-2 ring-violet-400/20">
              <Building2 className="h-5 w-5 text-white font-bold" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display font-black text-sm text-white truncate">Prefeitura</h1>
              <p className="text-[10px] bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent font-semibold truncate">Vigilância Municipal</p>
            </div>
          </div>
        )}
        {collapsed && (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 via-purple-600 to-violet-700 border-2 border-violet-500/60 flex items-center justify-center flex-shrink-0 shadow-xl shadow-violet-500/40 hover:shadow-violet-500/60 transition-all ring-2 ring-violet-400/20">
            <Building2 className="h-5 w-5 text-white font-bold" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-600/40 scrollbar-track-transparent relative z-10">
        {/* Main */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 opacity-80">
              Principal
            </p>
          )}
          {mainNavItems.map((item) => (
            <NavItem key={item.url} item={item} />
          ))}
        </div>

        {/* Divisor visual */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center px-3">
            <div className="w-full border-t border-slate-700/60"></div>
          </div>
        </div>

        {/* Management */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 opacity-80">
              Gestão
            </p>
          )}
          {managementNavItems.map((item) => (
            <NavItem key={item.url} item={item} />
          ))}
        </div>

        {/* Divisor visual */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center px-3">
            <div className="w-full border-t border-slate-700/60"></div>
          </div>
        </div>

        {/* Reports */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 opacity-80">
              Sistema
            </p>
          )}
          {reportNavItems.map((item) => (
            <NavItem key={item.url} item={item} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-slate-800/50 space-y-2 bg-gradient-to-b from-slate-800/30 to-slate-950 relative z-10 backdrop-blur-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full text-slate-400 hover:text-blue-400 hover:bg-slate-800/50 rounded-lg h-8 transition-all border border-slate-700/50 hover:border-blue-500/50",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-xs">Recolher</span>
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            secureLogout();
            navigate('/login', { replace: true });
          }}
          className={cn(
            "w-full text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg h-8 transition-all border border-red-700/30 hover:border-red-600/50",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="text-xs">Sair</span>}
        </Button>
      </div>
    </aside>
  );
}

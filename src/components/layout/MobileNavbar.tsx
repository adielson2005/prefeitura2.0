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
  Menu,
  X,
  LogOut,
  Building2,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Vigias", url: "/vigias", icon: Eye },
  { title: "Vigilantes", url: "/vigilantes", icon: Shield },
  { title: "Guardas", url: "/guardas", icon: Users },
  { title: "Controle de Ponto", url: "/ponto", icon: Clock },
  { title: "Folgas e Escalas", url: "/escalas", icon: Calendar },
  { title: "Áreas", url: "/areas", icon: Building2 },
  { title: "Supervisores", url: "/supervisores", icon: UserCog },
  { title: "Relatórios", url: "/relatorios", icon: FileText },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const NavItem = ({ item }: { item: typeof mainNavItems[0] }) => (
    <NavLink
      to={item.url}
      onClick={() => setIsOpen(false)}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-md font-medium text-sm transition-all duration-150",
        "text-foreground hover:bg-secondary",
        isActive(item.url) && "text-primary bg-primary/10"
      )}
    >
      <item.icon className="h-4 w-4 flex-shrink-0" />
      <span>{item.title}</span>
    </NavLink>
  );

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border px-3 py-2 z-50">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="h-8 w-8"
        >
          {isOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>

        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Building2 className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-xs font-semibold text-foreground">Prefeitura</span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('authTimestamp');
            localStorage.removeItem('lastActivity');
            navigate('/login');
          }}
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 bg-white border-t border-border max-h-96 overflow-y-auto">
          <nav className="p-2 space-y-1">
            {mainNavItems.map((item) => (
              <NavItem key={item.url} item={item} />
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

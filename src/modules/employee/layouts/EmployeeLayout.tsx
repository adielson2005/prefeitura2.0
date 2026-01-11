/**
 * Layout Principal do Portal do Funcionário
 * Design mobile-first com navegação inferior e header minimalista
 */

import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "../components/BottomNav";
import { secureLogout } from "@/lib/secureAuth";
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

export function EmployeeLayout({ 
  children, 
  title = "Portal do Funcionário",
  showNotifications = true 
}: EmployeeLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    secureLogout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      {/* Header Mobile-First */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-gray-900 truncate">
              {title}
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Notificações */}
            {showNotifications && (
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate("/funcionario/notificacoes")}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </Button>
            )}

            {/* Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/funcionario/perfil")}>
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/funcionario/configuracoes")}>
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="min-h-[calc(100vh-3.5rem-4rem)] md:min-h-[calc(100vh-3.5rem)]">
        {children}
      </main>

      {/* Navegação Inferior (Mobile) */}
      <BottomNav />
    </div>
  );
}

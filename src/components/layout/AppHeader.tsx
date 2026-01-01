import { Bell, Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { getUserEmail, logout } from "@/lib/auth";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  const navigate = useNavigate();
  const email = getUserEmail();
  return (
    <header className="h-16 bg-gradient-to-r from-slate-900 via-slate-800/70 to-slate-900 border-b border-slate-700/50 px-3 sm:px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 shadow-lg shadow-slate-900/40 backdrop-blur-sm">
      {/* Professional line accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-600/30 to-transparent"></div>

      {/* Left section */}
      <div className="flex-1 min-w-0">
        <h1 className="font-display text-lg sm:text-xl font-black text-white">{title}</h1>
        {subtitle && (
          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 hidden sm:block font-medium">{subtitle}</p>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1 sm:gap-3 ml-3 sm:ml-6">
        {/* Search - Hidden on mobile */}
        <div className="relative hidden xl:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const value = (e.target as HTMLInputElement).value.trim();
                if (value) navigate(`/buscar?q=${encodeURIComponent(value)}`);
              }
            }}
            className="h-9 pl-9 pr-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500/50 w-48 transition-all hover:bg-slate-700/50"
          />
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/notificacoes')}
          className="relative h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-700/40 rounded-lg transition-all border border-transparent hover:border-slate-600/40"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-lg shadow-red-500/50">
            3
          </span>
        </Button>

        {/* User Menu */}
        <div className="border-l border-slate-700/50 pl-1 sm:pl-3 ml-0.5 sm:ml-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 gap-2 px-1.5 sm:px-2 hover:bg-slate-700/40 rounded-lg transition-all text-slate-300 border border-transparent hover:border-slate-600/40">
                <Avatar className="h-7 w-7 ring-2 ring-slate-500/40 ring-offset-2 ring-offset-slate-900">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 text-white text-[10px] font-bold">
                    AD
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline text-xs sm:text-sm font-semibold text-slate-200">{email ?? 'Usuário'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 bg-slate-900 border border-slate-700/50 shadow-2xl shadow-slate-900/50 backdrop-blur-md">
              <div className="px-2 py-1.5 border-b border-slate-700/30">
                <p className="text-xs sm:text-sm font-semibold text-white">{email ?? 'Usuário'}</p>
                <p className="text-[10px] text-slate-400">{email ?? 'sem-email@local'}</p>
              </div>
              <DropdownMenuSeparator className="bg-slate-700/30" />
              <DropdownMenuItem className="cursor-pointer text-xs sm:text-sm text-slate-300 hover:text-white focus:bg-slate-800/50 transition-all" onClick={() => navigate('/perfil')}>
                <User className="mr-2 h-3.5 w-3.5" />
                <span>Meu Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-xs sm:text-sm text-slate-300 hover:text-white focus:bg-slate-800/50 transition-all" onClick={() => navigate('/configuracoes')}>
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700/30" />
              <DropdownMenuItem
                className="cursor-pointer text-red-500 hover:text-red-400 focus:bg-red-950/60 text-xs sm:text-sm transition-all"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

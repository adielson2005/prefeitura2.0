/**
 * Dashboard Principal do Portal do Funcionário
 * Visão geral rápida com informações pessoais do funcionário logado
 */

import { EmployeeLayout } from "../layouts/EmployeeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle2,
  MapPin,
  User,
  TrendingUp,
  Bell,
  Clock,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getCurrentUser } from "@/lib/secureAuth";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const now = new Date();
  const currentUser = getCurrentUser();

  // Dados do funcionário logado
  const userData = {
    name: currentUser?.name || "João Silva",
    role: currentUser?.role || "Vigilante",
    email: currentUser?.email || "joao.silva@prefeitura.gov.br",
    site: "Praça Central",
    lastPunch: "08:00",
    lastPunchType: "Entrada",
    todayStatus: "ativo",
    nextShift: "Amanhã às 08:00",
    hoursThisMonth: 152,
    hoursToday: 8,
    pendingNotifications: 3,
  };

  return (
    <EmployeeLayout title="Dashboard">
      <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-5 md:space-y-6">
        {/* Bem-vindo */}
        <Card className="bg-gradient-to-br from-violet-600 to-purple-600 text-white border-0">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 truncate">
                  Bem-vindo, {userData.name}!
                </h1>
                <p className="text-sm sm:text-base text-violet-100 mb-1">
                  {userData.role}
                </p>
                <p className="text-xs sm:text-sm text-violet-200 break-words">
                  {format(now, "EEEE, dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 sm:px-4 sm:py-2 flex-shrink-0">
                <p className="text-xs text-violet-100">Status</p>
                <p className="text-base sm:text-lg font-bold">Ativo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards de informações principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Card className="bg-slate-800/90 border-slate-700/50">
            <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">
                  Último Registro
                </CardTitle>
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                {userData.lastPunch}
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                {userData.lastPunchType}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/90 border-slate-700/50">
            <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">
                  Horas Hoje
                </CardTitle>
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                {userData.hoursToday}h
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Trabalhadas hoje
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/90 border-slate-700/50 sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">
                  Horas no Mês
                </CardTitle>
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 flex-shrink-0" />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                {userData.hoursThisMonth}h
              </div>
              <p className="text-xs sm:text-sm text-slate-400">Total do mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Informações do turno */}
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardHeader className="p-4 sm:p-5 md:p-6">
            <CardTitle className="text-base sm:text-lg md:text-xl text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400 flex-shrink-0" />
              Minha Escala
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 md:p-6 pt-0 space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-violet-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm sm:text-base font-semibold text-white">
                    Próximo Turno
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 break-words">
                    {userData.nextShift}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/funcionario/escalas")}
                className="w-full sm:w-auto bg-slate-600/50 border-slate-500/50 text-white hover:bg-slate-500/50 text-xs sm:text-sm"
              >
                Ver Escalas
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm sm:text-base font-semibold text-white">
                    Local de Trabalho
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 break-words">
                    {userData.site}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        {userData.pendingNotifications > 0 && (
          <Card className="bg-slate-800/90 border-slate-700/50">
            <CardHeader className="p-4 sm:p-5 md:p-6">
              <CardTitle className="text-base sm:text-lg md:text-xl text-white flex items-center gap-2">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 flex-shrink-0" />
                Notificações Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm sm:text-base text-white font-semibold break-words">
                    Você tem {userData.pendingNotifications} notificações não
                    lidas
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Confira suas mensagens e atualizações
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/funcionario/notificacoes")}
                  className="w-full sm:w-auto bg-slate-600/50 border-slate-500/50 text-white hover:bg-slate-500/50 text-xs sm:text-sm"
                >
                  Ver Todas
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ações rápidas */}
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardHeader className="p-4 sm:p-5 md:p-6">
            <CardTitle className="text-base sm:text-lg md:text-xl text-white">
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 md:p-6 pt-0 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="h-auto flex flex-col items-center gap-1.5 sm:gap-2 py-3 sm:py-4 bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50 hover:text-white"
              onClick={() => navigate("/funcionario/escalas")}
            >
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-center">
                Ver Escalas
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex flex-col items-center gap-1.5 sm:gap-2 py-3 sm:py-4 bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50 hover:text-white"
              onClick={() => navigate("/funcionario/configuracoes")}
            >
              <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-center">
                Configurações
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex flex-col items-center gap-1.5 sm:gap-2 py-3 sm:py-4 bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50 hover:text-white"
              onClick={() => navigate("/funcionario/perfil")}
            >
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-center">
                Meu Perfil
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex flex-col items-center gap-1.5 sm:gap-2 py-3 sm:py-4 bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50 hover:text-white"
              onClick={() => navigate("/funcionario/historico")}
            >
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-center">
                Meu Histórico
              </span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
}

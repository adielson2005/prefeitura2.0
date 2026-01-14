/**
 * Dashboard Principal do Portal do Funcionário
 * Visão geral rápida com informações essenciais
 */

import { EmployeeLayout } from "../layouts/EmployeeLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { UpcomingLeaves } from "@/components/dashboard/UpcomingLeaves";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { TimeRecordPanel } from "@/components/timerecord/TimeRecordPanel";
import { BarChartComponent } from "@/components/dashboard/BarChartComponent";
import { PieChartComponent } from "@/components/dashboard/PieChartComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  Users,
  UserCheck,
  CalendarOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useEffect } from "react";
import { dataService } from "@/lib/dataService";
import { apiService } from "@/lib/apiService";
import { getCurrentUser } from "@/lib/secureAuth";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const now = new Date();
  const currentUser = getCurrentUser();

  // Dados do sistema - mesma estrutura do encarregado
  const [stats, setStats] = useState(dataService.getStats());
  const [recentActivities, setRecentActivities] = useState(
    dataService.getRecentActivities()
  );
  const [upcomingLeaves, setUpcomingLeaves] = useState(
    dataService.getUpcomingLeaves()
  );
  const [onDutyProfessionals, setOnDutyProfessionals] = useState(
    dataService.getOnDutyProfessionals()
  );
  const [todayStats, setTodayStats] = useState<any>(null);

  // Carregar estatísticas do dia da API
  useEffect(() => {
    const loadTodayStats = async () => {
      if (!currentUser) return;

      try {
        const result = await apiService.getTodayStats();
        if (result.success) {
          setTodayStats(result.data);
        }
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      }
    };

    loadTodayStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsubscribe = dataService.subscribe(() => {
      setStats(dataService.getStats());
      setRecentActivities(dataService.getRecentActivities());
      setUpcomingLeaves(dataService.getUpcomingLeaves());
      setOnDutyProfessionals(dataService.getOnDutyProfessionals());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Dados para gráficos
  const categoryData = [
    {
      name: "Vigias",
      value: dataService.getProfessionalsByCategory("VIGIA").length,
    },
    {
      name: "Vigilantes",
      value: dataService.getProfessionalsByCategory("VIGILANTE").length,
    },
    {
      name: "Guardas",
      value: dataService.getProfessionalsByCategory("GUARDA").length,
    },
  ];

  const statusData = [
    { name: "Em Serviço", value: stats.emServico },
    { name: "Folga", value: stats.folga },
    { name: "Atrasados", value: stats.atrasados },
    { name: "Ausentes", value: stats.ausentes },
  ];

  // Dados do funcionário logado
  const userData = {
    name: "João Silva",
    role: "Vigilante",
    site: "Praça Central",
    lastPunch: "08:00",
    todayStatus: "ativo",
    nextShift: "Amanhã às 08:00",
    hoursThisMonth: 152,
    pendingNotifications: 3,
  };

  return (
    <EmployeeLayout title="Dashboard">
      <div className="space-y-7 sm:space-y-8 md:space-y-10">
        {/* Métricas principais - igual encarregado */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <MetricCard
            title="Total de Profissionais"
            value={stats.total}
            subtitle="Ativos no sistema"
            icon={Users}
            variant="primary"
            trend={{ value: 5.2, isPositive: true }}
          />
          <MetricCard
            title="Em Serviço Agora"
            value={stats.emServico}
            subtitle={`${stats.percentualEmServico}% do efetivo`}
            icon={UserCheck}
            variant="success"
            badge="Hoje"
            progress={parseFloat(stats.percentualEmServico)}
          />
          <MetricCard
            title="De Folga Hoje"
            value={stats.folga}
            subtitle="Programadas"
            icon={CalendarOff}
            variant="warning"
            badge={stats.folga > 20 ? "Alto" : "Normal"}
          />
          <MetricCard
            title="Alertas"
            value={stats.alertas}
            subtitle="Requerem atenção"
            icon={AlertCircle}
            variant="danger"
            badge={stats.alertas > 5 ? "Crítico" : "Normal"}
          />
        </div>

        {/* Painel de Ponto - igual encarregado */}
        <TimeRecordPanel />

        {/* Gráficos - igual encarregado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-5 sm:p-6 shadow-lg">
            <BarChartComponent
              data={categoryData}
              title="Profissionais por Categoria"
              color="#3b82f6"
            />
          </div>
          <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-5 sm:p-6 shadow-lg">
            <PieChartComponent
              data={statusData}
              title="Distribuição de Status"
              colors={["#10b981", "#f59e0b", "#ef4444", "#64748b"]}
            />
          </div>
        </div>

        {/* Grid de informações - igual encarregado */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7">
          <div className="space-y-5 sm:space-y-6 md:space-y-7">
            <ActivityFeed activities={recentActivities} />
            <QuickStats />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-5 sm:p-6 shadow-lg">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Em Serviço
                </h3>
                <span className="text-[10px] sm:text-xs text-slate-300 font-semibold bg-slate-700/60 px-2.5 py-1 rounded-full border border-slate-600/50">
                  Agora
                </span>
              </div>
              <div className="space-y-3">
                {onDutyProfessionals.map((professional) => (
                  <StatusCard key={professional.id} {...professional} />
                ))}
              </div>
            </div>
          </div>

          <div>
            <UpcomingLeaves leaves={upcomingLeaves} />
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}

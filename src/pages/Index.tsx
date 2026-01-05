import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { UpcomingLeaves } from "@/components/dashboard/UpcomingLeaves";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { TimeRecordPanel } from "@/components/timerecord/TimeRecordPanel";
import { BarChartComponent } from "@/components/dashboard/BarChartComponent";
import { PieChartComponent } from "@/components/dashboard/PieChartComponent";
import { Users, UserCheck, CalendarOff, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { dataService } from "@/lib/dataService";

export default function Index() {
  const [stats, setStats] = useState(dataService.getStats());
  const [recentActivities, setRecentActivities] = useState(dataService.getRecentActivities());
  const [upcomingLeaves, setUpcomingLeaves] = useState(dataService.getUpcomingLeaves());
  const [onDutyProfessionals, setOnDutyProfessionals] = useState(dataService.getOnDutyProfessionals());

  useEffect(() => {
    const unsubscribe = dataService.subscribe(() => {
      setStats(dataService.getStats());
      setRecentActivities(dataService.getRecentActivities());
      setUpcomingLeaves(dataService.getUpcomingLeaves());
      setOnDutyProfessionals(dataService.getOnDutyProfessionals());
    });
    return unsubscribe;
  }, []);

  // Dados para gráfico de profissionais por categoria
  const categoryData = [
    { name: 'Vigias', value: dataService.getProfessionalsByCategory('VIGIA').length },
    { name: 'Vigilantes', value: dataService.getProfessionalsByCategory('VIGILANTE').length },
    { name: 'Guardas', value: dataService.getProfessionalsByCategory('GUARDA').length }
  ];

  // Dados para gráfico de status
  const statusData = [
    { name: 'Em Serviço', value: stats.emServico },
    { name: 'Folga', value: stats.folga },
    { name: 'Atrasados', value: stats.atrasados },
    { name: 'Ausentes', value: stats.ausentes }
  ];
  return (
    <AppLayout title="Dashboard" subtitle="Visão geral do sistema">
      <div className="space-y-7 sm:space-y-8 md:space-y-10">
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
            icon={AlertTriangle} 
            variant="danger"
            badge={stats.alertas > 5 ? "Crítico" : "Normal"}
          />
        </div>

        <TimeRecordPanel />

        {/* Gráficos */}
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
              colors={['#10b981', '#f59e0b', '#ef4444', '#64748b']}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7">
          <div className="space-y-5 sm:space-y-6 md:space-y-7">
            <ActivityFeed activities={recentActivities} />
            <QuickStats />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-5 sm:p-6 shadow-lg">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg sm:text-xl font-black text-white">Em Serviço</h3>
                <span className="text-[10px] sm:text-xs text-slate-300 font-semibold bg-slate-700/60 px-2.5 py-1 rounded-full border border-slate-600/50">Agora</span>
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
    </AppLayout>
  );
}

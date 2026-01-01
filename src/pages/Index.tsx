import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { UpcomingLeaves } from "@/components/dashboard/UpcomingLeaves";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { TimeRecordPanel } from "@/components/timerecord/TimeRecordPanel";
import { Users, UserCheck, CalendarOff, AlertTriangle } from "lucide-react";

const recentActivities = [
  { id: "1", type: "ENTRADA" as const, name: "Carlos Silva", time: "07:55", area: "Sede Principal" },
  { id: "2", type: "ENTRADA" as const, name: "Maria Santos", time: "07:52", area: "Anexo I" },
  { id: "3", type: "ALERTA" as const, name: "João Oliveira", time: "07:45", area: "Sede Principal" },
  { id: "4", type: "SAIDA" as const, name: "Ana Costa", time: "06:00", area: "Anexo II" },
  { id: "5", type: "RETORNO_ALMOCO" as const, name: "Pedro Lima", time: "13:05", area: "Sede Principal" },
];

const upcomingLeaves = [
  { id: "1", name: "Roberto Alves", category: "VIGIA" as const, date: "15/12", dayOfWeek: "Dom" },
  { id: "2", name: "Fernanda Costa", category: "VIGILANTE" as const, date: "16/12", dayOfWeek: "Seg" },
  { id: "3", name: "Lucas Mendes", category: "GUARDA" as const, date: "17/12", dayOfWeek: "Ter" },
  { id: "4", name: "Patrícia Rocha", category: "VIGIA" as const, date: "18/12", dayOfWeek: "Qua" },
];

const onDutyProfessionals = [
  { id: "1", name: "Carlos Silva", category: "VIGIA" as const, area: "Sede Principal", status: "EM_SERVICO" as const, entryTime: "07:55" },
  { id: "2", name: "Maria Santos", category: "VIGILANTE" as const, area: "Anexo I", status: "EM_SERVICO" as const, entryTime: "07:52" },
  { id: "3", name: "João Oliveira", category: "GUARDA" as const, area: "Sede Principal", status: "ATRASADO" as const, entryTime: "08:15" },
  { id: "4", name: "Ana Costa", category: "VIGILANTE" as const, area: "Anexo II", status: "FOLGA" as const },
];

export default function Index() {
  return (
    <AppLayout title="Dashboard" subtitle="Visão geral do sistema">
      <div className="space-y-6 sm:space-y-7 md:space-y-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <MetricCard title="Total de Profissionais" value={108} subtitle="Ativos no sistema" icon={Users} variant="primary" trend={{ value: 5.2, isPositive: true }} />
          <MetricCard title="Em Serviço Agora" value={86} subtitle="79.6% do efetivo" icon={UserCheck} variant="success" />
          <MetricCard title="De Folga Hoje" value={15} subtitle="Programadas" icon={CalendarOff} variant="warning" />
          <MetricCard title="Alertas" value={7} subtitle="Requerem atenção" icon={AlertTriangle} variant="danger" />
        </div>

        <TimeRecordPanel />

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

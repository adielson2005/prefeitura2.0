import { cn } from "@/lib/utils";
import { Clock, LogIn, LogOut, Coffee, AlertTriangle } from "lucide-react";

interface Activity {
  id: string;
  type: "ENTRADA" | "SAIDA_ALMOCO" | "RETORNO_ALMOCO" | "SAIDA" | "ALERTA";
  name: string;
  time: string;
  area?: string;
}

const activityConfig = {
  ENTRADA: {
    icon: LogIn,
    label: "Entrada",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/30 border border-emerald-500/50",
    lineColor: "bg-emerald-500/50",
  },
  SAIDA_ALMOCO: {
    icon: Coffee,
    label: "Saída Almoço",
    color: "text-amber-400",
    bgColor: "bg-amber-500/30 border border-amber-500/50",
    lineColor: "bg-amber-500/50",
  },
  RETORNO_ALMOCO: {
    icon: Coffee,
    label: "Retorno Almoço",
    color: "text-blue-400",
    bgColor: "bg-blue-500/30 border border-blue-500/50",
    lineColor: "bg-blue-500/50",
  },
  SAIDA: {
    icon: LogOut,
    label: "Saída",
    color: "text-slate-400",
    bgColor: "bg-slate-500/30 border border-slate-500/50",
    lineColor: "bg-slate-500/50",
  },
  ALERTA: {
    icon: AlertTriangle,
    label: "Alerta",
    color: "text-red-400",
    bgColor: "bg-red-500/30 border border-red-500/50",
    lineColor: "bg-red-500/50",
  },
};

interface ActivityFeedProps {
  activities: Activity[];
  className?: string;
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  return (
    <div className={cn("bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-5 sm:p-6 shadow-lg relative overflow-hidden group", className)}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-500/0 to-slate-500/0 group-hover:from-slate-500/5 group-hover:to-slate-500/5 transition-all duration-300 pointer-events-none"></div>

      <div className="flex items-center justify-between mb-5 relative z-10">
        <h3 className="text-lg sm:text-xl font-black text-white">Atividade Recente</h3>
        <span className="text-[10px] sm:text-xs text-slate-300 font-semibold bg-slate-700/60 px-2.5 py-1 rounded-full border border-slate-600/50">Últimas 24h</span>
      </div>

      <div className="space-y-1.5 relative z-10">
        {activities.map((activity, index) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;
          const isLast = index === activities.length - 1;
          
          return (
            <div key={activity.id} className="flex gap-3 group/activity hover:opacity-100 opacity-90 transition-opacity">
              <div className="flex flex-col items-center">
                <div className={cn("p-1.5 rounded-md shadow-lg", config.bgColor)}>
                  <Icon className={cn("h-3.5 w-3.5", config.color)} />
                </div>
                {!isLast && (
                  <div className={cn("w-0.5 h-10 mt-1.5 opacity-60", config.lineColor)} />
                )}
              </div>
              <div className="flex-1 pb-1">
                <p className="text-xs sm:text-sm font-semibold text-white">
                  {activity.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  {config.label} {activity.area && `• ${activity.area}`}
                </p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 flex-shrink-0">
                <Clock className="h-3 w-3" />
                <span>{activity.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { Eye, Shield, Users } from "lucide-react";

interface QuickStatsProps {
  className?: string;
}

export function QuickStats({ className }: QuickStatsProps) {
  const stats = [
    {
      category: "Vigias",
      icon: Eye,
      total: 24,
      active: 18,
      onLeave: 4,
      absent: 2,
      color: "#64748b",
      lightColor: "from-slate-600 to-slate-700",
    },
    {
      category: "Vigilantes",
      icon: Shield,
      total: 36,
      active: 28,
      onLeave: 6,
      absent: 2,
      color: "#64748b",
      lightColor: "from-slate-600 to-slate-700",
    },
    {
      category: "Guardas",
      icon: Users,
      total: 48,
      active: 40,
      onLeave: 5,
      absent: 3,
      color: "#64748b",
      lightColor: "from-slate-600 to-slate-700",
    },
  ];

  return (
    <div className={cn("bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-5 sm:p-6 shadow-lg relative overflow-hidden group", className)}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-500/0 to-slate-500/0 group-hover:from-slate-500/5 group-hover:to-slate-500/5 transition-all duration-300 pointer-events-none"></div>

      <h3 className="text-lg sm:text-xl font-black text-white mb-5 relative z-10">
        Resumo por Categoria
      </h3>

      <div className="space-y-5 relative z-10">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const activePercent = (stat.active / stat.total) * 100;
          
          return (
            <div key={stat.category} className="group/stat">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    "p-2 rounded-lg text-white flex-shrink-0 shadow-lg group-hover/stat:scale-125 transition-transform",
                    `bg-gradient-to-br ${stat.lightColor}`
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white text-xs sm:text-sm">{stat.category}</p>
                    <p className="text-[10px] text-slate-400">{stat.active}/{stat.total}</p>
                  </div>
                </div>
                <span className="text-base sm:text-lg font-black text-slate-300 flex-shrink-0">{activePercent.toFixed(0)}%</span>
              </div>
              
              <div className="h-2.5 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/50 shadow-md">
                <div
                  className="h-full rounded-full transition-all duration-500 shadow-lg"
                  style={{
                    width: `${activePercent}%`,
                    backgroundColor: stat.color,
                  }}
                />
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3 mt-2 text-[10px] sm:text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color }} />
                  Ativos: {stat.active}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  Folga: {stat.onLeave}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Ausentes: {stat.absent}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

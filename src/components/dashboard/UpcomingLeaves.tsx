import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface Leave {
  id: string;
  name: string;
  category: "VIGIA" | "VIGILANTE" | "GUARDA";
  date: string;
  dayOfWeek: string;
}

interface UpcomingLeavesProps {
  leaves: Leave[];
  className?: string;
}

const categoryColors = {
  VIGIA: "bg-slate-700/60 text-slate-300 border-slate-600/50",
  VIGILANTE: "bg-slate-700/60 text-slate-300 border-slate-600/50",
  GUARDA: "bg-slate-700/60 text-slate-300 border-slate-600/50",
};

export function UpcomingLeaves({ leaves, className }: UpcomingLeavesProps) {
  return (
    <div className={cn("bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-5 sm:p-6 shadow-lg relative overflow-hidden group", className)}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-500/0 to-slate-500/0 group-hover:from-slate-500/5 group-hover:to-slate-500/5 transition-all duration-300 pointer-events-none"></div>

      <div className="flex items-center justify-between mb-5 relative z-10">
        <h3 className="text-lg sm:text-xl font-black text-white">Próximas Folgas</h3>
        <Calendar className="h-5 w-5 text-slate-400 shadow-lg shadow-slate-500/50" />
      </div>

      <div className="space-y-2.5 relative z-10">
        {leaves.map((leave) => {
          const [day, month] = leave.date.split("/");
          
          return (
            <div
              key={leave.id}
              className="flex items-center gap-3 p-3 sm:p-3.5 rounded-lg border border-slate-700/50 bg-slate-800/40 transition-all hover:bg-slate-800/60 hover:border-slate-600/50 hover:scale-105 hover:shadow-lg cursor-pointer group/leave shadow-md"
            >
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-lg bg-gradient-to-br from-slate-700/60 to-slate-800/60 flex flex-col items-center justify-center flex-shrink-0 border border-slate-600/50 group-hover/leave:shadow-lg group-hover/leave:shadow-slate-500/50">
                <span className="text-base sm:text-lg font-black text-slate-300">{day}</span>
                <span className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-400">{month}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold text-white truncate">{leave.name}</p>
                <p className="text-[10px] text-slate-400">{leave.dayOfWeek}</p>
              </div>
              <span className={cn(
                "text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md flex-shrink-0 border shadow-lg transition-all",
                categoryColors[leave.category]
              )}>
                {leave.category}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

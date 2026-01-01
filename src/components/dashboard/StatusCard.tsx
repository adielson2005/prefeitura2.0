import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, MapPin } from "lucide-react";

interface StatusCardProps {
  name: string;
  category: "VIGIA" | "VIGILANTE" | "GUARDA";
  area: string;
  status: "EM_SERVICO" | "FOLGA" | "ATRASADO" | "AUSENTE";
  entryTime?: string;
  className?: string;
}

const statusConfig = {
  EM_SERVICO: { label: "Em Serviço", color: "bg-emerald-500/30 text-emerald-300 border-emerald-500/50" },
  FOLGA: { label: "Folga", color: "bg-slate-500/30 text-slate-300 border-slate-500/50" },
  ATRASADO: { label: "Atrasado", color: "bg-amber-500/30 text-amber-300 border-amber-500/50" },
  AUSENTE: { label: "Ausente", color: "bg-red-500/30 text-red-300 border-red-500/50" },
};

const categoryConfig = {
  VIGIA: { color: "bg-gradient-to-br from-slate-600 to-slate-700" },
  VIGILANTE: { color: "bg-gradient-to-br from-slate-600 to-slate-700" },
  GUARDA: { color: "bg-gradient-to-br from-slate-600 to-slate-700" },
};

export function StatusCard({
  name,
  category,
  area,
  status,
  entryTime,
  className,
}: StatusCardProps) {
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  
  return (
    <div className={cn(
      "bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-lg border border-slate-700/50 p-3 flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-slate-600/50 cursor-pointer shadow-lg relative overflow-hidden group",
      className
    )}>
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-500/0 to-slate-500/0 group-hover:from-slate-500/10 group-hover:to-slate-500/5 transition-all duration-300 pointer-events-none"></div>

      <div className="relative flex-shrink-0">
        <Avatar className="h-11 w-11 border-2 border-slate-700/50 shadow-lg ring-2 ring-slate-500/20 group-hover:ring-slate-500/40 transition-all">
          <AvatarFallback className={cn(
            "text-xs font-black text-white shadow-md",
            categoryConfig[category].color
          )}>
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className={cn(
          "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 shadow-lg",
          statusConfig[status].color.split(' ')[0]
        )} />
      </div>

      <div className="flex-1 min-w-0 relative z-10">
        <div className="flex items-center gap-2 mb-1.5">
          <p className="font-bold text-white truncate text-xs sm:text-sm">{name}</p>
          <span className="text-[9px] sm:text-[10px] font-black text-slate-300 bg-slate-700/60 px-2 py-0.5 rounded-full flex-shrink-0 border border-slate-600/50">
            {category}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 truncate">
          <span className="flex items-center gap-0.5 truncate flex-shrink-0">
            <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
            <span className="truncate">{area}</span>
          </span>
          {entryTime && (
            <span className="flex items-center gap-0.5 flex-shrink-0">
              <Clock className="h-2.5 w-2.5" />
              {entryTime}
            </span>
          )}
        </div>
      </div>

      <div className={cn(
        "px-2.5 py-1.5 rounded-lg text-[10px] font-black flex-shrink-0 border shadow-lg relative z-10",
        statusConfig[status].color
      )}>
        {statusConfig[status].label}
      </div>
    </div>
  );
}

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogIn, Coffee, UtensilsCrossed, LogOut, Clock, CheckCircle2 } from "lucide-react";
import { dataService } from "@/lib/dataService";
import { getCurrentUser } from "@/lib/secureAuth";

interface TimeRecordPanelProps {
  className?: string;
}

type RecordType = "ENTRADA" | "SAIDA_ALMOCO" | "RETORNO_ALMOCO" | "SAIDA";

interface TimeRecord {
  type: RecordType;
  time: string | null;
}

const recordConfig = {
  ENTRADA: {
    icon: LogIn,
    label: "Entrada",
    color: "text-emerald-300",
    bgColor: "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700",
    description: "Registrar entrada no turno",
  },
  SAIDA_ALMOCO: {
    icon: UtensilsCrossed,
    label: "Saída Almoço",
    color: "text-slate-300",
    bgColor: "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700",
    description: "Registrar saída para almoço",
  },
  RETORNO_ALMOCO: {
    icon: Coffee,
    label: "Retorno Almoço",
    color: "text-slate-300",
    bgColor: "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700",
    description: "Registrar retorno do almoço",
  },
  SAIDA: {
    icon: LogOut,
    label: "Saída Final",
    color: "text-slate-300",
    bgColor: "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700",
    description: "Registrar saída do turno",
  },
};

const recordOrder: RecordType[] = ["ENTRADA", "SAIDA_ALMOCO", "RETORNO_ALMOCO", "SAIDA"];

export function TimeRecordPanel({ className }: TimeRecordPanelProps) {
  const [records, setRecords] = useState<TimeRecord[]>([
    { type: "ENTRADA", time: null },
    { type: "SAIDA_ALMOCO", time: null },
    { type: "RETORNO_ALMOCO", time: null },
    { type: "SAIDA", time: null },
  ]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const getNextRecord = (): RecordType | null => {
    for (const record of records) {
      if (!record.time) return record.type;
    }
    return null;
  };

  const registerTime = (type: RecordType) => {
    const currentTime = getCurrentTime();
    setRecords(prev => prev.map(r => 
      r.type === type ? { ...r, time: currentTime } : r
    ));

    // Registrar atividade no dataService
    const user = getCurrentUser();
    const activityTypeMap: Record<RecordType, "ENTRADA" | "SAIDA" | "RETORNO_ALMOCO" | "ALERTA"> = {
      ENTRADA: "ENTRADA",
      SAIDA_ALMOCO: "SAIDA",
      RETORNO_ALMOCO: "RETORNO_ALMOCO",
      SAIDA: "SAIDA"
    };

    dataService.addActivity({
      type: activityTypeMap[type],
      name: user?.username || "Usuário",
      time: currentTime,
      area: "Sede Principal",
      date: new Date().toISOString()
    });
  };

  const nextRecord = getNextRecord();
  const allComplete = !nextRecord;

  return (
    <div className={cn("bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-5 sm:p-6 shadow-lg relative overflow-hidden group", className)}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-500/0 to-slate-500/0 group-hover:from-slate-500/5 group-hover:to-slate-500/5 transition-all duration-300 pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6 relative z-10">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-white">Controle de Ponto</h3>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1.5 hidden sm:block font-semibold">
            {new Date().toLocaleDateString("pt-BR", { 
              weekday: "long", 
              day: "numeric", 
              month: "long", 
              year: "numeric" 
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl font-black text-slate-300 font-display">
          <Clock className="h-5 w-5 text-slate-400" />
          {getCurrentTime()}
        </div>
      </div>

      {allComplete && (
        <div className="mb-5 p-4 sm:p-5 rounded-lg bg-emerald-50/80 border border-emerald-200/60 flex items-center gap-3 shadow-sm">\n          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-emerald-700 text-xs sm:text-sm">Ponto completo!</p>
            <p className="text-[10px] text-emerald-600">Todos os registros do dia foram realizados</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">\n        {records.map((record, index) => {
          const config = recordConfig[record.type];
          const Icon = config.icon;
          const isNext = record.type === nextRecord;
          const isComplete = !!record.time;
          const isDisabled = !isNext && !isComplete;

          return (
            <div
              key={record.type}
              className={cn(
                "relative p-4 sm:p-5 rounded-lg border-2 transition-all duration-200 group hover:scale-105 shadow-sm",
                isComplete && "border-emerald-200/60 bg-emerald-50/60 backdrop-blur-sm",
                isNext && "border-slate-300/60 bg-slate-700/60 backdrop-blur-sm ring-2 ring-slate-400/30",
                isDisabled && "border-slate-200/30 opacity-50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center mb-3 shadow-md transition-transform group-hover:scale-110",
                isComplete ? "bg-emerald-100/80 text-emerald-600" : isNext ? `${config.bgColor} text-white` : "bg-slate-100/80 text-slate-500"
              )}>
                <Icon className="h-5 w-5" />
              </div>

              <p className="font-semibold text-xs sm:text-sm text-slate-900 mb-3">{config.label}</p>
              
              {isComplete ? (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs font-bold text-emerald-600">
                    {record.time}
                  </span>
                </div>
              ) : isNext ? (
                <Button
                  size="sm"
                  className={cn(
                    "w-full mt-1 h-9 text-xs font-black text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200",
                    record.type === "ENTRADA" 
                      ? "bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:via-emerald-400 hover:to-emerald-500 border-2 border-emerald-400/50 ring-2 ring-emerald-500/30" 
                      : `${config.bgColor} hover:opacity-90`
                  )}
                  onClick={() => registerTime(record.type)}
                >
                  <span className="flex items-center gap-1.5">
                    <Icon className="h-4 w-4" />
                    {record.type === "ENTRADA" ? "REGISTRAR AGORA" : "Registrar"}
                  </span>
                </Button>
              ) : (
                <p className="text-[10px] text-slate-500 font-medium">Aguardando...</p>
              )}

              {isNext && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-slate-500 rounded-full animate-pulse shadow-md" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 sm:pt-5 border-t border-slate-700/40">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-slate-400 font-medium">Horas trabalhadas hoje:</span>
          <span className="font-bold text-slate-300">
            {records[0].time && records[3].time ? "8h 00min" : "Em andamento..."}
          </span>
        </div>
      </div>
    </div>
  );
}

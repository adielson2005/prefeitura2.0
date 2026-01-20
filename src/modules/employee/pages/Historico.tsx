/**
 * Histórico de Pontos - Portal do Funcionário
 * Visualização de todos os registros passados
 */

import { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Download,
  Filter,
  ChevronDown,
  Clock,
  TrendingUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  parseISO,
  differenceInMinutes,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { getCurrentUser } from "@/lib/supabaseAuth";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/apiService";

interface DayRecord {
  date: Date;
  entries: {
    type: string;
    time: string;
    id: number;
  }[];
  totalHours: string;
  status: "completo" | "incompleto" | "falta";
}

interface TimeRecord {
  id: number;
  user_id: number;
  punch_type: string;
  punch_time: string;
  location_lat: number | null;
  location_lng: number | null;
  created_at: string;
}

export default function EmployeeHistorico() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<DayRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const { toast } = useToast();

  // Carregar dados do usuário atual
  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    loadUser();
  }, []);

  const loadMonthRecords = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const startDate = startOfMonth(selectedMonth);
      const endDate = endOfMonth(selectedMonth);

      // Usar API backend
      const records = await apiService.getUserTimeRecords(
        currentUser.id,
        startDate.toISOString(),
        endDate.toISOString()
      );

      // Agrupar registros por dia
      if (records.success && records.data) {
        const recordsByDay = groupRecordsByDay(records.data);
        setHistory(recordsByDay);
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      toast({
        title: "Erro ao carregar histórico",
        description: "Não foi possível carregar os registros. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar registros do mês selecionado
  useEffect(() => {
    if (!currentUser) return;
    loadMonthRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  const groupRecordsByDay = (records: TimeRecord[]): DayRecord[] => {
    const days = new Map<string, TimeRecord[]>();

    // Agrupar por data
    records.forEach((record) => {
      const dateKey = format(parseISO(record.punch_time), "yyyy-MM-dd");
      if (!days.has(dateKey)) {
        days.set(dateKey, []);
      }
      days.get(dateKey)!.push(record);
    });

    // Converter para DayRecord[]
    return Array.from(days.entries())
      .map(([dateStr, dayRecords]) => {
        const sortedRecords = dayRecords.sort(
          (a, b) =>
            new Date(a.punch_time).getTime() - new Date(b.punch_time).getTime()
        );

        const entries = sortedRecords.map((record) => ({
          id: record.id,
          type: record.punch_type,
          time: format(parseISO(record.punch_time), "HH:mm"),
        }));

        // Calcular total de horas (entrada - saída)
        let totalMinutes = 0;
        if (sortedRecords.length >= 2) {
          const firstEntry = parseISO(sortedRecords[0].punch_time);
          const lastExit = parseISO(
            sortedRecords[sortedRecords.length - 1].punch_time
          );
          totalMinutes = differenceInMinutes(lastExit, firstEntry);
        }

        const totalHours =
          totalMinutes > 0
            ? `${Math.floor(totalMinutes / 60)}h${
                totalMinutes % 60 > 0 ? (totalMinutes % 60) + "min" : ""
              }`
            : "0h";

        // Determinar status
        let status: "completo" | "incompleto" | "falta" = "incompleto";
        if (sortedRecords.length >= 4) status = "completo";
        else if (sortedRecords.length === 0) status = "falta";

        return {
          date: parseISO(dateStr),
          entries,
          totalHours,
          status,
        };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime()); // Mais recente primeiro
  };

  const calculateStats = () => {
    const totalDays = history.filter((d) => d.status !== "falta").length;
    const absences = history.filter((d) => d.status === "falta").length;

    let totalMinutes = 0;
    history.forEach((day) => {
      if (day.totalHours !== "0h") {
        const match = day.totalHours.match(/(\d+)h(\d+)?min?/);
        if (match) {
          totalMinutes += parseInt(match[1]) * 60 + parseInt(match[2] || "0");
        }
      }
    });

    const totalHours = Math.floor(totalMinutes / 60);
    const avgHoursPerDay =
      totalDays > 0 ? Math.floor(totalMinutes / totalDays / 60) : 0;

    return {
      totalDays,
      totalHours,
      avgHoursPerDay,
      absences,
    };
  };

  const stats = calculateStats();

  return (
    <AppLayout
      title="Histórico"
      subtitle="Visualize todos os seus registros de ponto"
    >
      <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-5 md:space-y-6">
        {/* Filtros */}
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardContent className="p-3 sm:p-4 md:p-5">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50 text-xs sm:text-sm h-9 sm:h-10"
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                <span className="truncate">
                  {format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}
                </span>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 ml-auto flex-shrink-0" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50 h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0"
              >
                <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas do Mês */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <CardHeader className="p-4 sm:p-5 md:p-6 pb-3">
            <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              Resumo do Mês
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                  {stats.totalHours}h
                </p>
                <p className="text-xs sm:text-sm text-blue-100">
                  Total trabalhado
                </p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                  {stats.totalDays}
                </p>
                <p className="text-xs sm:text-sm text-blue-100">
                  Dias trabalhados
                </p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                  {stats.avgHoursPerDay}h
                </p>
                <p className="text-xs sm:text-sm text-blue-100">
                  Média por dia
                </p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                  {stats.absences}
                </p>
                <p className="text-xs sm:text-sm text-blue-100">Faltas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Registros */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-white text-sm sm:text-base">
              Registros Diários
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white text-xs sm:text-sm h-8 sm:h-9"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Exportar</span>
            </Button>
          </div>

          {history.slice(0, 10).map((record, index) => (
            <Card
              key={index}
              className="bg-slate-800/90 border-slate-700/50 hover:border-slate-600/60 transition-all"
            >
              <CardContent className="p-3 sm:p-4 md:p-5">
                <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm sm:text-base truncate">
                      {format(record.date, "EEEE", { locale: ptBR })}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-400">
                      {format(record.date, "d 'de' MMMM", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg sm:text-xl font-bold text-blue-400">
                      {record.totalHours}
                    </p>
                    <span className="inline-block px-1.5 sm:px-2 py-0.5 bg-green-500/20 text-green-300 text-[10px] sm:text-xs font-semibold rounded-full border border-green-500/30">
                      {record.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                  {record.entries.map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm bg-slate-700/50 border border-slate-600/50 rounded p-1.5 sm:p-2"
                    >
                      <Clock className="h-3 w-3 text-slate-400 flex-shrink-0" />
                      <span className="text-slate-400">{entry.type}:</span>
                      <span className="font-semibold ml-auto text-white">
                        {entry.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {isLoading && (
            <div className="text-center py-8 sm:py-12">
              <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 animate-spin text-blue-400" />
              <p className="text-sm sm:text-base text-slate-400">
                Carregando histórico...
              </p>
            </div>
          )}

          {!isLoading && history.length === 0 && (
            <Card className="bg-slate-800/90 border-slate-700/50">
              <CardContent className="text-center py-8 sm:py-12">
                <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-slate-500" />
                <p className="text-slate-300 text-base sm:text-lg mb-2">
                  Nenhum registro encontrado
                </p>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Não há registros de ponto para o mês selecionado.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

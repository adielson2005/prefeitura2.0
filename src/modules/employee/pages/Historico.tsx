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
      <div className="space-y-6">
        {/* Filtros */}
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardContent className="pt-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50"
              >
                <Calendar className="h-4 w-4 mr-2" />
                {format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}
                <ChevronDown className="h-4 w-4 ml-auto" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas do Mês */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Resumo do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-bold">{stats.totalHours}h</p>
                <p className="text-sm text-blue-100">Total trabalhado</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.totalDays}</p>
                <p className="text-sm text-blue-100">Dias trabalhados</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.avgHoursPerDay}h</p>
                <p className="text-sm text-blue-100">Média por dia</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.absences}</p>
                <p className="text-sm text-blue-100">Faltas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Registros */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Registros Diários</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>

          {history.slice(0, 10).map((record, index) => (
            <Card
              key={index}
              className="bg-slate-800/90 border-slate-700/50 hover:border-slate-600/60 transition-all"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-white">
                      {format(record.date, "EEEE", { locale: ptBR })}
                    </p>
                    <p className="text-sm text-slate-400">
                      {format(record.date, "d 'de' MMMM", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-400">
                      {record.totalHours}
                    </p>
                    <span className="inline-block px-2 py-0.5 bg-green-500/20 text-green-300 text-xs font-semibold rounded-full border border-green-500/30">
                      {record.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {record.entries.map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm bg-slate-700/50 border border-slate-600/50 rounded p-2"
                    >
                      <Clock className="h-3 w-3 text-slate-400" />
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
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-400" />
              <p className="text-slate-400">Carregando histórico...</p>
            </div>
          )}

          {!isLoading && history.length === 0 && (
            <Card className="bg-slate-800/90 border-slate-700/50">
              <CardContent className="text-center py-12">
                <AlertCircle className="h-16 w-16 mx-auto mb-4 text-slate-500" />
                <p className="text-slate-300 text-lg mb-2">
                  Nenhum registro encontrado
                </p>
                <p className="text-slate-400 text-sm">
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

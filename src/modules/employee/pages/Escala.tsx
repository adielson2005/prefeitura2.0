/**
 * Visualização de Escala - Portal do Funcionário
 * Mostra os turnos do funcionário de forma clara e intuitiva
 */

import { useState } from "react";
import { EmployeeLayout } from "../layouts/EmployeeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { format, addDays, startOfWeek, isSameDay, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Shift {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  type: "diurno" | "noturno" | "folga";
}

export default function EmployeeEscala() {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );

  // Dados mockados - em produção viriam da API
  const shifts: Shift[] = [
    {
      id: "1",
      date: new Date(2026, 0, 7),
      startTime: "08:00",
      endTime: "17:00",
      location: "Praça Central",
      type: "diurno",
    },
    {
      id: "2",
      date: new Date(2026, 0, 8),
      startTime: "08:00",
      endTime: "17:00",
      location: "Praça Central",
      type: "diurno",
    },
    {
      id: "3",
      date: new Date(2026, 0, 9),
      startTime: "08:00",
      endTime: "17:00",
      location: "Parque Municipal",
      type: "diurno",
    },
    {
      id: "4",
      date: new Date(2026, 0, 10),
      startTime: "20:00",
      endTime: "05:00",
      location: "Praça Central",
      type: "noturno",
    },
    {
      id: "5",
      date: new Date(2026, 0, 11),
      startTime: "08:00",
      endTime: "17:00",
      location: "Praça Central",
      type: "diurno",
    },
    {
      id: "6",
      date: new Date(2026, 0, 12),
      startTime: "00:00",
      endTime: "00:00",
      location: "",
      type: "folga",
    },
    {
      id: "7",
      date: new Date(2026, 0, 13),
      startTime: "00:00",
      endTime: "00:00",
      location: "",
      type: "folga",
    },
  ];

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  const getShiftForDate = (date: Date) => {
    return shifts.find((shift) => isSameDay(shift.date, date));
  };

  const getShiftTypeColor = (type: Shift["type"]) => {
    return {
      diurno: "bg-blue-500/20 border-blue-500/40 text-blue-300",
      noturno: "bg-purple-500/20 border-purple-500/40 text-purple-300",
      folga: "bg-green-500/20 border-green-500/40 text-green-300",
    }[type];
  };

  const getShiftTypeLabel = (type: Shift["type"]) => {
    return {
      diurno: "☀️ Diurno",
      noturno: "🌙 Noturno",
      folga: "🏖️ Folga",
    }[type];
  };

  const nextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));
  const previousWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));
  const goToToday = () =>
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }));

  return (
    <EmployeeLayout title="Minha Escala">
      <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-5 md:space-y-6">
        {/* Navegação de Semana */}
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardHeader className="p-4 sm:p-5 md:p-6 pb-3">
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={previousWeek}
                className="text-slate-300 hover:text-white hover:bg-slate-700 flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>

              <div className="text-center min-w-0 flex-1">
                <CardTitle className="text-base sm:text-lg md:text-xl text-white truncate">
                  {format(currentWeekStart, "MMMM 'de' yyyy", { locale: ptBR })}
                </CardTitle>
                <p className="text-xs sm:text-sm text-slate-400">
                  Semana {format(currentWeekStart, "w", { locale: ptBR })}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextWeek}
                className="text-slate-300 hover:text-white hover:bg-slate-700 flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50 text-xs sm:text-sm"
              onClick={goToToday}
            >
              <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
              Ir para hoje
            </Button>
          </CardContent>
        </Card>

        {/* Escala Semanal */}
        <div className="space-y-2 sm:space-y-3">
          {weekDays.map((date) => {
            const shift = getShiftForDate(date);
            const today = isToday(date);

            return (
              <Card
                key={date.toISOString()}
                className={cn(
                  "transition-all bg-slate-800/90 border-slate-700/50",
                  today && "ring-2 ring-blue-500 shadow-lg border-blue-500/50"
                )}
              >
                <CardContent className="p-3 sm:p-4 md:p-5">
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    {/* Data */}
                    <div className="flex-shrink-0">
                      <div
                        className={cn(
                          "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex flex-col items-center justify-center",
                          today
                            ? "bg-blue-600 text-white"
                            : "bg-slate-700/50 border border-slate-600/50 text-slate-200"
                        )}
                      >
                        <span className="text-[10px] sm:text-xs font-medium uppercase">
                          {format(date, "EEE", { locale: ptBR })}
                        </span>
                        <span className="text-base sm:text-lg font-bold">
                          {format(date, "d")}
                        </span>
                      </div>
                    </div>

                    {/* Detalhes do Turno */}
                    <div className="flex-1 min-w-0">
                      {shift ? (
                        <div className="space-y-1.5 sm:space-y-2">
                          <div
                            className={cn(
                              "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] sm:text-xs font-semibold border",
                              getShiftTypeColor(shift.type)
                            )}
                          >
                            {getShiftTypeLabel(shift.type)}
                          </div>

                          {shift.type !== "folga" && (
                            <>
                              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 flex-shrink-0" />
                                <span className="font-semibold text-white">
                                  {shift.startTime} - {shift.endTime}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-300">
                                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
                                <span className="truncate">
                                  {shift.location}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs sm:text-sm text-slate-400 italic">
                          Sem turno agendado
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Resumo da Semana */}
        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-blue-500/40">
          <CardHeader className="p-4 sm:p-5 md:p-6 pb-3">
            <CardTitle className="text-base sm:text-lg md:text-xl text-white">
              Resumo da Semana
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 md:p-6 pt-0 space-y-2 sm:space-y-3">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-slate-300">Dias trabalhados</span>
              <span className="font-semibold text-white">5 dias</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-slate-300">Total de horas</span>
              <span className="font-semibold text-white">40h</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-slate-300">Turnos noturnos</span>
              <span className="font-semibold text-white">1</span>
            </div>
          </CardContent>
        </Card>

        {/* Exportar */}
        <Button
          variant="outline"
          className="w-full bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50 text-xs sm:text-sm"
        >
          <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
          Exportar Escala (PDF)
        </Button>

        {/* Legenda */}
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardHeader className="p-4 sm:p-5 md:p-6 pb-3">
            <CardTitle className="text-xs sm:text-sm md:text-base text-white">
              Legenda
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 md:p-6 pt-0 space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-blue-500/20 border border-blue-500/40 flex-shrink-0" />
              <span>Turno Diurno</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-purple-500/20 border border-purple-500/40 flex-shrink-0" />
              <span>Turno Noturno</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-green-500/20 border border-green-500/40 flex-shrink-0" />
              <span>Folga</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
}

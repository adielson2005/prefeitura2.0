/**
 * Visualização de Escala - Portal do Funcionário
 * Mostra os turnos do funcionário de forma clara e intuitiva
 */

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin,
  ChevronLeft,
  ChevronRight,
  Download
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
  type: 'diurno' | 'noturno' | 'folga';
}

export default function EmployeeEscala() {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));

  // Dados mockados - em produção viriam da API
  const shifts: Shift[] = [
    { id: '1', date: new Date(2026, 0, 7), startTime: '08:00', endTime: '17:00', location: 'Praça Central', type: 'diurno' },
    { id: '2', date: new Date(2026, 0, 8), startTime: '08:00', endTime: '17:00', location: 'Praça Central', type: 'diurno' },
    { id: '3', date: new Date(2026, 0, 9), startTime: '08:00', endTime: '17:00', location: 'Parque Municipal', type: 'diurno' },
    { id: '4', date: new Date(2026, 0, 10), startTime: '20:00', endTime: '05:00', location: 'Praça Central', type: 'noturno' },
    { id: '5', date: new Date(2026, 0, 11), startTime: '08:00', endTime: '17:00', location: 'Praça Central', type: 'diurno' },
    { id: '6', date: new Date(2026, 0, 12), startTime: '00:00', endTime: '00:00', location: '', type: 'folga' },
    { id: '7', date: new Date(2026, 0, 13), startTime: '00:00', endTime: '00:00', location: '', type: 'folga' },
  ];

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const getShiftForDate = (date: Date) => {
    return shifts.find(shift => isSameDay(shift.date, date));
  };

  const getShiftTypeColor = (type: Shift['type']) => {
    return {
      diurno: 'bg-blue-100 border-blue-300 text-blue-900',
      noturno: 'bg-purple-100 border-purple-300 text-purple-900',
      folga: 'bg-green-100 border-green-300 text-green-900',
    }[type];
  };

  const getShiftTypeLabel = (type: Shift['type']) => {
    return {
      diurno: '☀️ Diurno',
      noturno: '🌙 Noturno',
      folga: '🏖️ Folga',
    }[type];
  };

  const nextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));
  const previousWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));
  const goToToday = () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }));

  return (
    <AppLayout title="Minha Escala" subtitle="Visualize seus turnos e horários">
      <div className="space-y-6">
        {/* Navegação de Semana */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={previousWeek}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="text-center">
                <CardTitle className="text-lg">
                  {format(currentWeekStart, "MMMM 'de' yyyy", { locale: ptBR })}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Semana {format(currentWeekStart, 'w', { locale: ptBR })}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextWeek}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={goToToday}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Ir para hoje
            </Button>
          </CardContent>
        </Card>

        {/* Escala Semanal */}
        <div className="space-y-2">
          {weekDays.map((date) => {
            const shift = getShiftForDate(date);
            const today = isToday(date);

            return (
              <Card
                key={date.toISOString()}
                className={cn(
                  "transition-all",
                  today && "ring-2 ring-blue-500 shadow-lg"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    {/* Data */}
                    <div className="flex-shrink-0">
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex flex-col items-center justify-center",
                        today 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-100 text-gray-900"
                      )}>
                        <span className="text-xs font-medium uppercase">
                          {format(date, 'EEE', { locale: ptBR })}
                        </span>
                        <span className="text-lg font-bold">
                          {format(date, 'd')}
                        </span>
                      </div>
                    </div>

                    {/* Detalhes do Turno */}
                    <div className="flex-1">
                      {shift ? (
                        <div className="space-y-2">
                          <div className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold border",
                            getShiftTypeColor(shift.type)
                          )}>
                            {getShiftTypeLabel(shift.type)}
                          </div>

                          {shift.type !== 'folga' && (
                            <>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="font-semibold">
                                  {shift.startTime} - {shift.endTime}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4" />
                                <span>{shift.location}</span>
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
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
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Resumo da Semana</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Dias trabalhados</span>
              <span className="font-semibold">5 dias</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Total de horas</span>
              <span className="font-semibold">40h</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Turnos noturnos</span>
              <span className="font-semibold">1</span>
            </div>
          </CardContent>
        </Card>

        {/* Exportar */}
        <Button variant="outline" className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Exportar Escala (PDF)
        </Button>

        {/* Legenda */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Legenda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300" />
              <span>Turno Diurno</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded bg-purple-100 border border-purple-300" />
              <span>Turno Noturno</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
              <span>Folga</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

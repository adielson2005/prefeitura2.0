/**
 * Histórico de Pontos - Portal do Funcionário
 * Visualização de todos os registros passados
 */

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  Download,
  Filter,
  ChevronDown,
  Clock,
  TrendingUp
} from "lucide-react";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DayRecord {
  date: Date;
  entries: {
    type: string;
    time: string;
  }[];
  totalHours: string;
  status: 'completo' | 'incompleto' | 'falta';
}

export default function EmployeeHistorico() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Dados mockados
  const history: DayRecord[] = Array.from({ length: 30 }, (_, i) => ({
    date: subDays(new Date(), i),
    entries: [
      { type: 'Entrada', time: '08:00' },
      { type: 'Intervalo', time: '12:00' },
      { type: 'Retorno', time: '13:00' },
      { type: 'Saída', time: '17:00' },
    ],
    totalHours: '8h',
    status: 'completo',
  }));

  const stats = {
    totalDays: 22,
    totalHours: 176,
    avgHoursPerDay: 8,
    absences: 0,
  };

  return (
    <AppLayout title="Histórico" subtitle="Visualize todos os seus registros de ponto">
      <div className="space-y-6">
        {/* Filtros */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Calendar className="h-4 w-4 mr-2" />
                {format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}
                <ChevronDown className="h-4 w-4 ml-auto" />
              </Button>
              <Button variant="outline" size="icon">
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
            <h3 className="font-semibold text-gray-900">Registros Diários</h3>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>

          {history.slice(0, 10).map((record, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {format(record.date, "EEEE", { locale: ptBR })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(record.date, "d 'de' MMMM", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-700">
                      {record.totalHours}
                    </p>
                    <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      {record.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {record.entries.map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm bg-gray-50 rounded p-2"
                    >
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-600">{entry.type}:</span>
                      <span className="font-semibold ml-auto">{entry.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Botão Carregar Mais */}
        <Button variant="outline" className="w-full">
          Carregar mais registros
        </Button>
      </div>
    </AppLayout>
  );
}

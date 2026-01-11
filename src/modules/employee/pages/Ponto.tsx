/**
 * Registro de Ponto - Portal do Funcionário
 * Interface simplificada para marcar entrada/saída/intervalo
 */

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  MapPin, 
  CheckCircle2,
  Coffee,
  LogOut as LogOutIcon,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

type PunchType = 'entrada' | 'intervalo' | 'retorno' | 'saida';

interface PunchRecord {
  id: string;
  type: PunchType;
  time: string;
  location?: string;
}

export default function EmployeePonto() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayRecords, setTodayRecords] = useState<PunchRecord[]>([
    { id: '1', type: 'entrada', time: '08:00:15', location: 'Praça Central' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getNextPunchType = (): PunchType => {
    const lastRecord = todayRecords[todayRecords.length - 1];
    if (!lastRecord) return 'entrada';
    
    const sequence: PunchType[] = ['entrada', 'intervalo', 'retorno', 'saida'];
    const currentIndex = sequence.indexOf(lastRecord.type);
    return sequence[currentIndex + 1] || 'entrada';
  };

  const nextPunch = getNextPunchType();

  const punchConfig = {
    entrada: {
      label: 'Marcar Entrada',
      icon: Clock,
      color: 'green',
      bg: 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg shadow-emerald-500/30',
    },
    intervalo: {
      label: 'Iniciar Intervalo',
      icon: Coffee,
      color: 'orange',
      bg: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-lg shadow-orange-500/30',
    },
    retorno: {
      label: 'Retornar do Intervalo',
      icon: CheckCircle2,
      color: 'blue',
      bg: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30',
    },
    saida: {
      label: 'Marcar Saída',
      icon: LogOutIcon,
      color: 'red',
      bg: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/30',
    },
  };

  const config = punchConfig[nextPunch];
  const Icon = config.icon;

  const handlePunch = () => {
    const newRecord: PunchRecord = {
      id: Date.now().toString(),
      type: nextPunch,
      time: format(currentTime, 'HH:mm:ss'),
      location: 'Praça Central', // Em produção: obter via GPS
    };
    
    setTodayRecords([...todayRecords, newRecord]);
    
    // Feedback visual
    alert(`✅ ${config.label} registrado com sucesso às ${newRecord.time}!`);
  };

  const getPunchTypeLabel = (type: PunchType) => {
    return {
      entrada: 'Entrada',
      intervalo: 'Intervalo',
      retorno: 'Retorno',
      saida: 'Saída',
    }[type];
  };

  const getPunchTypeColor = (type: PunchType) => {
    return {
      entrada: 'text-green-700 bg-green-50 border-green-200',
      intervalo: 'text-orange-700 bg-orange-50 border-orange-200',
      retorno: 'text-blue-700 bg-blue-50 border-blue-200',
      saida: 'text-red-700 bg-red-50 border-red-200',
    }[type];
  };

  return (
    <AppLayout title="Registro de Ponto" subtitle="Marque sua entrada, saída e intervalos">
      <div className="space-y-6">
        {/* Relógio Grande */}
        <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-950/90 backdrop-blur-md border-2 border-violet-500/50 shadow-xl shadow-violet-500/30">
          <CardContent className="pt-6 text-center">
            <div className="text-6xl font-bold text-white tabular-nums mb-2 drop-shadow-lg">
              {format(currentTime, 'HH:mm:ss')}
            </div>
            <p className="text-slate-100 text-sm font-semibold">
              {format(currentTime, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </CardContent>
        </Card>

        {/* Botão Principal de Registro */}
        <Button
          onClick={handlePunch}
          className={cn(
            "w-full h-24 text-xl font-bold shadow-lg",
            config.bg
          )}
        >
          <Icon className="h-8 w-8 mr-3" />
          {config.label}
        </Button>

        {/* Localização Atual */}
        <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-950/90 backdrop-blur-md border border-emerald-500/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-white">
              <MapPin className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold">Praça Central - São Paulo, SP</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              📍 Localização detectada automaticamente
            </p>
          </CardContent>
        </Card>

        {/* Registros de Hoje */}
        <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-950/90 backdrop-blur-md border border-violet-500/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white font-bold">Registros de Hoje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todayRecords.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 text-slate-500" />
                <p>Nenhum registro hoje</p>
              </div>
            ) : (
              todayRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 border border-violet-500/40 hover:border-violet-400/60 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-violet-400 shadow-lg shadow-violet-400/50 animate-pulse" />
                    <div>
                      <p className="font-semibold text-white">
                        {getPunchTypeLabel(record.type)}
                      </p>
                      {record.location && (
                        <p className="text-xs text-slate-300">
                          {record.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-lg text-white">
                      {record.time}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Resumo Rápido */}
        <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-950/90 backdrop-blur-md border border-blue-500/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white font-bold">Resumo do Dia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Horas trabalhadas hoje</span>
              <span className="font-bold text-white">
                {todayRecords.length > 0 ? '3h 45min' : '0h 0min'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Horas restantes</span>
              <span className="font-bold text-white">4h 15min</span>
            </div>
            <Button 
              variant="link" 
              className="w-full justify-between p-0 h-auto text-violet-400 hover:text-violet-300 font-semibold"
            >
              Ver histórico completo
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Dicas */}
        <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-950/90 backdrop-blur-md border border-amber-500/50">
          <CardContent className="pt-4">
            <p className="text-sm text-slate-200">
              💡 <strong className="text-white">Dica:</strong> Mantenha o GPS ativado para registros mais precisos.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

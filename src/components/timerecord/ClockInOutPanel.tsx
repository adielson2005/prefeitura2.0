/**
 * Componente de Registro de Ponto em Tempo Real
 * Permite registrar entrada, saída, almoço com timestamp automático
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { timeClockService } from "@/lib/timeClockService";
import { getCurrentUser } from "@/lib/secureAuth";
import { Clock, LogIn, LogOut, Coffee, CheckCircle2, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClockInOutPanelProps {
  professionalId: string;
  professionalName: string;
  category: 'VIGIA' | 'VIGILANTE' | 'GUARDA';
}

export function ClockInOutPanel({ professionalId, professionalName, category }: ClockInOutPanelProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentTime, setCurrentTime] = useState(format(new Date(), 'HH:mm:ss'));

  // Atualizar relógio a cada segundo
  useState(() => {
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), 'HH:mm:ss'));
    }, 1000);
    return () => clearInterval(interval);
  });

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleClockIn = async () => {
    setLoading(true);
    try {
      const user = getCurrentUser();
      if (!user) {
        showMessage('error', 'Usuário não autenticado');
        return;
      }

      await timeClockService.clockIn({
        professionalId,
        professionalName,
        category,
        userId: user.username,
        userName: user.fullName
      });

      showMessage('success', `✓ Entrada registrada às ${format(new Date(), 'HH:mm')}`);
    } catch (error: any) {
      showMessage('error', error.message || 'Erro ao registrar entrada');
    } finally {
      setLoading(false);
    }
  };

  const handleLunchOut = async () => {
    setLoading(true);
    try {
      const user = getCurrentUser();
      if (!user) {
        showMessage('error', 'Usuário não autenticado');
        return;
      }

      await timeClockService.clockOutLunch(professionalId, user.username, user.fullName);
      showMessage('success', `✓ Saída para almoço registrada às ${format(new Date(), 'HH:mm')}`);
    } catch (error: any) {
      showMessage('error', error.message || 'Erro ao registrar saída para almoço');
    } finally {
      setLoading(false);
    }
  };

  const handleLunchReturn = async () => {
    setLoading(true);
    try {
      const user = getCurrentUser();
      if (!user) {
        showMessage('error', 'Usuário não autenticado');
        return;
      }

      await timeClockService.clockInLunch(professionalId, user.username, user.fullName);
      showMessage('success', `✓ Retorno do almoço registrado às ${format(new Date(), 'HH:mm')}`);
    } catch (error: any) {
      showMessage('error', error.message || 'Erro ao registrar retorno');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      const user = getCurrentUser();
      if (!user) {
        showMessage('error', 'Usuário não autenticado');
        return;
      }

      await timeClockService.clockOut(professionalId, user.username, user.fullName);
      showMessage('success', `✓ Saída registrada às ${format(new Date(), 'HH:mm')}`);
    } catch (error: any) {
      showMessage('error', error.message || 'Erro ao registrar saída');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 shadow-lg">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 border-2 border-blue-500/50 mb-4">
          <Clock className="h-8 w-8 text-blue-400" />
        </div>
        <h3 className="text-2xl font-black text-white mb-1">Registro de Ponto</h3>
        <p className="text-slate-400 text-sm">{professionalName}</p>
        <div className="inline-block mt-2">
          <Badge variant="outline" className="text-blue-300 border-blue-500/50">
            {category}
          </Badge>
        </div>
      </div>

      {/* Relógio Digital */}
      <div className="text-center py-6 mb-6 bg-slate-900/50 rounded-lg border border-slate-700/50">
        <div className="text-4xl font-bold text-white tabular-nums tracking-wider">
          {currentTime}
        </div>
        <div className="text-sm text-slate-400 mt-2">
          {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </div>
      </div>

      {/* Mensagem de Status */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg border-2 ${
          message.type === 'success' 
            ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300' 
            : 'bg-red-950/50 border-red-500/50 text-red-300'
        }`}>
          <p className="text-sm font-semibold text-center">{message.text}</p>
        </div>
      )}

      {/* Botões de Ação */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleClockIn}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-emerald-900/50 disabled:opacity-50"
        >
          <LogIn className="h-5 w-5 mr-2" />
          Entrada
        </Button>

        <Button
          onClick={handleLunchOut}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-amber-900/50 disabled:opacity-50"
        >
          <Coffee className="h-5 w-5 mr-2" />
          Saída Almoço
        </Button>

        <Button
          onClick={handleLunchReturn}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-blue-900/50 disabled:opacity-50"
        >
          <CheckCircle2 className="h-5 w-5 mr-2" />
          Retorno Almoço
        </Button>

        <Button
          onClick={handleClockOut}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-red-900/50 disabled:opacity-50"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Saída
        </Button>
      </div>

      {/* Informação de Geolocalização */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <MapPin className="h-3 w-3" />
          <span>Localização será registrada automaticamente</span>
        </div>
      </div>
    </div>
  );
}

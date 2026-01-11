# Exemplo de Integração - Página de Ponto com Supabase

⚠️ **ESTE É UM ARQUIVO DE EXEMPLO - CÓDIGO DE REFERÊNCIA**

## Como usar:
1. Copie o código abaixo
2. Cole em `src/modules/employee/pages/Ponto.tsx`
3. Substitua o código existente

## Código Completo:

```typescript
/**
 * Ponto - Portal do Funcionário
 * Integrado com Supabase
 */

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ✅ NOVOS IMPORTS - Supabase
import { 
  getCurrentUser, 
  registerTimeRecord,
  getTimeRecords
} from "@/lib/supabaseAuth";
import { TimeRecord, PunchType } from "@/lib/supabaseClient";

export default function EmployeePonto() {
  const { toast } = useToast();
  const [horaAtual, setHoraAtual] = useState(new Date());
  const [localizacao, setLocalizacao] = useState<{ lat: number; lng: number } | null>(null);
  const [carregando, setCarregando] = useState(false);
  
  // ✅ NOVO - Estado para registros do banco
  const [registrosHoje, setRegistrosHoje] = useState<TimeRecord[]>([]);
  const [ultimoPonto, setUltimoPonto] = useState<TimeRecord | null>(null);

  // Atualizar relógio
  useEffect(() => {
    const timer = setInterval(() => setHoraAtual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ NOVO - Carregar registros do dia
  useEffect(() => {
    carregarRegistrosHoje();
  }, []);

  // Obter localização GPS
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocalizacao({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
        }
      );
    }
  }, []);

  /**
   * ✅ NOVA FUNÇÃO - Carregar registros de hoje do banco
   */
  async function carregarRegistrosHoje() {
    try {
      const user = getCurrentUser();
      if (!user) return;

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      const amanha = new Date(hoje);
      amanha.setDate(amanha.getDate() + 1);

      const result = await getTimeRecords(user.id, hoje, amanha);
      
      if (result.success && result.data) {
        setRegistrosHoje(result.data);
        
        // Encontrar último ponto
        if (result.data.length > 0) {
          setUltimoPonto(result.data[0]); // Já vem ordenado DESC
        }
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
  }

  /**
   * ✅ FUNÇÃO MODIFICADA - Registrar ponto no Supabase
   */
  async function handleRegistrarPonto(tipo: PunchType) {
    setCarregando(true);
    
    try {
      const user = getCurrentUser();
      if (!user) {
        toast({
          title: "❌ Erro",
          description: "Usuário não autenticado",
          variant: "destructive"
        });
        return;
      }

      // Registrar no banco de dados
      const result = await registerTimeRecord(
        user.id,
        tipo,
        localizacao ? {
          latitude: localizacao.lat,
          longitude: localizacao.lng,
          name: `Lat: ${localizacao.lat.toFixed(6)}, Lng: ${localizacao.lng.toFixed(6)}`
        } : undefined,
        `Registro via aplicativo - ${tipo}`
      );

      if (result.success) {
        toast({
          title: "✅ Ponto Registrado!",
          description: `${tipo} registrado às ${horaAtual.toLocaleTimeString()}`,
        });

        // Recarregar registros
        await carregarRegistrosHoje();
      } else {
        toast({
          title: "❌ Erro ao registrar",
          description: result.error || "Tente novamente",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao registrar ponto:', error);
      toast({
        title: "❌ Erro inesperado",
        description: "Não foi possível registrar o ponto",
        variant: "destructive"
      });
    } finally {
      setCarregando(false);
    }
  }

  /**
   * ✅ NOVA FUNÇÃO - Determinar próximo tipo de ponto
   */
  function getProximoPonto(): PunchType {
    if (!ultimoPonto) return 'ENTRADA';
    
    switch (ultimoPonto.punch_type) {
      case 'ENTRADA': return 'INTERVALO';
      case 'INTERVALO': return 'RETORNO';
      case 'RETORNO': return 'SAIDA';
      case 'SAIDA': return 'ENTRADA';
      default: return 'ENTRADA';
    }
  }

  /**
   * ✅ NOVA FUNÇÃO - Verificar se pode registrar
   */
  function podeRegistrar(tipo: PunchType): boolean {
    const proximo = getProximoPonto();
    return tipo === proximo;
  }

  const formatarHora = (data: Date) => {
    return data.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatarData = (data: Date) => {
    return data.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AppLayout title="Registro de Ponto" subtitle="Registre sua entrada, saída e intervalos">
      <div className="space-y-6 max-w-4xl mx-auto">
        
        {/* Relógio Digital */}
        <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-950/90 backdrop-blur-md border border-blue-500/50">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-4">
              <Clock className="h-16 w-16 text-blue-400 mx-auto" />
              <div className="text-6xl font-bold text-white tabular-nums">
                {formatarHora(horaAtual)}
              </div>
              <div className="text-slate-300 text-lg">
                {formatarData(horaAtual)}
              </div>
              {localizacao && (
                <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                  <MapPin className="h-4 w-4" />
                  GPS: {localizacao.lat.toFixed(6)}, {localizacao.lng.toFixed(6)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ✅ NOVO - Resumo do Dia */}
        {registrosHoje.length > 0 && (
          <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-950/90 backdrop-blur-md border border-emerald-500/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-400" />
                Registros de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {registrosHoje.map((registro) => (
                  <div 
                    key={registro.id}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                  >
                    <div>
                      <div className="text-white font-semibold">{registro.punch_type}</div>
                      <div className="text-slate-400 text-sm">{registro.location_name}</div>
                    </div>
                    <div className="text-white font-mono">
                      {new Date(registro.punch_time).toLocaleTimeString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botões de Registro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => handleRegistrarPonto('ENTRADA')}
            disabled={carregando || !podeRegistrar('ENTRADA')}
            className="h-24 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
          >
            Entrada
          </Button>

          <Button
            onClick={() => handleRegistrarPonto('INTERVALO')}
            disabled={carregando || !podeRegistrar('INTERVALO')}
            className="h-24 text-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50"
          >
            Intervalo
          </Button>

          <Button
            onClick={() => handleRegistrarPonto('RETORNO')}
            disabled={carregando || !podeRegistrar('RETORNO')}
            className="h-24 text-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50"
          >
            Retorno
          </Button>

          <Button
            onClick={() => handleRegistrarPonto('SAIDA')}
            disabled={carregando || !podeRegistrar('SAIDA')}
            className="h-24 text-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:opacity-50"
          >
            Saída
          </Button>
        </div>

        {/* Indicador de Próximo Ponto */}
        <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-950/90 backdrop-blur-md border border-violet-500/50">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-slate-400 text-sm">Próximo registro esperado:</div>
              <div className="text-white text-xl font-bold mt-1">{getProximoPonto()}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
```

## Observações:

### Principais Mudanças:

1. **Novos Imports** - Supabase
   - `getCurrentUser`, `registerTimeRecord`, `getTimeRecords`
   - `TimeRecord`, `PunchType` types

2. **Estados Adicionados**
   - `registrosHoje` - Lista de registros do banco
   - `ultimoPonto` - Último registro para determinar próximo tipo

3. **Função `carregarRegistrosHoje()`**
   - Busca registros do dia atual do banco
   - Atualiza estado com dados reais

4. **Função `handleRegistrarPonto()` Modificada**
   - Registra no banco via `registerTimeRecord()`
   - Inclui GPS e observações
   - Recarrega lista após registro

5. **Novas Funções de Validação**
   - `getProximoPonto()` - Determina próximo tipo baseado no último
   - `podeRegistrar()` - Habilita/desabilita botões corretamente

6. **UI Aprimorada**
   - Card mostrando registros do dia
   - Indicador do próximo ponto esperado
   - Botões desabilitados quando fora de sequência

### Para Produção:

- Configure GPS real
- Adicione upload de foto
- Implemente validação de localização
- Configure notificações push

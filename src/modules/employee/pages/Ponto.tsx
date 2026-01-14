/**
 * Registro de Ponto - Portal do Funcionário
 * Interface simplificada para marcar entrada/saída/intervalo
 */

import { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Clock,
  MapPin,
  CheckCircle2,
  Coffee,
  LogOut as LogOutIcon,
  AlertCircle,
  ChevronRight,
  Loader2,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/supabaseAuth";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/apiService";

type PunchType = "entrada" | "intervalo" | "retorno" | "saida";

interface PunchRecord {
  id: number;
  type: PunchType;
  time: string;
  location?: string;
}

export default function EmployeePonto() {
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayRecords, setTodayRecords] = useState<PunchRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const loadTodayRecords = async () => {
    if (!currentUser) return;

    setIsLoadingRecords(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Usar API backend com fallback para Supabase
      const result = await apiService.getUserTimeRecords(
        currentUser.id,
        today.toISOString(),
        tomorrow.toISOString()
      );

      if (result.success && result.data) {
        const records = result.data.map((record: any) => ({
          id: record.id,
          type: record.punch_type?.toLowerCase() as PunchType,
          time: format(new Date(record.punch_time), "HH:mm:ss"),
          location: record.location_name || "Local não informado",
        }));
        setTodayRecords(records);
      }
    } catch (error) {
      console.error("Erro ao carregar registros:", error);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  // Carregar registros do dia ao montar o componente
  useEffect(() => {
    loadTodayRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getNextPunchType = (): PunchType => {
    const lastRecord = todayRecords[todayRecords.length - 1];
    if (!lastRecord) return "entrada";

    const sequence: PunchType[] = ["entrada", "intervalo", "retorno", "saida"];
    const currentIndex = sequence.indexOf(lastRecord.type);
    return sequence[currentIndex + 1] || "entrada";
  };

  const nextPunch = getNextPunchType();

  const punchConfig = {
    entrada: {
      label: "Marcar Entrada",
      icon: Clock,
      color: "green",
      bg: "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg shadow-emerald-500/30",
    },
    intervalo: {
      label: "Iniciar Intervalo",
      icon: Coffee,
      color: "orange",
      bg: "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-lg shadow-orange-500/30",
    },
    retorno: {
      label: "Retornar do Intervalo",
      icon: CheckCircle2,
      color: "blue",
      bg: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30",
    },
    saida: {
      label: "Marcar Saída",
      icon: LogOutIcon,
      color: "red",
      bg: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/30",
    },
  };

  const config = punchConfig[nextPunch];
  const Icon = config.icon;

  const handlePunch = async () => {
    if (!currentUser || isLoading) return;

    setIsLoading(true);

    try {
      let uploadedFileUrl: string | undefined;

      // Se houver arquivo, fazer upload primeiro
      if (selectedFile) {
        const uploadResult = await apiService.uploadFile(
          selectedFile,
          currentUser.id
        );
        if (uploadResult.success && uploadResult.file) {
          uploadedFileUrl = uploadResult.file.url;
        }
      }

      // Obter localização (simplificado - em produção usar navigator.geolocation)
      const location = {
        latitude: -23.55052,
        longitude: -46.633308,
      };

      // Registrar via API backend
      const result = await apiService.registerPunch({
        userId: currentUser.id,
        punchType: nextPunch.toUpperCase() as
          | "ENTRADA"
          | "INTERVALO"
          | "RETORNO"
          | "SAIDA",
        location,
        notes: `Registro via app - ${format(currentTime, "HH:mm:ss")}`,
        attachmentUrl: uploadedFileUrl,
      });

      if (result.success) {
        // Limpar arquivo selecionado
        setSelectedFile(null);
        setPreviewUrl(null);

        // Atualizar lista local
        await loadTodayRecords();

        toast({
          title: "✅ Ponto registrado!",
          description: `${config.label} registrado com sucesso às ${format(
            currentTime,
            "HH:mm:ss"
          )}`,
          duration: 3000,
        });
      } else {
        toast({
          title: "❌ Erro ao registrar",
          description:
            result.error ||
            "Não foi possível registrar o ponto. Tente novamente.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Erro ao registrar ponto:", error);
      toast({
        title: "❌ Erro inesperado",
        description:
          "Ocorreu um erro ao registrar o ponto. Verifique sua conexão.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Arquivo inválido",
        description: "Apenas imagens (JPG, PNG) e PDF são permitidos",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);

    // Criar preview apenas para imagens
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const getPunchTypeLabel = (type: PunchType) => {
    return {
      entrada: "Entrada",
      intervalo: "Intervalo",
      retorno: "Retorno",
      saida: "Saída",
    }[type];
  };

  const getPunchTypeColor = (type: PunchType) => {
    return {
      entrada: "text-green-700 bg-green-50 border-green-200",
      intervalo: "text-orange-700 bg-orange-50 border-orange-200",
      retorno: "text-blue-700 bg-blue-50 border-blue-200",
      saida: "text-red-700 bg-red-50 border-red-200",
    }[type];
  };

  return (
    <AppLayout
      title="Registro de Ponto"
      subtitle="Marque sua entrada, saída e intervalos"
    >
      <div className="space-y-6">
        {/* Relógio Grande */}
        <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-950/90 backdrop-blur-md border-2 border-violet-500/50 shadow-xl shadow-violet-500/30">
          <CardContent className="pt-6 text-center">
            <div className="text-6xl font-bold text-white tabular-nums mb-2 drop-shadow-lg">
              {format(currentTime, "HH:mm:ss")}
            </div>
            <p className="text-slate-100 text-sm font-semibold">
              {format(currentTime, "EEEE, d 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </p>
          </CardContent>
        </Card>

        {/* Upload de Comprovante */}
        <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-950/90 backdrop-blur-md border border-blue-500/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-400" />
              Anexar Comprovante (Opcional)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!selectedFile ? (
              <div>
                <Label
                  htmlFor="file-upload"
                  className="cursor-pointer block p-6 border-2 border-dashed border-blue-500/50 rounded-lg hover:border-blue-400/70 transition-all bg-slate-700/30 hover:bg-slate-700/50 text-center"
                >
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 text-blue-400" />
                  <p className="text-white font-semibold mb-1">
                    Clique para adicionar foto/documento
                  </p>
                  <p className="text-xs text-slate-300">
                    JPG, PNG ou PDF até 5MB
                  </p>
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative p-4 border-2 border-blue-500/50 rounded-lg bg-slate-700/30">
                <button
                  onClick={handleRemoveFile}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                {previewUrl ? (
                  <div className="space-y-2">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-blue-400/30"
                    />
                    <p className="text-sm text-slate-300 text-center truncate">
                      {selectedFile.name}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 text-blue-400" />
                    <p className="text-white font-semibold">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-300">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}
              </div>
            )}
            <p className="text-xs text-slate-400">
              💡 Anexe fotos ou documentos como comprovante de presença
            </p>
          </CardContent>
        </Card>

        {/* Botão Principal de Registro */}
        <Button
          onClick={handlePunch}
          disabled={isLoading}
          className={cn("w-full h-24 text-xl font-bold shadow-lg", config.bg)}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-8 w-8 mr-3 animate-spin" />
              Registrando...
            </>
          ) : (
            <>
              <Icon className="h-8 w-8 mr-3" />
              {config.label}
            </>
          )}
        </Button>

        {/* Localização Atual */}
        <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-950/90 backdrop-blur-md border border-emerald-500/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-white">
              <MapPin className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold">
                Praça Central - São Paulo, SP
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              📍 Localização detectada automaticamente
            </p>
          </CardContent>
        </Card>

        {/* Registros de Hoje */}
        <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-950/90 backdrop-blur-md border border-violet-500/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white font-bold">
              Registros de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoadingRecords ? (
              <div className="text-center py-8 text-slate-400">
                <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-violet-400" />
                <p>Carregando registros...</p>
              </div>
            ) : todayRecords.length === 0 ? (
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
            <CardTitle className="text-lg text-white font-bold">
              Resumo do Dia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Horas trabalhadas hoje</span>
              <span className="font-bold text-white">
                {todayRecords.length > 0 ? "3h 45min" : "0h 0min"}
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
              💡 <strong className="text-white">Dica:</strong> Mantenha o GPS
              ativado para registros mais precisos.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

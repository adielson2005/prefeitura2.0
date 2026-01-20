/**
 * Notificações - Portal do Funcionário
 * Central de notificações com filtros e ações
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { EmployeeLayout } from "../layouts/EmployeeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Calendar,
  AlertTriangle,
  Info,
  Trash2,
  Filter,
  ChevronDown,
  Volume2,
  VolumeX,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { apiService } from "@/lib/apiService";
import { getCurrentUser } from "@/lib/secureAuth";

interface Notification {
  id: string;
  type: "ponto" | "escala" | "sistema" | "alerta";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: "low" | "medium" | "high";
}

export default function EmployeeNotificacoes() {
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const [filter, setFilter] = useState<
    "all" | "unread" | "ponto" | "escala" | "sistema" | "alerta"
  >("all");
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem("notification-sound-enabled");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isLoading, setIsLoading] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const previousUnreadCountRef = useRef<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Carregar notificações da API
  useEffect(() => {
    const loadNotifications = async () => {
      if (!currentUser) return;

      setIsLoading(true);
      try {
        const result = await apiService.getNotifications(currentUser.id);

        if (result.success && result.data) {
          const formattedNotifications = result.data.map((n: any) => ({
            id: n.id,
            type: mapNotificationType(n.type),
            title: n.title,
            message: n.message,
            timestamp: new Date(n.created_at),
            read: n.read,
            priority: mapNotificationPriority(n.type),
          }));
          setNotifications(formattedNotifications);
        }
      } catch (error) {
        console.error("Erro ao carregar notificações:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, [currentUser]);

  const mapNotificationType = (type: string): Notification["type"] => {
    const typeMap: Record<string, Notification["type"]> = {
      INFO: "sistema",
      WARNING: "alerta",
      ALERT: "alerta",
      SUCCESS: "ponto",
    };
    return typeMap[type] || "sistema";
  };

  const mapNotificationPriority = (type: string): Notification["priority"] => {
    const priorityMap: Record<string, Notification["priority"]> = {
      INFO: "low",
      WARNING: "medium",
      ALERT: "high",
      SUCCESS: "low",
    };
    return priorityMap[type] || "low";
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    const icons = {
      ponto: Clock,
      escala: Calendar,
      sistema: Info,
      alerta: AlertTriangle,
    };
    return icons[type];
  };

  const getNotificationColor = (
    type: Notification["type"],
    priority: Notification["priority"]
  ) => {
    if (priority === "high") {
      return "border-red-500/50 bg-red-500/10";
    }

    const colors = {
      ponto: "border-blue-500/50 bg-blue-500/10",
      escala: "border-purple-500/50 bg-purple-500/10",
      sistema: "border-slate-500/50 bg-slate-500/10",
      alerta: "border-amber-500/50 bg-amber-500/10",
    };
    return colors[type];
  };

  const getIconColor = (
    type: Notification["type"],
    priority: Notification["priority"]
  ) => {
    if (priority === "high") return "text-red-400";

    const colors = {
      ponto: "text-blue-400",
      escala: "text-purple-400",
      sistema: "text-slate-400",
      alerta: "text-amber-400",
    };
    return colors[type];
  };

  // Função para tocar som de notificação
  const playNotificationSound = useCallback(() => {
    if (!soundEnabled) return;

    try {
      // Inicializa o AudioContext se ainda não foi criado
      if (!audioContextRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext: typeof AudioContext;
            }
          ).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }

      const audioContext = audioContextRef.current;
      const currentTime = audioContext.currentTime;

      // Primeiro tom (profissional e sério)
      const oscillator1 = audioContext.createOscillator();
      const gainNode1 = audioContext.createGain();

      oscillator1.connect(gainNode1);
      gainNode1.connect(audioContext.destination);

      oscillator1.type = "sine";
      oscillator1.frequency.setValueAtTime(587.33, currentTime); // Nota D5 (Ré)

      // Volume mais alto e sustentado
      gainNode1.gain.setValueAtTime(0, currentTime);
      gainNode1.gain.linearRampToValueAtTime(0.6, currentTime + 0.02); // Ataque rápido e alto
      gainNode1.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.25); // Sustentação

      oscillator1.start(currentTime);
      oscillator1.stop(currentTime + 0.25);

      // Segundo tom (confirmação - padrão de sistema corporativo)
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();

      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);

      oscillator2.type = "sine";
      oscillator2.frequency.setValueAtTime(493.88, currentTime + 0.15); // Nota B4 (Si) - tom mais grave

      // Volume alto e claro
      gainNode2.gain.setValueAtTime(0, currentTime + 0.15);
      gainNode2.gain.linearRampToValueAtTime(0.65, currentTime + 0.17); // Volume alto
      gainNode2.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.5); // Decaimento suave

      oscillator2.start(currentTime + 0.15);
      oscillator2.stop(currentTime + 0.5);
    } catch (error) {
      console.error("Erro ao reproduzir som de notificação:", error);
    }
  }, [soundEnabled]);

  // Efeito para detectar novas notificações e tocar som
  useEffect(() => {
    const currentUnreadCount = notifications.filter((n) => !n.read).length;

    // Toca som apenas se houver aumento de notificações não lidas
    if (
      currentUnreadCount > previousUnreadCountRef.current &&
      previousUnreadCountRef.current > 0
    ) {
      playNotificationSound();
    }

    previousUnreadCountRef.current = currentUnreadCount;
  }, [notifications, playNotificationSound]);

  // Salva preferência de som
  useEffect(() => {
    localStorage.setItem(
      "notification-sound-enabled",
      JSON.stringify(soundEnabled)
    );
  }, [soundEnabled]);

  const markAsRead = async (id: string) => {
    try {
      const result = await apiService.markNotificationAsRead(id);

      if (result.success) {
        const updatedNotifications = notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        );
        setNotifications(updatedNotifications);

        // Disparar evento para atualizar o contador no header
        window.dispatchEvent(new Event("notificationsUpdated"));

        toast({
          title: "✓ Marcada como lida",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Erro ao marcar notificação:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser) return;

    try {
      const result = await apiService.markAllNotificationsAsRead(
        currentUser.id
      );

      if (result.success) {
        setNotifications(notifications.map((n) => ({ ...n, read: true })));

        // Disparar evento para atualizar o contador no header
        window.dispatchEvent(new Event("notificationsUpdated"));

        toast({
          title: "✓ Todas marcadas como lidas",
          description: `${unreadCount} notificações foram marcadas.`,
        });
      }
    } catch (error) {
      console.error("Erro ao marcar todas:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const result = await apiService.deleteNotification(id);

      if (result.success) {
        setNotifications(notifications.filter((n) => n.id !== id));

        // Disparar evento para atualizar o contador no header
        window.dispatchEvent(new Event("notificationsUpdated"));

        toast({
          title: "🗑️ Notificação excluída",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Erro ao excluir notificação:", error);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "all") return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <EmployeeLayout title="Notificações" showNotifications={false}>
      <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header com Stats */}
        <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-950/90 backdrop-blur-md border-violet-500/50">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 truncate">
                  Central de Notificações
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  {unreadCount > 0 ? (
                    <>
                      Você tem{" "}
                      <span className="font-semibold text-violet-400">
                        {unreadCount}
                      </span>{" "}
                      notificação(ões) não lida(s)
                    </>
                  ) : (
                    "Todas as notificações foram lidas"
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {/* Botão de Som */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={cn(
                    "h-8 w-8 sm:h-10 sm:w-10 rounded-full transition-colors",
                    soundEnabled
                      ? "text-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
                      : "text-slate-500 hover:bg-slate-700/50 hover:text-slate-400"
                  )}
                  title={soundEnabled ? "Som ativado" : "Som desativado"}
                >
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </Button>

                {/* Ícone do Sino */}
                <div className="relative">
                  <Bell className="h-10 w-10 sm:h-12 sm:w-12 text-violet-400" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtros */}
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardHeader className="p-4 sm:p-5 md:p-6 pb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <CardTitle className="text-base sm:text-lg md:text-xl text-white flex items-center gap-2">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 flex-shrink-0" />
                Filtros
              </CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 text-xs sm:text-sm h-8 sm:h-9"
                >
                  <CheckCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">
                    Marcar todas como lidas
                  </span>
                  <span className="sm:hidden">Marcar lidas</span>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className={
                  filter === "all"
                    ? "bg-violet-600 hover:bg-violet-700"
                    : "bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50"
                }
              >
                Todas ({notifications.length})
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unread")}
                className={
                  filter === "unread"
                    ? "bg-violet-600 hover:bg-violet-700"
                    : "bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50"
                }
              >
                Não lidas ({unreadCount})
              </Button>
              <Button
                variant={filter === "ponto" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("ponto")}
                className={
                  filter === "ponto"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50"
                }
              >
                <Clock className="h-3 w-3 mr-1" />
                Ponto ({notifications.filter((n) => n.type === "ponto").length})
              </Button>
              <Button
                variant={filter === "escala" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("escala")}
                className={
                  filter === "escala"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50"
                }
              >
                <Calendar className="h-3 w-3 mr-1" />
                Escala (
                {notifications.filter((n) => n.type === "escala").length})
              </Button>
              <Button
                variant={filter === "alerta" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("alerta")}
                className={
                  filter === "alerta"
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50"
                }
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Alertas (
                {notifications.filter((n) => n.type === "alerta").length})
              </Button>
              <Button
                variant={filter === "sistema" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("sistema")}
                className={
                  filter === "sistema"
                    ? "bg-slate-600 hover:bg-slate-700"
                    : "bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50"
                }
              >
                <Info className="h-3 w-3 mr-1" />
                Sistema (
                {notifications.filter((n) => n.type === "sistema").length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Notificações */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="bg-slate-800/90 border-slate-700/50">
              <CardContent className="py-12 text-center">
                <Bell className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Nenhuma notificação
                </h3>
                <p className="text-slate-400">
                  {filter === "unread"
                    ? "Você não tem notificações não lidas"
                    : "Não há notificações nesta categoria"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const iconColor = getIconColor(
                notification.type,
                notification.priority
              );

              return (
                <Card
                  key={notification.id}
                  className={cn(
                    "bg-slate-800/90 border transition-all hover:border-slate-600",
                    getNotificationColor(
                      notification.type,
                      notification.priority
                    ),
                    !notification.read && "shadow-lg"
                  )}
                >
                  <CardContent className="p-3 sm:p-4 md:p-5">
                    <div className="flex gap-2 sm:gap-3 md:gap-4">
                      {/* Ícone */}
                      <div
                        className={cn(
                          "flex-shrink-0 mt-0.5 sm:mt-1",
                          iconColor
                        )}
                      >
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">
                          <h4
                            className={cn(
                              "font-semibold text-sm sm:text-base",
                              notification.read
                                ? "text-slate-300"
                                : "text-white"
                            )}
                          >
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-violet-500 rounded-full animate-pulse" />
                            )}
                          </h4>
                          {notification.priority === "high" && (
                            <Badge
                              variant="destructive"
                              className="text-[10px] sm:text-xs flex-shrink-0"
                            >
                              Urgente
                            </Badge>
                          )}
                        </div>

                        <p
                          className={cn(
                            "text-xs sm:text-sm mb-2 sm:mb-3",
                            notification.read
                              ? "text-slate-400"
                              : "text-slate-200"
                          )}
                        >
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-slate-500">
                            {formatDistanceToNow(notification.timestamp, {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </span>

                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-green-400 hover:text-green-300 hover:bg-green-500/10 h-8"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Marcar como lida
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Informações */}
        {filteredNotifications.length > 0 && (
          <Card className="bg-slate-800/90 border-slate-700/50">
            <CardContent className="pt-4">
              <p className="text-sm text-slate-400 text-center">
                💡 <span className="text-white font-semibold">Dica:</span>{" "}
                Configure suas preferências de notificação em{" "}
                <button
                  onClick={() =>
                    (window.location.href = "/funcionario/configuracoes")
                  }
                  className="text-violet-400 hover:text-violet-300 underline"
                >
                  Configurações
                </button>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </EmployeeLayout>
  );
}

import { Bell, BellOff, Check, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { getCurrentUser } from "@/lib/secureAuth";
import { useState } from "react";
import { apiService } from "@/lib/apiService";
import { useToast } from "@/hooks/use-toast";

export function PushNotificationSettings() {
  const currentUser = getCurrentUser();
  const { toast } = useToast();
  const {
    supported,
    permission,
    subscription,
    loading,
    error,
    subscribe,
    unsubscribe,
  } = usePushNotifications(currentUser?.id);

  const [testing, setTesting] = useState(false);

  const handleEnable = async () => {
    try {
      await subscribe();
      toast({
        title: "✅ Notificações ativadas",
        description: "Você receberá notificações push do sistema.",
      });
    } catch (error) {
      toast({
        title: "❌ Erro ao ativar",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleDisable = async () => {
    try {
      await unsubscribe();
      toast({
        title: "🔕 Notificações desativadas",
        description: "Você não receberá mais notificações push.",
      });
    } catch (error) {
      toast({
        title: "❌ Erro ao desativar",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleTest = async () => {
    if (!currentUser?.id) return;

    setTesting(true);
    try {
      const response = await apiService.testPushNotification(currentUser.id);
      if (response.success) {
        toast({
          title: "🔔 Notificação de teste enviada",
          description: "Verifique se recebeu a notificação.",
        });
      } else {
        throw new Error(response.error || "Erro ao enviar");
      }
    } catch (error) {
      toast({
        title: "❌ Erro ao enviar teste",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  if (!supported) {
    return (
      <Alert variant="destructive">
        <X className="h-4 w-4" />
        <AlertDescription>
          Seu navegador não suporta notificações push. Use Chrome, Firefox, Edge
          ou Safari atualizado.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notificações Push
        </CardTitle>
        <CardDescription>
          Receba alertas em tempo real sobre pontos registrados, aprovações e
          outras atualizações
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            {subscription ? (
              <>
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                <div>
                  <p className="font-medium">Notificações Ativadas</p>
                  <p className="text-sm text-muted-foreground">
                    Você está recebendo notificações push
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="h-3 w-3 bg-gray-400 rounded-full" />
                <div>
                  <p className="font-medium">Notificações Desativadas</p>
                  <p className="text-sm text-muted-foreground">
                    Ative para receber alertas em tempo real
                  </p>
                </div>
              </>
            )}
          </div>

          {subscription ? (
            <Button
              onClick={handleDisable}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <BellOff className="h-4 w-4 mr-2" />
              Desativar
            </Button>
          ) : (
            <Button
              onClick={handleEnable}
              disabled={loading || permission === "denied"}
              size="sm"
            >
              <Bell className="h-4 w-4 mr-2" />
              Ativar
            </Button>
          )}
        </div>

        {/* Permissão negada */}
        {permission === "denied" && (
          <Alert variant="destructive">
            <X className="h-4 w-4" />
            <AlertDescription>
              Você bloqueou as notificações. Para ativar, permita notificações
              nas configurações do navegador e recarregue a página.
            </AlertDescription>
          </Alert>
        )}

        {/* Erro */}
        {error && (
          <Alert variant="destructive">
            <X className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Botão de teste */}
        {subscription && (
          <div className="pt-4 border-t">
            <Button
              onClick={handleTest}
              disabled={testing}
              variant="secondary"
              className="w-full"
            >
              {testing ? "Enviando..." : "🔔 Testar Notificação"}
            </Button>
          </div>
        )}

        {/* Informações adicionais */}
        <div className="text-xs text-muted-foreground space-y-2 pt-4 border-t">
          <p className="flex items-center gap-2">
            <Check className="h-3 w-3" />
            Notificações funcionam mesmo com o site fechado
          </p>
          <p className="flex items-center gap-2">
            <Check className="h-3 w-3" />
            Alertas sobre aprovações, rejeições e lembretes
          </p>
          <p className="flex items-center gap-2">
            <Check className="h-3 w-3" />
            Compatível com dispositivos móveis
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

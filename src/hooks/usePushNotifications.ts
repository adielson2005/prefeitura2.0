import { useState, useEffect, useCallback } from "react";
import { apiService } from "../lib/apiService";

export interface PushNotificationState {
  supported: boolean;
  permission: NotificationPermission;
  subscription: PushSubscription | null;
  loading: boolean;
  error: string | null;
}

export const usePushNotifications = (userId?: string) => {
  const [state, setState] = useState<PushNotificationState>({
    supported: false,
    permission: "default",
    subscription: null,
    loading: true,
    error: null,
  });

  // Verificar suporte e permissões
  useEffect(() => {
    const checkSupport = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setState((prev) => ({
          ...prev,
          supported: false,
          loading: false,
          error: "Notificações push não são suportadas neste navegador",
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        supported: true,
        permission: Notification.permission,
        loading: false,
      }));

      // Verificar se já tem subscription
      try {
        const registration = await navigator.serviceWorker.ready;
        const existingSubscription =
          await registration.pushManager.getSubscription();

        if (existingSubscription) {
          setState((prev) => ({
            ...prev,
            subscription: existingSubscription,
          }));
        }
      } catch (error) {
        console.error("Erro ao verificar subscription:", error);
      }
    };

    checkSupport();
  }, []);

  // Registrar Service Worker
  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        "/service-worker.js"
      );
      console.log("Service Worker registrado:", registration);
      return registration;
    } catch (error) {
      console.error("Erro ao registrar Service Worker:", error);
      throw error;
    }
  };

  // Solicitar permissão
  const requestPermission = useCallback(async () => {
    if (!state.supported) {
      throw new Error("Notificações push não suportadas");
    }

    try {
      const permission = await Notification.requestPermission();
      setState((prev) => ({ ...prev, permission }));

      if (permission !== "granted") {
        throw new Error("Permissão de notificação negada");
      }

      return permission;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao solicitar permissão";
      setState((prev) => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, [state.supported]);

  // Subscrever para notificações push
  const subscribe = useCallback(async () => {
    if (!userId) {
      throw new Error("userId é obrigatório para subscription");
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // Solicitar permissão se ainda não foi concedida
      if (state.permission !== "granted") {
        await requestPermission();
      }

      // Registrar Service Worker se necessário
      await registerServiceWorker();
      const registration = await navigator.serviceWorker.ready;

      // Buscar chave pública do servidor
      const { publicKey } = await apiService.getVapidPublicKey();

      // Criar subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      // Enviar subscription para o backend
      await apiService.subscribePush(userId, subscription);

      setState((prev) => ({
        ...prev,
        subscription,
        loading: false,
      }));

      return subscription;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar subscription";
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [userId, state.permission, requestPermission]);

  // Cancelar subscription
  const unsubscribe = useCallback(async () => {
    if (!state.subscription || !userId) {
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      await state.subscription.unsubscribe();
      await apiService.unsubscribePush(userId, state.subscription.endpoint);

      setState((prev) => ({
        ...prev,
        subscription: null,
        loading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao cancelar subscription";
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [state.subscription, userId]);

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
  };
};

// Função auxiliar para converter chave VAPID
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

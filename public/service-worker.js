// Service Worker para Push Notifications

// Listener para evento de push
self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push recebido:", event);

  let data = {
    title: "Nova Notificação",
    body: "Você tem uma nova notificação",
    icon: "/icon-192.png",
    badge: "/badge-72.png",
    data: { url: "/" },
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (error) {
      console.error("[Service Worker] Erro ao parsear dados do push:", error);
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/icon-192.png",
    badge: data.badge || "/badge-72.png",
    vibrate: [200, 100, 200],
    tag: data.tag || "notification",
    requireInteraction: false,
    data: data.data || { url: "/" },
    actions: data.actions || [],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Listener para clique na notificação
self.addEventListener("notificationclick", (event) => {
  console.log("[Service Worker] Notificação clicada:", event);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Verificar se já existe uma janela aberta com a URL
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }

        // Se não houver janela aberta, abrir uma nova
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Listener para fechamento da notificação
self.addEventListener("notificationclose", (event) => {
  console.log("[Service Worker] Notificação fechada:", event);
});

// Ativação do Service Worker
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Ativado");
  event.waitUntil(clients.claim());
});

// Instalação do Service Worker
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Instalado");
  self.skipWaiting();
});

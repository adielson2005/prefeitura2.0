import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Bell, AlertTriangle, CheckCircle2, Info, Trash2, Filter } from "lucide-react";

type Notification = { 
  id: string; 
  title: string; 
  body: string; 
  type?: 'alert' | 'success' | 'info';
  read?: boolean;
  timestamp?: string;
};

const SAMPLE: Notification[] = [
  { id: '1', title: 'Alerta de Atraso', body: 'João Oliveira chegou atrasado na Sede Principal', type: 'alert', read: false, timestamp: 'Agora' },
  { id: '2', title: 'Backup concluído', body: 'Backup diário concluído com sucesso', type: 'success', read: true, timestamp: 'Há 2 horas' },
  { id: '3', title: 'Nova escala', body: 'Escala de folga atualizada para Ana Costa', type: 'info', read: false, timestamp: 'Há 30 min' },
  { id: '4', title: 'Entrada registrada', body: 'Maria Santos entrou em Anexo I', type: 'success', read: true, timestamp: 'Há 1 hora' },
  { id: '5', title: 'Sistema em manutenção', body: 'Manutenção programada para amanhã às 22:00', type: 'info', read: false, timestamp: 'Há 4 horas' },
  { id: '6', title: 'Múltiplas ausências', body: 'Detectadas 3 ausências não justificadas hoje', type: 'alert', read: false, timestamp: 'Há 15 min' },
];

function readStored(): Notification[] {
  try {
    const raw = localStorage.getItem('notifications');
    if (!raw) {
      // Primeira vez: salvar dados de exemplo e retornar
      localStorage.setItem('notifications', JSON.stringify(SAMPLE));
      return SAMPLE;
    }
    return JSON.parse(raw) as Notification[];
  } catch {
    // Em caso de erro, salvar dados de exemplo
    localStorage.setItem('notifications', JSON.stringify(SAMPLE));
    return SAMPLE;
  }
}

export default function Notificacoes() {
  const [items, setItems] = useState<Notification[]>(() => readStored());
  const [filter, setFilter] = useState<'all' | 'unread' | 'alert' | 'success'>('all');

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(items));
  }, [items]);

  const markRead = (id: string) => {
    setItems((s) => s.map(i => i.id === id ? { ...i, read: true } : i));
  };

  const markAllRead = () => setItems((s) => s.map(i => ({ ...i, read: true })));

  const deleteNotification = (id: string) => {
    setItems((s) => s.filter(i => i.id !== id));
  };

  const deleteAll = () => {
    if (window.confirm('Deseja deletar todas as notificações?')) {
      setItems([]);
    }
  };

  const unreadCount = items.filter(i => !i.read).length;

  const filteredItems = items.filter(i => {
    if (filter === 'unread') return !i.read;
    if (filter === 'alert') return i.type === 'alert';
    if (filter === 'success') return i.type === 'success';
    return true;
  });

  const getIcon = (type?: string) => {
    switch(type) {
      case 'alert': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'success': return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      default: return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const getBgColor = (type?: string, read?: boolean) => {
    if (read) return 'bg-slate-900/30 border-slate-700/30';
    switch(type) {
      case 'alert': return 'bg-red-950/30 border-red-700/30';
      case 'success': return 'bg-emerald-950/30 border-emerald-700/30';
      default: return 'bg-blue-950/30 border-blue-700/30';
    }
  };

  return (
    <AppLayout title="Notificações" subtitle="Centro de notificações e alertas">
      <div className="max-w-4xl space-y-6">
        {/* Header com Stats */}
        <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-4 sm:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-600/20 border border-blue-500/50 flex items-center justify-center">
                <Bell className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total de notificações</p>
                <p className="text-2xl font-bold text-white">{items.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Badge className="bg-red-500/20 text-red-300 border border-red-500/50">
                  {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            className="text-xs sm:text-sm"
          >
            Todas ({items.length})
          </Button>
          <Button
            onClick={() => setFilter('unread')}
            variant={filter === 'unread' ? 'default' : 'outline'}
            className="text-xs sm:text-sm"
          >
            Não lidas ({unreadCount})
          </Button>
          <Button
            onClick={() => setFilter('alert')}
            variant={filter === 'alert' ? 'default' : 'outline'}
            className="text-xs sm:text-sm"
          >
            Alertas
          </Button>
          <Button
            onClick={() => setFilter('success')}
            variant={filter === 'success' ? 'default' : 'outline'}
            className="text-xs sm:text-sm"
          >
            Confirmações
          </Button>
        </div>

        {/* Ações */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={markAllRead}
            className="text-xs sm:text-sm px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
          >
            ✓ Marcar todas como lidas
          </Button>
          <Button
            onClick={deleteAll}
            variant="outline"
            className="text-xs sm:text-sm px-3 py-2 text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-500/50"
          >
            🗑️ Deletar tudo
          </Button>
        </div>

        {/* Lista de Notificações */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-slate-500 mx-auto mb-3 opacity-50" />
              <p className="text-slate-400 font-medium">Nenhuma notificação para exibir</p>
            </div>
          ) : (
            filteredItems.map(notification => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all hover:shadow-lg ${getBgColor(notification.type, notification.read)} flex justify-between items-start gap-4 group cursor-pointer`}
                onClick={() => {
                  if (!notification.read) {
                    markRead(notification.id);
                  }
                }}
              >
                <div className="flex gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-semibold text-white">{notification.title}</div>
                      {!notification.read && (
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 mt-1">{notification.body}</p>
                    <p className="text-xs text-slate-500 mt-2">{notification.timestamp}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  {!notification.read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markRead(notification.id)}
                      className="h-8 px-2 text-xs text-blue-400 hover:bg-blue-900/30 hover:text-blue-300"
                    >
                      Ler
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteNotification(notification.id)}
                    className="h-8 px-2 text-xs text-red-400 hover:bg-red-900/30 hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}

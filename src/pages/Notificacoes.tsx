import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

type Notification = { id: string; title: string; body: string; read?: boolean };

const SAMPLE: Notification[] = [
  { id: '1', title: 'Alerta de Atraso', body: 'João Oliveira chegou atrasado na Sede Principal', read: false },
  { id: '2', title: 'Backup concluído', body: 'Backup diário concluído com sucesso', read: true },
  { id: '3', title: 'Nova escala', body: 'Escala de folga atualizada para Ana Costa', read: false },
];

function readStored(): Notification[] {
  try {
    const raw = localStorage.getItem('notifications');
    if (!raw) return SAMPLE;
    return JSON.parse(raw) as Notification[];
  } catch {
    return SAMPLE;
  }
}

export default function Notificacoes() {
  const [items, setItems] = useState<Notification[]>(() => readStored());

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(items));
  }, [items]);

  const markRead = (id: string) => {
    setItems((s) => s.map(i => i.id === id ? { ...i, read: true } : i));
  };

  const markAll = () => setItems((s) => s.map(i => ({ ...i, read: true })));

  return (
    <AppLayout title="Notificações" subtitle="Centro de notificações">
      <div className="max-w-3xl space-y-4">
        <div className="flex justify-end"><Button onClick={markAll}>Marcar todas como lidas</Button></div>
        <div className="space-y-3">
          {items.map(i => (
            <div key={i.id} className={`p-4 rounded-lg border ${i.read ? 'bg-white/30' : 'bg-muted/60'} flex justify-between items-start`}>
              <div>
                <div className="font-semibold">{i.title}</div>
                <div className="text-sm text-muted-foreground">{i.body}</div>
              </div>
              {!i.read && <Button variant="ghost" onClick={() => markRead(i.id)}>Marcar lida</Button>}
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

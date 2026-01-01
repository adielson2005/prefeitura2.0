import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Seguranca() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  const handleChange = () => {
    if (!current || !next) return setMsg('Preencha os campos');
    if (next !== confirm) return setMsg('Confirmação não bate');
    // Simulação: só salva um flag
    localStorage.setItem('passwordChangedAt', Date.now().toString());
    setMsg('Senha alterada com sucesso');
    setCurrent(''); setNext(''); setConfirm('');
  };

  return (
    <AppLayout title="Segurança" subtitle="Senha e autenticação">
      <div className="max-w-2xl space-y-4">
        <div className="bg-card rounded-xl border border-border p-6">
          <label className="block text-sm font-medium text-foreground mb-2">Senha atual</label>
          <input value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full mb-3 input" />
          <label className="block text-sm font-medium text-foreground mb-2">Nova senha</label>
          <input value={next} onChange={(e) => setNext(e.target.value)} className="w-full mb-3 input" />
          <label className="block text-sm font-medium text-foreground mb-2">Confirmar nova senha</label>
          <input value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full mb-4 input" />
          <div className="flex items-center gap-3"><Button onClick={handleChange}>Alterar senha</Button>{msg && <span className="text-sm text-muted-foreground">{msg}</span>}</div>
        </div>
      </div>
    </AppLayout>
  );
}

import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Perfil() {
  const [name, setName] = useState( localStorage.getItem('userName') || 'Administrador' );
  const [email, setEmail] = useState( localStorage.getItem('userEmail') || 'administrador@prefeitura.gov.br' );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(t);
    }
  }, [saved]);

  const handleSave = () => {
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    setSaved(true);
  };

  return (
    <AppLayout title="Meu Perfil" subtitle="Gerencie seus dados">
      <div className="max-w-2xl space-y-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <label className="block text-sm font-medium text-foreground mb-2">Nome</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mb-4 input" />

          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-4 input" />

          <div className="flex items-center gap-3">
            <Button onClick={handleSave}>Salvar</Button>
            {saved && <span className="text-sm text-success">Salvo</span>}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

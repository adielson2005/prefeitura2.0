import { AppLayout } from "@/components/layout/AppLayout";
import { ProfessionalTable } from "@/components/professionals/ProfessionalTable";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { Shield, UserPlus, Filter, Download, UserCheck, CalendarOff, AlertTriangle } from "lucide-react";
import { useState } from "react";

const mockVigilantes = [
  { id: "1", name: "Maria Fernanda Costa", category: "VIGILANTE" as const, area: "Sede Principal", status: "EM_SERVICO" as const, schedule: "06:00 - 14:00", supervisor: "Carlos Eduardo" },
  { id: "2", name: "Ana Paula Santos", category: "VIGILANTE" as const, area: "Anexo I", status: "EM_SERVICO" as const, schedule: "14:00 - 22:00", supervisor: "Carlos Eduardo" },
  { id: "3", name: "Juliana Oliveira", category: "VIGILANTE" as const, area: "Anexo II", status: "EM_SERVICO" as const, schedule: "22:00 - 06:00", supervisor: "Patrícia Lima" },
  { id: "4", name: "Camila Rodrigues", category: "VIGILANTE" as const, area: "Praça Central", status: "FOLGA" as const, schedule: "06:00 - 14:00", supervisor: "Carlos Eduardo" },
  { id: "5", name: "Beatriz Almeida", category: "VIGILANTE" as const, area: "Escola Municipal", status: "EM_SERVICO" as const, schedule: "14:00 - 22:00", supervisor: "Patrícia Lima" },
  { id: "6", name: "Larissa Mendes", category: "VIGILANTE" as const, area: "Centro Esportivo", status: "ATRASADO" as const, schedule: "06:00 - 14:00", supervisor: "Carlos Eduardo" },
  { id: "7", name: "Priscila Gomes", category: "VIGILANTE" as const, area: "Sede Principal", status: "EM_SERVICO" as const, schedule: "22:00 - 06:00", supervisor: "Patrícia Lima" },
  { id: "8", name: "Vanessa Pereira", category: "VIGILANTE" as const, area: "Hospital Municipal", status: "EM_SERVICO" as const, schedule: "06:00 - 14:00", supervisor: "Carlos Eduardo" },
  { id: "9", name: "Cristiane Silva", category: "VIGILANTE" as const, area: "Biblioteca", status: "FOLGA" as const, schedule: "14:00 - 22:00", supervisor: "Patrícia Lima" },
  { id: "10", name: "Renata Lima", category: "VIGILANTE" as const, area: "Sede Principal", status: "EM_SERVICO" as const, schedule: "06:00 - 14:00", supervisor: "Carlos Eduardo" },
];

export default function Vigilantes() {
  const [vigilantes, setVigilantes] = useState(mockVigilantes);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [filterText, setFilterText] = useState('');

  const handleCreateVigilante = () => {
    if (!newName.trim()) return;
    const newVig = { id: String(vigilantes.length + 1), name: newName, category: "VIGILANTE" as const, area: "Sede Principal", status: "EM_SERVICO" as const, schedule: "06:00 - 14:00", supervisor: "Carlos Eduardo" };
    setVigilantes([...vigilantes, newVig]);
    setNewName('');
    setShowNewModal(false);
  };

  const handleExport = () => {
    const csv = vigilantes.map(v => `"${v.name}","${v.area}","${v.status}"`).join('\n');
    const blob = new Blob([`Nome,Área,Status\n${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vigilantes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredVigilantes = filterText ? vigilantes.filter(v => v.name.toLowerCase().includes(filterText.toLowerCase())) : vigilantes;

  return (
    <AppLayout 
      title="Vigilantes" 
      subtitle="Gestão de profissionais de segurança"
    >
      <div className="space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Total de Vigilantes"
            value={36}
            icon={Shield}
            variant="primary"
          />
          <MetricCard
            title="Em Serviço"
            value={28}
            subtitle="77.8% do efetivo"
            icon={UserCheck}
            variant="success"
          />
          <MetricCard
            title="De Folga"
            value={6}
            icon={CalendarOff}
            variant="warning"
          />
          <MetricCard
            title="Alertas"
            value={2}
            icon={AlertTriangle}
            variant="danger"
          />
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="institutional" onClick={() => setShowNewModal(true)}>
              <UserPlus className="h-4 w-4" />
              Novo Vigilante
            </Button>
            <Button variant="secondary" onClick={() => setShowFilterModal(true)}>
              <Filter className="h-4 w-4" />
              Filtrar
            </Button>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>

        {showNewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">Novo Vigilante</h3>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome" className="w-full px-3 py-2 border border-border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary/30" onKeyDown={(e) => e.key === 'Enter' && handleCreateVigilante()} />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowNewModal(false)}>Cancelar</Button>
                <Button onClick={handleCreateVigilante}>Criar</Button>
              </div>
            </div>
          </div>
        )}

        {showFilterModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">Filtrar</h3>
              <input value={filterText} onChange={(e) => setFilterText(e.target.value)} placeholder="Buscar por nome..." className="w-full px-3 py-2 border border-border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <p className="text-sm text-muted-foreground mb-4">Encontrados: {filteredVigilantes.length}</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => { setFilterText(''); setShowFilterModal(false); }}>Limpar</Button>
                <Button onClick={() => setShowFilterModal(false)}>Fechar</Button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <ProfessionalTable professionals={filteredVigilantes} />
      </div>
    </AppLayout>
  );
}

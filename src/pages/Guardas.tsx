import { AppLayout } from "@/components/layout/AppLayout";
import { ProfessionalTable } from "@/components/professionals/ProfessionalTable";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Filter, Download, UserCheck, CalendarOff, AlertTriangle } from "lucide-react";
import { useState } from "react";

const mockGuardas = [
  { id: "1", name: "Roberto Carlos Mendes", category: "GUARDA" as const, area: "Sede Principal", status: "EM_SERVICO" as const, schedule: "06:00 - 14:00", supervisor: "Marcos Antônio" },
  { id: "2", name: "Eduardo Silva Santos", category: "GUARDA" as const, area: "Praça da Liberdade", status: "EM_SERVICO" as const, schedule: "14:00 - 22:00", supervisor: "Marcos Antônio" },
  { id: "3", name: "Sérgio Luiz Costa", category: "GUARDA" as const, area: "Mercado Municipal", status: "EM_SERVICO" as const, schedule: "22:00 - 06:00", supervisor: "Fernanda Souza" },
  { id: "4", name: "Márcio Pereira Lima", category: "GUARDA" as const, area: "Terminal Rodoviário", status: "EM_SERVICO" as const, schedule: "06:00 - 14:00", supervisor: "Marcos Antônio" },
  { id: "5", name: "Claudio José Oliveira", category: "GUARDA" as const, area: "Parque Municipal", status: "FOLGA" as const, schedule: "14:00 - 22:00", supervisor: "Fernanda Souza" },
  { id: "6", name: "André Luiz Almeida", category: "GUARDA" as const, area: "Centro Histórico", status: "EM_SERVICO" as const, schedule: "06:00 - 14:00", supervisor: "Marcos Antônio" },
  { id: "7", name: "Fábio Ricardo Gomes", category: "GUARDA" as const, area: "Sede Principal", status: "ATRASADO" as const, schedule: "14:00 - 22:00", supervisor: "Fernanda Souza" },
  { id: "8", name: "Gilberto Santos Junior", category: "GUARDA" as const, area: "Escola Municipal", status: "EM_SERVICO" as const, schedule: "22:00 - 06:00", supervisor: "Marcos Antônio" },
  { id: "9", name: "Leandro Ferreira", category: "GUARDA" as const, area: "Hospital Municipal", status: "EM_SERVICO" as const, schedule: "06:00 - 14:00", supervisor: "Fernanda Souza" },
  { id: "10", name: "Thiago Henrique Rocha", category: "GUARDA" as const, area: "Centro Esportivo", status: "AUSENTE" as const, schedule: "14:00 - 22:00", supervisor: "Marcos Antônio" },
  { id: "11", name: "Wagner Luis Martins", category: "GUARDA" as const, area: "Praça Central", status: "EM_SERVICO" as const, schedule: "06:00 - 14:00", supervisor: "Fernanda Souza" },
  { id: "12", name: "Diego Augusto Lima", category: "GUARDA" as const, area: "Sede Principal", status: "FOLGA" as const, schedule: "22:00 - 06:00", supervisor: "Marcos Antônio" },
];

export default function Guardas() {
  const [guardas, setGuardas] = useState(mockGuardas);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [filterText, setFilterText] = useState('');

  const handleCreateGuarda = () => {
    if (!newName.trim()) return;
    const newG = { id: String(guardas.length + 1), name: newName, category: "GUARDA" as const, area: "Sede Principal", status: "EM_SERVICO" as const, schedule: "06:00 - 14:00", supervisor: "Marcos Antônio" };
    setGuardas([...guardas, newG]);
    setNewName('');
    setShowNewModal(false);
  };

  const handleExport = () => {
    const csv = guardas.map(g => `"${g.name}","${g.area}","${g.status}"`).join('\n');
    const blob = new Blob([`Nome,Área,Status\n${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guardas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredGuardas = filterText ? guardas.filter(g => g.name.toLowerCase().includes(filterText.toLowerCase())) : guardas;

  return (
    <AppLayout 
      title="Guardas" 
      subtitle="Gestão de guardas municipais"
    >
      <div className="space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Total de Guardas"
            value={48}
            icon={Users}
            variant="primary"
          />
          <MetricCard
            title="Em Serviço"
            value={40}
            subtitle="83.3% do efetivo"
            icon={UserCheck}
            variant="success"
          />
          <MetricCard
            title="De Folga"
            value={5}
            icon={CalendarOff}
            variant="warning"
          />
          <MetricCard
            title="Alertas"
            value={3}
            icon={AlertTriangle}
            variant="danger"
          />
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="institutional" onClick={() => setShowNewModal(true)}>
              <UserPlus className="h-4 w-4" />
              Novo Guarda
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
              <h3 className="text-lg font-semibold text-foreground mb-4">Novo Guarda</h3>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome" className="w-full px-3 py-2 border border-border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary/30" onKeyDown={(e) => e.key === 'Enter' && handleCreateGuarda()} />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowNewModal(false)}>Cancelar</Button>
                <Button onClick={handleCreateGuarda}>Criar</Button>
              </div>
            </div>
          </div>
        )}

        {showFilterModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">Filtrar</h3>
              <input value={filterText} onChange={(e) => setFilterText(e.target.value)} placeholder="Buscar por nome..." className="w-full px-3 py-2 border border-border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <p className="text-sm text-muted-foreground mb-4">Encontrados: {filteredGuardas.length}</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => { setFilterText(''); setShowFilterModal(false); }}>Limpar</Button>
                <Button onClick={() => setShowFilterModal(false)}>Fechar</Button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <ProfessionalTable professionals={filteredGuardas} />
      </div>
    </AppLayout>
  );
}

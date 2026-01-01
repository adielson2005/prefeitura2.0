import { AppLayout } from "@/components/layout/AppLayout";
import { ProfessionalTable } from "@/components/professionals/ProfessionalTable";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { Eye, UserPlus, Filter, Download, UserCheck, CalendarOff, AlertTriangle } from "lucide-react";
import { useState } from "react";

const mockVigias = [
  { id: "1", name: "Carlos Alberto Silva", category: "VIGIA" as const, area: "Sede Principal", status: "EM_SERVICO" as const, schedule: "06:00 - 14:00", supervisor: "Roberto Mendes" },
  { id: "2", name: "José Roberto Santos", category: "VIGIA" as const, area: "Anexo I", status: "EM_SERVICO" as const, schedule: "14:00 - 22:00", supervisor: "Ana Paula Costa" },
  { id: "3", name: "Francisco Lima", category: "VIGIA" as const, area: "Anexo II", status: "FOLGA" as const, schedule: "22:00 - 06:00", supervisor: "Roberto Mendes" },
  { id: "4", name: "Antônio Pereira", category: "VIGIA" as const, area: "Sede Principal", status: "ATRASADO" as const, schedule: "06:00 - 14:00", supervisor: "Ana Paula Costa" },
  { id: "5", name: "Marcos Oliveira", category: "VIGIA" as const, area: "Praça Central", status: "EM_SERVICO" as const, schedule: "14:00 - 22:00", supervisor: "Roberto Mendes" },
  { id: "6", name: "Paulo Henrique Costa", category: "VIGIA" as const, area: "Escola Municipal", status: "EM_SERVICO" as const, schedule: "06:00 - 14:00", supervisor: "Ana Paula Costa" },
  { id: "7", name: "Ricardo Almeida", category: "VIGIA" as const, area: "Centro Esportivo", status: "AUSENTE" as const, schedule: "14:00 - 22:00", supervisor: "Roberto Mendes" },
  { id: "8", name: "Fernando Gomes", category: "VIGIA" as const, area: "Sede Principal", status: "EM_SERVICO" as const, schedule: "22:00 - 06:00", supervisor: "Ana Paula Costa" },
];

export default function Vigias() {
  const [vigias, setVigias] = useState(mockVigias);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [filterText, setFilterText] = useState('');

  const handleCreateVigia = () => {
    if (!newName.trim()) return;
    const newVigia = { 
      id: String(vigias.length + 1), 
      name: newName, 
      category: "VIGIA" as const, 
      area: "Sede Principal", 
      status: "EM_SERVICO" as const, 
      schedule: "06:00 - 14:00", 
      supervisor: "Roberto Mendes" 
    };
    setVigias([...vigias, newVigia]);
    setNewName('');
    setShowNewModal(false);
  };

  const handleExport = () => {
    const csv = vigias.map(v => `"${v.name}","${v.area}","${v.status}","${v.schedule}"`).join('\n');
    const blob = new Blob([`Nome,Área,Status,Horário\n${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vigias_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredVigias = filterText ? vigias.filter(v => v.name.toLowerCase().includes(filterText.toLowerCase())) : vigias;

  return (
    <AppLayout 
      title="Vigias" 
      subtitle="Gestão de profissionais de vigilância"
    >
      <div className="space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Total de Vigias"
            value={24}
            icon={Eye}
            variant="primary"
          />
          <MetricCard
            title="Em Serviço"
            value={18}
            subtitle="75% do efetivo"
            icon={UserCheck}
            variant="success"
          />
          <MetricCard
            title="De Folga"
            value={4}
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
              Novo Vigia
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

        {/* Modal: Novo Vigia */}
        {showNewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">Novo Vigia</h3>
              <input 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                placeholder="Nome do vigia" 
                className="w-full px-3 py-2 border border-border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary/30"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateVigia()}
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowNewModal(false)}>Cancelar</Button>
                <Button onClick={handleCreateVigia}>Criar</Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Filtrar */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">Filtrar por Nome</h3>
              <input 
                value={filterText} 
                onChange={(e) => setFilterText(e.target.value)} 
                placeholder="Buscar por nome..." 
                className="w-full px-3 py-2 border border-border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <p className="text-sm text-muted-foreground mb-4">Encontrados: {filteredVigias.length} vigia(s)</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => { setFilterText(''); setShowFilterModal(false); }}>Limpar</Button>
                <Button onClick={() => setShowFilterModal(false)}>Fechar</Button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <ProfessionalTable professionals={filteredVigias} />
      </div>
    </AppLayout>
  );
}

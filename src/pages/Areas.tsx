import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { 
  Building2, 
  Plus, 
  Users, 
  MapPin,
  Edit2,
  MoreHorizontal,
  UserCog,
  Eye,
  Shield
} from "lucide-react";

const mockAreas = [
  { 
    id: "1", 
    name: "Sede Principal", 
    supervisor: "Roberto Mendes",
    professionals: { vigias: 6, vigilantes: 8, guardas: 12 },
    activeNow: 18,
    address: "Rua Principal, 100 - Centro"
  },
  { 
    id: "2", 
    name: "Anexo I", 
    supervisor: "Ana Paula Costa",
    professionals: { vigias: 4, vigilantes: 6, guardas: 8 },
    activeNow: 12,
    address: "Av. Secundária, 250 - Centro"
  },
  { 
    id: "3", 
    name: "Anexo II", 
    supervisor: "Carlos Eduardo",
    professionals: { vigias: 3, vigilantes: 4, guardas: 6 },
    activeNow: 9,
    address: "Rua das Flores, 50 - Jardim"
  },
  { 
    id: "4", 
    name: "Praça Central", 
    supervisor: "Patrícia Lima",
    professionals: { vigias: 2, vigilantes: 4, guardas: 6 },
    activeNow: 8,
    address: "Praça da República, s/n - Centro"
  },
  { 
    id: "5", 
    name: "Escola Municipal", 
    supervisor: "Marcos Antônio",
    professionals: { vigias: 3, vigilantes: 4, guardas: 4 },
    activeNow: 7,
    address: "Rua da Educação, 300 - Vila Nova"
  },
  { 
    id: "6", 
    name: "Hospital Municipal", 
    supervisor: "Fernanda Souza",
    professionals: { vigias: 4, vigilantes: 6, guardas: 8 },
    activeNow: 14,
    address: "Av. da Saúde, 500 - Centro"
  },
];

export default function Areas() {
  const [areas, setAreas] = useState(mockAreas);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');

  const handleCreateArea = () => {
    if (!newAreaName.trim()) return;
    const newArea = { id: String(areas.length + 1), name: newAreaName, supervisor: "Roberto Mendes", professionals: { vigias: 0, vigilantes: 0, guardas: 0 }, activeNow: 0, address: "Endereço não informado" };
    setAreas([...areas, newArea]);
    setNewAreaName('');
    setShowNewModal(false);
  };

  return (
    <AppLayout 
      title="Áreas" 
      subtitle="Gestão de áreas e locais de trabalho"
    >
      <div className="space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Total de Áreas"
            value={12}
            icon={Building2}
            variant="primary"
          />
          <MetricCard
            title="Profissionais Alocados"
            value={108}
            icon={Users}
            variant="success"
          />
          <MetricCard
            title="Em Serviço Agora"
            value={86}
            subtitle="79.6% do efetivo"
            icon={Users}
            variant="success"
          />
          <MetricCard
            title="Supervisores"
            value={8}
            icon={UserCog}
            variant="warning"
          />
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <h3 className="section-title">Todas as Áreas</h3>
          <Button variant="institutional" onClick={() => setShowNewModal(true)}>
            <Plus className="h-4 w-4" />
            Nova Área
          </Button>
        </div>

        {/* Areas Grid */}
        {showNewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">Nova Área</h3>
              <input value={newAreaName} onChange={(e) => setNewAreaName(e.target.value)} placeholder="Nome da área" className="w-full px-3 py-2 border border-border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary/30" onKeyDown={(e) => e.key === 'Enter' && handleCreateArea()} />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowNewModal(false)}>Cancelar</Button>
                <Button onClick={handleCreateArea}>Criar</Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {areas.map((area, index) => (
            <div
              key={area.id}
              className="card-institutional p-5 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{area.name}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {area.address}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>

              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">Supervisor</p>
                <p className="text-sm font-medium text-foreground">{area.supervisor}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 rounded-lg bg-chart-1/10">
                  <Eye className="h-4 w-4 text-chart-1 mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{area.professionals.vigias}</p>
                  <p className="text-[10px] text-muted-foreground">Vigias</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-chart-2/10">
                  <Shield className="h-4 w-4 text-chart-2 mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{area.professionals.vigilantes}</p>
                  <p className="text-[10px] text-muted-foreground">Vigilantes</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-chart-3/10">
                  <Users className="h-4 w-4 text-chart-3 mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{area.professionals.guardas}</p>
                  <p className="text-[10px] text-muted-foreground">Guardas</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-status-active animate-pulse-subtle" />
                  <span className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{area.activeNow}</span> em serviço
                  </span>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit2 className="h-3.5 w-3.5 mr-1" />
                  Editar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

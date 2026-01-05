import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { dataService } from "@/lib/dataService";
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

export default function Areas() {
  const [areas, setAreas] = useState(dataService.getAreas());
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingArea, setEditingArea] = useState<any>(null);
  const [newAreaName, setNewAreaName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newSupervisor, setNewSupervisor] = useState('Roberto Mendes');

  useEffect(() => {
    const unsubscribe = dataService.subscribe(() => {
      setAreas(dataService.getAreas());
    });
    return unsubscribe;
  }, []);

  const handleCreateArea = () => {
    if (!newAreaName.trim()) return;
    dataService.addArea({
      name: newAreaName,
      supervisor: newSupervisor,
      address: newAddress || "Endereço não informado"
    });
    setNewAreaName('');
    setNewAddress('');
    setNewSupervisor('Roberto Mendes');
    setShowNewModal(false);
  };

  const handleEditArea = (area: any) => {
    setEditingArea(area);
    setNewAreaName(area.name);
    setNewAddress(area.address);
    setNewSupervisor(area.supervisor);
    setShowEditModal(true);
  };

  const handleUpdateArea = () => {
    if (!newAreaName.trim() || !editingArea) return;
    dataService.updateArea(editingArea.id, {
      name: newAreaName,
      supervisor: newSupervisor,
      address: newAddress
    });
    setNewAreaName('');
    setNewAddress('');
    setNewSupervisor('Roberto Mendes');
    setEditingArea(null);
    setShowEditModal(false);
  };

  const getProfessionalsCountByArea = (areaName: string) => {
    const professionals = dataService.getProfessionals();
    const filtered = professionals.filter(p => p.area === areaName);
    const vigias = filtered.filter(p => p.category === 'VIGIA').length;
    const vigilantes = filtered.filter(p => p.category === 'VIGILANTE').length;
    const guardas = filtered.filter(p => p.category === 'GUARDA').length;
    const activeNow = filtered.filter(p => p.status === 'EM_SERVICO').length;
    return { vigias, vigilantes, guardas, activeNow };
  };

  const allProfessionals = dataService.getProfessionals();
  const totalAreas = areas.length;
  const totalAllocated = allProfessionals.length;

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
            value={totalAreas}
            icon={Building2}
            variant="primary"
          />
          <MetricCard
            title="Profissionais Alocados"
            value={totalAllocated}
            icon={Users}
            variant="success"
          />
          <MetricCard
            title="Em Serviço Agora"
            value={allProfessionals.filter(p => p.status === 'EM_SERVICO').length}
            subtitle={`${((allProfessionals.filter(p => p.status === 'EM_SERVICO').length / totalAllocated) * 100).toFixed(1)}% do efetivo`}
            icon={Users}
            variant="success"
          />
          <MetricCard
            title="Supervisores"
            value={[...new Set(areas.map(a => a.supervisor))].length}
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

        {/* Modal: Editar Área */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">Editar Área</h3>
              <input 
                value={newAreaName} 
                onChange={(e) => setNewAreaName(e.target.value)} 
                placeholder="Nome da área" 
                className="w-full px-3 py-2 border border-border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-primary/30" 
              />
              <input 
                value={newAddress} 
                onChange={(e) => setNewAddress(e.target.value)} 
                placeholder="Endereço" 
                className="w-full px-3 py-2 border border-border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-primary/30" 
              />
              <select 
                value={newSupervisor} 
                onChange={(e) => setNewSupervisor(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option>Roberto Mendes</option>
                <option>Ana Paula Costa</option>
                <option>Carlos Eduardo</option>
                <option>Patrícia Lima</option>
                <option>Marcos Antônio</option>
                <option>Fernanda Souza</option>
              </select>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => { setShowEditModal(false); setEditingArea(null); }}>Cancelar</Button>
                <Button onClick={handleUpdateArea}>Salvar</Button>
              </div>
            </div>
          </div>
        )}

        {/* Areas Grid */}
        {showNewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">Nova Área</h3>
              <input 
                value={newAreaName} 
                onChange={(e) => setNewAreaName(e.target.value)} 
                placeholder="Nome da área" 
                className="w-full px-3 py-2 border border-border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-primary/30" 
                onKeyDown={(e) => e.key === 'Enter' && handleCreateArea()} 
              />
              <input 
                value={newAddress} 
                onChange={(e) => setNewAddress(e.target.value)} 
                placeholder="Endereço" 
                className="w-full px-3 py-2 border border-border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-primary/30" 
              />
              <select 
                value={newSupervisor} 
                onChange={(e) => setNewSupervisor(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option>Roberto Mendes</option>
                <option>Ana Paula Costa</option>
                <option>Carlos Eduardo</option>
                <option>Patrícia Lima</option>
                <option>Marcos Antônio</option>
                <option>Fernanda Souza</option>
              </select>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowNewModal(false)}>Cancelar</Button>
                <Button onClick={handleCreateArea}>Criar</Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {areas.map((area, index) => {
            const counts = getProfessionalsCountByArea(area.name);
            return (
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
                    <p className="text-lg font-bold text-foreground">{counts.vigias}</p>
                    <p className="text-[10px] text-muted-foreground">Vigias</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-chart-2/10">
                    <Shield className="h-4 w-4 text-chart-2 mx-auto mb-1" />
                    <p className="text-lg font-bold text-foreground">{counts.vigilantes}</p>
                    <p className="text-[10px] text-muted-foreground">Vigilantes</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-chart-3/10">
                    <Users className="h-4 w-4 text-chart-3 mx-auto mb-1" />
                    <p className="text-lg font-bold text-foreground">{counts.guardas}</p>
                    <p className="text-[10px] text-muted-foreground">Guardas</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-status-active animate-pulse-subtle" />
                    <span className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{counts.activeNow}</span> em serviço
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEditArea(area)}>
                    <Edit2 className="h-3.5 w-3.5 mr-1" />
                    Editar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

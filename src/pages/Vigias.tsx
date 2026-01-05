import { AppLayout } from "@/components/layout/AppLayout";
import { ProfessionalTable } from "@/components/professionals/ProfessionalTable";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, UserPlus, Filter, Download, UserCheck, CalendarOff, AlertTriangle, X, User, MapPin, Clock, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { dataService } from "@/lib/dataService";

export default function Vigias() {
  const [vigias, setVigias] = useState(dataService.getProfessionalsByCategory('VIGIA'));
  const [showNewModal, setShowNewModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [newArea, setNewArea] = useState('Sede Principal');
  const [newStatus, setNewStatus] = useState<'EM_SERVICO' | 'FOLGA' | 'ATRASADO' | 'AUSENTE'>('EM_SERVICO');
  const [newSchedule, setNewSchedule] = useState('06:00 - 14:00');

  useEffect(() => {
    const unsubscribe = dataService.subscribe(() => {
      setVigias(dataService.getProfessionalsByCategory('VIGIA'));
    });
    return unsubscribe;
  }, []);

  const handleCreateVigia = async () => {
    if (!newName.trim()) return;
    await new Promise(r => setTimeout(r, 500));
    
    dataService.addProfessional({
      name: newName,
      category: "VIGIA",
      area: newArea,
      status: newStatus,
      schedule: newSchedule,
      supervisor: "Roberto Mendes"
    });
    
    setNewName('');
    setNewArea('Sede Principal');
    setNewStatus('EM_SERVICO');
    setNewSchedule('06:00 - 14:00');
    setShowNewModal(false);
  };

  const handleExport = async () => {
    setExportMessage("Exportando...");
    await new Promise(r => setTimeout(r, 800));
    
    const csv = filteredVigias.map(v => `"${v.name}","${v.area}","${v.status}","${v.schedule}"`).join('\n');
    const blob = new Blob([`Nome,Área,Status,Horário\n${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vigias_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    setExportMessage("✓ Exportado!");
    setTimeout(() => setExportMessage(null), 2000);
  };

  const getFilteredVigias = () => {
    let result = vigias;
    if (filterText) {
      result = result.filter(v => v.name.toLowerCase().includes(filterText.toLowerCase()));
    }
    if (filterStatus) {
      result = result.filter(v => v.status === filterStatus);
    }
    return result;
  };

  const filteredVigias = getFilteredVigias();
  const stats = {
    total: vigias.length,
    em_servico: vigias.filter(v => v.status === 'EM_SERVICO').length,
    folga: vigias.filter(v => v.status === 'FOLGA').length,
    problemas: vigias.filter(v => v.status === 'ATRASADO' || v.status === 'AUSENTE').length,
  };

  const handleViewProfessional = (professional: any) => {
    alert(`👤 ${professional.name}\n\n📍 Área: ${professional.area}\n⏰ Horário: ${professional.schedule}\n👨‍💼 Supervisor: ${professional.supervisor}\n📊 Status: ${professional.status}`);
  };

  const handleEditProfessional = (professional: any) => {
    alert(`Edição de ${professional.name} será implementada em breve!\n\nEm desenvolvimento: modal de edição completo.`);
  };

  const handleDeleteProfessional = (professional: any) => {
    if (confirm(`⚠️ Deseja realmente remover ${professional.name}?\n\nEsta ação não pode ser desfeita.`)) {
      dataService.deleteProfessional(professional.id);
    }
  };

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
            value={stats.total}
            icon={Eye}
            variant="primary"
          />
          <MetricCard
            title="Em Serviço"
            value={stats.em_servico}
            subtitle={`${Math.round((stats.em_servico/stats.total)*100)}% do efetivo`}
            icon={UserCheck}
            variant="success"
          />
          <MetricCard
            title="De Folga"
            value={stats.folga}
            icon={CalendarOff}
            variant="warning"
          />
          <MetricCard
            title="Alertas"
            value={stats.problemas}
            icon={AlertTriangle}
            variant="danger"
          />
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              onClick={() => setShowNewModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Novo Vigia
            </Button>
            <Button 
              onClick={() => setShowFilterModal(true)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 rounded-lg transition-all flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtrar
            </Button>
          </div>
          <Button 
            onClick={handleExport}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 rounded-lg transition-all flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {exportMessage || 'Exportar'}
          </Button>
        </div>

        {/* Filter Pills */}
        {(filterText || filterStatus) && (
          <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-400">Filtros ativos:</span>
            {filterText && (
              <button
                onClick={() => setFilterText("")}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-full hover:bg-blue-600/30 transition-all"
              >
                <span className="text-sm">{filterText}</span>
                <X className="h-3 w-3" />
              </button>
            )}
            {filterStatus && (
              <button
                onClick={() => setFilterStatus(null)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-full hover:bg-blue-600/30 transition-all"
              >
                <span className="text-sm">{filterStatus}</span>
                <X className="h-3 w-3" />
              </button>
            )}
            {(filterText || filterStatus) && (
              <button
                onClick={() => { setFilterText(""); setFilterStatus(null); }}
                className="text-sm text-slate-400 hover:text-slate-300 transition-all ml-auto"
              >
                Limpar tudo
              </button>
            )}
          </div>
        )}

        {/* Modal: Novo Vigia */}
        {showNewModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-5">Novo Vigia</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nome</label>
                  <input 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    placeholder="Nome do vigia" 
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateVigia()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Área de Vigilância</label>
                  <select 
                    value={newArea} 
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  >
                    <option>Sede Principal</option>
                    <option>Anexo I</option>
                    <option>Anexo II</option>
                    <option>Praça Central</option>
                    <option>Escola Municipal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Turno</label>
                  <select 
                    value={newSchedule}
                    onChange={(e) => setNewSchedule(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  >
                    <option>06:00 - 14:00</option>
                    <option>14:00 - 22:00</option>
                    <option>22:00 - 06:00</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                  <select 
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  >
                    <option value="EM_SERVICO">Em Serviço</option>
                    <option value="FOLGA">De Folga</option>
                    <option value="ATRASADO">Atrasado</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-6">
                <Button 
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateVigia}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Criar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Filtrar */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-5">Filtrar por Status</h3>
              
              <div className="space-y-2 mb-6">
                {['EM_SERVICO', 'FOLGA', 'ATRASADO', 'AUSENTE'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(filterStatus === status ? null : status)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                      filterStatus === status
                        ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded border transition-all ${
                        filterStatus === status
                          ? 'bg-blue-600 border-blue-500'
                          : 'border-slate-600'
                      }`} />
                      <span className="font-medium">{status}</span>
                      <span className="ml-auto text-sm opacity-60">
                        {vigias.filter(v => v.status === status).length}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">Buscar por Nome</label>
                <input 
                  value={filterText} 
                  onChange={(e) => setFilterText(e.target.value)} 
                  placeholder="Buscar profissional..." 
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>

              <p className="text-sm text-slate-400 mb-4">Encontrados: <span className="text-white font-semibold">{filteredVigias.length}</span> vigia(s)</p>
              
              <div className="flex gap-2 justify-end">
                <Button 
                  onClick={() => { setFilterText(''); setFilterStatus(null); setShowFilterModal(false); }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                >
                  Limpar
                </Button>
                <Button 
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <ProfessionalTable 
          professionals={filteredVigias}
          onView={handleViewProfessional}
          onEdit={handleEditProfessional}
          onDelete={handleDeleteProfessional}
        />
      </div>
    </AppLayout>
  );
}

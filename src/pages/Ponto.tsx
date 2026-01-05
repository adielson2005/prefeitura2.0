import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TimeRecordPanel } from "@/components/timerecord/TimeRecordPanel";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Download,
  Filter,
  Search,
  X,
  AlertCircle,
  CheckCircle,
  User
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockTimeRecords = [
  { id: "1", name: "Carlos Silva", category: "VIGIA", entry: "07:55", lunchOut: "12:00", lunchReturn: "13:00", exit: "16:00", status: "COMPLETO" },
  { id: "2", name: "Maria Santos", category: "VIGILANTE", entry: "07:52", lunchOut: "12:05", lunchReturn: "13:10", exit: null, status: "EM_ANDAMENTO" },
  { id: "3", name: "João Oliveira", category: "GUARDA", entry: "08:15", lunchOut: null, lunchReturn: null, exit: null, status: "ATRASADO" },
  { id: "4", name: "Ana Costa", category: "VIGILANTE", entry: "08:00", lunchOut: "12:00", lunchReturn: null, exit: null, status: "EM_ANDAMENTO" },
  { id: "5", name: "Pedro Lima", category: "VIGIA", entry: null, lunchOut: null, lunchReturn: null, exit: null, status: "AUSENTE" },
  { id: "6", name: "Fernanda Rocha", category: "GUARDA", entry: "06:00", lunchOut: "11:00", lunchReturn: "12:00", exit: "14:00", status: "COMPLETO" },
];

const statusConfig = {
  COMPLETO: { label: "Completo", variant: "active" as const },
  EM_ANDAMENTO: { label: "Em Andamento", variant: "warning" as const },
  ATRASADO: { label: "Atrasado", variant: "danger" as const },
  AUSENTE: { label: "Ausente", variant: "neutral" as const },
};

export default function Ponto() {
  const [timeRecords, setTimeRecords] = useState(mockTimeRecords);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [searchActive, setSearchActive] = useState(false);

  const handleExport = async () => {
    setExportMessage("Exportando...");
    await new Promise(r => setTimeout(r, 800));
    
    const csv = "Nome,Categoria,Entrada,Saída Almoço,Retorno,Saída,Status\n" +
      filteredRecords.map(r => 
        `${r.name},${r.category},${r.entry || '—'},${r.lunchOut || '—'},${r.lunchReturn || '—'},${r.exit || '—'},${statusConfig[r.status as keyof typeof statusConfig].label}`
      ).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ponto_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    setExportMessage("✓ Exportado!");
    setTimeout(() => setExportMessage(null), 2000);
  };

  const getFilteredRecords = () => {
    let results = timeRecords;
    
    if (filterText) {
      results = results.filter(r => r.name.toLowerCase().includes(filterText.toLowerCase()));
    }
    
    if (filterStatus) {
      results = results.filter(r => r.status === filterStatus);
    }
    
    return results;
  };

  const filteredRecords = getFilteredRecords();
  
  const stats = {
    total: timeRecords.length,
    completo: timeRecords.filter(r => r.status === 'COMPLETO').length,
    andamento: timeRecords.filter(r => r.status === 'EM_ANDAMENTO').length,
    irregularidades: timeRecords.filter(r => r.status === 'ATRASADO' || r.status === 'AUSENTE').length,
  };

  return (
    <AppLayout 
      title="Controle de Ponto" 
      subtitle="Registro e acompanhamento de ponto"
    >
      <div className="space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Registros Hoje"
            value={stats.total}
            subtitle={`${stats.completo} completos`}
            icon={Clock}
            variant="primary"
          />
          <MetricCard
            title="Pontos Completos"
            value={stats.completo}
            subtitle={`${Math.round((stats.completo/stats.total)*100)}% finalizados`}
            icon={CheckCircle2}
            variant="success"
          />
          <MetricCard
            title="Em Andamento"
            value={stats.andamento}
            subtitle={`${Math.round((stats.andamento/stats.total)*100)}% ativo`}
            icon={Clock}
            variant="warning"
          />
          <MetricCard
            title="Irregularidades"
            value={stats.irregularidades}
            subtitle="Atrasos e ausências"
            icon={AlertTriangle}
            variant="danger"
          />
        </div>

        {/* Time Record Panel for current user */}
        <TimeRecordPanel />

        {/* Records Table */}
        <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden shadow-lg">
          <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/30">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Registros do Dia</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {new Date().toLocaleDateString("pt-BR", { 
                    weekday: "long", 
                    day: "numeric", 
                    month: "long" 
                  })}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 lg:flex-none lg:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Buscar profissional..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>
                <Button 
                  onClick={() => setShowFilterModal(true)}
                  className="px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-white border border-slate-600/50 rounded-lg transition-all flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filtrar
                </Button>
                <Button 
                  onClick={handleExport}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {exportMessage || 'Exportar'}
                </Button>
              </div>
            </div>

            {/* Filter Status Pills */}
            {(filterText || filterStatus) && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-700/50">
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
                    <span className="text-sm">{statusConfig[filterStatus as keyof typeof statusConfig].label}</span>
                    <X className="h-3 w-3" />
                  </button>
                )}
                {(filterText || filterStatus) && (
                  <button
                    onClick={() => { setFilterText(""); setFilterStatus(null); }}
                    className="text-sm text-slate-400 hover:text-slate-300 transition-all"
                  >
                    Limpar tudo
                  </button>
                )}
              </div>
            )}
          </div>

          {filteredRecords.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-slate-500 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400">Nenhum registro encontrado com os filtros aplicados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-800/30 border-b border-slate-700/50 hover:bg-slate-800/30">
                    <TableHead className="px-4 py-3 text-left text-slate-300 font-semibold">Profissional</TableHead>
                    <TableHead className="px-4 py-3 text-center text-slate-300 font-semibold">Entrada</TableHead>
                    <TableHead className="px-4 py-3 text-center text-slate-300 font-semibold">Saída Almoço</TableHead>
                    <TableHead className="px-4 py-3 text-center text-slate-300 font-semibold">Retorno</TableHead>
                    <TableHead className="px-4 py-3 text-center text-slate-300 font-semibold">Saída</TableHead>
                    <TableHead className="px-4 py-3 text-center text-slate-300 font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record, index) => (
                    <TableRow 
                      key={record.id}
                      className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-all"
                    >
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{record.name}</p>
                            <p className="text-xs text-slate-400">{record.category}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        {record.entry ? (
                          <Badge className="bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs">
                            {record.entry}
                          </Badge>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        {record.lunchOut ? (
                          <span className="text-sm text-slate-300">{record.lunchOut}</span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        {record.lunchReturn ? (
                          <span className="text-sm text-slate-300">{record.lunchReturn}</span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        {record.exit ? (
                          <Badge className="bg-slate-700/50 text-slate-300 border border-slate-600/50 text-xs">
                            {record.exit}
                          </Badge>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        {record.status === 'COMPLETO' && (
                          <Badge className="bg-emerald-600/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle className="h-3 w-3 mr-1" /> Completo
                          </Badge>
                        )}
                        {record.status === 'EM_ANDAMENTO' && (
                          <Badge className="bg-blue-600/20 text-blue-300 border border-blue-500/30">
                            <Clock className="h-3 w-3 mr-1" /> Em Andamento
                          </Badge>
                        )}
                        {record.status === 'ATRASADO' && (
                          <Badge className="bg-amber-600/20 text-amber-300 border border-amber-500/30">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Atrasado
                          </Badge>
                        )}
                        {record.status === 'AUSENTE' && (
                          <Badge className="bg-red-600/20 text-red-300 border border-red-500/30">
                            <AlertCircle className="h-3 w-3 mr-1" /> Ausente
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Filtrar por Status</h3>
              <div className="space-y-2 mb-6">
                {Object.entries(statusConfig).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setFilterStatus(filterStatus === key ? null : key);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                      filterStatus === key
                        ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded border transition-all ${
                        filterStatus === key
                          ? 'bg-blue-600 border-blue-500'
                          : 'border-slate-600'
                      }`} />
                      <span className="font-medium">{val.label}</span>
                      <span className="ml-auto text-sm opacity-60">
                        {timeRecords.filter(r => r.status === key).length}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                >
                  Aplicar Filtro
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

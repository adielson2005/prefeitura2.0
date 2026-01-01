import { useState } from "react";
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
  Search 
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

  const handleExport = () => {
    const csv = "Nome,Categoria,Entrada,Saída Almoço,Retorno,Saída,Status\n" +
      filteredRecords.map(r => 
        `${r.name},${r.category},${r.entry || '—'},${r.lunchOut || '—'},${r.lunchReturn || '—'},${r.exit || '—'},${statusConfig[r.status as keyof typeof statusConfig].label}`
      ).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ponto_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredRecords = filterText ? timeRecords.filter(r => r.name.toLowerCase().includes(filterText.toLowerCase())) : timeRecords;

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
            value={86}
            subtitle="De 108 profissionais"
            icon={Clock}
            variant="primary"
          />
          <MetricCard
            title="Pontos Completos"
            value={52}
            subtitle="60.4% finalizados"
            icon={CheckCircle2}
            variant="success"
          />
          <MetricCard
            title="Em Andamento"
            value={27}
            icon={Clock}
            variant="warning"
          />
          <MetricCard
            title="Irregularidades"
            value={7}
            subtitle="Atrasos e ausências"
            icon={AlertTriangle}
            variant="danger"
          />
        </div>

        {/* Time Record Panel for current user */}
        <TimeRecordPanel />

        {/* Records Table */}
        <div className="card-institutional overflow-hidden">
          <div className="p-5 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="section-title">Registros do Dia</h3>
                <p className="section-subtitle mt-1">
                  {new Date().toLocaleDateString("pt-BR", { 
                    weekday: "long", 
                    day: "numeric", 
                    month: "long" 
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar profissional..."
                    className="input-institutional pl-10 w-48"
                  />
                </div>
                <Button variant="secondary" size="sm" onClick={() => setShowFilterModal(true)}>
                  <Filter className="h-4 w-4" />
                  Filtrar
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="table-header">Profissional</TableHead>
                <TableHead className="table-header text-center">Entrada</TableHead>
                <TableHead className="table-header text-center">Saída Almoço</TableHead>
                <TableHead className="table-header text-center">Retorno</TableHead>
                <TableHead className="table-header text-center">Saída</TableHead>
                <TableHead className="table-header text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record, index) => (
                <TableRow 
                  key={record.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{record.name}</p>
                      <p className="text-xs text-muted-foreground">{record.category}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {record.entry ? (
                      <Badge variant="active" className="text-xs">
                        {record.entry}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {record.lunchOut ? (
                      <span className="text-sm text-foreground">{record.lunchOut}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {record.lunchReturn ? (
                      <span className="text-sm text-foreground">{record.lunchReturn}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {record.exit ? (
                      <Badge variant="neutral" className="text-xs">
                        {record.exit}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={statusConfig[record.status as keyof typeof statusConfig].variant}>
                      {statusConfig[record.status as keyof typeof statusConfig].label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">Filtrar por Profissional</h3>
              <input value={filterText} onChange={(e) => setFilterText(e.target.value)} placeholder="Nome do profissional..." className="w-full px-3 py-2 border border-border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary/30" onKeyDown={(e) => e.key === 'Enter' && setShowFilterModal(false)} />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => { setFilterText(""); setShowFilterModal(false); }}>Limpar</Button>
                <Button onClick={() => setShowFilterModal(false)}>Aplicar</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

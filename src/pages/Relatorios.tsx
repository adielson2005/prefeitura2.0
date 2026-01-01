import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  Download, 
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  FileSpreadsheet,
  FileIcon
} from "lucide-react";

const reportTypes = [
  {
    id: "1",
    title: "Relatório de Ponto Mensal",
    description: "Detalhamento completo de entradas, saídas e horas trabalhadas",
    icon: Clock,
    category: "Ponto",
    formats: ["PDF", "Excel"],
  },
  {
    id: "2",
    title: "Folgas e Ausências",
    description: "Consolidado de folgas programadas e ausências registradas",
    icon: Calendar,
    category: "Escalas",
    formats: ["PDF", "Excel"],
  },
  {
    id: "3",
    title: "Efetivo por Área",
    description: "Distribuição de profissionais por área de atuação",
    icon: Users,
    category: "Recursos",
    formats: ["PDF"],
  },
  {
    id: "4",
    title: "Irregularidades",
    description: "Atrasos, faltas e outras ocorrências registradas",
    icon: AlertTriangle,
    category: "Ocorrências",
    formats: ["PDF", "Excel"],
  },
  {
    id: "5",
    title: "Horas Extras",
    description: "Consolidado de horas extras por profissional e período",
    icon: TrendingUp,
    category: "Ponto",
    formats: ["PDF", "Excel"],
  },
  {
    id: "6",
    title: "Dashboard Gerencial",
    description: "Visão executiva com indicadores principais",
    icon: BarChart3,
    category: "Gerencial",
    formats: ["PDF"],
  },
];

const recentReports = [
  { id: "1", name: "Ponto_Nov_2024.pdf", date: "01/12/2024", size: "2.4 MB", type: "PDF" },
  { id: "2", name: "Folgas_Nov_2024.xlsx", date: "01/12/2024", size: "856 KB", type: "Excel" },
  { id: "3", name: "Efetivo_Areas_Nov.pdf", date: "30/11/2024", size: "1.1 MB", type: "PDF" },
  { id: "4", name: "Irregularidades_Nov.pdf", date: "30/11/2024", size: "524 KB", type: "PDF" },
];

export default function Relatorios() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const handleGenerateReport = (reportId: string, format: string) => {
    const report = reportTypes.find(r => r.id === reportId);
    if (!report) return;

    const csv = `${report.title} - ${format}\n${new Date().toISOString()}\n\nDados do relatório...`;
    const blob = new Blob([csv], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${format === 'PDF' ? 'pdf' : 'xlsx'}`;
    link.click();
  };

  return (
    <AppLayout 
      title="Relatórios" 
      subtitle="Geração e exportação de relatórios"
    >
      <div className="space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Relatórios Gerados"
            value={156}
            subtitle="Este mês"
            icon={FileText}
            variant="primary"
          />
          <MetricCard
            title="Downloads"
            value={89}
            subtitle="Últimos 30 dias"
            icon={Download}
            variant="success"
          />
          <MetricCard
            title="Agendados"
            value={4}
            subtitle="Automáticos"
            icon={Calendar}
            variant="warning"
          />
          <MetricCard
            title="Armazenamento"
            value="2.4 GB"
            subtitle="De 10 GB usados"
            icon={FileText}
            variant="primary"
          />
        </div>

        {/* Report Types */}
        <div>
          <h3 className="section-title mb-4">Gerar Novo Relatório</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((report, index) => {
              const Icon = report.icon;
              
              return (
                <div
                  key={report.id}
                  className={cn(
                    "card-institutional p-5 animate-slide-up hover:shadow-lg transition-all duration-200 cursor-pointer group",
                    selectedReport === report.id && "ring-2 ring-primary"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setSelectedReport(report.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{report.title}</h4>
                        <Badge variant="secondary" className="text-[10px]">
                          {report.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {report.description}
                      </p>
                      <div className="flex items-center gap-2">
                        {report.formats.map((format) => (
                          <Button
                            key={format}
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGenerateReport(report.id, format);
                            }}
                          >
                            {format === "PDF" ? (
                              <FileIcon className="h-3.5 w-3.5 mr-1 text-status-danger" />
                            ) : (
                              <FileSpreadsheet className="h-3.5 w-3.5 mr-1 text-status-active" />
                            )}
                            {format}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="card-institutional p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Relatórios Recentes</h3>
            <Button variant="ghost" size="sm">
              Ver todos
            </Button>
          </div>
          <div className="space-y-2">
            {recentReports.map((report, index) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-center gap-3">
                  {report.type === "PDF" ? (
                    <FileIcon className="h-5 w-5 text-status-danger" />
                  ) : (
                    <FileSpreadsheet className="h-5 w-5 text-status-active" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">{report.name}</p>
                    <p className="text-xs text-muted-foreground">{report.date} • {report.size}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => {
                  const currentReport = recentReports.find(r => r.id === report.id);
                  if (!currentReport) return;
                  const csv = `${currentReport.name}\n${currentReport.date}`;
                  const blob = new Blob([csv], { type: "text/plain;charset=utf-8;" });
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.download = currentReport.name;
                  link.click();
                }}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

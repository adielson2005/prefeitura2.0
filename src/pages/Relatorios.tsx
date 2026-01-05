import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { pdfService } from "@/lib/pdfService";
import { excelService } from "@/lib/excelService";
import { dataService } from "@/lib/dataService";
import { db } from "@/lib/db";
import { format } from "date-fns";
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
  FileIcon,
  Loader2
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
  const [downloadingReports, setDownloadingReports] = useState<Set<string>>(new Set());
  const [downloadedReports, setDownloadedReports] = useState<Set<string>>(new Set());

  const handleGenerateReport = async (reportId: string, format: string) => {
    const report = reportTypes.find(r => r.id === reportId);
    if (!report) return;

    const key = `${reportId}-${format}`;
    setDownloadingReports(prev => new Set([...prev, key]));
    
    try {
      // Aguardar processamento
      await new Promise(r => setTimeout(r, 500));

      // Gerar relatório baseado no tipo
      switch (reportId) {
        case "1": // Ponto Mensal
          const timeRecords = await db.timeRecords.toArray();
          if (format === "PDF") {
            pdfService.generateTimeRecordsReport(timeRecords, format(new Date(), 'MMMM yyyy'));
          } else {
            excelService.generateTimeRecordsReport(timeRecords, format(new Date(), 'MMMM yyyy'));
          }
          break;

        case "2": // Folgas e Ausências
          const leaves = dataService.getLeaves();
          if (format === "PDF") {
            // Criar PDF de folgas (simplificado)
            const activities = dataService.getActivities();
            pdfService.generateActivitiesReport(activities);
          } else {
            excelService.generateLeavesReport(leaves);
          }
          break;

        case "3": // Efetivo por Área
          const professionals = dataService.getProfessionals();
          pdfService.generateProfessionalsReport(professionals);
          break;

        case "4": // Irregularidades
          const allProfessionals = dataService.getProfessionals();
          const irregularProfessionals = allProfessionals.filter(
            p => p.status === 'ATRASADO' || p.status === 'AUSENTE'
          );
          if (format === "PDF") {
            pdfService.generateProfessionalsReport(irregularProfessionals);
          } else {
            excelService.generateProfessionalsReport(irregularProfessionals);
          }
          break;

        case "6": // Dashboard Gerencial (Consolidado)
          const allData = {
            professionals: dataService.getProfessionals(),
            records: await db.timeRecords.toArray(),
            activities: dataService.getActivities(),
            leaves: dataService.getLeaves()
          };
          excelService.generateConsolidatedReport(
            allData.professionals,
            allData.records,
            allData.activities,
            allData.leaves
          );
          break;

        default:
          // Fallback para outros tipos
          const defaultProf = dataService.getProfessionals();
          if (format === "PDF") {
            pdfService.generateProfessionalsReport(defaultProf);
          } else {
            excelService.generateProfessionalsReport(defaultProf);
          }
      }
      
      setDownloadedReports(prev => new Set([...prev, key]));
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setDownloadingReports(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
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
                        {report.formats.map((format) => {
                          const downloadKey = `${report.id}-${format}`;
                          const isDownloading = downloadingReports.has(downloadKey);
                          const isDownloaded = downloadedReports.has(downloadKey);
                          
                          return (
                            <Button
                              key={format}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGenerateReport(report.id, format);
                              }}
                              disabled={isDownloading}
                              className={`h-8 text-xs px-3 py-1 rounded transition-all ${
                                isDownloaded
                                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                                  : isDownloading
                                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 cursor-wait'
                                  : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
                              }`}
                            >
                              {format === "PDF" ? (
                                <FileIcon className="h-3.5 w-3.5 mr-1" />
                              ) : (
                                <FileSpreadsheet className="h-3.5 w-3.5 mr-1" />
                              )}
                              {isDownloading ? 'Processando...' : isDownloaded ? '✓ Baixado' : format}
                            </Button>
                          );
                        })}
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

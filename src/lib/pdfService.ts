/**
 * Serviço de Geração de Relatórios em PDF
 * Usando jsPDF e jspdf-autotable
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Professional, Activity } from './dataService';
import type { TimeRecord } from './db';

export class PDFService {
  private doc: jsPDF;

  constructor() {
    this.doc = new jsPDF();
  }

  private addHeader(title: string) {
    // Logo/Título
    this.doc.setFontSize(18);
    this.doc.setTextColor(30, 41, 59); // slate-800
    this.doc.text('Prefeitura Municipal', 14, 15);
    
    this.doc.setFontSize(14);
    this.doc.setTextColor(71, 85, 105); // slate-600
    this.doc.text('Sistema de Vigilância', 14, 22);
    
    // Linha separadora
    this.doc.setDrawColor(226, 232, 240); // slate-200
    this.doc.setLineWidth(0.5);
    this.doc.line(14, 25, 196, 25);
    
    // Título do relatório
    this.doc.setFontSize(16);
    this.doc.setTextColor(15, 23, 42); // slate-900
    this.doc.text(title, 14, 33);
    
    // Data de geração
    this.doc.setFontSize(10);
    this.doc.setTextColor(100, 116, 139); // slate-500
    const now = format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    this.doc.text(`Gerado em: ${now}`, 14, 39);
  }

  private addFooter(pageNumber: number) {
    const pageHeight = this.doc.internal.pageSize.height;
    this.doc.setFontSize(8);
    this.doc.setTextColor(148, 163, 184); // slate-400
    this.doc.text(
      `Página ${pageNumber} • Prefeitura Municipal © ${new Date().getFullYear()}`,
      14,
      pageHeight - 10
    );
  }

  /**
   * Gera relatório de profissionais
   */
  generateProfessionalsReport(professionals: Professional[], category?: string): void {
    const title = category 
      ? `Relatório de ${category}S` 
      : 'Relatório de Todos os Profissionais';
    
    this.addHeader(title);

    const data = professionals.map(p => [
      p.name,
      p.category,
      p.area,
      p.schedule,
      p.supervisor,
      this.getStatusLabel(p.status)
    ]);

    autoTable(this.doc, {
      startY: 45,
      head: [['Nome', 'Categoria', 'Área', 'Horário', 'Supervisor', 'Status']],
      body: data,
      theme: 'grid',
      headStyles: {
        fillColor: [51, 65, 85], // slate-700
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 25 },
        2: { cellWidth: 35 },
        3: { cellWidth: 30 },
        4: { cellWidth: 35 },
        5: { cellWidth: 26 }
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252] // slate-50
      }
    });

    this.addFooter(1);
    
    // Salvar PDF
    const filename = `profissionais_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`;
    this.doc.save(filename);
  }

  /**
   * Gera relatório de ponto mensal
   */
  generateTimeRecordsReport(records: TimeRecord[], month: string): void {
    this.addHeader(`Relatório de Ponto - ${month}`);

    const data = records.map(r => [
      format(new Date(r.date), 'dd/MM/yyyy'),
      r.professionalName,
      r.category,
      r.entryTime || '-',
      r.lunchOutTime || '-',
      r.lunchReturnTime || '-',
      r.exitTime || '-',
      this.getStatusLabel(r.status)
    ]);

    autoTable(this.doc, {
      startY: 45,
      head: [['Data', 'Nome', 'Cat.', 'Entrada', 'Saída Alm.', 'Ret. Alm.', 'Saída', 'Status']],
      body: data,
      theme: 'grid',
      headStyles: {
        fillColor: [51, 65, 85],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 40 },
        2: { cellWidth: 18 },
        3: { cellWidth: 18 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 18 },
        7: { cellWidth: 24 }
      }
    });

    this.addFooter(1);
    
    const filename = `ponto_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`;
    this.doc.save(filename);
  }

  /**
   * Gera relatório de atividades recentes
   */
  generateActivitiesReport(activities: Activity[]): void {
    this.addHeader('Relatório de Atividades Recentes');

    const data = activities.map(a => [
      format(new Date(a.date), 'dd/MM/yyyy'),
      a.time,
      this.getActivityTypeLabel(a.type),
      a.name,
      a.area
    ]);

    autoTable(this.doc, {
      startY: 45,
      head: [['Data', 'Hora', 'Tipo', 'Profissional', 'Área']],
      body: data,
      theme: 'grid',
      headStyles: {
        fillColor: [51, 65, 85],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 25 },
        2: { cellWidth: 35 },
        3: { cellWidth: 50 },
        4: { cellWidth: 45 }
      }
    });

    this.addFooter(1);
    
    const filename = `atividades_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`;
    this.doc.save(filename);
  }

  private getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      EM_SERVICO: 'Em Serviço',
      FOLGA: 'Folga',
      ATRASADO: 'Atrasado',
      AUSENTE: 'Ausente',
      COMPLETO: 'Completo',
      EM_ANDAMENTO: 'Em Andamento'
    };
    return labels[status] || status;
  }

  private getActivityTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      ENTRADA: 'Entrada',
      SAIDA: 'Saída',
      ALERTA: 'Alerta',
      RETORNO_ALMOCO: 'Retorno Almoço'
    };
    return labels[type] || type;
  }
}

// Exportar instância única
export const pdfService = new PDFService();

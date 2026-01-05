/**
 * Serviço de Geração de Relatórios em Excel
 * Usando xlsx (SheetJS)
 */

import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Professional, Activity, Leave } from './dataService';
import type { TimeRecord } from './db';

export class ExcelService {
  /**
   * Gera relatório de profissionais em Excel
   */
  generateProfessionalsReport(professionals: Professional[], category?: string): void {
    const data = professionals.map(p => ({
      'Nome': p.name,
      'Categoria': p.category,
      'Área': p.area,
      'Horário': p.schedule,
      'Supervisor': p.supervisor,
      'Status': this.getStatusLabel(p.status),
      'Entrada': p.entryTime || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    
    // Ajustar largura das colunas
    const columnWidths = [
      { wch: 35 }, // Nome
      { wch: 15 }, // Categoria
      { wch: 25 }, // Área
      { wch: 20 }, // Horário
      { wch: 25 }, // Supervisor
      { wch: 15 }, // Status
      { wch: 12 }  // Entrada
    ];
    ws['!cols'] = columnWidths;

    const wb = XLSX.utils.book_new();
    const sheetName = category ? `${category}S` : 'Profissionais';
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Salvar arquivo
    const filename = `profissionais_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
    XLSX.writeFile(wb, filename);
  }

  /**
   * Gera relatório de ponto mensal em Excel
   */
  generateTimeRecordsReport(records: TimeRecord[], month: string): void {
    const data = records.map(r => ({
      'Data': format(new Date(r.date), 'dd/MM/yyyy'),
      'Profissional': r.professionalName,
      'Categoria': r.category,
      'Entrada': r.entryTime || '-',
      'Saída Almoço': r.lunchOutTime || '-',
      'Retorno Almoço': r.lunchReturnTime || '-',
      'Saída': r.exitTime || '-',
      'Status': this.getStatusLabel(r.status),
      'Observações': r.notes || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    
    ws['!cols'] = [
      { wch: 12 },  // Data
      { wch: 30 },  // Profissional
      { wch: 12 },  // Categoria
      { wch: 10 },  // Entrada
      { wch: 13 },  // Saída Almoço
      { wch: 14 },  // Retorno Almoço
      { wch: 10 },  // Saída
      { wch: 15 },  // Status
      { wch: 30 }   // Observações
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, month);

    const filename = `ponto_${month.replace(/\s/g, '_')}_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
    XLSX.writeFile(wb, filename);
  }

  /**
   * Gera relatório de folgas em Excel
   */
  generateLeavesReport(leaves: Leave[]): void {
    const data = leaves.map(l => ({
      'Profissional': l.name,
      'Categoria': l.category,
      'Data': l.date,
      'Dia da Semana': l.dayOfWeek,
      'Status': l.approved ? 'Aprovada' : 'Pendente'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    
    ws['!cols'] = [
      { wch: 35 },  // Profissional
      { wch: 15 },  // Categoria
      { wch: 12 },  // Data
      { wch: 15 },  // Dia da Semana
      { wch: 12 }   // Status
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Folgas');

    const filename = `folgas_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
    XLSX.writeFile(wb, filename);
  }

  /**
   * Gera relatório de atividades em Excel
   */
  generateActivitiesReport(activities: Activity[]): void {
    const data = activities.map(a => ({
      'Data': format(new Date(a.date), 'dd/MM/yyyy'),
      'Hora': a.time,
      'Tipo': this.getActivityTypeLabel(a.type),
      'Profissional': a.name,
      'Área': a.area
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    
    ws['!cols'] = [
      { wch: 12 },  // Data
      { wch: 10 },  // Hora
      { wch: 18 },  // Tipo
      { wch: 35 },  // Profissional
      { wch: 25 }   // Área
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Atividades');

    const filename = `atividades_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
    XLSX.writeFile(wb, filename);
  }

  /**
   * Gera relatório consolidado com múltiplas abas
   */
  generateConsolidatedReport(
    professionals: Professional[],
    records: TimeRecord[],
    activities: Activity[],
    leaves: Leave[]
  ): void {
    const wb = XLSX.utils.book_new();

    // Aba de Profissionais
    const profData = professionals.map(p => ({
      'Nome': p.name,
      'Categoria': p.category,
      'Área': p.area,
      'Status': this.getStatusLabel(p.status)
    }));
    const profWs = XLSX.utils.json_to_sheet(profData);
    profWs['!cols'] = [{ wch: 35 }, { wch: 15 }, { wch: 25 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, profWs, 'Profissionais');

    // Aba de Registros de Ponto
    const recData = records.map(r => ({
      'Data': format(new Date(r.date), 'dd/MM/yyyy'),
      'Profissional': r.professionalName,
      'Entrada': r.entryTime || '-',
      'Saída': r.exitTime || '-',
      'Status': this.getStatusLabel(r.status)
    }));
    const recWs = XLSX.utils.json_to_sheet(recData);
    recWs['!cols'] = [{ wch: 12 }, { wch: 30 }, { wch: 10 }, { wch: 10 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, recWs, 'Ponto');

    // Aba de Atividades
    const actData = activities.map(a => ({
      'Data': format(new Date(a.date), 'dd/MM/yyyy'),
      'Hora': a.time,
      'Tipo': this.getActivityTypeLabel(a.type),
      'Profissional': a.name
    }));
    const actWs = XLSX.utils.json_to_sheet(actData);
    actWs['!cols'] = [{ wch: 12 }, { wch: 10 }, { wch: 18 }, { wch: 35 }];
    XLSX.utils.book_append_sheet(wb, actWs, 'Atividades');

    // Aba de Folgas
    const leaveData = leaves.map(l => ({
      'Profissional': l.name,
      'Data': l.date,
      'Status': l.approved ? 'Aprovada' : 'Pendente'
    }));
    const leaveWs = XLSX.utils.json_to_sheet(leaveData);
    leaveWs['!cols'] = [{ wch: 35 }, { wch: 12 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, leaveWs, 'Folgas');

    const filename = `relatorio_completo_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
    XLSX.writeFile(wb, filename);
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
export const excelService = new ExcelService();

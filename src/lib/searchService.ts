/**
 * Serviço de Busca Global Avançada
 * Busca em todas as entidades do sistema
 */

import { db } from './db';
import type { Professional, Activity, Leave, Area } from './dataService';

export interface SearchResult {
  type: 'professional' | 'activity' | 'leave' | 'area' | 'timerecord' | 'notification';
  id: string | number;
  title: string;
  subtitle: string;
  description?: string;
  category?: string;
  url?: string;
  data: any;
}

export class SearchService {
  /**
   * Busca global em todas as entidades
   */
  async search(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const normalizedQuery = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Buscar em paralelo
    const [professionals, activities, leaves, areas, timeRecords, notifications] = await Promise.all([
      this.searchProfessionals(normalizedQuery),
      this.searchActivities(normalizedQuery),
      this.searchLeaves(normalizedQuery),
      this.searchAreas(normalizedQuery),
      this.searchTimeRecords(normalizedQuery),
      this.searchNotifications(normalizedQuery)
    ]);

    results.push(...professionals, ...activities, ...leaves, ...areas, ...timeRecords, ...notifications);

    // Ordenar por relevância (prioriza matches no título)
    return results.sort((a, b) => {
      const aScore = this.calculateRelevance(a.title, normalizedQuery);
      const bScore = this.calculateRelevance(b.title, normalizedQuery);
      return bScore - aScore;
    });
  }

  /**
   * Busca em profissionais
   */
  private async searchProfessionals(query: string): Promise<SearchResult[]> {
    const all = await db.professionals.toArray();
    
    return all
      .filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.area.toLowerCase().includes(query) ||
        p.supervisor.toLowerCase().includes(query)
      )
      .map(p => ({
        type: 'professional' as const,
        id: p.id,
        title: p.name,
        subtitle: `${p.category} • ${p.area}`,
        description: `Horário: ${p.schedule} | Supervisor: ${p.supervisor}`,
        category: p.category,
        url: `/${p.category.toLowerCase()}s`,
        data: p
      }));
  }

  /**
   * Busca em atividades
   */
  private async searchActivities(query: string): Promise<SearchResult[]> {
    const all = await db.activities.toArray();
    
    return all
      .filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.area.toLowerCase().includes(query) ||
        a.type.toLowerCase().includes(query)
      )
      .slice(0, 20) // Limitar resultados
      .map(a => ({
        type: 'activity' as const,
        id: a.id,
        title: a.name,
        subtitle: `${this.getActivityTypeLabel(a.type)} às ${a.time}`,
        description: a.area,
        category: a.type,
        url: '/ponto',
        data: a
      }));
  }

  /**
   * Busca em folgas
   */
  private async searchLeaves(query: string): Promise<SearchResult[]> {
    const all = await db.leaves.toArray();
    
    return all
      .filter(l => 
        l.name.toLowerCase().includes(query) ||
        l.date.includes(query)
      )
      .map(l => ({
        type: 'leave' as const,
        id: l.id,
        title: l.name,
        subtitle: `Folga em ${l.date} (${l.dayOfWeek})`,
        description: l.approved ? 'Aprovada' : 'Pendente',
        category: l.category,
        url: '/escalas',
        data: l
      }));
  }

  /**
   * Busca em áreas
   */
  private async searchAreas(query: string): Promise<SearchResult[]> {
    const all = await db.areas.toArray();
    
    return all
      .filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.supervisor.toLowerCase().includes(query) ||
        a.address.toLowerCase().includes(query)
      )
      .map(a => ({
        type: 'area' as const,
        id: a.id,
        title: a.name,
        subtitle: `Supervisor: ${a.supervisor}`,
        description: a.address,
        url: '/areas',
        data: a
      }));
  }

  /**
   * Busca em registros de ponto
   */
  private async searchTimeRecords(query: string): Promise<SearchResult[]> {
    const all = await db.timeRecords.toArray();
    
    return all
      .filter(r => 
        r.professionalName.toLowerCase().includes(query) ||
        r.date.includes(query)
      )
      .slice(0, 15)
      .map(r => ({
        type: 'timerecord' as const,
        id: r.id!,
        title: r.professionalName,
        subtitle: `Ponto de ${r.date}`,
        description: `Entrada: ${r.entryTime || '-'} | Saída: ${r.exitTime || '-'}`,
        category: r.status,
        url: '/ponto',
        data: r
      }));
  }

  /**
   * Busca em notificações
   */
  private async searchNotifications(query: string): Promise<SearchResult[]> {
    const all = await db.notifications.toArray();
    
    return all
      .filter(n => 
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query)
      )
      .slice(0, 10)
      .map(n => ({
        type: 'notification' as const,
        id: n.id!,
        title: n.title,
        subtitle: n.type,
        description: n.message,
        category: n.type,
        url: n.actionUrl || '/notificacoes',
        data: n
      }));
  }

  /**
   * Calcula relevância do resultado
   */
  private calculateRelevance(text: string, query: string): number {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();

    // Match exato
    if (lowerText === lowerQuery) return 100;

    // Começa com a query
    if (lowerText.startsWith(lowerQuery)) return 80;

    // Contém a query
    if (lowerText.includes(lowerQuery)) return 60;

    // Palavras individuais
    const words = lowerQuery.split(' ');
    const matchedWords = words.filter(w => lowerText.includes(w)).length;
    return (matchedWords / words.length) * 40;
  }

  /**
   * Busca por filtros específicos
   */
  async advancedSearch(filters: {
    type?: string[];
    category?: string[];
    status?: string[];
    dateFrom?: string;
    dateTo?: string;
    query?: string;
  }): Promise<SearchResult[]> {
    let results = await this.search(filters.query || '');

    // Aplicar filtros
    if (filters.type && filters.type.length > 0) {
      results = results.filter(r => filters.type!.includes(r.type));
    }

    if (filters.category && filters.category.length > 0) {
      results = results.filter(r => r.category && filters.category!.includes(r.category));
    }

    if (filters.status && filters.status.length > 0) {
      results = results.filter(r => r.category && filters.status!.includes(r.category));
    }

    return results;
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

export const searchService = new SearchService();

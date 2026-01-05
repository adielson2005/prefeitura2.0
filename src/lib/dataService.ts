/**
 * Serviço centralizado de dados com sincronização via localStorage
 * Todos os dados do sistema são gerenciados aqui para garantir consistência
 */

export interface Professional {
  id: string;
  name: string;
  category: 'VIGIA' | 'VIGILANTE' | 'GUARDA';
  area: string;
  status: 'EM_SERVICO' | 'FOLGA' | 'ATRASADO' | 'AUSENTE';
  schedule: string;
  supervisor: string;
  entryTime?: string;
}

export interface Activity {
  id: string;
  type: 'ENTRADA' | 'SAIDA' | 'ALERTA' | 'RETORNO_ALMOCO';
  name: string;
  time: string;
  area: string;
  date: string; // ISO format
}

export interface Leave {
  id: string;
  professionalId: string;
  name: string;
  category: 'VIGIA' | 'VIGILANTE' | 'GUARDA';
  date: string; // formato DD/MM
  dayOfWeek: string;
  approved: boolean;
}

export interface Area {
  id: string;
  name: string;
  supervisor: string;
  address: string;
}

// Storage keys
const STORAGE_KEYS = {
  PROFESSIONALS: 'sistema_profissionais',
  ACTIVITIES: 'sistema_atividades',
  LEAVES: 'sistema_folgas',
  AREAS: 'sistema_areas',
  LAST_SYNC: 'sistema_last_sync',
};

// Dados iniciais (seed data)
const INITIAL_PROFESSIONALS: Professional[] = [
  { id: "1", name: "Carlos Alberto Silva", category: "VIGIA", area: "Sede Principal", status: "EM_SERVICO", schedule: "06:00 - 14:00", supervisor: "Roberto Mendes", entryTime: "07:55" },
  { id: "2", name: "José Roberto Santos", category: "VIGIA", area: "Anexo I", status: "EM_SERVICO", schedule: "14:00 - 22:00", supervisor: "Ana Paula Costa", entryTime: "07:52" },
  { id: "3", name: "Francisco Lima", category: "VIGIA", area: "Anexo II", status: "FOLGA", schedule: "22:00 - 06:00", supervisor: "Roberto Mendes" },
  { id: "4", name: "Antônio Pereira", category: "VIGIA", area: "Sede Principal", status: "ATRASADO", schedule: "06:00 - 14:00", supervisor: "Ana Paula Costa", entryTime: "08:15" },
  { id: "5", name: "Marcos Oliveira", category: "VIGIA", area: "Praça Central", status: "EM_SERVICO", schedule: "14:00 - 22:00", supervisor: "Roberto Mendes" },
  { id: "6", name: "Paulo Henrique Costa", category: "VIGIA", area: "Escola Municipal", status: "EM_SERVICO", schedule: "06:00 - 14:00", supervisor: "Ana Paula Costa" },
  { id: "7", name: "Ricardo Almeida", category: "VIGIA", area: "Centro Esportivo", status: "AUSENTE", schedule: "14:00 - 22:00", supervisor: "Roberto Mendes" },
  { id: "8", name: "Fernando Gomes", category: "VIGIA", area: "Sede Principal", status: "EM_SERVICO", schedule: "22:00 - 06:00", supervisor: "Ana Paula Costa" },
  
  { id: "9", name: "Maria Fernanda Costa", category: "VIGILANTE", area: "Sede Principal", status: "EM_SERVICO", schedule: "06:00 - 14:00", supervisor: "Carlos Eduardo" },
  { id: "10", name: "Ana Paula Santos", category: "VIGILANTE", area: "Anexo I", status: "EM_SERVICO", schedule: "14:00 - 22:00", supervisor: "Carlos Eduardo" },
  { id: "11", name: "Juliana Oliveira", category: "VIGILANTE", area: "Anexo II", status: "EM_SERVICO", schedule: "22:00 - 06:00", supervisor: "Patrícia Lima" },
  { id: "12", name: "Camila Rodrigues", category: "VIGILANTE", area: "Praça Central", status: "FOLGA", schedule: "06:00 - 14:00", supervisor: "Carlos Eduardo" },
  { id: "13", name: "Beatriz Almeida", category: "VIGILANTE", area: "Escola Municipal", status: "EM_SERVICO", schedule: "14:00 - 22:00", supervisor: "Patrícia Lima" },
  { id: "14", name: "Larissa Mendes", category: "VIGILANTE", area: "Centro Esportivo", status: "ATRASADO", schedule: "06:00 - 14:00", supervisor: "Carlos Eduardo" },
  { id: "15", name: "Priscila Gomes", category: "VIGILANTE", area: "Sede Principal", status: "EM_SERVICO", schedule: "22:00 - 06:00", supervisor: "Patrícia Lima" },
  { id: "16", name: "Vanessa Pereira", category: "VIGILANTE", area: "Hospital Municipal", status: "EM_SERVICO", schedule: "06:00 - 14:00", supervisor: "Carlos Eduardo" },
  { id: "17", name: "Cristiane Silva", category: "VIGILANTE", area: "Biblioteca", status: "FOLGA", schedule: "14:00 - 22:00", supervisor: "Patrícia Lima" },
  { id: "18", name: "Renata Lima", category: "VIGILANTE", area: "Sede Principal", status: "EM_SERVICO", schedule: "06:00 - 14:00", supervisor: "Carlos Eduardo" },
  
  { id: "19", name: "Roberto Carlos Mendes", category: "GUARDA", area: "Sede Principal", status: "EM_SERVICO", schedule: "06:00 - 14:00", supervisor: "Marcos Antônio" },
  { id: "20", name: "Eduardo Silva Santos", category: "GUARDA", area: "Praça da Liberdade", status: "EM_SERVICO", schedule: "14:00 - 22:00", supervisor: "Marcos Antônio" },
  { id: "21", name: "Sérgio Luiz Costa", category: "GUARDA", area: "Mercado Municipal", status: "EM_SERVICO", schedule: "22:00 - 06:00", supervisor: "Fernanda Souza" },
  { id: "22", name: "Márcio Pereira Lima", category: "GUARDA", area: "Terminal Rodoviário", status: "EM_SERVICO", schedule: "06:00 - 14:00", supervisor: "Marcos Antônio" },
  { id: "23", name: "Claudio José Oliveira", category: "GUARDA", area: "Parque Municipal", status: "FOLGA", schedule: "14:00 - 22:00", supervisor: "Fernanda Souza" },
  { id: "24", name: "André Luiz Almeida", category: "GUARDA", area: "Centro Histórico", status: "EM_SERVICO", schedule: "06:00 - 14:00", supervisor: "Marcos Antônio" },
  { id: "25", name: "Fábio Ricardo Gomes", category: "GUARDA", area: "Sede Principal", status: "ATRASADO", schedule: "14:00 - 22:00", supervisor: "Fernanda Souza" },
  { id: "26", name: "Gilberto Santos Junior", category: "GUARDA", area: "Escola Municipal", status: "EM_SERVICO", schedule: "22:00 - 06:00", supervisor: "Marcos Antônio" },
  { id: "27", name: "Leandro Ferreira", category: "GUARDA", area: "Hospital Municipal", status: "EM_SERVICO", schedule: "06:00 - 14:00", supervisor: "Fernanda Souza" },
  { id: "28", name: "Thiago Henrique Rocha", category: "GUARDA", area: "Centro Esportivo", status: "AUSENTE", schedule: "14:00 - 22:00", supervisor: "Marcos Antônio" },
  { id: "29", name: "Wagner Luis Martins", category: "GUARDA", area: "Praça Central", status: "EM_SERVICO", schedule: "06:00 - 14:00", supervisor: "Fernanda Souza" },
  { id: "30", name: "Diego Augusto Lima", category: "GUARDA", area: "Sede Principal", status: "FOLGA", schedule: "22:00 - 06:00", supervisor: "Marcos Antônio" },
];

const INITIAL_ACTIVITIES: Activity[] = [
  { id: "1", type: "ENTRADA", name: "Carlos Silva", time: "07:55", area: "Sede Principal", date: new Date().toISOString() },
  { id: "2", type: "ENTRADA", name: "Maria Santos", time: "07:52", area: "Anexo I", date: new Date().toISOString() },
  { id: "3", type: "ALERTA", name: "João Oliveira", time: "07:45", area: "Sede Principal", date: new Date().toISOString() },
  { id: "4", type: "SAIDA", name: "Ana Costa", time: "06:00", area: "Anexo II", date: new Date().toISOString() },
  { id: "5", type: "RETORNO_ALMOCO", name: "Pedro Lima", time: "13:05", area: "Sede Principal", date: new Date().toISOString() },
];

const INITIAL_LEAVES: Leave[] = [
  { id: "1", professionalId: "3", name: "Roberto Alves", category: "VIGIA", date: "15/01", dayOfWeek: "Qua", approved: true },
  { id: "2", professionalId: "12", name: "Fernanda Costa", category: "VIGILANTE", date: "16/01", dayOfWeek: "Qui", approved: true },
  { id: "3", professionalId: "23", name: "Lucas Mendes", category: "GUARDA", date: "17/01", dayOfWeek: "Sex", approved: true },
  { id: "4", professionalId: "5", name: "Patrícia Rocha", category: "VIGIA", date: "18/01", dayOfWeek: "Sáb", approved: false },
];

const INITIAL_AREAS: Area[] = [
  { id: "1", name: "Sede Principal", supervisor: "Roberto Mendes", address: "Rua Principal, 100 - Centro" },
  { id: "2", name: "Anexo I", supervisor: "Ana Paula Costa", address: "Av. Secundária, 250 - Centro" },
  { id: "3", name: "Anexo II", supervisor: "Carlos Eduardo", address: "Rua das Flores, 50 - Jardim" },
  { id: "4", name: "Praça Central", supervisor: "Patrícia Lima", address: "Praça da República, s/n - Centro" },
  { id: "5", name: "Escola Municipal", supervisor: "Marcos Antônio", address: "Rua da Educação, 300 - Vila Nova" },
  { id: "6", name: "Hospital Municipal", supervisor: "Fernanda Souza", address: "Av. da Saúde, 500 - Centro" },
  { id: "7", name: "Centro Esportivo", supervisor: "Roberto Mendes", address: "Rua do Esporte, 150 - Jardim" },
  { id: "8", name: "Biblioteca", supervisor: "Ana Paula Costa", address: "Av. da Cultura, 80 - Centro" },
  { id: "9", name: "Praça da Liberdade", supervisor: "Carlos Eduardo", address: "Praça da Liberdade, s/n - Centro" },
  { id: "10", name: "Mercado Municipal", supervisor: "Patrícia Lima", address: "Rua do Comércio, 200 - Centro" },
  { id: "11", name: "Terminal Rodoviário", supervisor: "Marcos Antônio", address: "Av. dos Transportes, 500 - Rodoviária" },
  { id: "12", name: "Parque Municipal", supervisor: "Fernanda Souza", address: "Rua do Parque, 300 - Jardim" },
];

class DataService {
  private listeners: Set<() => void> = new Set();

  // Inicialização
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PROFESSIONALS)) {
      this.saveProfessionals(INITIAL_PROFESSIONALS);
      this.saveActivities(INITIAL_ACTIVITIES);
      this.saveLeaves(INITIAL_LEAVES);
      this.saveAreas(INITIAL_AREAS);
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    }
  }

  // Listeners para atualização em tempo real
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // PROFISSIONAIS
  getProfessionals(): Professional[] {
    const data = localStorage.getItem(STORAGE_KEYS.PROFESSIONALS);
    return data ? JSON.parse(data) : [];
  }

  getProfessionalsByCategory(category: 'VIGIA' | 'VIGILANTE' | 'GUARDA'): Professional[] {
    return this.getProfessionals().filter(p => p.category === category);
  }

  addProfessional(professional: Omit<Professional, 'id'>): Professional {
    const professionals = this.getProfessionals();
    const newProfessional = {
      ...professional,
      id: String(Date.now()),
    };
    professionals.push(newProfessional);
    this.saveProfessionals(professionals);
    this.notifyListeners();
    return newProfessional;
  }

  updateProfessional(id: string, updates: Partial<Professional>) {
    const professionals = this.getProfessionals();
    const index = professionals.findIndex(p => p.id === id);
    if (index !== -1) {
      professionals[index] = { ...professionals[index], ...updates };
      this.saveProfessionals(professionals);
      this.notifyListeners();
    }
  }

  deleteProfessional(id: string) {
    const professionals = this.getProfessionals().filter(p => p.id !== id);
    this.saveProfessionals(professionals);
    this.notifyListeners();
  }

  private saveProfessionals(professionals: Professional[]) {
    localStorage.setItem(STORAGE_KEYS.PROFESSIONALS, JSON.stringify(professionals));
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  }

  // ATIVIDADES
  getActivities(): Activity[] {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return data ? JSON.parse(data) : [];
  }

  getRecentActivities(limit = 5): Activity[] {
    const today = new Date().toISOString().split('T')[0];
    return this.getActivities()
      .filter(a => a.date.startsWith(today))
      .sort((a, b) => b.time.localeCompare(a.time))
      .slice(0, limit);
  }

  addActivity(activity: Omit<Activity, 'id'>): Activity {
    const activities = this.getActivities();
    const newActivity = {
      ...activity,
      id: String(Date.now()),
      date: activity.date || new Date().toISOString(),
    };
    activities.push(newActivity);
    this.saveActivities(activities);
    this.notifyListeners();
    return newActivity;
  }

  private saveActivities(activities: Activity[]) {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }

  // FOLGAS
  getLeaves(): Leave[] {
    const data = localStorage.getItem(STORAGE_KEYS.LEAVES);
    return data ? JSON.parse(data) : [];
  }

  getUpcomingLeaves(limit = 4): Leave[] {
    return this.getLeaves()
      .filter(l => l.approved)
      .slice(0, limit);
  }

  addLeave(leave: Omit<Leave, 'id'>): Leave {
    const leaves = this.getLeaves();
    const newLeave = {
      ...leave,
      id: String(Date.now()),
    };
    leaves.push(newLeave);
    this.saveLeaves(leaves);
    this.notifyListeners();
    return newLeave;
  }

  updateLeave(id: string, updates: Partial<Leave>) {
    const leaves = this.getLeaves();
    const index = leaves.findIndex(l => l.id === id);
    if (index !== -1) {
      leaves[index] = { ...leaves[index], ...updates };
      this.saveLeaves(leaves);
      this.notifyListeners();
    }
  }

  deleteLeave(id: string) {
    const leaves = this.getLeaves().filter(l => l.id !== id);
    this.saveLeaves(leaves);
    this.notifyListeners();
  }

  private saveLeaves(leaves: Leave[]) {
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves));
  }

  // ÁREAS
  getAreas(): Area[] {
    const data = localStorage.getItem(STORAGE_KEYS.AREAS);
    return data ? JSON.parse(data) : [];
  }

  addArea(area: Omit<Area, 'id'>): Area {
    const areas = this.getAreas();
    const newArea = {
      ...area,
      id: String(Date.now()),
    };
    areas.push(newArea);
    this.saveAreas(areas);
    this.notifyListeners();
    return newArea;
  }

  updateArea(id: string, updates: Partial<Area>) {
    const areas = this.getAreas();
    const index = areas.findIndex(a => a.id === id);
    if (index !== -1) {
      areas[index] = { ...areas[index], ...updates };
      this.saveAreas(areas);
      this.notifyListeners();
    }
  }

  deleteArea(id: string) {
    const areas = this.getAreas().filter(a => a.id !== id);
    this.saveAreas(areas);
    this.notifyListeners();
  }

  private saveAreas(areas: Area[]) {
    localStorage.setItem(STORAGE_KEYS.AREAS, JSON.stringify(areas));
  }

  // ESTATÍSTICAS CALCULADAS
  getStats() {
    const professionals = this.getProfessionals();
    const leaves = this.getLeaves();
    
    const total = professionals.length;
    const emServico = professionals.filter(p => p.status === 'EM_SERVICO').length;
    const folga = professionals.filter(p => p.status === 'FOLGA').length;
    const atrasados = professionals.filter(p => p.status === 'ATRASADO').length;
    const ausentes = professionals.filter(p => p.status === 'AUSENTE').length;
    const alertas = atrasados + ausentes;
    
    const percentualEmServico = total > 0 ? ((emServico / total) * 100).toFixed(1) : '0';
    
    return {
      total,
      emServico,
      folga,
      atrasados,
      ausentes,
      alertas,
      percentualEmServico,
      folgasAprovadas: leaves.filter(l => l.approved).length,
      folgasPendentes: leaves.filter(l => !l.approved).length,
    };
  }

  // Profissionais em serviço agora (para dashboard)
  getOnDutyProfessionals(limit = 4): Professional[] {
    return this.getProfessionals()
      .filter(p => p.status === 'EM_SERVICO' || p.status === 'ATRASADO' || p.status === 'FOLGA')
      .slice(0, limit);
  }

  // Reset para dados iniciais (útil para testes)
  resetData() {
    localStorage.removeItem(STORAGE_KEYS.PROFESSIONALS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.LEAVES);
    localStorage.removeItem(STORAGE_KEYS.AREAS);
    localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
    this.init();
    this.notifyListeners();
  }
}

export const dataService = new DataService();

// Auto-inicializar
if (typeof window !== 'undefined') {
  dataService.init();
}

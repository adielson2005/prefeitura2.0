import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { dataService } from "@/lib/dataService";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Users,
  CalendarOff,
  Clock,
  CheckCircle2
} from "lucide-react";

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const categoryColors = {
  VIGIA: "bg-chart-1/20 text-chart-1",
  VIGILANTE: "bg-chart-2/20 text-chart-2",
  GUARDA: "bg-chart-3/20 text-chart-3",
  FERIADO: "bg-status-danger/20 text-status-danger",
};

export default function Escalas() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // 0 = Janeiro 2026
  const [showNewModal, setShowNewModal] = useState(false);
  
  const months = [
    "Janeiro 2026", "Fevereiro 2026", "Março 2026", "Abril 2026",
    "Maio 2026", "Junho 2026", "Julho 2026", "Agosto 2026",
    "Setembro 2026", "Outubro 2026", "Novembro 2026", "Dezembro 2026"
  ];
  
  const currentMonth = months[currentMonthIndex];
  
  const handlePrevMonth = () => {
    if (currentMonthIndex > 0) setCurrentMonthIndex(currentMonthIndex - 1);
  };
  
  const handleNextMonth = () => {
    if (currentMonthIndex < months.length - 1) setCurrentMonthIndex(currentMonthIndex + 1);
  };
  const [newLeaveName, setNewLeaveName] = useState('');
  const [newLeaveDate, setNewLeaveDate] = useState('');
  const [newLeaveCategory, setNewLeaveCategory] = useState<'VIGIA' | 'VIGILANTE' | 'GUARDA'>('VIGIA');
  const [leaves, setLeaves] = useState(dataService.getLeaves());

  useEffect(() => {
    const unsubscribe = dataService.subscribe(() => {
      setLeaves(dataService.getLeaves());
    });
    return unsubscribe;
  }, []);

  // Generate calendar days for January 2026
  const generateCalendarDays = () => {
    const days = [];
    const startDay = 4; // Janeiro 2026 começa na Quinta (index 4)
    
    // Add empty cells for days before the 1st
    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, leaves: [] });
    }
    
    // Add days of the month with dynamic leaves
    for (let i = 1; i <= 31; i++) {
      const dayLeaves = leaves.filter(leave => {
        const [day] = leave.date.split('/').map(Number);
        return day === i;
      }).map(leave => ({
        name: leave.name,
        category: leave.category
      }));
      
      // Feriado no dia 25
      if (i === 25) {
        dayLeaves.push({ name: "Feriado", category: "FERIADO" as const });
      }
      
      days.push({ day: i, leaves: dayLeaves });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const stats = dataService.getStats();

  const handleCreateLeave = () => {
    if (!newLeaveName.trim() || !newLeaveDate) return;
    
    const [day, month] = newLeaveDate.split('-').map(Number);
    const dayOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][new Date(2026, month - 1, day).getDay()];
    
    dataService.addLeave({
      professionalId: String(Date.now()),
      name: newLeaveName,
      category: newLeaveCategory,
      date: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`,
      dayOfWeek,
      approved: true
    });
    
    setNewLeaveName('');
    setNewLeaveDate('');
    setNewLeaveCategory('VIGIA');
    setShowNewModal(false);
  };

  return (
    <AppLayout 
      title="Folgas e Escalas" 
      subtitle="Gestão de escalas e folgas programadas"
    >
      <div className="space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Folgas este Mês"
            value={leaves.length}
            subtitle="Programadas"
            icon={CalendarOff}
            variant="primary"
          />
          <MetricCard
            title="Folgas Hoje"
            value={stats.folga}
            icon={Users}
            variant="warning"
          />
          <MetricCard
            title="Escalas Ativas"
            value={dataService.getAreas().length}
            icon={Clock}
            variant="success"
          />
          <MetricCard
            title="Aprovadas"
            value={stats.folgasAprovadas}
            subtitle={`${leaves.length > 0 ? ((stats.folgasAprovadas / leaves.length) * 100).toFixed(1) : 0}% do total`}
            icon={CheckCircle2}
            variant="success"
          />
        </div>

        {/* Calendar */}
        <div className="card-institutional p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handlePrevMonth}
                disabled={currentMonthIndex === 0}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h3 className="text-lg font-display font-bold text-foreground">{currentMonth}</h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleNextMonth}
                disabled={currentMonthIndex === months.length - 1}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <Button variant="institutional" onClick={() => setShowNewModal(true)}>
              <Plus className="h-4 w-4" />
              Nova Folga
            </Button>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center py-2 text-xs font-semibold text-muted-foreground uppercase">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((dayData, index) => (
              <div
                key={index}
                className={cn(
                  "min-h-[100px] p-2 rounded-lg border transition-all duration-200",
                  dayData.day === null && "bg-transparent border-transparent",
                  dayData.day !== null && "border-border hover:border-primary/50 hover:shadow-sm cursor-pointer",
                  dayData.day === 8 && "bg-primary/5 border-primary/30",
                  dayData.leaves.some(l => l.category === "FERIADO") && "bg-status-danger/5 border-status-danger/30"
                )}
              >
                {dayData.day && (
                  <>
                    <span className={cn(
                      "text-sm font-medium",
                      dayData.day === 8 && "text-primary",
                      dayData.leaves.some(l => l.category === "FERIADO") && "text-status-danger"
                    )}>
                      {dayData.day}
                    </span>
                    <div className="mt-1 space-y-1">
                      {dayData.leaves.slice(0, 2).map((leave, i) => (
                        <div
                          key={i}
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded truncate",
                            categoryColors[leave.category as keyof typeof categoryColors]
                          )}
                        >
                          {leave.name}
                        </div>
                      ))}
                      {dayData.leaves.length > 2 && (
                        <div className="text-[10px] text-muted-foreground">
                          +{dayData.leaves.length - 2} mais
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-chart-1/20" />
                <span className="text-muted-foreground">Vigia</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-chart-2/20" />
                <span className="text-muted-foreground">Vigilante</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-chart-3/20" />
                <span className="text-muted-foreground">Guarda</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-status-danger/20" />
                <span className="text-muted-foreground">Feriado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Nova Folga */}
        {showNewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">Nova Folga</h3>
              <input 
                value={newLeaveName} 
                onChange={(e) => setNewLeaveName(e.target.value)} 
                placeholder="Nome do profissional" 
                className="w-full px-3 py-2 border border-border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-primary/30" 
              />
              <input 
                type="date" 
                value={newLeaveDate} 
                onChange={(e) => setNewLeaveDate(e.target.value)} 
                className="w-full px-3 py-2 border border-border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-primary/30" 
              />
              <select 
                value={newLeaveCategory} 
                onChange={(e) => setNewLeaveCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="VIGIA">Vigia</option>
                <option value="VIGILANTE">Vigilante</option>
                <option value="GUARDA">Guarda</option>
              </select>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowNewModal(false)}>Cancelar</Button>
                <Button onClick={handleCreateLeave}>Criar</Button>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Leaves List */}
        <div className="card-institutional p-5">
          <h3 className="section-title mb-4">Próximas Folgas Programadas</h3>
          <div className="space-y-3">
            {leaves.slice(0, 6).map((leave, index) => (
              <div
                key={leave.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{leave.name}</p>
                    <p className="text-xs text-muted-foreground">{leave.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={
                    leave.category === "VIGIA" ? "vigia" :
                    leave.category === "VIGILANTE" ? "vigilante" : "guarda"
                  }>
                    {leave.approved ? "Aprovada" : "Pendente"}
                  </Badge>
                  <span className="text-sm font-medium text-foreground">{leave.date} - {leave.dayOfWeek}</span>
                </div>
              </div>
            ))}
            {leaves.length === 0 && (
              <p className="text-center text-muted-foreground py-8">Nenhuma folga programada</p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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

// Generate calendar days for December 2024
const generateCalendarDays = () => {
  const days = [];
  const startDay = 0; // Sunday
  
  // Add empty cells for days before the 1st
  for (let i = 0; i < startDay; i++) {
    days.push({ day: null, leaves: [] });
  }
  
  // Add days of the month
  for (let i = 1; i <= 31; i++) {
    const leaves = [];
    if (i === 8) leaves.push({ name: "Carlos S.", category: "VIGIA" });
    if (i === 10) leaves.push({ name: "Maria S.", category: "VIGILANTE" }, { name: "João O.", category: "GUARDA" });
    if (i === 15) leaves.push({ name: "Roberto A.", category: "VIGIA" });
    if (i === 16) leaves.push({ name: "Fernanda C.", category: "VIGILANTE" });
    if (i === 17) leaves.push({ name: "Lucas M.", category: "GUARDA" });
    if (i === 22) leaves.push({ name: "Ana P.", category: "VIGILANTE" }, { name: "Pedro L.", category: "VIGIA" });
    if (i === 25) leaves.push({ name: "Todos", category: "FERIADO" });
    
    days.push({ day: i, leaves });
  }
  
  return days;
};

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const calendarDays = generateCalendarDays();

const categoryColors = {
  VIGIA: "bg-chart-1/20 text-chart-1",
  VIGILANTE: "bg-chart-2/20 text-chart-2",
  GUARDA: "bg-chart-3/20 text-chart-3",
  FERIADO: "bg-status-danger/20 text-status-danger",
};

export default function Escalas() {
  const [currentMonth] = useState("Dezembro 2024");
  const [showNewModal, setShowNewModal] = useState(false);
  const [newLeave, setNewLeave] = useState('');

  const handleCreateLeave = () => {
    if (!newLeave.trim()) return;
    alert(`Folga "${newLeave}" criada com sucesso!`);
    setNewLeave('');
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
            value={42}
            subtitle="Programadas"
            icon={CalendarOff}
            variant="primary"
          />
          <MetricCard
            title="Folgas Hoje"
            value={15}
            icon={Users}
            variant="warning"
          />
          <MetricCard
            title="Escalas Ativas"
            value={12}
            icon={Clock}
            variant="success"
          />
          <MetricCard
            title="Aprovadas"
            value={38}
            subtitle="90.5% do total"
            icon={CheckCircle2}
            variant="success"
          />
        </div>

        {/* Calendar */}
        <div className="card-institutional p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h3 className="text-lg font-display font-bold text-foreground">{currentMonth}</h3>
              <Button variant="ghost" size="icon">
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
              <input value={newLeave} onChange={(e) => setNewLeave(e.target.value)} placeholder="Descrição da folga" className="w-full px-3 py-2 border border-border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary/30" onKeyDown={(e) => e.key === 'Enter' && handleCreateLeave()} />
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
            {[
              { name: "Roberto Alves", category: "VIGIA", date: "15/12/2024", area: "Sede Principal", supervisor: "Ana Costa" },
              { name: "Fernanda Costa", category: "VIGILANTE", date: "16/12/2024", area: "Anexo I", supervisor: "Carlos Mendes" },
              { name: "Lucas Mendes", category: "GUARDA", date: "17/12/2024", area: "Praça Central", supervisor: "Ana Costa" },
              { name: "Patrícia Rocha", category: "VIGIA", date: "18/12/2024", area: "Escola Municipal", supervisor: "Carlos Mendes" },
            ].map((leave, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{leave.name}</p>
                    <p className="text-xs text-muted-foreground">{leave.area} • Sup: {leave.supervisor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={
                    leave.category === "VIGIA" ? "vigia" :
                    leave.category === "VIGILANTE" ? "vigilante" : "guarda"
                  }>
                    {leave.category}
                  </Badge>
                  <span className="text-sm font-medium text-foreground">{leave.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  UserCog, 
  Plus, 
  Building2, 
  Users,
  Mail,
  Phone,
  Edit2,
  Eye,
  MoreHorizontal
} from "lucide-react";

const mockSupervisors = [
  { 
    id: "1", 
    name: "Roberto Mendes", 
    email: "roberto.mendes@prefeitura.gov.br",
    phone: "(11) 99999-1111",
    areas: ["Sede Principal", "Praça Central"],
    professionals: 26,
    status: "ATIVO"
  },
  { 
    id: "2", 
    name: "Ana Paula Costa", 
    email: "ana.costa@prefeitura.gov.br",
    phone: "(11) 99999-2222",
    areas: ["Anexo I"],
    professionals: 18,
    status: "ATIVO"
  },
  { 
    id: "3", 
    name: "Carlos Eduardo Silva", 
    email: "carlos.silva@prefeitura.gov.br",
    phone: "(11) 99999-3333",
    areas: ["Anexo II"],
    professionals: 13,
    status: "ATIVO"
  },
  { 
    id: "4", 
    name: "Patrícia Lima", 
    email: "patricia.lima@prefeitura.gov.br",
    phone: "(11) 99999-4444",
    areas: ["Escola Municipal"],
    professionals: 11,
    status: "ATIVO"
  },
  { 
    id: "5", 
    name: "Marcos Antônio", 
    email: "marcos.antonio@prefeitura.gov.br",
    phone: "(11) 99999-5555",
    areas: ["Hospital Municipal", "Centro Esportivo"],
    professionals: 24,
    status: "ATIVO"
  },
  { 
    id: "6", 
    name: "Fernanda Souza", 
    email: "fernanda.souza@prefeitura.gov.br",
    phone: "(11) 99999-6666",
    areas: ["Centro Histórico"],
    professionals: 16,
    status: "FERIAS"
  },
];

export default function Supervisores() {
  const [supervisors, setSupervisors] = useState(mockSupervisors);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreateSupervisor = () => {
    if (!newName.trim()) return;
    const newSup = { id: String(supervisors.length + 1), name: newName, email: "novo@prefeitura.gov.br", phone: "(11) 99999-9999", areas: [], professionals: 0, status: "ATIVO" };
    setSupervisors([...supervisors, newSup]);
    setNewName('');
    setShowNewModal(false);
  };

  return (
    <AppLayout 
      title="Supervisores" 
      subtitle="Gestão de supervisores de área"
    >
      <div className="space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Total de Supervisores"
            value={8}
            icon={UserCog}
            variant="primary"
          />
          <MetricCard
            title="Áreas Supervisionadas"
            value={12}
            icon={Building2}
            variant="success"
          />
          <MetricCard
            title="Profissionais Gerenciados"
            value={108}
            icon={Users}
            variant="warning"
          />
          <MetricCard
            title="Ativos"
            value={7}
            subtitle="87.5% disponíveis"
            icon={UserCog}
            variant="success"
          />
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <h3 className="section-title">Todos os Supervisores</h3>
          <Button variant="institutional" onClick={() => setShowNewModal(true)}>
            <Plus className="h-4 w-4" />
            Novo Supervisor
          </Button>
        </div>

        {showNewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">Novo Supervisor</h3>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome do supervisor" className="w-full px-3 py-2 border border-border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary/30" onKeyDown={(e) => e.key === 'Enter' && handleCreateSupervisor()} />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowNewModal(false)}>Cancelar</Button>
                <Button onClick={handleCreateSupervisor}>Criar</Button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="card-institutional overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="table-header">Supervisor</TableHead>
                <TableHead className="table-header">Contato</TableHead>
                <TableHead className="table-header">Áreas</TableHead>
                <TableHead className="table-header text-center">Profissionais</TableHead>
                <TableHead className="table-header text-center">Status</TableHead>
                <TableHead className="table-header text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supervisors.map((supervisor, index) => {
                const initials = supervisor.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
                
                return (
                  <TableRow
                    key={supervisor.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{supervisor.name}</p>
                          <p className="text-xs text-muted-foreground">Supervisor de Área</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm text-foreground flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          {supervisor.email}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5" />
                          {supervisor.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {supervisor.areas.map((area, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-foreground">{supervisor.professionals}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={supervisor.status === "ATIVO" ? "active" : "warning"}>
                        {supervisor.status === "ATIVO" ? "Ativo" : "Férias"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon-sm">
                          <Edit2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}

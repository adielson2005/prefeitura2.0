import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Clock, Edit2, Eye } from "lucide-react";

interface Professional {
  id: string;
  name: string;
  category: "VIGIA" | "VIGILANTE" | "GUARDA";
  area: string;
  status: "EM_SERVICO" | "FOLGA" | "ATRASADO" | "AUSENTE";
  schedule: string;
  supervisor: string;
}

interface ProfessionalTableProps {
  professionals: Professional[];
  className?: string;
}

const statusConfig = {
  EM_SERVICO: { label: "Em Serviço", color: "bg-status-active" },
  FOLGA: { label: "Folga", color: "bg-slate-400" },
  ATRASADO: { label: "Atrasado", color: "bg-status-warning" },
  AUSENTE: { label: "Ausente", color: "bg-status-danger" },
};

const categoryConfig = {
  VIGIA: { color: "bg-gradient-to-br from-blue-500 to-blue-600" },
  VIGILANTE: { color: "bg-gradient-to-br from-emerald-500 to-emerald-600" },
  GUARDA: { color: "bg-gradient-to-br from-amber-500 to-amber-600" },
};

export function ProfessionalTable({ professionals, className }: ProfessionalTableProps) {
  return (
    <div className={cn("bg-white rounded-lg border border-border/40 overflow-hidden", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-border/50">
            <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">Profissional</TableHead>
            <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">Área</TableHead>
            <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">Escala</TableHead>
            <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">Supervisor</TableHead>
            <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">Status</TableHead>
            <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {professionals.map((professional) => {
            const initials = professional.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
            
            return (
              <TableRow
                key={professional.id}
                className="border-b border-border/30 hover:bg-blue-50/30 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={cn(
                        "text-xs font-semibold text-white",
                        categoryConfig[professional.category].color
                      )}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground text-sm">{professional.name}</p>
                      <span className="text-[11px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded inline-block mt-1">
                        {professional.category}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{professional.area}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <Clock className="h-3.5 w-3.5" />
                    {professional.schedule}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{professional.supervisor}</TableCell>
                <TableCell>
                  <div className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-semibold text-white w-fit",
                    statusConfig[professional.status].color
                  )}>
                    {statusConfig[professional.status].label}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-secondary">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-secondary">
                      <Edit2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-secondary">
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
  );
}

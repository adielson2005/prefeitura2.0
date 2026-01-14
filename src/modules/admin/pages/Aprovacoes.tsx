import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  XCircle,
  Search,
  Clock,
  User,
  MapPin,
} from "lucide-react";
import { apiService } from "@/lib/apiService";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TimeRecord {
  id: string;
  user_id: string;
  users?: {
    nome: string;
    email: string;
  };
  tipo: "entrada" | "saida" | "entrada_almoco" | "saida_almoco";
  data_hora: string;
  localizacao?: {
    latitude: number;
    longitude: number;
    endereco?: string;
  };
  status: "pendente" | "aprovado" | "rejeitado";
  justificativa?: string;
}

interface ApprovalModal {
  open: boolean;
  record: TimeRecord | null;
  action: "approve" | "reject" | null;
}

export default function Aprovacoes() {
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<TimeRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ApprovalModal>({
    open: false,
    record: null,
    action: null,
  });
  const [justification, setJustification] = useState("");

  useEffect(() => {
    loadPendingRecords();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRecords(records);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredRecords(
        records.filter(
          (record) =>
            record.users?.nome.toLowerCase().includes(term) ||
            record.users?.email.toLowerCase().includes(term) ||
            record.tipo.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, records]);

  const loadPendingRecords = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllTimeRecords();

      // Filtrar apenas registros pendentes
      const pending = data.filter((r: TimeRecord) => r.status === "pendente");
      setRecords(pending);
      setFilteredRecords(pending);
    } catch (error) {
      console.error("Erro ao carregar registros:", error);
      toast.error("Erro ao carregar registros pendentes");
    } finally {
      setLoading(false);
    }
  };

  const openApprovalModal = (
    record: TimeRecord,
    action: "approve" | "reject"
  ) => {
    setModal({ open: true, record, action });
    setJustification("");
  };

  const closeModal = () => {
    setModal({ open: false, record: null, action: null });
    setJustification("");
  };

  const handleApproval = async () => {
    if (!modal.record || !modal.action) return;

    if (modal.action === "reject" && !justification.trim()) {
      toast.error("Justificativa é obrigatória para rejeição");
      return;
    }

    try {
      if (modal.action === "approve") {
        await apiService.approveTimeRecord(
          modal.record.id,
          justification.trim() || undefined
        );
        toast.success("Registro aprovado com sucesso");
      } else {
        await apiService.rejectTimeRecord(
          modal.record.id,
          justification.trim()
        );
        toast.success("Registro rejeitado com sucesso");
      }

      // Recarregar lista
      await loadPendingRecords();
      closeModal();
    } catch (error) {
      console.error("Erro ao processar aprovação:", error);
      toast.error("Erro ao processar aprovação");
    }
  };

  const getTypeLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      entrada: "Entrada",
      saida: "Saída",
      entrada_almoco: "Saída Almoço",
      saida_almoco: "Retorno Almoço",
    };
    return labels[tipo] || tipo;
  };

  const getTypeBadge = (tipo: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      entrada: "default",
      saida: "secondary",
      entrada_almoco: "outline",
      saida_almoco: "outline",
    };
    return variants[tipo] || "default";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Aprovações de Ponto</h1>
          <p className="text-muted-foreground">
            Gerencie e aprove registros de ponto dos funcionários
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Clock className="w-4 h-4 mr-2" />
          {filteredRecords.length} Pendentes
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={loadPendingRecords} variant="outline">
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando registros...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "Nenhum registro encontrado"
                : "Nenhum registro pendente"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {record.users?.nome || "N/A"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {record.users?.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeBadge(record.tipo)}>
                        {getTypeLabel(record.tipo)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(record.data_hora),
                        "dd/MM/yyyy 'às' HH:mm",
                        {
                          locale: ptBR,
                        }
                      )}
                    </TableCell>
                    <TableCell>
                      {record.localizacao ? (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {record.localizacao.endereco ||
                              `${record.localizacao.latitude.toFixed(
                                4
                              )}, ${record.localizacao.longitude.toFixed(4)}`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          N/A
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => openApprovalModal(record, "approve")}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => openApprovalModal(record, "reject")}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Rejeitar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de Aprovação/Rejeição */}
      <Dialog open={modal.open} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modal.action === "approve" ? "Aprovar" : "Rejeitar"} Registro de
              Ponto
            </DialogTitle>
            <DialogDescription>
              {modal.record && (
                <div className="space-y-2 mt-4">
                  <p>
                    <strong>Funcionário:</strong> {modal.record.users?.nome}
                  </p>
                  <p>
                    <strong>Tipo:</strong> {getTypeLabel(modal.record.tipo)}
                  </p>
                  <p>
                    <strong>Data/Hora:</strong>{" "}
                    {format(
                      new Date(modal.record.data_hora),
                      "dd/MM/yyyy 'às' HH:mm",
                      {
                        locale: ptBR,
                      }
                    )}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="justification">
                Justificativa{" "}
                {modal.action === "reject" && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <Textarea
                id="justification"
                placeholder={
                  modal.action === "approve"
                    ? "Adicione uma observação (opcional)"
                    : "Descreva o motivo da rejeição (obrigatório)"
                }
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={4}
                className={
                  modal.action === "reject" && !justification
                    ? "border-red-500"
                    : ""
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              onClick={handleApproval}
              variant={modal.action === "approve" ? "default" : "destructive"}
            >
              {modal.action === "approve" ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprovar
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeitar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Perfil do Funcionário - Portal do Funcionário
 * Informações pessoais e configurações básicas
 */

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Shield,
  LogOut,
  Edit,
  Camera
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { secureLogout } from "@/lib/secureAuth";

export default function EmployeePerfil() {
  const navigate = useNavigate();

  // Dados mockados
  const userData = {
    name: "João Silva",
    email: "joao.silva@prefeitura.gov.br",
    phone: "(11) 99999-9999",
    role: "Vigilante",
    site: "Praça Central",
    registration: "2024001234",
    admissionDate: "15/03/2024",
  };

  const handleLogout = () => {
    secureLogout();
    navigate("/login");
  };

  return (
    <AppLayout title="Meu Perfil" subtitle="Suas informações pessoais">
      <div className="space-y-6">
        {/* Header do Perfil */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <CardContent className="pt-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="absolute bottom-0 right-0 bg-white text-blue-600 rounded-full p-2 shadow-lg hover:bg-blue-50 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-1">{userData.name}</h2>
            <p className="text-blue-100">{userData.role}</p>
            <p className="text-sm text-blue-200 mt-1">
              Matrícula: {userData.registration}
            </p>
          </CardContent>
        </Card>

        {/* Informações Pessoais */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Informações Pessoais</CardTitle>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <p className="text-xs text-gray-600">E-mail</p>
                <p className="font-medium">{userData.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <p className="text-xs text-gray-600">Telefone</p>
                <p className="font-medium">{userData.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Building2 className="h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <p className="text-xs text-gray-600">Local de trabalho</p>
                <p className="font-medium">{userData.site}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <p className="text-xs text-gray-600">Data de admissão</p>
                <p className="font-medium">{userData.admissionDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Configurações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate("/funcionario/notificacoes")}
            >
              <Shield className="h-4 w-4 mr-2" />
              Notificações
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start"
            >
              <Shield className="h-4 w-4 mr-2" />
              Alterar Senha
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start"
            >
              <Shield className="h-4 w-4 mr-2" />
              Privacidade
            </Button>
          </CardContent>
        </Card>

        {/* Informações do Sistema */}
        <Card className="bg-gray-50">
          <CardContent className="pt-4">
            <div className="text-xs text-gray-600 space-y-1">
              <p>Sistema de Ponto Eletrônico</p>
              <p>Prefeitura Municipal - v2.0.0</p>
              <p>Última atualização: 07/01/2026</p>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair da Conta
        </Button>
      </div>
    </AppLayout>
  );
}

/**
 * Perfil do Funcionário - Portal do Funcionário
 * Informações pessoais e configurações básicas
 */

import { EmployeeLayout } from "../layouts/EmployeeLayout";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { secureLogout, getCurrentUser } from "@/lib/secureAuth";
import { PushNotificationSettings } from "@/components/PushNotificationSettings";
import { AvatarUpload } from "@/components/AvatarUpload";
import { useState } from "react";

export default function EmployeePerfil() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  // Dados mockados
  const userData = {
    name: currentUser?.name || "João Silva",
    email: currentUser?.email || "joao.silva@prefeitura.gov.br",
    phone: "(11) 99999-9999",
    role: currentUser?.role || "Vigilante",
    site: "Praça Central",
    registration: "2024001234",
    admissionDate: "15/03/2024",
  };

  const handleLogout = () => {
    secureLogout();
    navigate("/login");
  };

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    setAvatarUrl(newAvatarUrl);
  };

  return (
    <EmployeeLayout title="Meu Perfil">
      <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header do Perfil */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <CardContent className="p-4 sm:p-5 md:p-6 text-center">
            <div className="mb-3 sm:mb-4">
              <AvatarUpload
                currentAvatar={avatarUrl}
                userName={userData.name}
                userId={currentUser?.id || ""}
                onAvatarUpdate={handleAvatarUpdate}
              />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">
              {userData.name}
            </h2>
            <p className="text-sm sm:text-base text-blue-100">
              {userData.role}
            </p>
            <p className="text-xs sm:text-sm text-blue-200 mt-1">
              Matrícula: {userData.registration}
            </p>
          </CardContent>
        </Card>

        {/* Informações Pessoais */}
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardHeader className="p-4 sm:p-5 md:p-6 pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base sm:text-lg md:text-xl text-white">
                Informações Pessoais
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white h-8 w-8 sm:h-9 sm:w-9 p-0 flex-shrink-0"
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 md:p-6 pt-0 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg">
              <Mail className="h-5 w-5 text-blue-400" />
              <div className="flex-1">
                <p className="text-xs text-slate-400">E-mail</p>
                <p className="font-medium text-white">{userData.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg">
              <Phone className="h-5 w-5 text-green-400" />
              <div className="flex-1">
                <p className="text-xs text-slate-400">Telefone</p>
                <p className="font-medium text-white">{userData.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg">
              <Building2 className="h-5 w-5 text-purple-400" />
              <div className="flex-1">
                <p className="text-xs text-slate-400">Local de trabalho</p>
                <p className="font-medium text-white">{userData.site}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg">
              <MapPin className="h-5 w-5 text-amber-400" />
              <div className="flex-1">
                <p className="text-xs text-slate-400">Data de admissão</p>
                <p className="font-medium text-white">
                  {userData.admissionDate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações */}
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardHeader className="p-4 sm:p-5 md:p-6 pb-3">
            <CardTitle className="text-base sm:text-lg md:text-xl text-white">
              Configurações
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 md:p-6 pt-0 space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50 hover:text-white text-xs sm:text-sm h-9 sm:h-10"
              onClick={() => navigate("/funcionario/notificacoes")}
            >
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
              Notificações
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50 hover:text-white text-xs sm:text-sm h-9 sm:h-10"
            >
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
              Alterar Senha
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50 hover:text-white text-xs sm:text-sm h-9 sm:h-10"
            >
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
              Privacidade
            </Button>
          </CardContent>
        </Card>

        {/* Notificações Push */}
        <PushNotificationSettings />

        {/* Informações do Sistema */}
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardContent className="p-3 sm:p-4 md:p-5">
            <div className="text-[10px] sm:text-xs text-slate-400 space-y-0.5 sm:space-y-1">
              <p>Sistema de Ponto Eletrônico</p>
              <p>Prefeitura Municipal - v2.0.0</p>
              <p>Última atualização: 07/01/2026</p>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="destructive"
          className="w-full text-xs sm:text-sm h-10 sm:h-11"
          onClick={handleLogout}
        >
          <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
          Sair da Conta
        </Button>
      </div>
    </EmployeeLayout>
  );
}

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
    <AppLayout title="Meu Perfil" subtitle="Suas informações pessoais">
      <div className="space-y-6">
        {/* Header do Perfil */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <CardContent className="pt-6 text-center">
            <div className="mb-4">
              <AvatarUpload
                currentAvatar={avatarUrl}
                userName={userData.name}
                userId={currentUser?.id || ""}
                onAvatarUpdate={handleAvatarUpdate}
              />
            </div>
            <h2 className="text-2xl font-bold mb-1">{userData.name}</h2>
            <p className="text-blue-100">{userData.role}</p>
            <p className="text-sm text-blue-200 mt-1">
              Matrícula: {userData.registration}
            </p>
          </CardContent>
        </Card>

        {/* Informações Pessoais */}
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-white">
                Informações Pessoais
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
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
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white">Configurações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50 hover:text-white"
              onClick={() => navigate("/funcionario/notificacoes")}
            >
              <Shield className="h-4 w-4 mr-2" />
              Notificações
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50 hover:text-white"
            >
              <Shield className="h-4 w-4 mr-2" />
              Alterar Senha
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50 hover:text-white"
            >
              <Shield className="h-4 w-4 mr-2" />
              Privacidade
            </Button>
          </CardContent>
        </Card>

        {/* Notificações Push */}
        <PushNotificationSettings />

        {/* Informações do Sistema */}
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardContent className="pt-4">
            <div className="text-xs text-slate-400 space-y-1">
              <p>Sistema de Ponto Eletrônico</p>
              <p>Prefeitura Municipal - v2.0.0</p>
              <p>Última atualização: 07/01/2026</p>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Sair da Conta
        </Button>
      </div>
    </AppLayout>
  );
}

import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Shield,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function Perfil() {
  const [name, setName] = useState(
    localStorage.getItem("userName") || "Administrador"
  );
  const [email, setEmail] = useState(
    localStorage.getItem("userEmail") || "administrador@prefeitura.gov.br"
  );
  const [phone, setPhone] = useState(
    localStorage.getItem("userPhone") || "(11) 98765-4321"
  );
  const [area, setArea] = useState(
    localStorage.getItem("userArea") || "Vigilância Geral"
  );
  const [role, setRole] = useState(
    localStorage.getItem("userRole") || "Gerente de Segurança"
  );
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(t);
    }
  }, [saved]);

  const handleSave = async () => {
    setLoading(true);
    // Simular delay de salvamento
    await new Promise((r) => setTimeout(r, 800));
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPhone", phone);
    localStorage.setItem("userArea", area);
    localStorage.setItem("userRole", role);
    setSaved(true);
    setLoading(false);
  };

  return (
    <AppLayout
      title="Meu Perfil"
      subtitle="Gerencie seus dados pessoais e profissionais"
    >
      <div className="max-w-3xl space-y-6">
        {/* Informações Pessoais */}
        <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 sm:p-8 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <User className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">
              Informações Pessoais
            </h2>
          </div>

          <div className="space-y-5">
            {/* Nome */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2.5">
                Nome Completo
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="Seu nome"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="seu.email@prefeitura.gov.br"
                />
              </div>
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2.5">
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="(11) 9XXXX-XXXX"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Informações Profissionais */}
        <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 sm:p-8 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="h-5 w-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">
              Informações Profissionais
            </h2>
          </div>

          <div className="space-y-5">
            {/* Cargo */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2.5">
                Cargo
              </label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                placeholder="Seu cargo"
              />
            </div>

            {/* Área */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2.5">
                Área de Atuação
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  placeholder="Sua área"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status e Ações */}
        <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 sm:p-8 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-slate-300">Conta verificada e ativa</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-blue-400" />
              <span className="text-slate-300">Segurança: Padrão</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-amber-400" />
              <span className="text-slate-300">
                Último acesso: Hoje às 14:35
              </span>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all active:scale-95"
          >
            {loading ? "⏳ Salvando..." : "✓ Salvar Alterações"}
          </Button>
          <Button
            variant="outline"
            className="px-6 py-2.5 border border-slate-600 text-slate-300 hover:bg-slate-800/50 rounded-lg transition-all"
          >
            Trocar Senha
          </Button>
          {saved && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-emerald-300 font-medium">
                Alterações salvas!
              </span>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

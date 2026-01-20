/**
 * Configurações - Portal do Funcionário
 * Sistema completo de segurança com verificação multi-canal
 */

import { useState } from "react";
import { EmployeeLayout } from "../layouts/EmployeeLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/use-theme";
import {
  Bell,
  Lock,
  Eye,
  EyeOff,
  Save,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Key,
  Send,
  UserCheck,
  Check,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/lib/secureAuth";

export default function EmployeeConfiguracoes() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const usuario = getCurrentUser();

  // Estados de Notificações
  const [notifPontoEmail, setNotifPontoEmail] = useState(true);
  const [notifPontoApp, setNotifPontoApp] = useState(true);
  const [notifEscalaEmail, setNotifEscalaEmail] = useState(true);
  const [notifEscalaApp, setNotifEscalaApp] = useState(true);
  const [notifSom, setNotifSom] = useState(true);

  // Estados de Segurança - Troca de Senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenhas, setMostrarSenhas] = useState(false);

  // Estados de Contatos de Segurança
  const [emailInstitucional, setEmailInstitucional] = useState(
    usuario?.username + "@prefeitura.gov.br"
  );
  const [emailPessoal, setEmailPessoal] = useState("");
  const [telefoneCelular, setTelefoneCelular] = useState("");

  // Estados de Verificação
  const [etapaVerificacao, setEtapaVerificacao] = useState<
    "formulario" | "escolha-canal" | "codigo" | "sucesso"
  >("formulario");
  const [canalEscolhido, setCanalEscolhido] = useState<
    "email-institucional" | "email-pessoal" | "telefone" | "supervisor" | null
  >(null);
  const [codigoVerificacao, setCodigoVerificacao] = useState("");
  const [codigoEnviado, setCodigoEnviado] = useState("");
  const [tentativasRestantes, setTentativasRestantes] = useState(3);

  // Autenticação 2FA
  const [autenticacao2FA, setAutenticacao2FA] = useState(false);

  // Validação de Força de Senha
  const validarSenha = (senha: string) => {
    const requisitos = {
      tamanho: senha.length >= 8,
      maiuscula: /[A-Z]/.test(senha),
      minuscula: /[a-z]/.test(senha),
      numero: /[0-9]/.test(senha),
      especial: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
    };

    const pontos = Object.values(requisitos).filter(Boolean).length;
    return { requisitos, pontos, forte: pontos >= 4 };
  };

  const forcaSenha = validarSenha(novaSenha);

  // Handler para salvar notificações
  const handleSalvarNotificacoes = () => {
    localStorage.setItem(
      "employee_notif_prefs",
      JSON.stringify({
        pontoEmail: notifPontoEmail,
        pontoApp: notifPontoApp,
        escalaEmail: notifEscalaEmail,
        escalaApp: notifEscalaApp,
        som: notifSom,
      })
    );

    toast({
      title: "✅ Preferências salvas!",
      description: "Suas configurações de notificação foram atualizadas.",
    });
  };

  // Handler para alternar tema
  const handleAlternarTema = () => {
    const novoTema = theme === "dark" ? "light" : "dark";
    setTheme(novoTema);

    toast({
      title: "🎨 Tema alterado!",
      description: `Tema ${
        novoTema === "dark" ? "escuro" : "claro"
      } aplicado com sucesso.`,
    });
  };

  // Handler para iniciar alteração de senha
  const handleIniciarAlteracaoSenha = () => {
    // Validações
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      toast({
        title: "⚠️ Campos obrigatórios",
        description: "Preencha todos os campos de senha.",
        variant: "destructive",
      });
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast({
        title: "❌ Senhas não conferem",
        description: "A nova senha e a confirmação devem ser iguais.",
        variant: "destructive",
      });
      return;
    }

    if (!forcaSenha.forte) {
      toast({
        title: "⚠️ Senha fraca",
        description:
          "Sua senha deve atender a pelo menos 4 dos requisitos de segurança.",
        variant: "destructive",
      });
      return;
    }

    // Validar senha atual (simulação)
    if (senhaAtual !== "123") {
      // Em produção, validar com backend
      toast({
        title: "❌ Senha incorreta",
        description: "A senha atual está incorreta.",
        variant: "destructive",
      });
      return;
    }

    // Avançar para escolha de canal
    setEtapaVerificacao("escolha-canal");
  };

  // Handler para enviar código de verificação
  const handleEnviarCodigo = (canal: typeof canalEscolhido) => {
    if (!canal) return;

    setCanalEscolhido(canal);

    // Gerar código aleatório de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    setCodigoEnviado(codigo);
    setTentativasRestantes(3);

    let destino = "";
    switch (canal) {
      case "email-institucional":
        destino = emailInstitucional;
        break;
      case "email-pessoal":
        destino = emailPessoal || "não cadastrado";
        break;
      case "telefone":
        destino = telefoneCelular || "não cadastrado";
        break;
      case "supervisor":
        destino = "supervisor imediato";
        break;
    }

    // Simular envio (em produção, chamar API)
    toast({
      title: "📨 Código enviado!",
      description: `Código de verificação enviado para ${destino}. (Simulação: ${codigo})`,
    });

    setEtapaVerificacao("codigo");
  };

  // Handler para validar código
  const handleValidarCodigo = () => {
    if (codigoVerificacao === codigoEnviado) {
      // Código correto - alterar senha (em produção, chamar API)
      toast({
        title: "✅ Senha alterada com sucesso!",
        description:
          "Sua senha foi atualizada. Use a nova senha no próximo login.",
      });

      // Limpar formulário
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
      setCodigoVerificacao("");
      setEtapaVerificacao("sucesso");

      // Voltar ao formulário após 3 segundos
      setTimeout(() => {
        setEtapaVerificacao("formulario");
      }, 3000);
    } else {
      const novasTentativas = tentativasRestantes - 1;
      setTentativasRestantes(novasTentativas);

      if (novasTentativas === 0) {
        toast({
          title: "🔒 Bloqueado",
          description:
            "Muitas tentativas incorretas. Tente novamente em 15 minutos.",
          variant: "destructive",
        });
        setEtapaVerificacao("formulario");
        setSenhaAtual("");
        setNovaSenha("");
        setConfirmarSenha("");
        setCodigoVerificacao("");
      } else {
        toast({
          title: "❌ Código incorreto",
          description: `Você tem ${novasTentativas} tentativa(s) restante(s).`,
          variant: "destructive",
        });
      }
    }
  };

  // Handler para cancelar alteração
  const handleCancelarAlteracao = () => {
    setEtapaVerificacao("formulario");
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
    setCodigoVerificacao("");
  };

  return (
    <EmployeeLayout title="Configurações">
      <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-5 md:space-y-6 p-3 sm:p-4">
        {/* Notificações */}
        <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-950/90 backdrop-blur-md border border-violet-500/50">
          <CardHeader className="p-4 sm:p-5 md:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl text-white">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400 flex-shrink-0" />
              Notificações
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-slate-300">
              Configure como e quando você deseja ser notificado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Notificações de Ponto */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">
                Registro de Ponto
              </h4>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 flex-shrink-0" />
                  <Label
                    htmlFor="ponto-email"
                    className="text-xs sm:text-sm text-slate-300 truncate"
                  >
                    Notificações por e-mail
                  </Label>
                </div>
                <Switch
                  id="ponto-email"
                  checked={notifPontoEmail}
                  onCheckedChange={setNotifPontoEmail}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-4 w-4 text-slate-400" />
                  <Label htmlFor="ponto-app" className="text-slate-300">
                    Notificações no app
                  </Label>
                </div>
                <Switch
                  id="ponto-app"
                  checked={notifPontoApp}
                  onCheckedChange={setNotifPontoApp}
                />
              </div>
            </div>

            <div className="border-t border-slate-700/50 pt-4" />

            {/* Notificações de Escala */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">
                Escalas e Turnos
              </h4>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <Label htmlFor="escala-email" className="text-slate-300">
                    Notificações por e-mail
                  </Label>
                </div>
                <Switch
                  id="escala-email"
                  checked={notifEscalaEmail}
                  onCheckedChange={setNotifEscalaEmail}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-4 w-4 text-slate-400" />
                  <Label htmlFor="escala-app" className="text-slate-300">
                    Notificações no app
                  </Label>
                </div>
                <Switch
                  id="escala-app"
                  checked={notifEscalaApp}
                  onCheckedChange={setNotifEscalaApp}
                />
              </div>
            </div>

            <div className="border-t border-slate-700/50 pt-4" />

            {/* Sons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {notifSom ? (
                  <Volume2 className="h-4 w-4 text-slate-400" />
                ) : (
                  <VolumeX className="h-4 w-4 text-slate-400" />
                )}
                <Label htmlFor="som" className="text-slate-300">
                  Sons de notificação
                </Label>
              </div>
              <Switch
                id="som"
                checked={notifSom}
                onCheckedChange={setNotifSom}
              />
            </div>

            <Button
              onClick={handleSalvarNotificacoes}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-xs sm:text-sm h-9 sm:h-10 md:h-11"
            >
              <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
              Salvar Preferências
            </Button>
          </CardContent>
        </Card>

        {/* Aparência */}
        <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-950/90 backdrop-blur-md border border-blue-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              {theme === "dark" ? (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
              ) : (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
              )}
              Aparência
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-slate-300">
              Personalize a aparência do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <Label className="text-sm sm:text-base text-white font-semibold">
                  Tema
                </Label>
                <p className="text-xs sm:text-sm text-slate-400">
                  {theme === "dark" ? "Modo Escuro" : "Modo Claro"}
                </p>
              </div>
              <Button
                onClick={handleAlternarTema}
                variant="outline"
                className="border-blue-500/50 text-white hover:bg-blue-600/20"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4 mr-2" />
                    Claro
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 mr-2" />
                    Escuro
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Segurança - Contatos */}
        <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-950/90 backdrop-blur-md border border-amber-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <UserCheck className="h-5 w-5 text-amber-400" />
              Contatos de Segurança
            </CardTitle>
            <CardDescription className="text-slate-300">
              Configure formas de recuperação de conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email-inst"
                className="text-slate-300 flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-amber-400" />
                E-mail Institucional (Principal)
              </Label>
              <Input
                id="email-inst"
                type="email"
                value={emailInstitucional}
                onChange={(e) => setEmailInstitucional(e.target.value)}
                className="bg-slate-900/50 border-slate-700/50 text-white"
                placeholder="nome@prefeitura.gov.br"
              />
              <p className="text-xs text-slate-400">
                ✅ Usado para verificação de identidade e códigos de segurança
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email-pessoal"
                className="text-slate-300 flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-slate-400" />
                E-mail Pessoal (Backup)
              </Label>
              <Input
                id="email-pessoal"
                type="email"
                value={emailPessoal}
                onChange={(e) => setEmailPessoal(e.target.value)}
                className="bg-slate-900/50 border-slate-700/50 text-white"
                placeholder="seuemail@gmail.com"
              />
              <p className="text-xs text-slate-400">
                Opcional - usado caso não tenha acesso ao e-mail institucional
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="telefone"
                className="text-slate-300 flex items-center gap-2"
              >
                <Smartphone className="h-4 w-4 text-slate-400" />
                Telefone Celular (Backup)
              </Label>
              <Input
                id="telefone"
                type="tel"
                value={telefoneCelular}
                onChange={(e) => setTelefoneCelular(e.target.value)}
                className="bg-slate-900/50 border-slate-700/50 text-white"
                placeholder="(11) 99999-9999"
              />
              <p className="text-xs text-slate-400">
                Opcional - receba códigos via SMS
              </p>
            </div>

            <Button
              onClick={() =>
                toast({
                  title: "✅ Contatos salvos!",
                  description:
                    "Suas informações de segurança foram atualizadas.",
                })
              }
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Contatos
            </Button>
          </CardContent>
        </Card>

        {/* Segurança - Alteração de Senha */}
        <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-950/90 backdrop-blur-md border border-red-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Lock className="h-5 w-5 text-red-400" />
              Segurança da Conta
            </CardTitle>
            <CardDescription className="text-slate-300">
              Gerencie sua senha e autenticação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Etapa 1: Formulário de Senha */}
            {etapaVerificacao === "formulario" && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Key className="h-4 w-4 text-red-400" />
                  Alterar Senha
                </h4>

                <div className="space-y-2">
                  <Label htmlFor="senha-atual" className="text-slate-300">
                    Senha Atual
                  </Label>
                  <div className="relative">
                    <Input
                      id="senha-atual"
                      type={mostrarSenhas ? "text" : "password"}
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      className="bg-slate-900/50 border-slate-700/50 text-white pr-10"
                      placeholder="Digite sua senha atual"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenhas(!mostrarSenhas)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {mostrarSenhas ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nova-senha" className="text-slate-300">
                    Nova Senha
                  </Label>
                  <Input
                    id="nova-senha"
                    type={mostrarSenhas ? "text" : "password"}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    className="bg-slate-900/50 border-slate-700/50 text-white"
                    placeholder="Digite a nova senha"
                  />

                  {/* Indicador de Força */}
                  {novaSenha && (
                    <div className="space-y-2 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-400">
                          Força da senha:
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            forcaSenha.pontos >= 4
                              ? "text-green-400"
                              : forcaSenha.pontos >= 3
                                ? "text-yellow-400"
                                : "text-red-400"
                          }`}
                        >
                          {forcaSenha.pontos >= 4
                            ? "Forte"
                            : forcaSenha.pontos >= 3
                              ? "Média"
                              : "Fraca"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-1 text-xs">
                        <div
                          className={`flex items-center gap-2 ${
                            forcaSenha.requisitos.tamanho
                              ? "text-green-400"
                              : "text-slate-500"
                          }`}
                        >
                          {forcaSenha.requisitos.tamanho ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          Mínimo 8 caracteres
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            forcaSenha.requisitos.maiuscula
                              ? "text-green-400"
                              : "text-slate-500"
                          }`}
                        >
                          {forcaSenha.requisitos.maiuscula ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          Letra maiúscula
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            forcaSenha.requisitos.minuscula
                              ? "text-green-400"
                              : "text-slate-500"
                          }`}
                        >
                          {forcaSenha.requisitos.minuscula ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          Letra minúscula
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            forcaSenha.requisitos.numero
                              ? "text-green-400"
                              : "text-slate-500"
                          }`}
                        >
                          {forcaSenha.requisitos.numero ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          Número
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            forcaSenha.requisitos.especial
                              ? "text-green-400"
                              : "text-slate-500"
                          }`}
                        >
                          {forcaSenha.requisitos.especial ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          Caractere especial (!@#$...)
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmar-senha" className="text-slate-300">
                    Confirmar Nova Senha
                  </Label>
                  <Input
                    id="confirmar-senha"
                    type={mostrarSenhas ? "text" : "password"}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="bg-slate-900/50 border-slate-700/50 text-white"
                    placeholder="Confirme a nova senha"
                  />
                  {confirmarSenha && novaSenha !== confirmarSenha && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      As senhas não conferem
                    </p>
                  )}
                  {confirmarSenha && novaSenha === confirmarSenha && (
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Senhas conferem
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleIniciarAlteracaoSenha}
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Continuar para Verificação
                </Button>
              </div>
            )}

            {/* Etapa 2: Escolha de Canal */}
            {etapaVerificacao === "escolha-canal" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-amber-400" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Verificação de Segurança
                    </h4>
                    <p className="text-xs text-slate-400">
                      Escolha como deseja receber o código de verificação
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => handleEnviarCodigo("email-institucional")}
                    variant="outline"
                    className="w-full justify-start border-green-500/50 hover:bg-green-600/20"
                    disabled={!emailInstitucional}
                  >
                    <Mail className="h-4 w-4 mr-3 text-green-400" />
                    <div className="text-left">
                      <div className="text-white font-semibold">
                        E-mail Institucional
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {emailInstitucional}
                      </div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleEnviarCodigo("email-pessoal")}
                    variant="outline"
                    className="w-full justify-start border-blue-500/50 hover:bg-blue-600/20"
                    disabled={!emailPessoal}
                  >
                    <Mail className="h-4 w-4 mr-3 text-blue-400" />
                    <div className="text-left">
                      <div className="text-white font-semibold">
                        E-mail Pessoal
                      </div>
                      <div className="text-xs text-slate-400">
                        {emailPessoal || "Não cadastrado"}
                      </div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleEnviarCodigo("telefone")}
                    variant="outline"
                    className="w-full justify-start border-purple-500/50 hover:bg-purple-600/20"
                    disabled={!telefoneCelular}
                  >
                    <Smartphone className="h-4 w-4 mr-3 text-purple-400" />
                    <div className="text-left">
                      <div className="text-white font-semibold">
                        SMS no Celular
                      </div>
                      <div className="text-xs text-slate-400">
                        {telefoneCelular || "Não cadastrado"}
                      </div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleEnviarCodigo("supervisor")}
                    variant="outline"
                    className="w-full justify-start border-amber-500/50 hover:bg-amber-600/20"
                  >
                    <UserCheck className="h-4 w-4 mr-3 text-amber-400" />
                    <div className="text-left">
                      <div className="text-white font-semibold">
                        Validação do Supervisor
                      </div>
                      <div className="text-xs text-slate-400">
                        Solicitar código ao seu supervisor direto
                      </div>
                    </div>
                  </Button>
                </div>

                <Button
                  onClick={handleCancelarAlteracao}
                  variant="ghost"
                  className="w-full text-slate-400 hover:text-white"
                >
                  Cancelar
                </Button>
              </div>
            )}

            {/* Etapa 3: Validação de Código */}
            {etapaVerificacao === "codigo" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Key className="h-5 w-5 text-blue-400" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Digite o Código
                    </h4>
                    <p className="text-xs text-slate-400">
                      Código enviado para{" "}
                      {canalEscolhido === "email-institucional"
                        ? emailInstitucional
                        : canalEscolhido === "email-pessoal"
                          ? emailPessoal
                          : canalEscolhido === "telefone"
                            ? telefoneCelular
                            : "seu supervisor"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigo" className="text-slate-300">
                    Código de Verificação (6 dígitos)
                  </Label>
                  <Input
                    id="codigo"
                    type="text"
                    maxLength={6}
                    value={codigoVerificacao}
                    onChange={(e) =>
                      setCodigoVerificacao(e.target.value.replace(/\D/g, ""))
                    }
                    className="bg-slate-900/50 border-slate-700/50 text-white text-center text-2xl tracking-widest"
                    placeholder="000000"
                  />
                  <p className="text-xs text-slate-400 text-center">
                    {tentativasRestantes} tentativa(s) restante(s)
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleValidarCodigo}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    disabled={codigoVerificacao.length !== 6}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Validar Código
                  </Button>
                  <Button
                    onClick={handleCancelarAlteracao}
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-600/20"
                  >
                    Cancelar
                  </Button>
                </div>

                <Button
                  onClick={() => handleEnviarCodigo(canalEscolhido)}
                  variant="ghost"
                  className="w-full text-slate-400 hover:text-white text-xs"
                >
                  <Send className="h-3 w-3 mr-2" />
                  Reenviar código
                </Button>
              </div>
            )}

            {/* Etapa 4: Sucesso */}
            {etapaVerificacao === "sucesso" && (
              <div className="text-center py-8 space-y-4">
                <div className="flex justify-center">
                  <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-green-400" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Senha Alterada!
                  </h4>
                  <p className="text-sm text-slate-400">
                    Sua senha foi atualizada com sucesso.
                    <br />
                    Use a nova senha no próximo login.
                  </p>
                </div>
              </div>
            )}

            <div className="border-t border-slate-700/50 pt-4" />

            {/* Autenticação de 2 Fatores */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-slate-400" />
                <div>
                  <Label htmlFor="2fa" className="text-white font-semibold">
                    Autenticação de 2 Fatores
                  </Label>
                  <p className="text-sm text-slate-400">
                    Adicione uma camada extra de segurança
                  </p>
                </div>
              </div>
              <Switch
                id="2fa"
                checked={autenticacao2FA}
                onCheckedChange={(checked) => {
                  setAutenticacao2FA(checked);
                  toast({
                    title: checked ? "🔒 2FA Ativado" : "2FA Desativado",
                    description: checked
                      ? "Autenticação de 2 fatores está ativa."
                      : "Autenticação de 2 fatores foi desativada.",
                  });
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Informações de Ajuda */}
        <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-950/90 backdrop-blur-md border border-emerald-500/50">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-semibold mb-1">
                    Sistema de Segurança Multi-Canal
                  </p>
                  <p className="text-xs text-slate-400">
                    Para maior segurança, mantenha seus contatos atualizados. Em
                    caso de alteração de senha, você receberá um código de
                    verificação.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-semibold mb-1">
                    Dica de Segurança
                  </p>
                  <p className="text-xs text-slate-400">
                    Nunca compartilhe sua senha ou códigos de verificação. A
                    prefeitura nunca solicitará essas informações por telefone
                    ou e-mail.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
}

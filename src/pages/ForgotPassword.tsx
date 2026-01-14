import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { apiService } from "@/lib/apiService";

type Step = "request" | "verify" | "reset" | "success";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("request");
  const [loading, setLoading] = useState(false);

  // Form data
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Dev code (apenas em desenvolvimento)
  const [devCode, setDevCode] = useState<string | null>(null);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Digite seu email");
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.forgotPassword(email);

      // Em desenvolvimento, o backend retorna o código
      if (response.devCode) {
        setDevCode(response.devCode);
        toast.success(`Código gerado: ${response.devCode}`, {
          duration: 10000,
        });
      } else {
        toast.success("Código enviado para seu email!");
      }

      setStep("verify");
    } catch (error) {
      console.error("Erro ao solicitar código:", error);
      toast.error("Erro ao enviar código. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim() || code.length !== 6) {
      toast.error("Digite o código de 6 dígitos");
      return;
    }

    try {
      setLoading(true);
      await apiService.verifyResetCode(email, code);
      toast.success("Código verificado! Defina sua nova senha.");
      setStep("reset");
    } catch (error) {
      console.error("Erro ao verificar código:", error);
      toast.error("Código inválido ou expirado");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    try {
      setLoading(true);
      await apiService.resetPassword(email, code, newPassword);
      toast.success("Senha redefinida com sucesso!");
      setStep("success");
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      toast.error("Erro ao redefinir senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Recuperar Senha
          </h1>
          <p className="text-slate-300">Sistema de Ponto - Prefeitura</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/10 border-white/20 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              {step === "request" && "Solicitar Código"}
              {step === "verify" && "Verificar Código"}
              {step === "reset" && "Nova Senha"}
              {step === "success" && "Sucesso!"}
            </CardTitle>
            <CardDescription className="text-slate-300">
              {step === "request" &&
                "Digite seu email para receber o código de recuperação"}
              {step === "verify" &&
                "Digite o código de 6 dígitos enviado para seu email"}
              {step === "reset" && "Defina sua nova senha"}
              {step === "success" && "Sua senha foi redefinida com sucesso"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Step 1: Request Code */}
            {step === "request" && (
              <form onSubmit={handleRequestCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar Código"}
                </Button>
              </form>
            )}

            {/* Step 2: Verify Code */}
            {step === "verify" && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                {devCode && (
                  <Alert className="bg-green-500/20 border-green-500/50">
                    <AlertDescription className="text-white">
                      <strong>Código de desenvolvimento:</strong> {devCode}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="code">Código de Verificação</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="000000"
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 text-center text-2xl tracking-widest"
                    maxLength={6}
                    required
                    disabled={loading}
                    autoFocus
                  />
                  <p className="text-xs text-slate-400">
                    Código enviado para: {email}
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || code.length !== 6}
                >
                  {loading ? "Verificando..." : "Verificar Código"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep("request")}
                  disabled={loading}
                >
                  Solicitar Novo Código
                </Button>
              </form>
            )}

            {/* Step 3: Reset Password */}
            {step === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                      minLength={6}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite novamente"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                      minLength={6}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {newPassword &&
                  confirmPassword &&
                  newPassword !== confirmPassword && (
                    <Alert className="bg-red-500/20 border-red-500/50">
                      <AlertDescription className="text-white">
                        As senhas não coincidem
                      </AlertDescription>
                    </Alert>
                  )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    loading ||
                    !newPassword ||
                    !confirmPassword ||
                    newPassword !== confirmPassword
                  }
                >
                  {loading ? "Redefinindo..." : "Redefinir Senha"}
                </Button>
              </form>
            )}

            {/* Step 4: Success */}
            {step === "success" && (
              <div className="text-center space-y-4 py-6">
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-500/20 p-4">
                    <CheckCircle2 className="h-12 w-12 text-green-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Senha Redefinida!</h3>
                  <p className="text-slate-300">
                    Sua senha foi alterada com sucesso. Você já pode fazer login
                    com a nova senha.
                  </p>
                </div>
                <Button onClick={() => navigate("/login")} className="w-full">
                  Ir para Login
                </Button>
              </div>
            )}

            {step !== "success" && (
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => navigate("/login")}
                disabled={loading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Login
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Lock, User, Eye, EyeOff, ShieldCheck, AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { loginWithSupabase } from "@/lib/supabaseAuth";
import { getDefaultRoute, UserRole } from "@/lib/roleGuard";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [userType, setUserType] = useState<'encarregado' | 'funcionario' | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Login com Supabase + Auditoria (passa o tipo selecionado)
      const result = await loginWithSupabase(username, password, userType || undefined);
      
      if (result.success && result.user) {
        // Login bem-sucedido - redirecionar baseado no role
        console.log(`✅ Login realizado como ${userType}: ${result.user.username} (${result.user.role})`);
        
        const defaultRoute = getDefaultRoute(result.user.role as UserRole);
        navigate(defaultRoute, { replace: true });
      } else {
        // Login falhado
        setError(result.error || "Usuário ou senha incorretos");
        
        // Diminuir tentativas restantes
        const remaining = Math.max(0, remainingAttempts - 1);
        setRemainingAttempts(remaining);
        
        if (remaining === 0) {
          setError("❌ Muitas tentativas falhadas. Aguarde alguns minutos.");
        }
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError("Erro ao conectar com o servidor. Verifique sua conexão.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetLockout = () => {
    setError("");
    setRemainingAttempts(5);
    setUsername("");
    setPassword("");
  };

  const handleUserTypeSelect = (type: 'encarregado' | 'funcionario') => {
    setUserType(type);
    setError("");
    // Preencher sugestão de usuário
    if (type === 'encarregado') {
      setUsername('teste');
    } else {
      // Deixar vazio para o funcionário digitar vigia, vigilante ou guarda
      setUsername('');
    }
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900/50 to-slate-950 relative overflow-hidden p-4 sm:p-6">
      {/* Elementos decorativos minimalistas */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-slate-800/15 to-slate-700/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-tl from-slate-800/10 to-slate-700/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-gradient-to-l from-slate-800/10 to-transparent rounded-full blur-3xl"></div>

      {/* Card de Login */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600/60 flex items-center justify-center shadow-lg shadow-slate-900/50 hover:shadow-slate-900/70 hover:scale-125 transition-all">
              <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Sistema de Vigilância</h1>
          <p className="text-sm sm:text-base text-slate-400 font-semibold">Prefeitura Municipal</p>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-2xl border border-slate-700/40 shadow-2xl shadow-slate-900/20 p-6 sm:p-10 relative overflow-hidden">
          {/* Linha de brilho no topo */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-600/30 to-transparent"></div>

          {/* Botão de Voltar - Aparece apenas quando tipo é selecionado */}
          {userType && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setUserType(null);
                setUsername('');
                setPassword('');
                setError('');
              }}
              className="absolute top-4 left-4 h-9 text-slate-400 hover:text-white hover:bg-slate-700/40 rounded-lg transition-all border border-transparent hover:border-slate-600/40 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Voltar</span>
            </Button>
          )}

          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 mt-12">Acesso ao Sistema</h2>
          <p className="text-sm sm:text-base text-slate-400 mb-6">Selecione seu tipo de acesso</p>

          {/* Seleção de Tipo de Usuário */}
          {!userType ? (
            <div className="space-y-4 mb-8">
              <button
                type="button"
                onClick={() => handleUserTypeSelect('encarregado')}
                className="w-full p-6 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-700/10 border-2 border-blue-500/30 hover:border-blue-500/60 transition-all group hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">Encarregado</h3>
                    <p className="text-sm text-slate-300">Gerentes, supervisores e administradores</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleUserTypeSelect('funcionario')}
                className="w-full p-6 rounded-xl bg-gradient-to-br from-green-600/20 to-green-700/10 border-2 border-green-500/30 hover:border-green-500/60 transition-all group hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">Funcionário</h3>
                    <p className="text-sm text-slate-300">Digite: vigia, vigilante ou guarda</p>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <div className="mb-6">
              <div className={`p-4 rounded-lg border-2 ${
                userType === 'encarregado' 
                  ? 'bg-blue-600/10 border-blue-500/40' 
                  : 'bg-green-600/10 border-green-500/40'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {userType === 'encarregado' ? (
                      <ShieldCheck className="h-5 w-5 text-blue-400" />
                    ) : (
                      <User className="h-5 w-5 text-green-400" />
                    )}
                    <span className="text-white font-semibold">
                      {userType === 'encarregado' ? 'Acesso Encarregado' : 'Acesso Funcionário'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUserType(null);
                      setUsername('');
                      setPassword('');
                      setError('');
                    }}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Alterar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Formulário - só aparece se userType for selecionado */}
          {userType && (
            <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
              {/* Username Input */}
              <div>
              <label className="block text-sm sm:text-base font-bold text-slate-200 mb-2.5">
                Usuário
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-slate-300 transition-colors" />
                <input
                  type="text"
                  placeholder="admin ou gerente"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-lg border border-slate-700/40 bg-slate-800/40 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all shadow-md hover:bg-slate-800/50"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm sm:text-base font-bold text-slate-200 mb-2.5">
                Senha
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-slate-300 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3 sm:py-3.5 rounded-lg border border-slate-700/40 bg-slate-800/40 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all shadow-md hover:bg-slate-800/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-gradient-to-r from-red-950/80 to-red-900/60 border-2 border-red-700/60 shadow-xl">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-300 text-sm sm:text-base font-semibold">{error}</p>
                    {remainingAttempts > 0 && remainingAttempts < 5 && (
                      <p className="text-red-400 text-xs mt-1">
                        {remainingAttempts} tentativa{remainingAttempts !== 1 ? 's' : ''} restante{remainingAttempts !== 1 ? 's' : ''}
                      </p>
                    )}
                    {error.includes("bloqueada") && (
                      <Button
                        type="button"
                        onClick={handleResetLockout}
                        className="mt-3 w-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-2 px-3 rounded-lg transition-all flex items-center gap-2 justify-center"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Desbloquear Agora
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Info Box - Credenciais de Teste */}
            <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-700/30 text-xs text-blue-300">
              <p className="font-bold mb-2">🧪 Credenciais de Teste:</p>
              <div className="space-y-1 text-[11px]">
                {userType === 'encarregado' ? (
                  <p>👔 <strong>Encarregado:</strong> teste / 123 ou gerente / gerente@A2005!</p>
                ) : (
                  <>
                    <p>👁️ <strong>Vigia:</strong> vigia / 123</p>
                    <p>👷 <strong>Vigilante:</strong> vigilante / 123</p>
                    <p>🛡️ <strong>Guarda:</strong> guarda / 123</p>
                  </>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-3.5 rounded-lg bg-gradient-to-r from-violet-950/40 to-purple-900/30 border border-violet-700/30">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-violet-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-violet-300">
                  Sistema com proteção contra ataques. Após 5 tentativas incorretas, a conta será bloqueada por 15 minutos.
                </p>
              </div>
            </div>

            {/* Remember Me removed for security */}
            <div className="text-xs sm:text-sm text-slate-400 text-center">
              Sessão expira após 8 horas ou 30 minutos de inatividade
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-3.5 rounded-lg bg-gradient-to-r from-violet-700 via-violet-600 to-purple-600 text-white font-black hover:from-violet-600 hover:via-violet-500 hover:to-purple-500 transition-all duration-200 shadow-xl shadow-violet-900/40 hover:shadow-violet-900/60 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Autenticando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center">
                  <ShieldCheck className="h-5 w-5" />
                  <span>Entrar com Segurança</span>
                </div>
              )}
            </Button>
          </form>
          )}

          {/* Footer */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-700/50">
            <div className="space-y-3">
              <p className="text-center text-xs text-slate-400 font-semibold">
                🔐 Credenciais de Acesso
              </p>
              
              {/* Credencial de TESTE em destaque */}
              <div className="bg-gradient-to-r from-emerald-950/60 to-emerald-900/40 rounded-lg p-4 border-2 border-emerald-600/50 shadow-lg">
                <p className="text-center text-xs font-bold text-emerald-300 mb-2">
                  ✨ TESTE RÁPIDO ✨
                </p>
                <div className="text-center">
                  <p className="text-sm font-black text-white mb-1">
                    Usuário: <span className="text-emerald-300">teste</span>
                  </p>
                  <p className="text-sm font-black text-white">
                    Senha: <span className="text-emerald-300">123</span>
                  </p>
                </div>
              </div>

              {/* Credenciais de produção */}
              <div className="bg-slate-900/40 rounded-lg p-3 border border-slate-700/30">
                <p className="text-[11px] text-slate-400 mb-2">
                  <span className="font-bold text-violet-400">admin</span> / adielsonA@2005!
                </p>
                <p className="text-[11px] text-slate-400">
                  <span className="font-bold text-violet-400">gerente</span> / gerente@A2005!
                </p>
              </div>
              
              <p className="text-center text-[10px] text-amber-400">
                ⚠️ ALTERE AS SENHAS NO ARQUIVO secureAuth.ts
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-slate-400">
          <p>© 2025 Prefeitura Municipal • Sistema de Vigilância</p>
        </div>
      </div>
    </div>
  );
}

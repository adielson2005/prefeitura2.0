import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { login as saveLogin, touch } from "@/lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simular verificação de credenciais
    if (!email || !password) {
      setError("Preencha todos os campos");
      setIsLoading(false);
      return;
    }

    // Simular delay de requisição
    setTimeout(() => {
      // Validação simples de email
      if (email.includes("@")) {
        // Armazenar token simulado usando utilitário
        const simulated = "simulated-token-" + Date.now();
        saveLogin(simulated, email);
        touch();
        navigate("/");
      } else {
        setError("Email inválido");
      }
      setIsLoading(false);
    }, 1000);
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
              <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-white font-bold" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Sistema de Vigilância</h1>
          <p className="text-sm sm:text-base text-slate-400 font-semibold">Prefeitura Municipal</p>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-2xl border border-slate-700/40 shadow-2xl shadow-slate-900/20 p-6 sm:p-10 relative overflow-hidden">
          {/* Linha de brilho no topo */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-600/30 to-transparent"></div>

          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Bem-vindo</h2>
          <p className="text-sm sm:text-base text-slate-400 mb-8 sm:mb-10">Faça login com suas credenciais</p>

          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm sm:text-base font-bold text-slate-200 mb-2.5">
                Email do Gerente
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-slate-300 transition-colors" />
                <input
                  type="email"
                  placeholder="seu.email@prefeitura.gov.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-lg border border-slate-700/40 bg-slate-800/40 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500/50 transition-all shadow-md hover:bg-slate-800/50"
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 sm:py-3.5 rounded-lg border border-slate-700/40 bg-slate-800/40 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500/50 transition-all shadow-md hover:bg-slate-800/50"
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
              <div className="p-3.5 rounded-lg bg-gradient-to-r from-red-950/60 to-red-900/40 border border-red-700/50 text-red-300 text-sm sm:text-base font-semibold shadow-lg">
                {error}
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border border-slate-700 bg-slate-800/50 text-slate-400 focus:ring-2 focus:ring-slate-500/40 cursor-pointer"
                />
                <span className="text-slate-400 group-hover:text-slate-300 transition-colors">
                  Lembrar-me
                </span>
              </label>
              <a href="#" className="text-slate-400 hover:text-slate-300 font-semibold transition-colors">
                Esqueceu a senha?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-3.5 rounded-lg bg-gradient-to-r from-slate-700 to-slate-600 text-white font-black hover:from-slate-600 hover:to-slate-500 transition-all duration-200 shadow-lg shadow-slate-900/40 hover:shadow-slate-900/60 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">Autenticando...</span>
                  <span className="sm:hidden">Entrando...</span>
                </div>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-700/50">
            <p className="text-center text-[10px] sm:text-sm text-slate-400">
              Credenciais de teste: qualquer@email.com / qualquer senha
            </p>
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

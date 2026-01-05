import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Lock, Shield, AlertCircle, CheckCircle2, Eye, EyeOff, Clock, Smartphone } from "lucide-react";

export default function Seguranca() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<'success' | 'error' | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    if (!current || !next) {
      setMsg('Preencha todos os campos');
      setMsgType('error');
      return;
    }
    if (next.length < 8) {
      setMsg('Senha deve ter pelo menos 8 caracteres');
      setMsgType('error');
      return;
    }
    if (next !== confirm) {
      setMsg('As senhas não correspondem');
      setMsgType('error');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    localStorage.setItem('passwordChangedAt', Date.now().toString());
    setMsg('✓ Senha alterada com sucesso');
    setMsgType('success');
    setCurrent('');
    setNext('');
    setConfirm('');
    setLoading(false);

    setTimeout(() => setMsg(null), 3000);
  };

  const lastChange = localStorage.getItem('passwordChangedAt');
  const lastChangeDate = lastChange ? new Date(parseInt(lastChange)).toLocaleDateString('pt-BR') : 'Nunca';

  return (
    <AppLayout title="Segurança" subtitle="Gerencie sua senha e autenticação">
      <div className="max-w-3xl space-y-6">
        {/* Status de Segurança */}
        <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 sm:p-8 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-emerald-600/20 border border-emerald-500/50 flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">Sua conta está segura</h3>
              <p className="text-sm text-slate-400 mb-4">Última alteração de senha: <strong className="text-slate-200">{lastChangeDate}</strong></p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">✓ Conta verificada</Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/50">✓ Autenticação ativa</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Alterar Senha */}
        <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 sm:p-8 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Alterar Senha</h2>
          </div>

          <div className="space-y-5">
            {/* Senha Atual */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2.5">Senha Atual</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showCurrent ? "text" : "password"}
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="Digite sua senha atual"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Nova Senha */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2.5">Nova Senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showNext ? "text" : "password"}
                  value={next}
                  onChange={(e) => setNext(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="Digite sua nova senha (mínimo 8 caracteres)"
                />
                <button
                  type="button"
                  onClick={() => setShowNext(!showNext)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showNext ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2">Mínimo 8 caracteres, incluindo letras e números</p>
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2.5">Confirmar Nova Senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="Confirme a sua nova senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Requisitos de Força */}
            {next && (
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 space-y-2">
                <p className="text-xs font-semibold text-slate-300">Força da senha:</p>
                <div className="space-y-1 text-xs">
                  <div className={`flex items-center gap-2 ${next.length >= 8 ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <span>{next.length >= 8 ? '✓' : '○'}</span> Mínimo 8 caracteres
                  </div>
                  <div className={`flex items-center gap-2 ${/[a-z]/.test(next) ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <span>{/[a-z]/.test(next) ? '✓' : '○'}</span> Letras minúsculas
                  </div>
                  <div className={`flex items-center gap-2 ${/[A-Z]/.test(next) ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <span>{/[A-Z]/.test(next) ? '✓' : '○'}</span> Letras maiúsculas
                  </div>
                  <div className={`flex items-center gap-2 ${/[0-9]/.test(next) ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <span>{/[0-9]/.test(next) ? '✓' : '○'}</span> Números
                  </div>
                </div>
              </div>
            )}

            {/* Mensagens */}
            {msg && (
              <div className={`p-3 rounded-lg border flex items-center gap-2 ${
                msgType === 'success'
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-red-500/20 border-red-500/50 text-red-300'
              }`}>
                {msgType === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                )}
                <span className="text-sm font-medium">{msg}</span>
              </div>
            )}

            {/* Botão */}
            <Button
              onClick={handleChange}
              disabled={loading}
              className="w-full px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? '⏳ Alterando...' : '✓ Alterar Senha'}
            </Button>
          </div>
        </div>

        {/* Dispositivos Conectados */}
        <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 sm:p-8 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Smartphone className="h-5 w-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Dispositivos Conectados</h2>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Navegador - Windows 10</p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" /> Ativo agora
                </p>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">Atual</Badge>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

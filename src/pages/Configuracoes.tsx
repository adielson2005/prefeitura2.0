import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Settings, 
  User,
  Bell,
  Shield,
  Database,
  Clock,
  Palette,
  Globe,
  Key,
  Mail,
  ChevronRight,
  Sun,
  Moon,
  Download,
  Upload,
  X,
  Check,
  Trash2,
  Plus,
  Save
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useToast } from "@/hooks/use-toast";

export default function Configuracoes() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  // Estados dos dialogs
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [turnosDialogOpen, setTurnosDialogOpen] = useState(false);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [idiomaDialogOpen, setIdiomaDialogOpen] = useState(false);
  const [permissoesDialogOpen, setPermissoesDialogOpen] = useState(false);
  const [avancadasDialogOpen, setAvancadasDialogOpen] = useState(false);

  // Estado do Tema
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark' | 'auto') || 'dark';
  });

  // Estado de Notificações por Email
  const [emailNotifications, setEmailNotifications] = useState({
    pontoRegistrado: true,
    faltasDetectadas: true,
    relatoriosMensais: false,
    alertasImportantes: true,
    email: localStorage.getItem('userEmail') || ''
  });

  // Estado de Turnos
  const [turnos, setTurnos] = useState([
    { id: 1, nome: 'Manhã', inicio: '08:00', fim: '12:00' },
    { id: 2, nome: 'Tarde', inicio: '13:00', fim: '17:00' },
    { id: 3, nome: 'Noite', inicio: '18:00', fim: '22:00' }
  ]);
  const [novoTurno, setNovoTurno] = useState({ nome: '', inicio: '', fim: '' });

  // Estado de Idioma
  const [idioma, setIdioma] = useState(localStorage.getItem('idioma') || 'pt-BR');

  // Estado de Permissões
  const [permissoes, setPermissoes] = useState({
    admin: { criar: true, editar: true, deletar: true, visualizar: true },
    supervisor: { criar: true, editar: true, deletar: false, visualizar: true },
    vigilante: { criar: false, editar: false, deletar: false, visualizar: true }
  });

  // Estado de Configurações Avançadas
  const [configAvancadas, setConfigAvancadas] = useState({
    modoDebug: false,
    cacheAutomatico: true,
    sincronizacaoAuto: true,
    compressaoDados: false,
    logAtividades: true,
    tempoSessao: '30'
  });

  // Settings sections - criado dentro do componente para acessar estado
  const settingsSections = [
    {
      title: "Conta",
      items: [
        { icon: User, label: "Perfil do Usuário", description: "Gerencie suas informações pessoais", badge: null, action: 'perfil' },
        { icon: Key, label: "Segurança", description: "Senha e autenticação", badge: null, action: 'seguranca' },
        { icon: Mail, label: "Notificações por E-mail", description: "Configure alertas por e-mail", badge: emailNotifications.pontoRegistrado || emailNotifications.faltasDetectadas ? "Ativo" : null, action: 'email' },
      ]
    },
    {
      title: "Sistema",
      items: [
        { icon: Bell, label: "Notificações", description: "Alertas e avisos do sistema", badge: null, action: 'notificacoes' },
        { icon: Clock, label: "Horários e Turnos", description: "Configure os turnos padrão", badge: `${turnos.length} turnos`, action: 'turnos' },
        { icon: Database, label: "Backup de Dados", description: "Exportar e importar dados", badge: "Último: hoje", action: 'backup' },
      ]
    },
    {
      title: "Aparência",
      items: [
        { icon: Palette, label: "Tema", description: "Claro, escuro ou automático", badge: theme === 'light' ? 'Claro' : theme === 'dark' ? 'Escuro' : 'Auto', action: 'theme' },
        { icon: Globe, label: "Idioma e Região", description: "Português (Brasil)", badge: idioma === 'pt-BR' ? '🇧🇷' : idioma === 'en-US' ? '🇺🇸' : idioma === 'es-ES' ? '🇪🇸' : '🇫🇷', action: 'idioma' },
      ]
    },
    {
      title: "Administração",
      items: [
        { icon: Shield, label: "Permissões", description: "Gerencie níveis de acesso", badge: null, action: 'permissoes' },
        { icon: Settings, label: "Configurações Avançadas", description: "Opções do sistema", badge: configAvancadas.modoDebug ? 'Debug ON' : null, action: 'avancadas' },
      ]
    },
  ];

  // Aplicar tema
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
    } else if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      // Auto - baseado na preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleNavigate = (action: string) => {
    switch(action) {
      case 'perfil': navigate('/perfil'); break;
      case 'seguranca': navigate('/seguranca'); break;
      case 'notificacoes': navigate('/notificacoes'); break;
      case 'email': setEmailDialogOpen(true); break;
      case 'turnos': setTurnosDialogOpen(true); break;
      case 'backup': handleBackup(); break;
      case 'theme': setThemeDialogOpen(true); break;
      case 'idioma': setIdiomaDialogOpen(true); break;
      case 'permissoes': setPermissoesDialogOpen(true); break;
      case 'avancadas': setAvancadasDialogOpen(true); break;
    }
  };

  const handleSaveEmailNotifications = async () => {
    setIsLoading(true);
    setLoadingMessage('Salvando configurações de e-mail...');
    
    await new Promise(r => setTimeout(r, 800));
    
    localStorage.setItem('emailNotifications', JSON.stringify(emailNotifications));
    setEmailDialogOpen(false);
    setIsLoading(false);
    
    toast({
      title: "✓ Sucesso!",
      description: "Configurações de e-mail salvas com sucesso.",
      variant: "default",
    });
  };

  const handleAddTurno = () => {
    if (novoTurno.nome && novoTurno.inicio && novoTurno.fim) {
      setTurnos([...turnos, { ...novoTurno, id: Date.now() }]);
      setNovoTurno({ nome: '', inicio: '', fim: '' });
    }
  };

  const handleDeleteTurno = (id: number) => {
    setTurnos(turnos.filter(t => t.id !== id));
  };

  const handleSaveTurnos = async () => {
    setIsLoading(true);
    setLoadingMessage('Salvando turnos...');
    
    await new Promise(r => setTimeout(r, 800));
    
    localStorage.setItem('turnos', JSON.stringify(turnos));
    setTurnosDialogOpen(false);
    setIsLoading(false);
    
    toast({
      title: "✓ Sucesso!",
      description: `${turnos.length} turnos salvos com sucesso.`,
      variant: "default",
    });
  };

  const handleSaveTheme = async () => {
    setIsLoading(true);
    setLoadingMessage('Aplicando tema...');
    
    await new Promise(r => setTimeout(r, 600));
    
    setThemeDialogOpen(false);
    setIsLoading(false);
    
    const themeName = theme === 'light' ? 'Claro' : theme === 'dark' ? 'Escuro' : 'Automático';
    toast({
      title: "✓ Tema Aplicado!",
      description: `Tema ${themeName} ativado com sucesso.`,
      variant: "default",
    });
  };

  const handleSaveIdioma = async () => {
    setIsLoading(true);
    setLoadingMessage('Alterando idioma...');
    
    await new Promise(r => setTimeout(r, 800));
    
    localStorage.setItem('idioma', idioma);
    setIdiomaDialogOpen(false);
    setIsLoading(false);
    
    const idiomaName = idioma === 'pt-BR' ? 'Português (Brasil)' : idioma === 'en-US' ? 'English' : idioma === 'es-ES' ? 'Español' : 'Français';
    toast({
      title: "✓ Idioma Alterado!",
      description: `Idioma ${idiomaName} configurado com sucesso.`,
      variant: "default",
    });
  };

  const handleSavePermissoes = async () => {
    setIsLoading(true);
    setLoadingMessage('Atualizando permissões...');
    
    await new Promise(r => setTimeout(r, 900));
    
    localStorage.setItem('permissoes', JSON.stringify(permissoes));
    setPermissoesDialogOpen(false);
    setIsLoading(false);
    
    toast({
      title: "✓ Permissões Atualizadas!",
      description: "Níveis de acesso configurados com sucesso.",
      variant: "default",
    });
  };

  const handleSaveConfigAvancadas = async () => {
    setIsLoading(true);
    setLoadingMessage('Salvando configurações avançadas...');
    
    await new Promise(r => setTimeout(r, 1000));
    
    localStorage.setItem('configAvancadas', JSON.stringify(configAvancadas));
    setAvancadasDialogOpen(false);
    setIsLoading(false);
    
    toast({
      title: "✓ Configurações Salvas!",
      description: "Suas configurações avançadas foram aplicadas.",
      variant: "default",
    });
  };

  const handleBackup = async () => {
    setIsLoading(true);
    setLoadingMessage('Exportando dados...');
    setBackupStatus('Exportando dados...');
    await new Promise(r => setTimeout(r, 1500));
    
    const data = {
      timestamp: new Date().toISOString(),
      user: localStorage.getItem('userEmail'),
      backup: 'Backup simulado do sistema'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_${new Date().getTime()}.json`;
    link.click();
    
    setIsLoading(false);
    setBackupStatus('✓ Backup exportado com sucesso!');
    setTimeout(() => setBackupStatus(null), 3000);
    
    toast({
      title: "✓ Backup Concluído!",
      description: "Seus dados foram exportados com sucesso.",
      variant: "default",
    });
  };

  return (
    <AppLayout 
      title="Configurações" 
      subtitle="Gerencie as configurações do sistema"
    >
      <div className="max-w-4xl space-y-6">
        {/* Status Geral */}
        <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Sistema Online</h3>
              <p className="text-sm text-slate-400 mt-1">Todas as funcionalidades estão disponíveis</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-emerald-600/20 border border-emerald-500/50 flex items-center justify-center">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
          </div>
        </div>

        {settingsSections.map((section, sectionIndex) => (
          <div
            key={section.title}
            className="bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden shadow-lg transition-all hover:border-slate-600/50"
          >
            <div className="px-6 py-4 bg-gradient-to-r from-slate-800/50 to-slate-900/30 border-b border-slate-700/50">
              <h3 className="font-bold text-white text-lg">{section.title}</h3>
            </div>
            <div className="divide-y divide-slate-700/50">
              {section.items.map((item) => {
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavigate(item.action)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-slate-700/30 transition-all duration-200 text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center group-hover:bg-blue-600/30 group-hover:border-blue-500/50 transition-all">
                      <Icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white group-hover:text-blue-300 transition-colors">{item.label}</p>
                      <p className="text-sm text-slate-400">{item.description}</p>
                    </div>
                    {item.badge && (
                      <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/50 mr-2 flex-shrink-0">
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Backup Section */}
        <div className="bg-gradient-to-br from-amber-900/30 via-amber-900/20 to-amber-950/30 backdrop-blur-md rounded-xl border border-amber-700/50 p-6 shadow-lg">
          <div className="flex items-start gap-4 mb-4">
            <Database className="h-6 w-6 text-amber-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-white">Backup & Sincronização</h3>
              <p className="text-sm text-slate-400 mt-1">Faça backup de seus dados ou sincronize com outros dispositivos</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleBackup}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
              disabled={!!backupStatus}
            >
              <Download className="h-4 w-4" />
              {backupStatus || 'Exportar Dados'}
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 px-4 py-2 border border-slate-600 text-slate-300 hover:bg-slate-800/50 rounded-lg transition-all"
            >
              <Upload className="h-4 w-4" />
              Importar Dados
            </Button>
          </div>
        </div>

        {/* Informações do Sistema */}
        <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 shadow-lg">
          <h3 className="font-bold text-white mb-4">Informações do Sistema</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Aplicação:</span>
              <span className="text-white font-medium">Sistema de Vigilância Municipal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Versão:</span>
              <span className="text-white font-medium">2.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ambiente:</span>
              <span className="text-white font-medium">Produção</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Última atualização:</span>
              <span className="text-white font-medium">2 de janeiro de 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Suporte:</span>
              <span className="text-white font-medium">suporte@prefeitura.gov.br</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 text-sm text-slate-400 border-t border-slate-700/50">
          <p>Sistema de Vigilância Municipal v2.0</p>
          <p>© 2024 Prefeitura Municipal • Todos os direitos reservados</p>
        </div>
      </div>

      {/* Dialog: Notificações por E-mail */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-400" />
              Notificações por E-mail
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Configure quais alertas deseja receber por e-mail
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-slate-300">E-mail</Label>
              <Input
                value={emailNotifications.email}
                onChange={(e) => setEmailNotifications({...emailNotifications, email: e.target.value})}
                className="bg-slate-800 border-slate-700 text-white mt-1"
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Ponto registrado</Label>
                <Switch
                  checked={emailNotifications.pontoRegistrado}
                  onCheckedChange={(checked) => setEmailNotifications({...emailNotifications, pontoRegistrado: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Faltas detectadas</Label>
                <Switch
                  checked={emailNotifications.faltasDetectadas}
                  onCheckedChange={(checked) => setEmailNotifications({...emailNotifications, faltasDetectadas: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Relatórios mensais</Label>
                <Switch
                  checked={emailNotifications.relatoriosMensais}
                  onCheckedChange={(checked) => setEmailNotifications({...emailNotifications, relatoriosMensais: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Alertas importantes</Label>
                <Switch
                  checked={emailNotifications.alertasImportantes}
                  onCheckedChange={(checked) => setEmailNotifications({...emailNotifications, alertasImportantes: checked})}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSaveEmailNotifications}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button
                onClick={() => setEmailDialogOpen(false)}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Gerenciar Turnos */}
      <Dialog open={turnosDialogOpen} onOpenChange={setTurnosDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              Gerenciar Turnos
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Configure os turnos padrão do sistema
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Turnos existentes */}
            <div className="space-y-2">
              {turnos.map((turno) => (
                <div key={turno.id} className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-slate-400">Nome</p>
                      <p className="font-medium text-white">{turno.nome}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Início</p>
                      <p className="font-medium text-white">{turno.inicio}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Fim</p>
                      <p className="font-medium text-white">{turno.fim}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDeleteTurno(turno.id)}
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Adicionar novo turno */}
            <div className="border-t border-slate-700 pt-4">
              <p className="text-sm font-medium text-slate-300 mb-3">Adicionar Novo Turno</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs text-slate-400">Nome</Label>
                  <Input
                    value={novoTurno.nome}
                    onChange={(e) => setNovoTurno({...novoTurno, nome: e.target.value})}
                    className="bg-slate-800 border-slate-700 text-white mt-1"
                    placeholder="Ex: Madrugada"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-400">Início</Label>
                  <Input
                    type="time"
                    value={novoTurno.inicio}
                    onChange={(e) => setNovoTurno({...novoTurno, inicio: e.target.value})}
                    className="bg-slate-800 border-slate-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-400">Fim</Label>
                  <Input
                    type="time"
                    value={novoTurno.fim}
                    onChange={(e) => setNovoTurno({...novoTurno, fim: e.target.value})}
                    className="bg-slate-800 border-slate-700 text-white mt-1"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddTurno}
                className="mt-3 w-full bg-green-600 hover:bg-green-700"
                disabled={!novoTurno.nome || !novoTurno.inicio || !novoTurno.fim}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Turno
              </Button>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSaveTurnos}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Turnos
              </Button>
              <Button
                onClick={() => setTurnosDialogOpen(false)}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Tema */}
      <Dialog open={themeDialogOpen} onOpenChange={setThemeDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-blue-400" />
              Tema da Aplicação
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Escolha o tema visual do sistema
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 mt-4">
            <button
              onClick={() => setTheme('light')}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
                theme === 'light' 
                  ? "border-blue-500 bg-blue-950/30" 
                  : "border-slate-700 bg-slate-800 hover:border-slate-600"
              )}
            >
              <Sun className="h-5 w-5 text-yellow-400" />
              <div className="flex-1 text-left">
                <p className="font-medium text-white">Claro</p>
                <p className="text-xs text-slate-400">Tema com fundo claro</p>
              </div>
              {theme === 'light' && <Check className="h-5 w-5 text-blue-400" />}
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
                theme === 'dark' 
                  ? "border-blue-500 bg-blue-950/30" 
                  : "border-slate-700 bg-slate-800 hover:border-slate-600"
              )}
            >
              <Moon className="h-5 w-5 text-blue-400" />
              <div className="flex-1 text-left">
                <p className="font-medium text-white">Escuro</p>
                <p className="text-xs text-slate-400">Tema com fundo escuro</p>
              </div>
              {theme === 'dark' && <Check className="h-5 w-5 text-blue-400" />}
            </button>

            <button
              onClick={() => setTheme('auto')}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
                theme === 'auto' 
                  ? "border-blue-500 bg-blue-950/30" 
                  : "border-slate-700 bg-slate-800 hover:border-slate-600"
              )}
            >
              <Settings className="h-5 w-5 text-purple-400" />
              <div className="flex-1 text-left">
                <p className="font-medium text-white">Automático</p>
                <p className="text-xs text-slate-400">Segue o sistema operacional</p>
              </div>
              {theme === 'auto' && <Check className="h-5 w-5 text-blue-400" />}
            </button>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSaveTheme}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Aplicar Tema
            </Button>
            <Button
              onClick={() => setThemeDialogOpen(false)}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Idioma */}
      <Dialog open={idiomaDialogOpen} onOpenChange={setIdiomaDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-400" />
              Idioma e Região
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Selecione o idioma da interface
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-slate-300">Idioma</Label>
              <Select value={idioma} onValueChange={setIdioma}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="pt-BR" className="text-white hover:bg-slate-700">
                    🇧🇷 Português (Brasil)
                  </SelectItem>
                  <SelectItem value="en-US" className="text-white hover:bg-slate-700">
                    🇺🇸 English (United States)
                  </SelectItem>
                  <SelectItem value="es-ES" className="text-white hover:bg-slate-700">
                    🇪🇸 Español (España)
                  </SelectItem>
                  <SelectItem value="fr-FR" className="text-white hover:bg-slate-700">
                    🇫🇷 Français (France)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-3">
              <p className="text-xs text-blue-300">
                💡 A alteração de idioma será aplicada após recarregar a página
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSaveIdioma}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button
                onClick={() => setIdiomaDialogOpen(false)}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Permissões */}
      <Dialog open={permissoesDialogOpen} onOpenChange={setPermissoesDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              Gerenciar Permissões
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Configure os níveis de acesso para cada tipo de usuário
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Administrador */}
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-400" />
                Administrador
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="admin-criar"
                    checked={permissoes.admin.criar}
                    onCheckedChange={(checked) => setPermissoes({
                      ...permissoes,
                      admin: {...permissoes.admin, criar: checked as boolean}
                    })}
                  />
                  <Label htmlFor="admin-criar" className="text-sm text-slate-300">Criar</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="admin-editar"
                    checked={permissoes.admin.editar}
                    onCheckedChange={(checked) => setPermissoes({
                      ...permissoes,
                      admin: {...permissoes.admin, editar: checked as boolean}
                    })}
                  />
                  <Label htmlFor="admin-editar" className="text-sm text-slate-300">Editar</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="admin-deletar"
                    checked={permissoes.admin.deletar}
                    onCheckedChange={(checked) => setPermissoes({
                      ...permissoes,
                      admin: {...permissoes.admin, deletar: checked as boolean}
                    })}
                  />
                  <Label htmlFor="admin-deletar" className="text-sm text-slate-300">Deletar</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="admin-visualizar"
                    checked={permissoes.admin.visualizar}
                    onCheckedChange={(checked) => setPermissoes({
                      ...permissoes,
                      admin: {...permissoes.admin, visualizar: checked as boolean}
                    })}
                  />
                  <Label htmlFor="admin-visualizar" className="text-sm text-slate-300">Visualizar</Label>
                </div>
              </div>
            </div>

            {/* Supervisor */}
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                Supervisor
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="supervisor-criar"
                    checked={permissoes.supervisor.criar}
                    onCheckedChange={(checked) => setPermissoes({
                      ...permissoes,
                      supervisor: {...permissoes.supervisor, criar: checked as boolean}
                    })}
                  />
                  <Label htmlFor="supervisor-criar" className="text-sm text-slate-300">Criar</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="supervisor-editar"
                    checked={permissoes.supervisor.editar}
                    onCheckedChange={(checked) => setPermissoes({
                      ...permissoes,
                      supervisor: {...permissoes.supervisor, editar: checked as boolean}
                    })}
                  />
                  <Label htmlFor="supervisor-editar" className="text-sm text-slate-300">Editar</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="supervisor-deletar"
                    checked={permissoes.supervisor.deletar}
                    onCheckedChange={(checked) => setPermissoes({
                      ...permissoes,
                      supervisor: {...permissoes.supervisor, deletar: checked as boolean}
                    })}
                  />
                  <Label htmlFor="supervisor-deletar" className="text-sm text-slate-300">Deletar</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="supervisor-visualizar"
                    checked={permissoes.supervisor.visualizar}
                    onCheckedChange={(checked) => setPermissoes({
                      ...permissoes,
                      supervisor: {...permissoes.supervisor, visualizar: checked as boolean}
                    })}
                  />
                  <Label htmlFor="supervisor-visualizar" className="text-sm text-slate-300">Visualizar</Label>
                </div>
              </div>
            </div>

            {/* Vigilante */}
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                Vigilante
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="vigilante-criar"
                    checked={permissoes.vigilante.criar}
                    onCheckedChange={(checked) => setPermissoes({
                      ...permissoes,
                      vigilante: {...permissoes.vigilante, criar: checked as boolean}
                    })}
                  />
                  <Label htmlFor="vigilante-criar" className="text-sm text-slate-300">Criar</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="vigilante-editar"
                    checked={permissoes.vigilante.editar}
                    onCheckedChange={(checked) => setPermissoes({
                      ...permissoes,
                      vigilante: {...permissoes.vigilante, editar: checked as boolean}
                    })}
                  />
                  <Label htmlFor="vigilante-editar" className="text-sm text-slate-300">Editar</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="vigilante-deletar"
                    checked={permissoes.vigilante.deletar}
                    onCheckedChange={(checked) => setPermissoes({
                      ...permissoes,
                      vigilante: {...permissoes.vigilante, deletar: checked as boolean}
                    })}
                  />
                  <Label htmlFor="vigilante-deletar" className="text-sm text-slate-300">Deletar</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="vigilante-visualizar"
                    checked={permissoes.vigilante.visualizar}
                    onCheckedChange={(checked) => setPermissoes({
                      ...permissoes,
                      vigilante: {...permissoes.vigilante, visualizar: checked as boolean}
                    })}
                  />
                  <Label htmlFor="vigilante-visualizar" className="text-sm text-slate-300">Visualizar</Label>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSavePermissoes}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Permissões
              </Button>
              <Button
                onClick={() => setPermissoesDialogOpen(false)}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Configurações Avançadas */}
      <Dialog open={avancadasDialogOpen} onOpenChange={setAvancadasDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-400" />
              Configurações Avançadas
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Opções avançadas do sistema
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
              <div>
                <Label className="text-white font-medium">Modo Debug</Label>
                <p className="text-xs text-slate-400">Ativa logs detalhados no console</p>
              </div>
              <Switch
                checked={configAvancadas.modoDebug}
                onCheckedChange={(checked) => setConfigAvancadas({...configAvancadas, modoDebug: checked})}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
              <div>
                <Label className="text-white font-medium">Cache Automático</Label>
                <p className="text-xs text-slate-400">Armazena dados em cache local</p>
              </div>
              <Switch
                checked={configAvancadas.cacheAutomatico}
                onCheckedChange={(checked) => setConfigAvancadas({...configAvancadas, cacheAutomatico: checked})}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
              <div>
                <Label className="text-white font-medium">Sincronização Automática</Label>
                <p className="text-xs text-slate-400">Sincroniza dados automaticamente</p>
              </div>
              <Switch
                checked={configAvancadas.sincronizacaoAuto}
                onCheckedChange={(checked) => setConfigAvancadas({...configAvancadas, sincronizacaoAuto: checked})}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
              <div>
                <Label className="text-white font-medium">Compressão de Dados</Label>
                <p className="text-xs text-slate-400">Comprime dados antes de enviar</p>
              </div>
              <Switch
                checked={configAvancadas.compressaoDados}
                onCheckedChange={(checked) => setConfigAvancadas({...configAvancadas, compressaoDados: checked})}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
              <div>
                <Label className="text-white font-medium">Log de Atividades</Label>
                <p className="text-xs text-slate-400">Registra ações dos usuários</p>
              </div>
              <Switch
                checked={configAvancadas.logAtividades}
                onCheckedChange={(checked) => setConfigAvancadas({...configAvancadas, logAtividades: checked})}
              />
            </div>

            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
              <Label className="text-white font-medium">Tempo de Sessão (minutos)</Label>
              <p className="text-xs text-slate-400 mb-2">Tempo antes de logout automático</p>
              <Select 
                value={configAvancadas.tempoSessao} 
                onValueChange={(value) => setConfigAvancadas({...configAvancadas, tempoSessao: value})}
              >
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="15" className="text-white hover:bg-slate-700">15 minutos</SelectItem>
                  <SelectItem value="30" className="text-white hover:bg-slate-700">30 minutos</SelectItem>
                  <SelectItem value="60" className="text-white hover:bg-slate-700">1 hora</SelectItem>
                  <SelectItem value="120" className="text-white hover:bg-slate-700">2 horas</SelectItem>
                  <SelectItem value="0" className="text-white hover:bg-slate-700">Nunca</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-amber-950/20 border border-amber-900/50 rounded-lg p-3">
              <p className="text-xs text-amber-300">
                ⚠️ Altere essas configurações apenas se souber o que está fazendo
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSaveConfigAvancadas}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações
              </Button>
              <Button
                onClick={() => setAvancadasDialogOpen(false)}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Loading Overlay */}
      <LoadingOverlay isLoading={isLoading} message={loadingMessage} />
    </AppLayout>
  );
}

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
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const settingsSections = [
  {
    title: "Conta",
    items: [
      { icon: User, label: "Perfil do Usuário", description: "Gerencie suas informações pessoais", badge: null },
      { icon: Key, label: "Segurança", description: "Senha e autenticação", badge: null },
      { icon: Mail, label: "Notificações por E-mail", description: "Configure alertas por e-mail", badge: "3 pendentes" },
    ]
  },
  {
    title: "Sistema",
    items: [
      { icon: Bell, label: "Notificações", description: "Alertas e avisos do sistema", badge: null },
      { icon: Clock, label: "Horários e Turnos", description: "Configure os turnos padrão", badge: null },
      { icon: Database, label: "Backup de Dados", description: "Exportar e importar dados", badge: "Último: hoje" },
    ]
  },
  {
    title: "Aparência",
    items: [
      { icon: Palette, label: "Tema", description: "Claro, escuro ou automático", badge: "Claro" },
      { icon: Globe, label: "Idioma e Região", description: "Português (Brasil)", badge: null },
    ]
  },
  {
    title: "Administração",
    items: [
      { icon: Shield, label: "Permissões", description: "Gerencie níveis de acesso", badge: null },
      { icon: Settings, label: "Configurações Avançadas", description: "Opções do sistema", badge: null },
    ]
  },
];

export default function Configuracoes() {
  const navigate = useNavigate();
  
  const handleNavigate = (label: string) => {
    const key = label.toLowerCase();
    if (key.includes('perfil')) return navigate('/perfil');
    if (key.includes('seguran')) return navigate('/seguranca');
    if (key.includes('notifica')) return navigate('/notificacoes');
    if (key.includes('backup')) return alert('Exportar/Importar - função simulada');
    if (key.includes('tema')) return alert('Trocar tema - função simulada');
    return navigate('/configuracoes');
  };

  return (
    <AppLayout 
      title="Configurações" 
      subtitle="Gerencie as configurações do sistema"
    >
      <div className="max-w-3xl space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <div
            key={section.title}
            className="card-institutional overflow-hidden animate-slide-up"
            style={{ animationDelay: `${sectionIndex * 100}ms` }}
          >
            <div className="px-5 py-3 bg-muted/50 border-b border-border">
              <h3 className="font-semibold text-foreground">{section.title}</h3>
            </div>
            <div className="divide-y divide-border">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavigate(item.label)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    {item.badge && (
                      <Badge variant="secondary" className="mr-2">
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Version Info */}
        <div className="text-center py-6 text-sm text-muted-foreground">
          <p>Sistema de Vigilância Municipal</p>
          <p>Versão 1.0.0 • © 2024 Prefeitura Municipal</p>
        </div>
      </div>
    </AppLayout>
  );
}

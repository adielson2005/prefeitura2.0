import { AppLayout } from "@/components/layout/AppLayout";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, FileText, Users, Calendar, BarChart3, MapPin, ArrowRight, Clock, Bell, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { searchService, SearchResult } from "@/lib/searchService";

const getIconForType = (type: string) => {
  switch (type) {
    case 'professional': return Users;
    case 'activity': return Clock;
    case 'leave': return Calendar;
    case 'area': return MapPin;
    case 'timerecord': return FileText;
    case 'notification': return Bell;
    default: return Search;
  }
};

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    professional: 'Profissional',
    activity: 'Atividade',
    leave: 'Folga',
    area: 'Área',
    timerecord: 'Registro de Ponto',
    notification: 'Notificação'
  };
  return labels[type] || type;
};

export default function Buscar() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const q = params.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(q);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q) {
      performSearch(q);
    }
  }, [q]);

  const performSearch = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const searchResults = await searchService.search(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Erro na busca:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchTerm)}`);
      performSearch(searchTerm);
    }
  };

  // Agrupar por tipo
  const grouped = results.reduce((acc, item) => {
    const typeLabel = getTypeLabel(item.type);
    if (!acc[typeLabel]) acc[typeLabel] = [];
    acc[typeLabel].push(item);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <AppLayout title="Buscar" subtitle={q ? `Resultados para "${q}"` : "Pesquise por profissionais, escalas, áreas ou relatórios"}>
      <div className="max-w-4xl space-y-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <div className="bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-4 shadow-lg">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar profissionais, escalas, áreas, relatórios..."
                className="w-full pl-11 pr-12 py-3 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-base"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-all text-sm font-semibold"
              >
                Buscar
              </button>
            </div>
          </div>
        </form>

        {/* Resultados */}
        {searchTerm ? (
          <>
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-3 animate-spin" />
                <p className="text-slate-400 font-medium text-lg">Buscando...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-slate-500 mx-auto mb-3 opacity-50" />
                <p className="text-slate-400 font-medium text-lg">Nenhum resultado encontrado</p>
                <p className="text-slate-500 text-sm mt-2">Tente outra busca ou navegue pelas seções principais</p>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-slate-400 text-sm">
                  <strong className="text-white">{results.length}</strong> resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
                </p>
                
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category} className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">{category}</h3>
                    <div className="space-y-2">
                      {items.map(result => {
                        const IconComponent = getIconForType(result.type);
                        return (
                          <div
                            key={`${result.type}-${result.id}`}
                            onClick={() => result.url && navigate(result.url)}
                            className="p-4 rounded-lg bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md border border-slate-700/50 hover:border-blue-500/50 transition-all cursor-pointer group hover:shadow-lg"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex gap-3 flex-1 min-w-0">
                                <div className="h-10 w-10 rounded-lg bg-blue-600/20 border border-blue-500/50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/30">
                                  <IconComponent className="h-5 w-5 text-blue-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-white group-hover:text-blue-300 transition-colors">{result.title}</p>
                                  <p className="text-sm text-slate-400">{result.subtitle}</p>
                                  {result.description && (
                                    <p className="text-xs text-slate-500 mt-1">{result.description}</p>
                                  )}
                                  <span className="inline-block mt-2 text-xs px-2.5 py-1 rounded-full bg-slate-700/50 text-slate-300">
                                    {getTypeLabel(result.type)}
                                  </span>
                                </div>
                              </div>
                              <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-1" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-lg bg-gradient-to-br from-blue-900/30 via-blue-900/20 to-blue-950/30 backdrop-blur-md border border-blue-700/50">
                <Users className="h-8 w-8 text-blue-400 mb-2" />
                <p className="text-sm font-semibold text-white">Profissionais</p>
                <p className="text-xs text-slate-400 mt-1">Busque por vigias, vigilantes, guardas...</p>
              </div>
              <div className="p-6 rounded-lg bg-gradient-to-br from-emerald-900/30 via-emerald-900/20 to-emerald-950/30 backdrop-blur-md border border-emerald-700/50">
                <Calendar className="h-8 w-8 text-emerald-400 mb-2" />
                <p className="text-sm font-semibold text-white">Escalas</p>
                <p className="text-xs text-slate-400 mt-1">Encontre escalas e turnos</p>
              </div>
              <div className="p-6 rounded-lg bg-gradient-to-br from-amber-900/30 via-amber-900/20 to-amber-950/30 backdrop-blur-md border border-amber-700/50">
                <MapPin className="h-8 w-8 text-amber-400 mb-2" />
                <p className="text-sm font-semibold text-white">Áreas</p>
                <p className="text-xs text-slate-400 mt-1">Localize áreas de vigilância</p>
              </div>
              <div className="p-6 rounded-lg bg-gradient-to-br from-purple-900/30 via-purple-900/20 to-purple-950/30 backdrop-blur-md border border-purple-700/50">
                <FileText className="h-8 w-8 text-purple-400 mb-2" />
                <p className="text-sm font-semibold text-white">Relatórios</p>
                <p className="text-xs text-slate-400 mt-1">Procure por relatórios</p>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/30 border border-slate-700/50 text-center">
              <p className="text-slate-300 text-sm">Digite algo no campo de busca acima para começar</p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

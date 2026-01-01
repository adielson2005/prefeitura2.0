import { AppLayout } from "@/components/layout/AppLayout";
import { useSearchParams } from "react-router-dom";

const SAMPLE_RESULTS = [
  { id: '1', title: 'Carlos Silva — Sede Principal', type: 'Profissional' },
  { id: '2', title: 'Maria Santos — Anexo I', type: 'Profissional' },
  { id: '3', title: 'Escala: Turno A — Sede Principal', type: 'Escala' },
  { id: '4', title: 'Relatório Diário', type: 'Relatório' },
];

export default function Buscar() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const results = q ? SAMPLE_RESULTS.filter(r => r.title.toLowerCase().includes(q.toLowerCase())) : [];

  return (
    <AppLayout title="Buscar" subtitle={`Resultados para "${q}"`}>
      <div className="max-w-3xl space-y-4">
        {q ? (
          results.length ? (
            <div className="space-y-2">
              {results.map(r => (
                <div key={r.id} className="p-3 rounded-lg border bg-white/50">{r.title} <span className="text-xs text-muted-foreground">{r.type}</span></div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground">Nenhum resultado encontrado</div>
          )
        ) : (
          <div className="p-6 text-center text-muted-foreground">Digite algo no campo de busca no header e pressione Enter</div>
        )}
      </div>
    </AppLayout>
  );
}

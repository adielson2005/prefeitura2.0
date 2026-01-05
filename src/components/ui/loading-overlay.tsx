import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ isLoading, message, className }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200",
      className
    )}>
      <div className="bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-950/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner animado com efeito de glow */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-2xl animate-pulse"></div>
            <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl"></div>
            
            {/* Spinner principal */}
            <Loader2 className="h-12 w-12 text-blue-400 animate-spin relative z-10" strokeWidth={2.5} />
            
            {/* Círculo decorativo externo */}
            <div className="absolute inset-[-8px] rounded-full border-2 border-blue-500/20 animate-ping"></div>
          </div>
          
          {/* Mensagem */}
          {message && (
            <div className="text-center space-y-3">
              <p className="text-lg font-semibold text-white">{message}</p>
              
              {/* Dots animados */}
              <div className="flex gap-1.5 justify-center">
                <span 
                  className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" 
                  style={{ animationDelay: '0ms', animationDuration: '1s' }}
                ></span>
                <span 
                  className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" 
                  style={{ animationDelay: '150ms', animationDuration: '1s' }}
                ></span>
                <span 
                  className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" 
                  style={{ animationDelay: '300ms', animationDuration: '1s' }}
                ></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

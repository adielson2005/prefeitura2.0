import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  badge?: string;
  progress?: number;
  className?: string;
}

const variantStyles = {
  default: "bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md border-gradient",
  primary: "bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md border-gradient",
  success: "bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md border-gradient",
  warning: "bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md border-gradient",
  danger: "bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/30 backdrop-blur-md border-gradient",
};

const borderVariantStyles = {
  default: "border-slate-700/40 hover:border-slate-600/50 shadow-md",
  primary: "border-l-4 border-t border-r border-b border-l-violet-500/50 border-t-slate-700/40 border-r-slate-700/40 border-b-slate-700/40 hover:border-l-violet-400/70 shadow-lg shadow-violet-500/8",
  success: "border-l-4 border-t border-r border-b border-l-emerald-500/52 border-t-slate-700/40 border-r-slate-700/40 border-b-slate-700/40 hover:border-l-emerald-400/70 shadow-lg shadow-emerald-500/8",
  warning: "border-l-4 border-t border-r border-b border-l-amber-500/58 border-t-slate-700/45 border-r-slate-700/45 border-b-slate-700/45 hover:border-l-amber-400/75 shadow-lg shadow-amber-500/10",
  danger: "border-l-4 border-t border-r border-b border-l-red-500/65 border-t-slate-700/50 border-r-slate-700/50 border-b-slate-700/50 hover:border-l-red-400/80 shadow-xl shadow-red-500/12",
};

const iconVariantStyles = {
  default: "bg-gradient-to-br from-slate-700/70 to-slate-800/70 text-slate-300 shadow-xl shadow-slate-500/30",
  primary: "bg-gradient-to-br from-violet-600/80 to-purple-700/80 text-white shadow-xl shadow-violet-500/40",
  success: "bg-gradient-to-br from-emerald-600/80 to-green-700/80 text-white shadow-xl shadow-emerald-500/40",
  warning: "bg-gradient-to-br from-amber-500/80 to-orange-600/80 text-white shadow-xl shadow-amber-500/40",
  danger: "bg-gradient-to-br from-red-600/80 to-rose-700/80 text-white shadow-xl shadow-red-500/40",
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  badge,
  progress,
  className,
}: MetricCardProps) {
  return (
    <div className={cn(
      "rounded-xl border p-4 sm:p-5 md:p-6 transition-all duration-300 ease-out hover:scale-[1.015] hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer group overflow-hidden relative",
      variantStyles[variant],
      borderVariantStyles[variant],
      className
    )}>
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-500/0 to-slate-500/0 group-hover:from-slate-400/8 group-hover:to-slate-500/4 transition-all duration-300 pointer-events-none"></div>

      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-slate-450 group-hover:text-slate-350 transition-colors">{title}</p>
            {badge && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-700/60 text-slate-300 border border-slate-600/50">
                {badge}
              </span>
            )}
          </div>
          <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none" style={{letterSpacing: '-1px', fontWeight: 900}}>{value}</p>
          {subtitle && (
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 font-medium">{subtitle}</p>
          )}
          {progress !== undefined && (
            <div className="mt-2">
              <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    variant === "success" && "bg-gradient-to-r from-emerald-500 to-emerald-400",
                    variant === "primary" && "bg-gradient-to-r from-violet-500 to-purple-400",
                    variant === "warning" && "bg-gradient-to-r from-amber-500 to-orange-400",
                    variant === "danger" && "bg-gradient-to-r from-red-500 to-rose-400",
                    variant === "default" && "bg-gradient-to-r from-slate-500 to-slate-400"
                  )}
                  style={{width: `${progress}%`}}
                ></div>
              </div>
            </div>
          )}
        </div>
        <div className={cn("p-3 sm:p-3.5 rounded-xl flex-shrink-0 transform group-hover:scale-[1.08] group-hover:rotate-2 transition-all duration-300 shadow-xl", iconVariantStyles[variant])}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-1.5 relative z-10">
          {trend.isPositive ? (
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-400" />
          )}
          <span className={cn(
            "text-xs sm:text-sm font-bold",
            trend.isPositive ? "text-emerald-400" : "text-red-400"
          )}>
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400">vs. mês anterior</span>
        </div>
      )}
    </div>
  );
}

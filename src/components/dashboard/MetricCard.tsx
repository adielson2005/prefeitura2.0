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
  default: "border-slate-700/50 hover:border-slate-600/50",
  primary: "border-slate-700/50 hover:border-slate-600/50",
  success: "border-slate-700/50 hover:border-slate-600/50",
  warning: "border-slate-700/50 hover:border-slate-600/50",
  danger: "border-slate-700/50 hover:border-slate-600/50",
};

const iconVariantStyles = {
  default: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 text-slate-300 shadow-lg shadow-slate-500/20",
  primary: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 text-slate-300 shadow-lg shadow-slate-500/20",
  success: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 text-slate-300 shadow-lg shadow-slate-500/20",
  warning: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 text-slate-300 shadow-lg shadow-slate-500/20",
  danger: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 text-slate-300 shadow-lg shadow-slate-500/20",
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: MetricCardProps) {
  return (
    <div className={cn(
      "rounded-xl border p-4 sm:p-5 md:p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group overflow-hidden relative",
      variantStyles[variant],
      borderVariantStyles[variant],
      className
    )}>
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-500/0 to-slate-500/0 group-hover:from-slate-500/10 group-hover:to-slate-500/5 transition-all duration-300 pointer-events-none"></div>

      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="space-y-2 flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-300 transition-colors">{title}</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-black text-white">{value}</p>
          {subtitle && (
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={cn("p-3 sm:p-3.5 rounded-xl flex-shrink-0 transform group-hover:scale-125 transition-all shadow-xl", iconVariantStyles[variant])}>
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

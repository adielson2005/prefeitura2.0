/**
 * Componente de Gráfico de Pizza usando Recharts
 */

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PieChartComponentProps {
  data: { name: string; value: number; }[];
  title?: string;
  colors?: string[];
  height?: number;
}

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function PieChartComponent({ 
  data, 
  title,
  colors = DEFAULT_COLORS,
  height = 300
}: PieChartComponentProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-sm font-bold text-slate-300 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#f1f5f9'
            }}
          />
          <Legend 
            wrapperStyle={{ 
              fontSize: '12px',
              color: '#cbd5e1'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

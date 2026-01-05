/**
 * Componente de Gráfico de Barras usando Recharts
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface BarChartComponentProps {
  data: ChartData[];
  dataKey?: string;
  xAxisKey?: string;
  title?: string;
  color?: string;
  height?: number;
}

export function BarChartComponent({ 
  data, 
  dataKey = 'value', 
  xAxisKey = 'name',
  title,
  color = '#3b82f6',
  height = 300
}: BarChartComponentProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-sm font-bold text-slate-300 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis 
            dataKey={xAxisKey} 
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#f1f5f9'
            }}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
          />
          <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

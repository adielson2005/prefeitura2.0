/**
 * Componente de Gráfico de Linha usando Recharts
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LineChartComponentProps {
  data: any[];
  dataKeys: string[];
  xAxisKey?: string;
  title?: string;
  colors?: string[];
  height?: number;
}

export function LineChartComponent({ 
  data, 
  dataKeys,
  xAxisKey = 'name',
  title,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
  height = 300
}: LineChartComponentProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-sm font-bold text-slate-300 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
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
          />
          <Legend 
            wrapperStyle={{ 
              fontSize: '12px',
              color: '#cbd5e1'
            }}
          />
          {dataKeys.map((key, index) => (
            <Line 
              key={key}
              type="monotone" 
              dataKey={key} 
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ fill: colors[index % colors.length], r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

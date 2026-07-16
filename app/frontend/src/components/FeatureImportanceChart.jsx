import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-card px-3.5 py-2.5 text-sm">
      <p className="font-semibold">{d.feature.replace(/_/g, ' ')}</p>
      <p className="text-purple">Importance: {d.importance.toFixed(3)}</p>
    </div>
  );
};

const FeatureImportanceChart = ({ data }) => {
  const chartData = data
    .slice(0, 8)
    .map((d) => ({ ...d, label: d.feature.replace(/_/g, ' ') }))
    .reverse();

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
        <YAxis type="category" dataKey="label" width={140} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139,92,246,0.05)' }} />
        <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={i % 2 === 0 ? '#8B5CF6' : '#06B6D4'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FeatureImportanceChart;

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const METRIC_COLORS = {
  accuracy: '#8B5CF6',
  precision: '#06B6D4',
  recall: '#10B981',
  f1_score: '#F59E0B',
};

const METRIC_LABELS = {
  accuracy: 'Accuracy',
  precision: 'Precision',
  recall: 'Recall',
  f1_score: 'F1 Score',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3.5 py-2.5 text-sm">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.fill }}>
          {METRIC_LABELS[p.dataKey]}: {(p.value * 100).toFixed(1)}%
        </p>
      ))}
    </div>
  );
};

const ModelComparisonChart = ({ data }) => {
  const chartData = data.map((m) => ({ ...m, name: m.display_name }));

  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} angle={-20} textAnchor="end" interval={0} />
        <YAxis domain={[0, 1]} tickFormatter={(v) => `${v * 100}%`} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139,92,246,0.05)' }} />
        <Legend formatter={(value) => METRIC_LABELS[value]} wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="accuracy" fill={METRIC_COLORS.accuracy} radius={[4, 4, 0, 0]} />
        <Bar dataKey="precision" fill={METRIC_COLORS.precision} radius={[4, 4, 0, 0]} />
        <Bar dataKey="recall" fill={METRIC_COLORS.recall} radius={[4, 4, 0, 0]} />
        <Bar dataKey="f1_score" fill={METRIC_COLORS.f1_score} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ModelComparisonChart;

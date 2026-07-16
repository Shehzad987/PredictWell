import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList, ResponsiveContainer } from 'recharts';
import { RISK_COLORS, RISK_ORDER } from '../utils/constants';

const ProbabilityChart = ({ probabilities }) => {
  const data = RISK_ORDER.map((risk) => ({ risk, probability: probabilities[risk] || 0 }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="risk" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
        <YAxis domain={[0, 1]} tickFormatter={(v) => `${v * 100}%`} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
        <Tooltip
          formatter={(value) => `${(value * 100).toFixed(1)}%`}
          contentStyle={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 12 }}
        />
        <Bar dataKey="probability" radius={[6, 6, 0, 0]}>
          {data.map((d) => (
            <Cell key={d.risk} fill={RISK_COLORS[d.risk]} />
          ))}
          <LabelList dataKey="probability" position="top" formatter={(v) => `${(v * 100).toFixed(0)}%`} fill="var(--text)" fontSize={12} fontWeight={600} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProbabilityChart;

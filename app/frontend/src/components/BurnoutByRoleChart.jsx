import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RISK_COLORS } from '../utils/constants';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3.5 py-2.5 text-sm">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.fill }}>
          {p.dataKey}: {p.value}
        </p>
      ))}
    </div>
  );
};

const BurnoutByRoleChart = ({ data }) => {
  const chartData = [...data].sort((a, b) => b.High - a.High);

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
        <YAxis type="category" dataKey="job_role" width={130} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139,92,246,0.05)' }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Low" stackId="a" fill={RISK_COLORS.Low} />
        <Bar dataKey="Medium" stackId="a" fill={RISK_COLORS.Medium} />
        <Bar dataKey="High" stackId="a" fill={RISK_COLORS.High} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BurnoutByRoleChart;

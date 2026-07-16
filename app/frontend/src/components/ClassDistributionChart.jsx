import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RISK_COLORS } from '../utils/constants';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-card px-3.5 py-2.5 text-sm">
      <p className="font-semibold" style={{ color: d.fill }}>{d.risk} Risk</p>
      <p className="text-[var(--text-muted)]">{d.count} employees</p>
    </div>
  );
};

const ClassDistributionChart = ({ data }) => {
  const chartData = data.map((d) => ({ ...d, fill: RISK_COLORS[d.risk] }));
  const total = chartData.reduce((sum, d) => sum + d.count, 0);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="risk"
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={100}
          paddingAngle={3}
          label={({ risk, count }) => `${risk}: ${((count / total) * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {chartData.map((entry) => (
            <Cell key={entry.risk} fill={entry.fill} stroke="var(--bg)" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ClassDistributionChart;

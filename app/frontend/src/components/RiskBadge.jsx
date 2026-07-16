import { RISK_COLORS } from '../utils/constants';

const RiskBadge = ({ risk, size = 'md' }) => {
  const color = RISK_COLORS[risk] || '#94A3B8';
  const sizeClass = size === 'lg' ? 'text-base px-4 py-1.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`badge ${sizeClass} gap-1.5 font-semibold`}
      style={{ backgroundColor: `${color}1A`, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {risk} Risk
    </span>
  );
};

export default RiskBadge;

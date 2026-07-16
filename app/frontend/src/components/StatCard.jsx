const toneClasses = {
  purple: 'bg-purple/10 text-purple',
  cyan: 'bg-cyan/10 text-cyan',
  emerald: 'bg-emerald/10 text-emerald',
  amber: 'bg-amber/10 text-amber',
};

const StatCard = ({ icon: Icon, label, value, tone = 'purple', suffix = '' }) => {
  return (
    <div className="glass-card p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-transform duration-200">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${toneClasses[tone]}`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-display font-bold leading-none truncate">
          {value}
          <span className="text-base font-medium text-[var(--text-muted)]">{suffix}</span>
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-1.5">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;

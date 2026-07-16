import { useState, Fragment } from 'react';

/** Interpolates between cyan (negative) and purple (positive) based on correlation strength. */
const colorForValue = (value) => {
  const intensity = Math.min(Math.abs(value), 1);
  if (value >= 0) {
    return `rgba(139, 92, 246, ${0.15 + intensity * 0.75})`;
  }
  return `rgba(6, 182, 212, ${0.15 + intensity * 0.75})`;
};

const shortLabel = (name) => name.replace(/_/g, ' ').split(' ').map((w) => w.slice(0, 4)).join(' ');

const CorrelationHeatmap = ({ features, matrix }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div
          className="grid gap-0.5"
          style={{ gridTemplateColumns: `120px repeat(${features.length}, minmax(52px, 1fr))` }}
        >
          <div />
          {features.map((f) => (
            <div key={f} className="text-[9px] text-[var(--text-muted)] text-center px-0.5 pb-1.5 leading-tight">
              {shortLabel(f)}
            </div>
          ))}

          {matrix.map((row, i) => (
            <Fragment key={`row-${i}`}>
              <div className="text-[10px] text-[var(--text-muted)] flex items-center pr-2 truncate">
                {features[i].replace(/_/g, ' ')}
              </div>
              {row.map((value, j) => (
                <div
                  key={`${i}-${j}`}
                  onMouseEnter={() => setHovered({ i, j, value })}
                  onMouseLeave={() => setHovered(null)}
                  className="aspect-square rounded flex items-center justify-center text-[9px] font-medium cursor-default transition-transform hover:scale-110 hover:z-10 relative"
                  style={{ backgroundColor: colorForValue(value), color: Math.abs(value) > 0.5 ? '#fff' : 'var(--text)' }}
                >
                  {value.toFixed(1)}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>

      {hovered && (
        <p className="text-xs text-[var(--text-muted)] mt-3">
          <span className="font-medium text-[var(--text)]">{features[hovered.i]}</span> ×{' '}
          <span className="font-medium text-[var(--text)]">{features[hovered.j]}</span>: correlation ={' '}
          <span className="font-semibold text-purple">{hovered.value.toFixed(3)}</span>
        </p>
      )}
    </div>
  );
};

export default CorrelationHeatmap;

const ConfusionMatrix = ({ labels, matrix }) => {
  const maxValue = Math.max(...matrix.flat());

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse mx-auto">
        <thead>
          <tr>
            <th className="p-2" />
            <th colSpan={labels.length} className="text-xs text-[var(--text-muted)] font-medium pb-2">
              Predicted
            </th>
          </tr>
          <tr>
            <th className="p-2" />
            {labels.map((l) => (
              <th key={l} className="text-xs text-[var(--text-muted)] font-medium px-3 pb-2">
                {l}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              {i === 0 && (
                <td rowSpan={matrix.length} className="text-xs text-[var(--text-muted)] font-medium pr-2 [writing-mode:vertical-rl] rotate-180 text-center">
                  Actual
                </td>
              )}
              <td className="text-xs text-[var(--text-muted)] font-medium pr-3 text-right">{labels[i]}</td>
              {row.map((value, j) => {
                const intensity = maxValue ? value / maxValue : 0;
                const isDiagonal = i === j;
                return (
                  <td key={j} className="p-1">
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center font-display font-bold text-lg transition-transform hover:scale-105"
                      style={{
                        backgroundColor: isDiagonal
                          ? `rgba(16, 185, 129, ${0.15 + intensity * 0.7})`
                          : `rgba(239, 68, 68, ${0.08 + intensity * 0.5})`,
                        color: intensity > 0.5 ? '#fff' : 'var(--text)',
                      }}
                    >
                      {value}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-[var(--text-muted)] text-center mt-3">
        Diagonal cells (green) = correct predictions. Off-diagonal (red) = misclassifications.
      </p>
    </div>
  );
};

export default ConfusionMatrix;

const sizes = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-[3px]',
};

const LoadingSpinner = ({ size = 'md', fullScreen = false, label = 'Loading...' }) => {
  const spinner = (
    <div
      className={`${sizes[size]} rounded-full border-purple/20 border-t-purple animate-spin`}
      role="status"
      aria-label={label}
    />
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        {spinner}
        <p className="text-sm text-[var(--text-muted)]">{label}</p>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;

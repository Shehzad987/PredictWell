import { FiActivity } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="border-t border-[var(--border)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <FiActivity size={15} className="text-purple" />
          <span>PredictWell — AI Burnout Risk Intelligence</span>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          Built for HR teams. Predictions support, not replace, professional judgment.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

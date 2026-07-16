import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiTrash2, FiDownload, FiClock, FiInbox } from 'react-icons/fi';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import predictionService from '../services/predictionService';
import { formatDateTime } from '../utils/constants';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const loadHistory = () => {
    predictionService
      .getHistory(100)
      .then((data) => setHistory(data.history))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClear = async () => {
    if (!confirm('Clear all prediction history? This cannot be undone.')) return;
    setClearing(true);
    try {
      await predictionService.clearHistory();
      setHistory([]);
      toast.success('History cleared');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setClearing(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen label="Loading prediction history..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-heading">Prediction History</h1>
          <p className="text-[var(--text-muted)] mt-2">Every burnout risk assessment made in this session.</p>
        </div>
        {history.length > 0 && (
          <button onClick={handleClear} disabled={clearing} className="btn-outline hover:text-danger hover:border-danger/40">
            <FiTrash2 size={15} /> Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <FiInbox size={40} className="mx-auto text-[var(--text-muted)] mb-4" />
          <h3 className="font-display font-semibold mb-2">No predictions yet</h3>
          <p className="text-sm text-[var(--text-muted)] mb-6">Run your first burnout risk prediction to see it here.</p>
          <Link to="/predict" className="btn-primary mx-auto w-fit">Go to Prediction Center</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((entry) => (
            <Link
              key={entry.id}
              to={`/results/${entry.id}`}
              state={{ prediction: entry }}
              className="glass-card p-4 sm:p-5 flex flex-wrap items-center gap-4 hover:-translate-y-0.5 transition-transform duration-150"
            >
              <RiskBadge risk={entry.risk_level} />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">
                  {entry.employee.Job_Role} · {entry.employee.Age}y · {entry.employee.Remote_or_Onsite}
                </p>
                <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                  <FiClock size={11} /> {formatDateTime(entry.created_at)}
                </p>
              </div>
              <p className="text-xs text-[var(--text-muted)] shrink-0">
                Confidence: <span className="font-semibold text-[var(--text)]">{(entry.confidence * 100).toFixed(0)}%</span>
              </p>
              <a
                href={predictionService.getReportUrl(entry.id)}
                download
                onClick={(e) => e.stopPropagation()}
                className="btn-icon shrink-0"
                aria-label="Download PDF report"
              >
                <FiDownload size={16} />
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;

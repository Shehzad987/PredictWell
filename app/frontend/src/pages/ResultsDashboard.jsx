import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { FiDownload, FiArrowLeft, FiCheckCircle, FiInfo } from 'react-icons/fi';
import RiskBadge from '../components/RiskBadge';
import ProbabilityChart from '../components/ProbabilityChart';
import LoadingSpinner from '../components/LoadingSpinner';
import predictionService from '../services/predictionService';
import { RISK_COLORS, formatDateTime } from '../utils/constants';

const PROFILE_FIELDS = [
  ['Age', 'Age'],
  ['Job_Role', 'Job Role'],
  ['Gender', 'Gender'],
  ['Remote_or_Onsite', 'Work Mode'],
  ['Working_Hours_Per_Day', 'Working Hours/Day'],
  ['Overtime_Hours', 'Overtime Hours'],
  ['Sleep_Hours', 'Sleep Hours'],
  ['Number_of_Projects', 'Projects'],
  ['Work_Life_Balance_Score', 'Work-Life Balance'],
  ['Stress_Level', 'Stress Level'],
  ['Years_of_Experience', 'Experience (yrs)'],
  ['Satisfaction_Level', 'Satisfaction'],
];

const ResultsDashboard = () => {
  const { id } = useParams();
  const location = useLocation();
  const [prediction, setPrediction] = useState(location.state?.prediction || null);
  const [loading, setLoading] = useState(!location.state?.prediction);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (prediction) return;

    predictionService
      .getHistory(200)
      .then((data) => {
        const found = data.history.find((h) => h.id === id);
        if (found) setPrediction(found);
        else setError('Prediction not found — it may have been cleared from history.');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, prediction]);

  if (loading) return <LoadingSpinner fullScreen label="Loading results..." />;

  if (error || !prediction) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-[var(--text-muted)] mb-6">{error}</p>
        <Link to="/predict" className="btn-primary mx-auto w-fit">Make a New Prediction</Link>
      </div>
    );
  }

  const riskColor = RISK_COLORS[prediction.risk_level];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link to="/predict" className="text-xs text-[var(--text-muted)] hover:text-purple flex items-center gap-1 w-fit">
        <FiArrowLeft size={12} /> New Prediction
      </Link>

      {/* Headline result */}
      <div className="glass-card p-8 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: `radial-gradient(circle at 50% 0%, ${riskColor}, transparent 60%)` }}
        />
        <div className="relative">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-3">Predicted Burnout Risk</p>
          <RiskBadge risk={prediction.risk_level} size="lg" />
          <p className="text-[var(--text-muted)] text-sm mt-4">
            Model confidence: <span className="font-semibold text-[var(--text)]">{(prediction.confidence * 100).toFixed(1)}%</span>
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Predicted {formatDateTime(prediction.created_at)}</p>

          <div className="flex justify-center gap-3 mt-6">
            <a href={predictionService.getReportUrl(prediction.id)} download className="btn-primary">
              <FiDownload size={16} /> Export PDF Report
            </a>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Probability breakdown */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold mb-1">Prediction Probability</h2>
          <p className="text-xs text-[var(--text-muted)] mb-4">Likelihood across all three risk tiers</p>
          <ProbabilityChart probabilities={prediction.probabilities} />
        </div>

        {/* Employee profile */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold mb-4">Employee Profile</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {PROFILE_FIELDS.map(([key, label]) => (
              <div key={key}>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">{label}</p>
                <p className="font-medium">{prediction.employee[key]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiCheckCircle className="text-emerald" size={18} />
          <h2 className="font-display font-semibold">AI Recommendations</h2>
        </div>
        <div className="space-y-3">
          {prediction.recommendations.map((rec, i) => (
            <div key={i} className="flex gap-3 p-3.5 rounded-xl bg-white/5 border border-[var(--border)]">
              <FiInfo size={16} className="text-cyan shrink-0 mt-0.5" />
              <p className="text-sm">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiPlay, FiDownload, FiAward, FiAlertTriangle } from 'react-icons/fi';
import ModelComparisonChart from '../components/ModelComparisonChart';
import FeatureImportanceChart from '../components/FeatureImportanceChart';
import ConfusionMatrix from '../components/ConfusionMatrix';
import LoadingSpinner from '../components/LoadingSpinner';
import modelService from '../services/modelService';

const METRIC_CARDS = ['accuracy', 'precision', 'recall', 'f1_score'];

const ModelTraining = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState(false);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  const loadMetrics = () => {
    setLoading(true);
    modelService
      .getMetrics()
      .then((data) => {
        setMetrics(data);
        setSelectedModel(data.best_model);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleTrain = async () => {
    setTraining(true);
    try {
      await modelService.train();
      toast.success('All 5 models trained successfully!');
      loadMetrics();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTraining(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen label="Loading model metrics..." />;

  const selectedResult = metrics?.results_by_model?.[selectedModel];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="section-heading">Model Training</h1>
          <p className="text-[var(--text-muted)] mt-2">Train and compare 5 classification algorithms on the burnout dataset.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleTrain} disabled={training} className="btn-primary">
            <FiPlay size={16} /> {training ? 'Training all models...' : 'Retrain All Models'}
          </button>
          {metrics && (
            <a href={modelService.getDownloadUrl()} download className="btn-outline">
              <FiDownload size={16} /> Download Model (.pkl)
            </a>
          )}
        </div>
      </div>

      {error && !metrics ? (
        <div className="glass-card p-10 text-center">
          <FiAlertTriangle size={36} className="mx-auto text-amber mb-3" />
          <p className="text-[var(--text-muted)]">No trained model found yet. Click "Retrain All Models" to get started.</p>
        </div>
      ) : (
        <>
          {/* Best model banner */}
          <div className="glass-card p-6 flex items-center gap-4 border-purple/30">
            <span className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center shrink-0 shadow-neonPurple">
              <FiAward size={22} className="text-white" />
            </span>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Best Performing Model</p>
              <h2 className="font-display font-bold text-xl gradient-text">{metrics.best_model_display_name}</h2>
            </div>
            <div className="ml-auto grid grid-cols-4 gap-6 text-center">
              {METRIC_CARDS.map((m) => (
                <div key={m}>
                  <p className="font-display font-bold text-lg">
                    {(metrics.results_by_model[metrics.best_model][m] * 100).toFixed(1)}%
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">{m.replace('_', ' ')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Model comparison chart */}
          <div className="glass-card p-6">
            <h2 className="font-display font-semibold mb-1">Model Accuracy Comparison</h2>
            <p className="text-xs text-[var(--text-muted)] mb-4">All 5 algorithms evaluated on the same held-out test set</p>
            <ModelComparisonChart data={metrics.model_comparison} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Feature importance */}
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold mb-1">Feature Importance</h2>
              <p className="text-xs text-[var(--text-muted)] mb-4">What the best model weighs most heavily</p>
              <FeatureImportanceChart data={metrics.feature_importance} />
            </div>

            {/* Confusion matrix with model selector */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h2 className="font-display font-semibold mb-1">Confusion Matrix</h2>
                  <p className="text-xs text-[var(--text-muted)]">Predicted vs. actual on the test set</p>
                </div>
                <select
                  className="input-field w-auto py-1.5 text-xs"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  {metrics.model_comparison.map((m) => (
                    <option key={m.model} value={m.model}>{m.display_name}</option>
                  ))}
                </select>
              </div>
              {selectedResult && (
                <ConfusionMatrix labels={selectedResult.confusion_matrix_labels} matrix={selectedResult.confusion_matrix} />
              )}
            </div>
          </div>

          {/* Full metrics table */}
          <div className="glass-card p-6 overflow-x-auto">
            <h2 className="font-display font-semibold mb-4">Full Metrics Table</h2>
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="text-left text-[var(--text-muted)] text-xs uppercase tracking-wide border-b border-[var(--border)]">
                  <th className="pb-3 pr-4">Model</th>
                  <th className="pb-3 pr-4">Accuracy</th>
                  <th className="pb-3 pr-4">Precision</th>
                  <th className="pb-3 pr-4">Recall</th>
                  <th className="pb-3 pr-4">F1 Score</th>
                </tr>
              </thead>
              <tbody>
                {metrics.model_comparison.map((m) => (
                  <tr key={m.model} className={`border-b border-[var(--border)] last:border-0 ${m.model === metrics.best_model ? 'text-purple font-medium' : ''}`}>
                    <td className="py-3 pr-4">{m.display_name} {m.model === metrics.best_model && '🏆'}</td>
                    <td className="py-3 pr-4">{(m.accuracy * 100).toFixed(1)}%</td>
                    <td className="py-3 pr-4">{(m.precision * 100).toFixed(1)}%</td>
                    <td className="py-3 pr-4">{(m.recall * 100).toFixed(1)}%</td>
                    <td className="py-3 pr-4">{(m.f1_score * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ModelTraining;

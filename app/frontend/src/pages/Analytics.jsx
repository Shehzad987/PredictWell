import { useState, useEffect } from 'react';
import { FiUsers, FiActivity, FiMoon, FiClock, FiAlertTriangle } from 'react-icons/fi';
import StatCard from '../components/StatCard';
import ClassDistributionChart from '../components/ClassDistributionChart';
import CorrelationHeatmap from '../components/CorrelationHeatmap';
import BurnoutByRoleChart from '../components/BurnoutByRoleChart';
import LoadingSpinner from '../components/LoadingSpinner';
import datasetService from '../services/datasetService';

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([datasetService.getSummary(), datasetService.getCharts()])
      .then(([summaryData, chartsData]) => {
        setSummary(summaryData.summary);
        setCharts(chartsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen label="Loading dataset analytics..." />;

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <FiAlertTriangle size={40} className="mx-auto text-amber mb-4" />
        <h2 className="font-display font-bold text-xl mb-2">No trained model found yet</h2>
        <p className="text-[var(--text-muted)] text-sm">{error}</p>
        <p className="text-[var(--text-muted)] text-sm mt-2">
          Run <code className="text-cyan">python src/train.py</code> or visit the Model Training page to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="section-heading">Dataset Analytics</h1>
        <p className="text-[var(--text-muted)] mt-2">Statistical overview of the employee dataset powering the model.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={FiUsers} label="Total Employees" value={summary.total_employees} tone="purple" />
        <StatCard icon={FiActivity} label="Avg. Stress Level" value={summary.avg_stress_level} suffix="/10" tone="amber" />
        <StatCard icon={FiMoon} label="Avg. Sleep Hours" value={summary.avg_sleep_hours} suffix="h" tone="cyan" />
        <StatCard icon={FiClock} label="Avg. Overtime" value={summary.avg_overtime_hours} suffix="h/wk" tone="emerald" />
        <StatCard icon={FiAlertTriangle} label="High Risk Employees" value={summary.high_risk_pct} suffix="%" tone="amber" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold mb-1">Burnout Risk Distribution</h2>
          <p className="text-xs text-[var(--text-muted)] mb-4">Class balance across the full dataset</p>
          <ClassDistributionChart data={charts.class_distribution} />
        </div>

        <div className="glass-card p-6">
          <h2 className="font-display font-semibold mb-1">Correlation Heatmap</h2>
          <p className="text-xs text-[var(--text-muted)] mb-4">How numeric features relate to one another</p>
          <CorrelationHeatmap
            features={charts.correlation_heatmap.features}
            matrix={charts.correlation_heatmap.matrix}
          />
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="font-display font-semibold mb-1">Burnout Risk by Job Role</h2>
        <p className="text-xs text-[var(--text-muted)] mb-4">Which roles show the highest concentration of at-risk employees</p>
        <BurnoutByRoleChart data={charts.burnout_by_role} />
      </div>
    </div>
  );
};

export default Analytics;

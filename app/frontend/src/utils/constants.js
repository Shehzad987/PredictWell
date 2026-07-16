export const RISK_COLORS = {
  Low: '#10B981',
  Medium: '#F59E0B',
  High: '#EF4444',
};

export const RISK_ORDER = ['Low', 'Medium', 'High'];

export const JOB_ROLES = [
  'Software Engineer',
  'Data Analyst',
  'Product Manager',
  'Sales Executive',
  'HR Specialist',
  'Customer Support',
  'Marketing Executive',
  'Operations Manager',
  'Finance Analyst',
  'Designer',
];

export const GENDERS = ['Male', 'Female', 'Other'];
export const WORK_MODES = ['Remote', 'Onsite', 'Hybrid'];

export const MODEL_COLORS = {
  logistic_regression: '#8B5CF6',
  decision_tree: '#06B6D4',
  random_forest: '#10B981',
  knn: '#F59E0B',
  svm: '#EC4899',
};

export const formatPercent = (val) => `${(val * 100).toFixed(1)}%`;

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

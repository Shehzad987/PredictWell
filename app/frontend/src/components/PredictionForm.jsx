import { useState } from 'react';
import { FiActivity } from 'react-icons/fi';
import { JOB_ROLES, GENDERS, WORK_MODES } from '../utils/constants';

const DEFAULT_FORM = {
  Age: 30,
  Gender: 'Female',
  Job_Role: JOB_ROLES[0],
  Working_Hours_Per_Day: 8,
  Number_of_Projects: 3,
  Sleep_Hours: 7,
  Work_Life_Balance_Score: 6,
  Stress_Level: 5,
  Overtime_Hours: 2,
  Years_of_Experience: 4,
  Satisfaction_Level: 6,
  Remote_or_Onsite: 'Hybrid',
};

const SLIDER_FIELDS = [
  { key: 'Working_Hours_Per_Day', label: 'Working Hours / Day', min: 1, max: 16, step: 0.5 },
  { key: 'Number_of_Projects', label: 'Number of Projects', min: 1, max: 15, step: 1 },
  { key: 'Sleep_Hours', label: 'Sleep Hours', min: 0, max: 12, step: 0.5 },
  { key: 'Work_Life_Balance_Score', label: 'Work-Life Balance (1-10)', min: 1, max: 10, step: 0.5 },
  { key: 'Stress_Level', label: 'Stress Level (1-10)', min: 1, max: 10, step: 0.5 },
  { key: 'Overtime_Hours', label: 'Overtime Hours / Week', min: 0, max: 30, step: 0.5 },
  { key: 'Satisfaction_Level', label: 'Satisfaction Level (1-10)', min: 1, max: 10, step: 0.5 },
];

const PredictionForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState(DEFAULT_FORM);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic info */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Age</label>
          <input
            type="number"
            min={18}
            max={75}
            className="input-field"
            value={form.Age}
            onChange={(e) => update('Age', Number(e.target.value))}
          />
        </div>
        <div>
          <label className="label">Years of Experience</label>
          <input
            type="number"
            min={0}
            max={45}
            step={0.5}
            className="input-field"
            value={form.Years_of_Experience}
            onChange={(e) => update('Years_of_Experience', Number(e.target.value))}
          />
        </div>
        <div>
          <label className="label">Gender</label>
          <select className="input-field" value={form.Gender} onChange={(e) => update('Gender', e.target.value)}>
            {GENDERS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Job Role</label>
          <select className="input-field" value={form.Job_Role} onChange={(e) => update('Job_Role', e.target.value)}>
            {JOB_ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label">Work Mode</label>
          <div className="flex gap-2">
            {WORK_MODES.map((mode) => (
              <button
                type="button"
                key={mode}
                onClick={() => update('Remote_or_Onsite', mode)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                  form.Remote_or_Onsite === mode
                    ? 'border-purple bg-purple/10 text-purple'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:border-purple/40'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-5 pt-2 border-t border-[var(--border)]">
        {SLIDER_FIELDS.map(({ key, label, min, max, step }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-[var(--text)]">{label}</label>
              <span className="text-sm font-semibold text-purple">{form[key]}</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={form[key]}
              onChange={(e) => update(key, Number(e.target.value))}
              className="w-full accent-purple h-2 rounded-lg cursor-pointer"
            />
          </div>
        ))}
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-3">
        <FiActivity size={17} /> {loading ? 'Analyzing...' : 'Predict Burnout Risk'}
      </button>
    </form>
  );
};

export default PredictionForm;

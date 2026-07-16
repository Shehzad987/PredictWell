import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiTarget } from 'react-icons/fi';
import PredictionForm from '../components/PredictionForm';
import predictionService from '../services/predictionService';

const PredictionCenter = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (employee) => {
    setLoading(true);
    try {
      const data = await predictionService.predict(employee);
      navigate(`/results/${data.prediction.id}`, { state: { prediction: data.prediction } });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <span className="w-14 h-14 mx-auto rounded-2xl bg-gradient-brand flex items-center justify-center shadow-neonPurple mb-4">
          <FiTarget size={26} className="text-white" />
        </span>
        <h1 className="section-heading">Prediction Center</h1>
        <p className="text-[var(--text-muted)] mt-2">
          Enter an employee's profile to get an instant, AI-powered burnout risk assessment.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-8">
        <PredictionForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default PredictionCenter;

import api from './api';

const predictionService = {
  predict: async (employee) => (await api.post('/predict', employee)).data,
  getHistory: async (limit = 50) => (await api.get(`/predict/history?limit=${limit}`)).data,
  clearHistory: async () => (await api.delete('/predict/history')).data,
  getReportUrl: (predictionId) => `/api/reports/${predictionId}`,
};

export default predictionService;

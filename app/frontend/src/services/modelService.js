import api from './api';

const modelService = {
  getMetrics: async () => (await api.get('/models/metrics')).data,
  train: async () => (await api.post('/models/train', {})).data,
  getDownloadUrl: () => '/api/models/download',
};

export default modelService;

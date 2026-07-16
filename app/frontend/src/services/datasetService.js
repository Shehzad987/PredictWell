import api from './api';

const datasetService = {
  getSummary: async () => (await api.get('/dataset/summary')).data,
  getCharts: async () => (await api.get('/dataset/charts')).data,
};

export default datasetService;

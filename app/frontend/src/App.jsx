import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Analytics from './pages/Analytics';
import ModelTraining from './pages/ModelTraining';
import PredictionCenter from './pages/PredictionCenter';
import ResultsDashboard from './pages/ResultsDashboard';
import History from './pages/History';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--surface-solid)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
          },
          success: { iconTheme: { primary: '#10B981', secondary: '#0F172A' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#0F172A' } },
        }}
      />
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/training" element={<ModelTraining />} />
          <Route path="/predict" element={<PredictionCenter />} />
          <Route path="/results/:id" element={<ResultsDashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

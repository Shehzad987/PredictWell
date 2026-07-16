import { Link } from 'react-router-dom';
import { FiArrowRight, FiCpu, FiBarChart2, FiShield, FiTrendingUp, FiUsers, FiHeart } from 'react-icons/fi';

const FEATURES = [
  {
    icon: FiCpu,
    title: 'AI-Powered Predictions',
    desc: 'Five machine learning algorithms trained and compared to deliver the most reliable burnout risk classification.',
  },
  {
    icon: FiBarChart2,
    title: 'Data-Driven Insights',
    desc: 'Interactive analytics reveal which factors — stress, overtime, sleep — most strongly predict burnout in your workforce.',
  },
  {
    icon: FiShield,
    title: 'Actionable Recommendations',
    desc: 'Every prediction comes with specific, evidence-based suggestions to help reduce an employee\'s burnout risk.',
  },
];

const STATS = [
  { label: 'ML Models Compared', value: '5' },
  { label: 'Employee Features', value: '12' },
  { label: 'Risk Tiers', value: '3' },
];

const Home = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-radial-purple">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-purple/30 text-purple text-xs font-medium mb-6">
              <FiTrendingUp size={14} /> AI-Powered HR Intelligence
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mb-6">
              Predict burnout
              <br />
              <span className="gradient-text">before it happens.</span>
            </h1>
            <p className="text-[var(--text-muted)] text-lg max-w-lg mb-8 leading-relaxed">
              PredictWell uses machine learning to identify employees at risk of burnout — Low, Medium, or High —
              so HR teams can intervene early with data-backed confidence, not guesswork.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/predict" className="btn-primary">
                Try a Prediction <FiArrowRight />
              </Link>
              <Link to="/analytics" className="btn-outline">
                Explore the Data
              </Link>
            </div>

            <div className="flex gap-10 mt-12">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-display font-bold text-3xl gradient-text">{s.value}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:flex items-center justify-center animate-fade-in">
            <div className="absolute w-96 h-96 rounded-full bg-purple/20 blur-[110px]" />
            <div className="absolute w-72 h-72 rounded-full bg-cyan/10 blur-[100px] translate-x-16 translate-y-10" />
            <div className="relative glass-card p-6 w-full max-w-sm animate-float">
              <p className="text-xs text-[var(--text-muted)] mb-3">Live Risk Snapshot</p>
              {[
                { label: 'Low Risk', pct: 55, color: '#10B981' },
                { label: 'Medium Risk', pct: 30, color: '#F59E0B' },
                { label: 'High Risk', pct: 15, color: '#EF4444' },
              ].map((r) => (
                <div key={r.label} className="mb-4 last:mb-0">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[var(--text-muted)]">{r.label}</span>
                    <span className="font-semibold" style={{ color: r.color }}>{r.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${r.pct}%`, backgroundColor: r.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What is burnout */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-card p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center text-amber shrink-0">
              <FiHeart size={20} />
            </span>
            <h2 className="section-heading">What is Employee Burnout?</h2>
          </div>
          <p className="text-[var(--text-muted)] leading-relaxed mb-4">
            The World Health Organization defines burnout as an occupational phenomenon resulting from chronic
            workplace stress that has not been successfully managed. It's characterized by three dimensions:
            feelings of energy depletion, increased mental distance from one's job, and reduced professional
            efficacy.
          </p>
          <p className="text-[var(--text-muted)] leading-relaxed">
            Burnout doesn't appear overnight — it builds gradually from sustained overtime, insufficient rest,
            poor work-life balance, and mounting stress. PredictWell analyzes these exact signals to flag risk
            early, while there's still time to act.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="section-heading">How PredictWell Works</h2>
          <p className="text-[var(--text-muted)] mt-3">A complete ML pipeline, wrapped in an interface HR teams can actually use.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card p-6 hover:-translate-y-1 hover:shadow-neonPurple transition-all duration-300">
              <span className="w-12 h-12 rounded-xl bg-purple/10 flex items-center justify-center text-purple mb-4">
                <Icon size={22} />
              </span>
              <h3 className="font-display font-semibold mb-2">{title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan shrink-0">
              <FiUsers size={22} />
            </span>
            <div>
              <h3 className="font-display font-semibold">Ready to check your team?</h3>
              <p className="text-sm text-[var(--text-muted)]">Get an instant, explainable risk assessment for any employee profile.</p>
            </div>
          </div>
          <Link to="/predict" className="btn-primary shrink-0">
            Open Prediction Center <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

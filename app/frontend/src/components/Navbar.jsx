import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FiSun, FiMoon, FiMenu, FiX, FiActivity } from 'react-icons/fi';
import useTheme from '../hooks/useTheme';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/analytics', label: 'Dataset Analytics' },
  { to: '/training', label: 'Model Training' },
  { to: '/predict', label: 'Prediction Center' },
  { to: '/history', label: 'History' },
];

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-neonPurple group-hover:shadow-neonPurpleHover transition-shadow">
            <FiActivity size={18} className="text-white" />
          </span>
          <span className="font-display font-bold text-lg tracking-tight">
            Predict<span className="gradient-text">Well</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive ? 'text-purple bg-purple/10' : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={toggleTheme} className="btn-icon" aria-label="Toggle theme">
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          <button className="lg:hidden btn-icon" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t border-[var(--border)] px-4 py-3 space-y-1 animate-fade-in">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'text-purple bg-purple/10' : 'text-[var(--text-muted)]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;

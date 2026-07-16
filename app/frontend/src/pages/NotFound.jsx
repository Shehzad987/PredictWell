import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-display font-bold text-8xl gradient-text">404</h1>
      <h2 className="font-display font-bold text-2xl mt-3 mb-3">Page Not Found</h2>
      <p className="text-[var(--text-muted)] max-w-sm mb-8">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className="btn-primary">
        <FiHome size={16} /> Back to Home
      </Link>
    </div>
  );
};

export default NotFound;

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Briefcase, LayoutDashboard, List } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = (path) =>
    `flex items-center gap-1.5 px-3 py-2 text-sm rounded-md transition ${
      location.pathname === path
        ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-600/20 dark:text-primary-400'
        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600 dark:text-primary-400">
              <Briefcase size={24} />
              TrackR
            </Link>

            {user && (
              <div className="hidden sm:flex items-center gap-1">
                <Link to="/" className={navLinkClass('/')}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <Link to="/applications" className={navLinkClass('/applications')}>
                  <List size={16} />
                  Applications
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {user && (
              <>
                <div className="flex items-center gap-2">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-gray-600 hidden sm:inline dark:text-gray-400">
                    Hi, <span className="font-semibold text-gray-900 dark:text-gray-200">{user.name}</span>
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
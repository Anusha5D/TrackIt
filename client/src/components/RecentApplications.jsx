import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.round((now - date) / (1000 * 60 * 60 * 24));

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const RecentApplications = ({ applications = [] }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={18} className="text-primary-600 dark:text-primary-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Applications</h3>
      </div>

      {applications.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 py-8 text-center">
          No applications yet. Start tracking your job search!
        </p>
      ) : (
        <ul className="space-y-3">
          {applications.map((app) => (
            <li
              key={app._id}
              className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{app.role}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{app.company}</p>
              </div>
              <div className="flex items-center gap-3 ml-3">
                <span className="text-xs text-gray-500 dark:text-gray-400">{formatRelativeTime(app.createdAt)}</span>
                <StatusBadge status={app.status} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/applications"
        className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline mt-4"
      >
        View all applications
        <ArrowRight size={14} />
      </Link>
    </div>
  );
};

export default RecentApplications;
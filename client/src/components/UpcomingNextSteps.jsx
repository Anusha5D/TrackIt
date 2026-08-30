import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff < 7) return `In ${diff} days`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const UpcomingNextSteps = ({ upcomingSteps = [] }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={18} className="text-primary-600 dark:text-primary-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Upcoming Next Steps</h3>
      </div>

      {upcomingSteps.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 py-8 text-center">
          No upcoming follow-ups in the next 30 days.
        </p>
      ) : (
        <ul className="space-y-3">
          {upcomingSteps.map((app) => (
            <li
              key={app._id}
              className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {app.role} at {app.company}
                </p>
                {app.nextStep && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{app.nextStep}</p>
                )}
              </div>
              <div className="flex items-center gap-3 ml-3">
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  {formatDate(app.nextStepDate)}
                </span>
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

export default UpcomingNextSteps;
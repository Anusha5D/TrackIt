import { STATUS_COLORS } from '../utils/constants';

const StatusBadge = ({ status }) => {
  const colorClasses = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
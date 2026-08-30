import { Pencil, Trash2, ExternalLink, MapPin, Calendar, DollarSign } from 'lucide-react';
import StatusBadge from './StatusBadge';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatSalary = (min, max) => {
  if (!min && !max) return null;
  const fmt = (n) => `$${(n / 1000).toFixed(0)}k`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  return fmt(min || max);
};

const ApplicationCard = ({ application, onEdit, onDelete }) => {
  const salary = formatSalary(application.salaryMin, application.salaryMax);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            {application.role}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 truncate">{application.company}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400 mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span>Applied {formatDate(application.dateApplied)}</span>
        </div>
        {application.location && (
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <span>{application.location}</span>
          </div>
        )}
        {salary && (
          <div className="flex items-center gap-2">
            <DollarSign size={14} />
            <span>{salary}</span>
          </div>
        )}
      </div>

      {application.notes && (
        <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded p-2 mb-4 line-clamp-2">
          {application.notes}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
        {application.jobLink ? (
          
          <a  href={application.jobLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            <ExternalLink size={14} />
            View posting
          </a>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(application)}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
            aria-label="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(application)}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
            aria-label="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
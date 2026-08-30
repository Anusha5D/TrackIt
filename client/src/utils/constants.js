// Must match STATUS_VALUES in server/models/Application.js
export const STATUS_OPTIONS = [
  'Applied',
  'OA',
  'Phone Screen',
  'Technical',
  'Onsite',
  'Offer',
  'Rejected',
  'Withdrawn',
];

export const JOB_TYPE_OPTIONS = ['Full-time', 'Internship', 'Contract', 'Part-time'];

// Tailwind color classes for each status — used by StatusBadge
export const STATUS_COLORS = {
  Applied: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800',
  OA: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-800',
  'Phone Screen': 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-200 dark:border-indigo-800',
  Technical: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-200 dark:border-cyan-800',
  Onsite: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800',
  Offer: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-800',
  Rejected: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800',
  Withdrawn: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600',
};
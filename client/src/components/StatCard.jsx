const StatCard = ({ icon: Icon, label, value, sublabel, accentColor = 'primary' }) => {
  const colorMap = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-600/20 dark:text-primary-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-5 hover:shadow-sm transition">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
          {sublabel && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sublabel}</p>}
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg ${colorMap[accentColor]}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
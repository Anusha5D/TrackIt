import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const STATUS_HEX = {
  Applied: '#3b82f6',
  OA: '#a855f7',
  'Phone Screen': '#6366f1',
  Technical: '#06b6d4',
  Onsite: '#f59e0b',
  Offer: '#10b981',
  Rejected: '#ef4444',
  Withdrawn: '#9ca3af',
};

const StatusBreakdownChart = ({ statusBreakdown = [] }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const data = statusBreakdown.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Status Breakdown</h3>
        <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500 text-sm">
          No data yet — add applications to see your pipeline
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Status Breakdown</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={STATUS_HEX[entry.name] || '#9ca3af'} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} application${value !== 1 ? 's' : ''}`, name]}
              contentStyle={isDark ? { backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '6px' } : undefined}
              labelStyle={isDark ? { color: '#e5e7eb' } : undefined}
              itemStyle={isDark ? { color: '#e5e7eb' } : undefined}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatusBreakdownChart;
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const formatWeekLabel = (year, week) => {
  const jan1 = new Date(year, 0, 1);
  const daysOffset = (week - 1) * 7;
  const weekStart = new Date(year, 0, 1 + daysOffset - jan1.getDay());
  return weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const WeeklyApplicationsChart = ({ weeklyData = [] }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const gridColor = isDark ? '#1f2937' : '#f3f4f6';
  const tickColor = isDark ? '#9ca3af' : '#6b7280';

  const data = [...weeklyData]
    .reverse()
    .map((item) => ({
      label: formatWeekLabel(item._id.year, item._id.week),
      count: item.count,
    }));

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Applications Per Week</h3>
        <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500 text-sm">
          No data yet — apply to jobs to see your weekly cadence
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Applications Per Week</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: tickColor }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: tickColor }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value) => [`${value} application${value !== 1 ? 's' : ''}`, 'Total']}
              cursor={{ fill: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)' }}
              contentStyle={isDark ? { backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '6px' } : undefined}
              labelStyle={isDark ? { color: '#e5e7eb' } : undefined}
              itemStyle={isDark ? { color: '#e5e7eb' } : undefined}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyApplicationsChart;
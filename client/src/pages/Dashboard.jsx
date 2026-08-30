import { Link } from 'react-router-dom';
import {
  Briefcase,
  Activity,
  TrendingUp,
  Award,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStats } from '../hooks/useStats';
import StatCard from '../components/StatCard';
import StatusBreakdownChart from '../components/StatusBreakdownChart';
import WeeklyApplicationsChart from '../components/WeeklyApplicationsChart';
import UpcomingNextSteps from '../components/UpcomingNextSteps';
import RecentApplications from '../components/RecentApplications';
import DashboardSkeleton from '../components/DashboardSkeleton';

const ACTIVE_STATUSES = ['Applied', 'OA', 'Phone Screen', 'Technical', 'Onsite'];

const Dashboard = () => {
  const { user } = useAuth();
  const { stats, recentApps, upcomingSteps, loading, error } = useStats();

  const activeCount = stats?.statusBreakdown
    ? stats.statusBreakdown
        .filter((s) => ACTIVE_STATUSES.includes(s._id))
        .reduce((sum, s) => sum + s.count, 0)
    : 0;

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Here's how your job search is going.</p>
        </div>
        <Link
          to="/applications"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition self-start"
        >
          <Plus size={18} />
          Add Application
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Briefcase}
          label="Total Applications"
          value={stats?.totalApplications ?? 0}
          accentColor="primary"
        />
        <StatCard
          icon={Activity}
          label="Active"
          value={activeCount}
          sublabel="In pipeline"
          accentColor="purple"
        />
        <StatCard
          icon={TrendingUp}
          label="Response Rate"
          value={`${stats?.responseRate ?? 0}%`}
          sublabel="Got past Applied"
          accentColor="amber"
        />
        <StatCard
          icon={Award}
          label="Offers"
          value={stats?.offers ?? 0}
          accentColor="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <StatusBreakdownChart statusBreakdown={stats?.statusBreakdown ?? []} />
        <WeeklyApplicationsChart weeklyData={stats?.weeklyData ?? []} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UpcomingNextSteps upcomingSteps={upcomingSteps} />
        <RecentApplications applications={recentApps} />
      </div>
    </div>
  );
};

export default Dashboard;
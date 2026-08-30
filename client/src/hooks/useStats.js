import { useState, useEffect, useCallback } from 'react';
import applicationsApi from '../api/applicationsApi';

export const useStats = () => {
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [upcomingSteps, setUpcomingSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Fire all three in parallel
      const [statsData, recentData, upcomingData] = await Promise.all([
        applicationsApi.getStats(),
        applicationsApi.getAll({ sortBy: 'createdAt', order: 'desc', limit: 5 }),
        // nextStepDate filter doesn't exist on the backend — we'll get all and filter client-side
        // for a small personal tracker this is fine; we'll note it as a future optimization
        applicationsApi.getAll({ limit: 200 }),
      ]);

      setStats(statsData);
      setRecentApps(recentData.applications);

      // Client-side filter for upcoming next steps (next 30 days)
      const now = new Date();
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() + 30);

      const upcoming = upcomingData.applications
        .filter((app) => {
          if (!app.nextStepDate) return false;
          const d = new Date(app.nextStepDate);
          return d >= now && d <= cutoff;
        })
        .sort((a, b) => new Date(a.nextStepDate) - new Date(b.nextStepDate))
        .slice(0, 5);

      setUpcomingSteps(upcoming);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { stats, recentApps, upcomingSteps, loading, error, refetch: fetchAll };
};
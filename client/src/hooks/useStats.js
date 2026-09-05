import { useState, useEffect, useCallback } from 'react';
import applicationsApi from '../api/applicationsApi';

const toDateKey = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;

  return [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()]
    .map((part) => String(part).padStart(2, '0'))
    .join('-');
};

const getTodayKey = () => {
  const today = new Date();
  return [today.getFullYear(), today.getMonth() + 1, today.getDate()]
    .map((part) => String(part).padStart(2, '0'))
    .join('-');
};

const addDaysToKey = (dateKey, days) => {
  const date = new Date(`${dateKey}T00:00:00`);
  date.setDate(date.getDate() + days);
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part) => String(part).padStart(2, '0'))
    .join('-');
};

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
      // Compare against the start of today so items due "today" aren't excluded
      // just because the current time-of-day is later than midnight.
      const todayKey = getTodayKey();
      const cutoffKey = addDaysToKey(todayKey, 30);

      const upcoming = upcomingData.applications
        .filter((app) => {
          if (!app.nextStepDate) return false;
          const dateKey = toDateKey(app.nextStepDate);
          return dateKey && dateKey >= todayKey && dateKey <= cutoffKey;
        })
        .sort((a, b) => toDateKey(a.nextStepDate).localeCompare(toDateKey(b.nextStepDate)))
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
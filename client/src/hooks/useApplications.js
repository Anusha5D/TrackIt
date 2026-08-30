import { useState, useEffect, useCallback } from 'react';
import applicationsApi from '../api/applicationsApi';

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter state
  const [filters, setFilters] = useState({ status: '', search: '' });

  // Fetch applications whenever filters change
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;

      const data = await applicationsApi.getAll(params);
      setApplications(data.applications);
    } catch (err) {
      setError('Failed to load applications. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Create — optimistically add to list after server confirms
  const createApplication = async (formData) => {
    const created = await applicationsApi.create(formData);
    // Re-fetch to respect current filters/sort rather than guessing placement
    await fetchApplications();
    return created;
  };

  // Update
  const updateApplication = async (id, formData) => {
    const updated = await applicationsApi.update(id, formData);
    await fetchApplications();
    return updated;
  };

  // Delete
  const deleteApplication = async (id) => {
    await applicationsApi.remove(id);
    // Remove from local state immediately for snappy UX
    setApplications((prev) => prev.filter((app) => app._id !== id));
  };

  return {
    applications,
    loading,
    error,
    filters,
    setFilters,
    createApplication,
    updateApplication,
    deleteApplication,
    refetch: fetchApplications,
  };
};
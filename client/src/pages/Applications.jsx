import { useState } from 'react';
import { Plus, Inbox, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApplications } from '../hooks/useApplications';
import ApplicationCard from '../components/ApplicationCard';
import ApplicationCardSkeleton from '../components/ApplicationCardSkeleton';
import ApplicationForm from '../components/ApplicationForm';
import FilterBar from '../components/FilterBar';
import ConfirmDialog from '../components/ConfirmDialog';
import { applicationsToCSV, downloadCSV, buildCSVFilename } from '../utils/csvExport';

const Applications = () => {
  const {
    applications,
    loading,
    error,
    filters,
    setFilters,
    createApplication,
    updateApplication,
    deleteApplication,
  } = useApplications();

  const [formOpen, setFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openCreate = () => {
    setEditingApp(null);
    setFormOpen(true);
  };

  const openEdit = (app) => {
    setEditingApp(app);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingApp) {
        await updateApplication(editingApp._id, data);
        toast.success('Application updated');
      } else {
        await createApplication(data);
        toast.success('Application added');
      }
      setFormOpen(false);
      setEditingApp(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save application';
      toast.error(msg);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteApplication(deleteTarget._id);
      toast.success('Application deleted');
      setDeleteTarget(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete application';
      toast.error(msg);
    }
  };

  const handleExportCSV = () => {
    if (applications.length === 0) {
      toast.error('No applications to export');
      return;
    }
    const csv = applicationsToCSV(applications);
    downloadCSV(buildCSVFilename(), csv);
    toast.success(`Exported ${applications.length} application${applications.length !== 1 ? 's' : ''}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Applications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {applications.length} {applications.length === 1 ? 'application' : 'applications'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={applications.length === 0}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Application</span>
          </button>
        </div>
      </div>

      <FilterBar filters={filters} setFilters={setFilters} />

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ApplicationCardSkeleton key={i} />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16">
          <Inbox className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No applications yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {filters.search || filters.status
              ? 'Try adjusting your filters.'
              : 'Click "Add Application" to start tracking.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((app) => (
            <ApplicationCard
              key={app._id}
              application={app}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <ApplicationForm
        open={formOpen}
        application={editingApp}
        onSubmit={handleFormSubmit}
        onClose={() => {
          setFormOpen(false);
          setEditingApp(null);
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete application?"
        message={
          deleteTarget
            ? `This will permanently delete your ${deleteTarget.role} application at ${deleteTarget.company}.`
            : ''
        }
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Applications;
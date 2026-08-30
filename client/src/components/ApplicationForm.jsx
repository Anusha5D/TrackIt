import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { STATUS_OPTIONS, JOB_TYPE_OPTIONS } from '../utils/constants';

const ApplicationForm = ({ open, application, onSubmit, onClose }) => {
  const isEdit = Boolean(application);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (open) {
      if (application) {
        reset({
          company: application.company || '',
          role: application.role || '',
          status: application.status || 'Applied',
          jobType: application.jobType || 'Full-time',
          dateApplied: application.dateApplied
            ? new Date(application.dateApplied).toISOString().split('T')[0]
            : '',
          location: application.location || '',
          salaryMin: application.salaryMin || '',
          salaryMax: application.salaryMax || '',
          jobLink: application.jobLink || '',
          contactPerson: application.contactPerson || '',
          contactEmail: application.contactEmail || '',
          notes: application.notes || '',
        });
      } else {
        reset({
          company: '',
          role: '',
          status: 'Applied',
          jobType: 'Full-time',
          dateApplied: new Date().toISOString().split('T')[0],
          location: '',
          salaryMin: '',
          salaryMax: '',
          jobLink: '',
          contactPerson: '',
          contactEmail: '',
          notes: '',
        });
      }
    }
  }, [open, application, reset]);

  const submitHandler = async (data) => {
    const payload = {
      ...data,
      salaryMin: data.salaryMin ? Number(data.salaryMin) : undefined,
      salaryMax: data.salaryMax ? Number(data.salaryMax) : undefined,
    };
    Object.keys(payload).forEach((key) => {
      if (payload[key] === '' || payload[key] === undefined) {
        delete payload[key];
      }
    });

    await onSubmit(payload);
  };

  if (!open) return null;

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto border border-transparent dark:border-gray-800">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {isEdit ? 'Edit Application' : 'Add Application'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Company *</label>
              <input
                {...register('company', { required: 'Company is required' })}
                className={inputClass}
                placeholder="Google"
              />
              {errors.company && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.company.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Role *</label>
              <input
                {...register('role', { required: 'Role is required' })}
                className={inputClass}
                placeholder="Software Engineer"
              />
              {errors.role && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.role.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Status</label>
              <select {...register('status')} className={inputClass}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Job Type</label>
              <select {...register('jobType')} className={inputClass}>
                {JOB_TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Date Applied</label>
              <input type="date" {...register('dateApplied')} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Location</label>
              <input
                {...register('location')}
                className={inputClass}
                placeholder="Remote / Mountain View, CA"
              />
            </div>

            <div>
              <label className={labelClass}>Salary Min ($)</label>
              <input
                type="number"
                {...register('salaryMin')}
                className={inputClass}
                placeholder="150000"
              />
            </div>

            <div>
              <label className={labelClass}>Salary Max ($)</label>
              <input
                type="number"
                {...register('salaryMax')}
                className={inputClass}
                placeholder="200000"
              />
            </div>

            <div>
              <label className={labelClass}>Contact Person</label>
              <input
                {...register('contactPerson')}
                className={inputClass}
                placeholder="Recruiter name"
              />
            </div>

            <div>
              <label className={labelClass}>Contact Email</label>
              <input
                type="email"
                {...register('contactEmail')}
                className={inputClass}
                placeholder="recruiter@company.com"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Job Posting Link</label>
            <input
              {...register('jobLink')}
              className={inputClass}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              {...register('notes')}
              rows={3}
              className={inputClass}
              placeholder="Referral, interview prep notes, etc."
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm text-white bg-primary-600 rounded-md hover:bg-primary-700 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
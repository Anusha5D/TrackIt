import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />

      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-sm w-full p-6 border border-transparent dark:border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
            <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{message}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
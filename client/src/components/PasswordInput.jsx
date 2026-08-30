import { useState, forwardRef } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

// forwardRef lets react-hook-form's register() pass its ref to the underlying <input>
const PasswordInput = forwardRef(({ placeholder, error, ...rest }, ref) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className="relative">
        <Lock
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          ref={ref}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          {...rest}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
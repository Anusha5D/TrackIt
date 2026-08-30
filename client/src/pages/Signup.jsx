import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Mail, User } from 'lucide-react';
import PasswordInput from '../components/PasswordInput';
import GoogleAuthButton from '../components/GoogleAuthButton';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setServerError('');
    setSubmitting(true);
    try {
      await signup(data.name, data.email, data.password);
      navigate('/');
    } catch (error) {
      const msg = error.response?.data?.message || 'Signup failed. Please try again.';
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-3xl font-bold text-primary-600 dark:text-primary-400">
            <Briefcase size={32} />
            TrackR
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track every application that matters</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 border border-transparent dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Create your account</h2>

          {serverError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded">
              {serverError}
            </div>
          )}

          {/* Google sign-up — same component, same backend endpoint */}
          <div className="mb-6">
            <GoogleAuthButton onError={setServerError} />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">or with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Chaitanya"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              {errors.name && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                  })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              {errors.email && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <PasswordInput
                placeholder="At least 6 characters"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'At least 6 characters' },
                })}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
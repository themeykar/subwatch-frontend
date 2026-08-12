import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirmation: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { email, password, passwordConfirmation } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user changes input
    if (error) setError('');
  };

  const getErrorMessage = (err) => {
    if (err.response && err.response.data) {
      const data = err.response.data;
      if (typeof data === 'string') {
        return data;
      }
      if (typeof data === 'object') {
        const messages = [];
        for (const [key, value] of Object.entries(data)) {
          const displayKey = key === 'non_field_errors' || key === 'detail' ? '' : `${key}`;
          const prefix = displayKey ? `${displayKey.charAt(0).toUpperCase() + displayKey.slice(1)}: ` : '';
          
          if (Array.isArray(value)) {
            messages.push(`${prefix}${value.join(', ')}`);
          } else if (typeof value === 'string') {
            messages.push(`${prefix}${value}`);
          } else {
            messages.push(`${prefix}${JSON.stringify(value)}`);
          }
        }
        return messages.join('\n');
      }
    }
    return err.message || 'An unexpected error occurred during signup.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/api/auth/signup/', {
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess(true);
      setFormData({ email: '', password: '', passwordConfirmation: '' });
      
      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10">
        <div>
          <div className="flex justify-center">
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              SubWatch
            </span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Or{' '}
            <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              sign in to your existing account
            </Link>
          </p>
        </div>

        {success ? (
          <div className="rounded-xl bg-emerald-950/30 border border-emerald-500/30 p-6 text-center animate-fade-in">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-900/50 text-emerald-400 mb-4">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-emerald-400">Signup Successful!</h3>
            <p className="mt-2 text-sm text-slate-300">
              Your account has been created. Redirecting to login page in a few seconds...
            </p>
            <div className="mt-4">
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-slate-950 bg-emerald-400 hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all"
              >
                Go to login now
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-950/30 border border-red-500/30 p-4 text-sm text-red-400 whitespace-pre-line animate-pulse">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={handleChange}
                  enterKeyHint="next"
                  className="appearance-none relative block w-full px-3 py-2.5 border border-slate-800 bg-slate-950/50 placeholder-slate-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all"
                  placeholder="name@example.com"
                />
              </div>

              <div className="relative">
                <label htmlFor="new-password" className="block text-sm font-medium text-slate-300 mb-1">
                  Password
                </label>
                <input
                  id="new-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={handleChange}
                  enterKeyHint="next"
                  className="appearance-none relative block w-full px-3 py-2.5 border border-slate-800 bg-slate-950/50 placeholder-slate-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all pr-10"
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 pt-6 flex items-center text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <div>
                <label htmlFor="password-confirm" className="block text-sm font-medium text-slate-300 mb-1">
                  Confirm Password
                </label>
                <input
                  id="password-confirm"
                  name="passwordConfirmation"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={passwordConfirmation}
                  onChange={handleChange}
                  enterKeyHint="done"
                  className="appearance-none relative block w-full px-3 py-2.5 border border-slate-800 bg-slate-950/50 placeholder-slate-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all"
                  placeholder="Re-enter password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-slate-950 bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-300 hover:to-purple-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Account...
                  </div>
                ) : (
                  'Sign Up'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignupForm;

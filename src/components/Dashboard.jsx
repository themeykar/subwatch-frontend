import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { signout } from '../utils/auth';

const Dashboard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [preferredCurrency, setPreferredCurrency] = useState(
    localStorage.getItem('preferred_currency') || '₦'
  );

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiRequest('/api/subscriptions/');
      setSubscriptions(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || 
        err.message || 
        'Failed to fetch subscriptions. Please verify the backend connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleCurrencyChange = (e) => {
    const symbol = e.target.value;
    setPreferredCurrency(symbol);
    localStorage.setItem('preferred_currency', symbol);
  };

  // Spend calculations: monthly costs, plus yearly costs divided by 12
  const calculateSpend = () => {
    let monthly = 0;
    let yearly = 0;

    subscriptions.forEach((sub) => {
      const cost = parseFloat(sub.cost) || 0;
      const cycle = (sub.billing_cycle || 'monthly').toLowerCase();

      if (cycle === 'monthly') {
        monthly += cost;
        yearly += cost * 12;
      } else if (cycle === 'yearly') {
        monthly += cost / 12;
        yearly += cost;
      } else {
        // Fallback default
        monthly += cost;
        yearly += cost * 12;
      }
    });

    return { monthly, yearly };
  };

  const { monthly: monthlySpend, yearly: yearlySpend } = calculateSpend();

  // Helper to format currency values
  const formatCost = (value) => {
    return `${preferredCurrency}${parseFloat(value).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  // Helper to format dates readably
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Helper to check if renewal is within 7 days
  const getRenewalStatus = (dateStr) => {
    if (!dateStr) return { soon: false, days: 0 };
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const renewal = new Date(dateStr);
    renewal.setHours(0, 0, 0, 0);

    const diffTime = renewal - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      soon: diffDays >= 0 && diffDays <= 7,
      days: diffDays,
    };
  };

  // Sort by next_renewal_date (soonest first)
  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
    if (!a.next_renewal_date) return 1;
    if (!b.next_renewal_date) return -1;
    return new Date(a.next_renewal_date) - new Date(b.next_renewal_date);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[130px] pointer-events-none"></div>

      {/* Navigation Header */}
      <header className="border-b border-slate-900 bg-slate-900/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              SubWatch
            </span>
            <span className="text-xs text-slate-500 border border-slate-800 rounded px-1.5 py-0.5 font-medium bg-slate-900">
              v1.0
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Currency Select */}
            <div className="flex items-center space-x-2">
              <label htmlFor="currency-select" className="text-xs text-slate-400 font-medium hidden sm:inline">
                Currency:
              </label>
              <select
                id="currency-select"
                value={preferredCurrency}
                onChange={handleCurrencyChange}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="₦">Naira (₦)</option>
                <option value="$">US Dollar ($)</option>
                <option value="€">Euro (€)</option>
                <option value="£">British Pound (£)</option>
              </select>
            </div>

            <button
              onClick={signout}
              className="text-sm font-semibold px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-lg transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <svg className="animate-spin h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-slate-400 text-sm">Loading your subscriptions...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="max-w-2xl mx-auto rounded-xl bg-red-950/20 border border-red-500/30 p-6 text-center space-y-4 animate-fade-in">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/30 text-red-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-400">Connection Error</h3>
              <p className="mt-2 text-sm text-slate-400">{error}</p>
            </div>
            <button
              onClick={fetchSubscriptions}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-slate-950 bg-red-400 hover:bg-red-300 transition-all focus:outline-none"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Loaded View */}
        {!loading && !error && (
          <>
            {/* Spend Summary Section */}
            {subscriptions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-900 p-6 rounded-2xl flex flex-col justify-between space-y-3 relative overflow-hidden group hover:border-slate-800 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-indigo-400">
                    <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total Monthly Spend
                  </span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-4xl font-extrabold text-white">
                      {formatCost(monthlySpend)}
                    </span>
                    <span className="text-sm text-slate-400">/ month</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Sum of monthly recurring charges + yearly bills amortized monthly.
                  </p>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-900 p-6 rounded-2xl flex flex-col justify-between space-y-3 relative overflow-hidden group hover:border-slate-800 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-purple-400">
                    <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total Yearly Spend
                  </span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-4xl font-extrabold text-white">
                      {formatCost(yearlySpend)}
                    </span>
                    <span className="text-sm text-slate-400">/ year</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Monthly recurring costs projected out over 12 months + yearly bills as-is.
                  </p>
                </div>
              </div>
            )}

            {/* Subscriptions List Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
                  <span>Your Subscriptions</span>
                  {subscriptions.length > 0 && (
                    <span className="bg-indigo-950 text-indigo-400 border border-indigo-900/50 text-xs font-semibold rounded-full px-2 py-0.5">
                      {subscriptions.length}
                    </span>
                  )}
                </h2>
              </div>

              {/* Empty State */}
              {subscriptions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 p-12 text-center max-w-lg mx-auto space-y-4 animate-fade-in">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-slate-900 text-slate-500 border border-slate-800">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-200">No subscriptions yet</h3>
                    <p className="mt-2 text-sm text-slate-400">
                      Add your first subscription to track costs, renewal dates, and spend metrics.
                    </p>
                  </div>
                </div>
              ) : (
                /* Subscriptions Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                  {sortedSubscriptions.map((sub) => {
                    const { soon: isSoon, days: daysLeft } = getRenewalStatus(sub.next_renewal_date);

                    return (
                      <div
                        key={sub.id}
                        className={`bg-slate-900/35 backdrop-blur-md rounded-2xl p-6 border transition-all flex flex-col justify-between h-[220px] group hover:translate-y-[-2px] relative overflow-hidden ${
                          isSoon
                            ? 'border-amber-500/40 bg-gradient-to-b from-slate-900/35 to-amber-950/5 shadow-lg shadow-amber-950/10'
                            : 'border-slate-900 hover:border-slate-850'
                        }`}
                      >
                        {/* Renewing Soon Highlight Effect */}
                        {isSoon && (
                          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>
                        )}

                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                              {sub.name}
                            </h3>
                            <div className="flex flex-col items-end space-y-1">
                              {sub.category && (
                                <span className="bg-slate-900 text-slate-400 border border-slate-800 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full tracking-wider">
                                  {sub.category}
                                </span>
                              )}
                              {isSoon && (
                                <span className="bg-amber-950/70 text-amber-400 border border-amber-800/50 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full tracking-wider animate-pulse flex items-center space-x-1">
                                  <svg className="w-2.5 h-2.5 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  {daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `In ${daysLeft} Days`}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-baseline space-x-1">
                            <span className="text-3xl font-extrabold text-white">
                              {formatCost(sub.cost)}
                            </span>
                            <span className="text-xs text-slate-400 capitalize">
                              / {sub.billing_cycle || 'monthly'}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-slate-900/60 pt-4 mt-4 flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center space-x-1.5">
                            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Next bill:</span>
                          </div>
                          <span className="font-semibold text-slate-200">
                            {formatDate(sub.next_renewal_date)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

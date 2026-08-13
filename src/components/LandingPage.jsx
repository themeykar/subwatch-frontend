import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const LandingPage = () => {
  const navigate = useNavigate();

  // If user is already authenticated, redirect them to dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Elegant SVG Logo */}
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-600/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              SubWatch
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-lg shadow-sm shadow-indigo-600/10 transition-colors"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Subtle Background Accent Blurs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-50/40 blur-[120px] pointer-events-none -z-10"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-left flex flex-col justify-center">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 bg-indigo-50/70 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 w-fit">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
                Simple Subscription Control
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-2xl">
                Never get surprised by a subscription renewal again.
              </h1>

              {/* Subheadline */}
              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl">
                Keep track of all your recurring bills, get warned before card charges hit, and see your total monthly and yearly spend at a glance.
              </p>

              {/* CTA Group */}
              <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-7 py-4 rounded-xl shadow-md shadow-indigo-600/15 hover:shadow-indigo-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all text-center"
                >
                  Sign Up Free
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center text-base font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 px-7 py-4 rounded-xl transition-all text-center"
                >
                  Log In
                </Link>
              </div>
            </div>

            {/* Right Graphic/Mockup Column */}
            <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
              <div className="w-full max-w-[440px] bg-slate-900/50 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-2xl p-6 relative overflow-hidden transition-transform duration-500 hover:scale-[1.02] bg-white">
                {/* Dashboard Mockup Header */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Commitments</p>
                    <p className="text-3xl font-extrabold text-slate-950 mt-1">$142.50</p>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 text-xs font-semibold text-indigo-700">
                    Active (8)
                  </div>
                </div>

                {/* Subscriptions List */}
                <div className="mt-5 space-y-4">
                  {/* Subscription Item 1 - Warned State */}
                  <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold text-sm">
                          A
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Adobe Creative Cloud</p>
                          <p className="text-xs text-rose-600 font-medium">Renews tomorrow</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">$54.99</p>
                        <p className="text-[10px] text-slate-400">Monthly</p>
                      </div>
                    </div>
                    {/* Visual Warning Bar Indicator */}
                    <div className="w-full h-1 bg-rose-100 rounded-full mt-3 overflow-hidden">
                      <div className="w-11/12 h-full bg-rose-500 rounded-full"></div>
                    </div>
                  </div>

                  {/* Subscription Item 2 - Alert State */}
                  <div className="p-3.5 bg-amber-50/30 border border-amber-100 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                          F
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Figma Professional</p>
                          <p className="text-xs text-amber-600 font-medium">Renews in 2 days</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">$15.00</p>
                        <p className="text-[10px] text-slate-400">Monthly</p>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-amber-100/50 rounded-full mt-3 overflow-hidden">
                      <div className="w-[85%] h-full bg-amber-500 rounded-full"></div>
                    </div>
                  </div>

                  {/* Subscription Item 3 - Stable State */}
                  <div className="p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                          S
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Spotify Family</p>
                          <p className="text-xs text-slate-400 font-medium">Renews in 18 days</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">$19.99</p>
                        <p className="text-[10px] text-slate-400">Monthly</p>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
                      <div className="w-1/3 h-full bg-slate-400 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Mockup Accent Overlays */}
                <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features / How it works Section */}
        <section className="bg-slate-50/70 border-y border-slate-100 py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Take control of your recurring spend
              </h2>
              <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                Simple tools designed to give you clarity and complete visibility into where your money goes.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                  {/* Folder / Dashboard SVG */}
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Track in one place</h3>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  Consolidate your Netflix, Spotify, AWS, and SaaS tools in a single, unified command center.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                  {/* Alert Bell SVG */}
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Smart renewal warnings</h3>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  Receive visual warnings and countdown alerts before any subscription renews, giving you time to cancel.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                  {/* Chart Trend-up / Spend SVG */}
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 114 0v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Spend analytics</h3>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  See your total monthly and yearly commitments instantly. Stop bleeding cash on forgotten trials.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            {/* Footer Logo */}
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 tracking-tight">SubWatch</span>
          </div>
          <p className="text-sm text-slate-500">
            &copy; 2026 SubWatch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useClaims } from '../context/ClaimsContext';
import NotificationDropdown from './NotificationDropdown';
import RoleSwitcher from './RoleSwitcher';
import { Car, FileText, Shield, Sparkles, UserCircle, RefreshCcw } from 'lucide-react';

export default function Navbar() {
  const { role, resetDemoData } = useClaims();

  const isAdjuster = role === 'adjuster';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:bg-brand-700 transition-all">
                <Car className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                    AutoSettle <span className="text-brand-600">AI</span>
                  </span>
                  {isAdjuster && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      ADMIN DESK
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                  Autonomous Claims & Fraud Guard
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>Dashboard / New Claim</span>
              </NavLink>

              <NavLink
                to="/my-claims"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>My Claims</span>
              </NavLink>

              <NavLink
                to="/adjuster"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>Adjuster Desk</span>
              </NavLink>
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Role Switcher */}
            <div className="hidden sm:block">
              <RoleSwitcher />
            </div>

            {/* Notifications Dropdown */}
            <NotificationDropdown />

            {/* User Profile Pill from PDF Screen 2: User: Ashutosh (Driver) */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600 font-semibold">
                AS
              </div>
              <div className="text-left">
                <span className="block font-semibold text-slate-800 leading-none">
                  {isAdjuster ? 'V. Deshmukh' : 'Ashutosh'}
                </span>
                <span className="text-[10px] text-slate-500">
                  {isAdjuster ? 'Senior Claims Adjuster' : 'Driver / Policyholder'}
                </span>
              </div>
            </div>

            {/* Reset Demo Data quick icon button */}
            <button
              type="button"
              onClick={resetDemoData}
              title="Reset Demo Data"
              className="p-2 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex sm:hidden items-center justify-between pb-2 pt-1 border-t border-slate-100">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-1">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-2.5 py-1 rounded text-[11px] font-semibold ${
                    isActive ? 'bg-brand-100 text-brand-800' : 'text-slate-600'
                  }`
                }
              >
                Submit
              </NavLink>
              <NavLink
                to="/my-claims"
                className={({ isActive }) =>
                  `px-2.5 py-1 rounded text-[11px] font-semibold ${
                    isActive ? 'bg-brand-100 text-brand-800' : 'text-slate-600'
                  }`
                }
              >
                Claims
              </NavLink>
              <NavLink
                to="/adjuster"
                className={({ isActive }) =>
                  `px-2.5 py-1 rounded text-[11px] font-semibold ${
                    isActive ? 'bg-amber-100 text-amber-800' : 'text-slate-600'
                  }`
                }
              >
                Adjuster
              </NavLink>
            </div>
            <RoleSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}

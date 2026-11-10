import React from 'react';
import { useClaims } from '../context/ClaimsContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Shield, ArrowLeftRight } from 'lucide-react';

export default function RoleSwitcher() {
  const { role, setRole } = useClaims();
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggle = (newRole) => {
    if (newRole === role) return;
    setRole(newRole);

    if (newRole === 'adjuster') {
      navigate('/adjuster');
    } else {
      if (location.pathname === '/adjuster') {
        navigate('/');
      }
    }
  };

  return (
    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
      <button
        type="button"
        onClick={() => handleToggle('user')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          role === 'user'
            ? 'bg-white text-brand-700 shadow-xs border border-slate-200/80'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <User className="w-3.5 h-3.5" />
        <span>Customer Portal</span>
      </button>

      <button
        type="button"
        onClick={() => handleToggle('adjuster')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          role === 'adjuster'
            ? 'bg-brand-600 text-white shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <Shield className="w-3.5 h-3.5" />
        <span>Adjuster Desk</span>
      </button>
    </div>
  );
}

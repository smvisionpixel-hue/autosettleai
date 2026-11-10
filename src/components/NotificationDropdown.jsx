import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, ExternalLink, ShieldAlert, CheckCircle, Info } from 'lucide-react';
import { useClaims } from '../context/ClaimsContext';
import { useNavigate } from 'react-router-dom';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAllNotificationsRead, clearNotifications } = useClaims();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <ShieldAlert className="w-4 h-4 text-amber-600" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      default:
        return <Info className="w-4 h-4 text-brand-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) {
            markAllNotificationsRead();
          }
        }}
        className="relative p-2 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        <span className="hidden sm:inline">Notifications</span>
        {unreadCount > 0 ? (
          <span className="flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full min-w-[18px]">
            {unreadCount}
          </span>
        ) : (
          <span className="text-xs text-slate-400">({notifications.length})</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-slate-800">System Notifications</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-brand-100 text-brand-700">
                {notifications.length} total
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="text-[11px] text-slate-500 hover:text-brand-600 flex items-center gap-1"
                title="Mark all as read"
              >
                <Check className="w-3 h-3" /> Mark read
              </button>
              <button
                type="button"
                onClick={clearNotifications}
                className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1"
                title="Clear all"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No notifications right now
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (notif.claimId) {
                      navigate(`/assessment/${notif.claimId}`);
                      setIsOpen(false);
                    }
                  }}
                  className={`p-3 transition-colors cursor-pointer flex items-start gap-3 hover:bg-slate-50 ${
                    !notif.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="p-1.5 rounded-md bg-white border border-slate-200 shadow-xs mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    {notif.claimId && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-brand-600 font-medium mt-1 hover:underline">
                        View Claim #{notif.claimId} <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-400">
              AutoSettle Event Stream & Fraud Watch
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

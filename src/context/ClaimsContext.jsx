import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CLAIMS } from '../data/sampleClaims';

const ClaimsContext = createContext(null);

const STORAGE_KEY = 'autosettle_ai_claims_v1';
const ROLE_KEY = 'autosettle_ai_role_v1';
const NOTIFICATIONS_KEY = 'autosettle_ai_notifications_v1';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Claim Auto-Approved',
    message: 'Claim #AS-8942 approved for ₹12,500. Direct settlement transfer sent to Apex Garage.',
    type: 'success',
    timestamp: '10 mins ago',
    read: false,
    claimId: 'AS-8942',
  },
  {
    id: 'notif-2',
    title: 'High Fraud Alert Flagged',
    message: 'Claim #AS-8943 perceptual hash duplicate detected. Adjuster manual review required.',
    type: 'warning',
    timestamp: '35 mins ago',
    read: false,
    claimId: 'AS-8943',
  },
  {
    id: 'notif-3',
    title: 'WhatsApp Alert Simulator',
    message: 'Real-time webhook simulated. SMS & WhatsApp push notification delivered to claimant.',
    type: 'info',
    timestamp: '1 hour ago',
    read: true,
    claimId: 'AS-8942',
  }
];

export function ClaimsProvider({ children }) {
  // Claims state
  const [claims, setClaims] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading claims from localStorage', e);
    }
    return INITIAL_CLAIMS;
  });

  // Current role: 'user' (Customer/Driver) or 'adjuster' (Insurance Adjuster Desk)
  const [role, setRoleState] = useState(() => {
    try {
      const saved = localStorage.getItem(ROLE_KEY);
      if (saved === 'adjuster' || saved === 'user') return saved;
    } catch (e) {
      console.error('Failed reading role from localStorage', e);
    }
    return 'user';
  });

  // Notifications state
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(NOTIFICATIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading notifications', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Toast feedback state
  const [toasts, setToasts] = useState([]);

  // Save claims on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
    } catch (e) {
      console.error('Failed saving claims to localStorage', e);
    }
  }, [claims]);

  // Save role on change
  useEffect(() => {
    try {
      localStorage.setItem(ROLE_KEY, role);
    } catch (e) {
      console.error('Failed saving role to localStorage', e);
    }
  }, [role]);

  // Save notifications
  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed saving notifications to localStorage', e);
    }
  }, [notifications]);

  const setRole = (newRole) => {
    setRoleState(newRole);
    showToast(
      `Switched to ${newRole === 'adjuster' ? 'Insurance Adjuster Desk' : 'Customer Portal'}`,
      'info'
    );
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addClaim = (newClaimData) => {
    // Generate new Claim ID AS-894X
    const num = 8940 + claims.length + 1;
    const claimId = `AS-${num}`;
    const fullClaim = {
      id: claimId,
      submissionTime: new Date().toISOString(),
      status: newClaimData.fraudCheck?.status === 'Flagged' ? 'Flagged' : 'Auto-Approved',
      inspectorDispatched: false,
      inspectorDetails: null,
      overruledDetails: null,
      ...newClaimData,
    };

    setClaims((prev) => [fullClaim, ...prev]);

    // Add corresponding notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: fullClaim.fraudCheck?.status === 'Flagged' ? 'Claim Flagged for Review' : 'New Claim Submitted',
      message: `Claim #${fullClaim.id} for ${fullClaim.vehicleModel} evaluated with ${fullClaim.severity} severity.`,
      type: fullClaim.fraudCheck?.status === 'Flagged' ? 'warning' : 'success',
      timestamp: 'Just now',
      read: false,
      claimId: fullClaim.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Claim #${fullClaim.id} submitted successfully!`, 'success');
    return fullClaim;
  };

  const updateClaim = (id, updates) => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, ...updates };
        }
        return c;
      })
    );
  };

  const getClaimById = (id) => {
    return claims.find((c) => c.id === id) || null;
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(NOTIFICATIONS_KEY);
    setClaims(INITIAL_CLAIMS);
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast('Demo data and claims reset to initial factory state', 'info');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <ClaimsContext.Provider
      value={{
        claims,
        role,
        setRole,
        notifications,
        unreadCount,
        markAllNotificationsRead,
        clearNotifications,
        addClaim,
        updateClaim,
        getClaimById,
        resetDemoData,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </ClaimsContext.Provider>
  );
}

export function useClaims() {
  const context = useContext(ClaimsContext);
  if (!context) {
    throw new Error('useClaims must be used within a ClaimsProvider');
  }
  return context;
}

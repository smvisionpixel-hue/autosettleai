import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClaimsProvider, useClaims } from './context/ClaimsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ClaimSubmissionPage from './pages/ClaimSubmissionPage';
import ClaimAssessmentPage from './pages/ClaimAssessmentPage';
import AdjusterDeskPage from './pages/AdjusterDeskPage';
import MyClaimsPage from './pages/MyClaimsPage';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

// Toast Notification Container Component
function ToastContainer() {
  const { toasts, removeToast } = useClaims();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-xl shadow-xl border flex items-center justify-between gap-3 text-xs font-medium animate-in slide-in-from-bottom-2 duration-200 ${
            toast.type === 'success'
              ? 'bg-emerald-950 text-emerald-100 border-emerald-800'
              : toast.type === 'warning'
              ? 'bg-amber-950 text-amber-100 border-amber-800'
              : 'bg-slate-900 text-slate-100 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
            <span className="leading-snug">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-brand-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<ClaimSubmissionPage />} />
          <Route path="/assessment/:id" element={<ClaimAssessmentPage />} />
          <Route path="/adjuster" element={<AdjusterDeskPage />} />
          <Route path="/my-claims" element={<MyClaimsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ClaimsProvider>
        <MainLayout />
      </ClaimsProvider>
    </BrowserRouter>
  );
}

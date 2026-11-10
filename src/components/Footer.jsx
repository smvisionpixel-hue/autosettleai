import React from 'react';
import { useClaims } from '../context/ClaimsContext';
import { ShieldCheck, RotateCcw, Cpu, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { resetDemoData } = useClaims();

  return (
    <footer className="mt-16 bg-white border-t border-slate-200 py-8 text-xs text-slate-500 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
              AS
            </div>
            <span className="font-semibold text-slate-700">AutoSettle AI</span>
            <span className="text-slate-300">|</span>
            <span>Next-Gen Motor Insurance Claim Automation</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              IRDAI Fast-Track Settlement Compliant
            </span>
            <button
              type="button"
              onClick={resetDemoData}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-rose-600 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>
            AutoSettle AI Hackathon MVP Prototype • Simulated Computer Vision & Perceptual Hash Anti-Fraud Guard.
          </p>
          <div className="flex items-center gap-3">
            <span>React + Vite + Tailwind CSS</span>
            <span>•</span>
            <span>Local Web Storage</span>
            <span>•</span>
            <span>jsPDF Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

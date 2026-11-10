import React from 'react';
import { QrCode, Camera, X, Smartphone, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { DEMO_PRESET_SCENARIOS } from '../data/sampleClaims';

export default function QrMobileUploadModal({ isOpen, onClose, onSelectPreset, onDeviceCapture }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-brand-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/10 rounded-lg">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">Mobile Camera Sync</h3>
              <p className="text-xs text-brand-100">Direct on-site accident image capture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 p-4 rounded-xl border border-slate-100">
            {/* High Tech Simulated QR Code SVG */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex-shrink-0 flex flex-col items-center">
              <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none">
                {/* 3 Main Corner Markers */}
                <rect x="5" y="5" width="26" height="26" rx="3" fill="#0C87EB" />
                <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
                <rect x="13" y="13" width="10" height="10" rx="1" fill="#0C87EB" />

                <rect x="69" y="5" width="26" height="26" rx="3" fill="#0C87EB" />
                <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
                <rect x="77" y="13" width="10" height="10" rx="1" fill="#0C87EB" />

                <rect x="5" y="69" width="26" height="26" rx="3" fill="#0C87EB" />
                <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
                <rect x="13" y="77" width="10" height="10" rx="1" fill="#0C87EB" />

                {/* Random QR Bit Matrix */}
                <rect x="36" y="8" width="8" height="8" fill="#1E293B" />
                <rect x="48" y="8" width="6" height="12" fill="#1E293B" />
                <rect x="40" y="20" width="14" height="6" fill="#1E293B" />
                <rect x="12" y="38" width="12" height="6" fill="#1E293B" />
                <rect x="30" y="36" width="8" height="8" fill="#0C87EB" />
                <rect x="44" y="34" width="12" height="12" rx="2" fill="#0C87EB" />
                <rect x="62" y="36" width="14" height="6" fill="#1E293B" />
                <rect x="80" y="40" width="8" height="10" fill="#1E293B" />
                <rect x="8" y="50" width="16" height="8" fill="#1E293B" />
                <rect x="30" y="50" width="8" height="14" fill="#1E293B" />
                <rect x="48" y="52" width="16" height="8" fill="#1E293B" />
                <rect x="70" y="50" width="10" height="14" fill="#0C87EB" />
                <rect x="40" y="68" width="8" height="8" fill="#1E293B" />
                <rect x="54" y="68" width="14" height="6" fill="#1E293B" />
                <rect x="42" y="80" width="12" height="12" fill="#0C87EB" />
                <rect x="60" y="80" width="16" height="8" fill="#1E293B" />
                <rect x="80" y="72" width="12" height="16" fill="#1E293B" />
              </svg>
              <span className="text-[10px] font-mono font-semibold text-slate-500 mt-1">SCAN VIA PHONE</span>
            </div>

            <div className="text-left space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-700">
                <Smartphone className="w-4 h-4 text-brand-600" />
                Step 1: Point phone camera at QR
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Opens the mobile accident submission portal with live GPS telemetry and metadata verification enabled.
              </p>
              <div className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Live anti-tampering GPS lock active
              </div>
            </div>
          </div>

          {/* Quick Simulation Options for Hackathon Judges */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" /> Instant Demo Scenarios (One-Click)
              </span>
              <span className="text-[10px] text-slate-400">For instant hackathon testing</span>
            </div>
            <div className="space-y-2">
              {DEMO_PRESET_SCENARIOS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onSelectPreset(preset);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/40 transition-all flex items-center justify-between group bg-white shadow-xs"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-800 group-hover:text-brand-700">
                      {preset.title}
                    </div>
                    <div className="text-[11px] text-slate-500">{preset.sub}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-brand-600 group-hover:translate-x-1 transition-transform">
                    <span>Load</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Camera Capture input for laptops/phones with webcam */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Or use system webcam:</span>
            <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
              <Camera className="w-3.5 h-3.5" />
              <span>Open Web Camera</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onDeviceCapture(e.target.files[0]);
                    onClose();
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

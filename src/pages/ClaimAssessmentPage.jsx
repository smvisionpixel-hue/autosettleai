import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useClaims } from '../context/ClaimsContext';
import {
  FileDown,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  Wrench,
  Paintbrush,
  Clock,
  Sparkles,
  Download,
  AlertTriangle,
  Building,
  Car,
  Check,
  Send,
  Zap,
  Receipt,
  Share2
} from 'lucide-react';
import WhatsAppSimulator from '../components/WhatsAppSimulator';
import DamageBoundingBoxes from '../components/DamageBoundingBoxes';
import { formatINR } from '../data/pricingMatrix';
import { generatePdfClaimReport } from '../utils/generatePdfReport';
import confetti from 'canvas-confetti';

export default function ClaimAssessmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getClaimById, updateClaim, showToast } = useClaims();

  const claim = getClaimById(id) || getClaimById('AS-8942');
  const [isSettled, setIsSettled] = useState(claim?.status === 'Closed');
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  if (!claim) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Claim Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">
          Unable to locate claim identifier #{id}.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  const breakdown = claim.payoutBreakdown || {
    oemParts: 8000,
    painting: 3000,
    labor: 1500,
    consumables: 0,
    gst: 0,
    totalPayout: 12500,
  };

  const handleDownloadPdf = () => {
    setDownloadingPdf(true);
    showToast('Compiling official IRDAI assessment report PDF...', 'info');
    setTimeout(() => {
      try {
        generatePdfClaimReport(claim);
        showToast(`Downloaded AutoSettle_AI_Claim_${claim.id}.pdf`, 'success');
      } catch (err) {
        console.error('PDF generation error', err);
        showToast('Failed to generate PDF. Check browser console.', 'warning');
      } finally {
        setDownloadingPdf(false);
      }
    }, 400);
  };

  const handleAcceptAndClose = () => {
    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0C87EB', '#10B981', '#F59E0B'],
      });
    } catch (e) {
      // silent fallback if confetti disabled
    }

    updateClaim(claim.id, {
      status: 'Closed',
      closedAt: new Date().toISOString(),
    });
    setIsSettled(true);
    setShowCloseModal(true);
    showToast(`Claim #${claim.id} accepted and closed! Instant disbursement authorized.`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Top Banner & Navigation Breadcrumbs */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/"
              className="text-xs text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs text-slate-500 font-medium">Claim Assessment Report</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-mono font-bold text-slate-800">#{claim.id}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Claim Assessment Report #{claim.id}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                claim.status === 'Closed' || isSettled
                  ? 'bg-slate-100 text-slate-700 border-slate-300'
                  : claim.status === 'Flagged'
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-300'
              }`}
            >
              {isSettled ? 'SETTLED & CLOSED' : claim.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Action Button: [ 📥 Download PDF Report ] from PDF Screen 2 */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className={`w-4 h-4 ${downloadingPdf ? 'animate-bounce' : ''}`} />
            <span>{downloadingPdf ? 'Generating PDF...' : 'Download PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Financial Matrix & Right Addon Statuses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Cost Breakdown Matrix & Damage Telemetry */}
        <div className="lg:col-span-7 space-y-6">
          {/* Vehicle Damage Image & Visual Bounding Boxes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-brand-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Vehicle Damage Assessment: {claim.vehicleModel}
                </h3>
              </div>
              <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Reg: {claim.vehicleRegNo}
              </span>
            </div>

            <DamageBoundingBoxes
              imageUrl={claim.imageUrl}
              boundingBoxes={claim.boundingBoxes}
              isAnalyzing={false}
            />

            <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">AI Confidence:</span> {claim.aiConfidence || 94.2}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Severity:</span> {claim.severity} ({claim.severityPercentage}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Impact:</span> {claim.damageType}
              </span>
            </div>
          </div>

          {/* Cost Breakdown Matrix from PDF Screen 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Cost Breakdown Matrix</h3>
                  <p className="text-xs text-slate-500">
                    Standardized IRDAI parts catalog & approved workshop labor calculation
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                Direct Garage Settlement
              </span>
            </div>

            {/* Matrix Line Items */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                    OEM
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      OEM Bumper Replacement / Parts
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Genuine manufacturer bumper shell & mounting brackets
                    </div>
                  </div>
                </div>
                <div className="font-mono font-bold text-sm text-slate-900">
                  {formatINR(breakdown.oemParts || 8000)}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Paintbrush className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Painting & Refinishing
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Basecoat color match + clearcoat oven bake finish
                    </div>
                  </div>
                </div>
                <div className="font-mono font-bold text-sm text-slate-900">
                  {formatINR(breakdown.painting || 3000)}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Labor & Service Charges
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Disassembly, panel fitment, sensor calibration & testing
                    </div>
                  </div>
                </div>
                <div className="font-mono font-bold text-sm text-slate-900">
                  {formatINR(breakdown.labor || 1500)}
                </div>
              </div>

              {breakdown.consumables > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-600">Shop Consumables & Fasteners</div>
                  <div className="font-mono font-semibold text-slate-800">
                    {formatINR(breakdown.consumables)}
                  </div>
                </div>
              )}

              {breakdown.gst > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-600">Applicable GST (18%)</div>
                  <div className="font-mono font-semibold text-slate-800">
                    {formatINR(breakdown.gst)}
                  </div>
                </div>
              )}
            </div>

            {/* Total Estimated Payout Card from PDF */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-brand-50 to-blue-50 border-2 border-brand-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-800 block">
                  Total Estimated Payout
                </span>
                <span className="text-xs text-slate-600">
                  Disbursable to: <strong className="text-slate-800">{claim.preferredGarage || 'Apex Garage'}</strong>
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-extrabold text-brand-700 font-mono">
                  {formatINR(breakdown.totalPayout || 12500)}
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Auto-Approval Threshold Met
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Instant Addon Statuses & WhatsApp Simulator */}
        <div className="lg:col-span-5 space-y-6">
          {/* Instant Addon Statuses Header Card from PDF */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h3 className="font-bold text-sm text-slate-900">
                ⚡ Instant Addon Statuses
              </h3>
            </div>

            {/* WhatsApp Alert Status Pill */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900">
                    [💬 WhatsApp Alert Sent]
                  </span>
                  <span className="text-[10px] text-emerald-700 font-mono">
                    {claim.whatsappLog?.timestamp || '10:17 AM'}
                  </span>
                </div>
                <p className="text-emerald-800 mt-1 leading-relaxed text-[11px]">
                  "{claim.whatsappLog?.message || `Claim #${claim.id} auto-approved for ${formatINR(breakdown.totalPayout)}. Transferred to Apex Garage.`}"
                </p>
              </div>
            </div>

            {/* Fraud & Security Verification Badges */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> EXIF Metadata Verification
                </span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                  {claim.fraudCheck?.exifVerified ? 'PASSED' : 'FLAGGED'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-600" /> Perceptual Duplicate Hash
                </span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                  {claim.fraudCheck?.duplicateCheck || 'PASSED'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive WhatsApp Smartphone Simulator */}
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>Interactive Smartphone Live Feed</span>
            </div>
            <WhatsAppSimulator claim={claim} />
          </div>

          {/* Bottom Actions from PDF: [ < Back to Dashboard ] and [ Accept & Close ] */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>

            <button
              type="button"
              onClick={handleAcceptAndClose}
              disabled={isSettled}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all ${
                isSettled
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 active:scale-[0.98]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSettled ? 'Claim Accepted & Closed' : 'Accept & Close Claim'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Settlement Success Dialog Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
                Instant Settlement Settled
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Claim #{claim.id} Settled!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Disbursement authorization voucher of{' '}
                <strong className="text-slate-900 font-mono">
                  {formatINR(breakdown.totalPayout)}
                </strong>{' '}
                has been transmitted to {claim.preferredGarage || 'Apex Garage'}.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-left border border-slate-100 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono text-slate-800">TXN-AUTOPAY-{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Beneficiary:</span>
                <span className="text-slate-800">{claim.preferredGarage || 'Apex Multispecialty Garage'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-600 font-semibold">Funds Dispatched</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" /> Download Settlement Receipt (PDF)
              </button>
              <button
                type="button"
                onClick={() => setShowCloseModal(false)}
                className="w-full py-2 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

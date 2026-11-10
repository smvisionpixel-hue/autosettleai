import React, { useState } from 'react';
import { useClaims } from '../context/ClaimsContext';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Calendar,
  Send,
  X,
  Sliders,
  Eye,
  FileText,
  DollarSign,
  TrendingUp,
  AlertOctagon,
  Clock,
  Car,
  Check
} from 'lucide-react';
import { formatINR } from '../data/pricingMatrix';
import DamageBoundingBoxes from '../components/DamageBoundingBoxes';
import { generatePdfClaimReport } from '../utils/generatePdfReport';

export default function AdjusterDeskPage() {
  const { claims, updateClaim, showToast } = useClaims();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all'); // 'all' | 'high_fraud' | 'pending' | 'approved'

  // Selected Claim for Detail View (defaults to #AS-8943 for high fraud alert demonstration)
  const defaultSelected = claims.find((c) => c.id === 'AS-8943') || claims[0];
  const [selectedClaimId, setSelectedClaimId] = useState(defaultSelected?.id || 'AS-8943');

  // Modals for actions
  const [isOverruleModalOpen, setIsOverruleModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  
  // Overrule form state
  const [overruleAmount, setOverruleAmount] = useState('');
  const [overruleReason, setOverruleReason] = useState('');

  // Inspector dispatch state
  const [inspectorName, setInspectorName] = useState('Suresh Nambiar (Lead Field Surveyor)');
  const [inspectionDate, setInspectionDate] = useState('2026-11-12');
  const [dispatchNotes, setDispatchNotes] = useState('Check chassis stamping and cross-reference radiator bracket impact marks.');

  const selectedClaim = claims.find((c) => c.id === selectedClaimId) || claims[0];

  // Filtering
  const filteredClaims = claims.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.claimantName && c.claimantName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.vehicleRegNo.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterRisk === 'high_fraud') {
      return c.fraudCheck?.riskLevel === 'HIGH' || c.status === 'Flagged';
    }
    if (filterRisk === 'pending') {
      return c.status === 'In Review' || c.status === 'Flagged';
    }
    if (filterRisk === 'approved') {
      return c.status === 'Auto-Approved' || c.status === 'Closed';
    }
    return true;
  });

  // KPI Calculations
  const pendingCount = claims.filter((c) => c.status === 'In Review' || c.status === 'Flagged').length;
  const highFraudCount = claims.filter((c) => c.fraudCheck?.riskLevel === 'HIGH').length;
  const totalApprovedValue = claims
    .filter((c) => c.status === 'Auto-Approved' || c.status === 'Closed')
    .reduce((acc, c) => acc + (c.payoutBreakdown?.totalPayout || 0), 0);

  // Quick Action Handlers
  const handleFlagScam = (claimId) => {
    updateClaim(claimId, {
      status: 'Flagged',
      fraudCheck: {
        ...selectedClaim.fraudCheck,
        riskLevel: 'HIGH',
        riskScore: 0.98,
        reasonFlagged: 'Flagged manually as suspected fraudulent submission by claims adjuster.',
        recommendation: 'Immediate freeze on automated payout disbursement.',
      }
    });
    showToast(`Claim #${claimId} marked as Fraudulent Scam. Payout frozen.`, 'warning');
  };

  const handleApproveClaim = (claimId) => {
    updateClaim(claimId, {
      status: 'Auto-Approved',
      fraudCheck: {
        ...selectedClaim.fraudCheck,
        status: 'Passed',
        riskLevel: 'Low',
      }
    });
    showToast(`Claim #${claimId} authorized and approved by Adjuster!`, 'success');
  };

  const handleApplyOverrule = (e) => {
    e.preventDefault();
    const newAmount = Number(overruleAmount);
    if (!newAmount || isNaN(newAmount)) {
      showToast('Please enter a valid numeric payout amount', 'warning');
      return;
    }

    updateClaim(selectedClaim.id, {
      status: 'Overruled',
      payoutBreakdown: {
        ...selectedClaim.payoutBreakdown,
        totalPayout: newAmount,
      },
      overruledDetails: {
        adjusterName: 'V. Deshmukh',
        originalAmount: selectedClaim.payoutBreakdown?.totalPayout,
        adjustedAmount: newAmount,
        reason: overruleReason || 'Adjuster manual price audit adjustment',
        timestamp: new Date().toISOString(),
      }
    });

    setIsOverruleModalOpen(false);
    showToast(`AI assessment for Claim #${selectedClaim.id} overruled to ${formatINR(newAmount)}`, 'info');
  };

  const handleDispatchInspector = (e) => {
    e.preventDefault();
    updateClaim(selectedClaim.id, {
      inspectorDispatched: true,
      inspectorDetails: {
        inspectorName,
        scheduledDate: inspectionDate,
        notes: dispatchNotes,
        dispatchedAt: new Date().toISOString(),
      }
    });

    setIsDispatchModalOpen(false);
    showToast(`Physical Inspector ${inspectorName} dispatched for Claim #${selectedClaim.id}!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Top Banner & Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-2 border border-amber-200">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Screen 3: Insurance Adjuster Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Adjuster Claim Review Portal
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review AI-triaged damage claims, audit perceptual anti-fraud flags, overrule estimates, and dispatch field inspectors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Gateway: Active (IRDAI Gateway Sync)
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Total Claims</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">{claims.length}</div>
          <span className="text-[11px] text-slate-400">Incoming ledger queue</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Pending Review</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600 font-mono">{pendingCount}</div>
          <span className="text-[11px] text-amber-700 font-medium">Awaiting manual audit</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">High Fraud Flags</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600 font-mono">{highFraudCount}</div>
          <span className="text-[11px] text-rose-700 font-medium">Suspected image reuse</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Settlement Disbursed</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-emerald-700 font-mono">
            {formatINR(totalApprovedValue)}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Direct garage settlement</span>
        </div>
      </div>

      {/* Main Grid: Incoming Claims Queue & Selected Claim Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Table (7 cols): Incoming Claims Queue from PDF Screen 3 */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Incoming Claims Queue ({filteredClaims.length} Claims)
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time queue synchronized across regional general insurance nodes
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setFilterRisk('all')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    filterRisk === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRisk('high_fraud')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    filterRisk === 'high_fraud' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  ⚠️ High Fraud
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRisk('pending')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    filterRisk === 'pending' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Claim ID, Vehicle, or Claimant..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Claims Table exactly matching PDF Screen 3 layout */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50 text-slate-600 font-semibold">
                  <tr>
                    <th className="px-3.5 py-3">Claim ID</th>
                    <th className="px-3 py-3">Vehicle</th>
                    <th className="px-3 py-3">Damage Severity</th>
                    <th className="px-3 py-3 text-right">AI Payout</th>
                    <th className="px-3 py-3">Fraud Risk</th>
                    <th className="px-3 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredClaims.map((claimItem) => {
                    const isSelected = claimItem.id === selectedClaimId;
                    const isHighFraud = claimItem.fraudCheck?.riskLevel === 'HIGH';

                    return (
                      <tr
                        key={claimItem.id}
                        onClick={() => setSelectedClaimId(claimItem.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-50/70 border-l-4 border-l-brand-600'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="px-3.5 py-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                          #{claimItem.id}
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-semibold text-slate-800 truncate max-w-[120px]">
                            {claimItem.vehicleModel.split(' ')[0]} {claimItem.vehicleModel.split(' ')[1]}
                          </div>
                          <div className="font-mono text-[10px] text-slate-400">
                            {claimItem.vehicleRegNo}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              claimItem.severity.toLowerCase() === 'severe'
                                ? 'bg-rose-50 text-rose-700'
                                : claimItem.severity.toLowerCase() === 'moderate'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {claimItem.severity} ({claimItem.severityPercentage || 64}%)
                          </span>
                        </td>
                        <td className="px-3 py-3 font-mono font-bold text-right text-slate-900 whitespace-nowrap">
                          {formatINR(claimItem.payoutBreakdown?.totalPayout || 12500)}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          {isHighFraud ? (
                            <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[11px] border border-rose-200">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              ⚠️ HIGH
                            </span>
                          ) : (
                            <span className="font-mono text-[11px] text-slate-600">
                              Low ({claimItem.fraudCheck?.riskScore || 0.02})
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => setSelectedClaimId(claimItem.id)}
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-[11px] font-semibold transition-colors"
                            >
                              [Review]
                            </button>
                            {isHighFraud ? (
                              <button
                                type="button"
                                onClick={() => handleFlagScam(claimItem.id)}
                                className="px-2 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-800 text-[11px] font-bold transition-colors"
                              >
                                [Flag Scam]
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleApproveClaim(claimItem.id)}
                                className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition-colors"
                              >
                                [Approve]
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Selected Claim Details from PDF Screen 3 */}
        <div className="lg:col-span-5 space-y-5">
          {selectedClaim && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              {/* Header Box: **Selected Claim Details (#AS-8943 - High Fraud Alert)** */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-brand-600">
                    CLAIM AUDIT DESK
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      selectedClaim.fraudCheck?.riskLevel === 'HIGH'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {selectedClaim.fraudCheck?.riskLevel === 'HIGH'
                      ? '⚠️ HIGH FRAUD ALERT'
                      : 'VERIFIED LOW RISK'}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  Selected Claim Details (#{selectedClaim.id})
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedClaim.vehicleModel} • {selectedClaim.vehicleRegNo}
                </p>
              </div>

              {/* Bounding Box Image Preview */}
              <div>
                <DamageBoundingBoxes
                  imageUrl={selectedClaim.imageUrl}
                  boundingBoxes={selectedClaim.boundingBoxes}
                  isAnalyzing={false}
                />
              </div>

              {/* Fraud Analysis Box from PDF Screen 3:
                  - Reason flagged: Image hash matches a claim filed 4 months ago in Mumbai.
                  - Recommendation: Manual physical inspection required. */}
              {selectedClaim.fraudCheck?.riskLevel === 'HIGH' ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2.5">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>⚠️ Critical Perceptual Hash Collision Detected</span>
                  </div>

                  <div className="text-xs text-rose-900 space-y-1.5 leading-relaxed">
                    <p>
                      <strong>• Reason flagged:</strong>{' '}
                      {selectedClaim.fraudCheck?.reasonFlagged ||
                        'Image hash matches a claim filed 4 months ago in Mumbai.'}
                    </p>
                    <p>
                      <strong>• Recommendation:</strong>{' '}
                      {selectedClaim.fraudCheck?.recommendation ||
                        'Manual physical inspection required.'}
                    </p>
                    <p className="text-[11px] text-rose-700">
                      <strong>• Hash Signature:</strong> SHA256:d894b9f0a41... (Match Confidence: 99.4%)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Clean Verification Profile</span>
                  </div>
                  <p className="text-emerald-800">
                    Image telemetry and EXIF timestamp match incident report. Perceptual hash unique across Indian insurer database.
                  </p>
                </div>
              )}

              {/* Inspector Dispatched Info if active */}
              {selectedClaim.inspectorDispatched && (
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-brand-900">
                    <UserCheck className="w-4 h-4 text-brand-600" />
                    <span>Physical Surveyor Dispatched</span>
                  </div>
                  <div className="text-brand-800">
                    Surveyor: <strong>{selectedClaim.inspectorDetails?.inspectorName}</strong>
                  </div>
                  <div className="text-brand-700 text-[11px]">
                    Inspection Scheduled: {selectedClaim.inspectorDetails?.scheduledDate}
                  </div>
                </div>
              )}

              {/* Overruled Details if active */}
              {selectedClaim.overruledDetails && (
                <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-purple-900">
                    <Sliders className="w-4 h-4 text-purple-600" />
                    <span>Adjuster Payout Overruled</span>
                  </div>
                  <div className="text-purple-800">
                    Adjusted from {formatINR(selectedClaim.overruledDetails.originalAmount)} to{' '}
                    <strong>{formatINR(selectedClaim.overruledDetails.adjustedAmount)}</strong>
                  </div>
                  <div className="text-[11px] text-purple-700">
                    Reason: {selectedClaim.overruledDetails.reason}
                  </div>
                </div>
              )}

              {/* Action Buttons from PDF Screen 3:
                  [ Overrule AI ] [ Dispatch Inspector ] */}
              <div className="pt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOverruleAmount(selectedClaim.payoutBreakdown?.totalPayout || '12500');
                    setIsOverruleModalOpen(true);
                  }}
                  className="py-3 px-3 rounded-xl border border-slate-300 hover:border-brand-500 hover:bg-brand-50/50 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <Sliders className="w-4 h-4 text-brand-600" />
                  <span>[ Overrule AI ]</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(true)}
                  className="py-3 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>[ Dispatch Inspector ]</span>
                </button>
              </div>

              {/* Additional Direct Actions */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleApproveClaim(selectedClaim.id)}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve & Disburse</span>
                </button>

                <button
                  type="button"
                  onClick={() => generatePdfClaimReport(selectedClaim)}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Audit PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Overrule AI Assessment */}
      {isOverruleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-sm">Overrule AI Assessment (#{selectedClaim.id})</h3>
              </div>
              <button
                onClick={() => setIsOverruleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyOverrule} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Original AI Calculated Payout:
                </label>
                <div className="font-mono font-bold text-slate-900 text-base bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {formatINR(selectedClaim.payoutBreakdown?.totalPayout)}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Adjuster Revised Payout (₹ INR):
                </label>
                <input
                  type="number"
                  value={overruleAmount}
                  onChange={(e) => setOverruleAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-500 font-mono text-sm font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Adjuster Audit Justification Note:
                </label>
                <textarea
                  rows={3}
                  value={overruleReason}
                  onChange={(e) => setOverruleReason(e.target.value)}
                  placeholder="e.g. Salvage deduction applied, paint blending factored into adjacent panel..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-500 resize-none text-slate-800"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOverruleModalOpen(false)}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold"
                >
                  Save & Apply Overrule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Dispatch Inspector from PDF Screen 3 */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-sm">Dispatch On-Ground Physical Inspector</h3>
              </div>
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDispatchInspector} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Vehicle & Incident:
                </label>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                  {selectedClaim.vehicleModel} ({selectedClaim.vehicleRegNo})
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assigned IRDAI Field Surveyor:
                </label>
                <input
                  type="text"
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-500 text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Scheduled Inspection Date:
                </label>
                <input
                  type="date"
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-500 text-slate-800 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Inspection Instructions / Fraud Audit Scope:
                </label>
                <textarea
                  rows={3}
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-500 resize-none text-slate-800"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Work Order & Dispatch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

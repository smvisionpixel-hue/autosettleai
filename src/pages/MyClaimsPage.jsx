import React, { useState } from 'react';
import { useClaims } from '../context/ClaimsContext';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  Download,
  ArrowRight,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Car,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { formatINR } from '../data/pricingMatrix';
import { generatePdfClaimReport } from '../utils/generatePdfReport';

export default function MyClaimsPage() {
  const { claims, showToast } = useClaims();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = claims.filter((claim) => {
    const matchesSearch =
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.vehicleRegNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (claim.policyNumber && claim.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter !== 'all') {
      if (statusFilter === 'approved') return claim.status === 'Auto-Approved';
      if (statusFilter === 'closed') return claim.status === 'Closed';
      if (statusFilter === 'pending') return claim.status === 'In Review';
      if (statusFilter === 'flagged') return claim.status === 'Flagged';
    }
    return true;
  });

  const handleDownload = (e, claim) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      generatePdfClaimReport(claim);
      showToast(`Downloaded PDF for Claim #${claim.id}`, 'success');
    } catch (err) {
      showToast('Error generating PDF', 'warning');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-2 border border-brand-200">
            <FileText className="w-3.5 h-3.5 text-brand-600" />
            <span>Policyholder Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Accident Claims
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track status, review AI severity assessments, and download insurance settlement receipts.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Submit New Claim</span>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search claims by ID, vehicle or policy..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-brand-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All' },
            { id: 'approved', label: 'Approved' },
            { id: 'closed', label: 'Settled' },
            { id: 'pending', label: 'In Review' },
            { id: 'flagged', label: 'Flagged' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === f.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Claims List Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-sm">No claims found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search criteria or submit a new claim.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
          >
            Submit Claim Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((claim) => {
            const isFlagged = claim.status === 'Flagged';
            const isClosed = claim.status === 'Closed';
            const isApproved = claim.status === 'Auto-Approved';

            return (
              <div
                key={claim.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-brand-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-extrabold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
                      #{claim.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        isClosed
                          ? 'bg-slate-100 text-slate-700 border-slate-300'
                          : isFlagged
                          ? 'bg-rose-50 text-rose-700 border-rose-300'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      }`}
                    >
                      {claim.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {claim.vehicleModel}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mt-0.5">
                    <span>Reg: {claim.vehicleRegNo}</span>
                    <span>•</span>
                    <span>Policy: {claim.policyNumber}</span>
                  </div>

                  {/* Damage Preview Pill */}
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Damage Assessment
                      </span>
                      <span className="font-semibold text-slate-800">
                        {claim.severity} ({claim.severityPercentage}%)
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Estimated Payout
                      </span>
                      <span className="font-mono font-extrabold text-brand-700 text-sm">
                        {formatINR(claim.payoutBreakdown?.totalPayout || 12500)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(claim.incidentDate || claim.submissionTime).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleDownload(e, claim)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors"
                      title="Download PDF Report"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <Link
                      to={`/assessment/${claim.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-brand-600 text-white text-xs font-semibold transition-colors"
                    >
                      <span>View Assessment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

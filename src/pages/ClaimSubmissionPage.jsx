import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClaims } from '../context/ClaimsContext';
import {
  UploadCloud,
  Camera,
  Trash2,
  Cpu,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  FileCheck,
  Zap,
  Layers,
  Sparkles,
  HelpCircle,
  Car,
  Clock,
  MapPin,
  FileText,
  BadgeAlert
} from 'lucide-react';
import DamageBoundingBoxes from '../components/DamageBoundingBoxes';
import CarHotspotMapper from '../components/CarHotspotMapper';
import QrMobileUploadModal from '../components/QrMobileUploadModal';
import { calculateDamageCost, formatINR } from '../data/pricingMatrix';
import { DEMO_PRESET_SCENARIOS } from '../data/sampleClaims';

export default function ClaimSubmissionPage() {
  const navigate = useNavigate();
  const { addClaim, showToast } = useClaims();
  const fileInputRef = useRef(null);

  // Form Fields
  const [claimantName, setClaimantName] = useState('Ashutosh Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [policyNumber, setPolicyNumber] = useState('POL-ICICI-884219');
  const [vehicleModel, setVehicleModel] = useState('Maruti Suzuki Swift VXi (2022)');
  const [vehicleRegNo, setVehicleRegNo] = useState('MH 02 EE 7412');
  const [incidentDate, setIncidentDate] = useState('2026-11-10T14:30');
  const [location, setLocation] = useState('Western Express Highway, Andheri, Mumbai');
  const [description, setDescription] = useState('Low-speed front bumper collision with divider curb in traffic.');

  // Image & AI state
  const [uploadedImage, setUploadedImage] = useState('https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(true);
  const [analysisStep, setAnalysisStep] = useState('');
  
  // Detection Results
  const [severity, setSeverity] = useState('moderate');
  const [severityPercentage, setSeverityPercentage] = useState(64);
  const [selectedParts, setSelectedParts] = useState(['front_bumper']);
  const [aiConfidence, setAiConfidence] = useState(94.2);
  const [boundingBoxes, setBoundingBoxes] = useState([
    {
      id: 'bb-1',
      label: 'Deformation Dent',
      part: 'Front Bumper',
      confidence: 94,
      color: '#f59e0b',
      x: 24,
      y: 42,
      width: 48,
      height: 38,
    },
    {
      id: 'bb-2',
      label: 'Paint Scuff',
      part: 'Bumper Lip',
      confidence: 89,
      color: '#ef4444',
      x: 40,
      y: 65,
      width: 25,
      height: 18,
    }
  ]);

  // Anti-Fraud Checks
  const [fraudCheck, setFraudCheck] = useState({
    status: 'Passed',
    riskScore: 0.02,
    riskLevel: 'Low',
    exifVerified: true,
    duplicateCheck: 'Passed',
    geoCheck: 'Passed',
    hashMatch: false,
    reasonFlagged: '',
    recommendation: 'Eligible for instant automated payout.',
  });

  // Modals & UI
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [submittedClaim, setSubmittedClaim] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Compute live repair cost breakdown based on selected parts & severity
  const costBreakdown = calculateDamageCost(selectedParts, severity);

  // Simulated AI Computer Vision Inference Pipeline
  const runAiAnalysisPipeline = (imageSource, presetData = null) => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);

    const steps = [
      '1/4: Ingesting image & decoding EXIF camera telemetry...',
      '2/4: Running YOLOv11-Motor Convolutional Neural Network...',
      '3/4: Querying National Perceptual Image Hash Anti-Scam database...',
      '4/4: Calculating OEM parts & labor repair matrix...',
    ];

    let stepIndex = 0;
    setAnalysisStep(steps[0]);

    const stepTimer = setInterval(() => {
      stepIndex += 1;
      if (stepIndex < steps.length) {
        setAnalysisStep(steps[stepIndex]);
      } else {
        clearInterval(stepTimer);
        finishAnalysis(presetData);
      }
    }, 450);
  };

  const finishAnalysis = (presetData) => {
    setIsAnalyzing(false);
    setAnalysisComplete(true);

    if (presetData) {
      setSeverity(presetData.severity);
      setSeverityPercentage(presetData.severityPercentage);
      setSelectedParts(presetData.damagedParts);
      setVehicleModel(presetData.vehicleModel);
      setVehicleRegNo(presetData.vehicleRegNo);
      setPolicyNumber(presetData.policyNumber);

      if (presetData.fraudScenario === 'high_fraud') {
        setFraudCheck({
          status: 'Flagged',
          riskScore: 0.89,
          riskLevel: 'HIGH',
          exifVerified: false,
          duplicateCheck: 'Failed (Perceptual Hash Duplicate)',
          geoCheck: 'Mismatch',
          hashMatch: true,
          reasonFlagged: 'Image hash matches a claim filed 4 months ago in Mumbai.',
          recommendation: 'Manual physical inspection required.',
        });
        setBoundingBoxes([
          {
            id: 'bb-severe-1',
            label: 'Severe Front Crush',
            part: 'Front Bumper & Hood',
            confidence: 96,
            color: '#dc2626',
            x: 18,
            y: 28,
            width: 64,
            height: 52,
          }
        ]);
        showToast('⚠️ AI Fraud Guard: Duplicate image detected!', 'warning');
      } else if (presetData.severity === 'minor') {
        setFraudCheck({
          status: 'Passed',
          riskScore: 0.01,
          riskLevel: 'Low',
          exifVerified: true,
          duplicateCheck: 'Passed',
          geoCheck: 'Passed',
          hashMatch: false,
          reasonFlagged: '',
          recommendation: 'Fast-track instant approval verified.',
        });
        setBoundingBoxes([
          {
            id: 'bb-minor-1',
            label: 'Surface Scuff',
            part: 'Rear Quarter Panel',
            confidence: 91,
            color: '#10b981',
            x: 42,
            y: 48,
            width: 32,
            height: 25,
          }
        ]);
        showToast('AI Assessment: Minor damage detected (₹3,200)', 'success');
      } else {
        // Moderate default
        setFraudCheck({
          status: 'Passed',
          riskScore: 0.02,
          riskLevel: 'Low',
          exifVerified: true,
          duplicateCheck: 'Passed',
          geoCheck: 'Passed',
          hashMatch: false,
          reasonFlagged: '',
          recommendation: 'Eligible for instant automated payout.',
        });
        setBoundingBoxes([
          {
            id: 'bb-1',
            label: 'Dent & Deformation',
            part: 'Front Bumper',
            confidence: 94,
            color: '#f59e0b',
            x: 24,
            y: 42,
            width: 48,
            height: 38,
          }
        ]);
        showToast('AI Assessment: Moderate damage detected (₹12,500)', 'success');
      }
    } else {
      // Dynamic user uploaded image
      setSeverity('moderate');
      setSeverityPercentage(58);
      setSelectedParts(['front_bumper', 'left_fender']);
      setFraudCheck({
        status: 'Passed',
        riskScore: 0.04,
        riskLevel: 'Low',
        exifVerified: true,
        duplicateCheck: 'Passed',
        geoCheck: 'Passed',
        hashMatch: false,
        reasonFlagged: '',
        recommendation: 'Authentic real-time image verified.',
      });
      setBoundingBoxes([
        {
          id: 'bb-user-1',
          label: 'Impact Zone',
          part: 'Front Bumper',
          confidence: 92,
          color: '#f59e0b',
          x: 28,
          y: 35,
          width: 45,
          height: 35,
        }
      ]);
      showToast('AI CV analysis complete for uploaded image', 'success');
    }
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image size exceeds 10MB limit', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setUploadedImage(dataUrl);
      runAiAnalysisPipeline(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setAnalysisComplete(false);
    setBoundingBoxes([]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSelectPreset = (preset) => {
    setUploadedImage(preset.imageUrl);
    runAiAnalysisPipeline(preset.imageUrl, preset);
  };

  const handleToggleHotspotPart = (partId) => {
    setSelectedParts((prev) => {
      if (prev.includes(partId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((p) => p !== partId);
      } else {
        return [...prev, partId];
      }
    });
  };

  // Submit Claim Action
  const handleSubmitClaim = (e) => {
    e.preventDefault();

    if (!uploadedImage) {
      showToast('Please upload or select an accident photo before submitting', 'warning');
      return;
    }

    if (!vehicleRegNo || !vehicleModel) {
      showToast('Please enter vehicle registration number and model', 'warning');
      return;
    }

    // Determine final payout breakdown
    const oemPartsAmount = costBreakdown.totalPartsCost || 8000;
    const paintAmount = costBreakdown.totalPaintCost || 3000;
    const laborAmount = costBreakdown.totalLaborCost || 1500;
    const total = oemPartsAmount + paintAmount + laborAmount + costBreakdown.consumables + costBreakdown.gst;

    const newClaimObj = {
      claimantName,
      phone,
      policyNumber,
      vehicleModel,
      vehicleRegNo,
      chassisNo: 'MA3EWB32S' + Math.floor(1000000 + Math.random() * 9000000),
      incidentDate,
      location,
      severity: severity.charAt(0).toUpperCase() + severity.slice(1),
      severityPercentage,
      damagedParts: selectedParts,
      damageType: description || 'Front Bumper and Impact Deformation',
      aiConfidence,
      payoutBreakdown: {
        oemParts: oemPartsAmount,
        painting: paintAmount,
        labor: laborAmount,
        consumables: costBreakdown.consumables,
        gst: costBreakdown.gst,
        totalPayout: total,
      },
      fraudCheck,
      imageUrl: uploadedImage,
      boundingBoxes,
      preferredGarage: 'Apex Multispecialty Garage, Mumbai',
      whatsappLog: {
        sent: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        message: `Claim auto-assessed for ₹${total.toLocaleString('en-IN')}. Transferred to Apex Garage linked account.`,
      }
    };

    const saved = addClaim(newClaimObj);
    setSubmittedClaim(saved);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-2 border border-brand-200">
              <Zap className="w-3.5 h-3.5 text-brand-600" />
              <span>Screen 1: User Portal Claim Submission</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Submit New Accident Claim
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Upload photos of vehicle damage for instant Computer Vision triage, parts pricing, and anti-fraud verification.
            </p>
          </div>

          {/* Quick Preset Buttons for Hackathon Judges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Quick Demo Presets:</span>
            <button
              type="button"
              onClick={() => handleSelectPreset(DEMO_PRESET_SCENARIOS[0])}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 hover:border-brand-500 hover:text-brand-600 shadow-xs transition-all"
            >
              🚗 Swift Bumper (₹12,500)
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset(DEMO_PRESET_SCENARIOS[1])}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 border border-rose-300 text-rose-700 hover:bg-rose-100 shadow-xs transition-all"
            >
              ⚠️ Creta Crash (Fraud Flag)
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmitClaim} className="space-y-8">
        {/* Main 2-Column Grid: Upload & Live AI Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (5 cols): Photo Upload & Capture */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-brand-600" />
                  Upload Damaged Car Photo
                </h3>
                {uploadedImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                )}
              </div>

              {/* Drag & Drop Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-slate-300 hover:border-brand-400 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />

                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shadow-xs">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-brand-600 hover:underline">
                      Click to upload
                    </span>{' '}
                    <span className="text-xs text-slate-500">or drag and drop</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Supported: JPG, PNG • Max size 10MB
                  </p>
                </div>
              </div>

              {/* Mobile Camera Option Button from PDF Wireframe */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(true)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:border-brand-500 bg-slate-50 hover:bg-brand-50/50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Camera className="w-4 h-4 text-brand-600" />
                  <span>📷 Capture via Mobile Cam (QR)</span>
                </button>
              </div>
            </div>

            {/* Vehicle & Policy Inputs Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" />
                Vehicle & Policy Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vehicle Model</label>
                  <input
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-500 text-slate-800"
                    placeholder="e.g. Maruti Suzuki Swift"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registration No</label>
                  <input
                    type="text"
                    value={vehicleRegNo}
                    onChange={(e) => setVehicleRegNo(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-500 font-mono text-slate-800"
                    placeholder="e.g. MH 02 EE 7412"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Policy Number</label>
                  <input
                    type="text"
                    value={policyNumber}
                    onChange={(e) => setPolicyNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-500 font-mono text-slate-800"
                    placeholder="POL-XXXX-XXXXXX"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Policyholder Name</label>
                  <input
                    type="text"
                    value={claimantName}
                    onChange={(e) => setClaimantName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-500 text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs">Incident Location</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-brand-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs">Accident Summary</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-brand-500 text-slate-800 resize-none"
                  placeholder="Describe how the accident occurred..."
                />
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Live AI Detection Results */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                    <Zap className="w-4 h-4 fill-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">
                      ⚡ AI Detection Results (Live)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Real-time Computer Vision bounding box segmentation
                    </p>
                  </div>
                </div>

                {isAnalyzing ? (
                  <span className="text-xs font-mono font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 animate-pulse">
                    PROCESSING...
                  </span>
                ) : (
                  <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> INFERENCE VERIFIED
                  </span>
                )}
              </div>

              {/* Bounding Box Visualizer Component */}
              <div className="relative mb-5">
                <DamageBoundingBoxes
                  imageUrl={uploadedImage}
                  boundingBoxes={boundingBoxes}
                  isAnalyzing={isAnalyzing}
                />

                {/* Loading state bar below canvas */}
                {isAnalyzing && (
                  <div className="mt-2 p-2.5 bg-slate-900 text-white rounded-lg text-xs font-mono flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span className="text-cyan-300">{analysisStep}</span>
                  </div>
                )}
              </div>

              {/* AI Detection Summary Metrics from PDF */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                    Detected Damaged Part
                  </span>
                  <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-brand-600" />
                    <span>
                      {selectedParts.map((p) => p.replace('_', ' ').toUpperCase()).join(', ')}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-3">
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                    Damage Severity
                  </span>
                  <div className="font-bold text-sm flex items-center gap-1.5">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        severity === 'severe'
                          ? 'bg-rose-500'
                          : severity === 'moderate'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    ></span>
                    <span className="text-slate-900 capitalize">
                      {severity} ({severityPercentage}%)
                    </span>
                  </div>
                </div>

                <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-3">
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                    Estimated Repair Cost
                  </span>
                  <div className="font-extrabold text-base text-brand-700">
                    {formatINR(costBreakdown.totalPayout)}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive 2D/3D Car Hotspot Mapper Component */}
            <CarHotspotMapper
              selectedParts={selectedParts}
              onTogglePart={handleToggleHotspotPart}
            />

            {/* Security & Anti-Fraud Addon Badges from PDF Screen 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  🔒 Security & Anti-Fraud Addon Badges
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Exif Metadata Verified Badge */}
                <div
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                    fraudCheck.exifVerified
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      fraudCheck.exifVerified ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {fraudCheck.exifVerified ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <BadgeAlert className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold">
                      {fraudCheck.exifVerified ? '✔ Exif Metadata Verified' : '❌ Exif Mismatch'}
                    </div>
                    <div className="text-[11px] opacity-80">
                      {fraudCheck.exifVerified
                        ? 'Geo-Tag Check: Passed • Hardware GPS Verified'
                        : 'GPS Coordinates altered or missing'}
                    </div>
                  </div>
                </div>

                {/* Duplicate Image Check Badge */}
                <div
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                    fraudCheck.duplicateCheck === 'Passed'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      fraudCheck.duplicateCheck === 'Passed'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {fraudCheck.duplicateCheck === 'Passed' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold">
                      {fraudCheck.duplicateCheck === 'Passed'
                        ? '✔ Duplicate Image Check: Passed'
                        : '⚠️ Duplicate Hash Flagged'}
                    </div>
                    <div className="text-[11px] opacity-80">
                      {fraudCheck.duplicateCheck === 'Passed'
                        ? 'Perceptual Hash Guard: Unique across repository'
                        : 'Hash match with previous accident claim'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Action Button from PDF: [ Submit & Generate Instant Quote -> ] */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-4 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white text-base font-bold shadow-lg shadow-brand-500/25 flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>Submit & Generate Instant Quote</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-center text-[11px] text-slate-400 mt-2">
                By submitting, the claim is instantly registered into AutoSettle AI's distributed ledger.
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* Mobile QR Scanner Modal */}
      <QrMobileUploadModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onSelectPreset={handleSelectPreset}
        onDeviceCapture={handleFileUpload}
      />

      {/* Claim Submission Success Dialog Modal */}
      {submittedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-brand-600 uppercase tracking-wider">
                Claim Identifier: #{submittedClaim.id}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Claim Submitted Successfully!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                AI damage analysis completed with {submittedClaim.severity} severity score. Estimated payout of{' '}
                <span className="font-bold text-slate-800">
                  {formatINR(submittedClaim.payoutBreakdown?.totalPayout)}
                </span>{' '}
                calculated.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-left border border-slate-100 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Vehicle:</span>
                <span className="font-semibold text-slate-800">{submittedClaim.vehicleModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Registration:</span>
                <span className="font-mono font-semibold text-slate-800">{submittedClaim.vehicleRegNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-semibold text-emerald-600">{submittedClaim.status}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => navigate(`/assessment/${submittedClaim.id}`)}
                className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <span>View Claim Assessment Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSubmittedClaim(null)}
                className="text-xs text-slate-500 hover:text-slate-700 font-medium py-1"
              >
                Submit another claim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Eye, ShieldAlert, Cpu } from 'lucide-react';

export default function DamageBoundingBoxes({
  imageUrl,
  boundingBoxes = [],
  isAnalyzing = false,
  showOverlays = true,
}) {
  const [activeBoxId, setActiveBoxId] = useState(null);

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-700 aspect-video max-h-[380px] flex items-center justify-center select-none shadow-inner">
      {/* Background Image */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Vehicle Damage Assessment"
          className="w-full h-full object-cover transition-opacity duration-300"
          onError={(e) => {
            // Fallback placeholder if image load fails
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80';
          }}
        />
      ) : (
        <div className="text-slate-400 text-sm flex flex-col items-center">
          <Eye className="w-8 h-8 mb-2 opacity-50" />
          <span>No image loaded</span>
        </div>
      )}

      {/* Cyber Vision HUD Overlay grid */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Top Banner Tag */}
      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none z-10">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-[11px] font-mono text-cyan-400 border border-cyan-500/40 shadow-lg">
          <Cpu className="w-3.5 h-3.5 animate-spin text-cyan-400" />
          YOLOv11-MOTOR-CV • 640x640
        </span>
        {isAnalyzing && (
          <span className="px-2.5 py-1 rounded-md bg-amber-500/90 text-white text-[11px] font-semibold animate-pulse shadow-md">
            ANALYZING DAMAGE...
          </span>
        )}
      </div>

      {/* Laser Scanning Line Animation during analysis */}
      {isAnalyzing && (
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scanline z-20 pointer-events-none"></div>
      )}

      {/* Bounding Box Annotations */}
      {showOverlays && !isAnalyzing && boundingBoxes && boundingBoxes.map((box) => {
        const isHovered = activeBoxId === box.id;
        const borderColor = box.color || '#f59e0b';

        return (
          <div
            key={box.id}
            onMouseEnter={() => setActiveBoxId(box.id)}
            onMouseLeave={() => setActiveBoxId(null)}
            className="absolute transition-all duration-150 cursor-pointer group"
            style={{
              top: `${box.y}%`,
              left: `${box.x}%`,
              width: `${box.width}%`,
              height: `${box.height}%`,
              border: `2px solid ${borderColor}`,
              backgroundColor: isHovered ? `${borderColor}25` : `${borderColor}12`,
              boxShadow: isHovered ? `0 0 16px ${borderColor}` : `0 0 6px ${borderColor}60`,
            }}
          >
            {/* Corner Markers */}
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white"></div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white"></div>
            <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white"></div>
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white"></div>

            {/* Label Tag Header */}
            <div
              className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white shadow-md flex items-center gap-1 whitespace-nowrap z-30"
              style={{ backgroundColor: borderColor }}
            >
              <span>{box.part || 'Impact Area'}</span>
              <span className="opacity-90">({box.confidence}%)</span>
            </div>

            {/* Hover Floating Details Card */}
            {isHovered && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-950/95 backdrop-blur-md text-white text-[11px] p-2 rounded-lg shadow-2xl border border-slate-700 pointer-events-none z-40">
                <div className="font-semibold text-amber-400 flex items-center justify-between">
                  <span>{box.label}</span>
                  <span className="text-[10px] font-mono text-slate-400">{box.confidence}% conf</span>
                </div>
                <div className="text-slate-300 text-[10px] mt-0.5">
                  Target Component: <span className="text-white font-medium">{box.part}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Bottom telemetry bar */}
      <div className="absolute bottom-2 inset-x-3 flex items-center justify-between text-[11px] font-mono text-slate-300 bg-slate-950/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Perceptual Check: {boundingBoxes.length} Damage Region(s) Locked
        </span>
        <span className="text-slate-400 hidden sm:inline">
          Inference Latency: 284ms
        </span>
      </div>
    </div>
  );
}

import React from 'react';
import { CAR_ZONES } from '../data/carHotspots';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CarHotspotMapper({ selectedParts = [], onTogglePart, readOnly = false }) {
  const isSelected = (id) => selectedParts.includes(id);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
            Interactive 2D Vehicle Hotspot Mapper
          </h4>
          <p className="text-xs text-slate-500">
            {readOnly 
              ? 'AI-detected damage zones mapped onto vehicle schematic' 
              : 'Click on vehicle zones to select or verify impacted panels'}
          </p>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-semibold border border-brand-200">
          {selectedParts.length} {selectedParts.length === 1 ? 'Zone Selected' : 'Zones Selected'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* SVG Top-down Car schematic */}
        <div className="md:col-span-5 flex justify-center py-2 bg-gradient-to-b from-slate-50 to-blue-50/40 rounded-lg border border-slate-100 relative">
          <svg
            viewBox="0 0 200 320"
            className="w-40 sm:w-48 h-auto select-none transition-all drop-shadow-md"
          >
            {/* Base Car Chassis Outline */}
            <path
              d="M 60,20 C 75,12 125,12 140,20 C 158,30 168,70 168,130 C 168,190 168,250 152,295 C 140,308 60,308 48,295 C 32,250 32,190 32,130 C 32,70 42,30 60,20 Z"
              fill="#F8FAFC"
              stroke="#94A3B8"
              strokeWidth="3"
            />

            {/* Car Wheels */}
            <rect x="22" y="55" width="12" height="34" rx="4" fill="#334155" />
            <rect x="166" y="55" width="12" height="34" rx="4" fill="#334155" />
            <rect x="22" y="225" width="12" height="34" rx="4" fill="#334155" />
            <rect x="166" y="225" width="12" height="34" rx="4" fill="#334155" />

            {/* Front Bumper Area */}
            <path
              id="front_bumper"
              d="M 52,24 C 70,15 130,15 148,24 C 154,28 152,44 145,46 C 120,40 80,40 55,46 C 48,44 46,28 52,24 Z"
              className={`cursor-pointer transition-colors duration-200 ${
                isSelected('front_bumper')
                  ? 'fill-rose-500/80 stroke-rose-600'
                  : 'fill-slate-200/90 hover:fill-brand-200 stroke-slate-300'
              }`}
              strokeWidth="2"
              onClick={() => !readOnly && onTogglePart && onTogglePart('front_bumper')}
            />

            {/* Hood / Bonnet */}
            <path
              id="hood"
              d="M 56,50 C 75,44 125,44 144,50 C 148,70 148,88 142,100 C 120,95 80,95 58,100 C 52,88 52,70 56,50 Z"
              className={`cursor-pointer transition-colors duration-200 ${
                isSelected('hood')
                  ? 'fill-rose-500/80 stroke-rose-600'
                  : 'fill-slate-200/70 hover:fill-brand-200 stroke-slate-300'
              }`}
              strokeWidth="2"
              onClick={() => !readOnly && onTogglePart && onTogglePart('hood')}
            />

            {/* Left Fender */}
            <path
              id="left_fender"
              d="M 36,46 C 46,44 54,48 54,95 C 44,93 36,88 36,46 Z"
              className={`cursor-pointer transition-colors duration-200 ${
                isSelected('left_fender')
                  ? 'fill-amber-500/80 stroke-amber-600'
                  : 'fill-slate-200/60 hover:fill-brand-200 stroke-slate-300'
              }`}
              strokeWidth="2"
              onClick={() => !readOnly && onTogglePart && onTogglePart('left_fender')}
            />

            {/* Right Fender */}
            <path
              id="right_fender"
              d="M 164,46 C 154,44 146,48 146,95 C 156,93 164,88 164,46 Z"
              className={`cursor-pointer transition-colors duration-200 ${
                isSelected('right_fender')
                  ? 'fill-amber-500/80 stroke-amber-600'
                  : 'fill-slate-200/60 hover:fill-brand-200 stroke-slate-300'
              }`}
              strokeWidth="2"
              onClick={() => !readOnly && onTogglePart && onTogglePart('right_fender')}
            />

            {/* Windshield */}
            <path
              id="windshield"
              d="M 58,105 C 80,100 120,100 142,105 C 138,135 136,138 134,142 C 115,138 85,138 66,142 C 64,138 62,135 58,105 Z"
              className={`cursor-pointer transition-colors duration-200 ${
                isSelected('windshield')
                  ? 'fill-cyan-500/80 stroke-cyan-600'
                  : 'fill-blue-100/90 hover:fill-brand-200 stroke-blue-200'
              }`}
              strokeWidth="2"
              onClick={() => !readOnly && onTogglePart && onTogglePart('windshield')}
            />

            {/* Roof Canopy */}
            <rect
              x="66"
              y="145"
              width="68"
              height="60"
              rx="4"
              fill="#E2E8F0"
              stroke="#CBD5E1"
              strokeWidth="2"
            />

            {/* Left Door */}
            <path
              id="left_door"
              d="M 36,105 C 48,105 62,108 62,185 C 48,185 36,180 36,105 Z"
              className={`cursor-pointer transition-colors duration-200 ${
                isSelected('left_door')
                  ? 'fill-amber-500/80 stroke-amber-600'
                  : 'fill-slate-200/60 hover:fill-brand-200 stroke-slate-300'
              }`}
              strokeWidth="2"
              onClick={() => !readOnly && onTogglePart && onTogglePart('left_door')}
            />

            {/* Right Door */}
            <path
              id="right_door"
              d="M 164,105 C 152,105 138,108 138,185 C 152,185 164,180 164,105 Z"
              className={`cursor-pointer transition-colors duration-200 ${
                isSelected('right_door')
                  ? 'fill-amber-500/80 stroke-amber-600'
                  : 'fill-slate-200/60 hover:fill-brand-200 stroke-slate-300'
              }`}
              strokeWidth="2"
              onClick={() => !readOnly && onTogglePart && onTogglePart('right_door')}
            />

            {/* Rear Quarter Panel */}
            <path
              id="rear_quarter_panel"
              d="M 36,192 C 48,192 62,192 62,255 C 46,252 36,240 36,192 Z"
              className={`cursor-pointer transition-colors duration-200 ${
                isSelected('rear_quarter_panel')
                  ? 'fill-amber-500/80 stroke-amber-600'
                  : 'fill-slate-200/60 hover:fill-brand-200 stroke-slate-300'
              }`}
              strokeWidth="2"
              onClick={() => !readOnly && onTogglePart && onTogglePart('rear_quarter_panel')}
            />

            {/* Rear Bumper Area */}
            <path
              id="rear_bumper"
              d="M 50,285 C 70,296 130,296 150,285 C 155,275 145,268 138,268 C 115,272 85,272 62,268 C 55,268 45,275 50,285 Z"
              className={`cursor-pointer transition-colors duration-200 ${
                isSelected('rear_bumper')
                  ? 'fill-rose-500/80 stroke-rose-600'
                  : 'fill-slate-200/90 hover:fill-brand-200 stroke-slate-300'
              }`}
              strokeWidth="2"
              onClick={() => !readOnly && onTogglePart && onTogglePart('rear_bumper')}
            />

            {/* Indicator Labels on SVG */}
            <text x="100" y="36" textAnchor="middle" fontSize="9" fill="#475569" fontWeight="600" className="pointer-events-none">FRONT</text>
            <text x="100" y="285" textAnchor="middle" fontSize="9" fill="#475569" fontWeight="600" className="pointer-events-none">REAR</text>
          </svg>
        </div>

        {/* Zone List & Selection Chips */}
        <div className="md:col-span-7">
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {CAR_ZONES.map((zone) => {
              const active = isSelected(zone.id);
              return (
                <button
                  key={zone.id}
                  type="button"
                  disabled={readOnly}
                  onClick={() => !readOnly && onTogglePart && onTogglePart(zone.id)}
                  className={`text-left p-2.5 rounded-lg border transition-all text-xs flex flex-col justify-between ${
                    active
                      ? 'bg-rose-50/80 border-rose-300 text-rose-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold truncate">{zone.name}</span>
                    {active ? (
                      <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0"></span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-200 flex-shrink-0"></span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate">{zone.category}</span>
                    {active && <span className="font-mono text-rose-600 font-medium">DAMAGED</span>}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Damaged / Impact Zone
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-200"></span> Intact Structure
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

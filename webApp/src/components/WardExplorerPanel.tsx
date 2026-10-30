import React, { useState } from 'react';
import {
  Thermometer,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  Unlock,
  Building,
  Wind,
  Trees,
  Layers,
  ArrowUpRight,
  SlidersHorizontal
} from 'lucide-react';
import { type WardData } from './GisMap';
import { type UserPersona } from './RoleLoginModal';

interface WardExplorerPanelProps {
  wards: WardData[];
  currentUser: UserPersona;
  selectedWard: WardData;
  onSelectWard: (ward: WardData) => void;
  onOpenBilling: () => void;
}

export const WardExplorerPanel: React.FC<WardExplorerPanelProps> = ({
  wards,
  currentUser,
  selectedWard,
  onSelectWard,
  onOpenBilling
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedLicenseFilter, setSelectedLicenseFilter] = useState<'ALL' | 'LICENSED' | 'LOCKED'>('ALL');
  const [detailWard, setDetailWard] = useState<WardData | null>(null);

  // Filter wards
  const filteredWards = wards.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity =
      selectedSeverity === 'ALL' || w.heat_analysis?.hotspot_severity === selectedSeverity;

    const matchesLicense =
      selectedLicenseFilter === 'ALL'
        ? true
        : selectedLicenseFilter === 'LICENSED'
        ? w.is_licensed
        : !w.is_licensed;

    return matchesSearch && matchesSeverity && matchesLicense;
  });

  return (
    <div className="space-y-6">
      {/* 1. TOP SEARCH & FILTER BAR */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Comprehensive Multi-Ward Environmental Matrix
            </span>
            <h3 className="text-xl font-black text-white mt-0.5">
              Jalandhar Ward Data Explorer &amp; Microclimate Inventory
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Browse, filter, and compare high-resolution thermal remote sensing, vegetation density, and cooling interventions across all municipal wards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Logged in as:</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200">
              {currentUser.name} ({currentUser.organisation})
            </span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Ward name, number, landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Heat Severities</option>
              <option value="CRITICAL">Critical Hotspots (&gt; 46°C)</option>
              <option value="HIGH">High Surface Temp (42°C - 45°C)</option>
              <option value="MODERATE">Moderate Heat (38°C - 41°C)</option>
              <option value="LOW">Cool Islands (&lt; 38°C)</option>
            </select>
          </div>

          {/* Licensing Status Filter (ABAC) */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={selectedLicenseFilter}
              onChange={(e) => setSelectedLicenseFilter(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Wards (Show Locked &amp; Unlocked)</option>
              <option value="LICENSED">Licensed to My Organization Only</option>
              <option value="LOCKED">Requires Additional License (ABAC)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. WARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWards.map((w) => {
          const isSelected = selectedWard?.id === w.id;

          return (
            <div
              key={w.id}
              className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                !w.is_licensed
                  ? 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                  : isSelected
                  ? 'bg-slate-900 border-emerald-500 shadow-xl ring-1 ring-emerald-500'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-lg'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-slate-800 text-slate-400">
                      {w.code}
                    </span>
                    <h4 className="text-sm font-extrabold text-white mt-1 leading-snug">
                      {w.name}
                    </h4>
                  </div>

                  {w.is_licensed ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Unlock className="w-3 h-3" /> Licensed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {w.description}
                </p>

                {/* Metrics Matrix */}
                {w.is_licensed ? (
                  <div className="grid grid-cols-3 gap-2 text-center text-xs py-1">
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Mean LST</span>
                      <span className="font-black text-red-400 text-sm">
                        {w.heat_analysis?.mean_lst_celsius}°C
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Green NDVI</span>
                      <span className="font-black text-emerald-400 text-sm">
                        {w.heat_analysis?.mean_ndvi}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Priority</span>
                      <span className="font-bold text-amber-400 text-xs">
                        Rank #{w.heat_analysis?.vulnerability_rank}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Locked Notice for Unlicensed Customer */
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-red-900/30 text-center space-y-1.5">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-red-400">
                      <Lock className="w-3.5 h-3.5" /> ABAC Protected Data
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Purchased only by <strong>MCJ</strong>. Inaccessible to {currentUser.organisation}.
                    </p>
                  </div>
                )}

                {/* Strategy Badge */}
                <div className="text-[11px]">
                  <span className="text-slate-500 block mb-1">Recommended Solution:</span>
                  {w.code === 'JAL-WARD-14' || w.code === 'JAL-WARD-18' ? (
                    <span className="px-2 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold flex items-center gap-1 w-fit">
                      <Wind className="w-3 h-3" /> High-Albedo Cool Roofs (SRI &gt; 82)
                    </span>
                  ) : w.code === 'JAL-WARD-22' ? (
                    <span className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold flex items-center gap-1 w-fit">
                      <Building className="w-3 h-3" /> Industrial Boundary Buffer Forest
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1 w-fit">
                      <Trees className="w-3 h-3" /> Avenue Native Species Corridor
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                {w.is_licensed ? (
                  <>
                    <button
                      onClick={() => onSelectWard(w)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                    >
                      View on Map
                    </button>
                    <button
                      onClick={() => setDetailWard(w)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center gap-1"
                    >
                      Deep Dive <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={onOpenBilling}
                    className="w-full py-2 rounded-xl bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-700/50 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" /> License This Ward
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. WARD DEEP DIVE MODAL */}
      {detailWard && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {detailWard.code}
                </span>
                <h3 className="text-lg font-black text-white mt-1">{detailWard.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{detailWard.description}</p>
              </div>
              <button
                onClick={() => setDetailWard(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Diagnostic Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block">Mean Surface LST</span>
                <span className="text-xl font-black text-red-400">{detailWard.heat_analysis?.mean_lst_celsius}°C</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block">Peak Thermal Spot</span>
                <span className="text-xl font-black text-red-500">{detailWard.heat_analysis?.max_lst_celsius}°C</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block">NDVI Vegetation</span>
                <span className="text-xl font-black text-emerald-400">{detailWard.heat_analysis?.mean_ndvi}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block">NDBI Built Density</span>
                <span className="text-xl font-black text-amber-400">{detailWard.heat_analysis?.mean_ndbi}</span>
              </div>
            </div>

            {/* In-depth Analysis Section */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-red-400" />
                Urban Heat Island &amp; Microclimate Diagnosis:
              </h4>
              <p className="text-slate-300 leading-relaxed">
                This ward exhibits a surface temperature anomaly of <strong>+{detailWard.heat_analysis?.heat_island_intensity}°C</strong> above 
                rural background baselines. Due to high impervious cover (NDBI: {detailWard.heat_analysis?.mean_ndbi}), solar radiation is stored in 
                concrete/asphalt paving during midday and re-radiated into evening hours.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 space-y-2 text-xs">
              <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Actionable Intervention Spec:
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {detailWard.code === 'JAL-WARD-14' || detailWard.code === 'JAL-WARD-18' ? (
                  <span>
                    <strong>Ground tree planting is unfeasible:</strong> Dense subterranean sewerage pipelines and 3.5m road clearances 
                    limit ground excavation. <strong>Primary Solution:</strong> Install 4,500 sqm of high-albedo cool roof coatings (SRI &gt; 82) on municipal terraces 
                    and deploy tensile pedestrian shade sails between shop facades.
                  </span>
                ) : (
                  <span>
                    <strong>Plantation is feasible:</strong> Target available municipal road margins and pocket parks. 
                    Recommended native species: <strong>Azadirachta indica (Neem)</strong> and <strong>Dalbergia sissoo (Tahli)</strong> with deep taproots 
                    and drought resilience ratings of 4-5.
                  </span>
                )}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  onSelectWard(detailWard);
                  setDetailWard(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-lg"
              >
                Inspect on GIS Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

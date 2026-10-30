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
import axios from 'axios';
import { type WardData } from './GisMap';
import { type UserPersona } from './RoleLoginModal';

const API_BASE = 'http://localhost:8000/api/v1';

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
  const [geocodedResults, setGeocodedResults] = useState<any[]>([]);
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);

  const handleGeocodeSearch = async () => {
    if (!searchQuery) return;
    setIsGeocoding(true);
    try {
      const res = await axios.get(`${API_BASE}/geo/search?q=${encodeURIComponent(searchQuery)}`);
      setGeocodedResults(res.data || []);
    } catch {
      setGeocodedResults([]);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Filter wards (Strict ABAC Geographical Isolation)
  const filteredWards = wards.filter((w) => w.is_licensed).filter((w) => {
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
      {/* 1. TOP GLASSMORPHISM SEARCH & FILTER BAR */}
      <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4 relative overflow-hidden">
        {/* Ambient Light Orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" /> Comprehensive Multi-Ward Environmental Matrix
            </span>
            <h3 className="text-2xl font-black text-white tracking-tight mt-0.5">
              Jalandhar Ward Data Explorer &amp; Microclimate Inventory
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Browse, filter, and compare high-resolution thermal remote sensing, vegetation density, and cooling interventions across all municipal wards.
            </p>
          </div>

          <div className="flex items-center gap-2 relative z-10">
            <span className="text-xs text-slate-400 font-medium">Logged in as:</span>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-800/80 backdrop-blur-md border border-white/10 text-slate-200 shadow">
              {currentUser.name} ({currentUser.organisation})
            </span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 relative z-10">
          {/* Search Box with Geocoding */}
          <div className="relative flex items-center gap-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search Ward or Geocode Landmark..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleGeocodeSearch(); }}
                className="w-full bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-2xl pl-10 pr-3 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-medium transition"
              />
            </div>
            <button
              onClick={handleGeocodeSearch}
              disabled={isGeocoding}
              className="px-3 py-2.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[11px] border border-emerald-500/30 transition flex-shrink-0"
            >
              {isGeocoding ? 'Geocoding...' : '📍 Geocode'}
            </button>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
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
              className="w-full bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
            >
              <option value="ALL">All Wards (Show Locked &amp; Unlocked)</option>
              <option value="LICENSED">Licensed to My Organization Only</option>
              <option value="LOCKED">Requires Additional License (ABAC)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. WARDS GLASS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWards.map((w) => {
          const isSelected = selectedWard?.id === w.id;

          return (
            <div
              key={w.id}
              className={`p-6 rounded-3xl border transition-all duration-300 relative flex flex-col justify-between backdrop-blur-xl ${
                !w.is_licensed
                  ? 'bg-slate-950/40 border-white/5 hover:border-slate-700'
                  : isSelected
                  ? 'bg-slate-900/80 border-emerald-500 shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-500'
                  : 'bg-slate-900/60 border-white/10 hover:border-emerald-500/40 shadow-xl'
              }`}
            >
              <div className="space-y-3.5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-slate-800/80 text-slate-300 border border-white/5">
                      {w.code}
                    </span>
                    <h4 className="text-base font-extrabold text-white mt-1.5 leading-snug">
                      {w.name}
                    </h4>
                  </div>

                  {w.is_licensed ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow">
                      <Unlock className="w-3 h-3 text-emerald-400" /> Licensed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 shadow">
                      <Lock className="w-3 h-3 text-red-400" /> Locked
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {w.description}
                </p>

                {/* Metrics Matrix */}
                {w.is_licensed ? (
                  <div className="grid grid-cols-3 gap-2 text-center text-xs py-1">
                    <div className="p-2.5 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Mean LST</span>
                      <span className="font-black text-red-400 text-sm">
                        {w.heat_analysis?.mean_lst_celsius}°C
                      </span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Green NDVI</span>
                      <span className="font-black text-emerald-400 text-sm">
                        {w.heat_analysis?.mean_ndvi}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Priority</span>
                      <span className="font-bold text-amber-400 text-xs">
                        Rank #{w.heat_analysis?.vulnerability_rank}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Locked Notice for Unlicensed Customer */
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-red-900/40 text-center space-y-1.5">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-red-400">
                      <Lock className="w-3.5 h-3.5" /> ABAC Protected Data
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Purchased only by <strong>MCJ</strong>. Inaccessible to {currentUser.organisation}.
                    </p>
                  </div>
                )}

                {/* Strategy Badge */}
                <div className="text-[11px]">
                  <span className="text-slate-400 block mb-1 font-medium">Recommended Solution:</span>
                  {w.code === 'JAL-WARD-14' || w.code === 'JAL-WARD-18' ? (
                    <span className="px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold flex items-center gap-1.5 w-fit">
                      <Wind className="w-3.5 h-3.5 text-cyan-400" /> High-Albedo Cool Roofs (SRI &gt; 82)
                    </span>
                  ) : w.code === 'JAL-WARD-22' ? (
                    <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1.5 w-fit">
                      <Building className="w-3.5 h-3.5 text-amber-400" /> Industrial Boundary Buffer Forest
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1.5 w-fit">
                      <Trees className="w-3.5 h-3.5 text-emerald-400" /> Avenue Native Species Corridor
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between gap-2">
                {w.is_licensed ? (
                  <>
                    <button
                      onClick={() => onSelectWard(w)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold transition border border-white/5"
                    >
                      View on Map
                    </button>
                    <button
                      onClick={() => setDetailWard(w)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center gap-1 shadow-lg shadow-emerald-500/20"
                    >
                      Deep Dive <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={onOpenBilling}
                    className="w-full py-2.5 rounded-2xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-700/50 text-xs font-bold transition flex items-center justify-center gap-1.5 backdrop-blur-md"
                  >
                    <Lock className="w-3.5 h-3.5" /> License This Ward
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. FROSTED GLASS WARD DEEP DIVE MODAL */}
      {detailWard && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-slate-900/90 border border-white/10 rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-5 backdrop-blur-2xl">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {detailWard.code}
                </span>
                <h3 className="text-xl font-black text-white mt-1">{detailWard.name}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{detailWard.description}</p>
              </div>
              <button
                onClick={() => setDetailWard(null)}
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold border border-white/10"
              >
                ✕
              </button>
            </div>

            {/* Diagnostic Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block">Mean Surface LST</span>
                <span className="text-xl font-black text-red-400">{detailWard.heat_analysis?.mean_lst_celsius}°C</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block">Peak Thermal Spot</span>
                <span className="text-xl font-black text-red-500">{detailWard.heat_analysis?.max_lst_celsius}°C</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block">NDVI Vegetation</span>
                <span className="text-xl font-black text-emerald-400">{detailWard.heat_analysis?.mean_ndvi}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block">NDBI Built Density</span>
                <span className="text-xl font-black text-amber-400">{detailWard.heat_analysis?.mean_ndbi}</span>
              </div>
            </div>

            {/* In-depth Analysis Section */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2 text-xs">
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

            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/50 space-y-2 text-xs">
              <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
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

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  onSelectWard(detailWard);
                  setDetailWard(null);
                }}
                className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-emerald-500/20"
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

import React, { useState } from 'react';
import axios from 'axios';
import {
  Lock,
  Unlock,
  Layers
} from 'lucide-react';
import { type WardData } from './GisMap';

const API_BASE = 'http://localhost:8000/api/v1';

interface WardExplorerPanelProps {
  wards: WardData[];
  selectedWard: WardData;
  onSelectWard: (ward: WardData) => void;
}

export const WardExplorerPanel: React.FC<WardExplorerPanelProps> = ({
  wards,
  selectedWard,
  onSelectWard
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedLicenseFilter, setSelectedLicenseFilter] = useState<'ALL' | 'LICENSED' | 'LOCKED'>('ALL');
  const [detailWard, setDetailWard] = useState<WardData | null>(null);
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);

  const handleGeocodeSearch = async () => {
    if (!searchQuery) return;
    setIsGeocoding(true);
    try {
      const res = await axios.get(`${API_BASE}/geo/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(res.data?.[0]?.display_name || searchQuery);
    } catch {
      // Fallback
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
    <div className="space-y-4">
      {/* 1. GOVERNMENT SEARCH & FILTER BAR */}
      <fieldset className="govt-fieldset">
        <legend className="govt-legend flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-[#064e3b]" /> Municipal Ward Microclimate Inventory &amp; Vulnerability Register
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Search Box with Geocoding */}
          <div className="flex items-center gap-1">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search Ward or Geocode Address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleGeocodeSearch(); }}
                className="govt-input w-full"
              />
            </div>
            <button
              onClick={handleGeocodeSearch}
              disabled={isGeocoding}
              className="govt-btn-primary flex-shrink-0"
            >
              {isGeocoding ? 'Locating...' : '📍 Search'}
            </button>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-2">
            <label className="text-slate-700 font-bold whitespace-nowrap">Heat Severity:</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="govt-input w-full"
            >
              <option value="ALL">All Heat Tiers</option>
              <option value="CRITICAL">Critical Hotspots (&gt; 46°C)</option>
              <option value="HIGH">High Surface Temp (42°C - 45°C)</option>
              <option value="MODERATE">Moderate Heat (38°C - 41°C)</option>
              <option value="LOW">Cool Islands (&lt; 38°C)</option>
            </select>
          </div>

          {/* Licensing Filter */}
          <div className="flex items-center gap-2">
            <label className="text-slate-700 font-bold whitespace-nowrap">ABAC Status:</label>
            <select
              value={selectedLicenseFilter}
              onChange={(e) => setSelectedLicenseFilter(e.target.value as any)}
              className="govt-input w-full"
            >
              <option value="ALL">All Authorized Wards</option>
              <option value="LICENSED">Licensed Wards Only</option>
            </select>
          </div>
        </div>
      </fieldset>

      {/* 2. GOVERNMENT WARDS TABLE */}
      <div className="overflow-x-auto border border-slate-300 rounded-lg bg-white shadow-sm">
        <table className="govt-table">
          <thead>
            <tr>
              <th>Ward Code &amp; Name</th>
              <th>Mean Surface LST (°C)</th>
              <th>NDVI Canopy Index</th>
              <th>Vulnerability Rank</th>
              <th>ABAC Access Status</th>
              <th>Recommended Intervention</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredWards.map((w) => {
              const isSelected = selectedWard?.id === w.id;
              return (
                <tr key={w.id} className={isSelected ? 'bg-emerald-50/90 font-semibold' : ''}>
                  <td>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-800 mr-2">
                      {w.code}
                    </span>
                    <strong className="text-slate-900">{w.name}</strong>
                  </td>
                  <td className="font-bold text-red-700">{w.heat_analysis?.mean_lst_celsius}°C</td>
                  <td className="font-bold text-emerald-800">{w.heat_analysis?.mean_ndvi}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-amber-100 text-amber-900 border border-amber-300">
                      Rank #{w.heat_analysis?.vulnerability_rank}
                    </span>
                  </td>
                  <td>
                    {w.is_licensed ? (
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1 w-fit">
                        <Unlock className="w-3 h-3 text-emerald-700" /> Authorized
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-red-100 text-red-900 border border-red-300 flex items-center gap-1 w-fit">
                        <Lock className="w-3 h-3 text-red-700" /> Restricted
                      </span>
                    )}
                  </td>
                  <td className="text-xs text-slate-800">
                    {w.code === 'JAL-WARD-14' || w.code === 'JAL-WARD-18' ? (
                      <span className="text-cyan-800 font-semibold">High-Albedo Cool Roofs (SRI &gt; 82)</span>
                    ) : (
                      <span className="text-emerald-800 font-semibold">Avenue Native Species Corridor</span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectWard(w)}
                        className="govt-btn-primary text-xs"
                      >
                        Map View
                      </button>
                      <button
                        onClick={() => setDetailWard(w)}
                        className="govt-btn-secondary text-xs"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 3. WARD DETAIL MODAL */}
      {detailWard && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-lg max-w-2xl w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-start justify-between border-b border-slate-300 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  {detailWard.code}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{detailWard.name}</h3>
                <p className="text-slate-600">{detailWard.description}</p>
              </div>
              <button
                onClick={() => setDetailWard(null)}
                className="w-7 h-7 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded bg-slate-50 border border-slate-300">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Mean LST</span>
                <span className="text-lg font-bold text-red-700">{detailWard.heat_analysis?.mean_lst_celsius}°C</span>
              </div>
              <div className="p-3 rounded bg-slate-50 border border-slate-300">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Peak Thermal Spot</span>
                <span className="text-lg font-bold text-red-800">{detailWard.heat_analysis?.max_lst_celsius}°C</span>
              </div>
              <div className="p-3 rounded bg-slate-50 border border-slate-300">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">NDVI Canopy</span>
                <span className="text-lg font-bold text-emerald-800">{detailWard.heat_analysis?.mean_ndvi}</span>
              </div>
              <div className="p-3 rounded bg-slate-50 border border-slate-300">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Priority Rank</span>
                <span className="text-lg font-bold text-amber-800">#{detailWard.heat_analysis?.vulnerability_rank}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-300">
              <button
                onClick={() => {
                  onSelectWard(detailWard);
                  setDetailWard(null);
                }}
                className="govt-btn-primary"
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

import React, { useState } from 'react';
import { Activity } from 'lucide-react';

export const WorkflowVisualizer: React.FC = () => {
  const [viewMode, setViewMode] = useState<'dataflow' | 'steps'>('dataflow');

  const steps = [
    { step: 1, title: "Spatial Boundaries Ingestion", desc: "Upload GeoJSON MultiPolygons for Jalandhar 80 municipal wards." },
    { step: 2, title: "Automated Satellite Ingestion", desc: "USGS Landsat 9 TIRS-2 (Band 10) & Sentinel-2 MSI multispectral rasters with QA cloud masking." },
    { step: 3, title: "Microclimate Temperature Analysis", desc: "Split-window radiative transfer calculates Land Surface Temp (LST); Band math derives NDVI & NDBI." },
    { step: 4, title: "AI Decision Reasoning Engine", desc: "Scores Punjab native tree species for plantable zones; prescribes Cool Roofs (SRI > 82) for dense bazaars." },
    { step: 5, title: "Encrypted Multi-Tenant PostGIS", desc: "Spatial rasters and vector metrics stored in PostgreSQL/PostGIS with Row-Level Security (RLS)." },
    { step: 6, title: "Geographical License Assignment", desc: "Backend grants access strictly to authorized ward IDs in location_access table." },
    { step: 7, title: "Server-Side ABAC Enforcement", desc: "Every API request evaluates location permissions. Unlicensed wards strictly return HTTP 403 Forbidden." },
    { step: 8, title: "Sub-15m Field Verification Audit", desc: "Horticulture officers submit GPS-geotagged inspection audits at 3/6/12 month milestones." }
  ];

  const pipelineStages = [
    {
      stage: 1,
      title: "Remote Sensing Ingestion Layer",
      category: "LAYER 01 · SENSOR FUSION",
      inputs: "USGS Landsat 9 TIRS-2 Band 10 Thermal & Sentinel-2 MSI",
      transformations: "Top-of-Atmosphere Radiance conversion & QA Cloud Masking",
      outputPayload: "Calibrated 30m Thermal & 10m Reflectance Rasters"
    },
    {
      stage: 2,
      title: "Microclimate Analysis Layer",
      category: "LAYER 02 · RASTER MATH",
      inputs: "Thermal Brightness Temp & Multispectral Red/NIR Reflectance",
      transformations: "LST = T_b / [1 + (λ * T_b / ρ) * ln(ε)] & NDVI = (NIR-Red)/(NIR+Red)",
      outputPayload: "Ward Microclimate Records (LST °C, NDVI, NDBI, Vulnerability Rank #1-#80)"
    },
    {
      stage: 3,
      title: "Multi-Tenant ABAC Security Layer",
      category: "LAYER 03 · GEOGRAPHICAL ISOLATION",
      inputs: "User JWT Token (organisation_id) & Target Location ID",
      transformations: "Location License Evaluation: WHERE org_id = :org AND location_id = :loc",
      outputPayload: "HTTP 200 Authorized Payload OR HTTP 403 Forbidden Security Block"
    },
    {
      stage: 4,
      title: "Dual AI Decision Support Layer",
      category: "LAYER 04 · HYBRID COOLING SOLVER",
      inputs: "Authorized Ward Microclimate Diagnostics & Road Right-of-Way Width",
      transformations: "Agro-Climatic Species Matching OR High-Albedo Cool Roof SRI > 82 Solver",
      outputPayload: "Ranked Native Species Matrix OR Cool Roof Engineering Specs"
    },
    {
      stage: 5,
      title: "Field Verification Audit Layer",
      category: "LAYER 05 · TREE PASSPORTS",
      inputs: "Horticulture Officer Camera Geotagged Audit & Sub-15m GPS Coordinates",
      transformations: "Haversine GPS Drift Calculation & Distance Verification Gate (d <= 15m)",
      outputPayload: "Tamper-Evident Tree Passport & Survival Audit Trail"
    }
  ];

  return (
    <div className="space-y-4">
      <fieldset className="govt-fieldset">
        <legend className="govt-legend flex items-center justify-between w-full">
          <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-[#064e3b]" /> System Technical Data Flow &amp; Governance Architecture</span>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('dataflow')}
              className={`px-3 py-1 rounded text-xs font-bold ${
                viewMode === 'dataflow' ? 'bg-[#064e3b] text-white' : 'bg-slate-100 text-slate-700 border border-slate-300'
              }`}
            >
              5-Layer Architecture
            </button>
            <button
              onClick={() => setViewMode('steps')}
              className={`px-3 py-1 rounded text-xs font-bold ${
                viewMode === 'steps' ? 'bg-[#064e3b] text-white' : 'bg-slate-100 text-slate-700 border border-slate-300'
              }`}
            >
              8 Operational Steps
            </button>
          </div>
        </legend>

        {viewMode === 'dataflow' && (
          <div className="space-y-4 pt-2">
            <div className="overflow-x-auto border border-slate-300 rounded bg-white">
              <table className="govt-table">
                <thead>
                  <tr>
                    <th>Architecture Layer</th>
                    <th>Input Data Sources</th>
                    <th>Algorithmic Transformations</th>
                    <th>Output Deliverable</th>
                  </tr>
                </thead>
                <tbody>
                  {pipelineStages.map((ps) => (
                    <tr key={ps.stage}>
                      <td>
                        <strong className="text-slate-900 block">{ps.title}</strong>
                        <span className="text-[10px] font-mono text-slate-500">{ps.category}</span>
                      </td>
                      <td className="text-xs text-slate-800">{ps.inputs}</td>
                      <td className="font-mono text-xs text-amber-900">{ps.transformations}</td>
                      <td className="font-bold text-emerald-900 text-xs">{ps.outputPayload}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewMode === 'steps' && (
          <div className="pt-2">
            <div className="overflow-x-auto border border-slate-300 rounded bg-white">
              <table className="govt-table">
                <thead>
                  <tr>
                    <th>Step #</th>
                    <th>Lifecycle Process</th>
                    <th>Technical Governance Description</th>
                  </tr>
                </thead>
                <tbody>
                  {steps.map((s) => (
                    <tr key={s.step}>
                      <td className="font-mono font-bold text-emerald-900">STEP 0{s.step}</td>
                      <td className="font-bold text-slate-900">{s.title}</td>
                      <td className="text-xs text-slate-700">{s.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </fieldset>
    </div>
  );
};

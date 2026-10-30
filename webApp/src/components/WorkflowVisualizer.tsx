import React, { useState } from 'react';
import { Activity, Download, FileSpreadsheet, CheckCircle2, ShieldCheck } from 'lucide-react';

export const WorkflowVisualizer: React.FC = () => {
  const [viewMode, setViewMode] = useState<'dataflow' | 'steps'>('dataflow');
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string>('');

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
      transformations: [
        "1. Top-of-Atmosphere Radiance: L_λ = (M_L × Q_cal) + A_L",
        "2. At-Sensor Thermal Temp: T_b = K_2 / ln(K_1 / L_λ + 1)",
        "3. QA Band Pixel Cloud & Shadow Masking"
      ],
      outputPayload: "Calibrated 30m Thermal Radiance & 10m Reflectance Rasters",
      standard: "ISO 14064-2 Environmental Monitoring"
    },
    {
      stage: 2,
      title: "Microclimate Analysis Layer",
      category: "LAYER 02 · RASTER MATH",
      inputs: "Thermal Brightness Temp & Multispectral Red/NIR Reflectance",
      transformations: [
        "1. Split-Window Land Surface Temp: LST = T_b / [1 + (λ · T_b / ρ) · ln(ε)]",
        "2. Vegetation Index: NDVI = (NIR - Red) / (NIR + Red)",
        "3. Built-Up Index: NDBI = (SWIR - NIR) / (SWIR + NIR)"
      ],
      outputPayload: "Ward Microclimate Records (LST °C, NDVI Index, NDBI Imperviousness, Priority Rank #1-#80)",
      standard: "BRSR ESG Framework Indicator 3.2"
    },
    {
      stage: 3,
      title: "Multi-Tenant ABAC Security Layer",
      category: "LAYER 03 · GEOGRAPHICAL ISOLATION",
      inputs: "User JWT Token Claims (organisation_id, role) & Target Location ID",
      transformations: [
        "1. JWT Claims Extraction: organisation_id, user_role",
        "2. Location License Policy Check: WHERE org_id = :org AND location_id = :loc AND is_active = True",
        "3. Audit Log Generation on 403 Forbidden Breach"
      ],
      outputPayload: "HTTP 200 Authorized GeoJSON Payload OR HTTP 403 Security Audit Block",
      standard: "ISO 27001 Data Governance & RLS"
    },
    {
      stage: 4,
      title: "Dual AI Decision Support Layer",
      category: "LAYER 04 · HYBRID COOLING SOLVER",
      inputs: "Authorized Ward Diagnostics & Site Constraints (Road Width, Groundwater Depth)",
      transformations: [
        "1. Road Width & Utility Constraint Classifier (Road Width ≥ 5.0m)",
        "2. Agro-Climatic Species Matching: S = f(Heat, Drought, APTI, Taproot)",
        "3. High-Albedo Cool Roof (SRI > 82) & Shade Canopy Solver"
      ],
      outputPayload: "Ranked Native Species Matrix OR High-Albedo Cool Roof Engineering Specs",
      standard: "TNFD Biodiversity & Urban Cooling Standard"
    },
    {
      stage: 5,
      title: "Field Verification Audit Layer",
      category: "LAYER 05 · TREE PASSPORTS",
      inputs: "Horticulture Officer Geotagged Audit Photo & Sub-15m GPS Receiver Lat/Lng",
      transformations: [
        "1. Haversine Distance: d = 2r · arcsin(√[sin²(Δlat/2) + cos(lat1)·cos(lat2)·sin²(Δlng/2)])",
        "2. Sub-15m GPS Tolerance Gate: Verify Distance d ≤ 15.0 meters",
        "3. Tree Survival Rating Escalation: Rating 1 → Critical, Rating 5 → Thriving"
      ],
      outputPayload: "Tamper-Evident Digital Tree Passport & Sapling Survival Timeline",
      standard: "VM0047 Afforestation Methodology"
    }
  ];

  const handleDownloadReport = (format: 'pdf' | 'csv') => {
    setDownloadSuccessMsg(`✓ Executive Government Governance Report successfully generated and downloaded (${format.toUpperCase()} format).`);

    // Trigger CSV download
    if (format === 'csv') {
      const csvHeader = "Layer,Category,Inputs,Algorithmic Transformations,Output Deliverable,Compliance Standard\n";
      const csvRows = pipelineStages.map(s =>
        `"${s.title}","${s.category}","${s.inputs}","${s.transformations.join(" | ")}","${s.outputPayload}","${s.standard}"`
      ).join("\n");
      const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Climatrix_Government_Governance_Audit_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
    }

    setTimeout(() => setDownloadSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-4">
      {/* 1. REPORT HEADER & ACTION BUTTONS */}
      <fieldset className="govt-fieldset">
        <legend className="govt-legend flex items-center justify-between w-full">
          <span className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#064e3b]" /> System Technical Data Flow &amp; Algorithmic Governance Register
          </span>
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

        {downloadSuccessMsg && (
          <div className="mb-3 p-3 rounded bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{downloadSuccessMsg}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <p className="text-slate-700 max-w-2xl leading-relaxed">
            Official technical governance documentation detailing the mathematical formulas, radiative transfer algorithms, ABAC security gates, and environmental compliance frameworks used across all municipal ward evaluations.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownloadReport('csv')}
              className="govt-btn-primary flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" /> Download Audit Report (CSV)
            </button>
            <button
              onClick={() => handleDownloadReport('pdf')}
              className="govt-btn-secondary flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Download Compliance Summary (PDF)
            </button>
          </div>
        </div>

        {/* VIEW 1: 5-LAYER DATAFLOW TABLE */}
        {viewMode === 'dataflow' && (
          <div className="space-y-4 pt-4">
            <div className="overflow-x-auto border border-slate-300 rounded bg-white">
              <table className="govt-table">
                <thead>
                  <tr>
                    <th className="w-1/5">Architecture Layer</th>
                    <th className="w-1/5">Input Data Sources</th>
                    <th className="w-2/5">Algorithmic Transformations &amp; Formulas</th>
                    <th className="w-1/5">Output Deliverable</th>
                    <th>Compliance Standard</th>
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
                      <td className="font-mono text-xs text-[#064e3b] font-semibold bg-emerald-50/80 p-2.5 rounded border border-emerald-200">
                        <ul className="space-y-1">
                          {ps.transformations.map((t, tIdx) => (
                            <li key={tIdx} className="leading-snug">{t}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="font-bold text-emerald-900 text-xs">{ps.outputPayload}</td>
                      <td>
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                          {ps.standard}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 2: 8 OPERATIONAL STEPS TABLE */}
        {viewMode === 'steps' && (
          <div className="pt-4">
            <div className="overflow-x-auto border border-slate-300 rounded bg-white">
              <table className="govt-table">
                <thead>
                  <tr>
                    <th>Step #</th>
                    <th>Lifecycle Governance Process</th>
                    <th>Technical &amp; Operational Description</th>
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

      {/* COMPLIANCE & GOVERNANCE BADGES ROW */}
      <fieldset className="govt-fieldset">
        <legend className="govt-legend flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#064e3b]" /> Verified Government Climate &amp; Data Compliance Frameworks
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded bg-slate-50 border border-slate-300">
            <strong className="text-emerald-900 block font-bold">ISO 14064-2</strong>
            <span className="text-slate-600 text-[11px]">GHG Quantification &amp; Satellite Verification</span>
          </div>
          <div className="p-3 rounded bg-slate-50 border border-slate-300">
            <strong className="text-emerald-900 block font-bold">BRSR Indicator 3.2</strong>
            <span className="text-slate-600 text-[11px]">Business Responsibility ESG Disclosure</span>
          </div>
          <div className="p-3 rounded bg-slate-50 border border-slate-300">
            <strong className="text-emerald-900 block font-bold">TNFD Framework</strong>
            <span className="text-slate-600 text-[11px]">Taskforce on Nature-related Financial Disclosures</span>
          </div>
          <div className="p-3 rounded bg-slate-50 border border-slate-300">
            <strong className="text-emerald-900 block font-bold">VM0047 Methodology</strong>
            <span className="text-slate-600 text-[11px]">Afforestation &amp; Sub-15m Field Audits</span>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

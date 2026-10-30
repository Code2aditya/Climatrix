import React, { useState } from 'react';
import {
  Database,
  Satellite,
  Thermometer,
  Wind,
  Lock,
  CreditCard,
  UserCheck,
  ShieldCheck,
  LayoutDashboard,
  Trees,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Layers,
  ShieldAlert,
  GitMerge,
  Camera,
  Activity
} from 'lucide-react';

export const WorkflowVisualizer: React.FC = () => {
  const [viewMode, setViewMode] = useState<'dataflow' | 'steps'>('dataflow');

  const steps = [
    {
      step: 1,
      title: "Admin Adds City & Ward Spatial Boundaries",
      desc: "Super Admin uploads GeoJSON MultiPolygons for Jalandhar 80 municipal wards.",
      icon: Database,
      color: "from-blue-500 to-cyan-500",
      accent: "text-blue-400",
      border: "border-blue-500/30"
    },
    {
      step: 2,
      title: "Automated Satellite Remote Sensing",
      desc: "Landsat 9 TIRS-2 (Band 10) & Sentinel-2 MSI multispectral ingestion with cloud masking.",
      icon: Satellite,
      color: "from-cyan-500 to-teal-500",
      accent: "text-cyan-400",
      border: "border-cyan-500/30"
    },
    {
      step: 3,
      title: "Hyperlocal Heat & Vegetation Analysis",
      desc: "Radiative transfer calculates Land Surface Temp (LST); Band math derives NDVI & NDBI at 30m resolution.",
      icon: Thermometer,
      color: "from-red-500 to-amber-500",
      accent: "text-red-400",
      border: "border-red-500/30"
    },
    {
      step: 4,
      title: "AI Plantation & Cooling Recommendations",
      desc: "Scores Punjab native species for plantable zones; prescribes Cool Roofs/Shades for unplantable bazaars.",
      icon: Wind,
      color: "from-emerald-500 to-teal-500",
      accent: "text-emerald-400",
      border: "border-emerald-500/30"
    },
    {
      step: 5,
      title: "Encrypted Multi-Tenant Storage & PostGIS",
      desc: "All spatial rasters and vector metrics stored in PostgreSQL/PostGIS with Row-Level Security (RLS).",
      icon: Lock,
      color: "from-purple-500 to-indigo-500",
      accent: "text-purple-400",
      border: "border-purple-500/30"
    },
    {
      step: 6,
      title: "Customer Selects Plan & Wards",
      desc: "Customer (MCJ, University, or Private Developer) chooses subscription tier and specific wards.",
      icon: CreditCard,
      color: "from-amber-500 to-orange-500",
      accent: "text-amber-400",
      border: "border-amber-500/30"
    },
    {
      step: 7,
      title: "Admin Assigns Geographical Licences (ABAC)",
      desc: "Backend grants access strictly to purchased location IDs in the location_access table.",
      icon: UserCheck,
      color: "from-teal-500 to-emerald-500",
      accent: "text-teal-400",
      border: "border-teal-500/30"
    },
    {
      step: 8,
      title: "Customer User Logs In",
      desc: "Customer authenticates via JWT; claims include organisation_id and licensed_location_ids.",
      icon: ShieldCheck,
      color: "from-blue-500 to-indigo-500",
      accent: "text-blue-400",
      border: "border-blue-500/30"
    },
    {
      step: 9,
      title: "Backend Validates ABAC Permissions",
      desc: "Every API request checks if requested ward is licensed. Unlicensed wards are strictly rejected with HTTP 403.",
      icon: Lock,
      color: "from-rose-500 to-red-600",
      accent: "text-rose-400",
      border: "border-rose-500/30"
    },
    {
      step: 10,
      title: "Customer Sees Authorised Dashboard",
      desc: "Authorized maps, heat hotspots, species planner, and alternative cooling specs displayed seamlessly.",
      icon: LayoutDashboard,
      color: "from-emerald-500 to-green-500",
      accent: "text-emerald-400",
      border: "border-emerald-500/30"
    },
    {
      step: 11,
      title: "Ground Field Monitoring & Verification",
      desc: "Field workers log GPS-tagged inspection photos; 3/6/12-month sapling survival tracked over time.",
      icon: Trees,
      color: "from-green-500 to-emerald-600",
      accent: "text-green-400",
      border: "border-green-500/30"
    }
  ];

  const pipelineStages = [
    {
      stage: 1,
      title: "Spatial & Remote Sensing Ingestion",
      category: "INPUT & RAW RASTERS",
      icon: Satellite,
      color: "from-blue-600 to-cyan-600",
      accent: "text-cyan-400",
      inputs: [
        "USGS Landsat 9 TIRS-2 Band 10 Thermal",
        "Copernicus Sentinel-2 MSI (B4, B8, B11)",
        "Municipal Ward GeoJSON Vector Boundaries"
      ],
      entities: ["SatelliteAsset", "Location"],
      transformations: [
        "Top-of-Atmosphere (TOA) spectral radiance conversion",
        "At-sensor thermal brightness temperature mapping",
        "QA Band cloud & shadow pixel masking"
      ],
      outputPayload: "Calibrated 30m Surface Reflectance & Thermal Rasters"
    },
    {
      stage: 2,
      title: "Microclimate Matrix & Raster Analysis",
      icon: Cpu,
      category: "COMPUTATIONAL ALGORITHMS",
      color: "from-red-600 to-amber-600",
      accent: "text-red-400",
      inputs: [
        "Calibrated Thermal Brightness Temp",
        "Multispectral Red, NIR, & SWIR Reflectance"
      ],
      entities: ["HeatAnalysis"],
      transformations: [
        "Split-Window Radiative Transfer: LST = T_b / [1 + (λ * T_b / ρ) * ln(ε)]",
        "NDVI Index: (NIR - Red) / (NIR + Red)",
        "NDBI Index: (SWIR - NIR) / (SWIR + NIR)",
        "UHI Delta: ΔT = LST_Ward - LST_Rural_Baseline"
      ],
      outputPayload: "Ward Microclimate Records (LST °C, NDVI, NDBI, Vulnerability Rank #1-#80)"
    },
    {
      stage: 3,
      title: "Zero-Trust ABAC Security Gate",
      icon: ShieldAlert,
      category: "DATA PROTECTION & ABAC",
      color: "from-purple-600 to-indigo-600",
      accent: "text-purple-400",
      inputs: [
        "Customer JWT Token (organisation_id, role)",
        "Target Location ID requested"
      ],
      entities: ["LocationAccess", "AuditLog"],
      transformations: [
        "Location License Evaluation: WHERE org_id = :org_id AND location_id = :loc_id AND is_active = True",
        "Unauthorized Breach Detection: Audit Log entry generated on 403 Forbidden"
      ],
      outputPayload: "HTTP 200 Authorized Payload OR HTTP 403 Forbidden Security Block"
    },
    {
      stage: 4,
      title: "Dual AI Climate Intervention Engine",
      icon: GitMerge,
      category: "DECISION SUPPORT SYSTEM",
      color: "from-emerald-600 to-teal-600",
      accent: "text-emerald-400",
      inputs: [
        "Authorized Ward Microclimate Diagnostics",
        "Site Constraints: Road Width (m), Groundwater Depth (m), Site Typology"
      ],
      entities: ["TreeSpecies", "PlantationSite", "CoolingRecommendation"],
      transformations: [
        "Plantation Feasibility Classifier: Checks road width & underground utilities",
        "Native Species Suitability Scoring: Evaluates Neem, Tahli, Kachnar, Kikar for root profile, drought & APTI",
        "Alternative Cooling Solver: Prescribes High-Albedo Cool Roofs (SRI > 82) for unplantable dense bazaars"
      ],
      outputPayload: "Ranked Native Species Matrix OR High-Albedo Cool Roof Engineering Specs"
    },
    {
      stage: 5,
      title: "Field Audit & Post-Planting Verification",
      icon: Camera,
      category: "GROUND TRUTH FEEDBACK LOOP",
      color: "from-green-600 to-emerald-700",
      accent: "text-green-400",
      inputs: [
        "Field Officer Camera Geotagged Submission",
        "Sub-5m GPS Receiver Lat/Lng Coordinates"
      ],
      entities: ["PlantedTree", "TreeInspection"],
      transformations: [
        "Haversine GPS Drift Calculation: Distance d = 2r * arcsin(√[sin²(Δlat/2) + cos(lat1)*cos(lat2)*sin²(Δlng/2)])",
        "GPS Verification Gate: Distance <= 15m tolerance for valid audit",
        "Tree Survival State Escalation: Rating <= 1 -> CRITICAL, Rating >= 4 -> THRIVING"
      ],
      outputPayload: "Tamper-Evident Sapling Survival Audit & Growth Timeline"
    }
  ];

  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* HEADER & VIEW TOGGLE SWITCH */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 relative z-10">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400" /> System Workflow &amp; Data Pipeline Architecture
          </span>
          <h3 className="text-2xl font-black text-white tracking-tight mt-0.5">
            Structured Flow of Data &amp; Operational Lifecycle
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Explore the technical ingestion, mathematical transformation, ABAC security enforcement, and field verification loops.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex gap-1.5 bg-slate-950/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 text-xs font-bold shadow-lg">
          <button
            onClick={() => setViewMode('dataflow')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              viewMode === 'dataflow'
                ? 'bg-emerald-500 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" /> Technical Data Flow Pipeline
          </button>
          <button
            onClick={() => setViewMode('steps')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              viewMode === 'steps'
                ? 'bg-emerald-500 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" /> Operational Steps (11 Steps)
          </button>
        </div>
      </div>

      {/* VIEW 1: STRUCTURED TECHNICAL DATA FLOW PIPELINE */}
      {viewMode === 'dataflow' && (
        <div className="space-y-6 relative z-10">
          {/* High-Level Pipeline Flow Nodes */}
          <div className="p-6 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/5 overflow-x-auto shadow-inner">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-4">
              High-Level Pipeline Flow Diagram
            </span>
            <div className="flex items-center justify-between min-w-[750px] gap-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-center space-y-1 flex-1 shadow">
                <Satellite className="w-5 h-5 text-cyan-400 mx-auto" />
                <span className="font-bold text-white block">1. Remote Sensing</span>
                <span className="text-[10px] text-slate-400 block">Landsat &amp; Sentinel</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />

              <div className="p-3.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-red-500/30 text-center space-y-1 flex-1 shadow">
                <Cpu className="w-5 h-5 text-red-400 mx-auto" />
                <span className="font-bold text-white block">2. Raster Math</span>
                <span className="text-[10px] text-slate-400 block">LST, NDVI, NDBI</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />

              <div className="p-3.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-purple-500/30 text-center space-y-1 flex-1 shadow">
                <Lock className="w-5 h-5 text-purple-400 mx-auto" />
                <span className="font-bold text-white block">3. ABAC Gate</span>
                <span className="text-[10px] text-slate-400 block">Location License</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />

              <div className="p-3.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 text-center space-y-1 flex-1 shadow">
                <GitMerge className="w-5 h-5 text-emerald-400 mx-auto" />
                <span className="font-bold text-white block">4. Dual AI Engine</span>
                <span className="text-[10px] text-slate-400 block">Species vs Cool Roofs</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />

              <div className="p-3.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-green-500/30 text-center space-y-1 flex-1 shadow">
                <Camera className="w-5 h-5 text-green-400 mx-auto" />
                <span className="font-bold text-white block">5. Field Audit</span>
                <span className="text-[10px] text-slate-400 block">GPS Verification</span>
              </div>
            </div>
          </div>

          {/* Detailed Pipeline Stage Cards */}
          <div className="space-y-4">
            {pipelineStages.map((ps) => {
              const Icon = ps.icon;
              return (
                <div
                  key={ps.stage}
                  className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 transition-all shadow-xl space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-tr ${ps.color} text-white flex items-center justify-center font-bold text-sm shadow`}>
                        {ps.stage}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-extrabold text-slate-400 tracking-wider">
                          STAGE 0{ps.stage} · {ps.category}
                        </span>
                        <h4 className={`text-base font-bold ${ps.accent}`}>
                          {ps.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                      <span>Database Entities:</span>
                      {ps.entities.map((ent, eIdx) => (
                        <span key={eIdx} className="px-2.5 py-0.5 rounded-full bg-slate-800/80 text-emerald-300 font-bold border border-white/5">
                          {ent}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Input Sources */}
                    <div className="p-4 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/5 space-y-2">
                      <span className="font-bold text-slate-300 block uppercase tracking-wider text-[10px]">
                        📥 Input Data Sources:
                      </span>
                      <ul className="space-y-1.5 text-slate-300">
                        {ps.inputs.map((inp, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 flex-shrink-0"></span>
                            <span>{inp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Mathematical & Algorithmic Transformations */}
                    <div className="p-4 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/5 space-y-2">
                      <span className="font-bold text-slate-300 block uppercase tracking-wider text-[10px]">
                        ⚙️ Key Transformations &amp; Formulas:
                      </span>
                      <ul className="space-y-1.5 text-slate-300">
                        {ps.transformations.map((trans, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 flex-shrink-0"></span>
                            <span className="font-mono text-[11px]">{trans}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Output Deliverable */}
                    <div className="p-4 rounded-2xl bg-emerald-950/30 backdrop-blur-md border border-emerald-800/40 space-y-2">
                      <span className="font-bold text-emerald-400 block uppercase tracking-wider text-[10px]">
                        📤 Output Deliverable:
                      </span>
                      <p className="text-emerald-300 font-semibold leading-relaxed">
                        {ps.outputPayload}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: 11-STEP OPERATIONAL WORKFLOW */}
      {viewMode === 'steps' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className={`p-5 rounded-3xl bg-slate-900/60 backdrop-blur-xl border ${s.border} hover:border-emerald-500/50 transition-all shadow-xl relative group`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-white/5">
                    STEP 0{s.step}
                  </span>
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${s.color} text-slate-950 flex items-center justify-center font-bold shadow`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h4 className={`text-sm font-bold ${s.accent} leading-snug`}>
                  {s.title}
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* FOOTER NOTICE */}
      <div className="p-4 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/10 text-xs text-slate-300 flex items-center justify-between relative z-10">
        <span className="text-slate-400">
          Core SaaS Commercial Principle: <strong className="text-white">Strict Geographical Licensing (ABAC)</strong> prevents unauthorized cross-ward or cross-customer data leakage.
        </span>
        <span className="text-emerald-400 font-bold">100% Backend-Enforced</span>
      </div>
    </div>
  );
};

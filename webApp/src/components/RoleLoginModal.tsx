import React, { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowRight
} from 'lucide-react';

export interface UserPersona {
  id: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ORG_ADMIN' | 'ANALYST' | 'FIELD_WORKER';
  organisation: string;
  orgSlug: string;
  email: string;
  avatarText: string;
  color: string;
  licensedWards: string[];
  description: string;
  responsibilities: string[];
}

export const PRESET_PERSONAS: UserPersona[] = [
  {
    id: "persona-super-admin",
    name: "Dr. Vikramjit Singh",
    role: "SUPER_ADMIN",
    organisation: "Climatrix Platform Operations",
    orgSlug: "climatrix-ops",
    email: "admin@climatrix.io",
    avatarText: "VS",
    color: "from-purple-600 to-indigo-600",
    licensedWards: ["ALL (Wards 1 - 80)"],
    description: "Platform Owner & Administrator",
    responsibilities: [
      "Manage all customer organizations and subscription tiers",
      "Add/edit city and ward GeoJSON boundaries",
      "Manage satellite raster pipelines (Landsat & Sentinel)",
      "Assign geographical licenses & audit security logs"
    ]
  },
  {
    id: "persona-mcj-admin",
    name: "Harpreet Kaur, IAS",
    role: "ORG_ADMIN",
    organisation: "Municipal Corporation Jalandhar (MCJ)",
    orgSlug: "mcjalandhar",
    email: "commissioner@mcjalandhar.gov.in",
    avatarText: "HK",
    color: "from-emerald-600 to-teal-600",
    licensedWards: ["Ward 4", "Ward 14", "Ward 18", "Ward 37", "Ward 55", "Ward 68"],
    description: "Municipal Customer Head",
    responsibilities: [
      "Review city ward heat vulnerability ranking",
      "Authorize high-albedo cool roofs for Rainak Bazaar (Ward 14)",
      "Oversee municipal plantation drives and sapling survival",
      "Manage internal staff (GIS Analysts & Field Workers)"
    ]
  },
  {
    id: "persona-mcj-analyst",
    name: "Rajinder Sharma",
    role: "ANALYST",
    organisation: "Municipal Corporation Jalandhar (MCJ)",
    orgSlug: "mcjalandhar",
    email: "gis.analyst@mcjalandhar.gov.in",
    avatarText: "RS",
    color: "from-cyan-600 to-blue-600",
    licensedWards: ["Ward 4", "Ward 14", "Ward 18", "Ward 37", "Ward 55", "Ward 68"],
    description: "GIS & Remote Sensing Specialist",
    responsibilities: [
      "Analyze Landsat LST and Sentinel NDVI rasters",
      "Run AI species matching for Jalandhar soil & water table",
      "Evaluate micro-site plantation feasibility",
      "Export executive climate reports for licensed wards"
    ]
  },
  {
    id: "persona-mcj-field",
    name: "Gurpreet Singh",
    role: "FIELD_WORKER",
    organisation: "Municipal Corporation Jalandhar (MCJ)",
    orgSlug: "mcjalandhar",
    email: "field.worker@mcjalandhar.gov.in",
    avatarText: "GS",
    color: "from-green-600 to-emerald-700",
    licensedWards: ["Assigned Sites (Wards 4 & 55)"],
    description: "Horticulture Ground Field Officer",
    responsibilities: [
      "Register newly planted saplings with sub-5m GPS tags",
      "Submit 3/6/12-month field inspection audits",
      "Upload ground photos and soil moisture observations",
      "Flag distressed or dead saplings for immediate replacement"
    ]
  },
  {
    id: "persona-pgd-developer",
    name: "Amanpreet Varma",
    role: "ORG_ADMIN",
    organisation: "Punjab Green Developers Ltd (PGD)",
    orgSlug: "pgd-infra",
    email: "sustainability@pgd-infra.in",
    avatarText: "AV",
    color: "from-amber-600 to-orange-600",
    licensedWards: ["Ward 22 (Industrial)", "Ward 68 (Campus)"],
    description: "Private Customer (Restricted License)",
    responsibilities: [
      "Purchased ONLY Industrial Focal Point (Ward 22) and Campus (Ward 68)",
      "ABAC Strict Isolation: Strictly BLOCKED from viewing civic wards (Ward 14, 18, 37)",
      "Plan industrial buffer tree belts and factory cool roofs",
      "Generate private corporate ESG disclosure metrics"
    ]
  }
];

interface RoleLoginModalProps {
  currentUser: UserPersona;
  onSelectPersona: (persona: UserPersona) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const RoleLoginModal: React.FC<RoleLoginModalProps> = ({
  currentUser,
  onSelectPersona,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'personas' | 'custom'>('personas');
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = PRESET_PERSONAS.find((p) => p.email.toLowerCase() === customEmail.toLowerCase());
    if (matched) {
      onSelectPersona(matched);
      onClose();
    } else {
      setLoginError("Invalid credentials. Try using one of the seeded system personas.");
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-[#030712]/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-[#0b101d] border border-[#1e293b] rounded-3xl max-w-4xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
          <div>
            <span className="font-mono tracking-widest text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" /> Multi-Tenant Role-Based Access Control (RBAC &amp; ABAC)
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
              Role Authentication &amp; Tenant Switcher
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Select any persona to experience the platform with their authentic permissions and licensed geographical polygons.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-[#1e293b] flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab switch between Preset Personas and Manual Login */}
        <div className="flex gap-2 bg-[#030712] p-1.5 rounded-2xl border border-[#1e293b] w-fit text-xs font-bold shadow">
          <button
            onClick={() => setActiveTab('personas')}
            className={`px-5 py-2.5 rounded-xl transition ${
              activeTab === 'personas'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ One-Click Persona Login (5 Seeded Roles)
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-5 py-2.5 rounded-xl transition ${
              activeTab === 'custom'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔑 Standard Email/Password Form
          </button>
        </div>

        {/* 1. PERSONAS GRID */}
        {activeTab === 'personas' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRESET_PERSONAS.map((persona) => {
                const isSelected = currentUser.id === persona.id;
                return (
                  <div
                    key={persona.id}
                    className={`p-5 rounded-3xl border transition-all duration-300 relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-500 shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-500'
                        : 'bg-[#030712]/80 border-[#1e293b] hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${persona.color} text-white flex items-center justify-center font-black text-sm shadow`}>
                            {persona.avatarText}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">{persona.name}</h4>
                            <span className="text-[11px] text-slate-300 block">{persona.organisation}</span>
                          </div>
                        </div>

                        <span className={`font-mono text-[10px] uppercase px-2.5 py-0.5 rounded-full font-bold ${
                          persona.role === 'SUPER_ADMIN'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : persona.role === 'FIELD_WORKER'
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : persona.orgSlug === 'pgd-infra'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {persona.role}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#030712] border border-[#1e293b] text-[11px] space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Email:</span>
                          <span className="font-mono text-slate-200">{persona.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Licensed Wards:</span>
                          <span className="font-bold text-emerald-400">{persona.licensedWards.join(', ')}</span>
                        </div>
                      </div>

                      <ul className="text-[11px] text-slate-300 space-y-1">
                        {persona.responsibilities.slice(0, 2).map((resp, rIdx) => (
                          <li key={rIdx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 mt-3 border-t border-[#1e293b] flex items-center justify-between">
                      {isSelected ? (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Current Active Session
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            onSelectPersona(persona);
                            onClose();
                          }}
                          className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 font-bold text-xs transition border border-[#1e293b] flex items-center justify-center gap-1.5 shadow"
                        >
                          Switch to {persona.name.split(' ')[0]} <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. MANUAL LOGIN FORM */}
        {activeTab === 'custom' && (
          <form onSubmit={handleCustomLogin} className="max-w-md mx-auto space-y-4 py-4 text-xs">
            {loginError && (
              <div className="p-3 rounded-2xl bg-red-950/60 border border-red-800 text-red-200 flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Email Address:</label>
              <input
                type="email"
                placeholder="e.g. commissioner@mcjalandhar.gov.in"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full bg-[#030712] border border-[#1e293b] rounded-2xl p-3 text-slate-100 focus:outline-none focus:border-emerald-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Password:</label>
              <input
                type="password"
                placeholder="Enter password (e.g. MCJAdmin2026!)"
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
                className="w-full bg-[#030712] border border-[#1e293b] rounded-2xl p-3 text-slate-100 focus:outline-none focus:border-emerald-500 font-medium"
                required
              />
            </div>

            <div className="p-3 rounded-2xl bg-[#030712] border border-[#1e293b] text-[11px] text-slate-300">
              💡 <strong>Seed Password Hint:</strong> Use <code>MCJAdmin2026!</code>, <code>AntigravityAdmin2026!</code>, or <code>PGDAdmin2026!</code>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" /> Authenticate &amp; Verify Location Licenses
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

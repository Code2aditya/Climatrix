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
    <div className="fixed inset-0 z-[99999] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-300 rounded-lg max-w-4xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Government Header */}
        <div className="bg-[#064e3b] text-white p-4 rounded-t-lg flex items-center justify-between border-b-2 border-[#ff9933]">
          <div>
            <span className="text-xs uppercase font-bold text-amber-300 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-300" /> Department Authentication &amp; User Role Selection
            </span>
            <h2 className="text-lg font-extrabold text-white mt-0.5">
              Official Tenant &amp; Role Switcher Portal
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded bg-emerald-900 hover:bg-emerald-800 text-white font-bold flex items-center justify-center border border-emerald-700"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Tab switch */}
          <div className="flex gap-2 bg-slate-100 p-1 rounded-md border border-slate-300 w-fit text-xs font-bold">
            <button
              onClick={() => setActiveTab('personas')}
              className={`px-4 py-2 rounded transition ${
                activeTab === 'personas'
                  ? 'bg-[#064e3b] text-white font-bold shadow'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              ⚡ Official System Personas (5 Seeded Roles)
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-2 rounded transition ${
                activeTab === 'custom'
                  ? 'bg-[#064e3b] text-white font-bold shadow'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              🔑 Standard Credentials Login
            </button>
          </div>

          {/* 1. PERSONAS TABLE */}
          {activeTab === 'personas' && (
            <div className="space-y-4">
              <div className="overflow-x-auto border border-slate-300 rounded-md">
                <table className="govt-table">
                  <thead>
                    <tr>
                      <th>Official User</th>
                      <th>Department / Organization</th>
                      <th>System Role</th>
                      <th>Licensed Geography</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRESET_PERSONAS.map((persona) => {
                      const isSelected = currentUser.id === persona.id;
                      return (
                        <tr key={persona.id} className={isSelected ? 'bg-emerald-50/80 font-semibold' : ''}>
                          <td>
                            <strong className="text-slate-900 block">{persona.name}</strong>
                            <span className="text-[11px] text-slate-500">{persona.email}</span>
                          </td>
                          <td className="text-slate-800 font-medium">{persona.organisation}</td>
                          <td>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                              {persona.role}
                            </span>
                          </td>
                          <td className="text-emerald-900 font-bold text-xs">{persona.licensedWards.join(', ')}</td>
                          <td>
                            {isSelected ? (
                              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Active Session
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  onSelectPersona(persona);
                                  onClose();
                                }}
                                className="govt-btn-primary flex items-center gap-1 text-xs"
                              >
                                Authenticate <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. MANUAL LOGIN FORM */}
          {activeTab === 'custom' && (
            <form onSubmit={handleCustomLogin} className="max-w-md mx-auto space-y-3 py-2 text-xs">
              {loginError && (
                <div className="p-3 rounded bg-red-50 border border-red-300 text-red-800 flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="text-slate-800 block mb-1 font-bold">Email Address <span className="text-red-600">*</span></label>
                <input
                  type="email"
                  placeholder="e.g. commissioner@mcjalandhar.gov.in"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="govt-input w-full"
                  required
                />
              </div>

              <div>
                <label className="text-slate-800 block mb-1 font-bold">Password <span className="text-red-600">*</span></label>
                <input
                  type="password"
                  placeholder="Enter official password"
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                  className="govt-input w-full"
                  required
                />
              </div>

              <button
                type="submit"
                className="govt-btn-primary w-full flex items-center justify-center gap-2 py-2.5"
              >
                <KeyRound className="w-4 h-4" /> Authenticate &amp; Access System
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

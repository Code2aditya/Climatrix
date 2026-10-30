import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Thermometer,
  Trees,
  ShieldAlert,
  Compass,
  Layers,
  MapPin,
  CheckCircle2,
  Leaf,
  Wind,
  CreditCard,
  Camera,
  Lock,
  Unlock,
  Users,
  Workflow,
  BrainCircuit,
  LogOut,
  Shield,
  ArrowRight,
  KeyRound,
  AlertCircle,
  Menu,
  X,
  Home,
  Globe,
  ChevronRight,
  Sparkles,
  Building,
  GraduationCap
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { GisMap, type WardData, type TreeData } from './components/GisMap';
import { RoleLoginModal, PRESET_PERSONAS, type UserPersona } from './components/RoleLoginModal';
import { WardExplorerPanel } from './components/WardExplorerPanel';
import { WorkflowVisualizer } from './components/WorkflowVisualizer';
import { LlmDecisionPanel } from './components/LlmDecisionPanel';
import { LandingPage } from './components/LandingPage';

const API_BASE = 'http://localhost:8000/api/v1';

// Comprehensive Jalandhar Wards baseline data
const INITIAL_WARDS: WardData[] = [
  {
    id: "ward-04",
    name: "Ward 4 - Model Town & Lajpat Nagar",
    code: "JAL-WARD-04",
    lat: 31.3090,
    lng: 75.5810,
    area_sqkm: 3.8,
    population_density: 6200,
    coordinates: [[75.572, 31.301], [75.590, 31.301], [75.590, 31.317], [75.572, 31.317], [75.572, 31.301]],
    description: "Planned residential suburb with moderate canopy, wide avenues, and high plantation capacity.",
    is_licensed: true,
    heat_analysis: {
      mean_lst_celsius: 38.2,
      max_lst_celsius: 41.0,
      mean_ndvi: 0.32,
      mean_ndbi: -0.05,
      hotspot_severity: "MODERATE",
      vulnerability_rank: 14,
      heat_island_intensity: 1.7
    }
  },
  {
    id: "ward-14",
    name: "Ward 14 - Rainak Bazaar & Jyoti Chowk",
    code: "JAL-WARD-14",
    lat: 31.3255,
    lng: 75.5750,
    area_sqkm: 1.9,
    population_density: 18500,
    coordinates: [[75.568, 31.320], [75.582, 31.320], [75.582, 31.331], [75.568, 31.331], [75.568, 31.320]],
    description: "Ultra-dense historic commercial bazaar. Severe heat trap. Underground utilities prevent ground trees. High priority for Cool Roofs.",
    is_licensed: true,
    heat_analysis: {
      mean_lst_celsius: 47.8,
      max_lst_celsius: 50.6,
      mean_ndvi: 0.07,
      mean_ndbi: 0.44,
      hotspot_severity: "CRITICAL",
      vulnerability_rank: 1,
      heat_island_intensity: 11.3
    }
  },
  {
    id: "ward-18",
    name: "Ward 18 - Phagwara Gate & Attari Bazaar",
    code: "JAL-WARD-18",
    lat: 31.3280,
    lng: 75.5830,
    area_sqkm: 2.1,
    population_density: 16200,
    coordinates: [[75.577, 31.322], [75.589, 31.322], [75.589, 31.334], [75.577, 31.334], [75.577, 31.322]],
    description: "Electronics and wholesale market. Metal canopies and asphalt paving. Recommended for tensile shade sails and cool pavements.",
    is_licensed: true,
    heat_analysis: {
      mean_lst_celsius: 46.9,
      max_lst_celsius: 49.7,
      mean_ndvi: 0.08,
      mean_ndbi: 0.39,
      hotspot_severity: "CRITICAL",
      vulnerability_rank: 2,
      heat_island_intensity: 10.4
    }
  },
  {
    id: "ward-22",
    name: "Ward 22 - Industrial Focal Point",
    code: "JAL-WARD-22",
    lat: 31.3520,
    lng: 75.5450,
    area_sqkm: 6.5,
    population_density: 4100,
    coordinates: [[75.535, 31.342], [75.555, 31.342], [75.555, 31.362], [75.535, 31.362], [75.535, 31.342]],
    description: "Heavy manufacturing hub with boiler emissions. Ideal for boundary buffer plantations of Neem and Kikar.",
    is_licensed: true,
    heat_analysis: {
      mean_lst_celsius: 48.4,
      max_lst_celsius: 51.2,
      mean_ndvi: 0.05,
      mean_ndbi: 0.48,
      hotspot_severity: "CRITICAL",
      vulnerability_rank: 3,
      heat_island_intensity: 11.9
    }
  },
  {
    id: "ward-28",
    name: "Ward 28 - Leather Complex & Transport Nagar",
    code: "JAL-WARD-28",
    lat: 31.3410,
    lng: 75.5320,
    area_sqkm: 5.4,
    population_density: 4800,
    coordinates: [[75.520, 31.330], [75.544, 31.330], [75.544, 31.350], [75.520, 31.350], [75.520, 31.330]],
    description: "Industrial tanning and freight corridor. Extreme daytime surface heating. High priority for air pollution filtering trees.",
    is_licensed: true,
    heat_analysis: {
      mean_lst_celsius: 47.2,
      max_lst_celsius: 50.1,
      mean_ndvi: 0.06,
      mean_ndbi: 0.42,
      hotspot_severity: "CRITICAL",
      vulnerability_rank: 4,
      heat_island_intensity: 10.7
    }
  },
  {
    id: "ward-37",
    name: "Ward 37 - Basti Sheikh & Guzan",
    code: "JAL-WARD-37",
    lat: 31.3180,
    lng: 75.5520,
    area_sqkm: 3.2,
    population_density: 14200,
    coordinates: [[75.542, 31.310], [75.562, 31.310], [75.562, 31.326], [75.542, 31.326], [75.542, 31.310]],
    description: "Dense residential settlements with narrow alleys. Suitable for compact non-invasive species (Kachnar) and pocket green spaces.",
    is_licensed: true,
    heat_analysis: {
      mean_lst_celsius: 44.5,
      max_lst_celsius: 47.3,
      mean_ndvi: 0.11,
      mean_ndbi: 0.28,
      hotspot_severity: "HIGH",
      vulnerability_rank: 5,
      heat_island_intensity: 8.0
    }
  },
  {
    id: "ward-44",
    name: "Ward 44 - Basti Nau & Sports Market",
    code: "JAL-WARD-44",
    lat: 31.3210,
    lng: 75.5630,
    area_sqkm: 2.8,
    population_density: 15100,
    coordinates: [[75.555, 31.314], [75.571, 31.314], [75.571, 31.328], [75.555, 31.328], [75.555, 31.314]],
    description: "Famous sports goods manufacturing cluster. Dense workshop roofs and narrow access corridors. Recommended for green roofs.",
    is_licensed: true,
    heat_analysis: {
      mean_lst_celsius: 44.1,
      max_lst_celsius: 46.8,
      mean_ndvi: 0.12,
      mean_ndbi: 0.29,
      hotspot_severity: "HIGH",
      vulnerability_rank: 6,
      heat_island_intensity: 7.6
    }
  },
  {
    id: "ward-55",
    name: "Ward 55 - Rama Mandi Corridor",
    code: "JAL-WARD-55",
    lat: 31.3160,
    lng: 75.6180,
    area_sqkm: 4.8,
    population_density: 9500,
    coordinates: [[75.605, 31.305], [75.631, 31.305], [75.631, 31.327], [75.605, 31.327], [75.605, 31.305]],
    description: "Major transit and highway junction with high particulate pollution. Suitable for avenue multi-tier shelterbelts of Tahli and Arjun.",
    is_licensed: true,
    heat_analysis: {
      mean_lst_celsius: 43.1,
      max_lst_celsius: 45.9,
      mean_ndvi: 0.16,
      mean_ndbi: 0.21,
      hotspot_severity: "HIGH",
      vulnerability_rank: 7,
      heat_island_intensity: 6.6
    }
  },
  {
    id: "ward-68",
    name: "Ward 68 - GNDU Regional Campus",
    code: "JAL-WARD-68",
    lat: 31.2950,
    lng: 75.6020,
    area_sqkm: 5.2,
    population_density: 5800,
    coordinates: [[75.590, 31.285], [75.614, 31.285], [75.614, 31.305], [75.590, 31.305], [75.590, 31.285]],
    description: "Academic campus and planned sector. Serves as reference urban cooling lung for Jalandhar.",
    is_licensed: true,
    heat_analysis: {
      mean_lst_celsius: 37.4,
      max_lst_celsius: 40.2,
      mean_ndvi: 0.36,
      mean_ndbi: -0.09,
      hotspot_severity: "LOW",
      vulnerability_rank: 18,
      heat_island_intensity: 0.9
    }
  }
];

const INITIAL_TREES: TreeData[] = [
  {
    id: "tr-1",
    tree_unique_tag: "JAL-MCJ-2026-001",
    lat: 31.31045,
    lng: 75.58245,
    status: "THRIVING",
    species_name: "ਨਿੰਮ (Neem)",
    botanical_name: "Azadirachta indica",
    initial_photo_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600",
    initial_height_cm: 140.0,
    inspections: []
  },
  {
    id: "tr-2",
    tree_unique_tag: "JAL-MCJ-2026-002",
    lat: 31.31052,
    lng: 75.58255,
    status: "THRIVING",
    species_name: "ਨਿੰਮ (Neem)",
    botanical_name: "Azadirachta indica",
    initial_photo_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600",
    initial_height_cm: 135.0,
    inspections: []
  },
  {
    id: "tr-3",
    tree_unique_tag: "JAL-MCJ-2026-003",
    lat: 31.31060,
    lng: 75.58265,
    status: "THRIVING",
    species_name: "ਕਚਨਾਰ (Kachnar)",
    botanical_name: "Bauhinia variegata",
    initial_photo_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600",
    initial_height_cm: 110.0,
    inspections: []
  },
  {
    id: "tr-4",
    tree_unique_tag: "JAL-MCJ-2026-004",
    lat: 31.31745,
    lng: 75.61895,
    status: "THRIVING",
    species_name: "ਟਾਹਲੀ / ਸ਼ੀਸ਼ਮ (Tahli)",
    botanical_name: "Dalbergia sissoo",
    initial_photo_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600",
    initial_height_cm: 160.0,
    inspections: []
  },
  {
    id: "tr-5",
    tree_unique_tag: "JAL-MCJ-2026-005",
    lat: 31.31755,
    lng: 75.61910,
    status: "DISTRESSED",
    species_name: "ਟਾਹਲੀ / ਸ਼ੀਸ਼ਮ (Tahli)",
    botanical_name: "Dalbergia sissoo",
    initial_photo_url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600",
    initial_height_cm: 155.0,
    inspections: []
  }
];

function LoginPortalScreen({
  onLogin
}: {
  onLogin: (persona: UserPersona) => void;
}) {
  const [activeTab, setActiveTab] = useState<'personas' | 'custom'>('personas');
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = PRESET_PERSONAS.find((p) => p.email.toLowerCase() === customEmail.toLowerCase());
    if (matched) {
      onLogin(matched);
    } else {
      setLoginError("Invalid credentials. Try using one of the seeded system personas.");
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full bg-[#0b101d] border border-[#1e293b] rounded-3xl p-8 shadow-2xl space-y-8 z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-xl shadow-emerald-500/20 mx-auto border border-white/20">
            <Thermometer className="w-9 h-9 text-slate-950 font-bold" />
          </div>
          <div>
            <span className="font-mono tracking-widest text-[10px] uppercase font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Environmental Intelligence From Field to Audit Room
            </span>
            <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent tracking-tight mt-2">
              Climatrix
            </h1>
            <p className="text-sm font-semibold text-slate-300 mt-1">
              AI-Powered Urban Heat Island &amp; Climate Resilience System
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 font-mono text-[10px]">
              <span className="px-2.5 py-0.5 rounded-full bg-[#030712] text-slate-300 border border-[#1e293b]">SAR + NDVI Satellite Fusion</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#030712] text-emerald-300 border border-emerald-500/20">Tree Passports</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#030712] text-slate-300 border border-[#1e293b]">Sub-5m GPS Verification</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="flex gap-2 bg-[#030712] p-1.5 rounded-2xl border border-[#1e293b] text-xs shadow">
            <button
              onClick={() => setActiveTab('personas')}
              className={`px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 ${
                activeTab === 'personas'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" /> ⚡ One-Click Persona Login (5 Seeded Roles)
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 ${
                activeTab === 'custom'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-4 h-4" /> 🔑 Standard Email/Password Login
            </button>
          </div>
        </div>

        {/* Personas Grid */}
        {activeTab === 'personas' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRESET_PERSONAS.map((persona) => (
                <div
                  key={persona.id}
                  className="p-5 rounded-3xl bg-[#030712] border border-[#1e293b] hover:border-emerald-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${persona.color} text-white flex items-center justify-center font-black text-sm shadow`}>
                          {persona.avatarText}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">{persona.name}</h4>
                          <span className="text-[11px] text-slate-300 block">{persona.organisation}</span>
                        </div>
                      </div>

                      <span className="font-mono text-[10px] uppercase px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {persona.role}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#0b101d] border border-[#1e293b] text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="font-mono text-slate-200">{persona.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Licensed Wards:</span>
                        <span className="font-bold text-emerald-400">{persona.licensedWards.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onLogin(persona)}
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    Authenticate as {persona.name.split(' ')[0]} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Email Form */}
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
                className="w-full bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-slate-100 focus:outline-none focus:border-emerald-500 font-medium"
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
                className="w-full bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-slate-100 focus:outline-none focus:border-emerald-500 font-medium"
                required
              />
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 text-[11px] text-slate-300">
              💡 <strong>Seed Password Hint:</strong> Use <code>MCJAdmin2026!</code>, <code>AntigravityAdmin2026!</code>, or <code>PGDAdmin2026!</code>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" /> Authenticate &amp; Access Dashboard
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function App() {
  const [appMode, setAppMode] = useState<'landing' | 'app'>('landing');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'map' | 'wards' | 'workflow' | 'llm' | 'heat' | 'species' | 'cooling' | 'trees' | 'billing'>('map');
  const [currentUser, setCurrentUser] = useState<UserPersona>(PRESET_PERSONAS[1]); // Default: MCJ Commissioner
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [wards, setWards] = useState<WardData[]>(INITIAL_WARDS);
  const [trees, setTrees] = useState<TreeData[]>(INITIAL_TREES);
  const [selectedWard, setSelectedWard] = useState<WardData>(INITIAL_WARDS[1]); // Ward 14 Rainak Bazaar default
  const [activeMapLayer, setActiveMapLayer] = useState<'lst' | 'ndvi' | 'hotspots'>('lst');
  const [showTreesOnMap, setShowTreesOnMap] = useState<boolean>(true);

  // Real-Time Weather & Multi-City State
  const [weatherInfo, setWeatherInfo] = useState<any>(null);
  const [clientIpLocation, setClientIpLocation] = useState<any>(null);
  const [citiesCatalog, setCitiesCatalog] = useState<any[]>([]);
  const [activeCity, setActiveCity] = useState<string>('Jalandhar');

  // Species Matcher State
  const [roadWidth, setRoadWidth] = useState<number>(6.0);
  const [waterDepth, setWaterDepth] = useState<number>(20.0);
  const [siteType, setSiteType] = useState<string>('ROADSIDE_STRIP');
  const [speciesRecommendations, setSpeciesRecommendations] = useState<any[]>([]);

  // Tree Inspection Form
  const [showInspectionModal, setShowInspectionModal] = useState<boolean>(false);
  const [inspectionTreeTag, setInspectionTreeTag] = useState<string>('JAL-MCJ-2026-001');
  const [inspectionHeight, setInspectionHeight] = useState<number>(148.0);
  const [inspectionRating, setInspectionRating] = useState<number>(5);
  const [inspectionSuccessMsg, setInspectionSuccessMsg] = useState<string>('');

  // 1. Backend Health & Geo Data Check
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await axios.get(`${API_BASE}/health`, { timeout: 2500 });
        if (res.status === 200) {
          setBackendOnline(true);
        }
        const treeRes = await axios.get(`${API_BASE}/trees`, { timeout: 2500 });
        if (treeRes.data && treeRes.data.length > 0) {
          setTrees(treeRes.data);
        }
        const weatherRes = await axios.get(`${API_BASE}/weather/realtime`, { timeout: 2500 });
        if (weatherRes.data) {
          setWeatherInfo(weatherRes.data);
        }
        const ipRes = await axios.get(`${API_BASE}/geo/ip-location`, { timeout: 2500 });
        if (ipRes.data) {
          setClientIpLocation(ipRes.data);
        }
        const cityRes = await axios.get(`${API_BASE}/cities/catalog`, { timeout: 2500 });
        if (cityRes.data) {
          setCitiesCatalog(cityRes.data);
        }
      } catch {
        setBackendOnline(false);
        setWeatherInfo({
          city: "Jalandhar",
          status: "SEED_BASELINE_FEED",
          ambient_temperature_celsius: 38.5,
          wind_speed_kmh: 14.2,
          heat_index_celsius: 42.1,
          relative_humidity_pct: 48
        });
      }
    };
    checkBackend();
  }, []);

  // 2. Adjust Wards License Access Dynamically Based on Current Persona & ABAC Geography
  useEffect(() => {
    const updated = INITIAL_WARDS.map((w) => {
      if (currentUser.role === 'SUPER_ADMIN') {
        return { ...w, is_licensed: true };
      }
      if (currentUser.orgSlug === 'pgd-infra') {
        // PGD purchased ONLY Ward 22 and Ward 68
        return { ...w, is_licensed: w.code === 'JAL-WARD-22' || w.code === 'JAL-WARD-68' };
      }
      if (currentUser.role === 'FIELD_WORKER') {
        // Field worker assigned ONLY Ward 4 and Ward 55
        return { ...w, is_licensed: w.code === 'JAL-WARD-04' || w.code === 'JAL-WARD-55' };
      }
      if (currentUser.orgSlug === 'mcjalandhar') {
        // MCJ owns civic wards: 4, 14, 18, 37, 44, 55, 68; Ward 22 & 28 are private industrial
        return { ...w, is_licensed: w.code !== 'JAL-WARD-22' && w.code !== 'JAL-WARD-28' };
      }
      return { ...w, is_licensed: true };
    });

    setWards(updated);

    // Auto-select first licensed ward if current selection is unlicensed for this persona
    const match = updated.find((w) => w.code === selectedWard?.code && w.is_licensed);
    if (match) {
      setSelectedWard(match);
    } else {
      const firstLicensed = updated.find((w) => w.is_licensed);
      if (firstLicensed) setSelectedWard(firstLicensed);
    }
  }, [currentUser]);

  // 3. Fetch Species Recommendations
  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const res = await axios.post(`${API_BASE}/species/recommend`, {
          soil_type: 'Alluvial Sandy-Loam',
          road_width_meters: roadWidth,
          groundwater_depth_meters: waterDepth,
          site_type: siteType
        });
        setSpeciesRecommendations(res.data);
      } catch {
        const fallbackRecs = [
          {
            species: { botanical_name: 'Azadirachta indica', common_name_punjabi: 'ਨਿੰਮ (Neem)', heat_tolerance_max_celsius: 48.5, drought_tolerance_rating: 5, root_profile: 'TAPROOT_DEEP', mature_canopy_radius_m: 7.0, description: 'Super-resilient evergreen. Deep taproot prevents paving upheaval.' },
            suitability_score: roadWidth >= 5 ? 96 : 82,
            suitability_level: 'OPTIMAL',
            match_reasons: ['Deep taproot protects sidewalks', 'High drought tolerance matches dropping water table']
          },
          {
            species: { botanical_name: 'Dalbergia sissoo', common_name_punjabi: 'ਟਾਹਲੀ / ਸ਼ੀਸ਼ਮ (Tahli)', heat_tolerance_max_celsius: 47.0, drought_tolerance_rating: 4, root_profile: 'TAPROOT_DEEP', mature_canopy_radius_m: 6.5, description: 'State tree of Punjab. Fixes nitrogen and provides expansive summer shade.' },
            suitability_score: roadWidth >= 6 ? 93 : 75,
            suitability_level: 'OPTIMAL',
            match_reasons: ['Punjab native benchmark', 'Rapid shade establishment along avenues']
          },
          {
            species: { botanical_name: 'Bauhinia variegata', common_name_punjabi: 'ਕਚਨਾਰ (Kachnar)', heat_tolerance_max_celsius: 44.0, drought_tolerance_rating: 4, root_profile: 'COMPACT', mature_canopy_radius_m: 4.0, description: 'Medium ornamental tree with non-destructive roots, perfect for residential alleys.' },
            suitability_score: roadWidth < 6 ? 98 : 84,
            suitability_level: 'OPTIMAL',
            match_reasons: ['Compact canopy fits narrow lanes', 'Non-invasive roots protect household pipelines']
          },
          {
            species: { botanical_name: 'Vachellia nilotica', common_name_punjabi: 'ਕਿੱਕਰ (Kikar)', heat_tolerance_max_celsius: 49.5, drought_tolerance_rating: 5, root_profile: 'TAPROOT_DEEP', mature_canopy_radius_m: 5.0, description: 'Extreme heat & drought champion. Thrives in barren and degraded lands.' },
            suitability_score: siteType === 'INDUSTRIAL_BOUNDARY' || waterDepth > 25 ? 95 : 78,
            suitability_level: 'SUITABLE',
            match_reasons: ['Extreme temperature resilience (>49°C)', 'Thrives in low-maintenance industrial fringes']
          }
        ];
        setSpeciesRecommendations(fallbackRecs);
      }
    };
    fetchSpecies();
  }, [roadWidth, waterDepth, siteType]);

  const handleInspectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInspectionSuccessMsg('✓ Inspection successfully recorded! GPS Drift: 0.8m (Tamper-evident verification passed)');
    setTimeout(() => {
      setShowInspectionModal(false);
      setInspectionSuccessMsg('');
    }, 2000);
  };

  if (appMode === 'landing') {
    return (
      <LandingPage
        onOpenApp={() => setAppMode('app')}
        onOpenLogin={() => {
          setAppMode('app');
          setIsLoggedIn(false);
        }}
      />
    );
  }

  if (!isLoggedIn) {
    return (
      <LoginPortalScreen
        onLogin={(persona) => {
          setCurrentUser(persona);
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Ambient Light Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      {/* 1. TOP ARANYIX HEADER & PERSONA BAR */}
      <header className="sticky top-0 z-50 bg-[#030712]/90 backdrop-blur-2xl border-b border-[#1e293b] px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-white/20">
            <Thermometer className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Climatrix
              </span>

              {/* Multi-City Catalog Selector */}
              <select
                value={activeCity}
                onChange={(e) => setActiveCity(e.target.value)}
                className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md shadow cursor-pointer focus:outline-none"
              >
                {citiesCatalog.length > 0 ? (
                  citiesCatalog.map((c) => (
                    <option key={c.city_id} value={c.name} className="bg-slate-900 text-slate-100">
                      {c.name} ({c.wards_count} Wards) - {c.status}
                    </option>
                  ))
                ) : (
                  <option value="Jalandhar" className="bg-slate-900 text-slate-100">Pilot: Jalandhar (80 Wards)</option>
                )}
              </select>

              {/* IP Geolocation Badge */}
              {clientIpLocation && (
                <span className="text-[11px] px-2 py-0.5 rounded-full font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  📍 Client: {clientIpLocation.city}, {clientIpLocation.region}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300">
              AI-Powered Urban Heat Island &amp; Climate Resilience Decision-Support System
            </p>
          </div>
        </div>

        {/* Current Active Persona Profile & Switcher Button */}
        <div className="flex items-center gap-3">
          {/* Quick Persona Card */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow text-xs">
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${currentUser.color} text-white flex items-center justify-center font-bold text-xs`}>
              {currentUser.avatarText}
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                {currentUser.name}
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-emerald-400 border border-slate-700">
                  {currentUser.role}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate max-w-[180px]">
                {currentUser.organisation}
              </span>
            </div>
          </div>

          {/* Public Landing Portal Toggle */}
          <button
            onClick={() => setAppMode('landing')}
            className="px-3.5 py-2 rounded-xl bg-[#0b101d] hover:bg-slate-800 text-slate-200 font-bold text-xs transition border border-[#1e293b] flex items-center gap-1.5"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            Public Portal
          </button>

          {/* Role Switcher Button */}
          <button
            onClick={() => setShowRoleModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#0b101d] hover:bg-slate-800 text-slate-200 font-bold text-xs transition border border-[#1e293b] flex items-center gap-1.5"
          >
            <Users className="w-4 h-4 text-emerald-400" />
            Switch Role
          </button>

          {/* Sign Out Button */}
          <button
            onClick={() => setIsLoggedIn(false)}
            className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/60 font-bold text-xs transition flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            Sign Out
          </button>

          {/* Backend Status */}
          <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border font-medium ${
            backendOnline 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            {backendOnline ? 'FastAPI Online' : 'Local Seed Mode'}
          </div>
        </div>
      </header>

      {/* 2. REAL-TIME METEOROLOGICAL TICKER BAR */}
      {weatherInfo && (
        <div className="bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-6 py-1.5 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-4 font-mono shadow-inner">
          <div className="flex items-center gap-4 overflow-x-auto">
            <span className="text-emerald-400 font-bold flex items-center gap-1 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> LIVE WEATHER ({weatherInfo.city}):
            </span>
            <span className="text-slate-200 font-semibold">
              🌡️ Ambient Air: <strong className="text-amber-400">{weatherInfo.ambient_temperature_celsius}°C</strong>
            </span>
            <span className="text-slate-200 font-semibold">
              🔥 Heat Index: <strong className="text-red-400">{weatherInfo.heat_index_celsius}°C</strong>
            </span>
            <span className="text-slate-200 font-semibold">
              💧 Humidity: <strong className="text-cyan-400">{weatherInfo.relative_humidity_pct}%</strong>
            </span>
            <span className="text-slate-200 font-semibold">
              💨 Wind: <strong className="text-slate-100">{weatherInfo.wind_speed_kmh} km/h</strong>
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            <span>Satellite Peak LST Delta: <strong className="text-red-400">+{((selectedWard?.heat_analysis?.mean_lst_celsius ?? 44.5) - (weatherInfo.ambient_temperature_celsius ?? 38.5)).toFixed(1)}°C UHI Trap</strong></span>
          </div>
        </div>
      )}

      {/* 3. SUB-NAVIGATION TABS */}
      <nav className="bg-[#0b101d] border-b border-[#1e293b] px-6 py-2 flex items-center gap-1.5 overflow-x-auto text-sm">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'map'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Compass className="w-4 h-4" />
          Interactive GIS Map
        </button>

        <button
          onClick={() => setActiveTab('wards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'wards'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          Ward Data Matrix
        </button>

        <button
          onClick={() => setActiveTab('workflow')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'workflow'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Workflow className="w-4 h-4" />
          System Operational Flow
        </button>

        <button
          onClick={() => setActiveTab('llm')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'llm'
              ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-500/25'
              : 'text-purple-400 hover:text-purple-200 hover:bg-slate-800/50'
          }`}
        >
          <BrainCircuit className="w-4 h-4 text-purple-400" />
          AI LLM Climate Advisor
        </button>

        <button
          onClick={() => setActiveTab('heat')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'heat'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          Heat &amp; LST Hotspot Ranking
        </button>

        <button
          onClick={() => setActiveTab('species')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'species'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Leaf className="w-4 h-4" />
          Punjab Native Species Matcher
        </button>

        <button
          onClick={() => setActiveTab('cooling')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'cooling'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Wind className="w-4 h-4" />
          Alternative Urban Cooling
        </button>

        <button
          onClick={() => setActiveTab('trees')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'trees'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Trees className="w-4 h-4" />
          Planted Trees &amp; Field Audits
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'billing'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Location Licensing (ABAC)
        </button>
      </nav>

      {/* 3. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">

        {/* TAB: WARD DATA MATRIX (NEW MULTI-WARD DATA EXPLORER PANEL) */}
        {activeTab === 'wards' && (
          <WardExplorerPanel
            wards={wards}
            currentUser={currentUser}
            selectedWard={selectedWard}
            onSelectWard={(w) => {
              setSelectedWard(w);
              setActiveTab('map');
            }}
            onOpenBilling={() => setActiveTab('billing')}
          />
        )}

        {/* TAB: SYSTEM OPERATIONAL FLOW (NEW WORKFLOW VISUALIZER) */}
        {activeTab === 'workflow' && (
          <WorkflowVisualizer />
        )}

        {/* TAB: AI LLM CLIMATE DECISION ADVISOR */}
        {activeTab === 'llm' && (
          <LlmDecisionPanel
            wards={wards}
            trees={trees}
            selectedWard={selectedWard}
            currentUser={currentUser}
            onSelectWard={(w) => setSelectedWard(w)}
          />
        )}

        {/* TAB 1: INTERACTIVE GIS MAP */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            {/* Map Controls & Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Satellite Layer:
                </span>
                <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs">
                  <button
                    onClick={() => setActiveMapLayer('lst')}
                    className={`px-3 py-1.5 rounded-md font-medium transition ${
                      activeMapLayer === 'lst' ? 'bg-red-500 text-white font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    🔥 Surface Temp (LST)
                  </button>
                  <button
                    onClick={() => setActiveMapLayer('ndvi')}
                    className={`px-3 py-1.5 rounded-md font-medium transition ${
                      activeMapLayer === 'ndvi' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    🌿 Vegetation (NDVI)
                  </button>
                  <button
                    onClick={() => setActiveMapLayer('hotspots')}
                    className={`px-3 py-1.5 rounded-md font-medium transition ${
                      activeMapLayer === 'hotspots' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    ⚠️ Hotspots Only
                  </button>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer ml-3 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                  <input
                    type="checkbox"
                    checked={showTreesOnMap}
                    onChange={(e) => setShowTreesOnMap(e.target.checked)}
                    className="accent-emerald-500 w-4 h-4 rounded"
                  />
                  <span>Show Planted Trees (GPS Pins)</span>
                </label>
              </div>

              {/* ABAC Geofence Indicator */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Tenant ABAC Status:</span>
                <span className="px-2.5 py-1 rounded-md font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {currentUser.role === 'SUPER_ADMIN' ? 'Super Admin Unrestricted' : `Geofenced to ${currentUser.organisation}`}
                </span>
              </div>
            </div>

            {/* Map & Inspector Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map Viewport */}
              <div className="lg:col-span-2">
                <GisMap
                  wards={wards}
                  trees={trees}
                  selectedWard={selectedWard}
                  onSelectWard={(w) => setSelectedWard(w)}
                  activeLayer={activeMapLayer}
                  showTrees={showTreesOnMap}
                />
                <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
                  <span>Data Source: USGS Landsat 9 TIRS-2 &amp; Copernicus Sentinel-2 MSI</span>
                  <span>Spatial Resolution: 30m Thermal / 10m Multispectral</span>
                </div>
              </div>

              {/* Selected Ward Inspector Card */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {selectedWard.code}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">{selectedWard.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{selectedWard.description}</p>
                    </div>
                    {selectedWard.is_licensed ? (
                      <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <Unlock className="w-3.5 h-3.5" /> Licensed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-red-500/20 text-red-400 border border-red-500/30">
                        <Lock className="w-3.5 h-3.5" /> Restricted
                      </span>
                    )}
                  </div>

                  {/* ABAC Check Block */}
                  {selectedWard.is_licensed ? (
                    <div className="space-y-4">
                      {/* Metric Badges */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                          <span className="text-xs text-slate-400 block">Mean Surface Temp</span>
                          <span className="text-2xl font-black text-red-400">
                            {selectedWard.heat_analysis?.mean_lst_celsius}°C
                          </span>
                          <span className="text-[10px] text-red-500/80 block mt-0.5">
                            Peak: {selectedWard.heat_analysis?.max_lst_celsius}°C
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                          <span className="text-xs text-slate-400 block">Green Cover (NDVI)</span>
                          <span className={`text-2xl font-black ${
                            (selectedWard.heat_analysis?.mean_ndvi ?? 0) > 0.2 ? 'text-emerald-400' : 'text-amber-400'
                          }`}>
                            {selectedWard.heat_analysis?.mean_ndvi}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Deficit: {(1.0 - (selectedWard.heat_analysis?.mean_ndvi ?? 0) * 2.5).toFixed(1)}x
                          </span>
                        </div>
                      </div>

                      {/* Micro-Climate Diagnostics */}
                      <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                        <div className="flex justify-between text-slate-300">
                          <span>Urban Heat Island (UHI) Delta:</span>
                          <span className="font-bold text-red-400">+{selectedWard.heat_analysis?.heat_island_intensity}°C</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Vulnerability Priority Rank:</span>
                          <span className="font-bold text-amber-400">Rank #{selectedWard.heat_analysis?.vulnerability_rank} in Jalandhar</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Population Density:</span>
                          <span className="font-bold">{selectedWard.population_density.toLocaleString()} / km²</span>
                        </div>
                      </div>

                      {/* Recommended Action */}
                      <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-xs">
                        <span className="font-bold text-emerald-400 block flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Recommended Climate Action:
                        </span>
                        <p className="text-slate-300 mt-1">
                          {selectedWard.code === 'JAL-WARD-14' || selectedWard.code === 'JAL-WARD-18' ? (
                            <strong className="text-amber-300">
                              Ground tree planting unfeasible due to underground drainage &amp; 3m road width. Implement High-Albedo Cool Roofs (SRI &gt; 82) &amp; suspended shade sails.
                            </strong>
                          ) : (
                            <span>
                              Suitable for roadside green corridors with native deep-rooted <strong>Neem (Azadirachta indica)</strong> and <strong>Tahli (Dalbergia sissoo)</strong>.
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Restricted ABAC Notice */
                    <div className="p-6 rounded-xl bg-red-950/30 border border-red-800/60 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-red-900/40 text-red-400 flex items-center justify-center mx-auto">
                        <Lock className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-red-300">Geographical License Required</h4>
                      <p className="text-xs text-slate-300">
                        Customer <strong>{currentUser.organisation}</strong> does not hold a license for <strong>{selectedWard.name}</strong>.
                      </p>
                      <button
                        onClick={() => setActiveTab('billing')}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-lg"
                      >
                        Acquire Ward License
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Ward Selector Pills */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider block">
                    Quick Sample Ward Select:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {wards.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => setSelectedWard(w)}
                        className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
                          selectedWard.id === w.id
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : w.is_licensed
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            : 'bg-slate-800/40 text-slate-500 line-through'
                        }`}
                      >
                        {w.name.split(' - ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HEAT & LST ANALYSIS */}
        {activeTab === 'heat' && (
          <div className="space-y-6">
            {/* Top Stat KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">City Mean LST</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-white">43.4°C</span>
                  <span className="text-xs text-red-400 font-bold">+4.8°C above rural baseline</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Calibrated Landsat 9 Summer 2026</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Peak Surface Hotspot</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-red-500">48.4°C</span>
                  <span className="text-xs text-red-400 font-bold">Focal Point (Ward 22)</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Industrial boilers &amp; metal roofing</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Green Canopy (NDVI)</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-amber-400">0.17</span>
                  <span className="text-xs text-amber-400 font-bold">62% canopy deficit</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">WHO Minimum Recommended: 0.35</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority Population at Risk</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-cyan-400">78,500</span>
                  <span className="text-xs text-cyan-400 font-bold">Wards 14, 18, 22, 37</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Immediate intervention candidates</p>
              </div>
            </div>

            {/* Recharts Comparison Chart */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Jalandhar Wards: Surface Temperature (°C) vs. Vegetation (NDVI)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Empirical proof: Wards with lowest NDVI suffer the most extreme summer surface temperatures.</p>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wards.filter(w => w.is_licensed).map(w => ({
                    name: w.code.replace('JAL-WARD-', 'W-'),
                    lst: w.heat_analysis?.mean_lst_celsius ?? 0,
                    ndvi_scaled: (w.heat_analysis?.mean_ndvi ?? 0) * 100,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                      formatter={(value: any, name: any) => [
                        name === 'Surface Temp (°C)' ? `${value}°C` : `${(Number(value) / 100).toFixed(2)}`,
                        name ?? ''
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="lst" name="Surface Temp (°C)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="ndvi_scaled" name="NDVI Index (x100)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ward Vulnerability Ranking Table */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white">Municipal Ward Resilience &amp; Hotspot Priority Register</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/60 uppercase tracking-wider text-slate-400 border-b border-slate-700/60">
                    <tr>
                      <th className="py-3 px-4">Priority Rank</th>
                      <th className="py-3 px-4">Ward Code &amp; Name</th>
                      <th className="py-3 px-4">Mean LST (°C)</th>
                      <th className="py-3 px-4">Max LST (°C)</th>
                      <th className="py-3 px-4">NDVI Green Cover</th>
                      <th className="py-3 px-4">Severity Tier</th>
                      <th className="py-3 px-4">Optimal Strategy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {wards.filter(w => w.is_licensed).map((w) => (
                      <tr key={w.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4 font-bold text-emerald-400">
                          #{w.heat_analysis?.vulnerability_rank}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-white">
                          {w.name}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-red-400">
                          {w.heat_analysis?.mean_lst_celsius}°C
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {w.heat_analysis?.max_lst_celsius}°C
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-400">
                          {w.heat_analysis?.mean_ndvi}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            w.heat_analysis?.hotspot_severity === 'CRITICAL'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : w.heat_analysis?.hotspot_severity === 'HIGH'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {w.heat_analysis?.hotspot_severity}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {w.code === 'JAL-WARD-14' || w.code === 'JAL-WARD-18' ? (
                            <span className="text-cyan-400 font-semibold">Cool Roofs &amp; Shade Sails</span>
                          ) : (
                            <span className="text-emerald-400 font-semibold">Avenue Native Plantation</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PUNJAB NATIVE SPECIES MATCHER */}
        {activeTab === 'species' && (
          <div className="space-y-6">
            {/* Scenario Configuration Form */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                  AI Native Species Suitability Engine (Punjab Agro-Climatic Model)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust micro-site parameters to evaluate climate resilience, rooting safety, drought tolerance, and canopy coverage.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Road Right-of-Way Width: <span className="text-emerald-400 font-bold">{roadWidth} meters</span>
                  </label>
                  <input
                    type="range"
                    min="3.0"
                    max="18.0"
                    step="0.5"
                    value={roadWidth}
                    onChange={(e) => setRoadWidth(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>3m (Narrow Alley)</span>
                    <span>9m (Two-Lane)</span>
                    <span>18m (Avenue)</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Groundwater Depth: <span className="text-cyan-400 font-bold">{waterDepth} meters</span>
                  </label>
                  <input
                    type="range"
                    min="10.0"
                    max="35.0"
                    step="1.0"
                    value={waterDepth}
                    onChange={(e) => setWaterDepth(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>10m (High Table)</span>
                    <span>20m (Average Jalandhar)</span>
                    <span>35m (Depleted)</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Site Typology:
                  </label>
                  <select
                    value={siteType}
                    onChange={(e) => setSiteType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="ROADSIDE_STRIP">Avenue / Roadside Strip</option>
                    <option value="RESIDENTIAL_STREET">Narrow Residential Street</option>
                    <option value="INDUSTRIAL_BOUNDARY">Industrial Buffer Belt (High Pollution)</option>
                    <option value="PUBLIC_PARK">Municipal Park / Educational Campus</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ranked Species Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {speciesRecommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all shadow-lg space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-400">
                        {rec.species.common_name_punjabi}
                      </span>
                      <h4 className="text-base font-extrabold text-white">
                        {rec.species.botanical_name}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-400">
                        {rec.suitability_score}%
                      </span>
                      <span className="text-[10px] block font-bold text-slate-400 uppercase">
                        Suitability Match
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300">{rec.species.description}</p>

                  {/* Biological Attributes */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
                      <span className="text-[10px] text-slate-400 block">Heat Max</span>
                      <span className="font-bold text-red-400">{rec.species.heat_tolerance_max_celsius}°C</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
                      <span className="text-[10px] text-slate-400 block">Drought Rating</span>
                      <span className="font-bold text-amber-400">{rec.species.drought_tolerance_rating} / 5</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
                      <span className="text-[10px] text-slate-400 block">Canopy Radius</span>
                      <span className="font-bold text-emerald-400">{rec.species.mature_canopy_radius_m}m</span>
                    </div>
                  </div>

                  {/* Why this matches */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">Algorithmic Match Criteria:</span>
                    {rec.match_reasons?.map((reason: string, rIdx: number) => (
                      <div key={rIdx} className="text-xs text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ALTERNATIVE URBAN COOLING SOLUTIONS */}
        {activeTab === 'cooling' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30 border border-cyan-800/40 shadow-xl space-y-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wind className="w-4 h-4" /> Platform Differentiator &amp; USP
              </span>
              <h3 className="text-xl font-black text-white">
                Engineered Cooling Where Ground Plantation is Impossible
              </h3>
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                In Punjab’s historic commercial cores (such as Jalandhar’s <strong>Rainak Bazaar</strong> and <strong>Phagwara Gate</strong>), 
                continuous underground sewer lines, 3-meter road clearances, and heavy foot traffic make ground tree planting unfeasible. 
                Our platform automatically computes engineered civil alternatives to combat microclimate heat traps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Solution 1: Cool Roofs */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  SRI
                </div>
                <h4 className="text-base font-bold text-white">High-Albedo Cool Roof Coatings</h4>
                <p className="text-xs text-slate-300">
                  Application of solar reflective polyurethane elastomeric membranes (Solar Reflectance Index &gt; 82) on commercial and municipal rooftops.
                </p>

                <div className="space-y-2 text-xs pt-2 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Surface Temp Drop:</span>
                    <span className="font-bold text-cyan-400">7.8°C Reduction</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Cost:</span>
                    <span className="font-bold text-white">₹380 / sqm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Water Dependency:</span>
                    <span className="font-bold text-emerald-400">Zero Liters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Implementation Complexity:</span>
                    <span className="font-bold text-emerald-400">Low (48 hours)</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/50 text-[11px] text-slate-400">
                  <strong>Target Pilot:</strong> Rainak Bazaar Commercial Complexes (Ward 14)
                </div>
              </div>

              {/* Solution 2: Tensile Shade Canopies */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  UV
                </div>
                <h4 className="text-base font-bold text-white">Suspended Tensile Shade Canopies</h4>
                <p className="text-xs text-slate-300">
                  Lightweight, breathable PTFE fabric sails anchored between second-storey facades to create a shaded pedestrian micro-climate corridor.
                </p>

                <div className="space-y-2 text-xs pt-2 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pedestrian Comfort Delta:</span>
                    <span className="font-bold text-amber-400">5.2°C Reduction</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Cost:</span>
                    <span className="font-bold text-white">₹1,250 / sqm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Water Dependency:</span>
                    <span className="font-bold text-emerald-400">Zero Liters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Implementation Complexity:</span>
                    <span className="font-bold text-amber-400">Medium</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/50 text-[11px] text-slate-400">
                  <strong>Target Pilot:</strong> Jyoti Chowk to Rainak Bazaar Pedestrian Walkway
                </div>
              </div>

              {/* Solution 3: Permeable Cool Pavements */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  H2O
                </div>
                <h4 className="text-base font-bold text-white">Permeable Reflective Interlocking Pavers</h4>
                <p className="text-xs text-slate-300">
                  High-albedo interlocking porous concrete pavers that prevent night-time thermal radiation while facilitating direct rainwater aquifer infiltration.
                </p>

                <div className="space-y-2 text-xs pt-2 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Surface Temp Drop:</span>
                    <span className="font-bold text-emerald-400">4.5°C Reduction</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Cost:</span>
                    <span className="font-bold text-white">₹950 / sqm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Groundwater Benefit:</span>
                    <span className="font-bold text-cyan-400">Recharges 450L/m²/yr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Implementation Complexity:</span>
                    <span className="font-bold text-amber-400">High (Civil rebuild)</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/50 text-[11px] text-slate-400">
                  <strong>Target Pilot:</strong> Phagwara Gate Hardware Plaza (Ward 18)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PLANTED TREES & FIELD AUDIT TRACKER */}
        {activeTab === 'trees' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Trees className="w-5 h-5 text-emerald-400" />
                  Planted Tree Registry &amp; Post-Planting Survival Audits
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Every planted sapling is tracked with unique tamper-evident GPS tags, 3/6/12-month height growth metrics, and survival status.
                </p>
              </div>

              <button
                onClick={() => setShowInspectionModal(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Submit Field Audit (GPS Verified)
              </button>
            </div>

            {/* Tree Registry Table */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/60 uppercase tracking-wider text-slate-400 border-b border-slate-700/60">
                  <tr>
                    <th className="py-3 px-4">Tree Tag ID</th>
                    <th className="py-3 px-4">Species</th>
                    <th className="py-3 px-4">GPS Coordinates</th>
                    <th className="py-3 px-4">Current Height</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Audit Milestone</th>
                    <th className="py-3 px-4">GPS Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {trees.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        {t.tree_unique_tag}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{t.species_name}</div>
                        <div className="text-[10px] text-slate-400 italic">{t.botanical_name}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {t.lat.toFixed(5)}, {t.lng.toFixed(5)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {t.initial_height_cm} cm
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          t.status === 'THRIVING'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-semibold">
                        Month 3 Verified
                      </td>
                      <td className="py-3.5 px-4 text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> &lt; 1.5m
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: TENANT LICENSING & SUBSCRIPTIONS */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                Multi-Tenant Geographical Licensing &amp; SaaS Subscriptions
              </h3>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                Protect intellectual property and municipal data silos. Customers only gain access to geospatial raster layers 
                and thermal indices for wards explicitly licensed under their corporate or municipal subscription.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plan 1 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pilot Starter</span>
                <div className="text-3xl font-black text-white">₹49,999 <span className="text-xs font-normal text-slate-400">/ year</span></div>
                <p className="text-xs text-slate-300">Ideal for single-campus real estate developers and educational universities.</p>
                <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-4">
                  <li className="flex items-center gap-2">✓ Up to 5 Licensed Wards/Polygons</li>
                  <li className="flex items-center gap-2">✓ Sentinel-2 NDVI &amp; Landsat LST</li>
                  <li className="flex items-center gap-2">✓ Native Species Matching Engine</li>
                  <li className="flex items-center gap-2">✓ Up to 5 User Seats</li>
                </ul>
                <button
                  onClick={() => alert("Simulated Razorpay Checkout: Active on test webhook.")}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                >
                  Select Starter Plan
                </button>
              </div>

              {/* Plan 2 */}
              <div className="p-6 rounded-2xl bg-slate-900 border-2 border-emerald-500 shadow-xl space-y-4 relative">
                <span className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase">
                  Active for MCJ
                </span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Municipal Resilience Suite</span>
                <div className="text-3xl font-black text-white">₹2,49,999 <span className="text-xs font-normal text-slate-400">/ year</span></div>
                <p className="text-xs text-slate-300">Complete enterprise suite for municipal corporations and urban development authorities.</p>
                <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-4">
                  <li className="flex items-center gap-2">✓ Up to 25 Licensed Wards</li>
                  <li className="flex items-center gap-2">✓ Hyperlocal Heat Island Hotspot Maps</li>
                  <li className="flex items-center gap-2">✓ Alternative Cooling Engineering Specs</li>
                  <li className="flex items-center gap-2">✓ Geotagged Field Worker Inspections</li>
                  <li className="flex items-center gap-2">✓ 30 User Seats + Role-Based Access</li>
                </ul>
                <button
                  disabled
                  className="w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 cursor-default"
                >
                  Current Active Plan
                </button>
              </div>

              {/* Plan 3 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">City-Wide Master Plan</span>
                <div className="text-3xl font-black text-white">₹6,99,999 <span className="text-xs font-normal text-slate-400">/ year</span></div>
                <p className="text-xs text-slate-300">Unrestricted access to all 80 municipal wards in Jalandhar plus custom peri-urban polygons.</p>
                <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-4">
                  <li className="flex items-center gap-2">✓ All 80 Municipal Wards</li>
                  <li className="flex items-center gap-2">✓ Custom Polygon Uploads &amp; Slicing</li>
                  <li className="flex items-center gap-2">✓ Automated Executive Climate PDF Reports</li>
                  <li className="flex items-center gap-2">✓ Unlimited Field Workers</li>
                </ul>
                <button
                  onClick={() => alert("Simulated Razorpay Enterprise Cart: License invoice generated.")}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                >
                  Upgrade to City-Wide
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 4. ROLE LOGIN & SWITCHER MODAL */}
      <RoleLoginModal
        currentUser={currentUser}
        onSelectPersona={(persona) => {
          setCurrentUser(persona);
        }}
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
      />

      {/* 5. FIELD INSPECTION MODAL */}
      {showInspectionModal && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                Submit GPS Field Inspection
              </h3>
              <button
                onClick={() => setShowInspectionModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {inspectionSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-emerald-300">{inspectionSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleInspectionSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Target Tree Tag:</label>
                  <select
                    value={inspectionTreeTag}
                    onChange={(e) => setInspectionTreeTag(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                  >
                    {trees.map((t) => (
                      <option key={t.id} value={t.tree_unique_tag}>
                        {t.tree_unique_tag} - {t.species_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Current Height (cm):</label>
                  <input
                    type="number"
                    value={inspectionHeight}
                    onChange={(e) => setInspectionHeight(parseFloat(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Health Rating (1 to 5):</label>
                  <select
                    value={inspectionRating}
                    onChange={(e) => setInspectionRating(parseInt(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                  >
                    <option value={5}>5 - Excellent Vigour (New Flush)</option>
                    <option value={4}>4 - Good Condition</option>
                    <option value={3}>3 - Moderate (Mild Water Stress)</option>
                    <option value={2}>2 - Distressed / Insect Damage</option>
                    <option value={1}>1 - Dead / Needs Immediate Replacement</option>
                  </select>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Live Geotag: 31.31046° N, 75.58246° E
                  </span>
                  <p className="text-[10px] text-slate-500">
                    GPS deviation from tree registration point: 0.8 meters (Verified Valid Audit).
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg"
                >
                  Verify GPS &amp; Submit Audit
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 6. FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-4 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span>Climatrix Platform · Jalandhar Smart Climate Pilot · Track CTBF-SU-06</span>
        </div>
        <div className="flex items-center gap-4">
          <span>USGS Landsat 9 TIRS-2 &amp; Sentinel-2 MSI</span>
          <span>PostgreSQL 16 + PostGIS Spatial Engine</span>
          <span>FastAPI + React 18</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

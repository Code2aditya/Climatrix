import React from 'react';
import {
  Thermometer,
  Trees,
  ShieldAlert,
  Layers,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Building,
  GraduationCap,
  Globe,
  ShieldCheck,
  ChevronRight,
  Satellite
} from 'lucide-react';

interface LandingPageProps {
  onOpenApp: () => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenApp, onOpenLogin }) => {
  React.useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-[#030712]/90 backdrop-blur-xl border-b border-[#1e293b] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-white/20">
              <Thermometer className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Climatrix
              </span>
              <span className="text-[10px] font-mono block text-emerald-400/80 -mt-1 font-bold">
                ENVIRONMENTAL INTELLIGENCE
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <button onClick={() => scrollToSection('platform')} className="hover:text-emerald-400 transition cursor-pointer">Platform</button>
            <button onClick={() => scrollToSection('solutions')} className="hover:text-emerald-400 transition cursor-pointer">Solutions</button>
            <button onClick={() => scrollToSection('intelligence')} className="hover:text-emerald-400 transition cursor-pointer">Climate Intelligence</button>
            <button onClick={() => scrollToSection('cooling')} className="hover:text-emerald-400 transition cursor-pointer">Urban Cooling</button>
            <button onClick={() => scrollToSection('passports')} className="hover:text-emerald-400 transition cursor-pointer">Tree Passports</button>
            <button onClick={() => scrollToSection('security')} className="hover:text-emerald-400 transition cursor-pointer">Security &amp; ABAC</button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-xl bg-[#0b101d] hover:bg-slate-800 text-slate-200 border border-[#1e293b] text-xs font-bold transition"
            >
              Sign In
            </button>
            <button
              onClick={onOpenApp}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              Explore Platform <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden border-b border-[#1e293b]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0b101d] border border-[#1e293b] text-xs font-mono font-bold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Environmental Intelligence From Field to Audit Room</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Intelligence for Cooler, Greener and <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Climate-Resilient Cities</span>.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Transform satellite thermal data and environmental intelligence into actionable urban cooling strategies, climate-adaptive plantation plans and measurable environmental impact.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onOpenApp}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 text-sm font-black transition shadow-xl shadow-emerald-500/25 flex items-center gap-2 hover:scale-105"
            >
              Launch Climatrix Workspace <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => alert("Climatrix Enterprise Demo: Scheduled with Jalandhar Smart City team.")}
              className="px-8 py-4 rounded-2xl bg-[#0b101d] hover:bg-slate-800 text-white text-sm font-bold border border-[#1e293b] transition"
            >
              Book Executive Demo
            </button>
          </div>

          {/* Program Framework Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 font-mono text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 15+ Framework Mappings (BRSR, TNFD)</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> SAR + NDVI Satellite Fusion</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Sub-5m GPS Tree Passports</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Multi-Tenant ABAC Geography</span>
          </div>
        </div>
      </section>

      {/* 3. PLATFORM OVERVIEW */}
      <section id="platform" className="py-20 px-6 border-b border-[#1e293b]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="font-mono tracking-widest text-[10px] font-bold text-emerald-400 uppercase">Platform Overview</span>
            <h2 className="text-3xl font-black text-white">One Platform for Complete Urban Climate Resilience</h2>
            <p className="text-xs text-slate-300">From satellite thermal mapping to field worker GPS verification and executive disclosures.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#0b101d] border border-[#1e293b] hover:border-emerald-500/40 transition-all space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <Satellite className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Satellite Remote Sensing Fusion</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Combines USGS Landsat 9 TIRS-2 (30m thermal LST) and Sentinel-2 MSI (10m multispectral NDVI/NDBI) rasters to isolate microclimate thermal traps.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0b101d] border border-[#1e293b] hover:border-emerald-500/40 transition-all space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">LLM Cognitive Decision Engine</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fine-tuned AI reasoning models evaluate micro-site constraints (road width, groundwater depth) to output optimal species or cool roof SRI specs.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0b101d] border border-[#1e293b] hover:border-emerald-500/40 transition-all space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Multi-Tenant ABAC Geographical Licensing</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Attribute-Based Access Control isolates customer data so municipal entities and private developers access strictly licensed ward polygons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHOOSE YOUR SOLUTION */}
      <section id="solutions" className="py-20 px-6 border-b border-[#1e293b] bg-[#0b101d]/50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="font-mono tracking-widest text-[10px] font-bold text-emerald-400 uppercase">Tailored Pathways</span>
            <h2 className="text-3xl font-black text-white">Built for Every Urban Stakeholder</h2>
            <p className="text-xs text-slate-300">Targeted climate intelligence for government, corporate ESG, universities, and environmental programs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-[#0b101d] border border-[#1e293b] space-y-3">
              <Building className="w-8 h-8 text-emerald-400" />
              <h4 className="text-base font-bold text-white">Government &amp; Municipalities</h4>
              <p className="text-xs text-slate-300 leading-relaxed">Ward-wise heat intelligence, green-cover deficit mapping, and cool roof authorization.</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0b101d] border border-[#1e293b] space-y-3">
              <Globe className="w-8 h-8 text-cyan-400" />
              <h4 className="text-base font-bold text-white">Corporate ESG &amp; Industrial</h4>
              <p className="text-xs text-slate-300 leading-relaxed">Industrial boundary buffer tree belts, factory cool roof specs, and verified ESG disclosures.</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0b101d] border border-[#1e293b] space-y-3">
              <GraduationCap className="w-8 h-8 text-purple-400" />
              <h4 className="text-base font-bold text-white">Educational Institutions</h4>
              <p className="text-xs text-slate-300 leading-relaxed">Campus microclimate analysis, pedestrian shade corridors, and reference cooling lungs.</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0b101d] border border-[#1e293b] space-y-3">
              <Trees className="w-8 h-8 text-amber-400" />
              <h4 className="text-base font-bold text-white">NGOs &amp; Forestry Programs</h4>
              <p className="text-xs text-slate-300 leading-relaxed">Plantation site prioritization, native species matching, and sub-15m field survival tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CLIMATE INTELLIGENCE */}
      <section id="intelligence" className="py-20 px-6 border-b border-[#1e293b]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="font-mono tracking-widest text-[10px] font-bold text-emerald-400 uppercase">Climate Intelligence Layer</span>
            <h2 className="text-3xl font-black text-white leading-tight">
              Detect Hyperlocal Urban Heat Traps at 30m Thermal Resolution
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Climatrix applies split-window radiative transfer equations to derive Land Surface Temperature (LST °C) from Landsat 9 TIRS-2 Band 10, combined with Sentinel-2 NDVI canopy density.
            </p>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-[#0b101d] border border-[#1e293b] flex items-center justify-between">
                <span>Peak Surface Temp (Ward 22 Industrial):</span>
                <strong className="text-red-400 font-bold">48.4°C</strong>
              </div>
              <div className="p-3 rounded-2xl bg-[#0b101d] border border-[#1e293b] flex items-center justify-between">
                <span>Vegetation Canopy Deficit:</span>
                <strong className="text-amber-400 font-bold">62% Below WHO Minimum</strong>
              </div>
              <div className="p-3 rounded-2xl bg-[#0b101d] border border-[#1e293b] flex items-center justify-between">
                <span>Priority Vulnerability Priority:</span>
                <strong className="text-emerald-400 font-bold">Rank #1 Rainak Bazaar (Ward 14)</strong>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0b101d] border border-[#1e293b] space-y-4 shadow-2xl">
            <div className="flex items-center justify-between text-xs border-b border-[#1e293b] pb-3">
              <span className="font-bold text-white flex items-center gap-2"><Layers className="w-4 h-4 text-emerald-400" /> Jalandhar Ward Microclimate Matrix</span>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">LIVE RASTER FEED</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-center font-mono">
              <div className="p-3 rounded-2xl bg-[#030712] border border-[#1e293b]">
                <span className="text-[10px] text-slate-400 block">Rainak Bazaar LST</span>
                <span className="text-xl font-black text-red-400">47.8°C</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#030712] border border-[#1e293b]">
                <span className="text-[10px] text-slate-400 block">Rainak Bazaar NDVI</span>
                <span className="text-xl font-black text-amber-400">0.07</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#030712] border border-[#1e293b]">
                <span className="text-[10px] text-slate-400 block">Model Town LST</span>
                <span className="text-xl font-black text-emerald-400">38.2°C</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#030712] border border-[#1e293b]">
                <span className="text-[10px] text-slate-400 block">Model Town NDVI</span>
                <span className="text-xl font-black text-emerald-400">0.32</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. URBAN COOLING SOLUTIONS */}
      <section id="cooling" className="py-20 px-6 border-b border-[#1e293b] bg-[#0b101d]/50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="font-mono tracking-widest text-[10px] font-bold text-emerald-400 uppercase">Hybrid Intervention Engine</span>
            <h2 className="text-3xl font-black text-white">Urban Cooling Where Plantation is Impossible</h2>
            <p className="text-xs text-slate-300">
              "Plant where possible. Cool where planting is not possible. Protect what is planted."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#0b101d] border border-[#1e293b] space-y-4">
              <span className="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">HIGH ALBEDO</span>
              <h3 className="text-lg font-bold text-white">Cool Roof Elastomeric Coatings</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Solar reflective polyurethane membranes (SRI &gt; 82) applied on commercial terraces in Ward 14 Rainak Bazaar. Yields an immediate surface temperature drop of -7.5°C with zero water demand.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0b101d] border border-[#1e293b] space-y-4">
              <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">PEDESTRIAN SHADE</span>
              <h3 className="text-lg font-bold text-white">Suspended Tensile UV Shade Sails</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Lightweight PTFE fabric sails anchored between second-storey facades in narrow commercial bazaars, creating shaded walking corridors for high foot traffic areas.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0b101d] border border-[#1e293b] space-y-4">
              <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">AQUIFER RECHARGE</span>
              <h3 className="text-lg font-bold text-white">Permeable Reflective Pavers</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                High-albedo interlocking porous concrete pavers that eliminate night-time thermal radiation while recharging 450L/m²/year into depleted groundwater aquifers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TREE PASSPORTS */}
      <section id="passports" className="py-20 px-6 border-b border-[#1e293b]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="p-6 rounded-3xl bg-[#0b101d] border border-[#1e293b] space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-2"><Trees className="w-4 h-4 text-emerald-400" /> Digital Tree Passport: JAL-MCJ-2026-001</span>
              <span className="font-mono text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">THRIVING</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300"><span>Species:</span><strong className="text-white">Azadirachta indica (Neem / ਨਿੰਮ)</strong></div>
              <div className="flex justify-between text-slate-300"><span>Registration Geotag:</span><strong className="text-emerald-400">31.31045° N, 75.58245° E</strong></div>
              <div className="flex justify-between text-slate-300"><span>Field Audit GPS Drift:</span><strong className="text-emerald-400">0.8 meters (Verified Valid)</strong></div>
              <div className="flex justify-between text-slate-300"><span>Current Sapling Height:</span><strong className="text-white">148 cm (+28cm growth)</strong></div>
              <div className="flex justify-between text-slate-300"><span>Audit Milestone:</span><strong className="text-purple-400">Month 3 Verified Audit</strong></div>
            </div>
          </div>

          <div className="space-y-6">
            <span className="font-mono tracking-widest text-[10px] font-bold text-emerald-400 uppercase">Tree Passports &amp; Field Ops</span>
            <h2 className="text-3xl font-black text-white leading-tight">
              Sub-15m GPS Field Inspection Audits &amp; Survival Registries
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every planted sapling receives a unique digital passport. Horticulture field officers log geotagged camera inspections at 3M, 6M, and 12M milestones. Haversine distance calculations ensure audit authenticity before updating survival records.
            </p>

            <button
              onClick={onOpenApp}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs transition shadow-lg flex items-center gap-2"
            >
              Open Tree Passport Registry <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 8. SECURITY & ABAC */}
      <section id="security" className="py-20 px-6 border-b border-[#1e293b] bg-[#0b101d]/50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="font-mono tracking-widest text-[10px] font-bold text-purple-400 uppercase">Multi-Tenant Isolation</span>
            <h2 className="text-3xl font-black text-white">Geographical Data Access Control (ABAC)</h2>
            <p className="text-xs text-slate-300">Customers access only the specific municipal wards or project polygons they have licensed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
            <div className="p-6 rounded-3xl bg-[#0b101d] border border-[#1e293b] space-y-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Municipal Corporation Jalandhar</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">Licensed Wards: 4, 14, 18, 37, 55, 68. Full access to civic heat vulnerability ranks and cool roof specs.</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0b101d] border border-[#1e293b] space-y-3">
              <Lock className="w-8 h-8 text-amber-400" />
              <h4 className="text-sm font-bold text-white">Punjab Green Developers Ltd</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">Licensed Wards: 22 (Industrial) &amp; 68 (Campus) ONLY. Civic wards (4, 14, 18, 37) are strictly isolated.</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0b101d] border border-[#1e293b] space-y-3">
              <ShieldAlert className="w-8 h-8 text-purple-400" />
              <h4 className="text-sm font-bold text-white">Server-Side ABAC Enforcement</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">Unauthorized cross-ward API requests return HTTP 403 Access Denied and log breach entries into PostgreSQL AuditLogs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA & FOOTER */}
      <section className="py-20 px-6 text-center space-y-8 bg-gradient-to-b from-[#030712] via-[#0b101d] to-[#030712]">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl font-black text-white">Ready to Build Cooler, Climate-Resilient Cities?</h2>
          <p className="text-xs text-slate-300">Experience Climatrix with live Jalandhar remote sensing data and LLM cognitive decision engines.</p>
          <button
            onClick={onOpenApp}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 font-black text-sm transition shadow-xl shadow-emerald-500/25 inline-flex items-center gap-2 hover:scale-105"
          >
            Launch Climatrix Command Center <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <footer className="border-t border-[#1e293b] bg-[#030712] px-6 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-300">Climatrix Platform</span> · Jalandhar Smart Climate Pilot · Track CTBF-SU-06
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>USGS Landsat 9 &amp; Sentinel-2</span>
            <span>PostgreSQL 16 + PostGIS</span>
            <span>FastAPI + React 18</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

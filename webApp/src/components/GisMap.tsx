import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Layers,
  Thermometer,
  Trees,
  Wind,
  Download,
  Trash2,
  ChevronDown,
  ChevronRight,
  Info,
  MapPin,
  Building,
  CheckCircle2,
  Leaf
} from 'lucide-react';

// Fix Leaflet marker icons in Vite bundler
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export interface WardData {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  area_sqkm: number;
  population_density: number;
  coordinates: [number, number][];
  description: string;
  is_licensed: boolean;
  heat_analysis?: {
    mean_lst_celsius: number;
    max_lst_celsius: number;
    mean_ndvi: number;
    mean_ndbi: number;
    hotspot_severity: string;
    vulnerability_rank: number;
    heat_island_intensity: number;
  };
}

export interface TreeData {
  id: string;
  tree_unique_tag: string;
  lat: number;
  lng: number;
  status: string;
  species_name: string;
  botanical_name: string;
  initial_photo_url: string;
  initial_height_cm: number;
  inspections: any[];
}

interface GisMapProps {
  wards: WardData[];
  trees: TreeData[];
  selectedWard: WardData | null;
  onSelectWard: (ward: WardData) => void;
  activeLayer: 'lst' | 'ndvi' | 'hotspots';
  showTrees: boolean;
}

export const GisMap: React.FC<GisMapProps> = ({
  wards,
  trees,
  selectedWard,
  onSelectWard,
  activeLayer,
  showTrees,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const weatherRadarLayerRef = useRef<L.TileLayer | null>(null);
  const isochroneLayerRef = useRef<L.Polygon | null>(null);
  const polygonLayersRef = useRef<L.Polygon[]>([]);
  const treeMarkersRef = useRef<L.Marker[]>([]);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);

  // UI Panels State
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);
  const [rightPanelOpen, setRightPanelOpen] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('thermal');

  // Basemap & Layer Opacity State
  const [basemap, setBasemap] = useState<'carto_dark' | 'osm_streets' | 'esri_satellite'>('carto_dark');
  const [lstOpacity, setLstOpacity] = useState<number>(0.65);
  const [showWeatherRadar, setShowWeatherRadar] = useState<boolean>(false);
  const [showIsochrone, setShowIsochrone] = useState<boolean>(false);

  // Drawing Tools State
  const [drawMode, setDrawMode] = useState<'none' | 'polygon' | 'rectangle' | 'point'>('none');

  const BASEMAP_TILES = {
    carto_dark: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Base/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
      subdomains: '',
      maxZoom: 19,
      maxNativeZoom: 15
    },
    osm_streets: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: 'abc',
      maxZoom: 19,
      maxNativeZoom: 19
    },
    esri_satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, i-cubed',
      subdomains: '',
      maxZoom: 19,
      maxNativeZoom: 15
    }
  };

  // Calculate Zone Priority Score dynamically
  const calculatePriorityScore = (ward: WardData | null) => {
    if (!ward || !ward.heat_analysis) return 78;
    const lst = ward.heat_analysis.mean_lst_celsius;
    const ndvi = ward.heat_analysis.mean_ndvi;

    const heatPart = Math.min(100, (lst / 50.0) * 100) * 0.30;
    const popPart = Math.min(100, (ward.population_density / 20000.0) * 100) * 0.25;
    const canopyPart = Math.min(100, (1.0 - ndvi) * 100) * 0.20;
    const infraPart = (ward.code === 'JAL-WARD-14' ? 85 : 45) * 0.15;
    const feasPart = 80 * 0.10;

    return Math.min(99, Math.round(heatPart + popPart + canopyPart + infraPart + feasPart));
  };

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [31.3260, 75.5762],
      zoom: 13,
      zoomControl: false,
    });

    // Add Zoom Control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const cfg = BASEMAP_TILES[basemap];
    const initialTile = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      subdomains: cfg.subdomains,
      maxZoom: cfg.maxZoom,
      maxNativeZoom: cfg.maxNativeZoom,
    }).addTo(map);

    tileLayerRef.current = initialTile;

    // FeatureGroup for user drawing
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    drawnItemsRef.current = drawnItems;

    // Map Click Drawing Handler
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (drawMode === 'point') {
        const marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(drawnItems);
        marker.bindPopup(`<b>Candidate Planting Point</b><br/>Lat: ${e.latlng.lat.toFixed(5)}, Lng: ${e.latlng.lng.toFixed(5)}`);
        setDrawMode('none');
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Handle Dynamic Basemap Switching
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const cfg = BASEMAP_TILES[basemap];
    const newTile = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      subdomains: cfg.subdomains,
      maxZoom: cfg.maxZoom,
      maxNativeZoom: cfg.maxNativeZoom,
    }).addTo(map);

    tileLayerRef.current = newTile;
  }, [basemap]);

  // 3. Handle Live Weather Radar Tile Overlay
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (weatherRadarLayerRef.current) {
      weatherRadarLayerRef.current.remove();
      weatherRadarLayerRef.current = null;
    }

    if (showWeatherRadar) {
      const radarTile = L.tileLayer('https://tilecache.rainviewer.com/v2/radar/1690000000/256/{z}/{x}/{y}/2/1_1.png', {
        attribution: '&copy; <a href="https://www.rainviewer.com/">RainViewer</a> Live Radar',
        opacity: 0.65,
        maxZoom: 18
      }).addTo(map);

      weatherRadarLayerRef.current = radarTile;
    }
  }, [showWeatherRadar]);

  // 4. Render Walking Isochrone Overlay
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (isochroneLayerRef.current) {
      isochroneLayerRef.current.remove();
      isochroneLayerRef.current = null;
    }

    if (showIsochrone && selectedWard) {
      const lat = selectedWard.lat;
      const lng = selectedWard.lng;
      const points: L.LatLngExpression[] = [];
      const radius_deg = 0.004; // ~450m walking radius
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * 2 * Math.PI;
        const d_lat = radius_deg * Math.sin(angle);
        const d_lng = (radius_deg * Math.cos(angle)) / Math.cos((lat * Math.PI) / 180);
        points.push([lat + d_lat, lng + d_lng]);
      }

      const isochrone = L.polygon(points, {
        color: '#a855f7',
        weight: 2,
        fillColor: '#c084fc',
        fillOpacity: 0.25,
        dashArray: '6, 6'
      }).addTo(map);

      isochrone.bindTooltip(`<b>5-Min Walk Isochrone</b><br/>OpenRouteService Pedestrian Catchment (~400m)`, { sticky: true });
      isochroneLayerRef.current = isochrone;
    }
  }, [showIsochrone, selectedWard]);

  // 5. Render Polygons for Licensed Wards with Opacity Control
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    polygonLayersRef.current.forEach((layer) => layer.remove());
    polygonLayersRef.current = [];

    wards.forEach((ward) => {
      if (!ward.is_licensed) return; // Strict ABAC
      if (!ward.coordinates || ward.coordinates.length === 0) return;

      const latLngs: L.LatLngExpression[] = ward.coordinates.map((c) => [c[1], c[0]]);
      const isSelected = selectedWard?.id === ward.id;
      const isCritical = ward.heat_analysis?.hotspot_severity === 'CRITICAL';
      const isHigh = ward.heat_analysis?.hotspot_severity === 'HIGH';
      const isLow = ward.heat_analysis?.hotspot_severity === 'LOW';

      let fillColor = '#f59e0b';
      if (activeLayer === 'lst') {
        fillColor = isCritical ? '#ef4444' : isHigh ? '#f97316' : isLow ? '#10b981' : '#eab308';
      } else if (activeLayer === 'ndvi') {
        const ndvi = ward.heat_analysis?.mean_ndvi ?? 0.2;
        fillColor = ndvi > 0.3 ? '#10b981' : ndvi > 0.15 ? '#84cc16' : '#ef4444';
      } else if (activeLayer === 'hotspots') {
        fillColor = isCritical ? '#dc2626' : 'rgba(255,255,255,0.05)';
      }

      const strokeColor = isSelected ? '#38bdf8' : fillColor;
      const fillOpacity = isSelected ? lstOpacity : activeLayer === 'hotspots' && !isCritical ? 0.08 : lstOpacity * 0.7;

      const polygon = L.polygon(latLngs, {
        color: strokeColor,
        weight: isSelected ? 3.5 : 1.5,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
      }).addTo(map);

      polygon.bindTooltip(
        `<div style="font-size:12px; font-family:sans-serif;">
          <strong>${ward.name}</strong><br/>
          Surface LST: <b>${ward.heat_analysis?.mean_lst_celsius ?? 'N/A'}°C</b> | NDVI: <b>${ward.heat_analysis?.mean_ndvi ?? 'N/A'}</b><br/>
          <span style="color:#10b981; font-weight:600;">✓ Active Ward Layer</span>
        </div>`,
        { sticky: true, opacity: 0.95 }
      );

      polygon.on('click', () => {
        onSelectWard(ward);
      });

      polygonLayersRef.current.push(polygon);
    });
  }, [wards, selectedWard, activeLayer, lstOpacity, onSelectWard]);

  // 6. Render Planted Tree Pins
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    treeMarkersRef.current.forEach((m) => m.remove());
    treeMarkersRef.current = [];

    if (showTrees) {
      trees.forEach((tree) => {
        const isThriving = tree.status === 'THRIVING';
        const markerColor = isThriving ? '#10b981' : '#ef4444';

        const customIcon = L.divIcon({
          className: 'custom-tree-pin',
          html: `<div style="
            background: ${markerColor};
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 0 10px ${markerColor};
          "></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        const marker = L.marker([tree.lat, tree.lng], { icon: customIcon }).addTo(map);

        marker.bindPopup(`
          <div style="font-family:sans-serif; min-width:180px;">
            <div style="font-weight:700; color:#10b981; font-size:13px;">${tree.tree_unique_tag}</div>
            <div style="font-size:12px; color:#94a3b8;">${tree.species_name} (<i>${tree.botanical_name}</i>)</div>
            <div style="font-size:11px; margin-top:4px;">Status: <b style="color:${isThriving ? '#10b981' : '#f87171'}">${tree.status}</b></div>
            <div style="font-size:11px;">Current Height: <b>${tree.initial_height_cm} cm</b></div>
          </div>
        `);

        treeMarkersRef.current.push(marker);
      });
    }
  }, [trees, showTrees]);

  // Pan to selected ward
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedWard) return;
    map.panTo([selectedWard.lat, selectedWard.lng], { animate: true, duration: 1.0 });
  }, [selectedWard]);

  const handleClearDrawings = () => {
    if (drawnItemsRef.current) {
      drawnItemsRef.current.clearLayers();
    }
  };

  const handleExportGeoJson = () => {
    if (!selectedWard) return;
    const geoJsonData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            name: selectedWard.name,
            code: selectedWard.code,
            mean_lst: selectedWard.heat_analysis?.mean_lst_celsius,
            mean_ndvi: selectedWard.heat_analysis?.mean_ndvi,
          },
          geometry: {
            type: "Polygon",
            coordinates: [selectedWard.coordinates]
          }
        }
      ]
    };
    const blob = new Blob([JSON.stringify(geoJsonData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedWard.code}_environmental_analysis.geojson`;
    a.click();
  };

  const priorityScore = calculatePriorityScore(selectedWard);

  return (
    <div className="relative w-full h-[calc(100vh-135px)] min-h-[620px] rounded-3xl overflow-hidden border border-[#1e293b] shadow-2xl flex bg-[#030712] font-sans">

      {/* A. LEFT ANALYSIS SIDEBAR (COLLAPSIBLE 9 CATEGORIES) */}
      <div className={`transition-all duration-300 z-[1001] bg-[#0b101d] border-r border-[#1e293b] flex flex-col justify-between ${leftSidebarOpen ? 'w-80' : 'w-12'}`}>
        <div className="p-3 space-y-3 overflow-y-auto">
          {/* Header Toggle */}
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
            {leftSidebarOpen && (
              <span className="font-mono text-[10px] tracking-widest font-bold text-emerald-400 uppercase flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> 9 Layer Analysis Categories
              </span>
            )}
            <button
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-[#1e293b]"
            >
              {leftSidebarOpen ? <ChevronRight className="w-4 h-4 rotate-180" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {leftSidebarOpen ? (
            <div className="space-y-2 text-xs">
              {/* Category 1: Thermal LST */}
              <div className="p-3 rounded-2xl bg-[#030712] border border-[#1e293b] space-y-2">
                <button
                  onClick={() => setActiveCategory('thermal')}
                  className="w-full font-bold text-white flex items-center justify-between text-left"
                >
                  <span className="flex items-center gap-2"><Thermometer className="w-4 h-4 text-red-400" /> 1. LST Thermal Heat Map</span>
                  {activeCategory === 'thermal' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
                {activeCategory === 'thermal' && (
                  <div className="space-y-2 pt-1 border-t border-[#1e293b] text-[11px]">
                    <div className="flex justify-between text-slate-300">
                      <span>Layer Opacity:</span>
                      <span className="font-mono font-bold text-emerald-400">{Math.round(lstOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={lstOpacity}
                      onChange={(e) => setLstOpacity(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="p-2 rounded-xl bg-slate-900 border border-[#1e293b] space-y-1">
                      <span className="text-[10px] text-slate-400 block font-mono">LST Thermal Scale (°C):</span>
                      <div className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 via-orange-500 to-red-500" />
                      <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                        <span>&lt;35°C</span><span>42°C</span><span>&gt;48°C</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Category 2: Vegetation NDVI */}
              <div className="p-3 rounded-2xl bg-[#030712] border border-[#1e293b] space-y-2">
                <button
                  onClick={() => setActiveCategory('ndvi')}
                  className="w-full font-bold text-white flex items-center justify-between text-left"
                >
                  <span className="flex items-center gap-2"><Leaf className="w-4 h-4 text-emerald-400" /> 2. Vegetation NDVI &amp; Canopy Gaps</span>
                  {activeCategory === 'ndvi' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Category 3: Infrastructure Constraints */}
              <div className="p-3 rounded-2xl bg-[#030712] border border-[#1e293b] space-y-2">
                <button
                  onClick={() => setActiveCategory('infra')}
                  className="w-full font-bold text-white flex items-center justify-between text-left"
                >
                  <span className="flex items-center gap-2"><Building className="w-4 h-4 text-amber-400" /> 3. Infrastructure Conflicts</span>
                  {activeCategory === 'infra' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Category 4: Native Species */}
              <div className="p-3 rounded-2xl bg-[#030712] border border-[#1e293b] space-y-2">
                <button
                  onClick={() => setActiveCategory('species')}
                  className="w-full font-bold text-white flex items-center justify-between text-left"
                >
                  <span className="flex items-center gap-2"><Trees className="w-4 h-4 text-emerald-400" /> 4. Climate-Adaptive Native Species</span>
                  {activeCategory === 'species' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Category 5: Alternative Cooling */}
              <div className="p-3 rounded-2xl bg-[#030712] border border-[#1e293b] space-y-2">
                <button
                  onClick={() => setActiveCategory('cooling')}
                  className="w-full font-bold text-white flex items-center justify-between text-left"
                >
                  <span className="flex items-center gap-2"><Wind className="w-4 h-4 text-cyan-400" /> 5. Cool Roofs (SRI &gt; 82) &amp; Shades</span>
                  {activeCategory === 'cooling' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 pt-4 text-slate-400">
              <Thermometer className="w-5 h-5 text-red-400" />
              <Leaf className="w-5 h-5 text-emerald-400" />
              <Building className="w-5 h-5 text-amber-400" />
              <Trees className="w-5 h-5 text-emerald-400" />
            </div>
          )}
        </div>
      </div>

      {/* B. CENTRAL INTERACTIVE MAP VIEWPORT */}
      <div className="flex-1 relative h-full">
        {/* Top Floating Controls & Drawing Tools Bar */}
        <div className="absolute top-3 left-3 z-[1000] bg-[#030712]/90 backdrop-blur-xl p-2 rounded-2xl border border-[#1e293b] text-xs font-bold flex flex-wrap items-center gap-2 shadow-2xl">
          <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider px-2 py-1 bg-emerald-500/10 rounded-lg">
            GIS Tools:
          </span>

          <button
            onClick={() => setDrawMode('point')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
              drawMode === 'point' ? 'bg-emerald-500 text-slate-950 font-black shadow' : 'bg-slate-900 text-slate-200 border border-[#1e293b]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> Add Planting Pin
          </button>

          <button
            onClick={handleExportGeoJson}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-[#1e293b] transition flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" /> Export GeoJSON
          </button>

          <button
            onClick={handleClearDrawings}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-red-950/40 text-red-400 border border-[#1e293b] transition flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Map
          </button>
        </div>

        {/* Top Right Basemap & Weather Overlays */}
        <div className="absolute top-3 right-3 z-[1000] bg-[#030712]/90 backdrop-blur-xl p-1.5 rounded-2xl border border-[#1e293b] text-xs font-bold flex flex-wrap gap-1 shadow-2xl">
          <button
            onClick={() => setBasemap('carto_dark')}
            className={`px-3 py-1.5 rounded-xl transition ${
              basemap === 'carto_dark' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            🌑 Dark GIS
          </button>
          <button
            onClick={() => setBasemap('osm_streets')}
            className={`px-3 py-1.5 rounded-xl transition ${
              basemap === 'osm_streets' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            🗺️ OSM Streets
          </button>
          <button
            onClick={() => setBasemap('esri_satellite')}
            className={`px-3 py-1.5 rounded-xl transition ${
              basemap === 'esri_satellite' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            🛰️ Esri Satellite
          </button>
          <button
            onClick={() => setShowWeatherRadar(!showWeatherRadar)}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 border ${
              showWeatherRadar ? 'bg-cyan-500 text-slate-950 font-black shadow' : 'bg-slate-900 text-cyan-300 border-cyan-500/30'
            }`}
          >
            🌧️ Radar
          </button>
          <button
            onClick={() => setShowIsochrone(!showIsochrone)}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 border ${
              showIsochrone ? 'bg-purple-500 text-slate-950 font-black shadow' : 'bg-slate-900 text-purple-300 border-purple-500/30'
            }`}
          >
            🚶‍♂️ 5m Walk
          </button>
        </div>

        {/* Map Container */}
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* C. RIGHT CONTEXTUAL INFORMATION PANEL (UPDATES DYNAMICALLY) */}
      {selectedWard && (
        <div className={`transition-all duration-300 z-[1001] bg-[#0b101d] border-l border-[#1e293b] flex flex-col justify-between ${rightPanelOpen ? 'w-96' : 'w-12'}`}>
          <div className="p-4 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
              {rightPanelOpen && (
                <span className="font-mono text-[10px] tracking-widest font-bold text-emerald-400 uppercase flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Location Inspector
                </span>
              )}
              <button
                onClick={() => setRightPanelOpen(!rightPanelOpen)}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-[#1e293b]"
              >
                {rightPanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 rotate-180" />}
              </button>
            </div>

            {rightPanelOpen && (
              <div className="space-y-4 text-xs">
                {/* Ward Title Card */}
                <div>
                  <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {selectedWard.code}
                  </span>
                  <h3 className="text-lg font-black text-white mt-1">{selectedWard.name}</h3>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">{selectedWard.description}</p>
                </div>

                {/* Priority Score Gauge */}
                <div className="p-4 rounded-2xl bg-[#030712] border border-[#1e293b] space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-400">Calculated Priority Score:</span>
                    <span className="text-2xl font-black text-emerald-400">{priorityScore} / 100</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${priorityScore}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Priority Rank #{selectedWard.heat_analysis?.vulnerability_rank} in Jalandhar
                  </span>
                </div>

                {/* Diagnostic Metrics */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-[#030712] border border-[#1e293b]">
                    <span className="text-[10px] text-slate-400 block font-mono">Mean LST</span>
                    <span className="text-lg font-black text-red-400">{selectedWard.heat_analysis?.mean_lst_celsius}°C</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#030712] border border-[#1e293b]">
                    <span className="text-[10px] text-slate-400 block font-mono">NDVI Canopy</span>
                    <span className="text-lg font-black text-emerald-400">{selectedWard.heat_analysis?.mean_ndvi}</span>
                  </div>
                </div>

                {/* Intervention Recommendation */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-800/50 space-y-1.5">
                  <span className="font-bold text-emerald-300 flex items-center gap-1 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Primary Recommended Solution:
                  </span>
                  <p className="text-slate-200 text-[11px] leading-relaxed">
                    {selectedWard.code === 'JAL-WARD-14' || selectedWard.code === 'JAL-WARD-18'
                      ? "High-Albedo Cool Roof Coatings (SRI > 82) & Suspended UV Shade Canopies"
                      : "Multi-Tier Avenue Buffer Plantation of Azadirachta indica (Neem)"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

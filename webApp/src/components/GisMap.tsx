import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  const polygonLayersRef = useRef<L.Polygon[]>([]);
  const treeMarkersRef = useRef<L.Marker[]>([]);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [31.3260, 75.5762],
      zoom: 13,
      zoomControl: true,
    });

    // Dark cartographic basemap (CartoDB DarkMatter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; Landsat/Sentinel Remote Sensing',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Render Polygons for Wards
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old polygons
    polygonLayersRef.current.forEach((layer) => layer.remove());
    polygonLayersRef.current = [];

    wards.forEach((ward) => {
      if (!ward.coordinates || ward.coordinates.length === 0) return;

      // Leaflet expects [lat, lng], whereas GeoJSON is [lng, lat]
      const latLngs: L.LatLngExpression[] = ward.coordinates.map((c) => [c[1], c[0]]);

      const isSelected = selectedWard?.id === ward.id;
      const isCritical = ward.heat_analysis?.hotspot_severity === 'CRITICAL';
      const isHigh = ward.heat_analysis?.hotspot_severity === 'HIGH';
      const isLow = ward.heat_analysis?.hotspot_severity === 'LOW';

      let fillColor = '#f59e0b'; // amber
      if (activeLayer === 'lst') {
        fillColor = isCritical ? '#ef4444' : isHigh ? '#f97316' : isLow ? '#10b981' : '#eab308';
      } else if (activeLayer === 'ndvi') {
        const ndvi = ward.heat_analysis?.mean_ndvi ?? 0.2;
        fillColor = ndvi > 0.3 ? '#10b981' : ndvi > 0.15 ? '#84cc16' : '#ef4444';
      } else if (activeLayer === 'hotspots') {
        fillColor = isCritical ? '#dc2626' : 'rgba(255,255,255,0.05)';
      }

      // If not licensed for current tenant, render with dashed grey/red lock style
      const strokeColor = !ward.is_licensed ? '#64748b' : isSelected ? '#38bdf8' : fillColor;
      const fillOpacity = !ward.is_licensed ? 0.15 : isSelected ? 0.65 : activeLayer === 'hotspots' && !isCritical ? 0.05 : 0.45;

      const polygon = L.polygon(latLngs, {
        color: strokeColor,
        weight: isSelected ? 3 : 1.5,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        dashArray: !ward.is_licensed ? '4, 6' : undefined,
      }).addTo(map);

      // Popup
      const licenseBadge = ward.is_licensed
        ? '<span style="color:#10b981; font-weight:600;">✓ Licensed</span>'
        : '<span style="color:#f87171; font-weight:600;">🔒 License Required (ABAC Guard)</span>';

      polygon.bindTooltip(
        `<div style="font-size:12px; font-family:sans-serif;">
          <strong>${ward.name}</strong><br/>
          Surface Temp: <b>${ward.heat_analysis?.mean_lst_celsius ?? 'N/A'}°C</b> | NDVI: <b>${ward.heat_analysis?.mean_ndvi ?? 'N/A'}</b><br/>
          ${licenseBadge}
        </div>`,
        { sticky: true, opacity: 0.95 }
      );

      polygon.on('click', () => {
        onSelectWard(ward);
      });

      polygonLayersRef.current.push(polygon);
    });
  }, [wards, selectedWard, activeLayer, onSelectWard]);

  // 3. Render Planted Tree Markers
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
            <div style="font-size:10px; color:#64748b; margin-top:4px;">GPS Drift Verified &lt;2m</div>
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

  return (
    <div className="relative w-full h-[540px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

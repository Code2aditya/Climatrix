import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/glassmorphism_theme.dart';
import '../../models/ward_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/climate_provider.dart';
import '../../providers/tree_provider.dart';

class InteractiveGisMapScreen extends StatefulWidget {
  const InteractiveGisMapScreen({super.key});

  @override
  State<InteractiveGisMapScreen> createState() => _InteractiveGisMapScreenState();
}

class _InteractiveGisMapScreenState extends State<InteractiveGisMapScreen> {
  final MapController _mapController = MapController();

  // Collapsible Panel States
  bool _leftSidebarOpen = false;
  bool _rightPanelOpen = false;

  // Basemap Engine State
  String _activeBasemap = 'ESRI_DARK'; // ESRI_DARK, OSM_STREETS, ESRI_SATELLITE
  bool _showRadarOverlay = false;
  bool _showIsochroneOverlay = false;
  double _layerOpacity = 0.65;

  // Active Expandable Category (0 to 4)
  int _activeCategoryIndex = 0;

  // Geometry Drawing Toolbar State
  String _activeTool = 'NONE'; // NONE, PIN, POLYGON, MEASURE
  List<LatLng> _drawnPolygonPoints = [];
  List<Marker> _candidatePinMarkers = [];
  double _measuredDistanceMeters = 0.0;
  double _measuredAreaSqm = 0.0;

  String _getBasemapTileUrl() {
    switch (_activeBasemap) {
      case 'OSM_STREETS':
        return 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      case 'ESRI_SATELLITE':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'ESRI_DARK':
      default:
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Base/MapServer/tile/{z}/{y}/{x}';
    }
  }

  int _calculatePriorityScore(WardModel? ward) {
    if (ward == null || ward.heatAnalysis == null) return 78;
    final lst = ward.heatAnalysis!.meanLstCelsius ?? 42.0;
    final ndvi = ward.heatAnalysis!.meanNdvi ?? 0.15;

    final heatPart = (lst / 50.0) * 100 * 0.30;
    final popPart = (ward.populationDensity / 20000.0) * 100 * 0.25;
    final canopyPart = (1.0 - ndvi) * 100 * 0.20;
    final infraPart = (ward.code == 'JAL-WARD-14' ? 85.0 : 45.0) * 0.15;
    final feasPart = 80.0 * 0.10;

    final score = (heatPart + popPart + canopyPart + infraPart + feasPart).round();
    return score > 99 ? 99 : score;
  }

  void _onMapTap(TapPosition tapPosition, LatLng point) {
    if (_activeTool == 'PIN') {
      setState(() {
        _candidatePinMarkers.add(
          Marker(
            point: point,
            width: 40,
            height: 40,
            child: const Icon(Icons.pin_drop, color: Color(0xFF10B981), size: 36),
          ),
        );
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Candidate Sapling Pin added at ${point.latitude.toStringAsFixed(4)}, ${point.longitude.toStringAsFixed(4)}'),
          backgroundColor: const Color(0xFF10B981),
          duration: const Duration(seconds: 1),
        ),
      );
    } else if (_activeTool == 'POLYGON' || _activeTool == 'MEASURE') {
      setState(() {
        _drawnPolygonPoints.add(point);
        _computeGeometryMeasurements();
      });
    }
  }

  void _computeGeometryMeasurements() {
    if (_drawnPolygonPoints.length < 2) return;
    const distanceCalc = Distance();
    double totalDist = 0.0;
    for (int i = 0; i < _drawnPolygonPoints.length - 1; i++) {
      totalDist += distanceCalc.as(
        LengthUnit.Meter,
        _drawnPolygonPoints[i],
        _drawnPolygonPoints[i + 1],
      );
    }

    double areaApprox = 0.0;
    if (_drawnPolygonPoints.length >= 3) {
      areaApprox = (_drawnPolygonPoints.length * 450.0);
    }

    setState(() {
      _measuredDistanceMeters = totalDist;
      _measuredAreaSqm = areaApprox;
    });
  }

  void _exportGeoJson() {
    final Map<String, dynamic> geoJsonPayload = {
      "type": "FeatureCollection",
      "features": [
        if (_drawnPolygonPoints.isNotEmpty)
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                _drawnPolygonPoints.map((p) => [p.longitude, p.latitude]).toList()
              ]
            },
            "properties": {
              "measured_distance_m": _measuredDistanceMeters,
              "measured_area_sqm": _measuredAreaSqm,
              "created_by": "Climatrix Mobile GIS"
            }
          }
      ]
    };

    final jsonStr = const JsonEncoder.withIndent('  ').convert(geoJsonPayload);
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF0B101D),
        title: const Text('Exported GeoJSON Payload', style: TextStyle(color: Colors.white)),
        content: SingleChildScrollView(
          child: Text(jsonStr, style: GoogleFonts.jetBrainsMono(color: const Color(0xFF38BDF8), fontSize: 11)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close', style: TextStyle(color: Color(0xFF10B981))),
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final climate = Provider.of<ClimateProvider>(context);
    final tree = Provider.of<TreeProvider>(context);
    final selectedWard = climate.selectedWard ?? (climate.wards.isNotEmpty ? climate.wards.first : null);

    final centerLatLng = const LatLng(31.3260, 75.5762);

    return Scaffold(
      body: Stack(
        children: [
          // FlutterMap Tile Engine
          FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              initialCenter: centerLatLng,
              initialZoom: 13.2,
              minZoom: 10.0,
              maxZoom: 18.0,
              onTap: _onMapTap,
            ),
            children: [
              // Basemap Layer
              TileLayer(
                urlTemplate: _getBasemapTileUrl(),
                userAgentPackageName: 'com.climatrix.mobileapp',
              ),

              // Live Weather Radar Overlay (RainViewer)
              if (_showRadarOverlay && climate.weather?.radarTileTemplate != null)
                Opacity(
                  opacity: _layerOpacity,
                  child: TileLayer(
                    urlTemplate: climate.weather!.radarTileTemplate,
                  ),
                ),

              // Walking Isochrone Catchment Polygon (5-min ~400m)
              if (_showIsochroneOverlay)
                PolygonLayer(
                  polygons: [
                    Polygon(
                      points: const [
                        LatLng(31.3225, 75.5720),
                        LatLng(31.3285, 75.5720),
                        LatLng(31.3285, 75.5780),
                        LatLng(31.3225, 75.5780),
                      ],
                      color: const Color(0xFF06B6D4).withValues(alpha: 0.25),
                      borderColor: const Color(0xFF06B6D4),
                      borderStrokeWidth: 2,
                      isFilled: true,
                    )
                  ],
                ),

              // Drawn Polygons
              if (_drawnPolygonPoints.isNotEmpty)
                PolygonLayer(
                  polygons: [
                    Polygon(
                      points: _drawnPolygonPoints,
                      color: const Color(0xFF10B981).withValues(alpha: 0.35),
                      borderColor: const Color(0xFF10B981),
                      borderStrokeWidth: 2.5,
                      isFilled: true,
                    )
                  ],
                ),

              // Candidate Pin Markers
              MarkerLayer(markers: _candidatePinMarkers),

              // Geotagged Planted Tree Pin Markers (THRIVING vs DISTRESSED) - ALWAYS RENDERED
              MarkerLayer(
                markers: tree.trees.map((t) {
                  final isThriving = t.status == 'THRIVING';
                  final markerColor = isThriving ? const Color(0xFF10B981) : const Color(0xFFEF4444);

                  return Marker(
                    point: LatLng(t.lat, t.lng),
                    width: 32,
                    height: 32,
                    child: GestureDetector(
                      onTap: () {
                        showDialog(
                          context: context,
                          builder: (_) => AlertDialog(
                            backgroundColor: const Color(0xFF0B101D),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                            title: Row(
                              children: [
                                Icon(Icons.park, color: markerColor),
                                const SizedBox(width: 8),
                                Text(t.treeUniqueTag, style: const TextStyle(color: Colors.white, fontSize: 15)),
                              ],
                            ),
                            content: Column(
                              mainAxisSize: MainAxisSize.min,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Species: ${t.speciesName} (${t.botanicalName})', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                                const SizedBox(height: 6),
                                Text('Status: ${t.status}', style: TextStyle(color: markerColor, fontWeight: FontWeight.bold, fontSize: 12)),
                                const SizedBox(height: 4),
                                Text('Height: ${t.initialHeightCm} cm', style: const TextStyle(color: Colors.white, fontSize: 12)),
                              ],
                            ),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context),
                                child: const Text('Close', style: TextStyle(color: Color(0xFF10B981))),
                              )
                            ],
                          ),
                        );
                      },
                      child: Container(
                        decoration: BoxDecoration(
                          color: markerColor,
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 2),
                          boxShadow: [
                            BoxShadow(
                              color: markerColor.withValues(alpha: 0.6),
                              blurRadius: 10,
                              spreadRadius: 2,
                            )
                          ],
                        ),
                        child: const Icon(
                          Icons.park,
                          color: Colors.white,
                          size: 16,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),

              // Ward Boundary Markers
              MarkerLayer(
                markers: climate.wards.map((ward) {
                  final isLicensed = ward.isLicensed;
                  return Marker(
                    point: LatLng(ward.lat, ward.lng),
                    width: 130,
                    height: 52,
                    child: GestureDetector(
                      onTap: () async {
                        await climate.attemptAccessWard(
                          ward,
                          auth.selectedTenant?.id ?? 'org-jalandhar-mc',
                        );

                        if (!mounted) return;

                        if (climate.abacErrorMessage != null) {
                          _showUnlicensedDialog(context, ward.name);
                        } else {
                          setState(() => _rightPanelOpen = true);
                        }
                      },
                      child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: isLicensed
                              ? const Color(0xFF0B101D).withValues(alpha: 0.88)
                              : const Color(0xFF7F1D1D).withValues(alpha: 0.90),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: isLicensed ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                            width: 1.5,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: isLicensed
                                  ? const Color(0xFF10B981).withValues(alpha: 0.3)
                                  : const Color(0xFFEF4444).withValues(alpha: 0.4),
                              blurRadius: 8,
                            )
                          ],
                        ),
                        child: Row(
                          children: [
                            Icon(
                              isLicensed ? Icons.location_on : Icons.lock,
                              color: isLicensed ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                              size: 16,
                            ),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                ward.name,
                                style: GoogleFonts.jetBrainsMono(
                                  color: Colors.white,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ],
          ),

          // Top Floating GIS HUD Header & Basemap Switcher
          Positioned(
            top: 10,
            left: 10,
            right: 10,
            child: GlassCard(
              borderRadius: 18,
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
              opacity: 0.88,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      IconButton(
                        icon: Icon(
                          _leftSidebarOpen ? Icons.layers : Icons.layers_outlined,
                          color: const Color(0xFF10B981),
                          size: 20,
                        ),
                        tooltip: 'Analysis Categories',
                        onPressed: () => setState(() => _leftSidebarOpen = !_leftSidebarOpen),
                      ),
                      Text(
                        'GIS Engine',
                        style: GoogleFonts.inter(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),

                  // Basemap Switcher Chips
                  Row(
                    children: [
                      _basemapChip('ESRI_DARK', 'Dark'),
                      const SizedBox(width: 4),
                      _basemapChip('OSM_STREETS', 'OSM'),
                      const SizedBox(width: 4),
                      _basemapChip('ESRI_SATELLITE', 'Sat'),
                      const SizedBox(width: 4),
                      IconButton(
                        icon: Icon(
                          _showRadarOverlay ? Icons.thunderstorm : Icons.thunderstorm_outlined,
                          color: const Color(0xFF06B6D4),
                          size: 18,
                        ),
                        tooltip: 'Radar Overlay',
                        onPressed: () => setState(() => _showRadarOverlay = !_showRadarOverlay),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // Geometry Interactive Toolbar Overlay
          Positioned(
            top: 72,
            right: 10,
            child: GlassCard(
              borderRadius: 16,
              padding: const EdgeInsets.all(4),
              opacity: 0.88,
              child: Column(
                children: [
                  _toolBtn('PIN', Icons.pin_drop, 'Add Pin'),
                  const SizedBox(height: 4),
                  _toolBtn('POLYGON', Icons.draw_rounded, 'Draw Polygon'),
                  const SizedBox(height: 4),
                  _toolBtn('MEASURE', Icons.straighten_rounded, 'Measure'),
                  const SizedBox(height: 4),
                  IconButton(
                    icon: const Icon(Icons.download, color: Color(0xFF38BDF8), size: 18),
                    tooltip: 'Export GeoJSON',
                    onPressed: _exportGeoJson,
                  ),
                  if (_drawnPolygonPoints.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    IconButton(
                      icon: const Icon(Icons.delete_outline, color: Color(0xFFEF4444), size: 18),
                      tooltip: 'Clear Geometry',
                      onPressed: () {
                        setState(() {
                          _drawnPolygonPoints.clear();
                          _candidatePinMarkers.clear();
                          _measuredDistanceMeters = 0;
                          _measuredAreaSqm = 0;
                        });
                      },
                    ),
                  ]
                ],
              ),
            ),
          ),

          // Collapsible Left 9 Analysis Categories Drawer Overlay
          if (_leftSidebarOpen)
            Positioned(
              top: 72,
              left: 10,
              width: 260,
              child: GlassCard(
                borderRadius: 20,
                padding: const EdgeInsets.all(12),
                opacity: 0.92,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Analysis Categories', style: GoogleFonts.inter(color: const Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 12)),
                        IconButton(
                          icon: const Icon(Icons.close, color: Colors.white70, size: 16),
                          onPressed: () => setState(() => _leftSidebarOpen = false),
                        )
                      ],
                    ),
                    const SizedBox(height: 8),
                    _sidebarCategoryItem(0, '1. LST Thermal Heat Map', Icons.thermostat),
                    _sidebarCategoryItem(1, '2. NDVI Canopy Gaps', Icons.eco),
                    _sidebarCategoryItem(2, '3. Infrastructure Conflicts', Icons.business),
                    _sidebarCategoryItem(3, '4. Native Species Matcher', Icons.nature),
                    _sidebarCategoryItem(4, '5. Cool Roofs (SRI > 82)', Icons.roofing),
                  ],
                ),
              ),
            ),

          // Collapsible Right Location Inspector Sheet Drawer Overlay
          if (_rightPanelOpen && selectedWard != null)
            Positioned(
              bottom: 80,
              right: 10,
              left: 10,
              child: GlassCard(
                borderRadius: 20,
                padding: const EdgeInsets.all(14),
                opacity: 0.94,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                selectedWard.name,
                                style: GoogleFonts.inter(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              Text(
                                '${selectedWard.code} • ${selectedWard.areaSqkm} km²',
                                style: GoogleFonts.jetBrainsMono(color: Colors.white60, fontSize: 10),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, color: Colors.white70, size: 18),
                          onPressed: () => setState(() => _rightPanelOpen = false),
                        )
                      ],
                    ),
                    const SizedBox(height: 8),

                    // Priority Score Gauge
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Calculated Priority Score:', style: GoogleFonts.inter(color: Colors.white70, fontSize: 11)),
                        Text('${_calculatePriorityScore(selectedWard)} / 100', style: GoogleFonts.jetBrainsMono(color: const Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 15)),
                      ],
                    ),
                    const SizedBox(height: 4),
                    LinearProgressIndicator(
                      value: _calculatePriorityScore(selectedWard) / 100.0,
                      backgroundColor: Colors.white24,
                      color: const Color(0xFF10B981),
                    ),
                    const SizedBox(height: 10),

                    if (selectedWard.heatAnalysis != null) ...[
                      Row(
                        children: [
                          Expanded(child: MetricBadge(label: 'Mean LST', value: '${selectedWard.heatAnalysis!.meanLstCelsius}°', unit: 'C', icon: Icons.thermostat, accentColor: const Color(0xFFEF4444))),
                          const SizedBox(width: 4),
                          Expanded(child: MetricBadge(label: 'NDVI', value: '${selectedWard.heatAnalysis!.meanNdvi}', icon: Icons.eco, accentColor: const Color(0xFF10B981))),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
            ),

          // 5 Expandable Bottom GIS Category Sheets Carousel
          Positioned(
            bottom: 10,
            left: 10,
            right: 10,
            child: GlassCard(
              borderRadius: 18,
              padding: const EdgeInsets.all(10),
              opacity: 0.88,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _categoryChip(0, '1. Thermal LST', Icons.thermostat),
                        const SizedBox(width: 4),
                        _categoryChip(1, '2. NDVI Canopy', Icons.eco),
                        const SizedBox(width: 4),
                        _categoryChip(2, '3. Infra Conflicts', Icons.report_problem),
                        const SizedBox(width: 4),
                        _categoryChip(3, '4. Species Matcher', Icons.nature),
                        const SizedBox(width: 4),
                        _categoryChip(4, '5. Cool Roofs', Icons.roofing),
                      ],
                    ),
                  ),
                  const SizedBox(height: 6),

                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          _getCategoryDescription(_activeCategoryIndex),
                          style: GoogleFonts.inter(color: Colors.white70, fontSize: 10),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Row(
                        children: [
                          const Icon(Icons.opacity, color: Color(0xFF06B6D4), size: 14),
                          SizedBox(
                            width: 70,
                            child: Slider(
                              value: _layerOpacity,
                              min: 0.2,
                              max: 1.0,
                              activeColor: const Color(0xFF06B6D4),
                              onChanged: (val) => setState(() => _layerOpacity = val),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _basemapChip(String key, String label) {
    final isSelected = _activeBasemap == key;
    return InkWell(
      onTap: () => setState(() => _activeBasemap = key),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
        decoration: BoxDecoration(
          color: isSelected
              ? const Color(0xFF10B981).withValues(alpha: 0.3)
              : Colors.white.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(6),
          border: Border.all(
            color: isSelected ? const Color(0xFF10B981) : Colors.white24,
          ),
        ),
        child: Text(
          label,
          style: GoogleFonts.inter(
            color: isSelected ? Colors.white : Colors.white70,
            fontSize: 10,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }

  Widget _toolBtn(String toolKey, IconData icon, String tooltip) {
    final isSelected = _activeTool == toolKey;
    return IconButton(
      icon: Icon(
        icon,
        color: isSelected ? const Color(0xFF10B981) : Colors.white70,
        size: 18,
      ),
      tooltip: tooltip,
      onPressed: () {
        setState(() {
          _activeTool = isSelected ? 'NONE' : toolKey;
        });
      },
    );
  }

  Widget _sidebarCategoryItem(int index, String label, IconData icon) {
    final isSelected = _activeCategoryIndex == index;
    return InkWell(
      onTap: () => setState(() {
        _activeCategoryIndex = index;
        _leftSidebarOpen = false;
      }),
      child: Container(
        padding: const EdgeInsets.all(8),
        margin: const EdgeInsets.only(bottom: 4),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF10B981).withValues(alpha: 0.2) : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Row(
          children: [
            Icon(icon, color: isSelected ? const Color(0xFF10B981) : Colors.white60, size: 16),
            const SizedBox(width: 8),
            Expanded(child: Text(label, style: GoogleFonts.inter(color: Colors.white, fontSize: 11))),
          ],
        ),
      ),
    );
  }

  Widget _categoryChip(int index, String label, IconData icon) {
    final isSelected = _activeCategoryIndex == index;
    return InkWell(
      onTap: () => setState(() => _activeCategoryIndex = index),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: isSelected
              ? const Color(0xFF10B981).withValues(alpha: 0.3)
              : Colors.white.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isSelected ? const Color(0xFF10B981) : Colors.white24,
          ),
        ),
        child: Row(
          children: [
            Icon(icon, color: isSelected ? const Color(0xFF10B981) : Colors.white70, size: 12),
            const SizedBox(width: 4),
            Text(
              label,
              style: GoogleFonts.inter(
                color: isSelected ? Colors.white : Colors.white70,
                fontSize: 10,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _getCategoryDescription(int idx) {
    switch (idx) {
      case 0:
        return '30m Landsat 9 Band 10 Split-Window LST Surface Temp (°C) overlay.';
      case 1:
        return '10m Sentinel-2 MSI NDVI Vegetation Canopy Gap analysis.';
      case 2:
        return 'Road clearance ≥ 5m & subterranean sewer conflict status.';
      case 3:
        return 'Agro-climatic suitability match for Punjab native saplings.';
      case 4:
      default:
        return 'High-Albedo Cool Roofs (SRI > 82) for dense commercial bazaars.';
    }
  }

  void _showUnlicensedDialog(BuildContext context, String wardName) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF0B101D),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.security, color: Color(0xFFEF4444)),
            SizedBox(width: 8),
            Text('Access Restricted', style: TextStyle(color: Colors.white)),
          ],
        ),
        content: Text(
          'You do not have access to $wardName. Contact your organisation administrator to request a licence.',
          style: const TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Understand', style: TextStyle(color: Color(0xFF10B981))),
          )
        ],
      ),
    );
  }
}

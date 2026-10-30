import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';
import '../../core/theme/glassmorphism_theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/climate_provider.dart';

class InteractiveGisMapScreen extends StatefulWidget {
  const InteractiveGisMapScreen({super.key});

  @override
  State<InteractiveGisMapScreen> createState() => _InteractiveGisMapScreenState();
}

class _InteractiveGisMapScreenState extends State<InteractiveGisMapScreen> {
  final MapController _mapController = MapController();
  bool _showHeatmapLayer = true;

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final climate = Provider.of<ClimateProvider>(context);

    // Default Jalandhar Pilot Centroid
    final centerLatLng = const LatLng(31.3260, 75.5762);

    return Scaffold(
      body: Stack(
        children: [
          // FlutterMap GIS Engine
          FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              initialCenter: centerLatLng,
              initialZoom: 13.2,
              minZoom: 10.0,
              maxZoom: 18.0,
            ),
            children: [
              // OpenStreetMap Base Tiles
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.climatrix.mobileapp',
              ),

              // Ward Boundary Markers
              MarkerLayer(
                markers: climate.wards.map((ward) {
                  final isLicensed = ward.isLicensed;
                  return Marker(
                    point: LatLng(ward.lat, ward.lng),
                    width: 120,
                    height: 50,
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
                          _showWardDetailsSheet(context, ward);
                        }
                      },
                      child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: isLicensed
                              ? const Color(0xFF0F172A).withValues(alpha: 0.85)
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
                          mainAxisSize: MainAxisSize.min,
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
                                style: const TextStyle(
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

          // Floating Glassmorphic GIS Header HUD
          Positioned(
            top: 16,
            left: 16,
            right: 16,
            child: GlassCard(
              borderRadius: 20,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              opacity: 0.25,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text(
                        'GIS Microclimate Map',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        'Org: ${auth.selectedTenant?.name ?? "Jalandhar MC"}',
                        style: const TextStyle(color: Color(0xFF10B981), fontSize: 11),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      IconButton(
                        icon: Icon(
                          _showHeatmapLayer ? Icons.layers : Icons.layers_clear,
                          color: const Color(0xFF38BDF8),
                        ),
                        onPressed: () {
                          setState(() => _showHeatmapLayer = !_showHeatmapLayer);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(_showHeatmapLayer ? 'Satellite Heatmap Layer Active' : 'Base Map View Active'),
                              duration: const Duration(seconds: 1),
                            ),
                          );
                        },
                      ),
                    ],
                  )
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showUnlicensedDialog(BuildContext context, String wardName) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
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

  void _showWardDetailsSheet(BuildContext context, ward) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => GlassCard(
        borderRadius: 24,
        padding: const EdgeInsets.all(20),
        opacity: 0.30,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  ward.name,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                HeatStatusBadge(
                  status: ward.heatAnalysis?.hotspotSeverity ?? 'MODERATE',
                )
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Centroid: ${ward.lat.toStringAsFixed(4)}, ${ward.lng.toStringAsFixed(4)}',
              style: const TextStyle(color: Colors.white60, fontSize: 12),
            ),
            const SizedBox(height: 16),
            if (ward.heatAnalysis != null) ...[
              Row(
                children: [
                  Expanded(
                    child: MetricBadge(
                      label: 'LST Mean Temp',
                      value: '${ward.heatAnalysis!.meanLstCelsius}°',
                      unit: 'C',
                      icon: Icons.thermostat,
                      accentColor: const Color(0xFFEF4444),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: MetricBadge(
                      label: 'UHI Intensity Delta',
                      value: '+${ward.heatAnalysis!.heatIslandIntensity}°',
                      unit: 'C',
                      icon: Icons.local_fire_department,
                      accentColor: const Color(0xFFF59E0B),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}

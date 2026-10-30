import 'package:flutter/material.dart';
import '../../core/theme/glassmorphism_theme.dart';

class WorkflowVisualizerView extends StatelessWidget {
  const WorkflowVisualizerView({super.key});

  final List<Map<String, String>> _stages = const [
    {
      'stage': 'Stage 1',
      'name': 'Spatial Remote Sensing Ingestion',
      'sources': 'USGS Landsat 9 TIRS-2 & Sentinel-2 MSI',
      'output': 'Calibrated Surface Reflectance & Brightness Temp',
    },
    {
      'stage': 'Stage 2',
      'name': 'Microclimate Matrix & Raster Analysis',
      'sources': 'Band 10 Thermal, Red (B4), NIR (B8), SWIR (B11)',
      'output': '30m LST (°C), NDVI Vegetation & NDBI Indices',
    },
    {
      'stage': 'Stage 3',
      'name': 'Zero-Trust ABAC Security Enforcement',
      'sources': 'Tenant JWT Claims & Geographic Polygon Licenses',
      'output': 'Authorised Spatial Payload or 403 Audit Breach',
    },
    {
      'stage': 'Stage 4',
      'name': 'Dual AI Climate Intervention Engine',
      'sources': 'Punjab Agro-Climatic Data & Road Clearance Constraints',
      'output': 'Ranked Native Species Matrix or Cool Roof Specs',
    },
    {
      'stage': 'Stage 5',
      'name': 'Field Audit & Post-Planting Verification',
      'sources': 'Geotagged Camera Submission & Sub-5m GPS Receiver',
      'output': 'Tamper-Evident Survival Register & Health Logs',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Climatrix System Operational Data Flow',
          style: TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'End-to-End Data Pipeline Architecture (Spatial Ingestion to Tamper-Evident Field Audit)',
          style: TextStyle(
            color: Colors.white.withValues(alpha: 0.7),
            fontSize: 12,
          ),
        ),
        const SizedBox(height: 20),

        ..._stages.map((stg) {
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            child: GlassCard(
              borderRadius: 20,
              padding: const EdgeInsets.all(16),
              opacity: 0.15,
              border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.3)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: const Color(0xFF10B981)),
                        ),
                        child: Text(
                          stg['stage']!,
                          style: const TextStyle(
                            color: Color(0xFFA7F3D0),
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const Icon(Icons.arrow_downward, color: Color(0xFF38BDF8), size: 16),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    stg['name']!,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text('Inputs: ${stg['sources']}', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                  const SizedBox(height: 4),
                  Text('Output: ${stg['output']}', style: const TextStyle(color: Color(0xFF38BDF8), fontSize: 12, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }
}

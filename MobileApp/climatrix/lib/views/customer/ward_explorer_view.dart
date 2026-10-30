import 'package:flutter/material.dart';
import '../../core/theme/glassmorphism_theme.dart';
import '../../models/ward_model.dart';

class WardExplorerView extends StatelessWidget {
  final List<WardModel> wards;
  final Function(WardModel) onSelectWard;

  const WardExplorerView({
    super.key,
    required this.wards,
    required this.onSelectWard,
  });

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Header
        const Text(
          'Municipal Ward Data Matrix Explorer',
          style: TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Comprehensive Jalandhar 80-Ward Microclimate Diagnostics (30m Landsat LST & Sentinel NDVI)',
          style: TextStyle(
            color: Colors.white.withValues(alpha: 0.7),
            fontSize: 12,
          ),
        ),
        const SizedBox(height: 20),

        // Wards Table / Cards
        ...wards.map((w) {
          final ha = w.heatAnalysis;
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            child: GlassCard(
              borderRadius: 20,
              padding: const EdgeInsets.all(16),
              opacity: 0.15,
              border: Border.all(
                color: w.isLicensed
                    ? const Color(0xFF10B981).withValues(alpha: 0.3)
                    : const Color(0xFFEF4444).withValues(alpha: 0.3),
              ),
              onTap: () => onSelectWard(w),
              child: Column(
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
                              w.name,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            Text(
                              '${w.code} • Area: ${w.areaSqkm} km² • Density: ${w.populationDensity} / sq.km',
                              style: const TextStyle(color: Colors.white60, fontSize: 11),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      HeatStatusBadge(status: ha?.hotspotSeverity ?? 'MODERATE'),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    w.description,
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.8),
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(height: 14),

                  if (ha != null) ...[
                    Row(
                      children: [
                        Expanded(
                          child: MetricBadge(
                            label: 'Mean LST',
                            value: '${ha.meanLstCelsius ?? 42.0}°',
                            unit: 'C',
                            icon: Icons.thermostat,
                            accentColor: const Color(0xFFEF4444),
                          ),
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: MetricBadge(
                            label: 'UHI Delta',
                            value: '+${ha.heatIslandIntensity}°',
                            unit: 'C',
                            icon: Icons.local_fire_department,
                            accentColor: const Color(0xFFF59E0B),
                          ),
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: MetricBadge(
                            label: 'NDVI Veg',
                            value: '${ha.meanNdvi ?? 0.15}',
                            icon: Icons.eco,
                            accentColor: const Color(0xFF10B981),
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          );
        }),
      ],
    );
  }
}

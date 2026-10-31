import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/glassmorphism_theme.dart';
import '../../providers/species_provider.dart';

class TreePlannerView extends StatefulWidget {
  const TreePlannerView({super.key});

  @override
  State<TreePlannerView> createState() => _TreePlannerViewState();
}

class _TreePlannerViewState extends State<TreePlannerView> {
  String _siteType = 'ROADSIDE_STRIP';
  double _siteAreaSqm = 150.0;
  String _pavingType = 'UNPAVED_SOIL';
  double _subterraneanUtilityDepthM = 2.5;
  double _overheadClearanceM = 6.0;
  double _waterDistanceM = 35.0;

  int _calculateTreeCapacity() {
    double areaPerTree = 25.0; // default 5m x 5m spacing
    if (_siteType == 'RESIDENTIAL_STREET') areaPerTree = 16.0;
    if (_siteType == 'INDUSTRIAL_BUFFER') areaPerTree = 30.0;
    if (_siteType == 'PUBLIC_PARK') areaPerTree = 36.0;

    int count = (_siteAreaSqm / areaPerTree).floor();
    return count < 1 ? 1 : count;
  }

  double _calculateCanopyCoverageSqm() {
    int capacity = _calculateTreeCapacity();
    double radius = 3.5;
    return min(_siteAreaSqm, capacity * pi * radius * radius);
  }

  double _calculateCarbonSequestrationKgYr() {
    return _calculateTreeCapacity() * 22.5;
  }

  double _calculateCoolingImpactCelsius() {
    double ratio = min(1.0, _calculateCanopyCoverageSqm() / max(1.0, _siteAreaSqm));
    return double.parse((2.5 + (ratio * 4.3)).toStringAsFixed(1));
  }

  String _getFeasibilityStatus() {
    if (_pavingType == 'SEALED_ASPHALT' && _subterraneanUtilityDepthM < 1.5) {
      return 'UNSUITABLE GROUND PLANTATION';
    }
    if (_pavingType == 'SEALED_ASPHALT' || _subterraneanUtilityDepthM < 2.5 || _overheadClearanceM < 4.0) {
      return 'CONDITIONALLY SUITABLE';
    }
    return 'SUITABLE';
  }

  Color _getVerdictColor(String verdict) {
    if (verdict == 'SUITABLE') return const Color(0xFF10B981);
    if (verdict == 'CONDITIONALLY SUITABLE') return const Color(0xFFF59E0B);
    return const Color(0xFFEF4444);
  }

  @override
  Widget build(BuildContext context) {
    final speciesProvider = Provider.of<SpeciesProvider>(context);

    final capacity = _calculateTreeCapacity();
    final canopySqm = _calculateCanopyCoverageSqm();
    final carbonKg = _calculateCarbonSequestrationKgYr();
    final coolingC = _calculateCoolingImpactCelsius();
    final verdict = _getFeasibilityStatus();
    final verdictColor = _getVerdictColor(verdict);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Header Bar
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withValues(alpha: 0.25),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFF10B981)),
              ),
              child: const Icon(Icons.nature_people_rounded, color: Color(0xFF10B981), size: 24),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Tree Plantation Feasibility Planner',
                    style: GoogleFonts.inter(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    'Micro-Site Density Simulator & Carbon Sink Projections',
                    style: GoogleFonts.jetBrainsMono(
                      color: const Color(0xFF38BDF8),
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 18),

        // Verdict Badge
        GlassCard(
          borderRadius: 20,
          padding: const EdgeInsets.all(16),
          opacity: 0.85,
          border: Border.all(color: verdictColor, width: 1.5),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Feasibility Verdict:',
                      style: GoogleFonts.inter(color: Colors.white70, fontSize: 11),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      verdict,
                      style: GoogleFonts.inter(
                        color: verdictColor,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
              Icon(
                verdict == 'SUITABLE'
                    ? Icons.check_circle
                    : verdict == 'CONDITIONALLY SUITABLE'
                        ? Icons.warning_amber_rounded
                        : Icons.cancel,
                color: verdictColor,
                size: 28,
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),

        // Parameter Config Card
        GlassCard(
          borderRadius: 22,
          padding: const EdgeInsets.all(18),
          opacity: 0.75,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Site Configuration Parameters', style: GoogleFonts.inter(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 14),

              Text('Site Typology', style: GoogleFonts.inter(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              DropdownButtonFormField<String>(
                value: _siteType,
                dropdownColor: const Color(0xFF0B101D),
                style: GoogleFonts.inter(color: Colors.white, fontSize: 12),
                decoration: InputDecoration(
                  filled: true,
                  fillColor: Colors.white.withValues(alpha: 0.08),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.2)),
                  ),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                ),
                items: const [
                  DropdownMenuItem(value: 'ROADSIDE_STRIP', child: Text('Roadside Strip / Avenue')),
                  DropdownMenuItem(value: 'PUBLIC_PARK', child: Text('Public Park / Garden')),
                  DropdownMenuItem(value: 'INSTITUTIONAL_CAMPUS', child: Text('Institutional / Academic Campus')),
                  DropdownMenuItem(value: 'INDUSTRIAL_BUFFER', child: Text('Industrial Buffer Belt')),
                  DropdownMenuItem(value: 'RESIDENTIAL_STREET', child: Text('Narrow Residential Alley')),
                ],
                onChanged: (val) {
                  if (val != null) setState(() => _siteType = val);
                },
              ),
              const SizedBox(height: 14),

              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Available Site Area:', style: GoogleFonts.inter(color: Colors.white70, fontSize: 11)),
                  Text('${_siteAreaSqm.toStringAsFixed(0)} sq.m', style: GoogleFonts.jetBrainsMono(color: const Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 12)),
                ],
              ),
              Slider(
                value: _siteAreaSqm,
                min: 10.0,
                max: 2000.0,
                divisions: 100,
                activeColor: const Color(0xFF10B981),
                onChanged: (val) => setState(() => _siteAreaSqm = val),
              ),

              Text('Ground Paving Type', style: GoogleFonts.inter(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              Row(
                children: [
                  _pavingChip('UNPAVED_SOIL', 'Unpaved Soil'),
                  const SizedBox(width: 6),
                  _pavingChip('PERMEABLE_PAVERS', 'Permeable Pavers'),
                  const SizedBox(width: 6),
                  _pavingChip('SEALED_ASPHALT', 'Asphalt / Concrete'),
                ],
              ),
              const SizedBox(height: 14),

              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Subterranean Utility Clearance:', style: GoogleFonts.inter(color: Colors.white70, fontSize: 11)),
                  Text('${_subterraneanUtilityDepthM.toStringAsFixed(1)}m Depth', style: GoogleFonts.jetBrainsMono(color: const Color(0xFF38BDF8), fontWeight: FontWeight.bold, fontSize: 12)),
                ],
              ),
              Slider(
                value: _subterraneanUtilityDepthM,
                min: 0.5,
                max: 5.0,
                divisions: 18,
                activeColor: const Color(0xFF38BDF8),
                onChanged: (val) => setState(() => _subterraneanUtilityDepthM = val),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),

        // Simulated Environmental Impact Card
        GlassCard(
          borderRadius: 22,
          padding: const EdgeInsets.all(18),
          opacity: 0.75,
          border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.35)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Simulated Environmental Impacts', style: GoogleFonts.inter(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 14),

              Row(
                children: [
                  Expanded(
                    child: MetricBadge(
                      label: 'Sapling Capacity',
                      value: '$capacity',
                      unit: 'Trees',
                      icon: Icons.park,
                      accentColor: const Color(0xFF10B981),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: MetricBadge(
                      label: 'Canopy Spread',
                      value: '${canopySqm.toStringAsFixed(0)}',
                      unit: 'sq.m',
                      icon: Icons.nature,
                      accentColor: const Color(0xFF38BDF8),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),

              Row(
                children: [
                  Expanded(
                    child: MetricBadge(
                      label: 'Carbon Sink',
                      value: '${carbonKg.toStringAsFixed(0)}',
                      unit: 'kg/yr',
                      icon: Icons.co2,
                      accentColor: const Color(0xFF34D399),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: MetricBadge(
                      label: 'LST Cooling',
                      value: '-$coolingC°',
                      unit: 'C',
                      icon: Icons.thermostat,
                      accentColor: const Color(0xFF06B6D4),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Recommended Punjab Native Species for this site
        Text('Matched Punjab Native Species Dispatch', style: GoogleFonts.inter(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
        const SizedBox(height: 10),

        GlassCard(
          borderRadius: 20,
          padding: const EdgeInsets.all(16),
          opacity: 0.75,
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('ਨਿੰਮ (Neem - Azadirachta indica)', style: GoogleFonts.inter(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                      Text('Deep taproot protects pavements • Max Heat: 48.5°C', style: GoogleFonts.inter(color: Colors.white70, fontSize: 11)),
                    ],
                  ),
                  Text('96% Match', style: GoogleFonts.jetBrainsMono(color: const Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 12)),
                ],
              ),
              const SizedBox(height: 12),
              GlassButton(
                text: 'Dispatch Plantation Plan to Map',
                icon: Icons.add_location_alt,
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Plantation plan for $capacity Neem trees dispatched to GIS map!'),
                      backgroundColor: const Color(0xFF10B981),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _pavingChip(String key, String label) {
    final isSelected = _pavingType == key;
    return Expanded(
      child: InkWell(
        onTap: () => setState(() => _pavingType = key),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF10B981).withValues(alpha: 0.25) : Colors.white.withValues(alpha: 0.05),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isSelected ? const Color(0xFF10B981) : Colors.white24,
            ),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: GoogleFonts.inter(
              color: isSelected ? Colors.white : Colors.white70,
              fontSize: 10,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ),
      ),
    );
  }
}

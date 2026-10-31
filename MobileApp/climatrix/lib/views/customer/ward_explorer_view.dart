import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/glassmorphism_theme.dart';
import '../../core/services/api_service.dart';
import '../../models/ward_model.dart';

class WardExplorerView extends StatefulWidget {
  final List<WardModel> wards;
  final Function(WardModel) onSelectWard;

  const WardExplorerView({
    super.key,
    required this.wards,
    required this.onSelectWard,
  });

  @override
  State<WardExplorerView> createState() => _WardExplorerViewState();
}

class _WardExplorerViewState extends State<WardExplorerView> {
  final ApiService _apiService = ApiService();
  final _searchController = TextEditingController();
  List<Map<String, dynamic>> _searchResults = [];
  bool _isSearching = false;

  Future<void> _performSearch(String query) async {
    if (query.trim().isEmpty) {
      setState(() {
        _searchResults.clear();
        _isSearching = false;
      });
      return;
    }

    setState(() => _isSearching = true);
    final results = await _apiService.searchAddress(query);
    if (mounted) {
      setState(() {
        _searchResults = results;
        _isSearching = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Header
        Text(
          'Municipal Ward Data Matrix Explorer',
          style: GoogleFonts.inter(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Comprehensive Jalandhar 80-Ward Microclimate Diagnostics (30m Landsat LST & Sentinel NDVI)',
          style: GoogleFonts.inter(
            color: Colors.white.withValues(alpha: 0.7),
            fontSize: 12,
          ),
        ),
        const SizedBox(height: 16),

        // OpenStreetMap Nominatim Address Search Bar
        GlassCard(
          borderRadius: 18,
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
          opacity: 0.75,
          child: Row(
            children: [
              const Icon(Icons.search, color: Color(0xFF10B981), size: 20),
              const SizedBox(width: 8),
              Expanded(
                child: TextField(
                  controller: _searchController,
                  style: GoogleFonts.inter(color: Colors.white, fontSize: 13),
                  decoration: const InputDecoration(
                    hintText: 'Search landmark (e.g. Rainak Bazaar, Model Town)...',
                    hintStyle: TextStyle(color: Colors.white54, fontSize: 12),
                    border: InputBorder.none,
                  ),
                  onSubmitted: _performSearch,
                ),
              ),
              if (_isSearching)
                const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF10B981)),
                )
              else
                IconButton(
                  icon: const Icon(Icons.arrow_forward_rounded, color: Color(0xFF10B981), size: 18),
                  onPressed: () => _performSearch(_searchController.text),
                ),
            ],
          ),
        ),
        const SizedBox(height: 12),

        // Search Results List
        if (_searchResults.isNotEmpty) ...[
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF0B101D),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF38BDF8).withValues(alpha: 0.4)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('OpenStreetMap Nominatim Geocoding Matches:', style: GoogleFonts.inter(color: const Color(0xFF38BDF8), fontWeight: FontWeight.bold, fontSize: 11)),
                const SizedBox(height: 8),
                ..._searchResults.map((res) {
                  return ListTile(
                    contentPadding: EdgeInsets.zero,
                    dense: true,
                    leading: const Icon(Icons.place, color: Color(0xFF10B981), size: 18),
                    title: Text(res['display_name'] ?? '', style: GoogleFonts.inter(color: Colors.white, fontSize: 12)),
                    subtitle: Text('Lat: ${res['lat']}, Lng: ${res['lon']}', style: GoogleFonts.jetBrainsMono(color: Colors.white54, fontSize: 10)),
                  );
                }),
              ],
            ),
          ),
          const SizedBox(height: 16),
        ],

        // Wards Data Matrix Cards
        ...widget.wards.map((w) {
          final ha = w.heatAnalysis;
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            child: GlassCard(
              borderRadius: 20,
              padding: const EdgeInsets.all(16),
              opacity: 0.75,
              border: Border.all(
                color: w.isLicensed
                    ? const Color(0xFF10B981).withValues(alpha: 0.35)
                    : const Color(0xFFEF4444).withValues(alpha: 0.35),
              ),
              onTap: () => widget.onSelectWard(w),
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
                              style: GoogleFonts.inter(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            Text(
                              '${w.code} • Area: ${w.areaSqkm} km² • Density: ${w.populationDensity} / sq.km',
                              style: GoogleFonts.jetBrainsMono(color: Colors.white60, fontSize: 11),
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
                    style: GoogleFonts.inter(
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

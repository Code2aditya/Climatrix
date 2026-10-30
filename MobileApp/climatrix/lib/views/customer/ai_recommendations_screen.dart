import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/glassmorphism_theme.dart';
import '../../providers/species_provider.dart';

class AiRecommendationsScreen extends StatefulWidget {
  const AiRecommendationsScreen({super.key});

  @override
  State<AiRecommendationsScreen> createState() => _AiRecommendationsScreenState();
}

class _AiRecommendationsScreenState extends State<AiRecommendationsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final double _roadWidth = 6.0;
  final double _groundwaterDepth = 20.0;
  final String _siteType = "ROADSIDE_STRIP";

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      final species = Provider.of<SpeciesProvider>(context, listen: false);
      species.fetchSpeciesCatalog();
      species.evaluateRecommendations(
        roadWidthMeters: _roadWidth,
        groundwaterDepthMeters: _groundwaterDepth,
        siteType: _siteType,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final speciesProvider = Provider.of<SpeciesProvider>(context);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: GlassmorphismTheme.spaceBackgroundGradient,
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Header & Tab Bar
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'AI Climate Intervention Engine',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Punjab Native Species Matcher & Cool Roof Recommendations',
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.7),
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 16),
                    TabBar(
                      controller: _tabController,
                      indicatorColor: const Color(0xFF10B981),
                      labelColor: const Color(0xFF10B981),
                      unselectedLabelColor: Colors.white60,
                      tabs: const [
                        Tab(text: 'Native Species AI'),
                        Tab(text: 'Alternative Cooling'),
                      ],
                    ),
                  ],
                ),
              ),

              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    // Native Species Tab
                    speciesProvider.isLoading
                        ? const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)))
                        : ListView.builder(
                            padding: const EdgeInsets.all(16),
                            itemCount: speciesProvider.speciesCatalog.length,
                            itemBuilder: (context, index) {
                              final sp = speciesProvider.speciesCatalog[index];
                              return Container(
                                margin: const EdgeInsets.only(bottom: 12),
                                child: GlassCard(
                                  borderRadius: 20,
                                  padding: const EdgeInsets.all(16),
                                  opacity: 0.15,
                                  border: Border.all(
                                    color: const Color(0xFF10B981).withValues(alpha: 0.3),
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                sp.commonNamePunjabi,
                                                style: const TextStyle(
                                                  color: Colors.white,
                                                  fontSize: 18,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                              Text(
                                                sp.botanicalName,
                                                style: const TextStyle(
                                                  color: Color(0xFF38BDF8),
                                                  fontSize: 13,
                                                  fontStyle: FontStyle.italic,
                                                ),
                                              ),
                                            ],
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                            decoration: BoxDecoration(
                                              color: const Color(0xFF10B981).withValues(alpha: 0.2),
                                              borderRadius: BorderRadius.circular(10),
                                              border: Border.all(color: const Color(0xFF10B981)),
                                            ),
                                            child: Text(
                                              'Heat Max: ${sp.heatToleranceMaxCelsius}°C',
                                              style: const TextStyle(
                                                color: Color(0xFFA7F3D0),
                                                fontWeight: FontWeight.bold,
                                                fontSize: 11,
                                              ),
                                            ),
                                          )
                                        ],
                                      ),
                                      const SizedBox(height: 12),
                                      Text(
                                        sp.description,
                                        style: TextStyle(
                                          color: Colors.white.withValues(alpha: 0.8),
                                          fontSize: 13,
                                        ),
                                      ),
                                      const SizedBox(height: 12),
                                      Row(
                                        children: [
                                          _chip('Drought: ${sp.droughtToleranceRating}/5', Icons.water_drop_outlined),
                                          const SizedBox(width: 8),
                                          _chip('Canopy: ${sp.matureCanopyRadiusM}m', Icons.nature),
                                          const SizedBox(width: 8),
                                          _chip('APTI Index: ${sp.airPollutionToleranceIndex}', Icons.air),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),

                    // Alternative Cooling Tab
                    ListView(
                      padding: const EdgeInsets.all(16),
                      children: [
                        _coolingCard(
                          title: 'High-Albedo Cool Roofs (SRI > 82)',
                          target: 'Dense Commercial Bazaars (e.g., Rainak Bazaar)',
                          cooling: '-6.5°C Surface Drop',
                          cost: '₹450 / sq.m',
                          rationale: 'Ideal for unplantable high-density commercial strips where street width is < 4 meters.',
                          icon: Icons.roofing_rounded,
                        ),
                        _coolingCard(
                          title: 'Vertical Living Walls',
                          target: 'Municipal Building Facades',
                          cooling: '-4.2°C Surface Drop',
                          cost: '₹1,200 / sq.m',
                          rationale: 'Provides acoustic insulation and microclimate shading on vertical brick walls.',
                          icon: Icons.grass_rounded,
                        ),
                        _coolingCard(
                          title: 'Tensile Shade Canopies & Misting',
                          target: 'Bus Stops & Pedestrian Plazas',
                          cooling: '-8.0°C Felt Heat Drop',
                          cost: '₹850 / sq.m',
                          rationale: 'Provides immediate relief for transit commuters against direct solar radiation.',
                          icon: Icons.umbrella_rounded,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _chip(String label, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: const Color(0xFF10B981)),
          const SizedBox(width: 4),
          Text(label, style: const TextStyle(color: Colors.white70, fontSize: 11)),
        ],
      ),
    );
  }

  Widget _coolingCard({
    required String title,
    required String target,
    required String cooling,
    required String cost,
    required String rationale,
    required IconData icon,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: GlassCard(
        borderRadius: 20,
        padding: const EdgeInsets.all(16),
        opacity: 0.15,
        border: Border.all(color: const Color(0xFF38BDF8).withValues(alpha: 0.3)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: const Color(0xFF38BDF8), size: 28),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        target,
                        style: const TextStyle(color: Colors.white60, fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(rationale, style: TextStyle(color: Colors.white.withValues(alpha: 0.8), fontSize: 13)),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Expected Impact: $cooling', style: const TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 12)),
                Text('Cost: $cost', style: const TextStyle(color: Color(0xFFFBBF24), fontWeight: FontWeight.bold, fontSize: 12)),
              ],
            )
          ],
        ),
      ),
    );
  }
}

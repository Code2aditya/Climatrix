import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/glassmorphism_theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/climate_provider.dart';
import '../../providers/language_provider.dart';
import '../../widgets/glass_bottom_nav_bar.dart';
import 'interactive_gis_map_screen.dart';
import 'ai_recommendations_screen.dart';
import 'reports_screen.dart';
import 'ward_explorer_view.dart';
import 'llm_decision_view.dart';
import 'tree_planner_view.dart';
import '../common/workflow_visualizer_view.dart';
import '../common/settings_screen.dart';

class CustomerDashboardScreen extends StatefulWidget {
  const CustomerDashboardScreen({super.key});

  @override
  State<CustomerDashboardScreen> createState() => _CustomerDashboardScreenState();
}

class _CustomerDashboardScreenState extends State<CustomerDashboardScreen> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      final climate = Provider.of<ClimateProvider>(context, listen: false);
      climate.fetchDashboardData(auth.selectedTenant?.id ?? 'org-jalandhar-mc');
    });
  }

  void _openModuleMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (_) {
        return GlassCard(
          borderRadius: 24,
          padding: const EdgeInsets.all(20),
          opacity: 0.95,
          child: SafeArea(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Climatrix All Modules & Tools',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.white70),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                GridView.count(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisCount: 2,
                  childAspectRatio: 1.6,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  children: [
                    _menuTile(
                      title: 'Tree Plantation Planner',
                      subtitle: 'Density & Carbon Simulator',
                      icon: Icons.nature_people_rounded,
                      color: const Color(0xFF10B981),
                      onTap: () {
                        Navigator.pop(context);
                        setState(() => _currentIndex = 7);
                      },
                    ),
                    _menuTile(
                      title: 'Ward Data Matrix',
                      subtitle: '80 Ward Diagnostics',
                      icon: Icons.layers_rounded,
                      color: const Color(0xFF38BDF8),
                      onTap: () {
                        Navigator.pop(context);
                        setState(() => _currentIndex = 2);
                      },
                    ),
                    _menuTile(
                      title: 'AI LLM Advisor',
                      subtitle: 'Cognitive Reasoning',
                      icon: Icons.psychology_rounded,
                      color: const Color(0xFFA855F7),
                      onTap: () {
                        Navigator.pop(context);
                        setState(() => _currentIndex = 3);
                      },
                    ),
                    _menuTile(
                      title: 'Pipeline Flow',
                      subtitle: '5-Stage Data Visualizer',
                      icon: Icons.account_tree_rounded,
                      color: const Color(0xFF06B6D4),
                      onTap: () {
                        Navigator.pop(context);
                        setState(() => _currentIndex = 4);
                      },
                    ),
                    _menuTile(
                      title: 'Species Matcher',
                      subtitle: 'Punjab Native Trees',
                      icon: Icons.eco_rounded,
                      color: const Color(0xFF34D399),
                      onTap: () {
                        Navigator.pop(context);
                        setState(() => _currentIndex = 5);
                      },
                    ),
                    _menuTile(
                      title: 'Reports & Licensing',
                      subtitle: 'PDFs & Subscriptions',
                      icon: Icons.description_rounded,
                      color: const Color(0xFFF59E0B),
                      onTap: () {
                        Navigator.pop(context);
                        setState(() => _currentIndex = 6);
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _menuTile({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GlassCard(
      borderRadius: 16,
      padding: const EdgeInsets.all(12),
      opacity: 0.15,
      border: Border.all(color: color.withValues(alpha: 0.4)),
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: 20),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: const TextStyle(color: Colors.white60, fontSize: 10),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final climate = Provider.of<ClimateProvider>(context);

    final List<Widget> pages = [
      const _DashboardHomeTab(),
      const InteractiveGisMapScreen(),
      WardExplorerView(
        wards: climate.wards,
        onSelectWard: (w) {
          setState(() => _currentIndex = 1); // Switch to GIS map on select
        },
      ),
      const LlmDecisionView(),
      const WorkflowVisualizerView(),
      const AiRecommendationsScreen(),
      const ReportsScreen(),
      const TreePlannerView(),
    ];

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: GlassmorphismTheme.spaceBackgroundGradient,
        ),
        child: SafeArea(
          child: pages[_currentIndex],
        ),
      ),
      bottomNavigationBar: GlassBottomNavBar(
        currentIndex: _currentIndex > 3 ? 3 : _currentIndex,
        onTap: (idx) {
          if (idx == 3) {
            _openModuleMenu(context);
          } else {
            setState(() => _currentIndex = idx);
          }
        },
        items: const [
          GlassBottomNavItem(icon: Icons.dashboard_rounded, label: 'Overview'),
          GlassBottomNavItem(icon: Icons.map_rounded, label: 'GIS Map'),
          GlassBottomNavItem(icon: Icons.psychology_rounded, label: 'AI Advisor'),
          GlassBottomNavItem(icon: Icons.grid_view_rounded, label: 'All Modules'),
        ],
      ),
    );
  }
}

class _DashboardHomeTab extends StatelessWidget {
  const _DashboardHomeTab();

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final climate = Provider.of<ClimateProvider>(context);

    return RefreshIndicator(
      onRefresh: () async {
        await climate.fetchDashboardData(auth.selectedTenant?.id ?? 'org-jalandhar-mc');
      },
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // App Bar Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      auth.selectedTenant?.name ?? 'Jalandhar Municipal Corp',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        const Icon(Icons.location_on, color: Color(0xFF10B981), size: 14),
                        const SizedBox(width: 4),
                        Text(
                          'Pilot Region: ${climate.pilotInfo?.city ?? "Jalandhar"}, Punjab',
                          style: const TextStyle(color: Colors.white70, fontSize: 12),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: GlassCard(
                  borderRadius: 12,
                  padding: const EdgeInsets.all(8),
                  opacity: 0.2,
                  child: const Icon(Icons.settings, color: Colors.white, size: 20),
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const SettingsScreen()),
                  );
                },
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Realtime Weather Card
          if (climate.weather != null)
            GlassCard(
              borderRadius: 20,
              padding: const EdgeInsets.all(18),
              opacity: 0.16,
              border: Border.all(
                color: const Color(0xFF10B981).withValues(alpha: 0.35),
                width: 1.5,
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.wb_sunny_rounded, color: Color(0xFFF59E0B), size: 28),
                          const SizedBox(width: 10),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Live Meteorological Feed',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15,
                                ),
                              ),
                              Text(
                                climate.weather!.status,
                                style: const TextStyle(
                                  color: Color(0xFF10B981),
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          )
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFEF4444).withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: const Color(0xFFEF4444)),
                        ),
                        child: Text(
                          'Heat Index: ${climate.weather!.heatIndexCelsius}°C',
                          style: const TextStyle(
                            color: Color(0xFFFCA5A5),
                            fontWeight: FontWeight.bold,
                            fontSize: 11,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _metricCol('Ambient Air', '${climate.weather!.ambientTemperatureCelsius}°C', Icons.thermostat),
                      _metricCol('Wind Speed', '${climate.weather!.windSpeedKmh} km/h', Icons.air),
                      _metricCol('Humidity', '${climate.weather!.relativeHumidityPct}%', Icons.water_drop),
                    ],
                  ),
                ],
              ),
            ),
          const SizedBox(height: 20),

          // Ward Microclimate Overview
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Licensed Ward Diagnostics',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                '${climate.wards.length} Wards Active',
                style: const TextStyle(color: Color(0xFF38BDF8), fontSize: 12),
              ),
            ],
          ),
          const SizedBox(height: 12),

          if (climate.isLoading)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(24.0),
                child: CircularProgressIndicator(color: Color(0xFF10B981)),
              ),
            )
          else
            Column(
              children: climate.wards.map((ward) {
                final ha = ward.heatAnalysis;
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: GlassCard(
                    borderRadius: 18,
                    padding: const EdgeInsets.all(16),
                    opacity: 0.14,
                    border: Border.all(
                      color: ward.isLicensed
                          ? Colors.white.withValues(alpha: 0.2)
                          : const Color(0xFFEF4444).withValues(alpha: 0.4),
                    ),
                    onTap: () async {
                      await climate.attemptAccessWard(ward, auth.selectedTenant?.id ?? 'org-jalandhar-mc');
                      if (climate.abacErrorMessage != null && context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(climate.abacErrorMessage!),
                            backgroundColor: const Color(0xFF991B1B),
                          ),
                        );
                      }
                    },
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    ward.name,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 15,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    'Code: ${ward.code} • ${ward.areaSqkm} km²',
                                    style: const TextStyle(color: Colors.white60, fontSize: 11),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            if (ha != null)
                              HeatStatusBadge(status: ha.hotspotSeverity)
                            else
                              const HeatStatusBadge(status: 'MODERATE'),
                          ],
                        ),
                        const SizedBox(height: 12),
                        if (ha != null) ...[
                          Row(
                            children: [
                              Expanded(
                                child: MetricBadge(
                                  label: 'Land Surface Temp',
                                  value: '${ha.meanLstCelsius ?? 42.0}°',
                                  unit: 'C',
                                  icon: Icons.thermostat,
                                  accentColor: const Color(0xFFEF4444),
                                ),
                              ),
                              const SizedBox(width: 6),
                              Expanded(
                                child: MetricBadge(
                                  label: 'NDVI Vegetation',
                                  value: '${ha.meanNdvi ?? 0.15}',
                                  icon: Icons.eco,
                                  accentColor: const Color(0xFF10B981),
                                ),
                              ),
                              const SizedBox(width: 6),
                              Expanded(
                                child: MetricBadge(
                                  label: 'NDBI Built-Up',
                                  value: '${ha.meanNdbi ?? 0.38}',
                                  icon: Icons.location_city,
                                  accentColor: const Color(0xFF38BDF8),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
        ],
      ),
    );
  }

  static Widget _metricCol(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: const Color(0xFF38BDF8), size: 20),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 15,
          ),
        ),
        Text(
          label,
          style: TextStyle(color: Colors.white.withValues(alpha: 0.6), fontSize: 11),
        ),
      ],
    );
  }
}

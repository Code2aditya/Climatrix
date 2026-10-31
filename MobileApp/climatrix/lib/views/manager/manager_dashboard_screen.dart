import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/glassmorphism_theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/climate_provider.dart';
import '../../providers/tree_provider.dart';
import '../common/settings_screen.dart';

class ManagerDashboardScreen extends StatefulWidget {
  const ManagerDashboardScreen({super.key});

  @override
  State<ManagerDashboardScreen> createState() => _ManagerDashboardScreenState();
}

class _ManagerDashboardScreenState extends State<ManagerDashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      final orgId = auth.selectedTenant?.id ?? 'org-jalandhar-mc';
      Provider.of<ClimateProvider>(context, listen: false).fetchDashboardData(orgId);
      Provider.of<TreeProvider>(context, listen: false).fetchTrees(orgId);
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final climate = Provider.of<ClimateProvider>(context);
    final tree = Provider.of<TreeProvider>(context);

    final thrivingCount = tree.trees.where((t) => t.status == 'THRIVING').length;
    final criticalCount = tree.trees.where((t) => t.status == 'CRITICAL' || t.status == 'DISTRESSED').length;
    final survivalRate = tree.trees.isNotEmpty ? ((thrivingCount / tree.trees.length) * 100).round() : 94;

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: GlassmorphismTheme.spaceBackgroundGradient,
        ),
        child: SafeArea(
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Header Bar
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Executive Manager Portal',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Text(
                          'Tenant: ${auth.selectedTenant?.name ?? "Jalandhar Municipal Corp"}',
                          style: const TextStyle(color: Color(0xFF10B981), fontSize: 12),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
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

              // KPI Summary Cards
              Row(
                children: [
                  Expanded(
                    child: MetricBadge(
                      label: 'Sapling Survival Rate',
                      value: '$survivalRate%',
                      icon: Icons.trending_up,
                      accentColor: const Color(0xFF10B981),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: MetricBadge(
                      label: 'Monitored Trees',
                      value: '${tree.trees.length}',
                      icon: Icons.park,
                      accentColor: const Color(0xFF38BDF8),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),

              Row(
                children: [
                  Expanded(
                    child: MetricBadge(
                      label: 'Thriving Saplings',
                      value: '$thrivingCount',
                      icon: Icons.eco,
                      accentColor: const Color(0xFF10B981),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: MetricBadge(
                      label: 'Requires Attention',
                      value: '$criticalCount',
                      icon: Icons.warning_amber,
                      accentColor: const Color(0xFFEF4444),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Executive Wards Summary
              const Text(
                'Organisation Ward Licensing Overview',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),

              Column(
                children: climate.wards.map((ward) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: GlassCard(
                      borderRadius: 18,
                      padding: const EdgeInsets.all(16),
                      opacity: 0.15,
                      child: Row(
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
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Population Density: ${ward.populationDensity} / sq.km',
                                  style: const TextStyle(color: Colors.white60, fontSize: 12),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: ward.isLicensed
                                  ? const Color(0xFF10B981).withValues(alpha: 0.2)
                                  : const Color(0xFFEF4444).withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(
                                color: ward.isLicensed ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                              ),
                            ),
                            child: Text(
                              ward.isLicensed ? 'LICENSED' : 'UNLICENSED',
                              style: TextStyle(
                                color: ward.isLicensed ? const Color(0xFFA7F3D0) : const Color(0xFFFCA5A5),
                                fontWeight: FontWeight.bold,
                                fontSize: 11,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
